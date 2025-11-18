-- Step 1: Delete all existing SAT topics
DELETE FROM curriculum_topics WHERE subject_id LIKE 'sat-%';

-- Step 2: Create one general topic per SAT subject
INSERT INTO curriculum_topics (id, subject_id, name, order_index, created_at, updated_at) VALUES
('sat-algebra-general', 'sat-algebra', 'Algebra', 1, now(), now()),
('sat-advanced-math-general', 'sat-advanced-math', 'Advanced Math', 1, now(), now()),
('sat-craft-structure-general', 'sat-craft-structure', 'Craft & Structure', 1, now(), now()),
('sat-english-conventions-general', 'sat-english-conventions', 'Standard English Conventions', 1, now(), now()),
('sat-expression-ideas-general', 'sat-expression-ideas', 'Expression of Ideas', 1, now(), now()),
('sat-geometry-trigonometry-general', 'sat-geometry-trigonometry', 'Geometry & Trigonometry', 1, now(), now()),
('sat-information-ideas-general', 'sat-information-ideas', 'Information & Ideas', 1, now(), now()),
('sat-problem-solving-data-general', 'sat-problem-solving-data', 'Problem Solving & Data Analysis', 1, now(), now());

-- Step 3: Reassign all SAT questions to new general topics
-- Algebra questions
UPDATE curriculum_questions 
SET topic_id = 'sat-algebra-general' 
WHERE topic_id IN ('sat-alg-linear-equations', 'sat-alg-inequalities', 'sat-alg-systems', 'sat-alg-linear-functions', 'sat-alg-function-behavior');

-- Advanced Math questions
UPDATE curriculum_questions 
SET topic_id = 'sat-advanced-math-general' 
WHERE topic_id IN ('sat-am-quadratics', 'sat-am-polynomial', 'sat-am-exponential', 'sat-am-rational', 'sat-am-inverses', 'sat-am-domain-range', 'sat-am-composition');

-- Craft & Structure questions
UPDATE curriculum_questions 
SET topic_id = 'sat-craft-structure-general' 
WHERE topic_id IN ('sat-cs-word-meaning', 'sat-cs-tone-attitude', 'sat-cs-rhetorical-strategy', 'sat-cs-text-organization', 'sat-cs-point-of-view', 'sat-cs-author-intent', 'sat-cs-connotation');

-- Standard English Conventions questions
UPDATE curriculum_questions 
SET topic_id = 'sat-english-conventions-general' 
WHERE topic_id IN ('sat-sec-grammar', 'sat-sec-punctuation', 'sat-sec-verb-tense', 'sat-sec-pronoun', 'sat-sec-parallel', 'sat-sec-possessives', 'sat-sec-modifiers');

-- Expression of Ideas questions
UPDATE curriculum_questions 
SET topic_id = 'sat-expression-ideas-general' 
WHERE topic_id IN ('sat-ei-transitions', 'sat-ei-logical-order', 'sat-ei-clarity', 'sat-ei-style-consistency', 'sat-ei-redundancy', 'sat-ei-revision');

-- Geometry & Trigonometry questions
UPDATE curriculum_questions 
SET topic_id = 'sat-geometry-trigonometry-general' 
WHERE topic_id IN ('sat-gt-triangles', 'sat-gt-pythagorean', 'sat-gt-area-volume', 'sat-gt-circles', 'sat-gt-basic-trig', 'sat-gt-similarity', 'sat-gt-radians');

-- Information & Ideas questions
UPDATE curriculum_questions 
SET topic_id = 'sat-information-ideas-general' 
WHERE topic_id IN ('sat-ii-main-idea', 'sat-ii-supporting-evidence', 'sat-ii-inferences', 'sat-ii-text-purpose', 'sat-ii-data-interpretation');

-- Problem Solving & Data Analysis questions
UPDATE curriculum_questions 
SET topic_id = 'sat-problem-solving-data-general' 
WHERE topic_id IN ('sat-psda-ratios', 'sat-psda-percent', 'sat-psda-rates', 'sat-psda-probability', 'sat-psda-averages', 'sat-psda-graphs', 'sat-psda-linear-models', 'sat-psda-two-way');