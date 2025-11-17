-- Phase 1 Batch 1: Convert first 70 MCQ questions to open-ended format

-- Question 1: Note-taking study
UPDATE curriculum_questions
SET 
  question = 'A recent study found that students who took notes by hand scored higher on conceptual questions than those who used laptops, despite laptop users recording more information verbatim. What common assumption about note-taking and learning does this study most directly challenge?',
  marking_criteria = '{"answer": "The assumption that more notes lead to better understanding", "explanation": "The study shows that despite recording more information, laptop users scored lower, challenging the assumption that more notes equal better understanding."}'::jsonb
WHERE id = 'sat-0504681f-c786-470f-8fb5-9f352f7edf16';

-- Question 2: Parallel structure
UPDATE curriculum_questions
SET 
  question = 'The program aims to reduce poverty, improving education, and ___. Complete the sentence to maintain parallel structure.',
  marking_criteria = '{"answer": "promoting healthcare", "explanation": "The series uses gerund forms (reducing, improving), so promoting maintains parallel structure."}'::jsonb
WHERE id = 'sat-091fcc33-5e70-454c-95c7-dfc0c09a2215';

-- Question 3: Probability (already complete, just fix marking_criteria)
UPDATE curriculum_questions
SET 
  marking_criteria = '{"answer": "0.12", "explanation": "For independent events: P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12."}'::jsonb
WHERE id = 'sat-0be4711e-47ea-4718-97cb-228ebff78819';

-- Question 4: Bee population decline
UPDATE curriculum_questions
SET 
  question = 'While many focus on charismatic megafauna like pandas and elephants, the decline of bee populations poses a far more immediate threat to human food security. Bees pollinate roughly one-third of the food crops we consume. What is the author''s primary purpose in using the example of bee population decline?',
  marking_criteria = '{"answer": "To illustrate the interconnection between species and human survival", "explanation": "The author contrasts focus on large animals with bees to show how bee decline directly threatens human food security, illustrating species interconnection."}'::jsonb
WHERE id = 'sat-0e455903-701f-42ba-b211-1383a4f7ff71';

-- Question 5: Markup calculation
UPDATE curriculum_questions
SET 
  question = 'A store marks up items by 40%. If an item costs $50 after markup, what was its original cost before the markup was applied?',
  marking_criteria = '{"answer": "$35.71", "explanation": "If original cost is x, then x + 0.40x = 50, so 1.40x = 50, x = 50/1.40 ≈ $35.71."}'::jsonb
WHERE id = 'sat-180a65d2-fd69-4c74-b2ce-ad60a4e8a1c3';

-- Question 6: Novel meaning
UPDATE curriculum_questions
SET 
  question = 'The researcher''s novel approach to treating the disease involved using the body''s own immune system rather than external medications. In this context, what does the word "novel" most nearly mean?',
  marking_criteria = '{"answer": "Original or new", "explanation": "In this context, novel means new or original - describing an innovative approach to treatment."}'::jsonb
WHERE id = 'sat-237d7aa9-9e29-47bd-8a45-11c48af3f27e';

-- Question 7: Ratio calculation
UPDATE curriculum_questions
SET 
  question = 'If the ratio of boys to girls in a class is 3:5 and there are 24 students total, how many students are girls?',
  marking_criteria = '{"answer": "15", "explanation": "Total ratio parts: 3 + 5 = 8. Girls are 5/8 of total: (5/8) × 24 = 15."}'::jsonb
WHERE id = 'sat-2a698442-dbb1-4ff7-ad92-044fb3632a13';

-- Question 8: Linear equation
UPDATE curriculum_questions
SET 
  question = 'If 3x + 5 = 20, what is the value of x?',
  marking_criteria = '{"answer": "5", "explanation": "Subtract 5 from both sides: 3x = 15. Divide by 3: x = 5."}'::jsonb
WHERE id = 'sat-3119efde-9092-4140-bcb9-66ff46b1f888';

-- Question 9: Text structure
UPDATE curriculum_questions
SET 
  question = 'An article begins with a historical overview of migration patterns, then examines current trends, and concludes with predictions for future population movements. Which choice best describes the overall structure of this text?',
  marking_criteria = '{"answer": "Chronological progression", "explanation": "The text moves from historical to current to future, following a chronological progression through time."}'::jsonb
WHERE id = 'sat-3d8b1f96-ffd6-4b32-9aaa-8df019dda8b0';

-- Question 10: Urban gardens
UPDATE curriculum_questions
SET 
  question = 'Urban gardens provide fresh produce to city residents while also creating green spaces that improve air quality and mental health. What is the main point the text makes about urban gardens?',
  marking_criteria = '{"answer": "They provide multiple community benefits", "explanation": "The passage lists multiple benefits: fresh produce, green spaces, improved air quality, and mental health - all community benefits."}'::jsonb
WHERE id = 'sat-473c315a-d642-4052-8cdd-9f95b7c06d32';