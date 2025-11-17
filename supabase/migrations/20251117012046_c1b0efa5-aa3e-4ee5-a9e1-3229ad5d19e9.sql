-- Rewrite SAT Reading questions (Batch 8: Final short broken references)

-- Question: Membership cost
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Premium Fitness Membership Benefits:
- Unlimited gym access 24/7
- All group classes included (yoga, spin, HIIT)
- Personal training session monthly
- Guest passes (2 per month)
- Cost: $79 per month (or $750 annually, save $198)
- No enrollment fee with annual payment"

The passage states that membership costs how much per month?',
    model_answer = '$79 per month

Explanation: The text explicitly lists "Cost: $79 per month."',
    marking_criteria = '{"answer": "$79 / 79 dollars / $79 per month", "explanation": "The membership cost is clearly stated as $79/month"}'
WHERE id = 'sat-a010923b-5b23-4250-be47-43702369df50';

-- Question: Meeting date
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Department Meeting Notice

Date: Thursday, April 18, 2024
Time: 3:00 PM - 4:30 PM
Location: Conference Room 305
Agenda: Q2 budget review, new project proposals, team assignments

Please review the attached quarterly report before attending. RSVP to jsmith@company.com by April 15th."

The text states that the meeting will take place on:',
    model_answer = 'Thursday, April 18, 2024

Explanation: The notice explicitly states "Date: Thursday, April 18, 2024."',
    marking_criteria = '{"answer": "Thursday April 18 / April 18 2024 / Thursday April 18 2024", "explanation": "The meeting date is clearly stated"}'
WHERE id = 'sat-5bb6a68a-00a7-4fb8-a7e8-cb959ee9c232';

-- Question: Discovery year
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The structure of DNA remained a mystery until James Watson and Francis Crick, building on Rosalind Franklin''s crucial X-ray crystallography work, determined its double helix configuration. Their groundbreaking discovery was published in Nature magazine in 1953. This revelation transformed biology, establishing the foundation for modern genetics, molecular medicine, and biotechnology. The discovery earned Watson and Crick the Nobel Prize in 1962, though Franklin''s contribution was not recognized before her death."

The passage states that the discovery was made in what year?',
    model_answer = '1953

Explanation: The passage states the discovery "was published in Nature magazine in 1953."',
    marking_criteria = '{"answer": "1953", "explanation": "The DNA structure discovery occurred in 1953"}'
WHERE id = 'sat-c3b4961a-5252-43fd-b33c-32cb5cab7f63';

-- Question: City population
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Singapore, a city-state at the southern tip of the Malay Peninsula, has transformed from a colonial trading post into a global financial hub. Despite its small land area of just 728 square kilometers, Singapore houses approximately 5.7 million residents, making it one of the world''s most densely populated territories. The population is remarkably diverse, with Chinese, Malay, Indian, and other ethnic groups coexisting in this multilingual society."

The passage mentions that the population of the city is approximately:',
    model_answer = '5.7 million

Explanation: The text explicitly states Singapore "houses approximately 5.7 million residents."',
    marking_criteria = '{"answer": "5.7 million / 5.7 million residents", "explanation": "The population is clearly stated as approximately 5.7 million"}'
WHERE id = 'sat-d20d251a-db36-4968-991b-2b3d6476ad89';

-- Question: Longitudinal data trend
UPDATE curriculum_questions 
SET question = 'Read the following text and examine the data:

"Global Internet Usage (1990-2020)
1990: 2.6 million users (0.05% of global population)
1995: 16 million users (0.4%)
2000: 361 million users (5.8%)
2005: 1.02 billion users (15.7%)
2010: 1.97 billion users (28.8%)
2015: 3.19 billion users (43.4%)
2020: 4.66 billion users (59.5%)

The passage presents this data from 1990 to 2020. What trend does this longitudinal data most clearly reveal?"

The data most clearly reveals:',
    model_answer = 'Exponential growth in global internet adoption

Explanation: The data shows dramatic acceleration—from 2.6 million users (0.05%) in 1990 to 4.66 billion (59.5%) in 2020, with usage percentage increasing over 1000-fold in 30 years.',
    marking_criteria = '{"answer": "exponential growth / rapid increase / dramatic expansion / widespread adoption", "explanation": "The data shows massive acceleration in internet users over 30 years"}'
WHERE id = 'sat-40a097d8-b571-42ae-b84b-c9ae39ec081d';

-- Question: Experiment participants
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Researchers at Stanford University conducted a comprehensive study examining the effects of sleep deprivation on cognitive performance. The experiment enrolled 240 participants aged 18-35, randomly divided into four groups with varying sleep schedules: 4, 6, 8, or 10 hours per night. Over a two-week period, participants completed daily cognitive tests measuring reaction time, memory, and problem-solving. Results showed significant performance decline in groups with less than 7 hours of sleep."

The passage explicitly states that the experiment used how many participants?',
    model_answer = '240 participants

Explanation: The text clearly states "The experiment enrolled 240 participants aged 18-35."',
    marking_criteria = '{"answer": "240 / 240 participants", "explanation": "The study explicitly enrolled 240 participants"}'
WHERE id = 'sat-2fef724c-79e9-42e0-9dfa-1318e624659b';

-- Question: Distance between cities
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The Interstate Highway System revolutionized American transportation. Chicago and Detroit, two major Midwestern manufacturing centers, are connected by Interstate 94, which spans 282 miles through Illinois, Wisconsin, and Michigan. This route facilitates critical trade, with thousands of commercial trucks traveling between the cities daily. Before the interstate, the journey took over 8 hours; now it typically takes 4-5 hours depending on traffic."

The passage states that the distance between the two cities is:',
    model_answer = '282 miles

Explanation: The text explicitly states Interstate 94 "spans 282 miles" connecting Chicago and Detroit.',
    marking_criteria = '{"answer": "282 miles / 282 mi", "explanation": "The passage clearly states the distance is 282 miles"}'
WHERE id = 'sat-5bbe4e3f-e81c-45e2-82eb-b8ee7c64166b';

-- Question: Highway speed limit
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Driving across Montana on Interstate 90 offers stunning mountain views and remarkably sparse traffic. Montana allows the highest speed limits in the United States—80 mph on rural interstates during daytime. This reflects the state''s vast distances and low population density. However, drivers must reduce speed to 65 mph at night and in specific zones near urban areas like Billings and Missoula."

The passage states that the speed limit on the highway is:',
    model_answer = '80 mph (during daytime on rural interstates)

Explanation: The text states Montana allows "80 mph on rural interstates during daytime," though it notes speeds reduce to 65 mph at night.',
    marking_criteria = '{"answer": "80 mph / 80 miles per hour", "explanation": "The daytime rural interstate speed limit is 80 mph"}'
WHERE id = 'sat-7941e69a-691d-4077-a0be-3af80fea2340';

-- Question: Application deadline
UPDATE curriculum_questions 
SET question = 'Read the following announcement:

"Graduate Fellowship Application - 2024 Cycle

The Wilson Research Fellowship provides $50,000 annually for doctoral students pursuing environmental science research. 

Application Requirements:
- Current enrollment in PhD program
- Research proposal (10-15 pages)
- Three letters of recommendation
- Transcript and CV

Deadline: Applications must be submitted by March 1, 2024, at 11:59 PM EST. Late submissions will not be considered. Finalists will be notified by May 15, 2024."

The passage states that the deadline for applications is:',
    model_answer = 'March 1, 2024, at 11:59 PM EST

Explanation: The announcement explicitly states "Applications must be submitted by March 1, 2024, at 11:59 PM EST."',
    marking_criteria = '{"answer": "March 1 2024 / March 1 / 11:59 PM EST March 1", "explanation": "The deadline is clearly specified as March 1, 2024"}'
WHERE id = 'sat-9eeb1711-e5e7-403e-b579-cbe6faef36a2';

-- Question: Character age
UPDATE curriculum_questions 
SET question = 'Read the following text:

"Sarah celebrated her sixteenth birthday last week, earning her driver''s license the same day. She had been counting down the months, eager for the independence driving would bring. Her parents gave her their old Honda Civic—a car she''d been practicing in since she was fifteen and had her learner''s permit."

The text states that the main character is how many years old?',
    model_answer = '16 years old (sixteen)

Explanation: The text explicitly states "Sarah celebrated her sixteenth birthday last week."',
    marking_criteria = '{"answer": "16 / sixteen / 16 years old", "explanation": "Sarah is explicitly stated to be sixteen years old"}'
WHERE id = 'sat-cb833d06-67a0-4fe6-bf39-549d874e989f';