-- Create notebook_entries table for smart revision notes
CREATE TABLE public.notebook_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  paper TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_label TEXT NOT NULL,
  confidence_level TEXT NOT NULL,
  what_tripped_up TEXT NOT NULL,
  fix_sentence TEXT NOT NULL,
  bulletproof_notes TEXT[] NOT NULL,
  mini_example TEXT,
  keywords TEXT[] NOT NULL,
  spec_link TEXT NOT NULL,
  next_step_suggestion TEXT NOT NULL,
  skill_type TEXT NOT NULL,
  bloom_level TEXT NOT NULL,
  mark_loss INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notebook_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for notebook entries
CREATE POLICY "Users can view their own notebook entries" 
ON public.notebook_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notebook entries" 
ON public.notebook_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notebook entries" 
ON public.notebook_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notebook entries" 
ON public.notebook_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notebook_entries_updated_at
BEFORE UPDATE ON public.notebook_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();