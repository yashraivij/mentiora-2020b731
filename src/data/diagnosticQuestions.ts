export interface DiagnosticQuestion {
  id: string;
  questionNumber: number;
  topic: string;
  difficulty: string;
  question: string;
  passage?: string;
  options: {
    letter: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export const readingWritingQuestions: DiagnosticQuestion[] = [
  {
    id: "rw_1",
    questionNumber: 1,
    topic: "grammar",
    difficulty: "medium",
    question: "Which choice completes the sentence correctly?",
    passage: "The collection of rare books _____ donated to the university library by a generous alumnus.",
    options: [
      { letter: "A", text: "were" },
      { letter: "B", text: "was" },
      { letter: "C", text: "have been" },
      { letter: "D", text: "are" }
    ],
    correctAnswer: "B",
    explanation: "\"Collection\" is singular, so it takes the singular verb \"was.\" Don't be confused by the plural \"books\" - it's part of the prepositional phrase."
  },
  {
    id: "rw_2",
    questionNumber: 2,
    topic: "readingComprehension",
    difficulty: "medium",
    question: "The passage primarily discusses:",
    passage: "Solar panels have become increasingly efficient over the past decade, with some modern panels converting over 22% of sunlight into electricity. This improvement, coupled with falling production costs, has made solar energy competitive with traditional fossil fuels in many regions. As a result, solar installations have grown exponentially, particularly in sunny states like California and Arizona.",
    options: [
      { letter: "A", text: "The scientific process behind solar panel efficiency" },
      { letter: "B", text: "The growth of solar energy due to improved technology and lower costs" },
      { letter: "C", text: "Regional differences in solar panel adoption" },
      { letter: "D", text: "The environmental benefits of renewable energy" }
    ],
    correctAnswer: "B",
    explanation: "The passage focuses on improvements in efficiency and cost leading to growth, not just the science or regional differences."
  },
  {
    id: "rw_3",
    questionNumber: 3,
    topic: "punctuation",
    difficulty: "hard",
    question: "Where should commas be added?",
    passage: "After reviewing the applications the committee which consisted of five professors selected three candidates for interviews.",
    options: [
      { letter: "A", text: "After \"applications\" only" },
      { letter: "B", text: "After \"applications\" and after \"professors\"" },
      { letter: "C", text: "After \"committee\" and after \"professors\"" },
      { letter: "D", text: "After \"applications,\" \"committee,\" and \"professors\"" }
    ],
    correctAnswer: "D",
    explanation: "Need comma after introductory phrase (\"applications,\") and commas to set off the non-restrictive clause (\"committee,\" and \"professors,\")."
  },
  {
    id: "rw_4",
    questionNumber: 4,
    topic: "vocabulary",
    difficulty: "medium",
    question: "Which word best fits the context?",
    passage: "The scientist's findings were initially met with _____, but after peer review confirmed the results, they gained widespread acceptance.",
    options: [
      { letter: "A", text: "skepticism" },
      { letter: "B", text: "enthusiasm" },
      { letter: "C", text: "indifference" },
      { letter: "D", text: "hostility" }
    ],
    correctAnswer: "A",
    explanation: "The contrast with \"widespread acceptance\" after peer review suggests initial doubt, not hostility or enthusiasm."
  },
  {
    id: "rw_5",
    questionNumber: 5,
    topic: "sentenceStructure",
    difficulty: "medium",
    question: "What is the problem with this sentence?",
    passage: "Running through the park, the sunrise was beautiful.",
    options: [
      { letter: "A", text: "The comma is unnecessary" },
      { letter: "B", text: "The modifier incorrectly suggests the sunrise was running" },
      { letter: "C", text: "\"Beautiful\" should come before \"sunrise\"" },
      { letter: "D", text: "There is no problem" }
    ],
    correctAnswer: "B",
    explanation: "The participial phrase \"Running through the park\" incorrectly modifies \"sunrise.\" Should be: \"Running through the park, I saw a beautiful sunrise.\""
  },
  {
    id: "rw_6",
    questionNumber: 6,
    topic: "grammar",
    difficulty: "medium",
    question: "Which pronoun is grammatically correct?",
    passage: "Each of the students must submit _____ project by Friday.",
    options: [
      { letter: "A", text: "their" },
      { letter: "B", text: "his or her" },
      { letter: "C", text: "its" },
      { letter: "D", text: "his" }
    ],
    correctAnswer: "B",
    explanation: "\"Each\" is singular and requires a singular pronoun. While \"their\" is increasingly accepted in informal contexts, traditional SAT grammar requires \"his or her.\""
  },
  {
    id: "rw_7",
    questionNumber: 7,
    topic: "readingComprehension",
    difficulty: "medium",
    question: "According to the passage, what determines whether EVs are environmentally beneficial?",
    passage: "Electric vehicles (EVs) are often promoted as environmentally friendly alternatives to gas-powered cars. However, the environmental benefits depend heavily on how the electricity is generated. In regions where electricity comes primarily from coal plants, EVs may actually produce more emissions over their lifetime than efficient gas cars. In contrast, regions with renewable energy sources see substantial environmental benefits from EV adoption.",
    options: [
      { letter: "A", text: "The efficiency of the electric vehicle" },
      { letter: "B", text: "The source of electricity used to charge them" },
      { letter: "C", text: "The lifetime of the vehicle" },
      { letter: "D", text: "Consumer driving habits" }
    ],
    correctAnswer: "B",
    explanation: "The passage explicitly states benefits \"depend heavily on how the electricity is generated.\""
  },
  {
    id: "rw_8",
    questionNumber: 8,
    topic: "punctuation",
    difficulty: "medium",
    question: "Which punctuation mark should be used?",
    passage: "The conference was informative_____ however, the sessions were too short.",
    options: [
      { letter: "A", text: "Semicolon (;)" },
      { letter: "B", text: "Comma (,)" },
      { letter: "C", text: "Colon (:)" },
      { letter: "D", text: "Dash (—)" }
    ],
    correctAnswer: "A",
    explanation: "Conjunctive adverbs like \"however\" connecting independent clauses require a semicolon before and a comma after."
  },
  {
    id: "rw_9",
    questionNumber: 9,
    topic: "rhetoric",
    difficulty: "medium",
    question: "The author's primary purpose is to:",
    passage: "Studies show that teenagers who get less than 8 hours of sleep perform significantly worse on cognitive tasks. Schools should therefore consider starting classes later in the morning to align with adolescent sleep patterns.",
    options: [
      { letter: "A", text: "Present research findings about teenage sleep" },
      { letter: "B", text: "Explain why teenagers need more sleep" },
      { letter: "C", text: "Advocate for later school start times" },
      { letter: "D", text: "Compare teenage and adult sleep needs" }
    ],
    correctAnswer: "C",
    explanation: "The passage uses evidence to support a recommendation (\"should consider\"), making it advocacy."
  },
  {
    id: "rw_10",
    questionNumber: 10,
    topic: "sentenceStructure",
    difficulty: "easy",
    question: "Which choice maintains parallel structure?",
    passage: "The job requires attention to detail, working independently, and _____ multiple projects.",
    options: [
      { letter: "A", text: "to manage" },
      { letter: "B", text: "managing" },
      { letter: "C", text: "the management of" },
      { letter: "D", text: "that one manages" }
    ],
    correctAnswer: "B",
    explanation: "The series starts with gerunds (\"attention,\" \"working\"), so it should continue with \"managing.\""
  },
  {
    id: "rw_11",
    questionNumber: 11,
    topic: "readingComprehension",
    difficulty: "medium",
    question: "Based on the passage, we can infer that:",
    passage: "Marine biologists have observed that coral reefs in protected marine reserves show 40% more biodiversity than unprotected reefs in the same region. The protected reefs also demonstrate faster recovery rates after bleaching events.",
    options: [
      { letter: "A", text: "All coral reefs eventually recover from bleaching" },
      { letter: "B", text: "Marine protection measures benefit coral reef ecosystems" },
      { letter: "C", text: "Biodiversity causes faster recovery" },
      { letter: "D", text: "Unprotected reefs will disappear entirely" }
    ],
    correctAnswer: "B",
    explanation: "The comparison clearly suggests protection helps reefs, though it doesn't claim all reefs recover or unprotected ones will disappear."
  },
  {
    id: "rw_12",
    questionNumber: 12,
    topic: "vocabulary",
    difficulty: "medium",
    question: "Which word best completes the sentence?",
    passage: "The artist's work is _____, drawing heavily from 19th-century impressionist techniques rather than developing an original style.",
    options: [
      { letter: "A", text: "derivative" },
      { letter: "B", text: "innovative" },
      { letter: "C", text: "conventional" },
      { letter: "D", text: "obscure" }
    ],
    correctAnswer: "A",
    explanation: "\"Drawing heavily from\" indicates the work is derived from others' styles, not original."
  },
  {
    id: "rw_13",
    questionNumber: 13,
    topic: "grammar",
    difficulty: "easy",
    question: "Which verb tense is correct?",
    passage: "The scientists conducted the experiment last year and _____ their findings in a major journal.",
    options: [
      { letter: "A", text: "publish" },
      { letter: "B", text: "published" },
      { letter: "C", text: "have published" },
      { letter: "D", text: "will publish" }
    ],
    correctAnswer: "B",
    explanation: "\"Last year\" indicates past tense; both actions should be in simple past for consistency."
  },
  {
    id: "rw_14",
    questionNumber: 14,
    topic: "punctuation",
    difficulty: "easy",
    question: "If multiple students each had their own project, which is correct?",
    passage: "The _____ research projects were displayed in the science fair.",
    options: [
      { letter: "A", text: "students'" },
      { letter: "B", text: "student's" },
      { letter: "C", text: "students" },
      { letter: "D", text: "students's" }
    ],
    correctAnswer: "A",
    explanation: "Plural possessive: apostrophe after the \"s.\""
  },
  {
    id: "rw_15",
    questionNumber: 15,
    topic: "readingComprehension",
    difficulty: "medium",
    question: "Which statement is best supported by the passage?",
    passage: "The introduction of wolves to Yellowstone National Park in 1995 had cascading effects throughout the ecosystem. Elk populations decreased, allowing willows and aspens to recover. This vegetation growth stabilized riverbanks, reducing erosion. The wolves' presence even affected the park's physical geography.",
    options: [
      { letter: "A", text: "Wolves are the most important species in any ecosystem" },
      { letter: "B", text: "Removing wolves was a mistake" },
      { letter: "C", text: "A single species can have widespread ecological effects" },
      { letter: "D", text: "Elk damage ecosystems" }
    ],
    correctAnswer: "C",
    explanation: "The passage shows cascading effects from one species but doesn't make broader claims about all ecosystems or judge the original removal."
  },
  {
    id: "rw_16",
    questionNumber: 16,
    topic: "sentenceStructure",
    difficulty: "medium",
    question: "Which revision best combines these sentences?",
    passage: "The company released a new product. The product was well-received. Critics praised its innovative design.",
    options: [
      { letter: "A", text: "The company released a new product, and the product was well-received, and critics praised its innovative design." },
      { letter: "B", text: "The company released a new, well-received product that critics praised for its innovative design." },
      { letter: "C", text: "The company's new product was released and well-received with critics praising its design." },
      { letter: "D", text: "Releasing a new product, the company was well-received by critics for innovative design." }
    ],
    correctAnswer: "B",
    explanation: "Most concise and clear, avoiding wordiness and ambiguity."
  },
  {
    id: "rw_17",
    questionNumber: 17,
    topic: "rhetoric",
    difficulty: "easy",
    question: "Which transition word best fits?",
    passage: "Renewable energy sources have many advantages. _____ they can be intermittent, requiring backup power sources.",
    options: [
      { letter: "A", text: "Furthermore," },
      { letter: "B", text: "Similarly," },
      { letter: "C", text: "However," },
      { letter: "D", text: "Therefore," }
    ],
    correctAnswer: "C",
    explanation: "The second sentence contrasts with the first, introducing a disadvantage."
  },
  {
    id: "rw_18",
    questionNumber: 18,
    topic: "grammar",
    difficulty: "easy",
    question: "Which word is correct?",
    passage: "The new policy will _____ how students register for classes.",
    options: [
      { letter: "A", text: "affect" },
      { letter: "B", text: "effect" },
      { letter: "C", text: "effects" },
      { letter: "D", text: "affects" }
    ],
    correctAnswer: "A",
    explanation: "\"Affect\" is the verb meaning to influence; \"effect\" is typically a noun meaning result."
  },
  {
    id: "rw_19",
    questionNumber: 19,
    topic: "vocabulary",
    difficulty: "medium",
    question: "Which word best describes the response?",
    passage: "The diplomat's response was _____, carefully avoiding the controversial question while maintaining a friendly tone.",
    options: [
      { letter: "A", text: "evasive" },
      { letter: "B", text: "direct" },
      { letter: "C", text: "hostile" },
      { letter: "D", text: "diplomatic" }
    ],
    correctAnswer: "A",
    explanation: "\"Avoiding the question\" indicates evasiveness, though maintaining friendly tone shows diplomacy, \"evasive\" specifically describes the action."
  },
  {
    id: "rw_20",
    questionNumber: 20,
    topic: "readingComprehension",
    difficulty: "medium",
    question: "The author includes the detail about winning prizes in two sciences primarily to:",
    passage: "Marie Curie was the first woman to win a Nobel Prize, and remains the only person to win Nobel Prizes in two different sciences—physics and chemistry. Despite facing discrimination in the male-dominated scientific community, she made groundbreaking discoveries in radioactivity that transformed modern physics and medicine.",
    options: [
      { letter: "A", text: "Show that Curie studied multiple subjects" },
      { letter: "B", text: "Emphasize the exceptional nature of her achievements" },
      { letter: "C", text: "Explain why she faced discrimination" },
      { letter: "D", text: "Compare her to other Nobel Prize winners" }
    ],
    correctAnswer: "B",
    explanation: "Being the \"only person\" to achieve this emphasizes how extraordinary her accomplishments were."
  }
];

export const mathQuestions: DiagnosticQuestion[] = [
  {
    id: "math_1",
    questionNumber: 1,
    topic: "algebra",
    difficulty: "easy",
    question: "Solve for x: 3x - 7 = 2x + 5",
    options: [
      { letter: "A", text: "x = 2" },
      { letter: "B", text: "x = 12" },
      { letter: "C", text: "x = -2" },
      { letter: "D", text: "x = 6" }
    ],
    correctAnswer: "B",
    explanation: "3x - 7 = 2x + 5 → 3x - 2x = 5 + 7 → x = 12"
  },
  {
    id: "math_2",
    questionNumber: 2,
    topic: "problemSolving",
    difficulty: "easy",
    question: "A shirt originally priced at $40 is on sale for 25% off. What is the sale price?",
    options: [
      { letter: "A", text: "$10" },
      { letter: "B", text: "$25" },
      { letter: "C", text: "$30" },
      { letter: "D", text: "$35" }
    ],
    correctAnswer: "C",
    explanation: "25% of $40 = 0.25 × 40 = $10. Sale price = $40 - $10 = $30"
  },
  {
    id: "math_3",
    questionNumber: 3,
    topic: "geometry",
    difficulty: "easy",
    question: "A rectangle has a length of 12 cm and a width of 5 cm. What is its area?",
    options: [
      { letter: "A", text: "17 cm²" },
      { letter: "B", text: "34 cm²" },
      { letter: "C", text: "60 cm²" },
      { letter: "D", text: "120 cm²" }
    ],
    correctAnswer: "C",
    explanation: "Area = length × width = 12 × 5 = 60 cm²"
  },
  {
    id: "math_4",
    questionNumber: 4,
    topic: "algebra",
    difficulty: "medium",
    question: "If 2x + y = 10 and x - y = 2, what is the value of x?",
    options: [
      { letter: "A", text: "x = 2" },
      { letter: "B", text: "x = 4" },
      { letter: "C", text: "x = 6" },
      { letter: "D", text: "x = 8" }
    ],
    correctAnswer: "B",
    explanation: "Add equations: (2x + y) + (x - y) = 10 + 2 → 3x = 12 → x = 4"
  },
  {
    id: "math_5",
    questionNumber: 5,
    topic: "advancedMath",
    difficulty: "medium",
    question: "What are the solutions to x² - 5x + 6 = 0?",
    options: [
      { letter: "A", text: "x = 1 and x = 6" },
      { letter: "B", text: "x = 2 and x = 3" },
      { letter: "C", text: "x = -2 and x = -3" },
      { letter: "D", text: "x = 5 and x = 6" }
    ],
    correctAnswer: "B",
    explanation: "Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3"
  },
  {
    id: "math_6",
    questionNumber: 6,
    topic: "problemSolving",
    difficulty: "easy",
    question: "The ratio of boys to girls in a class is 3:5. If there are 15 boys, how many girls are there?",
    options: [
      { letter: "A", text: "9" },
      { letter: "B", text: "20" },
      { letter: "C", text: "25" },
      { letter: "D", text: "30" }
    ],
    correctAnswer: "C",
    explanation: "3:5 means 3x boys and 5x girls. If 3x = 15, then x = 5. Girls = 5x = 5(5) = 25"
  },
  {
    id: "math_7",
    questionNumber: 7,
    topic: "geometry",
    difficulty: "medium",
    question: "A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?",
    options: [
      { letter: "A", text: "10" },
      { letter: "B", text: "12" },
      { letter: "C", text: "14" },
      { letter: "D", text: "16" }
    ],
    correctAnswer: "A",
    explanation: "Using Pythagorean theorem: 6² + 8² = c² → 36 + 64 = 100 → c = 10"
  },
  {
    id: "math_8",
    questionNumber: 8,
    topic: "algebra",
    difficulty: "easy",
    question: "Solve for x: 2x + 3 > 11",
    options: [
      { letter: "A", text: "x > 4" },
      { letter: "B", text: "x > 7" },
      { letter: "C", text: "x > 8" },
      { letter: "D", text: "x < 4" }
    ],
    correctAnswer: "A",
    explanation: "2x + 3 > 11 → 2x > 8 → x > 4"
  },
  {
    id: "math_9",
    questionNumber: 9,
    topic: "problemSolving",
    difficulty: "medium",
    question: "The average of five numbers is 12. Four of the numbers are 10, 11, 13, and 14. What is the fifth number?",
    options: [
      { letter: "A", text: "10" },
      { letter: "B", text: "12" },
      { letter: "C", text: "14" },
      { letter: "D", text: "15" }
    ],
    correctAnswer: "B",
    explanation: "Sum of 5 numbers = 5 × 12 = 60. Sum of 4 known = 48. Fifth number = 60 - 48 = 12"
  },
  {
    id: "math_10",
    questionNumber: 10,
    topic: "advancedMath",
    difficulty: "easy",
    question: "Simplify: (2³)(2⁴)",
    options: [
      { letter: "A", text: "2⁷" },
      { letter: "B", text: "2¹²" },
      { letter: "C", text: "4⁷" },
      { letter: "D", text: "16" }
    ],
    correctAnswer: "A",
    explanation: "When multiplying same base, add exponents: 2³⁺⁴ = 2⁷"
  },
  {
    id: "math_11",
    questionNumber: 11,
    topic: "geometry",
    difficulty: "easy",
    question: "What is the circumference of a circle with radius 7? (Leave answer in terms of π)",
    options: [
      { letter: "A", text: "14π" },
      { letter: "B", text: "22" },
      { letter: "C", text: "44" },
      { letter: "D", text: "49π" }
    ],
    correctAnswer: "A",
    explanation: "C = 2πr = 2π(7) = 14π"
  },
  {
    id: "math_12",
    questionNumber: 12,
    topic: "algebra",
    difficulty: "medium",
    question: "What is the slope of the line passing through points (2, 3) and (6, 11)?",
    options: [
      { letter: "A", text: "1" },
      { letter: "B", text: "2" },
      { letter: "C", text: "3" },
      { letter: "D", text: "4" }
    ],
    correctAnswer: "B",
    explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2"
  },
  {
    id: "math_13",
    questionNumber: 13,
    topic: "problemSolving",
    difficulty: "easy",
    question: "A bag contains 3 red marbles, 4 blue marbles, and 5 green marbles. What is the probability of randomly selecting a blue marble?",
    options: [
      { letter: "A", text: "1/3" },
      { letter: "B", text: "1/4" },
      { letter: "C", text: "4/12" },
      { letter: "D", text: "5/12" }
    ],
    correctAnswer: "C",
    explanation: "P(blue) = 4/(3+4+5) = 4/12 = 1/3"
  },
  {
    id: "math_14",
    questionNumber: 14,
    topic: "advancedMath",
    difficulty: "easy",
    question: "If f(x) = 2x + 3, what is f(5)?",
    options: [
      { letter: "A", text: "8" },
      { letter: "B", text: "10" },
      { letter: "C", text: "13" },
      { letter: "D", text: "15" }
    ],
    correctAnswer: "C",
    explanation: "f(5) = 2(5) + 3 = 10 + 3 = 13"
  },
  {
    id: "math_15",
    questionNumber: 15,
    topic: "geometry",
    difficulty: "easy",
    question: "In a triangle, two angles measure 45° and 65°. What is the measure of the third angle?",
    options: [
      { letter: "A", text: "60°" },
      { letter: "B", text: "70°" },
      { letter: "C", text: "80°" },
      { letter: "D", text: "90°" }
    ],
    correctAnswer: "B",
    explanation: "Sum of angles in triangle = 180°. Third angle = 180 - 45 - 65 = 70°"
  },
  {
    id: "math_16",
    questionNumber: 16,
    topic: "algebra",
    difficulty: "medium",
    question: "Sarah has twice as many books as Tom. Together they have 36 books. How many books does Sarah have?",
    options: [
      { letter: "A", text: "12" },
      { letter: "B", text: "18" },
      { letter: "C", text: "24" },
      { letter: "D", text: "30" }
    ],
    correctAnswer: "C",
    explanation: "Let Tom have x books, Sarah has 2x. x + 2x = 36 → 3x = 36 → x = 12. Sarah has 2(12) = 24"
  },
  {
    id: "math_17",
    questionNumber: 17,
    topic: "problemSolving",
    difficulty: "easy",
    question: "A car travels 240 miles in 4 hours. What is its average speed in miles per hour?",
    options: [
      { letter: "A", text: "50 mph" },
      { letter: "B", text: "60 mph" },
      { letter: "C", text: "70 mph" },
      { letter: "D", text: "80 mph" }
    ],
    correctAnswer: "B",
    explanation: "Speed = distance/time = 240/4 = 60 mph"
  },
  {
    id: "math_18",
    questionNumber: 18,
    topic: "advancedMath",
    difficulty: "medium",
    question: "Solve for x: |x - 3| = 5",
    options: [
      { letter: "A", text: "x = -2 or x = 8" },
      { letter: "B", text: "x = 2 or x = 8" },
      { letter: "C", text: "x = -2 or x = -8" },
      { letter: "D", text: "x = 3 or x = 5" }
    ],
    correctAnswer: "A",
    explanation: "x - 3 = 5 → x = 8, or x - 3 = -5 → x = -2"
  },
  {
    id: "math_19",
    questionNumber: 19,
    topic: "geometry",
    difficulty: "easy",
    question: "What is the volume of a rectangular box with length 4, width 3, and height 5?",
    options: [
      { letter: "A", text: "12" },
      { letter: "B", text: "20" },
      { letter: "C", text: "60" },
      { letter: "D", text: "120" }
    ],
    correctAnswer: "C",
    explanation: "V = l × w × h = 4 × 3 × 5 = 60 cubic units"
  },
  {
    id: "math_20",
    questionNumber: 20,
    topic: "algebra",
    difficulty: "medium",
    question: "If y varies directly with x, and y = 12 when x = 3, what is y when x = 7?",
    options: [
      { letter: "A", text: "21" },
      { letter: "B", text: "24" },
      { letter: "C", text: "28" },
      { letter: "D", text: "36" }
    ],
    correctAnswer: "C",
    explanation: "y = kx. From 12 = k(3), we get k = 4. When x = 7: y = 4(7) = 28"
  }
];
