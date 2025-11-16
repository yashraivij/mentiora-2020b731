-- Add Geometry questions to curriculum_questions
DO $$
DECLARE
  question RECORD;
  topic_ids TEXT[] := ARRAY['sat-gt-triangles', 'sat-gt-pythagorean', 'sat-gt-similarity', 'sat-gt-area-volume', 'sat-gt-circles', 'sat-gt-basic-trig', 'sat-gt-radians'];
  selected_topic TEXT;
  topic_index INT := 0;
  question_order INT;
BEGIN
  FOR question IN 
    SELECT * FROM sat_questions WHERE domain = 'Geometry' ORDER BY difficulty, id
  LOOP
    selected_topic := topic_ids[(topic_index % 7) + 1];
    topic_index := topic_index + 1;
    
    SELECT COALESCE(MAX(order_index), 0) + 1 INTO question_order FROM curriculum_questions WHERE topic_id = selected_topic;
    
    INSERT INTO curriculum_questions (id, topic_id, question, marks, model_answer, difficulty, spec_reference, marking_criteria, calculator_guidance, order_index)
    VALUES (
      'sat-geom-' || question.id::TEXT,
      selected_topic,
      COALESCE(question.passage_text || E'\n\n', '') || question.question_text,
      CASE question.difficulty WHEN 'Easy' THEN 2 WHEN 'Medium' THEN 4 WHEN 'Hard' THEN 6 ELSE 3 END,
      question.correct_answer || E'\n\nExplanation: ' || question.explanation,
      question.difficulty,
      question.domain || CASE WHEN array_length(question.tags, 1) > 0 THEN ' - ' || array_to_string(question.tags, ', ') ELSE '' END,
      jsonb_build_object('answer', question.correct_answer, 'explanation', question.explanation, 'choices', COALESCE(question.choices, '[]'::jsonb)),
      'calc-recommended',
      question_order
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;