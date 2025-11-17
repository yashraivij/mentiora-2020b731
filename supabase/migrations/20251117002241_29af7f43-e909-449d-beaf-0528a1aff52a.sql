-- Rewrite SAT Reading questions to be self-contained (Batch 1: Inferences - Part 1)
-- These questions will now include all necessary context directly in the question text

-- Question 1: Experiment duration
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Researchers conducted a controlled study to examine the effects of daily meditation on stress levels. The experiment involved 200 participants who were divided into two groups. One group practiced 20 minutes of guided meditation each day, while the control group maintained their normal routine. Participants completed stress assessment surveys at the beginning and end of the three-month study period. Results showed that the meditation group reported a 35% reduction in perceived stress levels compared to just 8% in the control group."

Based on this text, the experiment lasted:',
    model_answer = 'Three months

Explanation: The text explicitly states "at the beginning and end of the three-month study period," indicating the experiment duration was three months.',
    marking_criteria = '{"answer": "three months / 3 months / three-month", "explanation": "The passage clearly states the study period was three months"}'
WHERE id = 'sat-19241608-7855-4ebc-967c-a7db48f46310';

-- Question 2: Meeting location
UPDATE curriculum_questions 
SET question = 'Read the following text:

"To: All Department Staff
From: Sarah Martinez, Office Manager
Re: Monthly Team Meeting

Our next monthly team meeting will be held on Friday, March 15th at 2:00 PM in Conference Room B on the third floor. Please bring your quarterly reports and be prepared to discuss project updates. Coffee and refreshments will be provided. If you cannot attend, please notify me by Wednesday so we can arrange a video call link."

According to this text, the meeting will be held at which location?',
    model_answer = 'Conference Room B (on the third floor)

Explanation: The email explicitly states the meeting location as "Conference Room B on the third floor."',
    marking_criteria = '{"answer": "Conference Room B / Room B / Conference Room B on the third floor", "explanation": "The text clearly identifies Conference Room B as the meeting location"}'
WHERE id = 'sat-432b1501-a270-44d5-a111-bfe0a03d485a';

-- Question 3: Renewable energy sources
UPDATE curriculum_questions 
SET question = 'Read the following text:

"The global shift toward sustainable energy has accelerated dramatically in recent years. Renewable energy sources such as solar and wind power have become increasingly cost-effective, with solar panel costs dropping by over 80% since 2010. Many countries have set ambitious targets to transition away from fossil fuels. Denmark now generates over 50% of its electricity from wind power, while Costa Rica runs primarily on hydroelectric and geothermal energy. These clean energy technologies not only reduce carbon emissions but also create new jobs in manufacturing, installation, and maintenance sectors."

Based on this text, renewable energy sources include:',
    model_answer = 'Solar and wind power (also acceptable: hydroelectric and geothermal)

Explanation: The text explicitly lists "solar and wind power" as renewable energy sources, and also mentions hydroelectric and geothermal energy as examples of clean energy technologies.',
    marking_criteria = '{"answer": "solar and wind / solar, wind / solar, wind, hydroelectric, geothermal", "explanation": "The passage explicitly identifies solar and wind as renewable energy sources, with hydroelectric and geothermal also mentioned"}'
WHERE id = 'sat-57d4385e-7e04-40be-bdb0-eb6e0fc2956c';

-- Question 4: Water intake recommendation
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Proper hydration is essential for maintaining optimal health and body function. While individual needs vary based on activity level, climate, and body size, health experts generally recommend drinking at least 8 cups (64 ounces) of water daily. Water regulates body temperature, transports nutrients, removes waste, and cushions joints. Dehydration can lead to fatigue, headaches, and decreased cognitive performance. Many people mistake thirst for hunger, leading to unnecessary snacking. Athletes and those in hot climates may need to consume significantly more water to replace fluids lost through sweating."

According to this text, the recommended daily water intake is:',
    model_answer = '8 cups (or 64 ounces)

Explanation: The passage clearly states "health experts generally recommend drinking at least 8 cups (64 ounces) of water daily."',
    marking_criteria = '{"answer": "8 cups / eight cups / 64 ounces", "explanation": "The text explicitly recommends 8 cups or 64 ounces of water daily"}'
WHERE id = 'sat-d14cad88-d501-4e22-8707-9640ed66b9b0';

-- Question 5: Capital city
UPDATE curriculum_questions 
SET question = 'Read the following text:

"The United States federal government operates from Washington, D.C., the nation''s capital city. Founded in 1790, Washington, D.C. was specifically designed to serve as the seat of federal power, distinct from any state. The city houses all three branches of government: the legislative (Congress), executive (White House), and judicial (Supreme Court). With a population of approximately 700,000 residents, D.C. residents have faced unique challenges regarding representation, as the district is not a state and has limited voting rights in Congress."

According to this text, the capital city is:',
    model_answer = 'Washington, D.C.

Explanation: The passage explicitly identifies Washington, D.C. as "the nation''s capital city" in the first sentence.',
    marking_criteria = '{"answer": "Washington D.C. / Washington DC / D.C. / Washington", "explanation": "The text clearly states Washington, D.C. is the capital"}'
WHERE id = 'sat-e68b46a3-9b00-4d2b-8a02-cef9879041e9';

-- Question 6: Unemployment graph inference  
UPDATE curriculum_questions 
SET question = 'Read the following text and examine the described data:

"Between 2008 and 2010, the United States experienced a severe economic recession. Unemployment rates rose sharply from 5% in early 2008 to a peak of 10% in October 2009. In response, the federal government enacted several stimulus packages, including the American Recovery and Reinvestment Act in February 2009, which invested $787 billion in infrastructure projects, unemployment benefits, and tax credits. 

Following these interventions, unemployment gradually declined. By 2011, the rate had dropped to 9%, and it continued falling to 7% by 2013 and 5% by 2015. Economists continue to debate the extent to which government policy versus natural economic recovery drove these improvements."

A graph showing unemployment rates from 2008-2015, combined with this text, best supports which inference?',
    model_answer = 'Government policy can influence employment levels

Explanation: The correlation between the implementation of government stimulus packages (2009) and the subsequent steady decline in unemployment rates (from 10% in 2009 to 5% by 2015) suggests that government policy can affect employment, though the text notes economists debate the extent of this influence.',
    marking_criteria = '{"answer": "government policy can influence employment / policy affects unemployment / government intervention impacts jobs", "explanation": "The timing of policy changes and unemployment trends suggests governmental influence on employment levels"}'
WHERE id = 'sat-160d09fa-e8e0-499f-90ff-02c0609ccb72';