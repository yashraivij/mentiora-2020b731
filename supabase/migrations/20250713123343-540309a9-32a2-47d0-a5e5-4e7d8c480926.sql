-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table to track completed predicted exams
CREATE TABLE public.predicted_exam_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject_id TEXT NOT NULL,
  exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_marks INTEGER NOT NULL,
  achieved_marks INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  grade TEXT NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.predicted_exam_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own exam completions" 
ON public.predicted_exam_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exam completions" 
ON public.predicted_exam_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam completions" 
ON public.predicted_exam_completions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_predicted_exam_completions_updated_at
BEFORE UPDATE ON public.predicted_exam_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();