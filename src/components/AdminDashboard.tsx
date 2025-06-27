
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import AdminHeader from './admin/AdminHeader';
import AppointmentsTable from './admin/AppointmentsTable';

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

  const clinicAddress = "33 A Elkasr ELEINI St, Cairo, Egypt";

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
      const { data, error } = await supabase.functions.invoke('send-notifications', {
        body: { appointmentId, action }
      });

      if (error) throw error;

      toast.success(`Appointment ${action}ed and notifications sent!`);
      await fetchAppointments();
    } catch (error: any) {
      console.error('Error processing appointment:', error);
      toast.error(`Failed to ${action} appointment`);
    } finally {
      setProcessingId(null);
    }
  };

  const openInGoogleMaps = () => {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(clinicAddress)}`;
    window.open(mapsUrl, '_blank');
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
        clinicAddress={clinicAddress}
        onAddressClick={openInGoogleMaps}
      />

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
    </div>
  );
};

export default AdminDashboard;
