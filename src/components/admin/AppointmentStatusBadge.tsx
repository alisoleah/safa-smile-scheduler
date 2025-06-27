
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AppointmentStatusBadgeProps {
  status: string;
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
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

export default AppointmentStatusBadge;
