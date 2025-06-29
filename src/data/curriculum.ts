export interface Question {
  id: string;
  questionText: string;
  marks: number;
  modelAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  markingCriteria: {
    ao1: number;
    ao2: number;
    ao3: number;
    breakdown: string[];
  };
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export const curriculum: Subject[] = [
  {
    id: "maths",
    name: "Mathematics",
    color: "bg-blue-500",
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        questions: [
          {
            id: "alg_1",
            questionText: "Solve the equation 3x + 7 = 22",
            marks: 2,
            modelAnswer: "3x + 7 = 22\n3x = 22 - 7\n3x = 15\nx = 5",
            difficulty: "easy",
            topic: "algebra",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Subtract 7 from both sides (1 mark)",
                "Divide by 3 to find x = 5 (1 mark)"
              ]
            }
          },
          {
            id: "alg_2",
            questionText: "Expand and simplify (x + 3)(x - 2)",
            marks: 3,
            modelAnswer: "(x + 3)(x - 2) = x² - 2x + 3x - 6 = x² + x - 6",
            difficulty: "medium",
            topic: "algebra",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Multiply each term correctly (2 marks)",
                "Simplify to final answer (1 mark)"
              ]
            }
          },
          {
            id: "alg_3",
            questionText: "Solve the quadratic equation x² - 5x + 6 = 0",
            marks: 3,
            modelAnswer: "x² - 5x + 6 = 0\n(x - 2)(x - 3) = 0\nTherefore x = 2 or x = 3",
            difficulty: "medium",
            topic: "algebra",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Factorize correctly (2 marks)",
                "State both solutions (1 mark)"
              ]
            }
          },
          {
            id: "alg_4",
            questionText: "Make x the subject of the formula y = 3x - 2",
            marks: 2,
            modelAnswer: "y = 3x - 2\ny + 2 = 3x\nx = (y + 2)/3",
            difficulty: "easy",
            topic: "algebra",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Add 2 to both sides (1 mark)",
                "Divide by 3 (1 mark)"
              ]
            }
          },
          {
            id: "alg_5",
            questionText: "Simplify 2x² + 3x - x² + 5x",
            marks: 2,
            modelAnswer: "2x² + 3x - x² + 5x = x² + 8x",
            difficulty: "easy",
            topic: "algebra",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Collect like terms for x² (1 mark)",
                "Collect like terms for x (1 mark)"
              ]
            }
          },
          {
            id: "alg_6",
            questionText: "Solve the simultaneous equations: 2x + y = 7 and x - y = 2",
            marks: 4,
            modelAnswer: "2x + y = 7 ... (1)\nx - y = 2 ... (2)\nAdding equations: 3x = 9, so x = 3\nSubstituting into (2): 3 - y = 2, so y = 1",
            difficulty: "medium",
            topic: "algebra",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Add equations to eliminate y (1 mark)",
                "Find x = 3 (1 mark)",
                "Substitute to find y = 1 (2 marks)"
              ]
            }
          },
          {
            id: "alg_7",
            questionText: "Express x² - 6x + 5 in the form (x - a)² - b",
            marks: 3,
            modelAnswer: "x² - 6x + 5 = (x - 3)² - 9 + 5 = (x - 3)² - 4",
            difficulty: "hard",
            topic: "algebra",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Complete the square correctly (2 marks)",
                "Simplify to final form (1 mark)"
              ]
            }
          },
          {
            id: "alg_8",
            questionText: "Find the value of x when 2^x = 16",
            marks: 2,
            modelAnswer: "2^x = 16\n2^x = 2^4\nTherefore x = 4",
            difficulty: "medium",
            topic: "algebra",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Express 16 as a power of 2 (1 mark)",
                "Equate powers to find x = 4 (1 mark)"
              ]
            }
          },
          {
            id: "alg_9",
            questionText: "Solve the inequality 3x - 5 > 7",
            marks: 2,
            modelAnswer: "3x - 5 > 7\n3x > 12\nx > 4",
            difficulty: "easy",
            topic: "algebra",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Add 5 to both sides (1 mark)",
                "Divide by 3 (1 mark)"
              ]
            }
          },
          {
            id: "alg_10",
            questionText: "Factorize completely 6x² - 9x",
            marks: 2,
            modelAnswer: "6x² - 9x = 3x(2x - 3)",
            difficulty: "medium",
            topic: "algebra",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Take out common factor 3x (1 mark)",
                "Write in factorized form (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "geometry",
        name: "Geometry",
        questions: [
          {
            id: "geo_1",
            questionText: "Calculate the area of a triangle with base 8cm and height 6cm",
            marks: 2,
            modelAnswer: "Area = ½ × base × height = ½ × 8 × 6 = 24 cm²",
            difficulty: "easy",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Use correct formula (1 mark)",
                "Calculate correctly with units (1 mark)"
              ]
            }
          },
          {
            id: "geo_2",
            questionText: "Find the circumference of a circle with radius 5cm (use π = 3.14)",
            marks: 2,
            modelAnswer: "Circumference = 2πr = 2 × 3.14 × 5 = 31.4 cm",
            difficulty: "easy",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Use correct formula C = 2πr (1 mark)",
                "Calculate correctly (1 mark)"
              ]
            }
          },
          {
            id: "geo_3",
            questionText: "Calculate the volume of a cuboid with dimensions 4cm × 3cm × 2cm",
            marks: 2,
            modelAnswer: "Volume = length × width × height = 4 × 3 × 2 = 24 cm³",
            difficulty: "easy",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Use correct formula (1 mark)",
                "Calculate with correct units (1 mark)"
              ]
            }
          },
          {
            id: "geo_4",
            questionText: "Find the area of a circle with diameter 10cm (use π = 3.14)",
            marks: 3,
            modelAnswer: "Radius = 10 ÷ 2 = 5cm\nArea = πr² = 3.14 × 5² = 3.14 × 25 = 78.5 cm²",
            difficulty: "medium",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Find radius from diameter (1 mark)",
                "Use correct formula and calculate (2 marks)"
              ]
            }
          },
          {
            id: "geo_5",
            questionText: "Calculate the surface area of a cube with side length 4cm",
            marks: 3,
            modelAnswer: "Surface area = 6 × (side length)² = 6 × 4² = 6 × 16 = 96 cm²",
            difficulty: "medium",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Recognize 6 faces (1 mark)",
                "Calculate area of each face and multiply by 6 (2 marks)"
              ]
            }
          },
          {
            id: "geo_6",
            questionText: "Find the length of the hypotenuse in a right-angled triangle with sides 3cm and 4cm",
            marks: 3,
            modelAnswer: "Using Pythagoras' theorem: c² = a² + b²\nc² = 3² + 4² = 9 + 16 = 25\nc = √25 = 5cm",
            difficulty: "medium",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "State Pythagoras' theorem (1 mark)",
                "Substitute and calculate correctly (2 marks)"
              ]
            }
          },
          {
            id: "geo_7",
            questionText: "Calculate the area of a trapezium with parallel sides 6cm and 10cm, and height 4cm",
            marks: 3,
            modelAnswer: "Area = ½ × (sum of parallel sides) × height\nArea = ½ × (6 + 10) × 4 = ½ × 16 × 4 = 32 cm²",
            difficulty: "medium",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Use correct trapezium formula (1 mark)",
                "Substitute and calculate correctly (2 marks)"
              ]
            }
          },
          {
            id: "geo_8",
            questionText: "Find the volume of a cylinder with radius 3cm and height 8cm (use π = 3.14)",
            marks: 3,
            modelAnswer: "Volume = πr²h = 3.14 × 3² × 8 = 3.14 × 9 × 8 = 226.08 cm³",
            difficulty: "medium",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Use correct formula V = πr²h (1 mark)",
                "Substitute and calculate correctly (2 marks)"
              ]
            }
          },
          {
            id: "geo_9",
            questionText: "Calculate the perimeter of a rectangle with length 12cm and width 8cm",
            marks: 2,
            modelAnswer: "Perimeter = 2 × (length + width) = 2 × (12 + 8) = 2 × 20 = 40cm",
            difficulty: "easy",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Use correct formula (1 mark)",
                "Calculate correctly (1 mark)"
              ]
            }
          },
          {
            id: "geo_10",
            questionText: "Find the area of a parallelogram with base 9cm and height 5cm",
            marks: 2,
            modelAnswer: "Area = base × height = 9 × 5 = 45 cm²",
            difficulty: "easy",
            topic: "geometry",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Use correct formula (1 mark)",
                "Calculate with units (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        questions: [
          {
            id: "stat_1",
            questionText: "Find the mean of the following data set: 4, 7, 9, 12, 8",
            marks: 2,
            modelAnswer: "Mean = (4 + 7 + 9 + 12 + 8) ÷ 5 = 40 ÷ 5 = 8",
            difficulty: "easy",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Add all values correctly (1 mark)",
                "Divide by number of values (1 mark)"
              ]
            }
          },
          {
            id: "stat_2",
            questionText: "Find the median of: 3, 8, 5, 12, 9, 6, 11",
            marks: 2,
            modelAnswer: "Arrange in order: 3, 5, 6, 8, 9, 11, 12\nMedian = 8 (middle value)",
            difficulty: "easy",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Arrange data in order (1 mark)",
                "Identify middle value (1 mark)"
              ]
            }
          },
          {
            id: "stat_3",
            questionText: "Find the mode of: 2, 5, 3, 5, 8, 5, 9, 3",
            marks: 1,
            modelAnswer: "Mode = 5 (appears 3 times, most frequent)",
            difficulty: "easy",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                "Identify most frequent value (1 mark)"
              ]
            }
          },
          {
            id: "stat_4",
            questionText: "Calculate the range of: 15, 8, 23, 12, 19, 6, 21",
            marks: 2,
            modelAnswer: "Highest value = 23, Lowest value = 6\nRange = 23 - 6 = 17",
            difficulty: "easy",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Identify highest and lowest values (1 mark)",
                "Calculate difference (1 mark)"
              ]
            }
          },
          {
            id: "stat_5",
            questionText: "A dice is rolled 60 times. Calculate the expected frequency of rolling a 3.",
            marks: 2,
            modelAnswer: "Probability of rolling a 3 = 1/6\nExpected frequency = 60 × 1/6 = 10",
            difficulty: "medium",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "State probability as 1/6 (1 mark)",
                "Calculate 60 × 1/6 = 10 (1 mark)"
              ]
            }
          },
          {
            id: "stat_6",
            questionText: "Draw a frequency table for the following data: A, B, A, C, B, A, B, C, A, B",
            marks: 3,
            modelAnswer: "Letter | Frequency\nA      | 4\nB      | 4\nC      | 2",
            difficulty: "medium",
            topic: "statistics",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Set up table with correct headings (1 mark)",
                "Count frequencies correctly (2 marks)"
              ]
            }
          },
          {
            id: "stat_7",
            questionText: "Calculate the probability of drawing a red card from a standard deck of 52 cards.",
            marks: 2,
            modelAnswer: "Number of red cards = 26\nProbability = 26/52 = 1/2 = 0.5",
            difficulty: "medium",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Identify 26 red cards (1 mark)",
                "Calculate probability as 1/2 (1 mark)"
              ]
            }
          },
          {
            id: "stat_8",
            questionText: "Find the mean from this frequency table: Score: 1(freq 3), 2(freq 5), 3(freq 2)",
            marks: 3,
            modelAnswer: "Total = (1×3) + (2×5) + (3×2) = 3 + 10 + 6 = 19\nNumber of values = 3 + 5 + 2 = 10\nMean = 19 ÷ 10 = 1.9",
            difficulty: "medium",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Calculate total of (value × frequency) (2 marks)",
                "Divide by total frequency (1 mark)"
              ]
            }
          },
          {
            id: "stat_9",
            questionText: "Two coins are flipped. What is the probability of getting exactly one head?",
            marks: 3,
            modelAnswer: "Possible outcomes: HH, HT, TH, TT\nOutcomes with exactly one head: HT, TH\nProbability = 2/4 = 1/2",
            difficulty: "medium",
            topic: "statistics",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "List all possible outcomes (1 mark)",
                "Identify favorable outcomes and calculate probability (2 marks)"
              ]
            }
          },
          {
            id: "stat_10",
            questionText: "Interpret this data: In a survey of 100 people, 60 preferred tea, 30 preferred coffee, 10 had no preference. Create a pie chart showing the angles.",
            marks: 4,
            modelAnswer: "Tea: (60/100) × 360° = 216°\nCoffee: (30/100) × 360° = 108°\nNo preference: (10/100) × 360° = 36°\nTotal check: 216° + 108° + 36° = 360°",
            difficulty: "hard",
            topic: "statistics",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Calculate angle for tea (1 mark)",
                "Calculate angles for coffee and no preference (2 marks)",
                "Check total equals 360° (1 mark)"
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "biology",
    name: "Biology",
    color: "bg-green-500",
    topics: [
      {
        id: "cell_biology",
        name: "Cell Biology",
        questions: [
          {
            id: "bio_cell_1",
            questionText: "Describe the structure and function of the cell membrane.",
            marks: 4,
            modelAnswer: "The cell membrane is a phospholipid bilayer with embedded proteins. It controls what enters and leaves the cell through selective permeability. Phospholipids have hydrophilic heads facing outward and hydrophobic tails facing inward, creating a barrier to water-soluble substances.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe phospholipid bilayer structure (2 marks)",
                "Explain selective permeability function (2 marks)"
              ]
            }
          },
          {
            id: "bio_cell_2",
            questionText: "Compare plant and animal cells, highlighting three key differences.",
            marks: 3,
            modelAnswer: "Plant cells have: 1) Cell wall made of cellulose for structural support, 2) Chloroplasts containing chlorophyll for photosynthesis, 3) Large permanent vacuole for storage and support. Animal cells lack these structures.",
            difficulty: "easy",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 3,
              ao2: 0,
              ao3: 0,
              breakdown: [
                "Cell wall difference (1 mark)",
                "Chloroplasts difference (1 mark)",
                "Vacuole difference (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_3",
            questionText: "Explain the process of mitosis and its importance.",
            marks: 5,
            modelAnswer: "Mitosis produces two genetically identical diploid cells from one parent cell. Stages: prophase (chromosomes condense), metaphase (chromosomes align), anaphase (chromatids separate), telophase (nuclei reform). Important for growth, repair, and asexual reproduction.",
            difficulty: "hard",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Describe the four stages (3 marks)",
                "State outcome of identical cells (1 mark)",
                "Explain importance (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_4",
            questionText: "Describe the structure and function of mitochondria.",
            marks: 3,
            modelAnswer: "Mitochondria have a double membrane with inner membrane folded into cristae. They are the site of aerobic respiration, producing ATP (cellular energy). Often called the 'powerhouse of the cell'.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Describe double membrane and cristae (2 marks)",
                "State function in respiration/ATP production (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_5",
            questionText: "Explain how substances move across cell membranes by diffusion.",
            marks: 4,
            modelAnswer: "Diffusion is the passive movement of particles from high to low concentration down a concentration gradient. No energy required. Small molecules like oxygen and carbon dioxide can diffuse directly through the phospholipid bilayer.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define diffusion and concentration gradient (2 marks)",
                "State it's passive/no energy needed (1 mark)",
                "Give examples of molecules (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_6",
            questionText: "Describe the process of osmosis in plant cells.",
            marks: 4,
            modelAnswer: "Osmosis is the movement of water across a semi-permeable membrane from high to low water potential. In plant cells, water enters by osmosis making the cell turgid (swollen), which provides structural support. Cell wall prevents bursting.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define osmosis (2 marks)",
                "Explain turgidity and structural support (2 marks)"
              ]
            }
          },
          {
            id: "bio_cell_7",
            questionText: "Explain the role of enzymes in cellular processes.",
            marks: 4,
            modelAnswer: "Enzymes are biological catalysts that speed up chemical reactions by lowering activation energy. They have specific active sites that bind to substrates. Essential for metabolism, DNA replication, and protein synthesis in cells.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define enzymes as catalysts (1 mark)",
                "Explain active site and substrate binding (2 marks)",
                "Give examples of cellular processes (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_8",
            questionText: "Describe the structure and function of ribosomes.",
            marks: 3,
            modelAnswer: "Ribosomes are small organelles made of RNA and protein. They can be free in cytoplasm or attached to rough ER. Function is protein synthesis by translating mRNA into polypeptide chains.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Describe structure (RNA and protein) (1 mark)",
                "State locations (free/attached to ER) (1 mark)",
                "Explain protein synthesis function (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_9",
            questionText: "Explain active transport and give an example.",
            marks: 3,
            modelAnswer: "Active transport moves substances against concentration gradient using energy (ATP). Requires carrier proteins. Example: uptake of mineral ions by plant roots from soil where ion concentration is lower than in root cells.",
            difficulty: "medium",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Define active transport (against gradient, needs energy) (2 marks)",
                "Give appropriate example (1 mark)"
              ]
            }
          },
          {
            id: "bio_cell_10",
            questionText: "Describe the cell cycle and explain when DNA replication occurs.",
            marks: 4,
            modelAnswer: "Cell cycle consists of interphase (G1, S, G2) and mitosis (M phase). DNA replication occurs during S phase of interphase. This ensures each daughter cell receives identical genetic information during cell division.",
            difficulty: "hard",
            topic: "cell_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Identify phases of cell cycle (2 marks)",
                "State DNA replication occurs in S phase (1 mark)",
                "Explain importance for daughter cells (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "human_biology",
        name: "Human Biology",
        questions: [
          {
            id: "bio_human_1",
            questionText: "Describe the structure and function of the human heart.",
            marks: 5,
            modelAnswer: "The heart has four chambers: two atria (receive blood) and two ventricles (pump blood). Right side pumps deoxygenated blood to lungs, left side pumps oxygenated blood to body. Valves prevent backflow. Cardiac muscle contracts rhythmically.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify four chambers and their functions (2 marks)",
                "Explain double circulation (2 marks)",
                "Mention valves and cardiac muscle (1 mark)"
              ]
            }
          },
          {
            id: "bio_human_2",
            questionText: "Explain how the lungs are adapted for gas exchange.",
            marks: 4,
            modelAnswer: "Alveoli provide large surface area for gas exchange. Thin walls (one cell thick) allow rapid diffusion. Rich blood supply maintains concentration gradients. Moist surfaces dissolve gases for diffusion.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Large surface area from alveoli (1 mark)",
                "Thin walls for rapid diffusion (1 mark)",
                "Rich blood supply and moist surfaces (2 marks)"
              ]
            }
          },
          {
            id: "bio_human_3",
            questionText: "Describe the process of digestion in the small intestine.",
            marks: 4,
            modelAnswer: "Pancreatic enzymes break down proteins, carbohydrates, and fats. Bile from liver emulsifies fats. Intestinal enzymes complete digestion. Villi absorb digested nutrients into bloodstream through their large surface area.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe enzyme action (2 marks)",
                "Explain absorption by villi (2 marks)"
              ]
            }
          },
          {
            id: "bio_human_4",
            questionText: "Explain how the kidney filters blood and produces urine.",
            marks: 5,
            modelAnswer: "Blood enters glomerulus under high pressure. Small molecules filter into Bowman's capsule. Useful substances (glucose, some water, salts) are reabsorbed in tubules. Waste products (urea) remain to form urine.",
            difficulty: "hard",
            topic: "human_biology",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe filtration at glomerulus (2 marks)",
                "Explain selective reabsorption (2 marks)",
                "Identify waste products in urine (1 mark)"
              ]
            }
          },
          {
            id: "bio_human_5",
            questionText: "Describe the components of blood and their functions.",
            marks: 4,
            modelAnswer: "Red blood cells carry oxygen using hemoglobin. White blood cells fight infection through phagocytosis and antibody production. Platelets help blood clotting. Plasma transports dissolved substances around the body.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 4,
              ao2: 0,
              ao3: 0,
              breakdown: [
                "Red blood cells and oxygen transport (1 mark)",
                "White blood cells and immunity (1 mark)",
                "Platelets and clotting (1 mark)",
                "Plasma and transport (1 mark)"
              ]
            }
          },
          {
            id: "bio_human_6",
            questionText: "Explain how the nervous system coordinates responses to stimuli.",
            marks: 4,
            modelAnswer: "Receptors detect stimuli and send electrical impulses along sensory neurons to CNS. Brain/spinal cord processes information. Motor neurons carry impulses to effectors (muscles/glands) which produce responses.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Stimulus detection by receptors (1 mark)",
                "Processing by CNS (1 mark)",
                "Response by effectors (2 marks)"
              ]
            }
          },
          {
            id: "bio_human_7",
            questionText: "Describe the menstrual cycle and the role of hormones.",
            marks: 5,
            modelAnswer: "28-day cycle controlled by hormones. FSH stimulates egg development and estrogen production. LH triggers ovulation. Estrogen and progesterone prepare uterus lining. If no fertilization, hormone levels drop causing menstruation.",
            difficulty: "hard",
            topic: "human_biology",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify key hormones (FSH, LH, estrogen, progesterone) (2 marks)",
                "Explain ovulation and uterus preparation (2 marks)",
                "Link hormone drop to menstruation (1 mark)"
              ]
            }
          },
          {
            id: "bio_human_8",
            questionText: "Explain how the body maintains constant body temperature.",
            marks: 4,
            modelAnswer: "Hypothalamus detects temperature changes. When hot: sweating increases heat loss, blood vessels dilate (vasodilation). When cold: shivering generates heat, blood vessels constrict (vasoconstriction), hair stands up.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify hypothalamus as control center (1 mark)",
                "Explain responses to overheating (1 mark)",
                "Explain responses to cooling (2 marks)"
              ]
            }
          },
          {
            id: "bio_human_9",
            questionText: "Describe the immune system's response to pathogens.",
            marks: 4,
            modelAnswer: "White blood cells detect foreign antigens on pathogens. Phagocytes engulf and destroy pathogens. Lymphocytes produce specific antibodies that bind to antigens. Memory cells provide immunity against future infections.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe phagocytosis (1 mark)",
                "Explain antibody production (2 marks)",
                "Mention memory cells and immunity (1 mark)"
              ]
            }
          },
          {
            id: "bio_human_10",
            questionText: "Explain the effects of smoking on the respiratory system.",
            marks: 4,
            modelAnswer: "Tar damages cilia, reducing their ability to remove mucus and bacteria. Nicotine is addictive and increases heart rate. Carbon monoxide reduces oxygen-carrying capacity of blood. Increases risk of lung cancer, emphysema, and heart disease.",
            difficulty: "medium",
            topic: "human_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Explain effects of tar and nicotine (2 marks)",
                "Describe carbon monoxide effects (1 mark)",
                "Link to diseases (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "plant_biology",
        name: "Plant Biology",
        questions: [
          {
            id: "bio_plant_1",
            questionText: "Describe the process of photosynthesis and write the word equation.",
            marks: 4,
            modelAnswer: "Photosynthesis converts light energy into chemical energy in glucose. Occurs in chloroplasts using chlorophyll. Word equation: Carbon dioxide + Water → Glucose + Oxygen (in the presence of light and chlorophyll).",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define photosynthesis process (1 mark)",
                "Mention chloroplasts and chlorophyll (1 mark)",
                "Write correct word equation (2 marks)"
              ]
            }
          },
          {
            id: "bio_plant_2",
            questionText: "Explain how leaves are adapted for photosynthesis.",
            marks: 4,
            modelAnswer: "Large surface area to absorb maximum light. Thin structure allows light penetration. Chloroplasts in palisade cells contain chlorophyll. Stomata allow gas exchange. Veins transport water and remove glucose.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Large surface area and thin structure (1 mark)",
                "Chloroplasts and chlorophyll (1 mark)",
                "Stomata for gas exchange and veins for transport (2 marks)"
              ]
            }
          },
          {
            id: "bio_plant_3",
            questionText: "Describe how water moves through a plant from roots to leaves.",
            marks: 4,
            modelAnswer: "Water enters root hair cells by osmosis. Moves through root cortex to xylem vessels. Transported up stem in xylem by transpiration pull. Water evaporates from leaf surfaces through stomata (transpiration).",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Water uptake by root hairs (1 mark)",
                "Transport in xylem vessels (1 mark)",
                "Transpiration from leaves (2 marks)"
              ]
            }
          },
          {
            id: "bio_plant_4",
            questionText: "Explain the factors that affect the rate of photosynthesis.",
            marks: 4,
            modelAnswer: "Light intensity: more light increases rate until saturation. Temperature: higher temperature increases rate until enzymes denature. Carbon dioxide concentration: higher CO₂ increases rate until other factors limit.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Explain light intensity effect (1 mark)",
                "Explain temperature effect (2 marks)",
                "Explain CO₂ concentration effect (1 mark)"
              ]
            }
          },
          {
            id: "bio_plant_5",
            questionText: "Describe the structure and function of xylem and phloem.",
            marks: 4,
            modelAnswer: "Xylem: dead cells forming tubes, transport water and minerals upward, strengthened with lignin. Phloem: living cells (sieve tubes), transport glucose and amino acids in both directions, supported by companion cells.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe xylem structure and function (2 marks)",
                "Describe phloem structure and function (2 marks)"
              ]
            }
          },
          {
            id: "bio_plant_6",
            questionText: "Explain how plants respond to light (phototropism).",
            marks: 3,
            modelAnswer: "Plant shoots grow toward light source. Auxin hormone accumulates on shaded side of shoot. This causes cells on shaded side to elongate more, bending shoot toward light.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define phototropism (1 mark)",
                "Explain auxin distribution and cell elongation (2 marks)"
              ]
            }
          },
          {
            id: "bio_plant_7",
            questionText: "Describe the process of seed germination.",
            marks: 4,
            modelAnswer: "Seed absorbs water and swells. Enzymes become active and break down stored food (starch to glucose). Radicle (root) emerges first, then plumule (shoot). Cotyledons provide food until leaves develop for photosynthesis.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Water absorption and enzyme activation (1 mark)",
                "Emergence of radicle and plumule (2 marks)",
                "Role of cotyledons (1 mark)"
              ]
            }
          },
          {
            id: "bio_plant_8",
            questionText: "Explain the importance of mineral ions for plant growth.",
            marks: 3,
            modelAnswer: "Nitrates needed for amino acid and protein synthesis. Phosphates required for DNA, RNA, and ATP. Potassium essential for enzyme activation and water regulation. Deficiency causes poor growth and yellowing leaves.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Identify roles of nitrates and phosphates (2 marks)",
                "Explain deficiency symptoms (1 mark)"
              ]
            }
          },
          {
            id: "bio_plant_9",
            questionText: "Describe how stomata control gas exchange and water loss.",
            marks: 4,
            modelAnswer: "Stomata are pores surrounded by guard cells. When guard cells absorb water, they become turgid and stomata open for gas exchange. When water is lost, guard cells become flaccid and stomata close to reduce water loss.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe stomata and guard cell structure (1 mark)",
                "Explain opening mechanism (1 mark)",
                "Explain closing mechanism (2 marks)"
              ]
            }
          },
          {
            id: "bio_plant_10",
            questionText: "Compare sexual and asexual reproduction in plants.",
            marks: 4,
            modelAnswer: "Sexual reproduction involves flowers, pollination, and seed formation, producing genetic variation. Asexual reproduction (vegetative propagation) produces genetically identical offspring through runners, bulbs, or fragmentation. Faster but no variation.",
            difficulty: "medium",
            topic: "plant_biology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe sexual reproduction and variation (2 marks)",
                "Describe asexual reproduction methods (2 marks)"
              ]
            }
          }
        ]
      },
      {
        id: "bioenergetics",
        name: "Bioenergetics",
        questions: [
          {
            id: "bio_bioenerget_1",
            questionText: "Explain the process of photosynthesis and write the balanced chemical equation.",
            marks: 4,
            modelAnswer: "Photosynthesis is the process by which plants convert light energy into chemical energy. The balanced equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This occurs in chloroplasts using chlorophyll to capture light energy.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define photosynthesis (1 mark)",
                "Write correct balanced equation (2 marks)",
                "Mention chloroplasts and chlorophyll (1 mark)"
              ]
            }
          },
          {
            id: "bio_bioenerget_2",
            questionText: "Compare aerobic and anaerobic respiration in terms of oxygen requirement, location, and energy yield.",
            marks: 4,
            modelAnswer: "Aerobic respiration requires oxygen, occurs in mitochondria, and yields 38 ATP molecules per glucose. Anaerobic respiration occurs without oxygen, happens in cytoplasm, and yields only 2 ATP molecules per glucose.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Oxygen requirement difference (1 mark)",
                "Location difference (1 mark)",
                "Energy yield comparison (2 marks)"
              ]
            }
          },
          {
            id: "bio_bioenerget_3",
            questionText: "Describe the role of ATP in cellular processes and explain its structure.",
            marks: 3,
            modelAnswer: "ATP (adenosine triphosphate) is the universal energy currency of cells. It consists of adenine base, ribose sugar, and three phosphate groups. Energy is released when the terminal phosphate bond is broken, forming ADP.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Define ATP as energy currency (1 mark)",
                "Describe structure components (1 mark)",
                "Explain energy release mechanism (1 mark)"
              ]
            }
          },
          {
            id: "bio_bioenerget_4",
            questionText: "Explain the light-dependent and light-independent reactions of photosynthesis.",
            marks: 5,
            modelAnswer: "Light-dependent reactions occur in thylakoids, where chlorophyll absorbs light energy to split water molecules, releasing oxygen and producing ATP and NADPH. Light-independent reactions (Calvin cycle) occur in stroma, using CO₂, ATP, and NADPH to produce glucose.",
            difficulty: "hard",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Location of light-dependent reactions (1 mark)",
                "Products of light-dependent reactions (2 marks)",
                "Location and process of Calvin cycle (2 marks)"
              ]
            }
          },
          {
            id: "bio_bioenerget_5",
            questionText: "Describe the process of glycolysis and its importance in cellular respiration.",
            marks: 4,
            modelAnswer: "Glycolysis is the breakdown of glucose into two pyruvate molecules in the cytoplasm. It produces 2 ATP molecules and 2 NADH molecules without requiring oxygen. It's the first stage of both aerobic and anaerobic respiration.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define glycolysis process (1 mark)",
                "Location and products (2 marks)",
                "Role in respiration pathways (1 mark)"
              ]
            }
          },
          {
            id: "bio_bioenerget_6",
            questionText: "Explain how environmental factors affect the rate of photosynthesis.",
            marks: 4,
            modelAnswer: "Light intensity, CO₂ concentration, and temperature are limiting factors. Increased light intensity increases rate until saturation. Higher CO₂ concentration increases rate until other factors become limiting. Optimal temperature increases rate, but too high denatures enzymes.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify three limiting factors (1 mark)",
                "Explain effect of light intensity (1 mark)",
                "Explain effect of CO₂ and temperature (2 marks)"
              ]
            }
          },
          {
            id: "bio_bioenerget_7",
            questionText: "Compare the energy yield from respiration of glucose versus fatty acids.",
            marks: 3,
            modelAnswer: "Glucose yields approximately 38 ATP molecules through complete aerobic respiration. Fatty acids yield significantly more ATP per molecule due to more C-H bonds. For example, palmitic acid yields about 129 ATP molecules.",
            difficulty: "hard",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "State glucose ATP yield (1 mark)",
                "Compare fatty acid yield (1 mark)",
                "Explain reason for difference (1 mark)"
              ]
            }
          },
          {
            id: "bio_bioenerget_8",
            questionText: "Describe the role of enzymes in metabolic pathways and energy transfer.",
            marks: 4,
            modelAnswer: "Enzymes are biological catalysts that lower activation energy for metabolic reactions. They facilitate energy transfer by breaking and forming chemical bonds. They are specific to substrates and can be regulated to control metabolic pathways.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define enzyme function (1 mark)",
                "Explain activation energy lowering (1 mark)",
                "Describe specificity and regulation (2 marks)"
              ]
            }
          },
          {
            id: "bio_bioenerget_9",
            questionText: "Explain the chemiosmotic theory and its role in ATP synthesis.",
            marks: 5,
            modelAnswer: "The chemiosmotic theory explains ATP synthesis through the electrochemical gradient of protons across membranes. Electron transport creates a proton gradient, and ATP synthase uses the flow of protons back through the membrane to drive ATP synthesis.",
            difficulty: "hard",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Define chemiosmotic theory (1 mark)",
                "Explain proton gradient formation (2 marks)",
                "Describe ATP synthase mechanism (2 marks)"
              ]
            }
          },
          {
            id: "bio_bioenerget_10",
            questionText: "Analyze the efficiency of energy transfer in food chains and explain energy losses.",
            marks: 4,
            modelAnswer: "Energy transfer efficiency between trophic levels is typically 10%. Energy is lost through respiration, movement, heat production, and incomplete consumption. This explains why food chains rarely exceed 4-5 trophic levels.",
            difficulty: "medium",
            topic: "bioenergetics",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "State 10% efficiency rule (1 mark)",
                "Identify sources of energy loss (2 marks)",
                "Link to food chain length (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "homeostasis_response",
        name: "Homeostasis and Response",
        questions: [
          {
            id: "bio_homeo_1",
            questionText: "Explain the principle of negative feedback in homeostasis with reference to blood glucose regulation.",
            marks: 5,
            modelAnswer: "Negative feedback maintains homeostasis by reversing changes. When blood glucose rises, pancreas releases insulin, causing cells to absorb glucose and liver to store it as glycogen. When glucose falls, glucagon is released, promoting glycogen breakdown to glucose.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Define negative feedback principle (1 mark)",
                "Explain insulin response to high glucose (2 marks)",
                "Explain glucagon response to low glucose (2 marks)"
              ]
            }
          },
          {
            id: "bio_homeo_2",
            questionText: "Describe the structure and function of a motor neuron.",
            marks: 4,
            modelAnswer: "Motor neurons have a cell body containing nucleus and organelles, dendrites that receive signals, a long axon covered by myelin sheath for rapid conduction, and axon terminals that release neurotransmitters at synapses with muscle fibers.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Identify cell body and nucleus (1 mark)",
                "Describe axon and myelin sheath (2 marks)",
                "Explain axon terminals and neurotransmitters (1 mark)"
              ]
            }
          },
          {
            id: "bio_homeo_3",
            questionText: "Explain how the kidney regulates water balance through the action of ADH.",
            marks: 4,
            modelAnswer: "When blood water content is low, hypothalamus detects this and pituitary gland releases ADH. ADH increases permeability of collecting ducts in kidneys, allowing more water reabsorption and producing concentrated urine.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify detection by hypothalamus (1 mark)",
                "Explain ADH release from pituitary (1 mark)",
                "Describe effect on collecting ducts (2 marks)"
              ]
            }
          },
          {
            id: "bio_homeo_4",
            questionText: "Compare the sympathetic and parasympathetic nervous systems.",
            marks: 4,
            modelAnswer: "Sympathetic nervous system prepares body for 'fight or flight' responses, increasing heart rate, dilating pupils, and inhibiting digestion. Parasympathetic system promotes 'rest and digest', decreasing heart rate, constricting pupils, and stimulating digestion.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define sympathetic function (1 mark)",
                "Give sympathetic examples (1 mark)",
                "Define parasympathetic function and examples (2 marks)"
              ]
            }
          },
          {
            id: "bio_homeo_5",
            questionText: "Describe the process of synaptic transmission.",
            marks: 5,
            modelAnswer: "Action potential reaches axon terminal, causing calcium channels to open. Calcium influx triggers vesicles containing neurotransmitters to fuse with membrane. Neurotransmitters cross synaptic cleft and bind to receptors on postsynaptic membrane, potentially generating new action potential.",
            difficulty: "hard",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Action potential arrives at terminal (1 mark)",
                "Calcium influx and vesicle fusion (2 marks)",
                "Neurotransmitter release and binding (2 marks)"
              ]
            }
          },
          {
            id: "bio_homeo_6",
            questionText: "Explain how the eye responds to changes in light intensity.",
            marks: 4,
            modelAnswer: "In bright light, circular muscles in iris contract and radial muscles relax, making pupil smaller to reduce light entry. In dim light, radial muscles contract and circular muscles relax, making pupil larger to allow more light entry.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe bright light response (2 marks)",
                "Describe dim light response (2 marks)"
              ]
            }
          },
          {
            id: "bio_homeo_7",
            questionText: "Describe the role of the hypothalamus in temperature regulation.",
            marks: 4,
            modelAnswer: "Hypothalamus acts as the body's thermostat, detecting temperature changes through thermoreceptors. When too hot, it triggers sweating, vasodilation, and behavioral responses. When too cold, it triggers shivering, vasoconstriction, and hair raising.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify hypothalamus as thermostat (1 mark)",
                "Describe responses to overheating (1 mark)",
                "Describe responses to cooling (2 marks)"
              ]
            }
          },
          {
            id: "bio_homeo_8",
            questionText: "Explain the reflex arc and its importance in rapid responses.",
            marks: 4,
            modelAnswer: "Reflex arc is the pathway for automatic responses: stimulus → sensory neuron → spinal cord → motor neuron → effector. It bypasses the brain for rapid response to potentially harmful stimuli, protecting the body from damage.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Describe reflex arc pathway (2 marks)",
                "Explain brain bypass (1 mark)",
                "State protective function (1 mark)"
              ]
            }
          },
          {
            id: "bio_homeo_9",
            questionText: "Compare hormonal and nervous control systems in the body.",
            marks: 5,
            modelAnswer: "Nervous system uses electrical impulses for rapid, short-term, localized responses via neurons. Hormonal system uses chemical messengers (hormones) for slower, longer-lasting, widespread responses via bloodstream. Both work together to coordinate body functions.",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Describe nervous system characteristics (2 marks)",
                "Describe hormonal system characteristics (2 marks)",
                "State they work together (1 mark)"
              ]
            }
          },
          {
            id: "bio_homeo_10",
            questionText: "Explain how plant hormones coordinate responses to environmental stimuli.",
            marks: 4,
            modelAnswer: "Plant hormones like auxins coordinate tropisms. Auxins accumulate on shaded side of shoots, causing unequal growth and bending toward light (phototropism). In roots, auxins inhibit growth on lower side, causing downward growth (gravitropism).",
            difficulty: "medium",
            topic: "homeostasis_response",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define plant hormones and tropisms (1 mark)",
                "Explain phototropism mechanism (2 marks)",
                "Explain gravitropism in roots (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "inheritance_variation_evolution",
        name: "Inheritance, Variation and Evolution",
        questions: [
          {
            id: "bio_inherit_1",
            questionText: "Explain the difference between genotype and phenotype with examples.",
            marks: 3,
            modelAnswer: "Genotype is the genetic makeup of an organism (e.g., BB, Bb, bb for eye color). Phenotype is the observable characteristics resulting from genotype and environment interaction (e.g., brown eyes, blue eyes).",
            difficulty: "easy",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Define genotype (1 mark)",
                "Define phenotype (1 mark)",
                "Provide appropriate examples (1 mark)"
              ]
            }
          },
          {
            id: "bio_inherit_2",
            questionText: "Using a genetic diagram, show the inheritance of a recessive trait through two heterozygous parents.",
            marks: 4,
            modelAnswer: "Parents: Aa × Aa. Gametes: A, a from each parent. Offspring: AA (1), Aa (2), aa (1). Genotype ratio 1:2:1. If 'a' is recessive trait, phenotype ratio is 3:1 (dominant:recessive).",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Set up cross correctly (1 mark)",
                "Show all offspring genotypes (2 marks)",
                "State correct ratios (1 mark)"
              ]
            }
          },
          {
            id: "bio_inherit_3",
            questionText: "Explain how natural selection leads to evolution.",
            marks: 5,
            modelAnswer: "Natural selection occurs when individuals with advantageous traits survive and reproduce more successfully. Over time, beneficial alleles become more frequent in the population while disadvantageous ones decrease, leading to evolutionary change.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Define natural selection (2 marks)",
                "Explain differential survival and reproduction (2 marks)",
                "Link to evolutionary change (1 mark)"
              ]
            }
          },
          {
            id: "bio_inherit_4",
            questionText: "Describe the structure of DNA and explain its importance in heredity.",
            marks: 5,
            modelAnswer: "DNA is a double helix with two antiparallel strands held together by hydrogen bonds between complementary base pairs (A-T, G-C). Each strand has a sugar-phosphate backbone. DNA carries genetic information in the sequence of bases, which is passed from parents to offspring.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Describe double helix structure (2 marks)",
                "Explain base pairing and backbone (1 mark)",
                "Link structure to heredity function (2 marks)"
              ]
            }
          },
          {
            id: "bio_inherit_5",
            questionText: "Explain the causes of genetic variation in organisms.",
            marks: 4,
            modelAnswer: "Genetic variation arises from sexual reproduction (independent assortment and crossing over during meiosis), mutations (changes in DNA sequence), and random fertilization. Environmental factors can also influence gene expression.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Explain sexual reproduction contribution (2 marks)",
                "Describe mutations (1 mark)",
                "Mention environmental influence (1 mark)"
              ]
            }
          },
          {
            id: "bio_inherit_6",
            questionText: "Compare sexual and asexual reproduction in terms of genetic diversity.",
            marks: 4,
            modelAnswer: "Sexual reproduction produces genetic diversity through meiosis and fertilization, creating offspring that differ from parents. Asexual reproduction produces genetically identical clones with no genetic diversity, except for occasional mutations.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Explain sexual reproduction diversity (2 marks)",
                "Explain asexual reproduction uniformity (2 marks)"
              ]
            }
          },
          {
            id: "bio_inherit_7",
            questionText: "Describe the process of speciation and give an example.",
            marks: 4,
            modelAnswer: "Speciation occurs when populations become reproductively isolated and accumulate genetic differences over time until they can no longer interbreed. Example: Darwin's finches evolved different beak shapes on isolated islands based on available food sources.",
            difficulty: "hard",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define speciation process (2 marks)",
                "Provide appropriate example (1 mark)",
                "Link example to process (1 mark)"
              ]
            }
          },
          {
            id: "bio_inherit_8",
            questionText: "Explain how selective breeding differs from natural selection.",
            marks: 3,
            modelAnswer: "Selective breeding involves humans choosing which organisms reproduce based on desired traits, while natural selection involves environmental pressures determining which organisms survive and reproduce. Both result in changes to allele frequencies over time.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Define selective breeding (1 mark)",
                "Define natural selection (1 mark)",
                "Compare the two processes (1 mark)"
              ]
            }
          },
          {
            id: "bio_inherit_9",
            questionText: "Describe the evidence for evolution from fossils, anatomy, and DNA.",
            marks: 5,
            modelAnswer: "Fossil evidence shows progression of species over time. Anatomical evidence includes homologous structures showing common ancestry and vestigial organs. DNA evidence shows genetic similarities between related species, with closer relationships having more similar DNA sequences.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Explain fossil evidence (1 mark)",
                "Describe anatomical evidence (2 marks)",
                "Explain DNA evidence (2 marks)"
              ]
            }
          },
          {
            id: "bio_inherit_10",
            questionText: "Explain the role of mutations in evolution and give examples of beneficial mutations.",
            marks: 4,
            modelAnswer: "Mutations provide raw material for evolution by creating new alleles. Most are neutral or harmful, but beneficial mutations increase survival or reproduction. Examples include antibiotic resistance in bacteria and sickle cell trait providing malaria resistance.",
            difficulty: "medium",
            topic: "inheritance_variation_evolution",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Explain mutations as evolutionary material (2 marks)",
                "Provide beneficial mutation examples (1 mark)",
                "Link examples to survival advantage (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "ecology",
        name: "Ecology",
        questions: [
          {
            id: "bio_ecology_1",
            questionText: "Define ecosystem and describe the main components of an ecosystem.",
            marks: 4,
            modelAnswer: "An ecosystem is a community of organisms interacting with each other and their physical environment. Main components include biotic factors (living organisms like producers, consumers, decomposers) and abiotic factors (non-living elements like temperature, light, water, soil).",
            difficulty: "easy",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define ecosystem (1 mark)",
                "Identify biotic components (1 mark)",
                "Identify abiotic components (2 marks)"
              ]
            }
          },
          {
            id: "bio_ecology_2",
            questionText: "Explain the carbon cycle and its importance in ecosystems.",
            marks: 5,
            modelAnswer: "Carbon cycle involves carbon movement between atmosphere, organisms, and environment. Plants remove CO₂ via photosynthesis, animals return it via respiration. Decomposition, combustion, and ocean exchange also transfer carbon. It's vital for maintaining atmospheric CO₂ levels and climate regulation.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Describe carbon removal by plants (1 mark)",
                "Describe carbon release processes (2 marks)",
                "Explain importance for climate (2 marks)"
              ]
            }
          },
          {
            id: "bio_ecology_3",
            questionText: "Describe predator-prey relationships and their effect on population sizes.",
            marks: 4,
            modelAnswer: "Predator-prey relationships show cyclical population changes. When prey increases, more food supports predator growth. As predators increase, they reduce prey population. Reduced prey leads to predator decline, allowing prey recovery. This creates oscillating population cycles.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Explain initial prey increase effect (1 mark)",
                "Describe predator increase and prey decline (1 mark)",
                "Explain cyclical nature (2 marks)"
              ]
            }
          },
          {
            id: "bio_ecology_4",
            questionText: "Explain how human activities affect biodiversity and suggest conservation methods.",
            marks: 5,
            modelAnswer: "Human activities reduce biodiversity through deforestation, pollution, habitat destruction, and climate change. Conservation methods include protected areas, breeding programs, sustainable resource use, habitat restoration, and international cooperation through treaties.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Identify human threats to biodiversity (2 marks)",
                "Suggest conservation methods (2 marks)",
                "Evaluate effectiveness (1 mark)"
              ]
            }
          },
          {
            id: "bio_ecology_5",
            questionText: "Describe the nitrogen cycle and explain its importance for plant growth.",
            marks: 5,
            modelAnswer: "Nitrogen cycle converts atmospheric N₂ into usable forms. Nitrogen fixation by bacteria converts N₂ to ammonia. Nitrification converts ammonia to nitrites then nitrates. Plants absorb nitrates for protein synthesis. Denitrification returns N₂ to atmosphere, completing the cycle.",
            difficulty: "hard",
            topic: "ecology",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe nitrogen fixation (1 mark)",
                "Explain nitrification process (2 marks)",
                "Link to plant protein synthesis and denitrification (2 marks)"
              ]
            }
          },
          {
            id: "bio_ecology_6",
            questionText: "Compare the advantages and disadvantages of different sampling methods in ecology.",
            marks: 4,
            modelAnswer: "Quadrats are good for plants and slow animals but may miss mobile species. Transects show distribution patterns but may not represent whole area. Mark-recapture works for mobile animals but requires identification and assumes no migration.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe quadrat advantages/disadvantages (1 mark)",
                "Explain transect method pros/cons (1 mark)",
                "Discuss mark-recapture limitations (2 marks)"
              ]
            }
          },
          {
            id: "bio_ecology_7",
            questionText: "Explain the concept of ecological succession with an example.",
            marks: 4,
            modelAnswer: "Ecological succession is the gradual change in species composition over time in an ecosystem. Primary succession occurs on bare rock, starting with lichens, then mosses, grasses, shrubs, and finally trees. Each stage modifies conditions for the next.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define ecological succession (1 mark)",
                "Provide example sequence (2 marks)",
                "Explain stage modifications (1 mark)"
              ]
            }
          },
          {
            id: "bio_ecology_8",
            questionText: "Describe the impact of acid rain on ecosystems.",
            marks: 4,
            modelAnswer: "Acid rain lowers soil and water pH, affecting plant growth and aquatic life. It leaches nutrients from soil, damages tree leaves, and makes water bodies too acidic for fish and other organisms. It also affects food chains by reducing primary producers.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Explain pH effects on soil and water (2 marks)",
                "Describe effects on plants and animals (1 mark)",
                "Link to food chain impacts (1 mark)"
              ]
            }
          },
          {
            id: "bio_ecology_9",
            questionText: "Explain the greenhouse effect and its role in global warming.",
            marks: 4,
            modelAnswer: "Greenhouse effect occurs when greenhouse gases (CO₂, methane, water vapor) trap heat in Earth's atmosphere. Solar radiation enters, but infrared radiation is absorbed and re-emitted by these gases. Enhanced greenhouse effect from human activities causes global warming.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define greenhouse effect (1 mark)",
                "Identify greenhouse gases (1 mark)",
                "Link human activities to global warming (2 marks)"
              ]
            }
          },
          {
            id: "bio_ecology_10",
            questionText: "Describe adaptation strategies of organisms in extreme environments.",
            marks: 4,
            modelAnswer: "Desert organisms conserve water through thick waxy cuticles, water storage tissues, and concentrated urine. Arctic organisms have thick insulation, counter-current heat exchange, and antifreeze proteins. Deep-sea organisms have pressure-resistant proteins and bioluminescence.",
            difficulty: "medium",
            topic: "ecology",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Describe desert adaptations (1 mark)",
                "Explain Arctic adaptations (1 mark)",
                "Describe deep-sea adaptations (2 marks)"
              ]
            }
          }
        ]
      },
      {
        id: "key_ideas",
        name: "Key Ideas",
        questions: [
          {
            id: "bio_key_1",
            questionText: "Explain the cell theory and its significance in biology.",
            marks: 4,
            modelAnswer: "Cell theory states that: (1) all living things are made of cells, (2) cells are the basic unit of life, and (3) all cells come from pre-existing cells. This theory unified biology by providing a fundamental framework for understanding life at the cellular level.",
            difficulty: "easy",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "State three principles of cell theory (3 marks)",
                "Explain significance for biology (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_2",
            questionText: "Compare prokaryotic and eukaryotic cells, giving examples of each.",
            marks: 5,
            modelAnswer: "Prokaryotic cells lack a nucleus and membrane-bound organelles (e.g., bacteria, archaea). Eukaryotic cells have a nucleus and organelles like mitochondria, ER, and Golgi apparatus (e.g., plant, animal, fungal cells). Prokaryotes have genetic material freely in cytoplasm.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define prokaryotic cells with examples (2 marks)",
                "Define eukaryotic cells with examples (2 marks)",
                "Compare genetic material organization (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_3",
            questionText: "Explain the importance of enzymes in biological systems and factors affecting their activity.",
            marks: 5,
            modelAnswer: "Enzymes are biological catalysts that speed up reactions by lowering activation energy. They're essential for metabolism, DNA replication, and cellular processes. Activity is affected by temperature, pH, enzyme concentration, substrate concentration, and presence of inhibitors or cofactors.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Define enzyme function and importance (2 marks)",
                "List factors affecting activity (2 marks)",
                "Explain how factors affect activity (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_4",
            questionText: "Describe the hierarchy of biological organization from molecules to ecosystems.",
            marks: 4,
            modelAnswer: "Biological organization follows: molecules → organelles → cells → tissues → organs → organ systems → organisms → populations → communities → ecosystems → biosphere. Each level has emergent properties not present at lower levels.",
            difficulty: "easy",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "List organizational levels in correct order (3 marks)",
                "Mention emergent properties (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_5",
            questionText: "Explain the relationship between structure and function in biological systems with examples.",
            marks: 4,
            modelAnswer: "Structure determines function in biology. Examples: red blood cells are biconcave for maximum surface area and flexibility; enzyme active sites are specifically shaped for substrates; bird wing bones are hollow for lightness while maintaining strength.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "State structure-function relationship (1 mark)",
                "Provide appropriate examples (2 marks)",
                "Link examples to principle (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_6",
            questionText: "Describe the scientific method and its application in biological research.",
            marks: 4,
            modelAnswer: "Scientific method involves: observation, hypothesis formation, prediction, experimentation with controls, data analysis, and conclusion drawing. In biology, it's used to test theories about living systems, requiring careful experimental design to account for biological variables.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "List steps of scientific method (2 marks)",
                "Explain application to biology (1 mark)",
                "Mention experimental controls (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_7",
            questionText: "Explain the concept of homeostasis and why it's important for living organisms.",
            marks: 4,
            modelAnswer: "Homeostasis is the maintenance of stable internal conditions despite external changes. It's crucial because enzymes and cellular processes require specific conditions (temperature, pH, water balance) to function optimally. Failure of homeostasis can lead to disease or death.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 1,
              breakdown: [
                "Define homeostasis (1 mark)",
                "Explain importance for enzyme function (2 marks)",
                "Link to health consequences (1 mark)"
              ]
            }
          },
          {
            id: "bio_key_8",
            questionText: "Describe the role of water in biological systems.",
            marks: 4,
            modelAnswer: "Water is essential for life as a solvent for biochemical reactions, transport medium in organisms, temperature regulator through high specific heat capacity, and structural component maintaining cell shape. Its polarity enables hydrogen bonding, crucial for protein and DNA structure.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify water as solvent and transport medium (1 mark)",
                "Explain temperature regulation role (1 mark)",
                "Describe structural and chemical roles (2 marks)"
              ]
            }
          },
          {
            id: "bio_key_9",
            questionText: "Explain the importance of surface area to volume ratio in biological systems.",
            marks: 4,
            modelAnswer: "Surface area to volume ratio determines efficiency of exchange processes. Small cells have high ratios enabling rapid diffusion of nutrients and waste. Large organisms have specialized structures (gills, lungs, villi) to increase surface area for efficient exchange.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define surface area to volume concept (1 mark)",
                "Explain relationship to cell size (1 mark)",
                "Give examples of specialized structures (2 marks)"
              ]
            }
          },
          {
            id: "bio_key_10",
            questionText: "Describe the unity and diversity of life, explaining how organisms are both similar and different.",
            marks: 5,
            modelAnswer: "All life shows unity through shared features: cellular organization, genetic code (DNA/RNA), metabolism, homeostasis, and evolution. Diversity arises through adaptation to different environments, resulting in varied structures, functions, and behaviors while maintaining underlying biological principles.",
            difficulty: "medium",
            topic: "key_ideas",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Identify unifying features of life (2 marks)",
                "Explain sources of diversity (2 marks)",
                "Link unity and diversity concepts (1 mark)"
              ]
            }
          }
        ]
      }
    ]
  }
];
