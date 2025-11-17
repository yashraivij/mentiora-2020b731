-- Phase 1 Batch 1 (final): Questions 42-70

-- Question 42: Logarithm
UPDATE curriculum_questions
SET 
  question = 'If log base 3 of (x × (x+2)) = 3, what is the value of x?',
  marking_criteria = '{"answer": "5", "explanation": "Converting: x(x+2) = 27, solving gives x = 5."}'::jsonb
WHERE id = 'sat-17d2853e-82e1-4c93-8c3d-8c838c4ece98';

-- Question 43: Loaded language
UPDATE curriculum_questions
SET 
  question = 'A writer opposing a policy uses words like "reckless," "dangerous," and "irresponsible" to describe it. What does this language choice primarily accomplish?',
  marking_criteria = '{"answer": "Frames the policy negatively through loaded language", "explanation": "These evaluative, emotionally charged words shape readers perception negatively rather than describing neutrally."}'::jsonb
WHERE id = 'sat-17fe23ce-965f-4f45-91bf-868ed8d9d1b0';

-- Question 44: Shortest path algorithm
UPDATE curriculum_questions
SET 
  question = 'A network diagram shows nodes connected by edges with different weights. What would the shortest path algorithm prioritize when finding the shortest path?',
  marking_criteria = '{"answer": "The path with lowest sum of edge weights", "explanation": "Shortest path algorithms minimize total weight/cost, not just number of nodes."}'::jsonb
WHERE id = 'sat-1815f574-ff53-4bdb-9a22-5639be602947';

-- Question 45: Dice probability
UPDATE curriculum_questions
SET 
  question = 'When two dice are rolled, what is the probability that the sum equals 7?',
  marking_criteria = '{"answer": "1/6", "explanation": "6 ways to get 7 out of 36 outcomes = 1/6."}'::jsonb
WHERE id = 'sat-19224b88-3a1a-4c2f-b4ab-6d595e30448f';

-- Question 46: Recipe scaling
UPDATE curriculum_questions
SET 
  question = 'A recipe calls for 2 cups of flour to make 12 cookies. How many cups are needed to make 36 cookies?',
  marking_criteria = '{"answer": "6", "explanation": "Ratio: 36/12 = 3 times the recipe, so 2 × 3 = 6 cups."}'::jsonb
WHERE id = 'sat-1a158082-88e1-4071-bf05-16979fd7af4a';

-- Question 47: Perfect square expansion
UPDATE curriculum_questions
SET 
  question = 'Expand: (x + 2)²',
  marking_criteria = '{"answer": "x² + 4x + 4", "explanation": "Perfect square: (a+b)² = a² + 2ab + b²."}'::jsonb
WHERE id = 'sat-1aed7a05-4207-4458-bcf3-78076dac0943';

-- Question 48: Shocking statistic opening
UPDATE curriculum_questions
SET 
  question = 'An article begins with a shocking statistic: "Every 60 seconds, 20 acres of rainforest disappear." What does this opening most clearly aim to accomplish?',
  marking_criteria = '{"answer": "Grab attention and convey urgency", "explanation": "Dramatic statistics in openings capture attention and create sense of urgency about the issue."}'::jsonb
WHERE id = 'sat-1afc0ac6-056d-480a-ba8d-679dc64f806c';

-- Question 49: Neither subject-verb
UPDATE curriculum_questions
SET 
  question = 'Neither of the solutions ___ correct. Which verb is correct?',
  marking_criteria = '{"answer": "is", "explanation": "Neither is singular, requiring singular verb is."}'::jsonb
WHERE id = 'sat-1b32fba0-7cf9-4f71-8186-0eb1a431dabe';

-- Question 50: Simplify expression
UPDATE curriculum_questions
SET 
  question = 'Simplify: 2x + 3x - x',
  marking_criteria = '{"answer": "4x", "explanation": "Combining: 2x + 3x - x = 4x."}'::jsonb
WHERE id = 'sat-1b536ed1-2ca7-4a73-8618-2001e700f7c6';

-- Question 51: Brain computer analogy
UPDATE curriculum_questions
SET 
  question = 'The human brain processes information in ways that superficially resemble a computer: receiving inputs, processing data, and producing outputs. However, this analogy breaks down upon closer examination. Unlike computers that process information serially through fixed logic gates, the brain operates through massively parallel connections between billions of neurons. Neural networks continuously reorganize themselves based on experience. Thoughts emerge from complex interactions across brain regions rather than following programmed sequences. The computer metaphor, while intuitive, ultimately obscures more than it reveals about cognition. What is the author''s primary purpose in introducing the brain-computer comparison?',
  marking_criteria = $json${"answer": "Establish a familiar comparison that the author will then complicate", "explanation": "The passage explicitly uses the brain-as-computer comparison, acknowledges it (superficially resemble), then systematically shows how the analogy fails (however, this analogy breaks down)."} $json$::jsonb
WHERE id = 'sat-1bd23d31-b8c7-435b-87f6-a0325efb6337';