
-- Create clinic_settings table to store configurable information
CREATE TABLE public.clinic_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all clinic settings"
  ON public.clinic_settings
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert clinic settings"
  ON public.clinic_settings
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update clinic settings"
  ON public.clinic_settings
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete clinic settings"
  ON public.clinic_settings
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Insert initial clinic settings data
INSERT INTO public.clinic_settings (setting_key, setting_value) VALUES
  ('clinic_name_en', 'SAFA Dental Center'),
  ('clinic_name_ar', 'مركز صفا لطب الأسنان'),
  ('phone_number', '010 04500116'),
  ('email', 'dr.hesham_dent@hotmail.com'),
  ('address', '33 A Elkasr ELEINI St, Cairo, Egypt'),
  ('location_url', 'https://maps.app.goo.gl/QCDMYj87XZHmgNjJ7'),
  ('working_hours_en', 'Sat-Thu: 12:00 PM - 9:00 PM'),
  ('working_hours_ar', 'السبت-الخميس: 12:00 ظهراً - 9:00 مساءً'),
  ('logo_path', '/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png');

-- Create function to get clinic setting by key
CREATE OR REPLACE FUNCTION public.get_clinic_setting(setting_key text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT setting_value FROM public.clinic_settings WHERE clinic_settings.setting_key = get_clinic_setting.setting_key LIMIT 1;
$$;
