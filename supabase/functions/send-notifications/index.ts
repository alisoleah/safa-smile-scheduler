
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

interface NotificationRequest {
  appointmentId: string;
  action: 'confirm' | 'cancel';
}

// Function to format Egyptian phone numbers for Twilio
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 01 (Egyptian mobile), format it properly
  if (cleaned.startsWith('01') && cleaned.length === 11) {
    return `+2${cleaned}`;
  }
  
  // If it already has country code
  if (cleaned.startsWith('201') && cleaned.length === 13) {
    return `+${cleaned}`;
  }
  
  // Default fallback - add Egypt country code
  return `+20${cleaned}`;
};

// Function to validate Twilio credentials
const validateTwilioCredentials = (): boolean => {
  const requiredVars = {
    TWILIO_ACCOUNT_SID: twilioAccountSid,
    TWILIO_AUTH_TOKEN: twilioAuthToken,
    TWILIO_PHONE_NUMBER: twilioPhoneNumber
  };

  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.error(`Missing required environment variable: ${name}`);
      return false;
    }
  }

  // Basic format validation
  if (!twilioAccountSid.startsWith('AC') || twilioAccountSid.length !== 34) {
    console.error('Invalid TWILIO_ACCOUNT_SID format');
    return false;
  }

  if (twilioAuthToken.length !== 32) {
    console.error('Invalid TWILIO_AUTH_TOKEN format');
    return false;
  }

  return true;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, action }: NotificationRequest = await req.json();
    console.log(`Processing ${action} for appointment ${appointmentId}`);

    // Validate Twilio credentials first
    if (!validateTwilioCredentials()) {
      throw new Error('Invalid Twilio configuration');
    }

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error('Appointment error:', appointmentError);
      throw new Error('Appointment not found');
    }

    console.log('Processing appointment for:', appointment.patient_name);

    const clinicAddress = "33 A Elkasr ELEINI St, Cairo, Egypt";
    const statusText = action === 'confirm' ? 'confirmed' : 'cancelled';
    
    // Send Email
    const emailSubject = `Appointment ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`;
    const emailHtml = `
      <h2>Dear ${appointment.patient_name},</h2>
      <p>Your appointment has been <strong>${statusText}</strong>.</p>
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${appointment.appointment_time}</li>
        ${action === 'confirm' ? `<li><strong>Address:</strong> ${clinicAddress}</li>` : ''}
      </ul>
      ${action === 'confirm' ? 
        `<p>Please arrive 15 minutes early for your appointment.</p>
         <p><a href="https://maps.google.com/?q=${encodeURIComponent(clinicAddress)}" target="_blank">Click here to view location on Google Maps</a></p>` : 
        '<p>If you need to reschedule, please contact us.</p>'
      }
      <p>Best regards,<br>SAFA Dental Center Team</p>
    `;

    const emailResponse = await resend.emails.send({
      from: 'SAFA Dental Center <onboarding@resend.dev>',
      to: [appointment.patient_email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    // Format phone number for Twilio
    const formattedPhone = formatPhoneNumber(appointment.patient_phone);
    console.log('Phone number formatting:');
    console.log('  Original:', appointment.patient_phone);
    console.log('  Formatted:', formattedPhone);

    // Send SMS with enhanced error handling
    const smsMessage = action === 'confirm' 
      ? `Hi ${appointment.patient_name}, your appointment on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time} has been confirmed. Address: ${clinicAddress}. View on maps: https://maps.google.com/?q=${encodeURIComponent(clinicAddress)}`
      : `Hi ${appointment.patient_name}, your appointment on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time} has been cancelled. Please contact us to reschedule.`;

    console.log('SMS Details:');
    console.log('  From:', twilioPhoneNumber);
    console.log('  To:', formattedPhone);
    console.log('  Message length:', smsMessage.length);

    const smsResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: formattedPhone,
        Body: smsMessage,
      }),
    });

    const smsResult = await smsResponse.json();
    
    // Enhanced SMS error logging
    if (!smsResponse.ok) {
      console.error('SMS sending failed:');
      console.error('  Status:', smsResponse.status);
      console.error('  Response:', smsResult);
      
      // Check for specific Twilio error codes
      if (smsResult.code) {
        console.error('  Twilio Error Code:', smsResult.code);
        console.error('  Twilio Error Message:', smsResult.message);
        
        // Common Twilio error codes for Egypt/international SMS
        switch (smsResult.code) {
          case 21408:
            console.error('  → Permission to send SMS has not been enabled for Egypt');
            break;
          case 21211:
            console.error('  → Invalid "To" phone number');
            break;
          case 21212:
            console.error('  → Invalid "From" phone number');
            break;
          case 21601:
            console.error('  → Phone number is not a valid mobile number');
            break;
          case 21614:
            console.error('  → "To" number is not a valid mobile number');
            break;
          default:
            console.error('  → Unknown Twilio error');
        }
      }
    } else {
      console.log('SMS sent successfully:', smsResult);
    }

    // Update appointment status and notification flags
    const updateData = {
      status: statusText,
      email_sent: true,
      // Only mark SMS as sent if it was actually successful
      sms_sent: smsResponse.ok,
      confirmed_at: action === 'confirm' ? new Date().toISOString() : null,
    };

    const { error: updateError } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Error updating appointment:', updateError);
    } else {
      console.log('Appointment updated successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        email: emailResponse,
        sms: smsResult,
        sms_sent: smsResponse.ok,
        phone_formatted: formattedPhone
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error in send-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
