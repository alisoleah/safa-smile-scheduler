import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClinicSettings {
  clinic_name_en: string;
  clinic_name_ar: string;
  phone_number: string;
  email: string;
  address: string;
  location_url: string;
  working_hours_en: string;
  working_hours_ar: string;
  logo_path: string;
  carousel_image_1: string;
  carousel_image_2: string;
  carousel_image_3: string;
  expert_image_1: string;
  expert_image_2: string;
  expert_image_3: string;
}

export const useClinicSettings = () => {
  const [settings, setSettings] = useState<ClinicSettings>({
    clinic_name_en: 'SAFA Dental Center',
    clinic_name_ar: 'مركز صفا لطب الأسنان',
    phone_number: '010 04500116',
    email: 'dr.hesham_dent@hotmail.com',
    address: '33 A Elkasr ELEINI St, Cairo, Egypt',
    location_url: 'https://maps.app.goo.gl/QCDMYj87XZHmgNjJ7',
    working_hours_en: 'Sat-Thu: 12:00 PM - 9:00 PM',
    working_hours_ar: 'السبت-الخميس: 12:00 ظهراً - 9:00 مساءً',
    logo_path: '/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png',
    carousel_image_1: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    carousel_image_2: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1200&auto=format&fit=crop',
    carousel_image_3: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop',
    expert_image_1: '/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png',
    expert_image_2: 'https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop',
    expert_image_3: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('setting_key, setting_value');

      if (error) {
        console.error('Error fetching settings:', error);
        // Use default values on error
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const settingsMap = data.reduce((acc: any, item: any) => {
          acc[item.setting_key] = item.setting_value;
          return acc;
        }, {});

        setSettings(prevSettings => ({
          ...prevSettings,
          ...settingsMap
        }));
      }
    } catch (error) {
      console.error('Error fetching clinic settings:', error);
      // Use default values on error
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchSettings };
};