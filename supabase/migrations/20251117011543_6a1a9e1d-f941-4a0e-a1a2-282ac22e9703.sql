-- Rewrite SAT Reading questions (Batch 6: "According to" reference questions)

-- Question: Map location
UPDATE curriculum_questions 
SET question = 'Read the following map description:

"City Center Map:
- Main Street runs north-south through downtown
- Oak Avenue intersects Main Street at the central plaza
- The Public Library is located at 450 Oak Avenue (corner of Oak and Elm)
- City Hall is on Main Street, two blocks south of the plaza
- The Museum is on Pine Street, one block east of Main"

According to the map, the library is located on which street?',
    model_answer = 'Oak Avenue

Explanation: The map description explicitly states "The Public Library is located at 450 Oak Avenue."',
    marking_criteria = '{"answer": "Oak Avenue / Oak", "explanation": "The map clearly indicates the library is on Oak Avenue"}'
WHERE id = 'sat-11329d2b-87d0-4bf4-899a-3d92db6001f8';

-- Question: Company founding year
UPDATE curriculum_questions 
SET question = 'Read the following article excerpt:

"Tech giant Innovate Solutions began as a garage startup in 1998 when MIT dropouts Sarah Chen and Miguel Rodriguez developed revolutionary data compression software. Their initial $10,000 investment grew into a billion-dollar enterprise within a decade. The company went public in 2007, and by 2015 had acquired over 30 smaller tech firms."

According to the article, the company was founded in what year?',
    model_answer = '1998

Explanation: The article explicitly states the company "began as a garage startup in 1998."',
    marking_criteria = '{"answer": "1998", "explanation": "The text clearly states the company was founded in 1998"}'
WHERE id = 'sat-00101bb2-2c87-49e3-a320-9bdea25be577';

-- Question: Water boiling temperature
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Water''s phase changes occur at specific temperatures under standard atmospheric pressure. At sea level, water freezes at 0°C (32°F) and boils at 100°C (212°F). However, these temperatures change with altitude—at higher elevations, reduced atmospheric pressure lowers water''s boiling point. In Denver, Colorado (elevation 5,280 feet), water boils at approximately 95°C (203°F), significantly affecting cooking times."

According to the passage, water boils at what temperature?',
    model_answer = '100°C (212°F) at sea level, but lower at higher altitudes (e.g., 95°C in Denver)

Explanation: The passage states water "boils at 100°C (212°F)" under "standard atmospheric pressure" at sea level, but notes the boiling point decreases with altitude.',
    marking_criteria = '{"answer": "100°C / 212°F / depends on altitude / 100 degrees Celsius", "explanation": "Water boils at 100°C at sea level but the temperature varies with altitude"}'
WHERE id = 'sat-54318255-5edc-4ff0-a095-c2c40cf0ae5a';

-- Question: Chlorophyll function
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Photosynthesis enables plants to convert light energy into chemical energy stored in glucose molecules. Chlorophyll, the green pigment in chloroplasts, plays the critical role of absorbing light energy from the sun. Without chlorophyll, plants cannot capture the energy needed to power the conversion of carbon dioxide and water into glucose and oxygen. This pigment absorbs red and blue wavelengths most effectively while reflecting green light, which explains why most plants appear green to our eyes."

According to the passage, what is the primary function of chlorophyll in plants?',
    model_answer = 'Absorbing light energy from the sun

Explanation: The passage states chlorophyll "plays the critical role of absorbing light energy from the sun" and that "Without chlorophyll, plants cannot capture the energy" needed for photosynthesis.',
    marking_criteria = '{"answer": "absorbing light energy / capturing sunlight / absorbing solar energy", "explanation": "Chlorophyll absorbs light energy which is essential for photosynthesis"}'
WHERE id = 'sat-36f8ac66-2f81-4dbc-aead-a47906827d16';

-- Question: Bread main ingredient
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"Traditional bread-making is deceptively simple, requiring just four core ingredients. Flour forms the foundation—wheat flour being most common, providing the gluten proteins that create bread''s structure. Water activates the gluten and dissolves other ingredients. Yeast, a living microorganism, consumes sugars and produces carbon dioxide gas that makes dough rise. Salt enhances flavor and controls yeast activity. While modern breads often include additional ingredients like milk, eggs, or sweeteners, these four elements remain fundamental."

According to the passage, the main ingredient in traditional bread is:',
    model_answer = 'Flour (specifically wheat flour)

Explanation: The passage states "Flour forms the foundation" and describes it as "most common" and providing "the gluten proteins that create bread''s structure," establishing flour as the primary structural ingredient.',
    marking_criteria = '{"answer": "flour / wheat flour", "explanation": "The passage identifies flour as the foundational ingredient that forms bread''s structure"}'
WHERE id = 'sat-808a0c94-e83f-40a0-bdf4-567b61f26551';

-- Question: Warranty coverage duration
UPDATE curriculum_questions 
SET question = 'Read the following warranty information:

"Limited Product Warranty

This laptop is covered by a 2-year manufacturer''s warranty from the date of purchase. The warranty covers defects in materials and workmanship under normal use. Accidental damage, liquid spills, and unauthorized modifications void the warranty. Extended coverage plans (3 or 5 years) are available for purchase within 30 days of original purchase."

According to the warranty, coverage lasts for how long?',
    model_answer = '2 years (with optional extensions available)

Explanation: The warranty clearly states "2-year manufacturer''s warranty from the date of purchase," though extended plans of 3 or 5 years can be purchased separately.',
    marking_criteria = '{"answer": "2 years / two years", "explanation": "The standard warranty provides 2 years of coverage"}'
WHERE id = 'sat-0e75b18f-929e-4117-9405-f927fb245815';

-- Question: Monument construction century
UPDATE curriculum_questions 
SET question = 'Read the following passage:

"The Colosseum stands as ancient Rome''s most iconic structure. Construction began in 72 CE under Emperor Vespasian and was completed in 80 CE by his son Titus. This massive amphitheater could hold 50,000-80,000 spectators who gathered to watch gladiatorial contests, animal hunts, and dramatic performances. The structure''s innovative use of concrete and complex system of vaults influenced architectural design for centuries."

According to the passage, the monument was built during which century?',
    model_answer = 'The 1st century CE (or 70s-80s CE)

Explanation: The passage states construction occurred from "72 CE under Emperor Vespasian" to "80 CE by his son Titus," placing construction in the first century CE.',
    marking_criteria = '{"answer": "1st century / first century / 1st century CE / 70s-80s CE", "explanation": "Construction from 72-80 CE places it in the first century"}'
WHERE id = 'sat-af044aae-261a-46f7-8586-a7717ea2476d';

-- Question: Assembly directions first step
UPDATE curriculum_questions 
SET question = 'Read the following assembly directions:

"Bookshelf Assembly Instructions
1. Lay all pieces on a clean, flat surface and identify each part using the diagram
2. Attach the metal brackets to the side panels using screws A (6 total)
3. Connect the bottom shelf between the two side panels
4. Insert the adjustable middle shelves into the desired positions
5. Secure the top panel
6. Attach the back panel for stability"

According to the directions, which step should be completed first?',
    model_answer = 'Lay all pieces on a clean, flat surface and identify each part

Explanation: Step 1 explicitly instructs to "Lay all pieces on a clean, flat surface and identify each part using the diagram" before proceeding to assembly.',
    marking_criteria = '{"answer": "lay out all pieces / identify parts / organize pieces / prepare pieces", "explanation": "The first step is to organize and identify all components before assembly"}'
WHERE id = 'sat-efa903c5-b8d4-43fd-a538-2e64f4761d45';

-- Question: Nutrition label calories
UPDATE curriculum_questions 
SET question = 'Read the following nutrition label:

"Nutrition Facts
Serving Size: 1 cup (240ml)
Servings Per Container: 4

Amount Per Serving:
Calories 150
Total Fat 8g (10% DV)
Sodium 200mg (9% DV)
Total Carbohydrate 18g (7% DV)
Protein 3g"

According to the nutrition label, one serving contains how many calories?',
    model_answer = '150 calories

Explanation: The label clearly lists "Calories 150" under "Amount Per Serving."',
    marking_criteria = '{"answer": "150 / 150 calories", "explanation": "The nutrition label shows 150 calories per serving"}'
WHERE id = 'sat-fcac99f8-0b6a-4e46-9f8b-bc962d08b93a';