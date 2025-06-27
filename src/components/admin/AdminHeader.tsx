
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AdminHeaderProps {
  clinicAddress: string;
  onAddressClick: () => void;
}

const AdminHeader = ({ clinicAddress, onAddressClick }: AdminHeaderProps) => {
  return (
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
            onClick={onAddressClick}
          >
            {clinicAddress}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default AdminHeader;
