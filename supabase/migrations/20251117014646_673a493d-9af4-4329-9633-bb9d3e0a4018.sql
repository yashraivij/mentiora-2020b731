-- Phase 1 Batch 1 (continued): Questions 11-21

-- Question 11: Parallel lines
UPDATE curriculum_questions
SET 
  question = 'Which equation represents a line parallel to y = 3x + 2?',
  marking_criteria = '{"answer": "y = 3x - 5", "explanation": "Parallel lines have the same slope. The slope is 3, so y = 3x - 5 is parallel (different y-intercept, same slope)."}'::jsonb
WHERE id = 'sat-97190061-342d-44b1-ad10-1d4e7f1c238e';

-- Question 12: Perfect square
UPDATE curriculum_questions
SET 
  question = 'If x² - 6x + k = (x - 3)², what is the value of k?',
  marking_criteria = '{"answer": "9", "explanation": "Expand (x - 3)²: x² - 6x + 9. Comparing to x² - 6x + k, we see k = 9."}'::jsonb
WHERE id = 'sat-b04c901b-ec58-418a-a342-66b5384f99e2';

-- Question 13: FOIL method
UPDATE curriculum_questions
SET 
  question = 'Which expression is equivalent to (2x + 3)(x - 4)?',
  marking_criteria = '{"answer": "2x² - 5x - 12", "explanation": "Use FOIL: (2x)(x) + (2x)(-4) + (3)(x) + (3)(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12."}'::jsonb
WHERE id = 'sat-c81c0f99-8db1-489a-80bb-d9f788d9e8a6';

-- Question 14: Survey statistics
UPDATE curriculum_questions
SET 
  question = 'A survey of 200 people found that 60% like coffee and 40% like tea. If 25% like both, how many people like neither coffee nor tea?',
  marking_criteria = '{"answer": "50", "explanation": "Like coffee only: 60% - 25% = 35%. Like tea only: 40% - 25% = 15%. Like at least one: 35% + 15% + 25% = 75%. Like neither: 100% - 75% = 25% = 50 people."}'::jsonb
WHERE id = 'sat-c8ebd744-7265-461a-b15c-593c537529e5';

-- Question 15: Percentage calculation
UPDATE curriculum_questions
SET 
  question = 'What is 30% of 80?',
  marking_criteria = '{"answer": "24", "explanation": "30% = 0.30, so 0.30 × 80 = 24."}'::jsonb
WHERE id = 'sat-ce6fc484-8c64-4214-866e-46aa5eaf2475';

-- Question 16: AI and employment
UPDATE curriculum_questions
SET 
  question = 'Artificial intelligence will undoubtedly transform many industries, but concerns about AI replacing human workers are often exaggerated. History shows that technological advances typically create more jobs than they eliminate, though the nature of work changes. Based on this passage, which statement would the author most likely agree with?',
  marking_criteria = '{"answer": "Technological change reshapes rather than eliminates employment", "explanation": "The author states that technology typically creates more jobs than they eliminate, though the nature of work changes, supporting this answer."}'::jsonb
WHERE id = 'sat-d39280f1-af32-485f-9dff-910a3d84e943';

-- Question 17: Possessive form
UPDATE curriculum_questions
SET 
  question = 'The ___ findings were published last month. Which choice correctly uses the possessive form for multiple researchers?',
  marking_criteria = '{"answer": "researchers''", "explanation": "For plural nouns ending in s, add only an apostrophe to show possession: researchers''."}'::jsonb
WHERE id = 'sat-df19b596-e5db-46ec-82f1-57fb76c7a22f';

-- Question 18: Temperature graph
UPDATE curriculum_questions
SET 
  question = 'A graph shows global temperature increases from 1900 to 2020, with a sharp upward trend beginning around 1980. Which choice best describes the data in this graph?',
  marking_criteria = '{"answer": "The most significant warming occurred after 1980", "explanation": "The passage explicitly mentions a sharp upward trend beginning around 1980, indicating the most significant warming after that date."}'::jsonb
WHERE id = 'sat-df761cd9-4eb3-4bc1-8542-ce139dfc35f4';

-- Question 19: Paragraph purpose
UPDATE curriculum_questions
SET 
  question = 'The third paragraph begins: However, recent discoveries have forced scientists to reconsider this longstanding theory. New fossil evidence suggests an alternative timeline that contradicts previous assumptions. What is the primary purpose of this paragraph?',
  marking_criteria = '{"answer": "Present a contrasting viewpoint", "explanation": "The paragraph begins with However and describes discoveries that contradict previous assumptions, clearly presenting a contrasting viewpoint."}'::jsonb
WHERE id = 'sat-e698afc6-72db-46c5-9b9e-aa466ae3e9cf';

-- Question 20: Renewable energy
UPDATE curriculum_questions
SET 
  question = 'Solar and wind energy have become increasingly cost-effective alternatives to fossil fuels. Recent studies show that in many regions, renewable energy is now cheaper than coal or natural gas. What does this passage suggest about renewable energy sources?',
  marking_criteria = '{"answer": "Cost-competitive with traditional energy", "explanation": "The passage states that renewable energy is now cheaper than coal or natural gas, making it cost-competitive."}'::jsonb
WHERE id = 'sat-eeeb6e36-b123-4307-a511-d73ec2222899';

-- Question 21: Transition word
UPDATE curriculum_questions
SET 
  question = 'The initial results were promising. ___ the long-term effects remain uncertain. Which choice provides the most effective transition between these sentences?',
  marking_criteria = '{"answer": "However,", "explanation": "The second sentence contrasts with the first (promising vs. uncertain), requiring the contrasting transition However."}'::jsonb
WHERE id = 'sat-f2891228-b14a-4ce3-aace-510fbf58ac8a';