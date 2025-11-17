-- Rewrite SAT Reading questions to be self-contained (Batch 3: Fixing passage references)

-- Question: Climate change graph
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Global average temperatures have risen dramatically since the industrial revolution. Scientific measurements show that Earth''s surface temperature has increased by approximately 1.1°C (2°F) since 1880, with most of this warming occurring in the past 40 years. The seven most recent years (2015-2021) have been the warmest on record. A graph accompanying this passage displays annual global temperature anomalies from 1880 to present, showing a clear upward trend that accelerates after 1970."

The graph showing temperature increases most directly serves to:',
    model_answer = 'Visually represent data mentioned in the text

Explanation: The graph provides visual representation of the numerical data described in the text, supporting and illustrating the claims about rising temperatures with a clear visual format.',
    marking_criteria = '{"answer": "visually represent data / illustrate the trend / support claims / show evidence", "explanation": "Graphs provide visual representation of data, making trends more immediately apparent"}'
WHERE id = 'sat-02604d7f-c138-4592-9acd-5954d400c3b7';

-- Question: Electric vehicles passage beginning
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Although electric vehicles produce no tailpipe emissions, their environmental impact depends on electricity sources. In regions powered by coal, EVs may actually generate more overall emissions than efficient gas cars when accounting for electricity generation. However, as renewable energy adoption grows, EVs become progressively cleaner throughout their lifecycle."

What does "Although" at the beginning signal about the structure of this passage?',
    model_answer = 'A contrast or complication will be presented

Explanation: "Although" introduces a contrasting or qualifying point—EVs seem clean at first glance, but there''s more complexity to consider regarding their actual environmental impact.',
    marking_criteria = '{"answer": "contrast / complication / qualification / complexity", "explanation": "Although signals that a contrast or complication follows the initial statement"}'
WHERE id = 'sat-c221f7b4-fa85-4d11-bda8-09dabfd46e93';

-- Question: Article ending
UPDATE curriculum_questions 
SET question = 'Read the following article excerpt with its concluding sentence:

"Climate scientists have developed increasingly sophisticated models to predict future temperature changes. These models incorporate ocean currents, atmospheric chemistry, and feedback loops. Recent refinements have improved accuracy significantly. Only time will tell whether these predictions prove accurate."

This conclusion most clearly functions to:',
    model_answer = 'Acknowledge uncertainty about future outcomes

Explanation: The phrase "only time will tell" explicitly recognizes that despite improvements in modeling, future accuracy remains uncertain—the conclusion acknowledges limits of prediction.',
    marking_criteria = '{"answer": "acknowledge uncertainty / recognize limitations / express caution / show humility", "explanation": "The conclusion expresses appropriate scientific caution about predictions"}'
WHERE id = 'sat-df21f1be-e068-45ec-b982-8838986d200d';

-- Question: Article with footnotes
UPDATE curriculum_questions 
SET question = 'Read the following article excerpt:

"Quantum entanglement¹ enables particles to remain connected across vast distances. When measuring one particle''s spin², the other instantly exhibits corresponding properties, regardless of separation. This phenomenon³ challenges classical physics assumptions.

¹quantum entanglement: a physical phenomenon where particles become correlated
²spin: an intrinsic form of angular momentum carried by elementary particles
³phenomenon: an observable occurrence or fact"

The footnotes defining specialized terms primarily function to:',
    model_answer = 'Make technical content accessible to general readers

Explanation: The footnotes provide definitions for specialized scientific terms (quantum entanglement, spin, phenomenon), allowing readers unfamiliar with physics terminology to understand the article.',
    marking_criteria = '{"answer": "make content accessible / define technical terms / help general readers / clarify terminology", "explanation": "Footnotes translate technical language for non-expert audiences"}'
WHERE id = 'sat-00f8fb0e-b272-4fec-aecf-777f32fac12d';

-- Question: Character motivation
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Elena stood at the window, watching the rain streak down the glass. Tomorrow she would leave for medical school, finally pursuing the dream her mother never could. The acceptance letter lay on the desk behind her—Johns Hopkins, her mother''s top choice decades ago before family obligations intervened. Elena knew her departure would leave her younger siblings without their primary caregiver, yet her mother insisted she go. ''I gave up my chance,'' her mother had said. ''You won''t give up yours.''"

The passage suggests that Elena''s motivation stems from:',
    model_answer = 'A desire to fulfill both her own dreams and honor her mother''s sacrifice

Explanation: The passage shows Elena is "finally pursuing the dream her mother never could," attending the school that was "her mother''s top choice decades ago." Her mother''s insistence that Elena "won''t give up yours" indicates Elena is motivated by both personal ambition and honoring her mother''s unfulfilled aspirations.',
    marking_criteria = '{"answer": "fulfilling her mothers dream / honoring her mother / personal ambition and family legacy", "explanation": "Elena is motivated by both personal goals and honoring her mother''s sacrifice"}'
WHERE id = 'sat-06a5141b-41f0-43c2-9945-ad70bf902e2d';

-- Question: Author view on technological progress
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Each technological revolution brings both opportunities and challenges. The printing press democratized knowledge but also spread misinformation. Automobiles provided mobility but created pollution and urban sprawl. Digital technology enables global connection but fragments attention spans. History suggests that technological progress is neither inherently beneficial nor harmful—its impact depends on how society chooses to deploy and regulate it."

The passage most strongly suggests that the author views technological progress as:',
    model_answer = 'Morally neutral, with outcomes determined by human choices

Explanation: The author argues technology is "neither inherently beneficial nor harmful" and that "its impact depends on how society chooses to deploy and regulate it," indicating technology itself is neutral—its effects depend on human decisions.',
    marking_criteria = '{"answer": "neutral / depends on human choices / neither good nor bad / determined by how its used", "explanation": "The passage emphasizes technology is neutral and outcomes depend on human choices"}'
WHERE id = 'sat-4b70d1b3-8b5d-4e25-bb25-3bc141b404e5';

-- Question: Species adaptation factor
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The Galápagos finches exhibit remarkable diversity in beak shapes, each adapted to specific food sources. Finches with thick, strong beaks crack seeds efficiently, while those with thin, pointed beaks probe insects from bark. During the 1977 drought, when seeds became scarce but insects remained available, finch populations with appropriate beak morphology survived at higher rates. Genetic analysis revealed that beak shape is highly heritable, allowing rapid evolutionary change across generations. This variation in beak morphology, combined with environmental pressure, drove the observed adaptation."

Based on the passage, which factor most directly contributed to the species'' adaptation?',
    model_answer = 'Pre-existing genetic variation combined with environmental selection pressure

Explanation: The passage states beak shape is "highly heritable" (genetic variation) and that during drought conditions (environmental pressure), "finch populations with appropriate beak morphology survived at higher rates" (selection). Both factors working together drove adaptation.',
    marking_criteria = '{"answer": "genetic variation and selection / heritable traits and environmental pressure / variation plus selection", "explanation": "Adaptation required both pre-existing variation and environmental pressure selecting for specific traits"}'
WHERE id = 'sat-813c55cb-4fce-48e0-b93b-8eca292950a8';