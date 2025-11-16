-- Add questions to SAT Advanced Math topics (Part 2)

-- Add 7 questions to sat-am-inverses (currently 3)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-inv-4', 'sat-am-inverses', 'If f(x) = 3x - 7, what is f⁻¹(x)?', 1, 'easy', 'SAT Advanced Math - Inverse Functions', 'f⁻¹(x) = (x + 7)/3', '{"criteria": [{"points": 1, "description": "Correct inverse function"}]}', 4),
('sat-am-inv-5', 'sat-am-inverses', 'If g(x) = x³ + 1, what is g⁻¹(9)?', 1, 'medium', 'SAT Advanced Math - Inverse Functions', '2', '{"criteria": [{"points": 1, "description": "Correct answer: 2"}]}', 5),
('sat-am-inv-6', 'sat-am-inverses', 'Which function is its own inverse?', 1, 'medium', 'SAT Advanced Math - Inverse Functions', 'f(x) = 1/x or f(x) = -x', '{"criteria": [{"points": 1, "description": "Valid self-inverse function"}]}', 6),
('sat-am-inv-7', 'sat-am-inverses', 'If f⁻¹(x) = (x - 2)/5, what is f(x)?', 1, 'medium', 'SAT Advanced Math - Inverse Functions', 'f(x) = 5x + 2', '{"criteria": [{"points": 1, "description": "Correct function"}]}', 7),
('sat-am-inv-8', 'sat-am-inverses', 'If f and g are inverse functions and f(3) = 7, what is g(7)?', 1, 'easy', 'SAT Advanced Math - Inverse Functions', '3', '{"criteria": [{"points": 1, "description": "Correct answer: 3"}]}', 8),
('sat-am-inv-9', 'sat-am-inverses', 'What is the inverse of h(x) = 2^x?', 1, 'medium', 'SAT Advanced Math - Inverse Functions', 'h⁻¹(x) = log₂(x)', '{"criteria": [{"points": 1, "description": "Correct logarithmic inverse"}]}', 9),
('sat-am-inv-10', 'sat-am-inverses', 'If f(x) = (x + 3)/(x - 1), what is f⁻¹(2)?', 1, 'hard', 'SAT Advanced Math - Inverse Functions', '5', '{"criteria": [{"points": 1, "description": "Correct answer: 5"}]}', 10);

-- Add 6 questions to sat-am-quadratics (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-quad-5', 'sat-am-quadratics', 'What is the vertex of the parabola y = 2(x - 3)² + 5?', 1, 'easy', 'SAT Advanced Math - Quadratic Functions', '(3, 5)', '{"criteria": [{"points": 1, "description": "Correct vertex coordinates"}]}', 5),
('sat-am-quad-6', 'sat-am-quadratics', 'Solve: x² - 6x + 8 = 0', 1, 'easy', 'SAT Advanced Math - Quadratic Functions', 'x = 2 or x = 4', '{"criteria": [{"points": 1, "description": "Both solutions correct"}]}', 6),
('sat-am-quad-7', 'sat-am-quadratics', 'What is the axis of symmetry for y = -x² + 4x - 1?', 1, 'medium', 'SAT Advanced Math - Quadratic Functions', 'x = 2', '{"criteria": [{"points": 1, "description": "Correct axis: x = 2"}]}', 7),
('sat-am-quad-8', 'sat-am-quadratics', 'If the quadratic equation x² + bx + 25 = 0 has exactly one solution, what is the value of b?', 1, 'medium', 'SAT Advanced Math - Quadratic Functions', 'b = 10 or b = -10', '{"criteria": [{"points": 1, "description": "Either ±10 accepted"}]}', 8),
('sat-am-quad-9', 'sat-am-quadratics', 'What are the x-intercepts of y = x² - 5x + 6?', 1, 'easy', 'SAT Advanced Math - Quadratic Functions', 'x = 2 and x = 3', '{"criteria": [{"points": 1, "description": "Both intercepts correct"}]}', 9),
('sat-am-quad-10', 'sat-am-quadratics', 'A ball is thrown upward with height h(t) = -16t² + 64t + 5. At what time does it reach maximum height?', 1, 'hard', 'SAT Advanced Math - Quadratic Functions', 't = 2 seconds', '{"criteria": [{"points": 1, "description": "Correct time: 2 seconds"}]}', 10);

-- Add 6 questions to sat-am-exponential (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-am-exp-5', 'sat-am-exponential', 'If 2^x = 32, what is x?', 1, 'easy', 'SAT Advanced Math - Exponential Functions', '5', '{"criteria": [{"points": 1, "description": "Correct answer: 5"}]}', 5),
('sat-am-exp-6', 'sat-am-exponential', 'Simplify: (3^4)(3^2)', 1, 'easy', 'SAT Advanced Math - Exponential Functions', '3^6 or 729', '{"criteria": [{"points": 1, "description": "Correct simplification"}]}', 6),
('sat-am-exp-7', 'sat-am-exponential', 'If f(x) = 5(2)^x, what is f(3)?', 1, 'easy', 'SAT Advanced Math - Exponential Functions', '40', '{"criteria": [{"points": 1, "description": "Correct answer: 40"}]}', 7),
('sat-am-exp-8', 'sat-am-exponential', 'A population doubles every 3 years. If the initial population is 1000, what is the population after 9 years?', 1, 'medium', 'SAT Advanced Math - Exponential Functions', '8000', '{"criteria": [{"points": 1, "description": "Correct answer: 8000"}]}', 8),
('sat-am-exp-9', 'sat-am-exponential', 'Solve for x: 4^x = 64', 1, 'medium', 'SAT Advanced Math - Exponential Functions', 'x = 3', '{"criteria": [{"points": 1, "description": "Correct answer: 3"}]}', 9),
('sat-am-exp-10', 'sat-am-exponential', 'If 9^x = 27, what is x?', 1, 'medium', 'SAT Advanced Math - Exponential Functions', 'x = 3/2 or 1.5', '{"criteria": [{"points": 1, "description": "Correct answer: 3/2"}]}', 10);