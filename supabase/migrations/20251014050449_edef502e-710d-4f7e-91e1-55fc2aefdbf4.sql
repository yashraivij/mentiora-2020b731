-- Add set_id column to flashcards table to properly group flashcards into distinct sets
ALTER TABLE public.flashcards 
ADD COLUMN set_id uuid DEFAULT gen_random_uuid();

-- Create an index for better query performance
CREATE INDEX idx_flashcards_set_id ON public.flashcards(set_id);

-- Create an index for filtering by user and set
CREATE INDEX idx_flashcards_user_set ON public.flashcards(user_id, set_id);