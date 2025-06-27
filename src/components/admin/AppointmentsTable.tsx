
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import AppointmentActions from './AppointmentActions';

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

interface AppointmentsTableProps {
  appointments: Appointment[];
  processingId: string | null;
  onAppointmentAction: (appointmentId: string, action: 'confirm' | 'cancel') => void;
}

const AppointmentsTable = ({ 
  appointments, 
  processingId, 
  onAppointmentAction 
}: AppointmentsTableProps) => {
  return (
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
              <AppointmentStatusBadge status={appointment.status} />
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
              <AppointmentActions
                appointmentId={appointment.id}
                status={appointment.status}
                processingId={processingId}
                onAction={onAppointmentAction}
              />
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
  );
};

export default AppointmentsTable;
