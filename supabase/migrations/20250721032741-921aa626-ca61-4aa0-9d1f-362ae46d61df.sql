-- Add image settings to clinic_settings table
INSERT INTO public.clinic_settings (setting_key, setting_value) VALUES
  ('carousel_image_1', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop'),
  ('carousel_image_2', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1200&auto=format&fit=crop'),
  ('carousel_image_3', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop'),
  ('expert_image_1', '/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png'),
  ('expert_image_2', 'https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop'),
  ('expert_image_3', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (setting_key) DO NOTHING;