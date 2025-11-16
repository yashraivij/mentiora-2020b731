-- Add questions to SAT Expression of Ideas topics (corrected)

-- Add 7 questions to sat-ei-logical-order (currently 3)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-ei-log-4', 'sat-ei-logical-order', 'Which sentence should come first in the paragraph discussing the water cycle?', 1, 'medium', 'SAT Writing - Logical Order', 'The sentence introducing evaporation', '{"criteria": [{"points": 1, "description": "Correct logical sequence"}]}', 4),
('sat-ei-log-5', 'sat-ei-logical-order', 'Where should the sentence "Moreover, this trend continued into the following decade" be placed?', 1, 'medium', 'SAT Writing - Logical Order', 'After the sentence describing the previous decade', '{"criteria": [{"points": 1, "description": "Correct placement"}]}', 5),
('sat-ei-log-6', 'sat-ei-logical-order', 'Which sentence provides the most logical introduction to the paragraph about renewable energy?', 1, 'easy', 'SAT Writing - Logical Order', 'The sentence defining renewable energy sources', '{"criteria": [{"points": 1, "description": "Appropriate introduction"}]}', 6),
('sat-ei-log-7', 'sat-ei-logical-order', 'To improve the logical flow, sentence 4 should be moved to where?', 1, 'medium', 'SAT Writing - Logical Order', 'Before sentence 2', '{"criteria": [{"points": 1, "description": "Correct repositioning"}]}', 7),
('sat-ei-log-8', 'sat-ei-logical-order', 'Which sentence should be deleted to improve paragraph coherence?', 1, 'hard', 'SAT Writing - Logical Order', 'The sentence about an unrelated topic', '{"criteria": [{"points": 1, "description": "Identifies irrelevant sentence"}]}', 8),
('sat-ei-log-9', 'sat-ei-logical-order', 'The writer wants to add a concluding sentence. Which choice best accomplishes this?', 1, 'medium', 'SAT Writing - Logical Order', 'The sentence summarizing main points', '{"criteria": [{"points": 1, "description": "Effective conclusion"}]}', 9),
('sat-ei-log-10', 'sat-ei-logical-order', 'Which paragraph order creates the most logical progression?', 1, 'hard', 'SAT Writing - Logical Order', 'Chronological or cause-effect order', '{"criteria": [{"points": 1, "description": "Logical organization"}]}', 10);

-- Add 6 questions to sat-ei-redundancy (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-ei-red-5', 'sat-ei-redundancy', 'How should "completely finish" be revised?', 1, 'easy', 'SAT Writing - Redundancy', 'finish', '{"criteria": [{"points": 1, "description": "Removes unnecessary modifier"}]}', 5),
('sat-ei-red-6', 'sat-ei-redundancy', 'Which phrase is redundant? "The final outcome of the game"', 1, 'easy', 'SAT Writing - Redundancy', '"final" (outcome already implies finality)', '{"criteria": [{"points": 1, "description": "Identifies redundant word"}]}', 6),
('sat-ei-red-7', 'sat-ei-redundancy', 'Best revision for "advance forward"?', 1, 'easy', 'SAT Writing - Redundancy', 'advance', '{"criteria": [{"points": 1, "description": "Removes directional redundancy"}]}', 7),
('sat-ei-red-8', 'sat-ei-redundancy', 'Which is most concise? "In my personal opinion, I think"', 1, 'medium', 'SAT Writing - Redundancy', 'I think OR In my opinion', '{"criteria": [{"points": 1, "description": "Eliminates multiple redundancies"}]}', 8),
('sat-ei-red-9', 'sat-ei-redundancy', 'How to improve "past history"?', 1, 'easy', 'SAT Writing - Redundancy', 'history', '{"criteria": [{"points": 1, "description": "Removes temporal redundancy"}]}', 9),
('sat-ei-red-10', 'sat-ei-redundancy', 'Most concise: "The reason why is because"', 1, 'medium', 'SAT Writing - Redundancy', 'The reason is OR because', '{"criteria": [{"points": 1, "description": "Eliminates causal redundancy"}]}', 10);

-- Add 6 questions to sat-ei-clarity (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-ei-clar-5', 'sat-ei-clarity', 'Which revision makes the sentence clearer? "It was mentioned by Sarah."', 1, 'easy', 'SAT Writing - Clarity', 'Sarah mentioned it', '{"criteria": [{"points": 1, "description": "Active voice improves clarity"}]}', 5),
('sat-ei-clar-6', 'sat-ei-clarity', 'Best choice for precision: "The thing was big."', 1, 'medium', 'SAT Writing - Clarity', 'The elephant was enormous', '{"criteria": [{"points": 1, "description": "Specific and precise"}]}', 6),
('sat-ei-clar-7', 'sat-ei-clarity', 'Which makes the meaning clearest? "They went there then."', 1, 'hard', 'SAT Writing - Clarity', 'The students visited the museum yesterday', '{"criteria": [{"points": 1, "description": "Specific references"}]}', 7),
('sat-ei-clar-8', 'sat-ei-clarity', 'Most precise word choice for "nice"?', 1, 'medium', 'SAT Writing - Clarity', 'Context-specific adjective (e.g., pleasant, kind, thoughtful)', '{"criteria": [{"points": 1, "description": "Precise vocabulary"}]}', 8),
('sat-ei-clar-9', 'sat-ei-clarity', 'Clearest structure: "Walking down the street, the trees were beautiful."', 1, 'hard', 'SAT Writing - Clarity', 'Walking down the street, I saw beautiful trees', '{"criteria": [{"points": 1, "description": "Fixes dangling modifier"}]}', 9),
('sat-ei-clar-10', 'sat-ei-clarity', 'Which option eliminates the ambiguity?', 1, 'hard', 'SAT Writing - Clarity', 'The option with clear pronoun reference', '{"criteria": [{"points": 1, "description": "Resolves ambiguity"}]}', 10);