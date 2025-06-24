
-- Create appointments table to store all appointment bookings
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent double bookings at the same date and time
CREATE UNIQUE INDEX unique_appointment_slot ON public.appointments (appointment_date, appointment_time) 
WHERE status IN ('pending', 'confirmed');

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading all appointments (for admin purposes)
CREATE POLICY "Allow reading appointments" ON public.appointments FOR SELECT USING (true);

-- Create policy to allow inserting new appointments
CREATE POLICY "Allow inserting appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- Create policy to allow updating appointments
CREATE POLICY "Allow updating appointments" ON public.appointments FOR UPDATE USING (true);

-- Create function to check appointment availability
CREATE OR REPLACE FUNCTION check_appointment_availability(
  check_date DATE,
  check_time TIME
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointment_date = check_date 
    AND appointment_time = check_time 
    AND status IN ('pending', 'confirmed')
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get available time slots for a given date
CREATE OR REPLACE FUNCTION get_available_slots(check_date DATE)
RETURNS TABLE(time_slot TIME) AS $$
DECLARE
  slot_time TIME;
BEGIN
  -- Generate time slots from 12:00 PM to 9:00 PM (working hours)
  FOR slot_time IN 
    SELECT generate_series('12:00'::time, '21:00'::time, '30 minutes'::interval)::time
  LOOP
    -- Check if this slot is available
    IF check_appointment_availability(check_date, slot_time) THEN
      time_slot := slot_time;
      RETURN NEXT;
    END IF;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE plpgsql;
