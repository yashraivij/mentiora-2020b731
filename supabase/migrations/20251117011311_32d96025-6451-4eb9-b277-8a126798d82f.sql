-- Rewrite SAT Reading questions (Batch 4: Short reference questions - Part 1)

-- Question: Store opening time
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Welcome to Riverside Market! Our hours of operation: Monday-Friday 8:00 AM to 9:00 PM, Saturday 9:00 AM to 10:00 PM, Sunday 10:00 AM to 7:00 PM. We accept cash, credit cards, and mobile payments. Free parking is available in the rear lot."

According to the text, what time does the store open?',
    model_answer = '8:00 AM on weekdays (Monday-Friday), 9:00 AM on Saturday, 10:00 AM on Sunday

Explanation: The text specifies different opening times for different days, with the earliest being 8:00 AM on weekdays.',
    marking_criteria = '{"answer": "8:00 AM / 8 AM / depends on the day / Monday-Friday 8:00 AM", "explanation": "The store has different opening times depending on the day of the week"}'
WHERE id = 'sat-785a150d-b754-4731-a779-9cc736414854';

-- Question: Lunch break time
UPDATE curriculum_questions 
SET question = 'Read the following schedule:

"Daily Conference Schedule
9:00 AM - Opening Remarks
9:30 AM - Keynote Address
10:45 AM - Morning Break
11:00 AM - Panel Discussion
12:30 PM - Lunch Break
2:00 PM - Afternoon Workshops
4:00 PM - Closing Session"

The schedule indicates that lunch break is at what time?',
    model_answer = '12:30 PM

Explanation: The schedule explicitly lists "12:30 PM - Lunch Break."',
    marking_criteria = '{"answer": "12:30 PM / 12:30", "explanation": "The schedule clearly shows lunch break at 12:30 PM"}'
WHERE id = 'sat-e9562c3a-0fdc-4c56-8466-ba7f28f81da6';

-- Question: Bee population decline implications
UPDATE curriculum_questions 
SET question = 'Read the following text:

"While many conservation efforts focus on charismatic megafauna like pandas and elephants, the decline of bee populations poses a far more immediate threat to human food security. Bees pollinate roughly one-third of the food crops we consume. Without bees, many fruits, vegetables, and nuts would become scarce or disappear entirely. Agricultural economists estimate that crop failures from pollinator loss could reduce global food production by 30% or more."

The passage implies that the decline of the bee population could result in:',
    model_answer = 'Reduced crop yields and food scarcity

Explanation: The text states bees pollinate one-third of food crops and that "Without bees, many fruits, vegetables, and nuts would become scarce or disappear entirely," clearly implying reduced agricultural production.',
    marking_criteria = '{"answer": "reduced crop yields / food scarcity / agricultural decline / crop failures", "explanation": "The passage directly links bee decline to crop scarcity and reduced food production"}'
WHERE id = 'sat-e3a925db-3e33-4322-bd7b-4e1ed9b160ed';

-- Question: Leader actions
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"During the economic crisis, Prime Minister Sato made several controversial decisions. She refused bailouts for failing banks, instead investing directly in small businesses and infrastructure. Critics called her reckless, but unemployment fell from 12% to 7% within two years. Later analysis showed her policies prevented systemic collapse while preserving market competition."

The author''s description of the leader''s actions suggests that the leader was:',
    model_answer = 'Bold and unconventional, but ultimately effective

Explanation: The passage describes decisions as "controversial" and that "critics called her reckless" (bold and unconventional), but notes positive outcomes—unemployment fell significantly and policies "prevented systemic collapse" (effective).',
    marking_criteria = '{"answer": "bold / unconventional / effective / decisive / courageous", "explanation": "The leader took controversial actions that proved successful"}'
WHERE id = 'sat-4ea3a1ee-9329-46e9-8774-4f6fc5580c96';

-- Question: Communication requirements
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Effective communication demands more than just transmitting information. The speaker must consider the audience''s background knowledge, cultural context, and emotional state. A technical presentation to engineers differs vastly from explaining the same concept to middle school students. Successful communicators adapt their vocabulary, examples, and tone to match their listeners'' needs and understanding."

The author suggests that effective communication requires:',
    model_answer = 'Adapting the message to the specific audience

Explanation: The passage emphasizes that communicators must "consider the audience''s background knowledge, cultural context, and emotional state" and "adapt their vocabulary, examples, and tone to match their listeners'' needs," highlighting audience adaptation as essential.',
    marking_criteria = '{"answer": "adapting to the audience / considering audience needs / tailoring the message / audience awareness", "explanation": "Effective communication requires adapting language and approach to the specific audience"}'
WHERE id = 'sat-57fd5a74-b98a-431e-b9d9-e2db1db6af75';

-- Question: Industrial Revolution urban effects
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The Industrial Revolution fundamentally transformed urban demographics. Between 1800 and 1850, Manchester''s population exploded from 50,000 to over 300,000 as rural workers flooded into factory towns seeking employment. Similar patterns emerged across England and Europe. Cities struggled to provide adequate housing, sanitation, and infrastructure for these rapid influxes, leading to overcrowded slums, disease outbreaks, and social unrest. A graph showing urban population growth during this period reveals exponential increases in major industrial centers."

The passage suggests that the Industrial Revolution had which of the following effects on urban populations?',
    model_answer = 'Rapid population growth that outpaced infrastructure development

Explanation: The passage describes population "exploding" from 50,000 to 300,000, with cities "struggling to provide adequate housing, sanitation, and infrastructure," leading to "overcrowded slums" and disease—clear evidence that population growth exceeded infrastructure capacity.',
    marking_criteria = '{"answer": "rapid population growth / overcrowding / population exceeded infrastructure / urban migration", "explanation": "The Industrial Revolution caused explosive urban population growth that cities could not accommodate"}'
WHERE id = 'sat-0c718c95-e373-4674-9f82-b1e14ab7b7c8';

-- Question: Education systems chart
UPDATE curriculum_questions 
SET question = 'Read the following text and data description:

"International education performance varies dramatically across nations. Finland consistently ranks among the top, with students averaging 520 on standardized assessments, despite minimal homework and shorter school days. South Korea also scores high (515), but students spend 50+ hours per week studying. The United States averages 490 with moderate study hours. Cuba, despite economic challenges, achieves 500 with a teacher-student ratio of 1:9, compared to 1:16 in the US.

A chart displays these countries'' test scores, study hours, and teacher-student ratios."

This data most strongly suggests that:',
    model_answer = 'High educational performance does not require long study hours or depend solely on economic resources

Explanation: Finland achieves top scores with minimal homework, while Cuba succeeds despite "economic challenges." This shows that factors like teaching quality (evidenced by Cuba''s low teacher-student ratio) matter more than sheer study time or wealth.',
    marking_criteria = '{"answer": "performance doesnt require long hours / multiple factors affect education / efficiency matters more than time / teaching quality matters", "explanation": "The data shows different approaches can achieve high performance—hours studied is not the determining factor"}'
WHERE id = 'sat-d9ee58ec-69ff-4930-9897-695afe60a342';