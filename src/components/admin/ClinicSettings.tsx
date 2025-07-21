import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Save, MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import ImageManager from './ImageManager';

interface ClinicSetting {
  setting_key: string;
  setting_value: string;
}

const ClinicSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap = data.reduce((acc: Record<string, string>, item: ClinicSetting) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {});

      setSettings(settingsMap);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load clinic settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('clinic_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error: any) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update all settings
      await Promise.all(
        Object.entries(settings).map(([key, value]) => updateSetting(key, value))
      );
      
      toast.success('Clinic settings updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading clinic settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Clinic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinic_name_en">Clinic Name (English)</Label>
              <Input
                id="clinic_name_en"
                value={settings.clinic_name_en || ''}
                onChange={(e) => handleInputChange('clinic_name_en', e.target.value)}
                placeholder="Enter clinic name in English"
              />
            </div>
            <div>
              <Label htmlFor="clinic_name_ar">Clinic Name (Arabic)</Label>
              <Input
                id="clinic_name_ar"
                value={settings.clinic_name_ar || ''}
                onChange={(e) => handleInputChange('clinic_name_ar', e.target.value)}
                placeholder="أدخل اسم العيادة بالعربية"
                dir="rtl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={settings.phone_number || ''}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              placeholder="Enter phone number"
              dir="ltr"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter clinic address"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="location_url">Google Maps URL</Label>
            <Input
              id="location_url"
              value={settings.location_url || ''}
              onChange={(e) => handleInputChange('location_url', e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="working_hours_en">Working Hours (English)</Label>
            <Input
              id="working_hours_en"
              value={settings.working_hours_en || ''}
              onChange={(e) => handleInputChange('working_hours_en', e.target.value)}
              placeholder="e.g., Sat-Thu: 12:00 PM - 9:00 PM"
            />
          </div>
          <div>
            <Label htmlFor="working_hours_ar">Working Hours (Arabic)</Label>
            <Input
              id="working_hours_ar"
              value={settings.working_hours_ar || ''}
              onChange={(e) => handleInputChange('working_hours_ar', e.target.value)}
              placeholder="مثال: السبت-الخميس: 12:00 ظهراً - 9:00 مساءً"
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      <ImageManager 
        settings={settings}
        onSettingChange={handleInputChange}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default ClinicSettings;