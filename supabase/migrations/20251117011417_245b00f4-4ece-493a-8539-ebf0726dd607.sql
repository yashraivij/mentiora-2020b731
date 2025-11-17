-- Rewrite SAT Reading questions (Batch 5: More inference and implication questions)

-- Question: Systems comparison
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Democratic systems emphasize individual rights and majority rule, allowing citizens to elect representatives and influence policy through voting. In contrast, authoritarian systems concentrate power in a single leader or small group, enabling rapid decision-making but limiting personal freedoms. Each system presents trade-offs: democracies risk gridlock and slow responses to crises, while authoritarian regimes may act swiftly but lack accountability."

The author''s comparison of the two systems suggests that:',
    model_answer = 'Both systems have advantages and disadvantages

Explanation: The passage explicitly presents "trade-offs" for each system—democracies have participation but risk gridlock, while authoritarian systems enable swift action but lack accountability—showing neither is wholly superior.',
    marking_criteria = '{"answer": "both have trade-offs / each has pros and cons / neither is completely superior / advantages and disadvantages", "explanation": "The passage balances strengths and weaknesses of both systems"}'
WHERE id = 'sat-bd8adcf4-efe9-4a0b-b0d6-ce087fc6d85a';

-- Question: Speaker concern
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"We cannot continue depleting ocean fish stocks at current rates. Global fisheries have declined by 70% since 1970. If we maintain present practices, commercial fishing will collapse within decades, devastating coastal economies and eliminating a critical protein source for billions. Immediate action—strict quotas, protected zones, and sustainable practices—is essential."

The passage implies that the speaker''s primary concern is:',
    model_answer = 'Preventing the collapse of ocean fisheries and its consequences

Explanation: The speaker warns "commercial fishing will collapse within decades" with severe effects on "coastal economies" and food security for "billions," emphasizing urgency with "immediate action...is essential."',
    marking_criteria = '{"answer": "preventing fisheries collapse / ocean sustainability / preserving fish stocks / environmental crisis", "explanation": "The passage focuses on urgency of protecting declining fish populations"}'
WHERE id = 'sat-055b5012-ddb0-44dd-8ec2-b3cbaf1937a5';

-- Question: Character opening behavior
UPDATE curriculum_questions 
SET question = 'Read the following opening scene:

"Margaret entered the boardroom fifteen minutes early, as always. She arranged her notes in perfect stacks, checked her phone twice, and adjusted the blinds to eliminate glare on the presentation screen. When colleagues arrived, she had already tested the projector and prepared backup materials. ''Everything ready?'' the CEO asked. Margaret handed him a complete agenda with minute-by-minute timing."

The description of the character''s behavior in the opening scene suggests that she is:',
    model_answer = 'Extremely organized and detail-oriented

Explanation: Margaret arrives early, arranges materials perfectly, tests equipment, and prepares backup materials and detailed timing—all behaviors showing meticulous planning and organizational skills.',
    marking_criteria = '{"answer": "organized / detail-oriented / meticulous / prepared / thorough", "explanation": "Her behaviors demonstrate careful planning and attention to detail"}'
WHERE id = 'sat-6f4c2216-5a87-444b-a729-30de9c5b3f50';

-- Question: Discovery implications
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Archaeologists have discovered a previously unknown civilization in the Amazon rainforest. Lidar technology revealed massive earthworks, sophisticated water management systems, and evidence of urban planning beneath the forest canopy. These findings challenge long-held assumptions that Amazonia supported only small, nomadic groups. Researchers predict this discovery will prompt extensive reassessment of pre-Columbian American history and inspire new expeditions to similar regions."

The passage implies that the discovery will likely lead to:',
    model_answer = 'Re-evaluation of historical assumptions and further archaeological research

Explanation: The text states findings "challenge long-held assumptions" and that "researchers predict...extensive reassessment of pre-Columbian American history" plus "new expeditions"—indicating both theoretical revision and practical research expansion.',
    marking_criteria = '{"answer": "reassessment of history / further research / challenging assumptions / new expeditions", "explanation": "The discovery will prompt both historical re-evaluation and additional archaeological investigation"}'
WHERE id = 'sat-4ae361f7-8266-4fde-9b11-99e510ceeacc';

-- Question: Event description word choice
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The catastrophic flood ravaged the valley, obliterating homes, demolishing bridges, and leaving thousands displaced. Rescue workers struggled through debris-choked streets, while survivors huddled in emergency shelters. The devastation exceeded even the worst predictions."

The author''s word choice when describing the event suggests that it was:',
    model_answer = 'Extremely destructive and severe

Explanation: Words like "catastrophic," "ravaged," "obliterating," "demolishing," and "devastation" all emphasize extreme destruction and severity—the author chose intensely negative language to convey the disaster''s magnitude.',
    marking_criteria = '{"answer": "extremely destructive / severe / catastrophic / devastating", "explanation": "The strong negative word choices emphasize the event''s severity"}'
WHERE id = 'sat-e31dfebd-f28c-415f-b74b-e4e26ce0dd1e';

-- Question: Artist technique description
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Frida Kahlo''s painting technique was intensely deliberate. She spent months on single works, layering thin glazes of oil paint to achieve luminous depth. Each brushstroke served symbolic purpose—every color, texture, and composition element carefully chosen to convey specific emotional or cultural meanings. Critics noted her meticulous attention to detail, from the rendering of individual hairs to the precise placement of symbolic objects."

The author''s description of the artist''s technique suggests that it was:',
    model_answer = 'Highly intentional and carefully executed

Explanation: The passage describes technique as "intensely deliberate," with "months on single works," "each brushstroke served symbolic purpose," and "meticulous attention to detail"—all indicating conscious, careful execution.',
    marking_criteria = '{"answer": "intentional / deliberate / meticulous / carefully planned / symbolic", "explanation": "The description emphasizes conscious, careful craftsmanship with symbolic intent"}'
WHERE id = 'sat-80ee067c-2a03-4ff1-98cb-fb60871e7ed4';

-- Question: Rhetorical questions usage
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Why do we continue to ignore climate warnings? How many record-breaking heat waves must we endure? When will we prioritize future generations over short-term profits? These questions demand answers. The science is clear, the consequences are measurable, and the solutions exist. The only remaining question is whether we have the collective will to act."

The author''s frequent use of rhetorical questions suggests that:',
    model_answer = 'The author is emphasizing urgency and challenging readers to act

Explanation: The rhetorical questions ("Why do we continue...", "How many...", "When will we...") don''t expect literal answers—they challenge complacency and emphasize urgency, followed by direct statements that "these questions demand answers" and questioning "collective will to act."',
    marking_criteria = '{"answer": "emphasizing urgency / challenging readers / provoking thought / demanding action", "explanation": "Rhetorical questions create urgency and challenge the audience to confront the issue"}'
WHERE id = 'sat-50e437e1-19fa-41cd-a163-0d309f3c4188';