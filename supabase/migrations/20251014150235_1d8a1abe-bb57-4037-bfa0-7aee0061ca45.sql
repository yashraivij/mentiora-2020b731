-- Add title column to flashcards table to store custom set names
ALTER TABLE public.flashcards ADD COLUMN IF NOT EXISTS title TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_flashcards_title ON public.flashcards(title);