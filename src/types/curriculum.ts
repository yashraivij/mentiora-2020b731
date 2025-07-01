
export interface MarkingCriteria {
  ao1: number;
  ao2: number;
  ao3: number;
  breakdown: string[];
}

export interface Question {
  id: string;
  type: "multiple-choice" | "short-answer" | "long-answer";
  question: string;
  options?: string[];
  correctAnswer?: number;
  modelAnswer?: string;
  explanation?: string;
  marks: number;
  markingCriteria: MarkingCriteria;
  specReference?: string;
}

export interface Topic {
  id: string;
  title: string;
  name: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export type Curriculum = Subject[];
