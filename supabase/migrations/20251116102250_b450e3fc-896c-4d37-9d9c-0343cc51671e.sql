-- Add questions to SAT Geometry & Trigonometry topics (Part 1)

-- Add 6 questions to sat-gt-basic-trig (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-trig-5', 'sat-gt-basic-trig', 'In a right triangle, if sin(θ) = 3/5, what is cos(θ)?', 1, 'medium', 'SAT Geometry - Trigonometry', '4/5', '{"criteria": [{"points": 1, "description": "Correct answer: 4/5"}]}', 5),
('sat-gt-trig-6', 'sat-gt-basic-trig', 'If tan(θ) = 1, what is θ in degrees?', 1, 'easy', 'SAT Geometry - Trigonometry', '45°', '{"criteria": [{"points": 1, "description": "Correct angle: 45°"}]}', 6),
('sat-gt-trig-7', 'sat-gt-basic-trig', 'In a right triangle with legs 5 and 12, what is sin(θ) where θ is opposite the leg of length 5?', 1, 'medium', 'SAT Geometry - Trigonometry', '5/13', '{"criteria": [{"points": 1, "description": "Correct ratio"}]}', 7),
('sat-gt-trig-8', 'sat-gt-basic-trig', 'If cos(θ) = 0.6 and θ is acute, what is sin(θ)?', 1, 'hard', 'SAT Geometry - Trigonometry', '0.8', '{"criteria": [{"points": 1, "description": "Correct answer: 0.8"}]}', 8),
('sat-gt-trig-9', 'sat-gt-basic-trig', 'What is the value of sin(30°)?', 1, 'easy', 'SAT Geometry - Trigonometry', '1/2 or 0.5', '{"criteria": [{"points": 1, "description": "Correct value"}]}', 9),
('sat-gt-trig-10', 'sat-gt-basic-trig', 'If tan(θ) = 2, what is sin(θ)/cos(θ)?', 1, 'medium', 'SAT Geometry - Trigonometry', '2', '{"criteria": [{"points": 1, "description": "Recognizes tan = sin/cos"}]}', 10);

-- Add 6 questions to sat-gt-circles (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-circ-5', 'sat-gt-circles', 'A circle has radius 5. What is its circumference?', 1, 'easy', 'SAT Geometry - Circles', '10π or approximately 31.4', '{"criteria": [{"points": 1, "description": "Correct circumference"}]}', 5),
('sat-gt-circ-6', 'sat-gt-circles', 'What is the area of a circle with diameter 8?', 1, 'easy', 'SAT Geometry - Circles', '16π or approximately 50.3', '{"criteria": [{"points": 1, "description": "Correct area"}]}', 6),
('sat-gt-circ-7', 'sat-gt-circles', 'An arc subtends a 60° central angle in a circle with radius 6. What is the arc length?', 1, 'medium', 'SAT Geometry - Circles', '2π', '{"criteria": [{"points": 1, "description": "Correct arc length"}]}', 7),
('sat-gt-circ-8', 'sat-gt-circles', 'What is the area of a sector with a 90° central angle in a circle with radius 4?', 1, 'medium', 'SAT Geometry - Circles', '4π', '{"criteria": [{"points": 1, "description": "Correct sector area"}]}', 8),
('sat-gt-circ-9', 'sat-gt-circles', 'A chord is 8 units from the center of a circle with radius 10. What is the length of the chord?', 1, 'hard', 'SAT Geometry - Circles', '12', '{"criteria": [{"points": 1, "description": "Correct chord length"}]}', 9),
('sat-gt-circ-10', 'sat-gt-circles', 'An inscribed angle subtends the same arc as a 120° central angle. What is the inscribed angle?', 1, 'medium', 'SAT Geometry - Circles', '60°', '{"criteria": [{"points": 1, "description": "Half the central angle"}]}', 10);

-- Add 6 questions to sat-gt-radians (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-rad-5', 'sat-gt-radians', 'Convert 90° to radians.', 1, 'easy', 'SAT Geometry - Radians', 'π/2', '{"criteria": [{"points": 1, "description": "Correct conversion"}]}', 5),
('sat-gt-rad-6', 'sat-gt-radians', 'Convert π/3 radians to degrees.', 1, 'easy', 'SAT Geometry - Radians', '60°', '{"criteria": [{"points": 1, "description": "Correct conversion"}]}', 6),
('sat-gt-rad-7', 'sat-gt-radians', 'What is 180° in radians?', 1, 'easy', 'SAT Geometry - Radians', 'π', '{"criteria": [{"points": 1, "description": "Correct value"}]}', 7),
('sat-gt-rad-8', 'sat-gt-radians', 'Convert 2π/3 radians to degrees.', 1, 'medium', 'SAT Geometry - Radians', '120°', '{"criteria": [{"points": 1, "description": "Correct conversion"}]}', 8),
('sat-gt-rad-9', 'sat-gt-radians', 'An arc of length 5π is on a circle with radius 10. What angle (in radians) does it subtend?', 1, 'medium', 'SAT Geometry - Radians', 'π/2', '{"criteria": [{"points": 1, "description": "Correct angle"}]}', 9),
('sat-gt-rad-10', 'sat-gt-radians', 'Convert 270° to radians.', 1, 'medium', 'SAT Geometry - Radians', '3π/2', '{"criteria": [{"points": 1, "description": "Correct conversion"}]}', 10);

-- Add 6 questions to sat-gt-similarity (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-gt-sim-5', 'sat-gt-similarity', 'Two similar triangles have corresponding sides in ratio 2:3. If the smaller triangle has area 8, what is the area of the larger?', 1, 'hard', 'SAT Geometry - Similarity', '18', '{"criteria": [{"points": 1, "description": "Area ratio is square of side ratio"}]}', 5),
('sat-gt-sim-6', 'sat-gt-similarity', 'If triangles ABC and DEF are similar with AB = 6 and DE = 9, what is the scale factor?', 1, 'easy', 'SAT Geometry - Similarity', '3/2 or 1.5', '{"criteria": [{"points": 1, "description": "Correct scale factor"}]}', 6),
('sat-gt-sim-7', 'sat-gt-similarity', 'Two similar rectangles have perimeters 20 and 30. What is the ratio of their areas?', 1, 'hard', 'SAT Geometry - Similarity', '4:9', '{"criteria": [{"points": 1, "description": "Area ratio calculated correctly"}]}', 7),
('sat-gt-sim-8', 'sat-gt-similarity', 'In similar triangles, if one side is 4 and the corresponding side is 10, what is the ratio?', 1, 'easy', 'SAT Geometry - Similarity', '2:5', '{"criteria": [{"points": 1, "description": "Simplified ratio"}]}', 8),
('sat-gt-sim-9', 'sat-gt-similarity', 'Triangles with sides (3,4,5) and (6,8,10) are similar. What is the scale factor from small to large?', 1, 'easy', 'SAT Geometry - Similarity', '2', '{"criteria": [{"points": 1, "description": "Correct scale factor"}]}', 9),
('sat-gt-sim-10', 'sat-gt-similarity', 'If similar polygons have corresponding sides 5 and 15, their areas are in what ratio?', 1, 'medium', 'SAT Geometry - Similarity', '1:9', '{"criteria": [{"points": 1, "description": "Squares the scale factor"}]}', 10);