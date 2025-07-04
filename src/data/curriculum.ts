
export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: {
    id: string;
    name: string;
  }[];
}

export const curriculum: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    color: "bg-blue-500",
    topics: [
      { id: "algebra", name: "Algebra" },
      { id: "geometry", name: "Geometry" },
      { id: "statistics", name: "Statistics" },
      { id: "probability", name: "Probability" },
      { id: "trigonometry", name: "Trigonometry" },
      { id: "calculus", name: "Calculus" }
    ]
  },
  {
    id: "english",
    name: "English Language",
    color: "bg-emerald-500",
    topics: [
      { id: "reading-comprehension", name: "Reading Comprehension" },
      { id: "creative-writing", name: "Creative Writing" },
      { id: "grammar", name: "Grammar" },
      { id: "poetry-analysis", name: "Poetry Analysis" },
      { id: "essay-writing", name: "Essay Writing" },
      { id: "speech-language", name: "Speech & Language" }
    ]
  },
  {
    id: "science",
    name: "Science",
    color: "bg-purple-500",
    topics: [
      { id: "biology", name: "Biology" },
      { id: "chemistry", name: "Chemistry" },
      { id: "physics", name: "Physics" },
      { id: "earth-science", name: "Earth Science" },
      { id: "environmental-science", name: "Environmental Science" },
      { id: "scientific-method", name: "Scientific Method" }
    ]
  },
  {
    id: "history",
    name: "History",
    color: "bg-amber-500",
    topics: [
      { id: "world-wars", name: "World Wars" },
      { id: "british-history", name: "British History" },
      { id: "ancient-civilizations", name: "Ancient Civilizations" },
      { id: "industrial-revolution", name: "Industrial Revolution" },
      { id: "cold-war", name: "Cold War" },
      { id: "modern-history", name: "Modern History" }
    ]
  },
  {
    id: "geography",
    name: "Geography",
    color: "bg-teal-500",
    topics: [
      { id: "physical-geography", name: "Physical Geography" },
      { id: "human-geography", name: "Human Geography" },
      { id: "climate-change", name: "Climate Change" },
      { id: "natural-disasters", name: "Natural Disasters" },
      { id: "urbanization", name: "Urbanization" },
      { id: "economic-geography", name: "Economic Geography" }
    ]
  }
];
