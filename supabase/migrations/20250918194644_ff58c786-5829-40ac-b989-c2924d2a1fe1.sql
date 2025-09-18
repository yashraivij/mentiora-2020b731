-- Create table for tracking reward redemptions
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_title TEXT NOT NULL,
  reward_description TEXT NOT NULL,
  mp_cost INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fulfilled BOOLEAN NOT NULL DEFAULT false,
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own redemptions" 
ON public.reward_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" 
ON public.reward_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admin can view and update all redemptions
CREATE POLICY "Service role can manage all redemptions" 
ON public.reward_redemptions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create table for admin notifications
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'reward_redemption',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Service role can manage all notifications
CREATE POLICY "Service role can manage admin notifications" 
ON public.admin_notifications 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add trigger for updated_at
CREATE TRIGGER update_reward_redemptions_updated_at
BEFORE UPDATE ON public.reward_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_notifications_updated_at
BEFORE UPDATE ON public.admin_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_points table to track MP balance properly
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own points" 
ON public.user_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" 
ON public.user_points 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" 
ON public.user_points 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Service role can manage all points
CREATE POLICY "Service role can manage all points" 
ON public.user_points 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add trigger for updated_at
CREATE TRIGGER update_user_points_updated_at
BEFORE UPDATE ON public.user_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();