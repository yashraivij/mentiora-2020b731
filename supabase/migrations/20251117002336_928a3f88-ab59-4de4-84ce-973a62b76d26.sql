-- Rewrite SAT Reading questions to be self-contained (Batch 2: Word Meaning + Main Idea)

-- Word Meaning Question 1: Meticulous
UPDATE curriculum_questions 
SET question = 'Read the following sentence:

"The scientist''s research was meticulous, involving careful attention to every detail of the experimental setup, data collection procedures, and statistical analysis."

In this context, "meticulous" most nearly means:',
    marking_criteria = '{"answer": "thorough / careful / detailed", "explanation": "Meticulous means showing great attention to detail, as demonstrated by the careful attention described"}'
WHERE id = 'sat-1c07957a-1096-433e-bb46-e071c24eaa15';

-- Word Meaning Question 2: Innovative
UPDATE curriculum_questions 
SET question = 'Read the following sentence:

"The solution was innovative, introducing new ideas and methods that had never been attempted before in the field of renewable energy storage."

"Innovative" most nearly means:',
    marking_criteria = '{"answer": "creative / original / novel / new", "explanation": "Innovative means introducing new ideas or methods"}'
WHERE id = 'sat-389a4f6f-58bf-412b-ac4e-8782337ea04b';

-- Word Meaning Question 3: Appeal to authority
UPDATE curriculum_questions 
SET question = 'Read the following advertisement:

"Nine out of ten dentists recommend our toothpaste for superior cavity protection and healthier gums. Trust the experts who know teeth best—choose FreshSmile for your family''s dental health."

This advertisement primarily appeals to:',
    model_answer = 'Authority and expertise

Explanation: Citing dental professionals (dentists) appeals to expert authority—if qualified specialists recommend it, consumers are more likely to trust its effectiveness.',
    marking_criteria = '{"answer": "authority / expertise / expert authority / professional authority", "explanation": "The ad uses dentist recommendations to establish credibility through expert authority"}'
WHERE id = 'sat-6bb0fbcf-45f5-4b8c-983d-7666255e5a10';

-- Word Meaning Question 4: Expert quotes function
UPDATE curriculum_questions 
SET question = 'Read the following excerpt from an article about space exploration:

"The Mars Perseverance rover has exceeded all expectations," explains Dr. Jennifer Trosper, NASA''s Mars 2020 Project Manager. "Not only has it successfully collected rock samples, but its helicopter companion, Ingenuity, has completed over 50 flights—far beyond our initial projections." According to Dr. Sarah Johnson, a planetary geologist at MIT, "These samples will revolutionize our understanding of Mars'' geological history and potential for past life."

The quotations from NASA scientists in this article primarily function to:',
    model_answer = 'Provide expert credibility to the claims

Explanation: Expert quotations from qualified professionals (NASA Project Manager, MIT planetary geologist) lend authority and credibility—their specialized knowledge supports the article''s claims about the mission''s success.',
    marking_criteria = '{"answer": "provide credibility / add authority / establish expertise / support claims", "explanation": "Expert quotes lend professional authority and credibility to the article''s statements"}'
WHERE id = 'sat-828f9f40-c022-4562-bf73-bf5ee9abbd04';

-- Main Idea Question 1: Bee decline
UPDATE curriculum_questions 
SET question = 'Read the following text:

"While many conservation efforts focus on charismatic megafauna like pandas and elephants, the decline of bee populations poses a far more immediate threat to human food security. Bees pollinate roughly one-third of the food crops we consume daily—from almonds and apples to strawberries and cucumbers. Without these essential pollinators, many fruits, vegetables, and nuts would become scarce or disappear entirely from our diets. Yet bee populations have declined by 25% in recent decades due to habitat loss, pesticide use, and climate change. Protecting bees isn''t just about saving insects; it''s about preserving our agricultural systems and food supply."

Which statement best describes the central claim of this text?',
    model_answer = 'Bee conservation is more critical to human food security than conservation of larger animals

Explanation: The passage contrasts the focus on "charismatic megafauna" with the "more immediate threat" posed by bee decline, emphasizing that bees are essential for food crops and that "protecting bees" is about "preserving our agricultural systems and food supply."',
    marking_criteria = '{"answer": "bee conservation is critical for food security / bees are essential for agriculture / bee decline threatens food supply", "explanation": "The text argues bee conservation deserves more attention than larger animal conservation due to their critical role in food production"}'
WHERE id IN (
  SELECT id FROM curriculum_questions 
  WHERE topic_id = 'sat-ii-main-idea' 
  AND question ILIKE '%bee%'
  LIMIT 1
);

-- Main Idea Question 2: Writing systems
UPDATE curriculum_questions 
SET model_answer = 'C

Explanation: The passage states that writing initially served administrative functions but once established "enabled revolutionary new possibilities" including knowledge preservation, legal codes, and literature—showing it enabled new activities beyond its initial purposes. Choice A is wrong because the passage states writing emerged "independently" in multiple regions, not through diffusion. Choice B is incorrect as the passage describes writing expanding "far beyond administration." Choice D is wrong because administration came first, then literature developed later.',
    marking_criteria = '{"answer": "C / enabled activities beyond initial purposes", "explanation": "The passage shows writing expanded from administrative use to enable knowledge preservation, legal standardization, and literature—activities beyond its original purpose"}'
WHERE id = 'sat-0a34f20f-1b20-435b-b8d4-0486635e199c';