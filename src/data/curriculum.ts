export interface Question {
  id: string;
  question: string;
  modelAnswer: string;
  marks: number;
  markingCriteria: {
    breakdown: string[];
  };
  specReference: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
}

export const curriculum: Subject[] = [
  {
    id: "biology",
    name: "Biology",
    icon: "Microscope",
    topics: [
      {
        id: "cell-biology",
        name: "Cell Biology",
        description: "Structure and function of cells, organelles, and cellular processes",
        questions: [
          {
            id: "cell-1",
            question: "Describe the structure and function of mitochondria in eukaryotic cells.",
            modelAnswer: "Mitochondria are double-membrane organelles with an outer smooth membrane and an inner folded membrane forming cristae. The inner membrane contains the electron transport chain and ATP synthase. The matrix contains enzymes for the Krebs cycle. Their primary function is aerobic respiration, producing ATP through oxidative phosphorylation. They also contain their own DNA and ribosomes, supporting the endosymbiotic theory.",
            marks: 6,
            markingCriteria: {
              breakdown: [
                "1 mark: Double membrane structure",
                "1 mark: Inner membrane folded into cristae",
                "1 mark: Matrix contains Krebs cycle enzymes",
                "1 mark: Site of aerobic respiration",
                "1 mark: ATP production via oxidative phosphorylation",
                "1 mark: Contains own DNA and ribosomes"
              ]
            },
            specReference: "3.2.1"
          },
          {
            id: "cell-2",
            question: "Explain the process of osmosis and its importance in plant cells.",
            modelAnswer: "Osmosis is the movement of water molecules from a region of higher water potential to a region of lower water potential through a partially permeable membrane. In plant cells, osmosis maintains turgor pressure, keeping cells rigid and plants upright. When water enters by osmosis, the cell becomes turgid. Water loss causes plasmolysis. This process is crucial for support, transport, and maintaining cell shape.",
            marks: 5,
            markingCriteria: {
              breakdown: [
                "1 mark: Definition of osmosis",
                "1 mark: Movement down water potential gradient",
                "1 mark: Through partially permeable membrane",
                "1 mark: Maintains turgor pressure in plants",
                "1 mark: Importance for support and structure"
              ]
            },
            specReference: "3.2.2"
          }
        ]
      },
      {
        id: "genetics",
        name: "Genetics",
        description: "Inheritance, DNA structure, and genetic variation",
        questions: [
          {
            id: "genetics-1",
            question: "Describe the structure of DNA and explain how it relates to its function.",
            modelAnswer: "DNA is a double helix composed of two antiparallel polynucleotide strands. Each strand consists of nucleotides containing a phosphate group, deoxyribose sugar, and one of four bases (A, T, G, C). Bases pair specifically: A with T (2 hydrogen bonds) and G with C (3 hydrogen bonds). The double helix structure allows for semi-conservative replication, while base pairing ensures accurate copying. The sequence of bases codes for genetic information.",
            marks: 8,
            markingCriteria: {
              breakdown: [
                "1 mark: Double helix structure",
                "1 mark: Two antiparallel strands",
                "1 mark: Nucleotide components",
                "1 mark: Four bases A, T, G, C",
                "1 mark: Complementary base pairing",
                "1 mark: Hydrogen bonding (A-T: 2, G-C: 3)",
                "1 mark: Enables semi-conservative replication",
                "1 mark: Base sequence codes for information"
              ]
            },
            specReference: "3.4.1"
          }
        ]
      }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "TestTube",
    topics: [
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        description: "Atoms, electrons, and the periodic table",
        questions: [
          {
            id: "atomic-1",
            question: "Describe the structure of an atom and explain how electrons are arranged in energy levels.",
            modelAnswer: "An atom consists of a nucleus containing protons and neutrons, surrounded by electrons in energy levels (shells). The nucleus is positively charged due to protons, while electrons are negatively charged. Electrons occupy specific energy levels: the first shell holds up to 2 electrons, the second up to 8, and the third up to 18. Electrons fill lower energy levels first. The number of protons determines the element's identity.",
            marks: 6,
            markingCriteria: {
              breakdown: [
                "1 mark: Nucleus contains protons and neutrons",
                "1 mark: Electrons in energy levels/shells",
                "1 mark: Nucleus is positively charged",
                "1 mark: Electron shell capacities (2, 8, 18)",
                "1 mark: Electrons fill lower levels first",
                "1 mark: Proton number determines element"
              ]
            },
            specReference: "2.1.1"
          }
        ]
      },
      {
        id: "bonding",
        name: "Chemical Bonding",
        description: "Ionic, covalent, and metallic bonding",
        questions: [
          {
            id: "bonding-1",
            question: "Explain the formation of ionic bonds and describe the properties of ionic compounds.",
            modelAnswer: "Ionic bonds form when electrons are transferred from metal atoms to non-metal atoms. Metals lose electrons to form positive cations, while non-metals gain electrons to form negative anions. The electrostatic attraction between oppositely charged ions forms the ionic bond. Ionic compounds have high melting and boiling points, conduct electricity when molten or dissolved, are often soluble in water, and form crystalline structures.",
            marks: 7,
            markingCriteria: {
              breakdown: [
                "1 mark: Electron transfer from metal to non-metal",
                "1 mark: Formation of cations and anions",
                "1 mark: Electrostatic attraction forms bond",
                "1 mark: High melting/boiling points",
                "1 mark: Conduct when molten/dissolved",
                "1 mark: Often water soluble",
                "1 mark: Crystalline structure"
              ]
            },
            specReference: "2.2.1"
          }
        ]
      }
    ]
  },
  {
    id: "physics",
    name: "Physics",
    icon: "Atom",
    topics: [
      {
        id: "mechanics",
        name: "Mechanics",
        description: "Forces, motion, and energy",
        questions: [
          {
            id: "mechanics-1",
            question: "State Newton's three laws of motion and give an example of each.",
            modelAnswer: "First Law: An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced force. Example: A book on a table remains stationary. Second Law: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma). Example: Pushing a car requires more force than pushing a bicycle. Third Law: For every action, there is an equal and opposite reaction. Example: When walking, you push back on the ground, and the ground pushes forward on you.",
            marks: 6,
            markingCriteria: {
              breakdown: [
                "1 mark: First law statement",
                "1 mark: Example of first law",
                "1 mark: Second law statement (F = ma)",
                "1 mark: Example of second law",
                "1 mark: Third law statement",
                "1 mark: Example of third law"
              ]
            },
            specReference: "4.1.1"
          }
        ]
      },
      {
        id: "waves",
        name: "Waves",
        description: "Wave properties, sound, and electromagnetic radiation",
        questions: [
          {
            id: "waves-1",
            question: "Describe the properties of waves and explain the difference between transverse and longitudinal waves.",
            modelAnswer: "Waves transfer energy without transferring matter. Key properties include wavelength (distance between two consecutive points in phase), frequency (number of waves per second), amplitude (maximum displacement from rest position), and period (time for one complete wave). Transverse waves have oscillations perpendicular to the direction of energy transfer (e.g., light waves). Longitudinal waves have oscillations parallel to the direction of energy transfer (e.g., sound waves).",
            marks: 6,
            markingCriteria: {
              breakdown: [
                "1 mark: Waves transfer energy not matter",
                "1 mark: Wavelength definition",
                "1 mark: Frequency and amplitude definitions",
                "1 mark: Transverse waves - perpendicular oscillations",
                "1 mark: Longitudinal waves - parallel oscillations",
                "1 mark: Examples of each type"
              ]
            },
            specReference: "4.3.1"
          }
        ]
      }
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "Calculator",
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        description: "Equations, inequalities, and algebraic manipulation",
        questions: [
          {
            id: "algebra-1",
            question: "Solve the quadratic equation 2x² + 7x - 15 = 0 using the quadratic formula.",
            modelAnswer: "Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. Here a = 2, b = 7, c = -15. x = (-7 ± √(49 - 4(2)(-15))) / 2(2) = (-7 ± √(49 + 120)) / 4 = (-7 ± √169) / 4 = (-7 ± 13) / 4. Therefore x = 6/4 = 1.5 or x = -20/4 = -5.",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Correct identification of a, b, c values",
                "1 mark: Correct substitution into quadratic formula",
                "1 mark: Correct calculation of discriminant (169)",
                "1 mark: Both solutions x = 1.5 and x = -5"
              ]
            },
            specReference: "A1.2"
          }
        ]
      },
      {
        id: "geometry",
        name: "Geometry",
        description: "Shapes, angles, and geometric relationships",
        questions: [
          {
            id: "geometry-1",
            question: "Calculate the area of a triangle with sides 5 cm, 12 cm, and 13 cm.",
            modelAnswer: "First, check if it's a right triangle: 5² + 12² = 25 + 144 = 169 = 13². Yes, it's a right triangle. For a right triangle, Area = ½ × base × height = ½ × 5 × 12 = 30 cm². Alternatively, using Heron's formula: s = (5+12+13)/2 = 15, Area = √(15×10×3×2) = √900 = 30 cm².",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Recognizing it's a right triangle (5² + 12² = 13²)",
                "1 mark: Using correct area formula",
                "1 mark: Final answer 30 cm²"
              ]
            },
            specReference: "G2.1"
          }
        ]
      },
      {
        id: "trigonometry",
        name: "Trigonometry",
        description: "Sine, cosine, tangent, and their applications",
        questions: [
          {
            id: "trig-1",
            question: "In a right-angled triangle, the hypotenuse is 10 cm and one angle is 30°. Calculate the lengths of the other two sides.",
            modelAnswer: "Using trigonometric ratios: For the side opposite to 30°: sin(30°) = opposite/hypotenuse, so opposite = 10 × sin(30°) = 10 × 0.5 = 5 cm. For the side adjacent to 30°: cos(30°) = adjacent/hypotenuse, so adjacent = 10 × cos(30°) = 10 × (√3/2) = 5√3 ≈ 8.66 cm.",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Using sin(30°) = 0.5",
                "1 mark: Opposite side = 5 cm",
                "1 mark: Using cos(30°) = √3/2",
                "1 mark: Adjacent side = 5√3 or 8.66 cm"
              ]
            },
            specReference: "T1.1"
          }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        description: "Data handling, probability, and statistical analysis",
        questions: [
          {
            id: "stats-1",
            question: "A survey of 40 students recorded their heights in cm. The results are: 150, 152, 155, 158, 160, 162, 165, 168, 170, 172. Calculate the mean height.",
            modelAnswer: "Mean = (150 + 152 + 155 + 158 + 160 + 162 + 165 + 168 + 170 + 172) ÷ 10 = 1612 ÷ 10 = 161.2 cm",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Adding all values correctly (1612)",
                "1 mark: Dividing by the correct number of values (10)",
                "1 mark: Final answer 161.2 cm"
              ]
            },
            specReference: "S1.1"
          },
          {
            id: "stats-2",
            question: "Find the median of the following data set: 12, 8, 15, 20, 6, 18, 10, 14, 16",
            modelAnswer: "First arrange in order: 6, 8, 10, 12, 14, 15, 16, 18, 20. There are 9 values, so the median is the 5th value = 14",
            marks: 2,
            markingCriteria: {
              breakdown: [
                "1 mark: Arranging data in ascending order",
                "1 mark: Identifying the middle value as 14"
              ]
            },
            specReference: "S1.2"
          },
          {
            id: "stats-3",
            question: "A dice is rolled 60 times. The number 6 appears 12 times. Calculate the relative frequency of rolling a 6.",
            modelAnswer: "Relative frequency = Number of times event occurs ÷ Total number of trials = 12 ÷ 60 = 0.2 or 1/5 or 20%",
            marks: 2,
            markingCriteria: {
              breakdown: [
                "1 mark: Using the formula frequency ÷ total",
                "1 mark: Correct answer 0.2, 1/5, or 20%"
              ]
            },
            specReference: "S2.1"
          },
          {
            id: "stats-4",
            question: "Calculate the range and interquartile range for the data: 5, 8, 12, 15, 18, 22, 25, 28, 30",
            modelAnswer: "Range = 30 - 5 = 25. For IQR: Q1 = 8, Q3 = 25. IQR = Q3 - Q1 = 25 - 8 = 17",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Range = highest - lowest value",
                "1 mark: Range = 25",
                "1 mark: Finding Q1 = 8 and Q3 = 25",
                "1 mark: IQR = 17"
              ]
            },
            specReference: "S1.3"
          },
          {
            id: "stats-5",
            question: "A bag contains 3 red balls, 5 blue balls, and 2 green balls. What is the probability of drawing a blue ball?",
            modelAnswer: "Total balls = 3 + 5 + 2 = 10. Number of blue balls = 5. Probability = 5/10 = 1/2 = 0.5",
            marks: 2,
            markingCriteria: {
              breakdown: [
                "1 mark: Finding total number of balls (10)",
                "1 mark: Probability = 5/10 = 1/2 = 0.5"
              ]
            },
            specReference: "S2.2"
          },
          {
            id: "stats-6",
            question: "Draw a frequency table for the following data showing the number of pets owned by 20 families: 0, 1, 2, 1, 0, 3, 1, 2, 0, 1, 2, 0, 1, 3, 2, 1, 0, 2, 1, 0",
            modelAnswer: "Pets | Frequency\n0    | 6\n1    | 7\n2    | 5\n3    | 2\nTotal: 20",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Correct table structure with pets and frequency columns",
                "1 mark: All frequencies correct (0:6, 1:7, 2:5, 3:2)",
                "1 mark: Total adds to 20"
              ]
            },
            specReference: "S1.4"
          },
          {
            id: "stats-7",
            question: "Calculate the mode and range for this data set: 7, 9, 12, 7, 15, 9, 7, 18, 12",
            modelAnswer: "Mode = 7 (appears 3 times, most frequent). Range = 18 - 7 = 11",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Identifying that 7 appears most frequently",
                "1 mark: Mode = 7",
                "1 mark: Range = 11"
              ]
            },
            specReference: "S1.5"
          },
          {
            id: "stats-8",
            question: "A coin is flipped 3 times. List all possible outcomes and find the probability of getting exactly 2 heads.",
            modelAnswer: "Outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT (8 total). Exactly 2 heads: HHT, HTH, THH (3 outcomes). Probability = 3/8",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Listing all 8 possible outcomes",
                "1 mark: Identifying outcomes with exactly 2 heads",
                "1 mark: Counting 3 favorable outcomes",
                "1 mark: Probability = 3/8"
              ]
            },
            specReference: "S2.3"
          },
          {
            id: "stats-9",
            question: "The heights of 15 students are recorded. Calculate the mean from this frequency table:\nHeight (cm) | Frequency\n150-154     | 3\n155-159     | 5\n160-164     | 4\n165-169     | 3",
            modelAnswer: "Midpoints: 152, 157, 162, 167. Sum = (152×3) + (157×5) + (162×4) + (167×3) = 456 + 785 + 648 + 501 = 2390. Mean = 2390 ÷ 15 = 159.3 cm",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Finding midpoints of each class",
                "1 mark: Multiplying midpoints by frequencies",
                "1 mark: Finding sum of (midpoint × frequency) = 2390",
                "1 mark: Mean = 159.3 cm"
              ]
            },
            specReference: "S1.6"
          },
          {
            id: "stats-10",
            question: "Two events A and B are independent. P(A) = 0.3 and P(B) = 0.4. Calculate P(A and B).",
            modelAnswer: "For independent events: P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12",
            marks: 2,
            markingCriteria: {
              breakdown: [
                "1 mark: Using the multiplication rule for independent events",
                "1 mark: Correct answer 0.12"
              ]
            },
            specReference: "S2.4"
          },
          {
            id: "stats-11",
            question: "A survey asked 100 people about their favorite sport. 45 chose football, 30 chose tennis, and 25 chose basketball. Draw a pie chart to represent this data.",
            modelAnswer: "Football: (45/100) × 360° = 162°. Tennis: (30/100) × 360° = 108°. Basketball: (25/100) × 360° = 90°. Total = 360°",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Understanding that angles must total 360°",
                "1 mark: Football angle = 162°",
                "1 mark: Tennis angle = 108°",
                "1 mark: Basketball angle = 90°"
              ]
            },
            specReference: "S1.7"
          },
          {
            id: "stats-12",
            question: "Calculate the standard deviation for the data set: 2, 4, 6, 8, 10",
            modelAnswer: "Mean = 6. Deviations squared: (2-6)²=16, (4-6)²=4, (6-6)²=0, (8-6)²=4, (10-6)²=16. Sum = 40. Variance = 40/5 = 8. Standard deviation = √8 = 2.83",
            marks: 5,
            markingCriteria: {
              breakdown: [
                "1 mark: Finding mean = 6",
                "1 mark: Calculating deviations from mean",
                "1 mark: Squaring deviations and summing = 40",
                "1 mark: Finding variance = 8",
                "1 mark: Standard deviation = 2.83"
              ]
            },
            specReference: "S1.8"
          },
          {
            id: "stats-13",
            question: "A normal distribution has mean 100 and standard deviation 15. What percentage of values lie within one standard deviation of the mean?",
            modelAnswer: "Within one standard deviation means between 85 and 115. In a normal distribution, approximately 68% of values lie within one standard deviation of the mean.",
            marks: 2,
            markingCriteria: {
              breakdown: [
                "1 mark: Identifying the range 85 to 115",
                "1 mark: Stating 68% (or approximately 68%)"
              ]
            },
            specReference: "S3.1"
          },
          {
            id: "stats-14",
            question: "Calculate the correlation coefficient for the following data pairs: (1,2), (2,4), (3,6), (4,8), (5,10)",
            modelAnswer: "This shows perfect positive correlation as y = 2x exactly. The correlation coefficient r = 1 (perfect positive correlation).",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Recognizing the linear relationship y = 2x",
                "1 mark: Understanding this represents perfect correlation",
                "1 mark: r = 1"
              ]
            },
            specReference: "S3.2"
          },
          {
            id: "stats-15",
            question: "A box plot shows Q1 = 20, Q2 = 25, Q3 = 35, minimum = 15, maximum = 45. Identify any outliers using the 1.5 × IQR rule.",
            modelAnswer: "IQR = Q3 - Q1 = 35 - 20 = 15. Lower boundary = Q1 - 1.5×IQR = 20 - 22.5 = -2.5. Upper boundary = Q3 + 1.5×IQR = 35 + 22.5 = 57.5. Since min = 15 > -2.5 and max = 45 < 57.5, there are no outliers.",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Calculating IQR = 15",
                "1 mark: Finding lower boundary = -2.5",
                "1 mark: Finding upper boundary = 57.5",
                "1 mark: Concluding no outliers"
              ]
            },
            specReference: "S1.9"
          },
          {
            id: "stats-16",
            question: "A spinner has 4 equal sections colored red, blue, green, and yellow. What is the probability of spinning red OR blue?",
            modelAnswer: "P(red) = 1/4, P(blue) = 1/4. Since these are mutually exclusive events: P(red OR blue) = P(red) + P(blue) = 1/4 + 1/4 = 2/4 = 1/2",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: P(red) = 1/4 and P(blue) = 1/4",
                "1 mark: Using addition rule for mutually exclusive events",
                "1 mark: Final answer 1/2"
              ]
            },
            specReference: "S2.5"
          },
          {
            id: "stats-17",
            question: "From a sample of 200 people, 120 have brown eyes. Construct a 95% confidence interval for the proportion of people with brown eyes in the population.",
            modelAnswer: "Sample proportion p̂ = 120/200 = 0.6. For 95% CI, z = 1.96. Standard error = √(0.6×0.4/200) = 0.0346. CI = 0.6 ± 1.96×0.0346 = 0.6 ± 0.068 = (0.532, 0.668)",
            marks: 5,
            markingCriteria: {
              breakdown: [
                "1 mark: Sample proportion = 0.6",
                "1 mark: Using z = 1.96 for 95% confidence",
                "1 mark: Calculating standard error",
                "1 mark: Applying confidence interval formula",
                "1 mark: Final interval (0.532, 0.668)"
              ]
            },
            specReference: "S3.3"
          },
          {
            id: "stats-18",
            question: "Calculate the expected value and variance for a discrete random variable X with the probability distribution: P(X=1)=0.2, P(X=2)=0.3, P(X=3)=0.5",
            modelAnswer: "E(X) = 1×0.2 + 2×0.3 + 3×0.5 = 0.2 + 0.6 + 1.5 = 2.3. E(X²) = 1²×0.2 + 2²×0.3 + 3²×0.5 = 0.2 + 1.2 + 4.5 = 5.9. Var(X) = E(X²) - [E(X)]² = 5.9 - 2.3² = 5.9 - 5.29 = 0.61",
            marks: 5,
            markingCriteria: {
              breakdown: [
                "1 mark: E(X) = Σ x·P(x)",
                "1 mark: E(X) = 2.3",
                "1 mark: E(X²) = 5.9",
                "1 mark: Using Var(X) = E(X²) - [E(X)]²",
                "1 mark: Var(X) = 0.61"
              ]
            },
            specReference: "S3.4"
          },
          {
            id: "stats-19",
            question: "A hypothesis test is conducted with H₀: μ = 50 and H₁: μ ≠ 50. The test statistic is z = 2.1. Using α = 0.05, make a decision about the null hypothesis.",
            modelAnswer: "For a two-tailed test with α = 0.05, critical values are ±1.96. Since |2.1| > 1.96, the test statistic falls in the rejection region. Therefore, reject H₀ at the 5% significance level.",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Identifying this as a two-tailed test",
                "1 mark: Critical values = ±1.96",
                "1 mark: Comparing |2.1| > 1.96",
                "1 mark: Decision to reject H₀"
              ]
            },
            specReference: "S3.5"
          },
          {
            id: "stats-20",
            question: "A scatter diagram shows a strong negative correlation between two variables. The regression line has equation y = -2x + 10. Predict the value of y when x = 6.",
            modelAnswer: "Using the regression equation y = -2x + 10. When x = 6: y = -2(6) + 10 = -12 + 10 = -2",
            marks: 2,
            markingCriteria: {
              breakdown: [
                "1 mark: Substituting x = 6 into the equation",
                "1 mark: Correct answer y = -2"
              ]
            },
            specReference: "S3.6"
          },
          {
            id: "stats-21",
            question: "A fair six-sided die is rolled twice. Calculate the probability that the sum of the two rolls is 7.",
            modelAnswer: "Favorable outcomes for sum = 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes. Total possible outcomes = 6 × 6 = 36. Probability = 6/36 = 1/6",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Identifying all favorable outcomes (6 outcomes)",
                "1 mark: Total possible outcomes = 36",
                "1 mark: Probability = 1/6"
              ]
            },
            specReference: "S2.6"
          },
          {
            id: "stats-22",
            question: "A binomial distribution has n = 10 and p = 0.3. Calculate P(X = 3).",
            modelAnswer: "P(X = 3) = C(10,3) × (0.3)³ × (0.7)⁷ = 120 × 0.027 × 0.0824 = 120 × 0.002225 = 0.267",
            marks: 4,
            markingCriteria: {
              breakdown: [
                "1 mark: Using binomial probability formula",
                "1 mark: C(10,3) = 120",
                "1 mark: (0.3)³ × (0.7)⁷ = 0.002225",
                "1 mark: Final answer 0.267"
              ]
            },
            specReference: "S3.7"
          },
          {
            id: "stats-23",
            question: "Calculate the cumulative frequency for the following data: Score 0-9: 5 people, 10-19: 8 people, 20-29: 12 people, 30-39: 6 people, 40-49: 4 people",
            modelAnswer: "Cumulative frequencies: 0-9: 5, 0-19: 5+8=13, 0-29: 13+12=25, 0-39: 25+6=31, 0-49: 31+4=35",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Understanding cumulative frequency concept",
                "1 mark: Correct running totals for each class",
                "1 mark: Final cumulative frequency = 35"
              ]
            },
            specReference: "S1.10"
          },
          {
            id: "stats-24",
            question: "A Poisson distribution has mean λ = 4. Calculate P(X = 2).",
            modelAnswer: "P(X = 2) = (e^(-4) × 4²) / 2! = (0.0183 × 16) / 2 = 0.293 / 2 = 0.1465",
            marks: 3,
            markingCriteria: {
              breakdown: [
                "1 mark: Using Poisson probability formula",
                "1 mark: Calculating e^(-4) × 4² = 0.293",
                "1 mark: Final answer 0.1465"
              ]
            },
            specReference: "S3.8"
          }
        ]
      }
    ]
  },
  {
    id: "english",
    name: "English Literature",
    icon: "BookOpen",
    topics: [
      {
        id: "shakespeare",
        name: "Shakespeare",
        description: "Analysis of Shakespeare's plays and sonnets",
        questions: [
          {
            id: "shakespeare-1",
            question: "Analyze the theme of ambition in Macbeth, focusing on how it leads to the protagonist's downfall.",
            modelAnswer: "Ambition is the central theme driving Macbeth's tragic downfall. Initially a noble warrior, Macbeth's 'vaulting ambition' is awakened by the witches' prophecies and Lady Macbeth's manipulation. His ambition transforms from honorable service to ruthless pursuit of power. The murder of Duncan marks his moral corruption, leading to paranoia, further murders, and isolation. Shakespeare presents ambition as destructive when unchecked by moral constraints, ultimately consuming Macbeth and leading to his death.",
            marks: 8,
            markingCriteria: {
              breakdown: [
                "1 mark: Identification of ambition as central theme",
                "1 mark: Reference to 'vaulting ambition'",
                "1 mark: Role of witches and Lady Macbeth",
                "1 mark: Duncan's murder as turning point",
                "1 mark: Consequences - paranoia and further murders",
                "1 mark: Moral corruption and isolation",
                "1 mark: Shakespeare's message about unchecked ambition",
                "1 mark: Link to tragic downfall and death"
              ]
            },
            specReference: "L1.1"
          }
        ]
      }
    ]
  }
];
