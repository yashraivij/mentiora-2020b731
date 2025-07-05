
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
      { id: "probability", name: "Probability" },
      { id: "trigonometry", name: "Trigonometry" },
      { id: "calculus", name: "Calculus" }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "bg-green-500",
    topics: [
      { id: "atomic-structure", name: "Atomic Structure" },
      { id: "bonding", name: "Bonding" },
      { id: "quantitative-chemistry", name: "Quantitative Chemistry" },
      { id: "chemical-changes", name: "Chemical Changes" },
      { id: "energy-changes", name: "Energy Changes" },
      { id: "rate-extent-chemical-change", name: "Rate and Extent of Chemical Change" },
      { id: "organic-chemistry", name: "Organic Chemistry" },
      { id: "chemical-analysis", name: "Chemical Analysis" },
      { id: "chemistry-atmosphere", name: "Chemistry of the Atmosphere" },
      { id: "using-resources", name: "Using Resources" }
    ]
  },
  {
    id: "biology",
    name: "Biology",
    color: "bg-purple-500",
    topics: [
      { id: "cell-biology", name: "Cell Biology" },
      { id: "organization", name: "Organization" },
      { id: "infection-response", name: "Infection and Response" },
      { id: "bioenergetics", name: "Bioenergetics" },
      { id: "homeostasis-response", name: "Homeostasis and Response" },
      { id: "inheritance-variation-evolution", name: "Inheritance, Variation and Evolution" },
      { id: "ecology", name: "Ecology" }
    ]
  }
];

export const curriculum = subjects;
