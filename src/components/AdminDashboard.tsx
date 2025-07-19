
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AdminHeader from './admin/AdminHeader';
import AppointmentsTable from './admin/AppointmentsTable';
import ClinicSettings from './admin/ClinicSettings';
import { useClinicSettings } from '@/hooks/useClinicSettings';
import { MessageSquare, Send } from 'lucide-react';

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  message: string | null;
  email_sent: boolean;
  sms_sent: boolean;
  confirmed_at: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [testingSMS, setTestingSMS] = useState(false);
  const { settings } = useClinicSettings();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId: string, action: 'confirm' | 'cancel') => {
    setProcessingId(appointmentId);
    
    try {
      console.log(`Invoking send-notifications for appointment ${appointmentId} with action: ${action}`);
      
      const { data, error } = await supabase.functions.invoke('send-notifications', {
        body: { appointmentId, action }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.sms_sent) {
        toast.success(`Appointment ${action}ed! Email and SMS notifications sent successfully.`);
      } else {
        toast.success(`Appointment ${action}ed! Email sent successfully. SMS may have failed - check logs.`);
        console.warn('SMS notification failed. Response:', data);
      }
      
      await fetchAppointments();
    } catch (error: any) {
      console.error('Error processing appointment:', error);
      toast.error(`Failed to ${action} appointment: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const openInGoogleMaps = () => {
    if (settings.location_url) {
      window.open(settings.location_url, '_blank');
    } else {
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const testSMSFunction = async () => {
    setTestingSMS(true);
    try {
      // Create a test appointment entry to test SMS
      const testPhone = '+201234567890'; // Test phone number
      
      const { data, error } = await supabase.functions.invoke('send-notifications', {
        body: { 
          appointmentId: 'test-sms-function',
          action: 'test',
          testMode: true,
          testPhone: testPhone
        }
      });

      console.log('SMS test response:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.sms_sent) {
        toast.success('SMS test completed successfully! Check logs for details.');
      } else {
        toast.error('SMS test failed. Check Edge Function logs for detailed error information.');
      }
    } catch (error: any) {
      console.error('SMS test error:', error);
      toast.error(`SMS test failed: ${error.message}`);
    } finally {
      setTestingSMS(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminHeader 
        clinicAddress={settings.address}
        onAddressClick={openInGoogleMaps}
      />

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="settings">Clinic Settings</TabsTrigger>
          <TabsTrigger value="testing">SMS Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsTable
                appointments={appointments}
                processingId={processingId}
                onAppointmentAction={handleAppointmentAction}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <ClinicSettings />
        </TabsContent>
        
        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SMS Testing & Debugging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">SMS Troubleshooting</h4>
                <p className="text-yellow-700 text-sm">
                  This tool helps test your Twilio SMS configuration. Common issues include:
                </p>
                <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
                  <li>Egypt geo-permissions not enabled in Twilio</li>
                  <li>Invalid phone number format</li>
                  <li>Missing or incorrect Twilio credentials</li>
                  <li>Twilio account balance insufficient</li>
                </ul>
              </div>
              
              <Button 
                onClick={testSMSFunction} 
                disabled={testingSMS}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {testingSMS ? 'Testing SMS...' : 'Test SMS Function'}
              </Button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Check Edge Function Logs</h4>
                <p className="text-blue-700 text-sm">
                  For detailed SMS error information, check the Edge Function logs in your Supabase dashboard.
                  The logs will show specific Twilio error codes and messages.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
