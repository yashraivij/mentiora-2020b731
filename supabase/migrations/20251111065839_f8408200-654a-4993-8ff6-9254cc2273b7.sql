-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Anyone can read subjects" ON curriculum_subjects;
DROP POLICY IF EXISTS "Anyone can read topics" ON curriculum_topics;
DROP POLICY IF EXISTS "Anyone can read questions" ON curriculum_questions;

-- Create new public read policies for curriculum_subjects
CREATE POLICY "Public read access for subjects"
ON curriculum_subjects FOR SELECT
TO authenticated, anon
USING (true);

-- Create new public read policies for curriculum_topics
CREATE POLICY "Public read access for topics"
ON curriculum_topics FOR SELECT
TO authenticated, anon
USING (true);

-- Create new public read policies for curriculum_questions
CREATE POLICY "Public read access for questions"
ON curriculum_questions FOR SELECT
TO authenticated, anon
USING (true);