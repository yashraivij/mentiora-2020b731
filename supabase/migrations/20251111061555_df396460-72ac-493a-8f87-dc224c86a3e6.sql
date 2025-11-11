-- Create curriculum subjects table
CREATE TABLE curriculum_subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  exam_board TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create curriculum topics table
CREATE TABLE curriculum_topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create curriculum questions table
CREATE TABLE curriculum_questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  marks INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  model_answer TEXT NOT NULL,
  marking_criteria JSONB NOT NULL,
  spec_reference TEXT NOT NULL,
  calculator_guidance TEXT CHECK (calculator_guidance IN ('calc-recommended', 'non-calc-friendly')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_topics_subject ON curriculum_topics(subject_id);
CREATE INDEX idx_questions_topic ON curriculum_questions(topic_id);
CREATE INDEX idx_questions_difficulty ON curriculum_questions(difficulty);

-- Enable Row Level Security
ALTER TABLE curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_questions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read curriculum data
CREATE POLICY "Anyone can read subjects" ON curriculum_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read topics" ON curriculum_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read questions" ON curriculum_questions FOR SELECT TO authenticated USING (true);

-- Only service role can manage curriculum data
CREATE POLICY "Service role can manage subjects" ON curriculum_subjects FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage topics" ON curriculum_topics FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage questions" ON curriculum_questions FOR ALL TO service_role USING (true);