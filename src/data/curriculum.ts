
export interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  modelAnswer?: string;
  markingCriteria?: string;
  specReference?: string;
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

export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    color: '#3B82F6',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'alg_1',
            question: 'Solve the equation 2x + 5 = 13',
            correctAnswer: 'x = 4',
            explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: 'x = 4',
            markingCriteria: '1 mark for correct rearrangement, 1 mark for final answer',
            specReference: 'A1.2'
          }
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry',
        questions: [
          {
            id: 'geo_1',
            question: 'Calculate the area of a triangle with base 8cm and height 6cm',
            correctAnswer: '24 cm²',
            explanation: 'Area = ½ × base × height = ½ × 8 × 6 = 24 cm²',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: '24 cm²',
            markingCriteria: '1 mark for correct formula, 1 mark for calculation',
            specReference: 'G2.1'
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'stat_1',
            question: 'Find the mean of: 4, 7, 9, 12, 8',
            correctAnswer: '8',
            explanation: 'Mean = (4 + 7 + 9 + 12 + 8) ÷ 5 = 40 ÷ 5 = 8',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: '8',
            markingCriteria: '1 mark for sum, 1 mark for division',
            specReference: 'S1.1'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: '#10B981',
    topics: [
      {
        id: 'atomic-structure',
        name: 'Atomic Structure',
        questions: [
          {
            id: 'atom_1',
            question: 'What is the atomic number of carbon?',
            correctAnswer: '6',
            explanation: 'Carbon has 6 protons, which determines its atomic number',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: '6',
            markingCriteria: '1 mark for correct answer',
            specReference: 'C1.1'
          }
        ]
      },
      {
        id: 'chemical-bonding',
        name: 'Chemical Bonding',
        questions: [
          {
            id: 'bond_1',
            question: 'What type of bond forms between sodium and chlorine?',
            correctAnswer: 'Ionic bond',
            explanation: 'Sodium loses an electron to chlorine, forming charged ions that attract each other',
            difficulty: 'medium',
            marks: 2,
            modelAnswer: 'Ionic bond',
            markingCriteria: '2 marks for ionic bond and explanation',
            specReference: 'C2.1'
          }
        ]
      },
      {
        id: 'acids-bases',
        name: 'Acids and Bases',
        questions: [
          {
            id: 'acid_1',
            question: 'What is the pH of pure water?',
            correctAnswer: '7',
            explanation: 'Pure water is neutral with equal H+ and OH- ions, giving pH 7',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: '7',
            markingCriteria: '1 mark for correct answer',
            specReference: 'C3.1'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    color: '#8B5CF6',
    topics: [
      {
        id: 'cell-biology',
        name: 'Cell Biology',
        questions: [
          {
            id: 'cell_1',
            question: 'Name the process by which plants make their own food',
            correctAnswer: 'Photosynthesis',
            explanation: 'Plants use sunlight, carbon dioxide and water to make glucose in chloroplasts',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: 'Photosynthesis',
            markingCriteria: '1 mark for correct term',
            specReference: 'B1.1'
          }
        ]
      },
      {
        id: 'genetics',
        name: 'Genetics',
        questions: [
          {
            id: 'gen_1',
            question: 'What does DNA stand for?',
            correctAnswer: 'Deoxyribonucleic acid',
            explanation: 'DNA is the molecule that carries genetic information in living organisms',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: 'Deoxyribonucleic acid',
            markingCriteria: '1 mark for full correct term',
            specReference: 'B2.1'
          }
        ]
      },
      {
        id: 'evolution',
        name: 'Evolution',
        questions: [
          {
            id: 'evo_1',
            question: 'Who proposed the theory of natural selection?',
            correctAnswer: 'Charles Darwin',
            explanation: 'Darwin developed the theory explaining how species evolve through natural selection',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: 'Charles Darwin',
            markingCriteria: '1 mark for correct name',
            specReference: 'B3.1'
          }
        ]
      }
    ]
  }
];

export const curriculum = subjects;
