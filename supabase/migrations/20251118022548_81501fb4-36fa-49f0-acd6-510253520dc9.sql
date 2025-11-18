-- Fix incorrect SAT subject IDs in user_subjects table
-- Update Algebra
UPDATE user_subjects
SET subject_id = 'sat-algebra'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Algebra' OR subject_name = 'SAT: Algebra')
AND subject_id != 'sat-algebra';

-- Update Advanced Math
UPDATE user_subjects
SET subject_id = 'sat-advanced-math'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Advanced Math' OR subject_name = 'SAT: Advanced Math')
AND subject_id != 'sat-advanced-math';

-- Update Geometry & Trigonometry
UPDATE user_subjects
SET subject_id = 'sat-geometry-trigonometry'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Geometry & Trigonometry' OR subject_name = 'SAT: Geometry & Trigonometry')
AND subject_id != 'sat-geometry-trigonometry';

-- Update Problem Solving & Data Analysis
UPDATE user_subjects
SET subject_id = 'sat-problem-solving-data'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Problem Solving & Data Analysis' OR subject_name = 'SAT: Problem Solving & Data Analysis')
AND subject_id != 'sat-problem-solving-data';

-- Update Information & Ideas
UPDATE user_subjects
SET subject_id = 'sat-information-ideas'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Information & Ideas' OR subject_name = 'SAT: Information & Ideas')
AND subject_id != 'sat-information-ideas';

-- Update Craft & Structure
UPDATE user_subjects
SET subject_id = 'sat-craft-structure'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Craft & Structure' OR subject_name = 'SAT: Craft & Structure')
AND subject_id != 'sat-craft-structure';

-- Update Standard English Conventions
UPDATE user_subjects
SET subject_id = 'sat-english-conventions'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Standard English Conventions' OR subject_name = 'SAT: Standard English Conventions')
AND subject_id != 'sat-english-conventions';

-- Update Expression of Ideas
UPDATE user_subjects
SET subject_id = 'sat-expression-ideas'
WHERE exam_board = 'College Board' 
AND (subject_name = 'Expression of Ideas' OR subject_name = 'SAT: Expression of Ideas')
AND subject_id != 'sat-expression-ideas';