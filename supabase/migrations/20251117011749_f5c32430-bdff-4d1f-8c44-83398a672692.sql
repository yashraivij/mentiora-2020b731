-- Rewrite SAT Reading questions (Batch 7: Data, graphs, and instructions)

-- Question: Economic data prediction
UPDATE curriculum_questions 
SET question = 'Read the following economic data:

"GDP Growth Rates (2015-2023):
2015: 2.9%, 2016: 1.7%, 2017: 2.3%, 2018: 3.0%, 2019: 2.2%, 2020: -3.4% (pandemic), 2021: 5.8% (recovery), 2022: 2.1%, 2023: 2.5%

Unemployment Rate (2015-2023):
2015: 5.3%, 2016: 4.9%, 2017: 4.4%, 2018: 3.9%, 2019: 3.7%, 2020: 8.1% (pandemic spike), 2021: 5.4%, 2022: 3.6%, 2023: 3.5%

Key observation: Excluding the pandemic anomaly, both metrics show gradual improvement with GDP stabilizing around 2-3% and unemployment declining toward 3.5%."

Based on this economic data, which prediction is most justified?',
    model_answer = 'Current trends may continue if conditions remain stable

Explanation: The data shows consistent patterns (GDP around 2-3%, unemployment declining toward 3.5%) in non-pandemic years, suggesting these trends could continue barring major disruptions.',
    marking_criteria = '{"answer": "trends may continue / stability likely / gradual improvement / consistent patterns", "explanation": "The data supports predictions based on maintaining current stable conditions"}'
WHERE id = 'sat-5c8acb86-234f-449a-a6cd-3f8700b7cefa';

-- Question: Contact instructions
UPDATE curriculum_questions 
SET question = 'Read the following instructions:

"Customer Support Information

For technical assistance:
• Phone: 1-800-555-0123 (M-F 9AM-6PM EST)
• Email: support@techcompany.com (24-hour response time)
• Live Chat: Available on our website during business hours

For billing questions, email accounts@techcompany.com. For returns, initiate the process through your account dashboard. All support inquiries should include your order number for faster assistance."

According to the instructions, users should contact support by:',
    model_answer = 'Email, phone, or live chat (with email being available 24/7)

Explanation: The instructions list three methods for technical support: phone during business hours, email with 24-hour response, and live chat during business hours.',
    marking_criteria = '{"answer": "email / phone / live chat / multiple methods", "explanation": "The instructions provide three support contact methods"}'
WHERE id = 'sat-cf83033d-9769-4acf-921a-a7172692c8f2';

-- Question: Recipe baking temperature
UPDATE curriculum_questions 
SET question = 'Read the following recipe:

"Classic Chocolate Chip Cookies

Ingredients: 2¼ cups flour, 1 tsp baking soda, 1 tsp salt, 1 cup butter, ¾ cup sugar, ¾ cup brown sugar, 2 eggs, 2 tsp vanilla, 2 cups chocolate chips

Instructions:
1. Preheat oven to 350°F (175°C)
2. Mix dry ingredients (flour, baking soda, salt)
3. Cream butter and sugars until fluffy
4. Beat in eggs and vanilla
5. Gradually blend in dry mixture
6. Stir in chocolate chips
7. Drop rounded tablespoons onto ungreased cookie sheets
8. Bake 9-11 minutes until golden brown"

According to the recipe, the baking temperature should be:',
    model_answer = '350°F (or 175°C)

Explanation: Step 1 explicitly instructs to "Preheat oven to 350°F (175°C)."',
    marking_criteria = '{"answer": "350°F / 350 degrees / 175°C", "explanation": "The recipe specifies 350°F as the baking temperature"}'
WHERE id = 'sat-1251e459-b1a3-4b75-a64e-bbfff38d84f2';

-- Question: Treaty result
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The Treaty of Tordesillas, signed in 1494 between Spain and Portugal, attempted to resolve territorial disputes over newly discovered lands. Mediated by Pope Alexander VI, the treaty divided the non-European world along a meridian 370 leagues west of the Cape Verde islands. Spain received rights to territories west of this line, while Portugal gained lands to the east. This agreement gave Portugal control over what would become Brazil, while Spain claimed most of the Americas. The immediate result was the establishment of defined territorial claims that prevented immediate military conflict between the two powers."

According to the passage, what was the immediate result of the treaty?',
    model_answer = 'Territorial boundary agreements that prevented conflict

Explanation: The passage states "The immediate result was the establishment of defined territorial claims that prevented immediate military conflict between the two powers."',
    marking_criteria = '{"answer": "defined territorial boundaries / prevented conflict / divided territories / established claims", "explanation": "The treaty immediately established territorial boundaries to prevent war"}'
WHERE id = 'sat-bdbc60f9-77d2-4b2b-bea0-c28da0f03b27';

-- Question: Scatterplot correlation
UPDATE curriculum_questions 
SET question = 'A scatterplot displays data from 100 students, showing hours studied per week (x-axis, 0-30 hours) versus test anxiety scores (y-axis, 1-10 scale). The data points show a clear downward trend from left to right—students who study more hours generally report lower anxiety scores. The correlation coefficient is -0.68.

Based on the scatterplot, which statement is most accurate?',
    model_answer = 'More study time is associated with lower anxiety scores

Explanation: A negative correlation (indicated by the downward trend and -0.68 coefficient) means as one variable increases (study hours), the other decreases (anxiety), so more studying correlates with reduced test anxiety.',
    marking_criteria = '{"answer": "more study correlates with lower anxiety / negative correlation / studying reduces anxiety", "explanation": "Negative correlation means the variables move in opposite directions"}'
WHERE id = 'sat-3089adf5-9bdf-44db-8f70-a5518f7be733';

-- Question: Word resolution context
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"After months of internal debate, the board finally reached a resolution. The CEO announced their determination to pursue the merger despite shareholder concerns. This firm commitment ended weeks of uncertainty, and the team moved forward with renewed focus. The leadership''s unwavering resolve inspired confidence throughout the organization."

Based on the contextual clues, the word "resolution" as used in the passage most likely refers to:',
    model_answer = 'A firm decision or determination

Explanation: Context clues like "determination," "firm commitment," and "unwavering resolve" indicate resolution means a definite decision. The passage shows resolution ending "debate" and "uncertainty" with "focus."',
    marking_criteria = '{"answer": "firm decision / determination / commitment / resolve", "explanation": "Contextual clues indicate resolution means a decisive determination"}'
WHERE id = 'sat-b20219bc-9a02-4fbd-bc6a-0d3ba1e196e2';

-- Question: Graph temperature increase
UPDATE curriculum_questions 
SET question = 'Read the following graph description and data:

"Annual Global Temperature Anomalies (°C above 20th century average)
2015: +0.90°C
2016: +0.95°C
2017: +0.85°C
2018: +0.80°C
2019: +0.95°C
2020: +1.02°C (highest on record)
2021: +0.85°C
2022: +0.88°C
2023: +0.98°C

The graph displays these temperature anomalies as bars, with 2020 showing the tallest bar representing the steepest increase from the previous year."

According to the graph, which year showed the highest temperature increase?',
    model_answer = '2020

Explanation: The data shows 2020 at +1.02°C above the 20th century average, marked as "highest on record," with the graph showing the "tallest bar."',
    marking_criteria = '{"answer": "2020", "explanation": "2020 recorded the highest temperature anomaly at +1.02°C"}'
WHERE id = 'sat-d03a51ef-d512-4c8a-9546-b226b8f1e017';

-- Question: Author tone description
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Current education policy falls short in several critical areas. Class sizes remain too large, teacher salaries lag behind comparable professions, and standardized testing dominates curriculum decisions. However, solutions exist. Increased funding combined with community engagement could reduce class sizes. Competitive compensation would attract talented educators. Performance-based assessment systems could replace excessive testing while maintaining accountability. These changes require political will but are entirely achievable."

Based on this context, the author''s tone can best be described as:',
    model_answer = 'Critical but constructive

Explanation: The author identifies specific problems ("falls short," "remain too large," "lag behind") but follows each critique with practical solutions ("solutions exist," "could reduce," "are entirely achievable"), showing constructive criticism rather than mere complaint.',
    marking_criteria = '{"answer": "critical but constructive / critical and optimistic / problem-solving / solution-oriented", "explanation": "The author critiques problems while offering practical solutions"}'
WHERE id = 'sat-b579a157-6d19-4524-9a6d-43ab22e1a617';