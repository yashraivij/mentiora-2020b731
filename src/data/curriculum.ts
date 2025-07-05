
export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
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
    color: 'bg-emerald-500',
    topics: [
      {
        id: 'cell-biology',
        name: 'Cell Biology',
        questions: [
          {
            id: 'cell-1',
            text: 'What is the function of mitochondria in a cell?',
            options: [
              'Protein synthesis',
              'Energy production',
              'DNA storage',
              'Waste removal'
            ],
            correctAnswer: 1,
            explanation: 'Mitochondria are the powerhouses of the cell, responsible for producing ATP through cellular respiration.',
            difficulty: 'medium',
            marks: 2
          }
        ]
      },
      {
        id: 'genetics',
        name: 'Genetics',
        questions: [
          {
            id: 'genetics-1',
            text: 'What does DNA stand for?',
            options: [
              'Deoxyribonucleic Acid',
              'Deoxyribose Nucleic Acid',
              'Dynamic Nuclear Acid',
              'Digestive Nucleic Acid'
            ],
            correctAnswer: 0,
            explanation: 'DNA stands for Deoxyribonucleic Acid, which contains genetic instructions.',
            difficulty: 'easy',
            marks: 1
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: 'bg-blue-500',
    topics: [
      {
        id: 'atomic-structure',
        name: 'Atomic Structure',
        questions: [
          {
            id: 'atomic-1',
            text: 'What is the charge of a proton?',
            options: [
              'Negative',
              'Positive',
              'Neutral',
              'Variable'
            ],
            correctAnswer: 1,
            explanation: 'Protons have a positive charge, while electrons have a negative charge and neutrons are neutral.',
            difficulty: 'easy',
            marks: 1
          }
        ]
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    color: 'bg-purple-500',
    topics: [
      {
        id: 'forces',
        name: 'Forces and Motion',
        questions: [
          {
            id: 'forces-1',
            text: 'What is Newton\'s first law of motion?',
            options: [
              'F = ma',
              'An object at rest stays at rest unless acted upon by a force',
              'For every action there is an equal and opposite reaction',
              'Energy cannot be created or destroyed'
            ],
            correctAnswer: 1,
            explanation: 'Newton\'s first law states that an object will remain at rest or in uniform motion unless acted upon by an external force.',
            difficulty: 'medium',
            marks: 2
          }
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    color: 'bg-red-500',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'algebra-1',
            text: 'Solve for x: 2x + 5 = 13',
            options: [
              'x = 4',
              'x = 6',
              'x = 8',
              'x = 9'
            ],
            correctAnswer: 0,
            explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4.',
            difficulty: 'easy',
            marks: 2
          }
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English Literature',
    color: 'bg-amber-500',
    topics: [
      {
        id: 'shakespeare',
        name: 'Shakespeare',
        questions: [
          {
            id: 'shakespeare-1',
            text: 'Who wrote "Romeo and Juliet"?',
            options: [
              'Charles Dickens',
              'William Shakespeare',
              'Jane Austen',
              'George Orwell'
            ],
            correctAnswer: 1,
            explanation: 'William Shakespeare wrote the tragic play "Romeo and Juliet" in the early part of his career.',
            difficulty: 'easy',
            marks: 1
          }
        ]
      }
    ]
  },
  {
    id: 'history',
    name: 'History',
    color: 'bg-orange-500',
    topics: [
      {
        id: 'world-war-2',
        name: 'World War 2',
        questions: [
          {
            id: 'ww2-1',
            text: 'In which year did World War 2 end?',
            options: [
              '1944',
              '1945',
              '1946',
              '1947'
            ],
            correctAnswer: 1,
            explanation: 'World War 2 ended in 1945 with the surrender of Japan in September.',
            difficulty: 'easy',
            marks: 1
          }
        ]
      }
    ]
  }
];
