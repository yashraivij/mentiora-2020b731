-- Phase 1 Batch 1 (continued): Questions 37-55

-- Question 37: Average
UPDATE curriculum_questions
SET 
  question = 'What is the average of 20, 30, and 40?',
  marking_criteria = '{"answer": "30", "explanation": "Sum = 90, divided by 3 = 30."}'::jsonb
WHERE id = 'sat-133a19ea-a943-4f2d-bf65-50a2d52133b8';

-- Question 38: Opaque meaning
UPDATE curriculum_questions
SET 
  question = 'The organization''s practices were opaque, lacking transparency. What does "opaque" most nearly mean?',
  marking_criteria = '{"answer": "unclear", "explanation": "Opaque means not transparent or translucent, difficult to understand."}'::jsonb
WHERE id = 'sat-14ad644d-6957-4c38-9618-c42f27e1586e';

-- Question 39: Triangle angles
UPDATE curriculum_questions
SET 
  question = 'What is the sum of the angles in a triangle?',
  marking_criteria = '{"answer": "180°", "explanation": "Triangle angles always sum to 180 degrees."}'::jsonb
WHERE id = 'sat-150afc0e-8b9d-4e6a-a82e-5534ab0c8648';

-- Question 40: Work rate
UPDATE curriculum_questions
SET 
  question = 'If 12 workers complete a job in 6 hours, how long would it take 9 workers to complete the same job?',
  marking_criteria = '{"answer": "8 hours", "explanation": "Total work = 72 worker-hours. Time for 9 workers = 72/9 = 8 hours."}'::jsonb
WHERE id = 'sat-1515e902-6cde-43ab-8daa-9b3073504523';

-- Question 41: Neuroplasticity passage
UPDATE curriculum_questions
SET 
  question = 'For decades, neuroscientists believed adult brains were essentially fixed structures, unable to generate new neurons or substantially reorganize neural connections. This view has been revolutionized by discoveries of neuroplasticity—the brain''s capacity to change throughout life. Learning new skills creates new synaptic connections. Brain regions can reorganize after injury, with undamaged areas sometimes assuming functions of damaged ones. Even personality traits once considered immutable can shift as neural patterns evolve. However, neuroplasticity has limits. Brain changes require consistent effort over time, not overnight transformation. Age reduces but does not eliminate plasticity. Severe damage may exceed the brain''s compensatory abilities. These findings suggest human potential is greater than previously imagined, while remaining constrained by biological realities. Based on this passage, which statement would the author most likely agree with?',
  marking_criteria = $json${"answer": "Adult brains retain significant capacity for change while facing some limitations", "explanation": "The passage describes neuroplasticity as the brain's capacity to change throughout life with examples of learning, reorganization, and personality shifts, but explicitly notes limitations (requires effort, age reduces plasticity, severe damage may exceed compensation)."} $json$::jsonb
WHERE id = 'sat-15604aa5-9a22-4f08-b02f-27f53443c3ba';