-- Add questions to SAT Geometry & Trigonometry topics (Part 2 - Final)

-- Add 6 questions to sat-gt-area-volume (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-area-5', 'sat-gt-area-volume', 'What is the area of a rectangle with length 8 and width 5?', 1, 'easy', 'SAT Geometry - Area', '40', '{"criteria": [{"points": 1, "description": "Correct area"}]}', 5),
('sat-gt-area-6', 'sat-gt-area-volume', 'A triangle has base 10 and height 6. What is its area?', 1, 'easy', 'SAT Geometry - Area', '30', '{"criteria": [{"points": 1, "description": "Correct area"}]}', 6),
('sat-gt-area-7', 'sat-gt-area-volume', 'What is the volume of a rectangular prism with dimensions 3×4×5?', 1, 'easy', 'SAT Geometry - Volume', '60', '{"criteria": [{"points": 1, "description": "Correct volume"}]}', 7),
('sat-gt-area-8', 'sat-gt-area-volume', 'A cube has side length 4. What is its surface area?', 1, 'medium', 'SAT Geometry - Area', '96', '{"criteria": [{"points": 1, "description": "6 faces, each 16"}]}', 8),
('sat-gt-area-9', 'sat-gt-area-volume', 'What is the volume of a cylinder with radius 3 and height 5?', 1, 'medium', 'SAT Geometry - Volume', '45π or approximately 141.4', '{"criteria": [{"points": 1, "description": "Correct volume"}]}', 9),
('sat-gt-area-10', 'sat-gt-area-volume', 'A trapezoid has bases 6 and 10, and height 4. What is its area?', 1, 'medium', 'SAT Geometry - Area', '32', '{"criteria": [{"points": 1, "description": "(b1+b2)/2 × h"}]}', 10);

-- Add 5 questions to sat-gt-pythagorean (currently 5)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-pyth-6', 'sat-gt-pythagorean', 'A right triangle has legs 9 and 12. What is the hypotenuse?', 1, 'easy', 'SAT Geometry - Pythagorean', '15', '{"criteria": [{"points": 1, "description": "Correct hypotenuse"}]}', 6),
('sat-gt-pyth-7', 'sat-gt-pythagorean', 'The hypotenuse of a right triangle is 13 and one leg is 5. What is the other leg?', 1, 'easy', 'SAT Geometry - Pythagorean', '12', '{"criteria": [{"points": 1, "description": "Correct leg length"}]}', 7),
('sat-gt-pyth-8', 'sat-gt-pythagorean', 'Is a triangle with sides 7, 24, and 25 a right triangle?', 1, 'medium', 'SAT Geometry - Pythagorean', 'Yes', '{"criteria": [{"points": 1, "description": "7²+24²=25²"}]}', 8),
('sat-gt-pyth-9', 'sat-gt-pythagorean', 'What is the diagonal of a square with side length 5?', 1, 'medium', 'SAT Geometry - Pythagorean', '5√2 or approximately 7.07', '{"criteria": [{"points": 1, "description": "Correct diagonal"}]}', 9),
('sat-gt-pyth-10', 'sat-gt-pythagorean', 'A ladder reaches 15 feet up a wall and is 17 feet long. How far from the wall is the base?', 1, 'medium', 'SAT Geometry - Pythagorean', '8 feet', '{"criteria": [{"points": 1, "description": "Correct distance"}]}', 10);

-- Add 5 questions to sat-gt-triangles (currently 5)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-tri-6', 'sat-gt-triangles', 'What is the sum of interior angles in any triangle?', 1, 'easy', 'SAT Geometry - Triangles', '180°', '{"criteria": [{"points": 1, "description": "Correct sum"}]}', 6),
('sat-gt-tri-7', 'sat-gt-triangles', 'In an isosceles triangle, two angles are 50°. What is the third angle?', 1, 'easy', 'SAT Geometry - Triangles', '80°', '{"criteria": [{"points": 1, "description": "Correct angle"}]}', 7),
('sat-gt-tri-8', 'sat-gt-triangles', 'An equilateral triangle has side length 6. What is its perimeter?', 1, 'easy', 'SAT Geometry - Triangles', '18', '{"criteria": [{"points": 1, "description": "3 × 6 = 18"}]}', 8),
('sat-gt-tri-9', 'sat-gt-triangles', 'In triangle ABC, angle A = 60° and angle B = 70°. What is angle C?', 1, 'easy', 'SAT Geometry - Triangles', '50°', '{"criteria": [{"points": 1, "description": "180 - 60 - 70"}]}', 9),
('sat-gt-tri-10', 'sat-gt-triangles', 'What type of triangle has all angles less than 90°?', 1, 'easy', 'SAT Geometry - Triangles', 'Acute triangle', '{"criteria": [{"points": 1, "description": "Correct classification"}]}', 10);