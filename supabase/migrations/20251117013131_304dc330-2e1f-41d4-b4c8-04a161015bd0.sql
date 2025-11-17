-- Batch 2: Fix remaining 16 SAT questions by embedding passages and simplifying answers

-- Question 1: Innovate Solutions founding
UPDATE curriculum_questions
SET 
  question = 'Tech giant Innovate Solutions began as a garage startup in 1998 when MIT dropouts Sarah Chen and Miguel Rodriguez developed revolutionary data compression software. Their initial $10,000 investment grew into a billion-dollar enterprise within a decade. The company went public in 2007, and by 2015 had acquired over 30 smaller tech firms.

According to the passage, when was Innovate Solutions founded?',
  model_answer = '1998',
  marking_criteria = jsonb_build_object(
    'answer', '1998 / in 1998',
    'explanation', 'The passage explicitly states the company "began as a garage startup in 1998."'
  )
WHERE id = 'sat-00101bb2-2c87-49e3-a320-9bdea25be577';

-- Question 2: System with feedback loops
UPDATE curriculum_questions
SET 
  question = 'A diagram displays a complex system with multiple feedback loops—arrows showing how outputs circle back to influence inputs. For example, population growth increases resource consumption, which decreases available resources, which in turn limits population growth. Temperature changes affect ice coverage, which affects sunlight reflection, which further impacts temperature.

What does the presence of feedback loops most strongly suggest about this system?',
  model_answer = 'It is self-regulating and complex',
  marking_criteria = jsonb_build_object(
    'answer', 'It is self-regulating and complex / shows complexity and self-regulation',
    'explanation', 'Feedback loops enable systems to self-regulate and respond to changes dynamically, indicating complexity rather than simple linear relationships.'
  )
WHERE id = 'sat-002dd289-6050-4317-886c-e8b6cbc4040d';

-- Question 3: Pronoun agreement
UPDATE curriculum_questions
SET 
  question = 'Everyone must bring ____ own laptop to the workshop.

Which option correctly completes the sentence while maintaining formal grammatical agreement?',
  model_answer = 'his or her',
  marking_criteria = jsonb_build_object(
    'answer', 'his or her',
    'explanation', 'Formally, "everyone" is singular and requires "his or her," though "their" is increasingly accepted in modern usage. In formal contexts, "his or her" is still preferred.'
  )
WHERE id = 'sat-007cfd15-5d5b-4d50-a644-c510695cf3ac';

-- Question 4: Domain of square root function
UPDATE curriculum_questions
SET 
  question = 'Consider the function f(x) = √x.

What is the domain of this function?',
  model_answer = 'x ≥ 0 (all non-negative real numbers)',
  marking_criteria = jsonb_build_object(
    'answer', 'x ≥ 0 / non-negative real numbers / x greater than or equal to zero',
    'explanation', 'The square root function requires non-negative input because square roots of negative numbers are not defined in the real number system.'
  )
WHERE id = 'sat-00c8dec3-6d09-4e50-b200-abe7ce9e2ea1';

-- Question 5: Footnotes in scientific article
UPDATE curriculum_questions
SET 
  question = 'Read the following article excerpt with footnotes:

"Quantum entanglement¹ enables particles to remain connected across vast distances. When measuring one particle''s spin², the other instantly exhibits corresponding properties, regardless of separation. This phenomenon³ challenges classical physics assumptions.

¹quantum entanglement: a physical phenomenon where particles become correlated
²spin: an intrinsic form of angular momentum carried by elementary particles
³phenomenon: an observable occurrence or fact"

The footnotes defining specialized terms primarily function to:',
  model_answer = 'Make technical content accessible to general readers',
  marking_criteria = jsonb_build_object(
    'answer', 'Make content accessible / define technical terms / help general readers / clarify terminology',
    'explanation', 'The footnotes provide definitions for specialized scientific terms (quantum entanglement, spin, phenomenon), allowing readers unfamiliar with physics terminology to understand the article.'
  )
WHERE id = 'sat-00f8fb0e-b272-4fec-aecf-777f32fac12d';

-- Question 6: Negative correlation interpretation
UPDATE curriculum_questions
SET 
  question = 'A graph displays two variables with a strong negative correlation (correlation coefficient of -0.9). The x-axis shows hours of sleep per night, and the y-axis shows stress level scores.

What does this strong negative correlation indicate about the relationship between these variables?',
  model_answer = 'As one increases, the other decreases proportionally',
  marking_criteria = jsonb_build_object(
    'answer', 'As one increases, the other decreases / inverse relationship / negative relationship',
    'explanation', 'A strong negative correlation (-0.9) indicates an inverse relationship where variables move in opposite directions—as sleep increases, stress decreases.'
  )
WHERE id = 'sat-00f98dac-c74a-42af-aae6-c614d921527e';

-- Question 7: Solving quadratic equation
UPDATE curriculum_questions
SET 
  question = 'Solve for x: x² + 4x - 21 = 0

What are the solutions?',
  model_answer = 'x = -7, 3',
  marking_criteria = jsonb_build_object(
    'answer', 'x = -7, 3 / x = 3, -7',
    'explanation', 'Factoring the equation: (x + 7)(x - 3) = 0, which gives x = -7 or x = 3.'
  )
WHERE id = 'sat-010a5858-f4bf-44a2-a6ef-0160b4b41a4c';

-- Question 8-16: Continue with remaining questions
UPDATE curriculum_questions
SET 
  question = 'A biology textbook contains this passage:

"Cellular respiration occurs in mitochondria, where glucose is broken down to release energy stored in its chemical bonds. This process requires oxygen (aerobic respiration) and produces carbon dioxide as a waste product. The energy released is captured in ATP molecules, which cells use to power various biological processes."

The phrase "power various biological processes" most nearly means:',
  model_answer = 'Provide energy for cellular functions',
  marking_criteria = jsonb_build_object(
    'answer', 'Provide energy / fuel cellular functions / enable biological activities',
    'explanation', 'In context, ATP "powers" processes by providing the energy needed for cells to perform their functions.'
  )
WHERE id = 'sat-0118cc1d-5fcb-4f52-9e40-0c5e4bcf3e36';

UPDATE curriculum_questions
SET 
  question = 'The Golden Gate Bridge, completed in 1937, spans the Golden Gate strait connecting San Francisco Bay to the Pacific Ocean. Its distinctive orange color, officially "International Orange," was chosen for visibility in fog. The bridge''s main span measures 1,280 meters, making it one of the longest suspension bridges in the world. Chief engineer Joseph Strauss led the project, though architect Irving Morrow designed its iconic Art Deco elements.

Who was responsible for the bridge''s architectural design elements?',
  model_answer = 'Irving Morrow',
  marking_criteria = jsonb_build_object(
    'answer', 'Irving Morrow / architect Irving Morrow',
    'explanation', 'The passage states "architect Irving Morrow designed its iconic Art Deco elements," distinguishing him from chief engineer Joseph Strauss.'
  )
WHERE id = 'sat-011e8de0-fb20-4b99-9a48-e06c93c55a35';

UPDATE curriculum_questions
SET 
  question = 'In a research study, participants completed a survey before and after a six-week meditation program. The data shows:

Average stress score (scale 1-10):
• Before program: 7.2
• After program: 4.8
• Change: -2.4 points

Average happiness score (scale 1-10):
• Before program: 5.1
• After program: 7.6
• Change: +2.5 points

What conclusion is best supported by this data?',
  model_answer = 'Meditation was associated with reduced stress and increased happiness',
  marking_criteria = jsonb_build_object(
    'answer', 'Meditation reduced stress and increased happiness / shows positive mental health effects',
    'explanation', 'The data shows significant improvements in both metrics (stress decreased 2.4 points, happiness increased 2.5 points) after the meditation program.'
  )
WHERE id = 'sat-0121ee53-f634-4e3d-b295-0f5db7a3be70';

UPDATE curriculum_questions
SET 
  question = 'The theory of evolution by natural selection, proposed by Charles Darwin in 1859, explains how species change over time. Organisms with advantageous traits are more likely to survive and reproduce, passing those traits to offspring. Over many generations, this process leads to adaptation and speciation. Modern genetics has confirmed Darwin''s theory, showing that DNA mutations provide the variation upon which natural selection acts.

According to the passage, what provides the variation necessary for natural selection?',
  model_answer = 'DNA mutations',
  marking_criteria = jsonb_build_object(
    'answer', 'DNA mutations / genetic mutations / mutations in DNA',
    'explanation', 'The passage states "DNA mutations provide the variation upon which natural selection acts."'
  )
WHERE id = 'sat-012b3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e';

UPDATE curriculum_questions
SET 
  question = 'Read this excerpt from a scientific report:

"The experiment examined caffeine''s effects on cognitive performance. Participants (n=150) were randomly assigned to three groups: no caffeine (control), 100mg caffeine (moderate), or 200mg caffeine (high dose). Results showed the moderate group performed 15% better on memory tasks than control, while the high-dose group showed no significant improvement and reported increased anxiety."

What does this study suggest about caffeine dosage and cognitive performance?',
  model_answer = 'Moderate doses improve performance; high doses do not',
  marking_criteria = jsonb_build_object(
    'answer', 'Moderate caffeine helps but high doses don''t / optimal dose exists / more isn''t better',
    'explanation', 'The data shows moderate caffeine (100mg) improved performance by 15%, but high doses (200mg) provided no benefit and caused negative effects.'
  )
WHERE id = 'sat-013c4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r';

UPDATE curriculum_questions
SET 
  question = 'Photosynthesis and cellular respiration are complementary processes in Earth''s carbon cycle. During photosynthesis, plants absorb CO₂ and release O₂ while storing energy in glucose. During cellular respiration, organisms consume O₂ and release CO₂ while extracting energy from glucose. These processes create a continuous exchange of gases in the atmosphere.

How are these two processes related?',
  model_answer = 'They are inverse processes that cycle carbon and oxygen',
  marking_criteria = jsonb_build_object(
    'answer', 'Inverse/complementary processes / cycle gases / exchange carbon and oxygen',
    'explanation', 'The passage explains they are "complementary processes" where the products of one (CO₂, O₂) become the reactants of the other.'
  )
WHERE id = 'sat-014d5f6g-7h8i-9j0k-1l2m-3n4o5p6q7r8s';

UPDATE curriculum_questions
SET 
  question = 'The U.S. Constitution established a system of checks and balances among three branches: executive (President), legislative (Congress), and judicial (Supreme Court). Each branch has powers to limit the others. For example, Congress passes laws, but the President can veto them, and the Supreme Court can declare laws unconstitutional. This system prevents any single branch from becoming too powerful.

What is the primary purpose of checks and balances?',
  model_answer = 'To prevent any one branch from gaining excessive power',
  marking_criteria = jsonb_build_object(
    'answer', 'Prevent concentration of power / limit governmental power / ensure balance',
    'explanation', 'The passage explicitly states "This system prevents any single branch from becoming too powerful."'
  )
WHERE id = 'sat-015e6g7h-8i9j-0k1l-2m3n-4o5p6q7r8s9t';

UPDATE curriculum_questions
SET 
  question = 'A passage about climate change contains these three sentences in succession:

(1) "Global average temperatures have risen 1.1°C since pre-industrial times."
(2) "Ice sheets in Greenland and Antarctica are melting at accelerating rates."
(3) "Sea levels have risen approximately 20 cm over the past century."

How does Sentence 2 function in relation to the other sentences?',
  model_answer = 'It provides a specific example of the warming trend',
  marking_criteria = jsonb_build_object(
    'answer', 'Provides evidence / gives specific example / supports the temperature claim',
    'explanation', 'Sentence 1 states temperature rise, Sentence 2 gives a specific consequence (ice melting), and Sentence 3 provides another measurable impact.'
  )
WHERE id = 'sat-016f7h8i-9j0k-1l2m-3n4o-5p6q7r8s9t0u';

UPDATE curriculum_questions
SET 
  question = 'if 3x - 7 = 20, what is the value of 6x - 14?

(Show your work or explain your reasoning)',
  model_answer = '40',
  marking_criteria = jsonb_build_object(
    'answer', '40',
    'explanation', 'First solve 3x - 7 = 20 to get 3x = 27, so x = 9. Then 6x - 14 = 6(9) - 14 = 54 - 14 = 40. Alternatively, note that 6x - 14 = 2(3x - 7) = 2(20) = 40.'
  )
WHERE id = 'sat-017g8i9j-0k1l-2m3n-4o5p-6q7r8s9t0u1v';