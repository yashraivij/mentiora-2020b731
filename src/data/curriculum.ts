
export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  modelAnswer: string;
  markingCriteria: {
    breakdown: string[];
  };
  specReference: string;
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
    color: 'bg-blue-500',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'alg-1',
            question: 'Solve for x: 2x + 5 = 13',
            correctAnswer: 'x = 4',
            explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: 'x = 4',
            markingCriteria: {
              breakdown: ['Show working: 2x = 13 - 5 = 8 (1 mark)', 'Final answer: x = 4 (1 mark)']
            },
            specReference: 'A1.2'
          },
          {
            id: 'alg-2',
            question: 'Expand and simplify: (x + 3)(x - 2)',
            correctAnswer: 'x² + x - 6',
            explanation: 'Use FOIL method: x² - 2x + 3x - 6 = x² + x - 6',
            difficulty: 'medium',
            marks: 3,
            modelAnswer: 'x² + x - 6',
            markingCriteria: {
              breakdown: ['Expand correctly: x² - 2x + 3x - 6 (2 marks)', 'Simplify to final answer: x² + x - 6 (1 mark)']
            },
            specReference: 'A2.1'
          }
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry',
        questions: [
          {
            id: 'geo-1',
            question: 'What is the area of a circle with radius 5cm?',
            correctAnswer: '25π cm² or approximately 78.54 cm²',
            explanation: 'Area = πr² = π × 5² = 25π cm²',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: '25π cm² or 78.54 cm²',
            markingCriteria: {
              breakdown: ['Use formula A = πr² (1 mark)', 'Calculate 25π or 78.54 cm² (1 mark)']
            },
            specReference: 'G3.1'
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'stat-1',
            question: 'Find the mean of: 4, 7, 9, 12, 8',
            correctAnswer: '8',
            explanation: 'Mean = (4 + 7 + 9 + 12 + 8) ÷ 5 = 40 ÷ 5 = 8',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: '8',
            markingCriteria: {
              breakdown: ['Add all values: 4 + 7 + 9 + 12 + 8 = 40 (1 mark)', 'Divide by count: 40 ÷ 5 = 8 (1 mark)']
            },
            specReference: 'S1.3'
          }
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English Language',
    color: 'bg-green-500',
    topics: [
      {
        id: 'grammar',
        name: 'Grammar',
        questions: [
          {
            id: 'gram-1',
            question: 'Identify the type of sentence: "What a beautiful day!"',
            options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
            correctAnswer: 'Exclamatory',
            explanation: 'This sentence expresses strong emotion and ends with an exclamation mark.',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: 'Exclamatory',
            markingCriteria: {
              breakdown: ['Identify exclamatory sentence type (1 mark)']
            },
            specReference: 'E1.1'
          }
        ]
      },
      {
        id: 'literature',
        name: 'Literature',
        questions: [
          {
            id: 'lit-1',
            question: 'What is a metaphor?',
            correctAnswer: 'A figure of speech that compares two unlike things without using "like" or "as"',
            explanation: 'A metaphor directly states that one thing is another, creating an implicit comparison.',
            difficulty: 'medium',
            marks: 2,
            modelAnswer: 'A figure of speech that compares two unlike things without using "like" or "as"',
            markingCriteria: {
              breakdown: ['Define as figure of speech (1 mark)', 'Explain comparison without "like" or "as" (1 mark)']
            },
            specReference: 'E2.4'
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    color: 'bg-purple-500',
    topics: [
      {
        id: 'biology',
        name: 'Biology',
        questions: [
          {
            id: 'bio-1',
            question: 'What is photosynthesis?',
            correctAnswer: 'The process by which plants make their own food using sunlight, carbon dioxide, and water',
            explanation: 'Photosynthesis converts light energy into chemical energy, producing glucose and oxygen.',
            difficulty: 'medium',
            marks: 3,
            modelAnswer: 'The process by which plants make their own food using sunlight, carbon dioxide, and water',
            markingCriteria: {
              breakdown: ['Identify as food-making process (1 mark)', 'Mention sunlight, CO2, water (1 mark)', 'Reference energy conversion (1 mark)']
            },
            specReference: 'B2.1'
          }
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        questions: [
          {
            id: 'chem-1',
            question: 'What is the chemical symbol for water?',
            correctAnswer: 'H₂O',
            explanation: 'Water consists of two hydrogen atoms and one oxygen atom.',
            difficulty: 'easy',
            marks: 1,
            modelAnswer: 'H₂O',
            markingCriteria: {
              breakdown: ['Correct chemical formula H₂O (1 mark)']
            },
            specReference: 'C1.1'
          }
        ]
      },
      {
        id: 'physics',
        name: 'Physics',
        questions: [
          {
            id: 'phys-1',
            question: 'What is the formula for calculating speed?',
            correctAnswer: 'Speed = Distance ÷ Time',
            explanation: 'Speed is calculated by dividing the distance traveled by the time taken.',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: 'Speed = Distance ÷ Time',
            markingCriteria: {
              breakdown: ['Correct formula structure (1 mark)', 'Correct variables: distance/time (1 mark)']
            },
            specReference: 'P1.2'
          }
        ]
      }
    ]
  }
];

// Export as both 'subjects' and 'curriculum' for compatibility
export const curriculum = subjects;
