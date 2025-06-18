
export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
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
  color: string;
  topics: Topic[];
}
