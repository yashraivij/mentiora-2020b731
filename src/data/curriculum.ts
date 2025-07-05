
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

export interface Question {
  id: string;
  text: string;
  question: string; // Added for Practice page compatibility
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  markScheme?: string;
  modelAnswer?: string; // Added for Practice page compatibility
  markingCriteria?: string; // Added for Practice page compatibility
  marks?: number; // Added for Practice page compatibility
  specReference?: string; // Added for Practice page compatibility
  difficulty: 'foundation' | 'higher';
}

export const curriculum: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    color: '#3b82f6',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'alg-1',
            text: 'Solve the equation 2x + 5 = 13',
            question: 'Solve the equation 2x + 5 = 13',
            type: 'short-answer',
            correctAnswer: 'x = 4',
            markScheme: '2x = 8 (1 mark), x = 4 (1 mark)',
            modelAnswer: 'x = 4',
            markingCriteria: 'Correct algebraic manipulation (1 mark), correct final answer (1 mark)',
            marks: 2,
            specReference: 'A1.1',
            difficulty: 'foundation'
          },
          {
            id: 'alg-2',
            text: 'Expand and simplify (x + 3)(x - 2)',
            question: 'Expand and simplify (x + 3)(x - 2)',
            type: 'short-answer',
            correctAnswer: 'x² + x - 6',
            markScheme: 'x² - 2x + 3x - 6 (1 mark), x² + x - 6 (1 mark)',
            modelAnswer: 'x² + x - 6',
            markingCriteria: 'Correct expansion (1 mark), correct simplification (1 mark)',
            marks: 2,
            specReference: 'A1.2',
            difficulty: 'higher'
          }
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry',
        questions: [
          {
            id: 'geo-1',
            text: 'Calculate the area of a circle with radius 5cm',
            question: 'Calculate the area of a circle with radius 5cm',
            type: 'short-answer',
            correctAnswer: '78.5 cm² (or 25π cm²)',
            markScheme: 'A = πr² (1 mark), A = π × 5² = 25π = 78.5 cm² (2 marks)',
            modelAnswer: '78.5 cm² or 25π cm²',
            markingCriteria: 'Correct formula (1 mark), correct substitution (1 mark), correct answer (1 mark)',
            marks: 3,
            specReference: 'G1.1',
            difficulty: 'foundation'
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'stat-1',
            text: 'Find the mean of the data set: 4, 7, 9, 12, 8',
            question: 'Find the mean of the data set: 4, 7, 9, 12, 8',
            type: 'short-answer',
            correctAnswer: '8',
            markScheme: 'Sum = 4+7+9+12+8 = 40 (1 mark), Mean = 40÷5 = 8 (1 mark)',
            modelAnswer: '8',
            markingCriteria: 'Correct sum calculation (1 mark), correct division (1 mark)',
            marks: 2,
            specReference: 'S1.1',
            difficulty: 'foundation'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: '#10b981',
    topics: [
      {
        id: 'atomic-structure',
        name: 'Atomic Structure',
        questions: [
          {
            id: 'atom-1',
            text: 'What is the atomic number of carbon?',
            question: 'What is the atomic number of carbon?',
            type: 'multiple-choice',
            options: ['4', '6', '8', '12'],
            correctAnswer: '6',
            markScheme: 'Atomic number is the number of protons = 6',
            modelAnswer: '6',
            markingCriteria: 'Correct identification of atomic number (1 mark)',
            marks: 1,
            specReference: 'C1.1',
            difficulty: 'foundation'
          },
          {
            id: 'atom-2',
            text: 'Explain why isotopes of the same element have the same chemical properties.',
            question: 'Explain why isotopes of the same element have the same chemical properties.',
            type: 'essay',
            markScheme: 'Same number of electrons (1 mark), same electron configuration (1 mark), chemical properties depend on electron arrangement (1 mark)',
            modelAnswer: 'Isotopes have the same number of electrons and therefore the same electron configuration. Chemical properties depend on electron arrangement, not nuclear composition.',
            markingCriteria: 'Same number of electrons (1 mark), same electron configuration (1 mark), chemical properties depend on electron arrangement (1 mark)',
            marks: 3,
            specReference: 'C1.2',
            difficulty: 'higher'
          }
        ]
      },
      {
        id: 'bonding',
        name: 'Chemical Bonding',
        questions: [
          {
            id: 'bond-1',
            text: 'What type of bonding occurs in sodium chloride?',
            question: 'What type of bonding occurs in sodium chloride?',
            type: 'multiple-choice',
            options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
            correctAnswer: 'Ionic',
            markScheme: 'Metal and non-metal form ionic bonds',
            modelAnswer: 'Ionic',
            markingCriteria: 'Correct identification of ionic bonding (1 mark)',
            marks: 1,
            specReference: 'C2.1',
            difficulty: 'foundation'
          }
        ]
      },
      {
        id: 'reactions',
        name: 'Chemical Reactions',
        questions: [
          {
            id: 'react-1',
            text: 'Balance the equation: H₂ + O₂ → H₂O',
            question: 'Balance the equation: H₂ + O₂ → H₂O',
            type: 'short-answer',
            correctAnswer: '2H₂ + O₂ → 2H₂O',
            markScheme: 'Correct coefficients: 2, 1, 2 (2 marks)',
            modelAnswer: '2H₂ + O₂ → 2H₂O',
            markingCriteria: 'Correct balancing of equation (2 marks)',
            marks: 2,
            specReference: 'C3.1',
            difficulty: 'foundation'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    color: '#8b5cf6',
    topics: [
      {
        id: 'cells',
        name: 'Cell Biology',
        questions: [
          {
            id: 'cell-1',
            text: 'Name three organelles found in plant cells but not in animal cells.',
            question: 'Name three organelles found in plant cells but not in animal cells.',
            type: 'short-answer',
            correctAnswer: 'Cell wall, chloroplasts, permanent vacuole',
            markScheme: '1 mark for each correct organelle (max 3 marks)',
            modelAnswer: 'Cell wall, chloroplasts, permanent vacuole',
            markingCriteria: '1 mark for each correct organelle (maximum 3 marks)',
            marks: 3,
            specReference: 'B1.1',
            difficulty: 'foundation'
          },
          {
            id: 'cell-2',
            text: 'Explain the process of osmosis.',
            question: 'Explain the process of osmosis.',
            type: 'essay',
            markScheme: 'Movement of water (1 mark), through partially permeable membrane (1 mark), from high to low water potential (1 mark), down concentration gradient (1 mark)',
            modelAnswer: 'Osmosis is the movement of water molecules through a partially permeable membrane from a region of high water potential to a region of low water potential, down a concentration gradient.',
            markingCriteria: 'Movement of water (1 mark), through partially permeable membrane (1 mark), from high to low water potential (1 mark), down concentration gradient (1 mark)',
            marks: 4,
            specReference: 'B1.2',
            difficulty: 'higher'
          }
        ]
      },
      {
        id: 'photosynthesis',
        name: 'Photosynthesis',
        questions: [
          {
            id: 'photo-1',
            text: 'Write the word equation for photosynthesis.',
            question: 'Write the word equation for photosynthesis.',
            type: 'short-answer',
            correctAnswer: 'carbon dioxide + water → glucose + oxygen',
            markScheme: 'Correct reactants and products with arrow (2 marks)',
            modelAnswer: 'carbon dioxide + water → glucose + oxygen',
            markingCriteria: 'Correct reactants (1 mark), correct products (1 mark)',
            marks: 2,
            specReference: 'B2.1',
            difficulty: 'foundation'
          }
        ]
      },
      {
        id: 'evolution',
        name: 'Evolution',
        questions: [
          {
            id: 'evo-1',
            text: 'Describe the theory of natural selection.',
            question: 'Describe the theory of natural selection.',
            type: 'essay',
            markScheme: 'Variation exists (1 mark), competition for resources (1 mark), survival of fittest (1 mark), reproduction passes on genes (1 mark), change in population over time (1 mark)',
            modelAnswer: 'Natural selection involves variation within populations, competition for limited resources, survival of the fittest individuals, reproduction passing on advantageous genes, and gradual change in population characteristics over time.',
            markingCriteria: 'Variation exists (1 mark), competition for resources (1 mark), survival of fittest (1 mark), reproduction passes on genes (1 mark), change in population over time (1 mark)',
            marks: 5,
            specReference: 'B3.1',
            difficulty: 'higher'
          }
        ]
      }
    ]
  }
];
