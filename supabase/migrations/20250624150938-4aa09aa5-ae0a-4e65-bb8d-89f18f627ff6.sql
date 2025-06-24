
-- Fix the get_available_slots function to properly generate time slots
CREATE OR REPLACE FUNCTION get_available_slots(check_date DATE)
RETURNS TABLE(time_slot TIME) AS $$
DECLARE
  slot_time TIME;
  start_time TIME := '12:00:00';
  end_time TIME := '21:00:00';
  interval_minutes INTEGER := 30;
BEGIN
  -- Generate time slots from 12:00 PM to 9:00 PM in 30-minute intervals
  slot_time := start_time;
  
  WHILE slot_time <= end_time LOOP
    -- Check if this slot is available
    IF check_appointment_availability(check_date, slot_time) THEN
      time_slot := slot_time;
      RETURN NEXT;
    END IF;
    
    -- Add 30 minutes to the current slot time
    slot_time := slot_time + (interval_minutes || ' minutes')::INTERVAL;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;
