-- Phase 1 Batch 1 (continued): Questions 22-40

-- Question 22: Inversion
UPDATE curriculum_questions
SET 
  question = 'Only after finishing the project ___ how difficult it was. Complete the sentence with the grammatically correct phrase.',
  marking_criteria = '{"answer": "did she realize", "explanation": "Only after requires inversion (did she realize)."}'::jsonb
WHERE id = 'sat-0b3e9795-0f0e-4d92-bf82-e00d908c79fa';

-- Question 23: Discriminant
UPDATE curriculum_questions
SET 
  question = 'What is the discriminant of 2x² + 5x - 3 = 0?',
  marking_criteria = '{"answer": "49", "explanation": "Discriminant = b² - 4ac = 25 - 4(2)(-3) = 25 + 24 = 49."}'::jsonb
WHERE id = 'sat-0b4d640a-622d-458e-bbf3-4078f17e910b';

-- Question 24: Climate skeptics
UPDATE curriculum_questions
SET 
  question = 'A writer addressing climate skeptics uses phrases like "you might think" and "many believe" before presenting counterevidence. How does this rhetorical approach most effectively function?',
  marking_criteria = '{"answer": "It acknowledges and then refutes common doubts", "explanation": "Recognizing opposing views before rebutting them addresses reader objections directly and persuasively."}'::jsonb
WHERE id = 'sat-0b5ca07f-c5e7-4100-9efc-c64b8e00cef0';

-- Question 25: Volatile meaning
UPDATE curriculum_questions
SET 
  question = 'The substance was volatile, changing states rapidly under various conditions. In this context, what does "volatile" most nearly mean?',
  marking_criteria = '{"answer": "unstable", "explanation": "Volatile means unstable and liable to change rapidly, as indicated by changing states rapidly."}'::jsonb
WHERE id = 'sat-0b5f5be6-7581-4fe8-9c86-1f2757cecadb';

-- Question 26: Subject-verb agreement
UPDATE curriculum_questions
SET 
  question = 'They ___ watching television when I called. Which verb form is correct?',
  marking_criteria = '{"answer": "were", "explanation": "They (plural) requires were."}'::jsonb
WHERE id = 'sat-0bbb33e4-cb55-4a58-a3a7-f67f89c675b2';

-- Question 27: Confidence interval
UPDATE curriculum_questions
SET 
  question = 'Under what condition does a confidence interval become narrower?',
  marking_criteria = '{"answer": "Sample size increases", "explanation": "Larger samples give more precise estimates."}'::jsonb
WHERE id = 'sat-0bcd2cf2-7ce0-410b-a65d-9f3c1bd7e58a';

-- Question 28: Footnotes function
UPDATE curriculum_questions
SET 
  question = 'An article includes footnotes defining specialized terms. What is the primary function of these footnotes?',
  marking_criteria = '{"answer": "Support readers unfamiliar with technical vocabulary", "explanation": "Footnotes with definitions help readers understand specialized terms without interrupting the main text flow."}'::jsonb
WHERE id = 'sat-0bdd80f6-75bc-4798-8f4d-f4c55454694b';

-- Question 29: Balanced presentation
UPDATE curriculum_questions
SET 
  question = 'A writer discusses both benefits and drawbacks of social media in equal depth before concluding that regulation is needed. What does this balanced presentation most strategically accomplish?',
  marking_criteria = '{"answer": "Demonstrates thoughtful analysis and strengthens the conclusion", "explanation": "Considering both sides thoroughly makes the final recommendation seem well-reasoned rather than biased."}'::jsonb
WHERE id = 'sat-0c278cbf-e104-4563-856e-87ef7ad6f47a';

-- Question 30: Beauty and decay symbolism
UPDATE curriculum_questions
SET 
  question = 'The juxtaposition of beauty and decay in a text''s descriptions most likely emphasizes what theme?',
  marking_criteria = '{"answer": "The passage of time and mortality", "explanation": "Combining beautiful elements with decay symbolizes impermanence and the effects of time."}'::jsonb
WHERE id = 'sat-0c6f6ae1-c75d-404b-bdb3-8a678953a269';

-- Question 31: 30-60-90 triangle
UPDATE curriculum_questions
SET 
  question = 'In a 30-60-90 triangle, if the short leg is 4, what is the length of the hypotenuse?',
  marking_criteria = '{"answer": "8", "explanation": "In 30-60-90 triangle, hypotenuse = 2 × short leg = 8."}'::jsonb
WHERE id = 'sat-0ca299e7-c057-4d56-a827-1f97f9591d41';

-- Question 32: Transition word
UPDATE curriculum_questions
SET 
  question = 'Which transition word best connects these sentences? "Solar panels have become more affordable. ___ many homeowners are installing them."',
  marking_criteria = '{"answer": "Therefore", "explanation": "The second sentence is a result of the first, so therefore shows this causal relationship."}'::jsonb
WHERE id = 'sat-0cdbd327-696f-480a-a73b-0a250a2a8a7d';

-- Question 33: Intransigent meaning
UPDATE curriculum_questions
SET 
  question = 'The negotiators were intransigent, refusing to compromise on key points. What does "intransigent" most nearly mean?',
  marking_criteria = '{"answer": "stubborn", "explanation": "Intransigent means unwilling or refusing to change ones views or compromise - stubborn."}'::jsonb
WHERE id = 'sat-0d6481d2-a972-426d-9901-4ae52092f938';

-- Question 34: Mean calculation
UPDATE curriculum_questions
SET 
  question = 'Data shows: 5, 5, 10, 10, 15, 15, 20. What is the mean?',
  marking_criteria = '{"answer": "11.4", "explanation": "Sum = 80, count = 7, mean = 80/7 = 11.4 approximately."}'::jsonb
WHERE id = 'sat-0dbb1697-8f3e-4ff7-9e1c-89bca9369c33';

-- Question 35: Exponent simplification
UPDATE curriculum_questions
SET 
  question = 'Simplify: x⁰',
  marking_criteria = '{"answer": "1", "explanation": "Any non-zero number to the zero power equals 1."}'::jsonb
WHERE id = 'sat-0e04c80c-15dd-460d-aea2-c444bfe009d7';