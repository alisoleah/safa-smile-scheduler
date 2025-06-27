
import { Button } from '@/components/ui/button';

interface AppointmentActionsProps {
  appointmentId: string;
  status: string;
  processingId: string | null;
  onAction: (appointmentId: string, action: 'confirm' | 'cancel') => void;
}

const AppointmentActions = ({ 
  appointmentId, 
  status, 
  processingId, 
  onAction 
}: AppointmentActionsProps) => {
  const isProcessing = processingId === appointmentId;

  return (
    <div className="flex gap-2">
      {status === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() => onAction(appointmentId, 'confirm')}
            disabled={isProcessing}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onAction(appointmentId, 'cancel')}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </>
      )}
      {status === 'confirmed' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(appointmentId, 'cancel')}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default AppointmentActions;
