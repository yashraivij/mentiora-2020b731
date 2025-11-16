-- Add questions to remaining SAT Expression of Ideas topics

-- Add 6 questions to sat-ei-transitions (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-ei-trans-5', 'sat-ei-transitions', 'Which transition best connects these contrasting ideas?', 1, 'easy', 'SAT Writing - Transitions', 'However OR Nevertheless', '{"criteria": [{"points": 1, "description": "Appropriate contrast"}]}', 5),
('sat-ei-trans-6', 'sat-ei-transitions', 'Best transition to show cause and effect?', 1, 'easy', 'SAT Writing - Transitions', 'Therefore OR Consequently', '{"criteria": [{"points": 1, "description": "Shows causation"}]}', 6),
('sat-ei-trans-7', 'sat-ei-transitions', 'Which word indicates addition of similar ideas?', 1, 'easy', 'SAT Writing - Transitions', 'Furthermore OR Moreover OR Additionally', '{"criteria": [{"points": 1, "description": "Indicates addition"}]}', 7),
('sat-ei-trans-8', 'sat-ei-transitions', 'Transition to introduce an example?', 1, 'easy', 'SAT Writing - Transitions', 'For instance OR For example', '{"criteria": [{"points": 1, "description": "Introduces example"}]}', 8),
('sat-ei-trans-9', 'sat-ei-transitions', 'Best transition for chronological order?', 1, 'medium', 'SAT Writing - Transitions', 'Subsequently OR Then OR Next', '{"criteria": [{"points": 1, "description": "Shows time sequence"}]}', 9),
('sat-ei-trans-10', 'sat-ei-transitions', 'Transition to emphasize or clarify?', 1, 'medium', 'SAT Writing - Transitions', 'Indeed OR In fact OR Specifically', '{"criteria": [{"points": 1, "description": "Provides emphasis"}]}', 10);

-- Add 6 questions to sat-ei-style-consistency (currently 4)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-ei-style-5', 'sat-ei-style-consistency', 'The passage uses first person throughout. Which is consistent?', 1, 'easy', 'SAT Writing - Style', 'The choice using "I" or "we"', '{"criteria": [{"points": 1, "description": "Person consistency"}]}', 5),
('sat-ei-style-6', 'sat-ei-style-consistency', 'Best match for informal, conversational tone?', 1, 'medium', 'SAT Writing - Style', 'The casual, friendly option', '{"criteria": [{"points": 1, "description": "Tone consistency"}]}', 6),
('sat-ei-style-7', 'sat-ei-style-consistency', 'Passage uses technical terminology. Which fits?', 1, 'medium', 'SAT Writing - Style', 'The option with appropriate jargon', '{"criteria": [{"points": 1, "description": "Vocabulary level consistency"}]}', 7),
('sat-ei-style-8', 'sat-ei-style-consistency', 'Which maintains objective, detached tone?', 1, 'hard', 'SAT Writing - Style', 'The unbiased, factual statement', '{"criteria": [{"points": 1, "description": "Objective tone"}]}', 8),
('sat-ei-style-9', 'sat-ei-style-consistency', 'Passage uses present tense. Which is consistent?', 1, 'easy', 'SAT Writing - Style', 'The present tense option', '{"criteria": [{"points": 1, "description": "Tense consistency"}]}', 9),
('sat-ei-style-10', 'sat-ei-style-consistency', 'Best choice for persuasive, advocacy tone?', 1, 'hard', 'SAT Writing - Style', 'The passionate, compelling option', '{"criteria": [{"points": 1, "description": "Persuasive style"}]}', 10);

-- Add 5 questions to sat-ei-revision (currently 5)
INSERT INTO curriculum_questions (id, topic_id, question, marks, difficulty, spec_reference, model_answer, marking_criteria, order_index) VALUES
('sat-ei-rev-6', 'sat-ei-revision', 'Which revision best combines these choppy sentences?', 1, 'medium', 'SAT Writing - Revision', 'The option using subordination or coordination', '{"criteria": [{"points": 1, "description": "Effective sentence combination"}]}', 6),
('sat-ei-rev-7', 'sat-ei-revision', 'Best way to revise this wordy sentence?', 1, 'medium', 'SAT Writing - Revision', 'The concise, clear option', '{"criteria": [{"points": 1, "description": "Improves concision"}]}', 7),
('sat-ei-rev-8', 'sat-ei-revision', 'Which revision improves parallelism?', 1, 'hard', 'SAT Writing - Revision', 'The option with parallel structure', '{"criteria": [{"points": 1, "description": "Parallel construction"}]}', 8),
('sat-ei-rev-9', 'sat-ei-revision', 'How to improve this vague statement?', 1, 'medium', 'SAT Writing - Revision', 'Add specific details and examples', '{"criteria": [{"points": 1, "description": "Adds specificity"}]}', 9),
('sat-ei-rev-10', 'sat-ei-revision', 'Best revision to eliminate ambiguous pronoun?', 1, 'hard', 'SAT Writing - Revision', 'Replace pronoun with specific noun', '{"criteria": [{"points": 1, "description": "Clarifies reference"}]}', 10);