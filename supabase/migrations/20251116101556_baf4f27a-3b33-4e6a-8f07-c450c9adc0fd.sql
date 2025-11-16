-- Add questions to SAT Advanced Math topics (Part 1)

-- Add 5 questions to sat-am-polynomial (currently 5)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-poly-6', 'sat-am-polynomial', 'What is the coefficient of x³ in the expansion of (2x - 3)⁴?', 1, 'medium', 'SAT Advanced Math - Polynomial Operations', '-216', '{"criteria": [{"points": 1, "description": "Correct answer: -216"}]}', 6),
('sat-am-poly-7', 'sat-am-polynomial', 'If p(x) = x³ - 4x² + x - 4, which of the following is a factor of p(x)?', 1, 'medium', 'SAT Advanced Math - Polynomial Operations', 'x - 4', '{"criteria": [{"points": 1, "description": "Correct answer: x - 4"}]}', 7),
('sat-am-poly-8', 'sat-am-polynomial', 'The polynomial 2x³ + bx² - 13x + 6 has a factor of (x - 2). What is the value of b?', 1, 'hard', 'SAT Advanced Math - Polynomial Operations', '5', '{"criteria": [{"points": 1, "description": "Correct answer: 5"}]}', 8),
('sat-am-poly-9', 'sat-am-polynomial', 'If f(x) = x⁴ - 5x² + 4, how many distinct real roots does f(x) have?', 1, 'medium', 'SAT Advanced Math - Polynomial Operations', '4', '{"criteria": [{"points": 1, "description": "Correct answer: 4"}]}', 9),
('sat-am-poly-10', 'sat-am-polynomial', 'What is the remainder when x⁵ + 2x³ - x + 1 is divided by (x + 1)?', 1, 'medium', 'SAT Advanced Math - Polynomial Operations', '3', '{"criteria": [{"points": 1, "description": "Correct answer: 3"}]}', 10);

-- Add 5 questions to sat-am-rational (currently 5)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-rat-6', 'sat-am-rational', 'Solve for x: (2x + 1)/(x - 3) = 5', 1, 'medium', 'SAT Advanced Math - Rational Equations', 'x = 16/3 or 5.33', '{"criteria": [{"points": 1, "description": "Correct answer: x = 16/3"}]}', 6),
('sat-am-rat-7', 'sat-am-rational', 'What value(s) of x make the expression (x² - 9)/(x² - 5x + 6) undefined?', 1, 'medium', 'SAT Advanced Math - Rational Equations', 'x = 2 and x = 3', '{"criteria": [{"points": 1, "description": "Correct answer: x = 2 and x = 3"}]}', 7),
('sat-am-rat-8', 'sat-am-rational', 'Simplify: (x² - 4)/(x² + 4x + 4)', 1, 'medium', 'SAT Advanced Math - Rational Equations', '(x - 2)/(x + 2)', '{"criteria": [{"points": 1, "description": "Correct simplified form"}]}', 8),
('sat-am-rat-9', 'sat-am-rational', 'If 1/x + 1/y = 1/3 and x = 6, what is the value of y?', 1, 'medium', 'SAT Advanced Math - Rational Equations', 'y = 6', '{"criteria": [{"points": 1, "description": "Correct answer: y = 6"}]}', 9),
('sat-am-rat-10', 'sat-am-rational', 'Solve: 3/(x + 2) - 2/(x - 1) = 1', 1, 'hard', 'SAT Advanced Math - Rational Equations', 'x = 0 or x = 2', '{"criteria": [{"points": 1, "description": "Both solutions correct"}]}', 10);

-- Add 5 questions to sat-am-composition (currently 5)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-comp-6', 'sat-am-composition', 'If f(x) = 2x + 1 and g(x) = x² - 3, what is f(g(2))?', 1, 'easy', 'SAT Advanced Math - Function Composition', '3', '{"criteria": [{"points": 1, "description": "Correct answer: 3"}]}', 6),
('sat-am-comp-7', 'sat-am-composition', 'Given h(x) = x³ and k(x) = x - 4, what is h(k(x))?', 1, 'medium', 'SAT Advanced Math - Function Composition', '(x - 4)³', '{"criteria": [{"points": 1, "description": "Correct expression"}]}', 7),
('sat-am-comp-8', 'sat-am-composition', 'If f(x) = √x and g(x) = x² + 5, what is the domain of f(g(x))?', 1, 'medium', 'SAT Advanced Math - Function Composition', 'All real numbers', '{"criteria": [{"points": 1, "description": "All real numbers or x ∈ ℝ"}]}', 8),
('sat-am-comp-9', 'sat-am-composition', 'If f(g(x)) = 4x - 7 and f(x) = 2x - 3, what is g(x)?', 1, 'hard', 'SAT Advanced Math - Function Composition', 'g(x) = 2x - 2', '{"criteria": [{"points": 1, "description": "Correct function"}]}', 9),
('sat-am-comp-10', 'sat-am-composition', 'Given f(x) = 1/x and g(x) = x + 1, what is g(f(x))?', 1, 'medium', 'SAT Advanced Math - Function Composition', '1/x + 1 or (1 + x)/x', '{"criteria": [{"points": 1, "description": "Correct expression"}]}', 10);

-- Add 6 questions to sat-am-domain-range (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-domain-5', 'sat-am-domain-range', 'What is the domain of f(x) = √(x - 5)?', 1, 'easy', 'SAT Advanced Math - Domain and Range', 'x ≥ 5', '{"criteria": [{"points": 1, "description": "x ≥ 5 or [5, ∞)"}]}', 5),
('sat-am-domain-6', 'sat-am-domain-range', 'What is the range of g(x) = x² + 3?', 1, 'easy', 'SAT Advanced Math - Domain and Range', 'y ≥ 3', '{"criteria": [{"points": 1, "description": "y ≥ 3 or [3, ∞)"}]}', 6),
('sat-am-domain-7', 'sat-am-domain-range', 'For h(x) = 1/(x² - 4), what values must be excluded from the domain?', 1, 'medium', 'SAT Advanced Math - Domain and Range', 'x ≠ 2 and x ≠ -2', '{"criteria": [{"points": 1, "description": "Both exclusions identified"}]}', 7),
('sat-am-domain-8', 'sat-am-domain-range', 'What is the range of f(x) = -|x| + 5?', 1, 'medium', 'SAT Advanced Math - Domain and Range', 'y ≤ 5', '{"criteria": [{"points": 1, "description": "y ≤ 5 or (-∞, 5]"}]}', 8),
('sat-am-domain-9', 'sat-am-domain-range', 'If the range of f(x) = ax² + 3 is y ≥ 3, what must be true about a?', 1, 'medium', 'SAT Advanced Math - Domain and Range', 'a > 0', '{"criteria": [{"points": 1, "description": "a must be positive"}]}', 9),
('sat-am-domain-10', 'sat-am-domain-range', 'What is the domain of k(x) = √(9 - x²)?', 1, 'hard', 'SAT Advanced Math - Domain and Range', '-3 ≤ x ≤ 3', '{"criteria": [{"points": 1, "description": "[-3, 3] or -3 ≤ x ≤ 3"}]}', 10);