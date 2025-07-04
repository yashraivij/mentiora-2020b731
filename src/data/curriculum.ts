
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

export const curriculum: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    color: "#3B82F6",
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
    name: "English Language",
    color: "#10B981",
    topics: [
      { id: "reading-comprehension", name: "Reading Comprehension" },
      { id: "creative-writing", name: "Creative Writing" },
      { id: "grammar", name: "Grammar" },
      { id: "poetry", name: "Poetry Analysis" },
      { id: "essay-writing", name: "Essay Writing" }
    ]
  },
  {
    id: "science",
    name: "Combined Science",
    color: "#8B5CF6",
    topics: [
      { id: "biology", name: "Biology" },
      { id: "chemistry", name: "Chemistry" },
      { id: "physics", name: "Physics" },
      { id: "scientific-method", name: "Scientific Method" },
      { id: "lab-techniques", name: "Laboratory Techniques" }
    ]
  },
  {
    id: "history",
    name: "History",
    color: "#F59E0B",
    topics: [
      { id: "world-wars", name: "World Wars" },
      { id: "british-history", name: "British History" },
      { id: "social-history", name: "Social History" },
      { id: "political-history", name: "Political History" },
      { id: "historical-sources", name: "Historical Sources" }
    ]
  },
  {
    id: "geography",
    name: "Geography",
    color: "#06B6D4",
    topics: [
      { id: "physical-geography", name: "Physical Geography" },
      { id: "human-geography", name: "Human Geography" },
      { id: "climate-change", name: "Climate Change" },
      { id: "ecosystems", name: "Ecosystems" },
      { id: "urban-planning", name: "Urban Planning" }
    ]
  }
];
