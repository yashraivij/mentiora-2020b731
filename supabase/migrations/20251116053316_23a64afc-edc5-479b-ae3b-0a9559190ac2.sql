-- Insert SAT subjects into curriculum_subjects
INSERT INTO public.curriculum_subjects (id, name, exam_board) VALUES
('sat-information-ideas', 'Information & Ideas', 'College Board'),
('sat-craft-structure', 'Craft & Structure', 'College Board'),
('sat-expression-ideas', 'Expression of Ideas', 'College Board'),
('sat-english-conventions', 'Standard English Conventions', 'College Board'),
('sat-algebra', 'Algebra', 'College Board'),
('sat-advanced-math', 'Advanced Math', 'College Board'),
('sat-problem-solving-data', 'Problem Solving & Data Analysis', 'College Board'),
('sat-geometry-trigonometry', 'Geometry & Trigonometry', 'College Board')
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Information & Ideas
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-ii-main-idea', 'sat-information-ideas', 'Main idea / central claim', 0),
('sat-ii-supporting-evidence', 'sat-information-ideas', 'Supporting evidence', 1),
('sat-ii-inferences', 'sat-information-ideas', 'Inferences + logical conclusions', 2),
('sat-ii-text-purpose', 'sat-information-ideas', 'Text-purpose recognition', 3),
('sat-ii-data-interpretation', 'sat-information-ideas', 'Data + graph interpretation', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Craft & Structure
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-cs-word-meaning', 'sat-craft-structure', 'Word meaning in context', 0),
('sat-cs-connotation', 'sat-craft-structure', 'Connotation (positive/negative meaning)', 1),
('sat-cs-tone-attitude', 'sat-craft-structure', 'Tone + attitude', 2),
('sat-cs-rhetorical-strategy', 'sat-craft-structure', 'Rhetorical strategy', 3),
('sat-cs-text-organization', 'sat-craft-structure', 'Text organization + structure', 4),
('sat-cs-point-of-view', 'sat-craft-structure', 'Point of view / perspective', 5),
('sat-cs-author-intent', 'sat-craft-structure', 'Author''s intent / bias', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Expression of Ideas
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-ei-revision', 'sat-expression-ideas', 'Effective revision + rewriting', 0),
('sat-ei-clarity', 'sat-expression-ideas', 'Sentence clarity + precision', 1),
('sat-ei-redundancy', 'sat-expression-ideas', 'Eliminating redundancy', 2),
('sat-ei-logical-order', 'sat-expression-ideas', 'Logical sentence/paragraph order', 3),
('sat-ei-transitions', 'sat-expression-ideas', 'Transition improvement', 4),
('sat-ei-style-consistency', 'sat-expression-ideas', 'Maintaining style consistency', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Standard English Conventions
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-sec-grammar', 'sat-english-conventions', 'Grammar + sentence structure', 0),
('sat-sec-verb-tense', 'sat-english-conventions', 'Verb tense and agreement', 1),
('sat-sec-pronoun', 'sat-english-conventions', 'Pronoun reference + agreement', 2),
('sat-sec-punctuation', 'sat-english-conventions', 'Punctuation (comma, colon, dash, apostrophes)', 3),
('sat-sec-parallel', 'sat-english-conventions', 'Parallel structure', 4),
('sat-sec-modifiers', 'sat-english-conventions', 'Misplaced/dangling modifiers', 5),
('sat-sec-possessives', 'sat-english-conventions', 'Possessives + plural nouns', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Algebra
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-alg-linear-equations', 'sat-algebra', 'Linear equations', 0),
('sat-alg-linear-functions', 'sat-algebra', 'Linear functions + graphs', 1),
('sat-alg-systems', 'sat-algebra', 'Systems of equations', 2),
('sat-alg-inequalities', 'sat-algebra', 'Inequalities', 3),
('sat-alg-function-behavior', 'sat-algebra', 'Function behavior + interpretation', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Advanced Math
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-am-quadratics', 'sat-advanced-math', 'Quadratics (factor, complete square, solve)', 0),
('sat-am-exponential', 'sat-advanced-math', 'Exponential functions', 1),
('sat-am-polynomial', 'sat-advanced-math', 'Polynomial expressions', 2),
('sat-am-rational', 'sat-advanced-math', 'Rational expressions/equations', 3),
('sat-am-composition', 'sat-advanced-math', 'Function composition', 4),
('sat-am-domain-range', 'sat-advanced-math', 'Domain + range', 5),
('sat-am-inverses', 'sat-advanced-math', 'Inverses and transformations', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Problem Solving & Data Analysis
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-psda-ratios', 'sat-problem-solving-data', 'Ratios + proportions', 0),
('sat-psda-percent', 'sat-problem-solving-data', 'Percent change + growth', 1),
('sat-psda-rates', 'sat-problem-solving-data', 'Rates + unit conversions', 2),
('sat-psda-probability', 'sat-problem-solving-data', 'Probability + expected value (basic)', 3),
('sat-psda-graphs', 'sat-problem-solving-data', 'Tables, graphs, scatterplots', 4),
('sat-psda-averages', 'sat-problem-solving-data', 'Averages (mean, median, mode)', 5),
('sat-psda-two-way', 'sat-problem-solving-data', 'Two-way tables + categorical data', 6),
('sat-psda-linear-models', 'sat-problem-solving-data', 'Linear models + trend lines', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert topics for Geometry & Trigonometry
INSERT INTO public.curriculum_topics (id, subject_id, name, order_index) VALUES
('sat-gt-triangles', 'sat-geometry-trigonometry', 'Triangle properties', 0),
('sat-gt-pythagorean', 'sat-geometry-trigonometry', 'Pythagorean theorem', 1),
('sat-gt-similarity', 'sat-geometry-trigonometry', 'Similarity + rules', 2),
('sat-gt-area-volume', 'sat-geometry-trigonometry', 'Area, perimeter, volume', 3),
('sat-gt-circles', 'sat-geometry-trigonometry', 'Circles (arcs, angles, sectors)', 4),
('sat-gt-basic-trig', 'sat-geometry-trigonometry', 'Basic trigonometry (sin, cos, tan)', 5),
('sat-gt-radians', 'sat-geometry-trigonometry', 'Radians (light integration)', 6)
ON CONFLICT (id) DO NOTHING;