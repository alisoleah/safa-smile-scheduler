import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ImageManagerProps {
  settings: Record<string, string>;
  onSettingChange: (key: string, value: string) => void;
}

const ImageManager = ({ settings, onSettingChange }: ImageManagerProps) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (file: File, settingKey: string) => {
    setUploading(settingKey);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to Lovable's file system
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onSettingChange(settingKey, data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, settingKey);
    }
  };

  const imageSettings = [
    { key: 'logo_path', label: 'Clinic Logo', description: 'Main logo displayed in header and navigation' },
    { key: 'carousel_image_1', label: 'Carousel Image 1', description: 'First image in the hero carousel' },
    { key: 'carousel_image_2', label: 'Carousel Image 2', description: 'Second image in the hero carousel' },
    { key: 'carousel_image_3', label: 'Carousel Image 3', description: 'Third image in the hero carousel' },
    { key: 'expert_image_1', label: 'Dr. Hesham Photo', description: 'Photo for Meet the Experts section' },
    { key: 'expert_image_2', label: 'Expert Photo 2', description: 'Second expert photo (if applicable)' },
    { key: 'expert_image_3', label: 'Expert Photo 3', description: 'Third expert photo (if applicable)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageSettings.map((imageSetting) => (
          <div key={imageSetting.key} className="space-y-3">
            <div>
              <Label htmlFor={imageSetting.key}>{imageSetting.label}</Label>
              <p className="text-sm text-muted-foreground">{imageSetting.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {settings[imageSetting.key] && (
                <div className="flex items-center gap-2">
                  <img 
                    src={settings[imageSetting.key]} 
                    alt={imageSetting.label}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSettingChange(imageSetting.key, '')}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex-1">
                <Input
                  id={imageSetting.key}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, imageSetting.key)}
                  disabled={uploading === imageSetting.key}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {uploading === imageSetting.key && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Uploading...
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor={`${imageSetting.key}_url`}>Or enter image URL:</Label>
              <Input
                id={`${imageSetting.key}_url`}
                value={settings[imageSetting.key] || ''}
                onChange={(e) => onSettingChange(imageSetting.key, e.target.value)}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ImageManager;