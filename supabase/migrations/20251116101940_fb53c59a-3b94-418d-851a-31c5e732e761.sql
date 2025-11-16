-- Complete SAT Advanced Math topics (add final questions)

-- Add 1 question to sat-am-polynomial (currently 9)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-poly-11', 'sat-am-polynomial', 'For the polynomial f(x) = x³ - 3x² + 4, what is f(2)?', 1, 'easy', 'SAT Advanced Math - Polynomial Operations', '4', '{"criteria": [{"points": 1, "description": "Correct answer: 4"}]}', 11);

-- Add 1 question to sat-am-rational (currently 9)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-rat-11', 'sat-am-rational', 'What is the vertical asymptote of f(x) = (x + 1)/(x - 5)?', 1, 'medium', 'SAT Advanced Math - Rational Equations', 'x = 5', '{"criteria": [{"points": 1, "description": "Correct answer: x = 5"}]}', 11);

-- Add 1 question to sat-am-composition (currently 9)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-comp-11', 'sat-am-composition', 'If f(x) = x + 5 and f(g(x)) = 3x + 5, what is g(x)?', 1, 'medium', 'SAT Advanced Math - Function Composition', 'g(x) = 3x', '{"criteria": [{"points": 1, "description": "Correct function"}]}', 11);