-- Create table for onboarding parent emails (for progress updates)
CREATE TABLE public.onboarding_parent_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for paywall parent emails (for payment requests)
CREATE TABLE public.paywall_parent_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.onboarding_parent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paywall_parent_emails ENABLE ROW LEVEL SECURITY;

-- RLS policies for onboarding_parent_emails
CREATE POLICY "Users can view their own onboarding parent emails"
  ON public.onboarding_parent_emails
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding parent emails"
  ON public.onboarding_parent_emails
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding parent emails"
  ON public.onboarding_parent_emails
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for paywall_parent_emails
CREATE POLICY "Users can view their own paywall parent emails"
  ON public.paywall_parent_emails
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own paywall parent emails"
  ON public.paywall_parent_emails
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paywall parent emails"
  ON public.paywall_parent_emails
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_onboarding_parent_emails_updated_at
  BEFORE UPDATE ON public.onboarding_parent_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paywall_parent_emails_updated_at
  BEFORE UPDATE ON public.paywall_parent_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();