
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
      await fetchAppointments(); // Refresh the list
    } catch (error: any) {
      console.error('Error processing appointment:', error);
      toast.error(`Failed to ${action} appointment`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock },
      confirmed: { variant: 'default' as const, icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, icon: XCircle },
      completed: { variant: 'outline' as const, icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl shadow-lg">
            <img 
              src="/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png" 
              alt="SAFA Dental Center Logo" 
              className="w-6 h-6 object-contain filter brightness-0 invert"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">SAFA Dental Center</h1>
            <p className="text-slate-600">Admin Dashboard</p>
          </div>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span 
              className="text-sm cursor-pointer text-sky-600 hover:text-sky-800 underline"
              onClick={openInGoogleMaps}
            >
              {clinicAddress}
            </span>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.patient_name}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{appointment.patient_email}</div>
                      <div className="text-muted-foreground">{appointment.patient_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">{appointment.appointment_time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(appointment.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {appointment.email_sent && (
                        <Badge variant="outline" className="text-xs">Email ✓</Badge>
                      )}
                      {appointment.sms_sent && (
                        <Badge variant="outline" className="text-xs">SMS ✓</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {appointment.message || 'No message'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                            disabled={processingId === appointment.id}
                            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                          >
                            {processingId === appointment.id ? 'Processing...' : 'Confirm'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                            disabled={processingId === appointment.id}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                          disabled={processingId === appointment.id}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
