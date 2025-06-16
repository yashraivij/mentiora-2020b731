
export interface Question {
  id: string;
  question: string;
  marks: number;
  modelAnswer: string;
  markingCriteria: {
    ao1: number;
    ao2: number;
    ao3: number;
    breakdown: string[];
  };
  specReference: string;
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
    id: 'biology',
    name: 'Biology',
    color: 'bg-green-500',
    topics: [
      {
        id: 'b1-cell-biology',
        name: 'B1 Cell Biology',
        questions: [
          {
            id: 'b1-q1',
            question: 'Describe how the structure of a root hair cell helps it absorb water efficiently. (3 marks)',
            marks: 3,
            modelAnswer: 'The root hair cell has a large surface area due to its elongated projection, which increases the rate of water absorption. The cell wall is thin, providing a short diffusion pathway for water molecules. The cell contains many mitochondria to provide energy for active transport of mineral ions.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States large surface area',
                'AO2 (1): Explains link between structure and function',
                'AO3 (1): Links mitochondria to energy for active transport'
              ]
            },
            specReference: 'AQA Biology B1.1'
          },
          {
            id: 'b1-q2',
            question: 'Explain the process of osmosis and give an example of where it occurs in plants. (4 marks)',
            marks: 4,
            modelAnswer: 'Osmosis is the movement of water molecules from a region of high water potential to a region of low water potential through a partially permeable membrane. Water moves down its concentration gradient without requiring energy (passive process). In plants, osmosis occurs when water moves from the soil into root hair cells, as the soil has higher water potential than the cell contents.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Definition of osmosis',
                'AO1 (1): States it is a passive process',
                'AO2 (1): Application to plants',
                'AO2 (1): Explains direction of water movement'
              ]
            },
            specReference: 'AQA Biology B1.2'
          },
          {
            id: 'b1-q3',
            question: 'Compare the structure and function of prokaryotic and eukaryotic cells. (6 marks)',
            marks: 6,
            modelAnswer: 'Prokaryotic cells have no nucleus, with genetic material freely floating in the cytoplasm, while eukaryotic cells have a membrane-bound nucleus containing DNA. Prokaryotic cells lack membrane-bound organelles, whereas eukaryotic cells contain organelles like mitochondria, endoplasmic reticulum, and Golgi apparatus. Both cell types have ribosomes, but prokaryotic ribosomes are smaller (70S) compared to eukaryotic ribosomes (80S). Prokaryotic cells are typically smaller and simpler in structure, while eukaryotic cells are larger and more complex.',
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States prokaryotes have no nucleus',
                'AO1 (1): States eukaryotes have membrane-bound organelles',
                'AO1 (1): Mentions ribosomes in both',
                'AO2 (1): Compares ribosome sizes',
                'AO2 (1): Compares cell complexity',
                'AO3 (1): Links structure to function'
              ]
            },
            specReference: 'AQA Biology B1.3'
          }
        ]
      },
      {
        id: 'b2-organisation',
        name: 'B2 Organisation',
        questions: [
          {
            id: 'b2-q1',
            question: 'Describe the function of enzymes and explain why they are important in biological processes. (5 marks)',
            marks: 5,
            modelAnswer: 'Enzymes are biological catalysts that speed up chemical reactions by lowering the activation energy required. They have specific active sites that are complementary to their substrate molecules. Enzymes are important because they allow metabolic reactions to occur at body temperature and at a rate fast enough to sustain life. Without enzymes, reactions would be too slow to maintain cellular processes.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States enzymes are catalysts',
                'AO1 (1): Mentions active site and substrate',
                'AO2 (1): Explains lowering activation energy',
                'AO2 (1): Links to body temperature',
                'AO3 (1): Evaluates importance for life processes'
              ]
            },
            specReference: 'AQA Biology B2.1'
          }
        ]
      },
      {
        id: 'b3-infection-response',
        name: 'B3 Infection and Response',
        questions: [
          {
            id: 'b3-q1',
            question: 'Explain how white blood cells help defend the body against pathogens. (4 marks)',
            marks: 4,
            modelAnswer: 'Phagocytes engulf and digest pathogens through phagocytosis, destroying them with enzymes. Lymphocytes produce specific antibodies that bind to antigens on pathogens, marking them for destruction. Some lymphocytes become memory cells, providing long-term immunity by remembering specific pathogens for faster response in future infections.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States phagocytes engulf pathogens',
                'AO1 (1): States lymphocytes produce antibodies',
                'AO2 (1): Explains phagocytosis process',
                'AO2 (1): Explains memory cell function'
              ]
            },
            specReference: 'AQA Biology B3.1'
          }
        ]
      }
    ]
  },
  {
    id: 'maths',
    name: 'Maths',
    color: 'bg-blue-500',
    topics: [
      {
        id: 'm1-number',
        name: 'Number',
        questions: [
          {
            id: 'm1-q1',
            question: 'Calculate 3/4 × 2/5 and express your answer as a fraction in its simplest form. (2 marks)',
            marks: 2,
            modelAnswer: '3/4 × 2/5 = (3×2)/(4×5) = 6/20 = 3/10',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct multiplication of fractions',
                'AO2 (1): Simplifies to lowest terms'
              ]
            },
            specReference: 'AQA Maths N1.1'
          },
          {
            id: 'm1-q2',
            question: 'A shop increases all prices by 15%. If a jacket originally cost £80, what is the new price? (3 marks)',
            marks: 3,
            modelAnswer: 'Increase = 15% of £80 = 0.15 × 80 = £12. New price = £80 + £12 = £92',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts percentage to decimal',
                'AO2 (1): Calculates percentage increase',
                'AO2 (1): Adds to original price'
              ]
            },
            specReference: 'AQA Maths N1.2'
          }
        ]
      },
      {
        id: 'm2-algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'm2-q1',
            question: 'Solve the equation 3x + 7 = 22. (2 marks)',
            marks: 2,
            modelAnswer: '3x + 7 = 22, 3x = 22 - 7, 3x = 15, x = 5',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct rearrangement',
                'AO2 (1): Correct solution x = 5'
              ]
            },
            specReference: 'AQA Maths A1.1'
          }
        ]
      },
      {
        id: 'm3-ratio-proportion',
        name: 'Ratio, Proportion and Rates of Change',
        questions: [
          {
            id: 'm3-q1',
            question: 'Share £240 in the ratio 3:2:7. (3 marks)',
            marks: 3,
            modelAnswer: 'Total parts = 3 + 2 + 7 = 12 parts. Each part = £240 ÷ 12 = £20. Shares are: 3 × £20 = £60, 2 × £20 = £40, 7 × £20 = £140',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Finds total number of parts',
                'AO2 (1): Calculates value of one part',
                'AO2 (1): Calculates all three shares correctly'
              ]
            },
            specReference: 'AQA Maths R1.1'
          }
        ]
      },
      {
        id: 'm4-geometry-measures',
        name: 'Geometry and Measures',
        questions: [
          {
            id: 'm4-q1',
            question: 'Calculate the area of a circle with radius 6 cm. Use π = 3.14. (2 marks)',
            marks: 2,
            modelAnswer: 'Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04 cm²',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula πr²',
                'AO2 (1): Correct substitution and calculation'
              ]
            },
            specReference: 'AQA Maths G1.1'
          }
        ]
      },
      {
        id: 'm5-probability',
        name: 'Probability',
        questions: [
          {
            id: 'm5-q1',
            question: 'A bag contains 5 red balls and 3 blue balls. What is the probability of picking a red ball? (2 marks)',
            marks: 2,
            modelAnswer: 'Total balls = 5 + 3 = 8. Probability = Number of red balls / Total balls = 5/8',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies total number of outcomes',
                'AO2 (1): Calculates probability as 5/8'
              ]
            },
            specReference: 'AQA Maths P1.1'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: 'bg-purple-500',
    topics: [
      {
        id: 'c1-atomic-structure',
        name: 'C1 Atomic Structure',
        questions: [
          {
            id: 'c1-q1',
            question: 'Describe the structure of an atom and explain where the mass is concentrated. (4 marks)',
            marks: 4,
            modelAnswer: 'An atom consists of a small, dense nucleus containing protons and neutrons, surrounded by electrons in energy levels or shells. The nucleus is positively charged due to protons, while electrons are negatively charged. Almost all the mass of the atom is concentrated in the nucleus because protons and neutrons are much more massive than electrons.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States nucleus contains protons and neutrons',
                'AO1 (1): States electrons are in shells around nucleus',
                'AO2 (1): Explains charges of particles',
                'AO2 (1): Explains why mass is concentrated in nucleus'
              ]
            },
            specReference: 'AQA Chemistry C1.1'
          },
          {
            id: 'c1-q2',
            question: 'An atom has 11 protons, 12 neutrons and 11 electrons. What is its mass number and atomic number? (2 marks)',
            marks: 2,
            modelAnswer: 'Atomic number = number of protons = 11. Mass number = protons + neutrons = 11 + 12 = 23',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): States atomic number = 11',
                'AO2 (1): Calculates mass number = 23'
              ]
            },
            specReference: 'AQA Chemistry C1.2'
          }
        ]
      },
      {
        id: 'c2-bonding-structure',
        name: 'C2 Bonding and Structure',
        questions: [
          {
            id: 'c2-q1',
            question: 'Explain why sodium chloride has a high melting point. (3 marks)',
            marks: 3,
            modelAnswer: 'Sodium chloride has ionic bonding between Na⁺ and Cl⁻ ions. These electrostatic forces of attraction between oppositely charged ions are very strong. A lot of energy is needed to overcome these strong ionic bonds, resulting in a high melting point.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States ionic bonding present',
                'AO2 (1): Explains strong electrostatic forces',
                'AO3 (1): Links bond strength to high melting point'
              ]
            },
            specReference: 'AQA Chemistry C2.1'
          }
        ]
      },
      {
        id: 'c3-quantitative-chemistry',
        name: 'C3 Quantitative Chemistry',
        questions: [
          {
            id: 'c3-q1',
            question: 'Calculate the relative formula mass of calcium carbonate (CaCO₃). [Ar: Ca = 40, C = 12, O = 16] (2 marks)',
            marks: 2,
            modelAnswer: 'Mr of CaCO₃ = 40 + 12 + (3 × 16) = 40 + 12 + 48 = 100',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies atoms in formula',
                'AO2 (1): Correct calculation = 100'
              ]
            },
            specReference: 'AQA Chemistry C3.1'
          }
        ]
      }
    ]
  }
];
