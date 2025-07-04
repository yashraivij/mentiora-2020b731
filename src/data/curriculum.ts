
export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  modelAnswer?: string;
  markingCriteria?: string;
  specReference?: string;
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
            id: 'alg1',
            question: 'Solve for x: 2x + 5 = 13',
            type: 'short-answer',
            correctAnswer: '4',
            explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
            difficulty: 'easy',
            marks: 2,
            modelAnswer: 'x = 4',
            markingCriteria: 'Correct answer: 2 marks, Working shown: 1 mark',
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
            question: 'What is the area of a circle with radius 5cm?',
            type: 'multiple-choice',
            options: ['25π cm²', '10π cm²', '5π cm²', '15π cm²'],
            correctAnswer: 0,
            explanation: 'Area = πr² = π × 5² = 25π cm²',
            difficulty: 'medium',
            marks: 3,
            modelAnswer: '25π cm²',
            markingCriteria: 'Correct formula and answer: 3 marks',
            specReference: 'G2.1'
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
        id: 'comprehension',
        name: 'Reading Comprehension',
        questions: [
          {
            id: 'comp1',
            question: 'Read the passage and identify the main theme.',
            type: 'essay',
            explanation: 'Look for recurring ideas and the central message the author conveys.',
            difficulty: 'medium',
            marks: 6,
            modelAnswer: 'Analyze the text for key themes and provide textual evidence',
            markingCriteria: 'Clear identification of theme with evidence: 6 marks',
            specReference: 'R1.3'
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    name: 'Combined Science',
    color: 'bg-purple-500',
    topics: [
      {
        id: 'biology',
        name: 'Biology',
        questions: [
          {
            id: 'bio1',
            question: 'What is photosynthesis?',
            type: 'short-answer',
            correctAnswer: 'The process by which plants make food using sunlight, carbon dioxide, and water',
            explanation: 'Photosynthesis converts light energy into chemical energy stored in glucose.',
            difficulty: 'easy',
            marks: 4,
            modelAnswer: 'Photosynthesis is the process where plants use sunlight, CO2, and water to produce glucose and oxygen',
            markingCriteria: 'Complete definition with all components: 4 marks',
            specReference: 'B3.1'
          }
        ]
      }
    ]
  }
];

// For backward compatibility
export const curriculum = subjects;
