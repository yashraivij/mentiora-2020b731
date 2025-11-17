-- Phase 1 Batch 1 (completing 70): Questions 52-70

-- Question 52: To/too/two
UPDATE curriculum_questions
SET 
  question = 'She walked ___ the library to return the books. Which word is correct?',
  marking_criteria = '{"answer": "to", "explanation": "To indicates direction or movement toward a destination."}'::jsonb
WHERE id = 'sat-2193c5cb-a6d4-4913-8669-1c943916a927';

-- Question 53: Y-intercept
UPDATE curriculum_questions
SET 
  question = 'If a line has slope -2 and passes through the point (3, 4), what is its y-intercept?',
  marking_criteria = '{"answer": "10", "explanation": "Using y = mx + b: 4 = -2(3) + b, so b = 10."}'::jsonb
WHERE id = 'sat-21c430d5-f444-462f-8e7d-b04500eb1bee';

-- Question 54: Criteria plural
UPDATE curriculum_questions
SET 
  question = 'The criteria for admission ___ clearly stated. Which verb is correct?',
  marking_criteria = '{"answer": "are", "explanation": "Criteria is the plural form (singular: criterion), requiring are."}'::jsonb
WHERE id = 'sat-21fcd9cd-34d3-49b4-a09d-90a20ff5b5d1';

-- Question 55: Efficacious meaning
UPDATE curriculum_questions
SET 
  question = 'The treatment was efficacious, successfully curing the disease. What does "efficacious" most nearly mean?',
  marking_criteria = '{"answer": "effective", "explanation": "Efficacious means successful in producing the desired result."}'::jsonb
WHERE id = 'sat-224b4e1d-1e29-4382-933a-bb466cc420b6';

-- Question 56: Neither/nor agreement
UPDATE curriculum_questions
SET 
  question = 'Neither the teachers nor the principal ___ aware of the schedule change. Which verb is correct?',
  marking_criteria = '{"answer": "was", "explanation": "With neither/nor, the verb agrees with the closer subject (principal), which is singular."}'::jsonb
WHERE id = 'sat-228db2bf-811e-46ec-941c-d5cbcff0c98c';

-- Question 57: Series verb
UPDATE curriculum_questions
SET 
  question = 'The series of lectures ___ very informative. Which verb is correct?',
  marking_criteria = '{"answer": "is", "explanation": "Series is singular when referring to one set."}'::jsonb
WHERE id = 'sat-22950c12-4390-481a-ace6-16b1ebb592a7';

-- Question 58: Expand perfect square (duplicate)
UPDATE curriculum_questions
SET 
  question = 'Expand the expression: (x + 2)²',
  marking_criteria = '{"answer": "x² + 4x + 4", "explanation": "Perfect square: (a+b)² = a² + 2ab + b²."}'::jsonb
WHERE id = 'sat-22cc23b1-7dc7-4884-bedb-0832f1e751d5';

-- Question 59: Resilient meaning
UPDATE curriculum_questions
SET 
  question = 'The ecosystem was described as resilient, recovering quickly from disturbances. In this context, what does "resilient" most nearly mean?',
  marking_criteria = '{"answer": "able to recover", "explanation": "Resilient means able to recover from or adjust to change or hardship, as shown by recovering quickly."}'::jsonb
WHERE id = 'sat-233ec5c8-67ae-40e2-8f68-0d7e311c8fed';

-- Question 60: Sanguine meaning
UPDATE curriculum_questions
SET 
  question = 'Despite mounting evidence of economic challenges, the CEO remained sanguine about the company''s prospects. She pointed to strong customer loyalty and innovative products currently in development. Her optimistic outlook contrasted sharply with analysts'' more cautious assessments. What does the word "sanguine" most closely mean?',
  marking_criteria = '{"answer": "optimistic", "explanation": "Sanguine means optimistic or positive. The passage explicitly states the CEOs optimistic outlook and contrasts it with more cautious views."}'::jsonb
WHERE id = 'sat-235d81ab-26d6-4beb-b810-8ff327f23d62';

-- Question 61: Green spaces mental health evidence
UPDATE curriculum_questions
SET 
  question = 'Urban planners increasingly recognize that green spaces—parks, gardens, and tree-lined streets—offer more than aesthetic value to cities. Recent studies suggest these areas may provide significant mental health benefits to residents. However, the mechanisms through which nature exposure affects psychological well-being remain under investigation. Some researchers propose that green spaces reduce stress by providing respite from urban stimuli, while others suggest that the physical activity encouraged by parks drives the mental health improvements. Which finding would best support the claim that green spaces provide mental health benefits?',
  marking_criteria = $json${"answer": "A longitudinal study showing that residents living within 300 meters of parks reported 15 percent fewer symptoms of anxiety and depression than those living farther away", "explanation": "This choice directly links proximity to green spaces with reduced mental health symptoms, providing quantified evidence of the claimed benefit. The longitudinal design strengthens causality."} $json$::jsonb
WHERE id = 'sat-24042191-cf95-4eee-9ef1-e87133ff1655';