-- Migrate SAT questions to curriculum_questions with correct topic mappings
DO $$
DECLARE
  question RECORD;
  topic_ids TEXT[];
  selected_topic TEXT;
  topic_index INT := 0;
  question_order INT;
BEGIN
  FOR question IN 
    SELECT * FROM sat_questions ORDER BY domain, difficulty, id
  LOOP
    -- Map domain to actual topic IDs
    topic_ids := CASE question.domain
      WHEN 'Algebra' THEN ARRAY['sat-alg-linear-equations', 'sat-alg-linear-functions', 'sat-alg-systems', 'sat-alg-inequalities', 'sat-alg-function-behavior']
      WHEN 'Problem Solving & Data Analysis' THEN ARRAY['sat-psda-ratios', 'sat-psda-percent', 'sat-psda-rates', 'sat-psda-probability', 'sat-psda-graphs', 'sat-psda-averages', 'sat-psda-two-way', 'sat-psda-linear-models']
      WHEN 'Advanced Math' THEN ARRAY['sat-am-quadratics', 'sat-am-exponential', 'sat-am-polynomial', 'sat-am-rational', 'sat-am-composition', 'sat-am-domain-range', 'sat-am-inverses']
      WHEN 'Geometry & Trigonometry' THEN ARRAY['sat-gt-triangles', 'sat-gt-pythagorean', 'sat-gt-similarity', 'sat-gt-area-volume', 'sat-gt-circles', 'sat-gt-basic-trig', 'sat-gt-radians']
      WHEN 'Information & Ideas' THEN ARRAY['sat-ii-main-idea', 'sat-ii-supporting-evidence', 'sat-ii-inferences', 'sat-ii-text-purpose', 'sat-ii-data-interpretation']
      WHEN 'Craft & Structure' THEN ARRAY['sat-cs-word-meaning', 'sat-cs-connotation', 'sat-cs-tone-attitude', 'sat-cs-rhetorical-strategy', 'sat-cs-text-organization', 'sat-cs-point-of-view', 'sat-cs-author-intent']
      WHEN 'Expression of Ideas' THEN ARRAY['sat-ei-revision', 'sat-ei-clarity', 'sat-ei-redundancy', 'sat-ei-logical-order', 'sat-ei-transitions', 'sat-ei-style-consistency']
      WHEN 'Standard English Conventions' THEN ARRAY['sat-sec-grammar', 'sat-sec-verb-tense', 'sat-sec-pronoun', 'sat-sec-punctuation', 'sat-sec-parallel', 'sat-sec-modifiers', 'sat-sec-possessives']
      ELSE ARRAY['sat-alg-linear-equations']
    END;
    
    -- Round-robin distribution
    selected_topic := topic_ids[(topic_index % array_length(topic_ids, 1)) + 1];
    topic_index := topic_index + 1;
    
    SELECT COALESCE(MAX(order_index), 0) + 1 INTO question_order FROM curriculum_questions WHERE topic_id = selected_topic;
    
    INSERT INTO curriculum_questions (id, topic_id, question, marks, model_answer, difficulty, spec_reference, marking_criteria, calculator_guidance, order_index)
    VALUES (
      'sat-' || question.id::TEXT,
      selected_topic,
      COALESCE(question.passage_text || E'\n\n', '') || question.question_text,
      CASE question.difficulty WHEN 'Easy' THEN 2 WHEN 'Medium' THEN 4 WHEN 'Hard' THEN 6 ELSE 3 END,
      question.correct_answer || E'\n\nExplanation: ' || question.explanation,
      question.difficulty,
      question.domain || CASE WHEN array_length(question.tags, 1) > 0 THEN ' - ' || array_to_string(question.tags, ', ') ELSE '' END,
      jsonb_build_object('answer', question.correct_answer, 'explanation', question.explanation, 'choices', COALESCE(question.choices, '[]'::jsonb)),
      CASE WHEN question.domain IN ('Algebra', 'Problem Solving & Data Analysis', 'Advanced Math', 'Geometry & Trigonometry') THEN 'calc-recommended' ELSE 'non-calc-friendly' END,
      question_order
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;