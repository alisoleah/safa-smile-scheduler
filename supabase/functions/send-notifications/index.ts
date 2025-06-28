
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, action }: NotificationRequest = await req.json();

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw new Error('Appointment not found');
    }

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

    console.log('Email sent:', emailResponse);

    // Send SMS
    const smsMessage = action === 'confirm' 
      ? `Hi ${appointment.patient_name}, your appointment on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time} has been confirmed. Address: ${clinicAddress}. View on maps: https://maps.google.com/?q=${encodeURIComponent(clinicAddress)}`
      : `Hi ${appointment.patient_name}, your appointment on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time} has been cancelled. Please contact us to reschedule.`;

    const smsResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: appointment.patient_phone,
        Body: smsMessage,
      }),
    });

    const smsResult = await smsResponse.json();
    console.log('SMS sent:', smsResult);

    // Update appointment status and notification flags
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: statusText,
        email_sent: true,
        sms_sent: true,
        confirmed_at: action === 'confirm' ? new Date().toISOString() : null,
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Error updating appointment:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        email: emailResponse,
        sms: smsResult 
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
