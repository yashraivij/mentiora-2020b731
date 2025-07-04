
export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    color: "bg-blue-500",
    topics: [
      { id: "algebra", name: "Algebra" },
      { id: "geometry", name: "Geometry" },
      { id: "statistics", name: "Statistics" },
      { id: "trigonometry", name: "Trigonometry" },
      { id: "calculus", name: "Calculus" }
    ]
  },
  {
    id: "english",
    name: "English Literature",
    color: "bg-green-500",
    topics: [
      { id: "poetry", name: "Poetry Analysis" },
      { id: "shakespeare", name: "Shakespeare" },
      { id: "novels", name: "Modern Novels" },
      { id: "drama", name: "Drama & Theatre" },
      { id: "writing", name: "Creative Writing" }
    ]
  },
  {
    id: "sciences",
    name: "Sciences",
    color: "bg-purple-500",
    topics: [
      { id: "biology", name: "Biology" },
      { id: "chemistry", name: "Chemistry" },
      { id: "physics", name: "Physics" },
      { id: "environmental", name: "Environmental Science" }
    ]
  },
  {
    id: "history",
    name: "History",
    color: "bg-orange-500",
    topics: [
      { id: "modern", name: "Modern History" },
      { id: "medieval", name: "Medieval Period" },
      { id: "world-wars", name: "World Wars" },
      { id: "social", name: "Social History" }
    ]
  }
];

export const examBoards = [
  "AQA",
  "Edexcel",
  "OCR",
  "WJEC",
  "CCEA"
];

export const gradeOptions = [
  "9", "8", "7", "6", "5", "4", "3", "2", "1"
];
