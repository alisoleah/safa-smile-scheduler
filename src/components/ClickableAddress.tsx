
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClickableAddressProps {
  address: string;
  className?: string;
}

const ClickableAddress = ({ address, className = "" }: ClickableAddressProps) => {
  const openInGoogleMaps = () => {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <Button
      variant="ghost"
      onClick={openInGoogleMaps}
      className={`flex items-center gap-2 h-auto p-2 text-left hover:bg-sky-50 ${className}`}
    >
      <MapPin className="w-4 h-4 text-sky-600" />
      <span className="text-sky-600 hover:text-sky-800 underline">
        {address}
      </span>
    </Button>
  );
};

export default ClickableAddress;
