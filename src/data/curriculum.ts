
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
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  markScheme?: string;
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
            type: 'short-answer',
            correctAnswer: 'x = 4',
            markScheme: '2x = 8 (1 mark), x = 4 (1 mark)',
            difficulty: 'foundation'
          },
          {
            id: 'alg-2',
            text: 'Expand and simplify (x + 3)(x - 2)',
            type: 'short-answer',
            correctAnswer: 'x² + x - 6',
            markScheme: 'x² - 2x + 3x - 6 (1 mark), x² + x - 6 (1 mark)',
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
            type: 'short-answer',
            correctAnswer: '78.5 cm² (or 25π cm²)',
            markScheme: 'A = πr² (1 mark), A = π × 5² = 25π = 78.5 cm² (2 marks)',
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
            type: 'short-answer',
            correctAnswer: '8',
            markScheme: 'Sum = 4+7+9+12+8 = 40 (1 mark), Mean = 40÷5 = 8 (1 mark)',
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
            type: 'multiple-choice',
            options: ['4', '6', '8', '12'],
            correctAnswer: '6',
            markScheme: 'Atomic number is the number of protons = 6',
            difficulty: 'foundation'
          },
          {
            id: 'atom-2',
            text: 'Explain why isotopes of the same element have the same chemical properties.',
            type: 'essay',
            markScheme: 'Same number of electrons (1 mark), same electron configuration (1 mark), chemical properties depend on electron arrangement (1 mark)',
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
            type: 'multiple-choice',
            options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
            correctAnswer: 'Ionic',
            markScheme: 'Metal and non-metal form ionic bonds',
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
            type: 'short-answer',
            correctAnswer: '2H₂ + O₂ → 2H₂O',
            markScheme: 'Correct coefficients: 2, 1, 2 (2 marks)',
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
            type: 'short-answer',
            correctAnswer: 'Cell wall, chloroplasts, permanent vacuole',
            markScheme: '1 mark for each correct organelle (max 3 marks)',
            difficulty: 'foundation'
          },
          {
            id: 'cell-2',
            text: 'Explain the process of osmosis.',
            type: 'essay',
            markScheme: 'Movement of water (1 mark), through partially permeable membrane (1 mark), from high to low water potential (1 mark), down concentration gradient (1 mark)',
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
            type: 'short-answer',
            correctAnswer: 'carbon dioxide + water → glucose + oxygen',
            markScheme: 'Correct reactants and products with arrow (2 marks)',
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
            type: 'essay',
            markScheme: 'Variation exists (1 mark), competition for resources (1 mark), survival of fittest (1 mark), reproduction passes on genes (1 mark), change in population over time (1 mark)',
            difficulty: 'higher'
          }
        ]
      }
    ]
  }
];
