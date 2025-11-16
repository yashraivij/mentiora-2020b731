-- Add Expression of Ideas questions (with correct lowercase difficulty)
INSERT INTO curriculum_questions (id, topic_id, question, marks, model_answer, difficulty, spec_reference, marking_criteria, calculator_guidance, order_index) VALUES
('sat-ei-rev-1', 'sat-ei-revision', 'Which choice most effectively combines the sentences?

The company launched a new product. The product was innovative. It received widespread acclaim.

A) product, which was innovative and
B) product; innovative, it
C) product, innovative, and it
D) product that was innovative and', 4, 'A) Uses relative clause for smooth combination', 'medium', 'Expression of Ideas - revision', '{"answer": "A"}', 'non-calc-friendly', 1),
('sat-ei-rev-2', 'sat-ei-revision', 'Which revision best improves the sentence?

Original: The students were excited about the field trip, they had been planning it for months.

A) NO CHANGE
B) trip; they had been
C) trip, and they had been
D) trip because they had been', 4, 'D) Corrects comma splice and adds causal relationship', 'medium', 'Expression of Ideas - revision', '{"answer": "D"}', 'non-calc-friendly', 2),
('sat-ei-rev-3', 'sat-ei-revision', 'Which choice most effectively sets up the information in the next sentence?

[1] The research team made a breakthrough discovery. [2] Years of experimentation had finally paid off.

A) NO CHANGE
B) The discovery revolutionized the field.
C) After a decade of painstaking work, the research team made a breakthrough discovery.
D) The team was thrilled with their results.', 4, 'C) Provides temporal context linking to next sentence', 'medium', 'Expression of Ideas - revision', '{"answer": "C"}', 'non-calc-friendly', 3),
('sat-ei-rev-4', 'sat-ei-revision', 'Which revision most clearly conveys the intended meaning?

Original: The museum features artwork from various periods, which attracts many visitors.

A) NO CHANGE
B) periods. This diversity attracts
C) periods, attracting
D) periods; attracting', 4, 'B) Clarifies referent and strengthens causal relationship', 'medium', 'Expression of Ideas - revision', '{"answer": "B"}', 'non-calc-friendly', 4),
('sat-ei-rev-5', 'sat-ei-revision', 'Which choice best maintains the formal style?

A) The data shows some pretty interesting patterns.
B) The data reveals significant patterns.
C) The data is kind of showing patterns.
D) You can see interesting patterns in the data.', 4, 'B) Maintains formal tone and specificity', 'easy', 'Expression of Ideas - revision', '{"answer": "B"}', 'non-calc-friendly', 5),
('sat-ei-clar-1', 'sat-ei-clarity', 'Which choice most clearly conveys the information?

A) The experiment had results that were not expected.
B) The experiment yielded unexpected results.
C) The results from the experiment were surprising.
D) What the experiment found out was not what was expected.', 4, 'B) Most concise and uses precise vocabulary', 'easy', 'Expression of Ideas - clarity', '{"answer": "B"}', 'non-calc-friendly', 1),
('sat-ei-clar-2', 'sat-ei-clarity', 'Which version is most precise?

A) The temperature went up significantly during summer.
B) The temperature increased by 15 degrees during summer.
C) The temperature got a lot hotter in summer.
D) Summer temperatures were higher than before.', 4, 'B) Provides specific quantitative information', 'medium', 'Expression of Ideas - clarity', '{"answer": "B"}', 'non-calc-friendly', 2),
('sat-ei-clar-3', 'sat-ei-clarity', 'Which choice most clearly expresses the relationship?

A) The policy was implemented, and criticism followed.
B) The policy was implemented; critics opposed it.
C) Despite widespread criticism, the policy was implemented.
D) The policy faced criticism after implementation.', 4, 'C) Explicitly shows contrasting relationship', 'medium', 'Expression of Ideas - clarity', '{"answer": "C"}', 'non-calc-friendly', 3),
('sat-ei-clar-4', 'sat-ei-clarity', 'Which choice provides the clearest information?

A) The building is really old.
B) The building was constructed in the 1800s.
C) The building has been around for a long time.
D) The building dates back to the nineteenth century.', 4, 'D) Precise time period with formal vocabulary', 'easy', 'Expression of Ideas - clarity', '{"answer": "D"}', 'non-calc-friendly', 4),
('sat-ei-red-1', 'sat-ei-redundancy', 'Which choice eliminates redundancy?

A) The final outcome at the end was successful.
B) The final outcome was successful.
C) The outcome at the end was successful.
D) The successful outcome was final.', 4, 'B) Removes redundant phrase while preserving meaning', 'easy', 'Expression of Ideas - redundancy', '{"answer": "B"}', 'non-calc-friendly', 1),
('sat-ei-red-2', 'sat-ei-redundancy', 'Which revision best eliminates unnecessary repetition?

A) The report clearly and obviously demonstrates the need for reform.
B) The report demonstrates the clear need for reform.
C) The report clearly demonstrates the need for reform.
D) The report obviously and clearly demonstrates reform is needed.', 4, 'C) Removes redundant adverb', 'medium', 'Expression of Ideas - redundancy', '{"answer": "C"}', 'non-calc-friendly', 2),
('sat-ei-red-3', 'sat-ei-redundancy', 'Which choice is most concise?

A) She returned back to her hometown where she was born.
B) She returned to her hometown where she was born.
C) She returned to her hometown.
D) She returned to where she was born.', 4, 'C) Hometown implies birthplace', 'medium', 'Expression of Ideas - redundancy', '{"answer": "C"}', 'non-calc-friendly', 3),
('sat-ei-red-4', 'sat-ei-redundancy', 'Which revision eliminates wordiness most effectively?

A) Due to the fact that it was raining, we stayed inside.
B) Because it was raining, we stayed inside.
C) On account of the rain falling, we stayed inside.
D) We stayed inside due to it raining.', 4, 'B) Most concise causal conjunction', 'easy', 'Expression of Ideas - redundancy', '{"answer": "B"}', 'non-calc-friendly', 4),
('sat-ei-log-1', 'sat-ei-logical-order', 'For the most logical order, sentence 2 should be placed:

[1] The invention transformed communication worldwide. [2] Alexander Graham Bell invented the telephone in 1876. [3] Today, billions use mobile versions. [4] Initially, the device could only transmit sound over short distances.

A) where it is now
B) before sentence 1
C) after sentence 3
D) after sentence 4', 4, 'B) Introduction should precede discussion of impact', 'medium', 'Expression of Ideas - logical order', '{"answer": "B"}', 'non-calc-friendly', 1),
('sat-ei-log-2', 'sat-ei-logical-order', 'Which sequence provides the most logical order?

[1] However, recent studies challenge this. [2] For decades, scientists believed the brain stopped developing in early adulthood. [3] Neuroplasticity allows the brain to form new connections throughout life. [4] This discovery has important implications.

A) 1, 2, 3, 4
B) 2, 1, 3, 4
C) 2, 3, 1, 4
D) 3, 2, 1, 4', 4, 'B) Follows logical progression from old to new understanding', 'hard', 'Expression of Ideas - logical order', '{"answer": "B"}', 'non-calc-friendly', 2),
('sat-ei-log-3', 'sat-ei-logical-order', 'The underlined sentence should be placed:

The Amazon rainforest produces 20 percent of the world oxygen. [Underlined: This biodiversity is unmatched anywhere on Earth.] The forest is home to millions of species. Deforestation threatens this vital ecosystem.

A) where it is now
B) before the first sentence
C) after millions of species
D) after the last sentence', 4, 'C) Biodiversity statement follows evidence of species diversity', 'medium', 'Expression of Ideas - logical order', '{"answer": "C"}', 'non-calc-friendly', 3),
('sat-ei-trans-1', 'sat-ei-transitions', 'The museum received record attendance. _____, it expanded its hours of operation.

A) However
B) Consequently
C) Meanwhile
D) Nevertheless', 4, 'B) Indicates causal relationship', 'easy', 'Expression of Ideas - transitions', '{"answer": "B"}', 'non-calc-friendly', 1),
('sat-ei-trans-2', 'sat-ei-transitions', 'Solar panels are expensive to install. _____, they reduce electricity costs over time.

A) Therefore
B) Similarly
C) However
D) Furthermore', 4, 'C) Signals contrasting information', 'easy', 'Expression of Ideas - transitions', '{"answer": "C"}', 'non-calc-friendly', 2),
('sat-ei-trans-3', 'sat-ei-transitions', 'The first experiment failed to produce results. _____, the team refined their methodology for the second attempt.

A) For example
B) In contrast
C) As a result
D) In addition', 4, 'C) Indicates consequence of previous failure', 'medium', 'Expression of Ideas - transitions', '{"answer": "C"}', 'non-calc-friendly', 3),
('sat-ei-trans-4', 'sat-ei-transitions', 'The novel explores themes of identity and belonging. _____, it examines the immigrant experience in America.

A) However
B) Specifically
C) Nevertheless
D) Conversely', 4, 'B) Introduces specific example of general theme', 'medium', 'Expression of Ideas - transitions', '{"answer": "B"}', 'non-calc-friendly', 4),
('sat-ei-style-1', 'sat-ei-style-consistency', 'Which choice best maintains the formal academic tone?

A) Scientists think this theory is really cool and important.
B) Scientists regard this theory as significant and groundbreaking.
C) Scientists are totally into this theory because it is awesome.
D) You should know that scientists love this theory.', 4, 'B) Maintains formal academic vocabulary', 'easy', 'Expression of Ideas - style consistency', '{"answer": "B"}', 'non-calc-friendly', 1),
('sat-ei-style-2', 'sat-ei-style-consistency', 'Which revision maintains the objective tone?

A) Honestly, the data basically proves the hypothesis.
B) In my opinion, the data supports the hypothesis.
C) The data supports the hypothesis.
D) I think you will agree the data supports the hypothesis.', 4, 'C) Removes subjective language and maintains objectivity', 'medium', 'Expression of Ideas - style consistency', '{"answer": "C"}', 'non-calc-friendly', 2),
('sat-ei-style-3', 'sat-ei-style-consistency', 'Which choice best matches the reflective, literary style?

A) The author uses lots of metaphors to get his point across.
B) The author use of metaphor illuminates the central theme.
C) The author throws in metaphors here and there.
D) You can see the author using metaphors throughout.', 4, 'B) Sophisticated vocabulary matching literary analysis', 'medium', 'Expression of Ideas - style consistency', '{"answer": "B"}', 'non-calc-friendly', 3),
('sat-ei-style-4', 'sat-ei-style-consistency', 'Which maintains the informative, explanatory tone?

A) Climate change is a huge deal that is affecting everyone.
B) Climate change represents a significant challenge facing humanity.
C) Climate change is seriously messing things up.
D) We need to talk about how bad climate change is.', 4, 'B) Formal language appropriate for explanatory text', 'easy', 'Expression of Ideas - style consistency', '{"answer": "B"}', 'non-calc-friendly', 4);