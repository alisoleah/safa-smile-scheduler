
-- Add admin role and update appointment status options
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
    AND role = 'admin'
  );
$$;

-- Create policies for user_roles table
CREATE POLICY "Admins can view all user roles" ON public.user_roles
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage user roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

-- Update appointments table to add more status options
ALTER TABLE public.appointments 
ALTER COLUMN status TYPE TEXT;

-- Add constraint for valid status values
ALTER TABLE public.appointments 
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Add notification tracking columns
ALTER TABLE public.appointments 
ADD COLUMN email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN sms_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN confirmed_by UUID REFERENCES auth.users(id);

-- Create RLS policies for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow admins to view and manage all appointments
CREATE POLICY "Admins can view all appointments" ON public.appointments
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all appointments" ON public.appointments
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow public to insert appointments (for booking form)
CREATE POLICY "Anyone can create appointments" ON public.appointments
FOR INSERT TO anon, authenticated
WITH CHECK (true);
