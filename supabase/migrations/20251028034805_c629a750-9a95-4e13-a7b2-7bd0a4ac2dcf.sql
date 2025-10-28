-- Create function to extract first name from full name
CREATE OR REPLACE FUNCTION public.set_first_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Extract first word before the space from full_name
  IF NEW.full_name IS NOT NULL THEN
    NEW.first_name := split_part(NEW.full_name, ' ', 1);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set first_name on insert or update
CREATE TRIGGER set_first_name_trigger
BEFORE INSERT OR UPDATE OF full_name ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_first_name();

-- Backfill existing profiles with first_name from full_name
UPDATE public.profiles
SET first_name = split_part(full_name, ' ', 1)
WHERE full_name IS NOT NULL AND first_name IS NULL;