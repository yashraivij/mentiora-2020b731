
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
      { id: "probability", name: "Probability" },
      { id: "trigonometry", name: "Trigonometry" },
      { id: "calculus", name: "Calculus" }
    ]
  },
  {
    id: "english-language",
    name: "English Language",
    color: "#10B981",
    topics: [
      { id: "reading-comprehension", name: "Reading Comprehension" },
      { id: "creative-writing", name: "Creative Writing" },
      { id: "grammar", name: "Grammar" },
      { id: "vocabulary", name: "Vocabulary" },
      { id: "essay-writing", name: "Essay Writing" },
      { id: "poetry-analysis", name: "Poetry Analysis" }
    ]
  },
  {
    id: "english-literature",
    name: "English Literature",
    color: "#8B5CF6",
    topics: [
      { id: "shakespeare", name: "Shakespeare" },
      { id: "modern-texts", name: "Modern Texts" },
      { id: "poetry", name: "Poetry" },
      { id: "prose", name: "Prose" },
      { id: "drama", name: "Drama" },
      { id: "literary-techniques", name: "Literary Techniques" }
    ]
  },
  {
    id: "science-combined",
    name: "Combined Science",
    color: "#F59E0B",
    topics: [
      { id: "biology-basics", name: "Biology Basics" },
      { id: "chemistry-basics", name: "Chemistry Basics" },
      { id: "physics-basics", name: "Physics Basics" },
      { id: "scientific-method", name: "Scientific Method" },
      { id: "lab-techniques", name: "Lab Techniques" },
      { id: "data-analysis", name: "Data Analysis" }
    ]
  },
  {
    id: "biology",
    name: "Biology",
    color: "#059669",
    topics: [
      { id: "cell-biology", name: "Cell Biology" },
      { id: "genetics", name: "Genetics" },
      { id: "evolution", name: "Evolution" },
      { id: "ecology", name: "Ecology" },
      { id: "human-biology", name: "Human Biology" },
      { id: "plant-biology", name: "Plant Biology" }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "#DC2626",
    topics: [
      { id: "atomic-structure", name: "Atomic Structure" },
      { id: "chemical-bonding", name: "Chemical Bonding" },
      { id: "organic-chemistry", name: "Organic Chemistry" },
      { id: "inorganic-chemistry", name: "Inorganic Chemistry" },
      { id: "physical-chemistry", name: "Physical Chemistry" },
      { id: "chemical-analysis", name: "Chemical Analysis" }
    ]
  },
  {
    id: "physics",
    name: "Physics",
    color: "#7C3AED",
    topics: [
      { id: "mechanics", name: "Mechanics" },
      { id: "electricity", name: "Electricity" },
      { id: "magnetism", name: "Magnetism" },
      { id: "waves", name: "Waves" },
      { id: "energy", name: "Energy" },
      { id: "radioactivity", name: "Radioactivity" }
    ]
  },
  {
    id: "history",
    name: "History",
    color: "#B45309",
    topics: [
      { id: "world-war-1", name: "World War 1" },
      { id: "world-war-2", name: "World War 2" },
      { id: "cold-war", name: "Cold War" },
      { id: "industrial-revolution", name: "Industrial Revolution" },
      { id: "british-history", name: "British History" },
      { id: "social-history", name: "Social History" }
    ]
  },
  {
    id: "geography",
    name: "Geography",
    color: "#0891B2",
    topics: [
      { id: "physical-geography", name: "Physical Geography" },
      { id: "human-geography", name: "Human Geography" },
      { id: "climate-change", name: "Climate Change" },
      { id: "urbanization", name: "Urbanization" },
      { id: "natural-hazards", name: "Natural Hazards" },
      { id: "sustainability", name: "Sustainability" }
    ]
  }
];
