
export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
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

export const curriculum: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    color: 'bg-blue-500',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'alg1',
            question: 'Solve for x: 2x + 5 = 13',
            type: 'short-answer',
            correctAnswer: 'x = 4',
            explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
            difficulty: 'easy',
            modelAnswer: 'x = 4',
            markingCriteria: '2 marks for correct working, 1 mark for final answer',
            specReference: 'A1.2'
          }
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry',
        questions: [
          {
            id: 'geo1',
            question: 'Calculate the area of a circle with radius 5cm',
            type: 'short-answer',
            correctAnswer: '78.54 cm²',
            explanation: 'Area = πr² = π × 5² = 25π ≈ 78.54 cm²',
            difficulty: 'medium',
            modelAnswer: '78.54 cm²',
            markingCriteria: '2 marks for formula, 2 marks for calculation',
            specReference: 'G2.1'
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'stat1',
            question: 'Find the mean of: 4, 7, 9, 12, 18',
            type: 'short-answer',
            correctAnswer: '10',
            explanation: 'Mean = (4 + 7 + 9 + 12 + 18) ÷ 5 = 50 ÷ 5 = 10',
            difficulty: 'easy',
            modelAnswer: '10',
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
    color: 'bg-green-500',
    topics: [
      {
        id: 'atomic-structure',
        name: 'Atomic Structure',
        questions: [
          {
            id: 'atom1',
            question: 'What is the atomic number of carbon?',
            type: 'short-answer',
            correctAnswer: '6',
            explanation: 'Carbon has 6 protons, which determines its atomic number',
            difficulty: 'easy',
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
            id: 'bond1',
            question: 'Explain the difference between ionic and covalent bonding',
            type: 'essay',
            correctAnswer: 'Ionic bonding involves transfer of electrons between atoms, while covalent involves sharing of electrons',
            explanation: 'Ionic bonds form between metals and non-metals through electron transfer. Covalent bonds form between non-metals through electron sharing.',
            difficulty: 'medium',
            modelAnswer: 'Detailed explanation of electron transfer vs sharing',
            markingCriteria: '3 marks for ionic explanation, 3 marks for covalent explanation',
            specReference: 'C2.1'
          }
        ]
      },
      {
        id: 'organic-chemistry',
        name: 'Organic Chemistry',
        questions: [
          {
            id: 'org1',
            question: 'What is the molecular formula of methane?',
            type: 'short-answer',
            correctAnswer: 'CH₄',
            explanation: 'Methane consists of one carbon atom bonded to four hydrogen atoms',
            difficulty: 'easy',
            modelAnswer: 'CH₄',
            markingCriteria: '1 mark for correct formula',
            specReference: 'C3.1'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    color: 'bg-purple-500',
    topics: [
      {
        id: 'cell-biology',
        name: 'Cell Biology',
        questions: [
          {
            id: 'cell1',
            question: 'Name the three main parts of a cell',
            type: 'short-answer',
            correctAnswer: 'Cell membrane, cytoplasm, nucleus',
            explanation: 'All cells have a cell membrane that controls what enters/exits, cytoplasm where reactions occur, and a nucleus containing genetic material',
            difficulty: 'easy',
            modelAnswer: 'Cell membrane, cytoplasm, nucleus',
            markingCriteria: '1 mark for each correct part',
            specReference: 'B1.1'
          }
        ]
      },
      {
        id: 'genetics',
        name: 'Genetics',
        questions: [
          {
            id: 'gen1',
            question: 'What does DNA stand for?',
            type: 'short-answer',
            correctAnswer: 'Deoxyribonucleic acid',
            explanation: 'DNA is the molecule that carries genetic information in living organisms',
            difficulty: 'easy',
            modelAnswer: 'Deoxyribonucleic acid',
            markingCriteria: '1 mark for correct full name',
            specReference: 'B2.1'
          }
        ]
      },
      {
        id: 'ecology',
        name: 'Ecology',
        questions: [
          {
            id: 'eco1',
            question: 'Define the term "ecosystem"',
            type: 'short-answer',
            correctAnswer: 'A community of living organisms interacting with their physical environment',
            explanation: 'An ecosystem includes all the living things (plants, animals, organisms) in a given area, interacting with each other and their non-living environment',
            difficulty: 'medium',
            modelAnswer: 'A community of living organisms interacting with their physical environment',
            markingCriteria: '2 marks for mentioning living organisms, 1 mark for environment interaction',
            specReference: 'B3.1'
          }
        ]
      }
    ]
  }
];
