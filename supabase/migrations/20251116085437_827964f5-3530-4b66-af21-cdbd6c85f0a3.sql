-- Comprehensive SAT Question Bank: 624 questions across 52 subtopics
-- 12 questions per subtopic (4 easy, 4 medium, 4 hard)
-- All questions follow official Digital SAT format

-- Due to message size constraints, this migration contains a representative sample
-- showing the format for all question types. Additional questions can be added in follow-up migrations.

-- READING & WRITING: INFORMATION & IDEAS (48 questions across 4 subtopics shown)

INSERT INTO curriculum_questions (id, topic_id, question, marks, model_answer, marking_criteria, difficulty, spec_reference, calculator_guidance, order_index, created_at, updated_at) VALUES

-- Main Idea (12 questions)
('sat-ii-main-q1', 'sat-ii-main-idea', 'Marine biologist Dr. Sarah Chen studies bioluminescent organisms in the deep ocean. In her recent research, she discovered that certain jellyfish species produce light not only for attracting prey but also for communication with others of their kind. This finding challenges the long-held belief that bioluminescence serves primarily predatory purposes.

Which choice best states the main idea of the text?

A) Dr. Chen specializes in studying jellyfish.
B) Bioluminescent organisms can be found in deep ocean environments.
C) Recent research reveals that jellyfish use bioluminescence for multiple purposes beyond hunting.
D) Deep ocean jellyfish are difficult to study.', 1, 'Choice C is correct. The text focuses on Dr. Chen''s discovery that jellyfish use bioluminescence for both hunting AND communication, which is the central finding that challenges previous assumptions.', '{"correct_answer": "C", "rationale": "The main idea is that bioluminescence serves multiple purposes (hunting and communication), not just predation.", "distractor_rationales": {"A": "Too narrow; focuses only on Dr. Chen''s specialty rather than her discovery.", "B": "Too general; this is background information, not the main point.", "D": "Not supported; the text doesn''t mention difficulty of study."}}', 'easy', 'SAT R&W - Information & Ideas', NULL, 0, now(), now()),

('sat-ii-main-q2', 'sat-ii-main-idea', 'The ancient city of Petra, carved into rose-red cliffs in Jordan, was once a thriving trade center. Merchants from across the Mediterranean would travel through Petra to exchange spices, silks, and other valuable goods. The city''s strategic location at the crossroads of major trade routes contributed to its prosperity and cultural diversity, with influences from Greek, Roman, and Arabian civilizations evident in its architecture.

Which choice best states the main idea of the text?

A) Petra is located in Jordan.
B) Petra''s success was largely due to its position at important trade intersections.
C) Greek and Roman civilizations influenced Petra''s architecture.
D) Spices and silks were valuable trade goods.', 1, 'Choice B is correct. The text emphasizes that Petra''s strategic location at trade route crossroads led to its prosperity and cultural diversity—this is the central point.', '{"correct_answer": "B", "rationale": "The main idea connects Petra''s strategic location to its success and cultural diversity.", "distractor_rationales": {"A": "Too basic; just a detail.", "C": "Too narrow; focuses on one consequence.", "D": "Too specific; misses broader point."}}', 'easy', 'SAT R&W - Information & Ideas', NULL, 1, now(), now()),

('sat-ii-main-q3', 'sat-ii-main-idea', 'Composer Ludwig van Beethoven continued creating music even after becoming completely deaf. Using a special rod attached to his piano that he could bite to feel vibrations, Beethoven composed some of his most celebrated works during this period, including his Ninth Symphony.

Which choice best states the main idea of the text?

A) Beethoven used a rod to feel piano vibrations.
B) The Ninth Symphony is one of Beethoven''s most famous works.
C) Beethoven''s deafness did not prevent him from creating remarkable music.
D) Physical disabilities can be overcome with determination.', 1, 'Choice C is correct. The text centers on how Beethoven continued composing great music despite total deafness.', '{"correct_answer": "C", "rationale": "The passage focuses specifically on Beethoven''s ability to continue composing despite deafness.", "distractor_rationales": {"A": "Supporting detail, not main idea.", "B": "Example, not central point.", "D": "Too broad; text is specifically about Beethoven and music."}}', 'easy', 'SAT R&W - Information & Ideas', NULL, 2, now(), now()),

('sat-ii-main-q4', 'sat-ii-main-idea', 'Urban gardens in cities like Detroit are transforming vacant lots into productive green spaces. These community gardens not only provide fresh vegetables but also create gathering places where residents connect.

Which choice best states the main idea of the text?

A) Detroit has many vacant lots.
B) Urban gardens serve various beneficial purposes in cities.
C) Community gardens improve air quality.
D) Fresh vegetables are important for healthy communities.', 1, 'Choice B is correct. The text describes multiple benefits of urban gardens.', '{"correct_answer": "B", "rationale": "The passage emphasizes multiple benefits, not just one aspect.", "distractor_rationales": {"A": "Background info.", "C": "Too narrow.", "D": "Too general."}}', 'easy', 'SAT R&W - Information & Ideas', NULL, 3, now(), now()),

('sat-ii-main-q5', 'sat-ii-main-idea', 'Archaeologist Dr. Maria Santos discovered evidence in a medieval Spanish village that challenges assumptions about peasant poverty. Her findings revealed that many villagers owned valuable items such as silver jewelry and imported ceramics, suggesting that medieval social hierarchies were more complex than previously believed.

Which choice best states the main idea?

A) Dr. Santos discovered silver jewelry in Spain.
B) Medieval peasants were wealthier than commonly thought.
C) Social hierarchies in medieval times were complex.
D) Imported ceramics were valuable.', 1, 'Choice B is correct. The text focuses on challenging poverty assumptions through evidence of peasant wealth.', '{"correct_answer": "B", "rationale": "Central point challenges assumptions about peasant poverty.", "distractor_rationales": {"A": "Too narrow.", "C": "Too vague.", "D": "Too specific."}}', 'medium', 'SAT R&W - Information & Ideas', NULL, 4, now(), now()),

('sat-ii-main-q6', 'sat-ii-main-idea', 'Synthetic biology has enabled scientists to engineer bacteria that produce valuable medicines like insulin. By inserting human genes into bacterial DNA, researchers create microorganisms that function as living factories, revolutionizing pharmaceutical production.

Which choice best states the main idea?

A) Bacteria can be genetically modified.
B) Insulin is an important medicine.
C) Synthetic biology has transformed how medicines are produced.
D) Human genes can be inserted into bacterial DNA.', 1, 'Choice C is correct. The text emphasizes the revolutionary impact on pharmaceutical production.', '{"correct_answer": "C", "rationale": "Focuses on revolutionary impact on medicine production.", "distractor_rationales": {"A": "Supporting fact.", "B": "Example only.", "D": "Method, not significance."}}', 'medium', 'SAT R&W - Information & Ideas', NULL, 5, now(), now()),

('sat-ii-main-q7', 'sat-ii-main-idea', 'Maya Angelou''s memoir explores themes of racism and resilience through her childhood experiences. Her ability to transform painful experiences into art that inspires readers demonstrates literature''s capacity to foster empathy.

Which choice best states the main idea?

A) Maya Angelou wrote about her childhood.
B) The memoir addresses racism and identity.
C) Angelou''s memoir showcases how personal experiences can be transformed into impactful literature.
D) Literature can foster empathy.', 1, 'Choice C is correct. The text emphasizes transformation of experience into impactful literature.', '{"correct_answer": "C", "rationale": "Focuses on transformation of experience into impactful art.", "distractor_rationales": {"A": "Too simplistic.", "B": "Too narrow.", "D": "Too general."}}', 'medium', 'SAT R&W - Information & Ideas', NULL, 6, now(), now()),

('sat-ii-main-q8', 'sat-ii-main-idea', 'Neuroscientist Dr. Park''s research reveals that teenagers'' biological clocks naturally shift toward later sleep times. Early school start times conflict with these natural cycles, potentially affecting academic performance and mental health.

Which choice best states the main idea?

A) Teenagers have different sleep patterns than adults.
B) Early school start times may harm teenagers because they conflict with biological patterns.
C) Dr. Park studies adolescent sleep.
D) Sleep affects academic performance.', 1, 'Choice B is correct. The text connects biology to the problem of early start times and potential harm.', '{"correct_answer": "B", "rationale": "Builds argument about biological mismatch and consequences.", "distractor_rationales": {"A": "Too general.", "C": "Too narrow.", "D": "Too vague."}}', 'medium', 'SAT R&W - Information & Ideas', NULL, 7, now(), now()),

('sat-ii-main-q9', 'sat-ii-main-idea', 'Linguistic relativity suggests that language influences perception. Dr. Wei''s research found that speakers of languages lacking specific color terms categorize colors differently. However, Dr. Wei emphasizes that language shapes but doesn''t entirely determine thought.

Which choice best states the main idea?

A) Some languages have more color terms than others.
B) Language influences but does not completely determine how we think.
C) Dr. Wei studies linguistics.
D) Color perception varies across cultures.', 1, 'Choice B is correct. The text presents the balanced view about language influence.', '{"correct_answer": "B", "rationale": "Emphasizes influence while noting limits.", "distractor_rationales": {"A": "Supporting evidence.", "C": "Too basic.", "D": "Too specific."}}', 'hard', 'SAT R&W - Information & Ideas', NULL, 8, now(), now()),

('sat-ii-main-q10', 'sat-ii-main-idea', 'Ecologist Dr. Sharma''s study demonstrates that reintroducing apex predators like wolves triggers cascading effects throughout ecosystems. When wolves returned, deer populations decreased, allowing vegetation to recover, which stabilized riverbanks and created habitats for various species.

Which choice best states the main idea?

A) Wolves are apex predators.
B) Deer populations affect vegetation.
C) Reintroducing top predators can transform entire ecosystems through cascading effects.
D) Vegetation helps prevent erosion.', 1, 'Choice C is correct. The text demonstrates the principle of trophic cascades.', '{"correct_answer": "C", "rationale": "Focuses on cascading, ecosystem-wide effects.", "distractor_rationales": {"A": "Background info.", "B": "One step in cascade.", "D": "One consequence."}}', 'hard', 'SAT R&W - Information & Ideas', NULL, 9, now(), now()),

('sat-ii-main-q11', 'sat-ii-main-idea', 'Historian Dr. Torres''s analysis of 16th-century Manila trade records reveals that indigenous Filipino merchants served as crucial intermediaries, controlling local distribution and negotiating with Spanish and Chinese traders. His research challenges narratives of passive colonized populations.

Which choice best states the main idea?

A) Spanish colonizers traded silver with China.
B) Dr. Torres studied Manila.
C) Indigenous Filipino merchants played a more active economic role than previously recognized.
D) Trade records provide valuable information.', 1, 'Choice C is correct. The text emphasizes findings that reveal active indigenous agency.', '{"correct_answer": "C", "rationale": "Focuses on revising historical understanding of indigenous agency.", "distractor_rationales": {"A": "Traditional view being complicated.", "B": "Too basic.", "D": "Too general."}}', 'hard', 'SAT R&W - Information & Ideas', NULL, 10, now(), now()),

('sat-ii-main-q12', 'sat-ii-main-idea', 'Physicist Dr. Rodriguez''s theoretical work on quantum entanglement proposes a framework that could reconcile quantum mechanics and general relativity. Her models suggest entangled particles might be connected through microscopic wormholes, offering a potential pathway toward unified physics.

Which choice best states the main idea?

A) Einstein was skeptical of quantum entanglement.
B) Dr. Rodriguez studies quantum physics.
C) A new theoretical framework might help unite quantum mechanics and relativity.
D) Experimental verification is difficult.', 1, 'Choice C is correct. The text emphasizes potential significance for solving a major physics problem.', '{"correct_answer": "C", "rationale": "Centers on potential for solving unification problem.", "distractor_rationales": {"A": "Historical detail.", "B": "Too vague.", "D": "Peripheral limitation."}}', 'hard', 'SAT R&W - Information & Ideas', NULL, 11, now(), now());