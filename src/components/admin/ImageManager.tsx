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
        <p className="text-sm text-muted-foreground">
          Manage all images displayed on your website. Use image URLs from services like Unsplash, your own hosting, or cloud storage.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageSettings.map((imageSetting) => (
          <div key={imageSetting.key} className="space-y-3 p-4 border rounded-lg">
            <div>
              <Label htmlFor={`${imageSetting.key}_url`} className="text-base font-semibold">
                {imageSetting.label}
              </Label>
              <p className="text-sm text-muted-foreground">{imageSetting.description}</p>
            </div>
            
            {/* Current Image Preview */}
            {settings[imageSetting.key] && (
              <div className="flex items-center gap-3">
                <img 
                  src={settings[imageSetting.key]} 
                  alt={imageSetting.label}
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=200&auto=format&fit=crop';
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Current Image</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {settings[imageSetting.key]}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSettingChange(imageSetting.key, '')}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor={`${imageSetting.key}_url`} className="text-sm">
                Image URL:
              </Label>
              <Input
                id={`${imageSetting.key}_url`}
                value={settings[imageSetting.key] || ''}
                onChange={(e) => onSettingChange(imageSetting.key, e.target.value)}
                placeholder="https://example.com/image.jpg or https://images.unsplash.com/..."
                dir="ltr"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                💡 Tip: Use Unsplash, Pixabay, or upload to your own image hosting service
              </p>
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📸 Image Sources</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Unsplash:</strong> Free high-quality images (copy image address)</li>
            <li>• <strong>Your hosting:</strong> Upload to your website or cloud storage</li>
            <li>• <strong>Existing images:</strong> Use current URLs that are already working</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageManager;