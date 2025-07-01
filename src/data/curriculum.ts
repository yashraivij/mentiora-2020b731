import { type Curriculum, type Question } from "@/types/curriculum";

export type { Question } from "@/types/curriculum";

export const curriculum: Curriculum = [
  {
    id: "Physics",
    name: "Physics",
    color: "bg-blue-500",
    topics: [
      {
        id: "energy-transfers",
        title: "Energy Transfers",
        name: "Energy Transfers",
        questions: [
          {
            id: "energy_1",
            type: "multiple-choice",
            question: "What is the unit of energy?",
            options: ["Joule", "Watt", "Newton", "Pascal"],
            correctAnswer: 0,
            explanation: "Energy is measured in Joules (J).",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying Joule as the unit"]
            }
          },
          {
            id: "energy_2",
            type: "multiple-choice",
            question: "Which of these is a renewable energy source?",
            options: ["Coal", "Oil", "Wind", "Natural Gas"],
            correctAnswer: 2,
            explanation: "Wind is a renewable energy source.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying wind as renewable"]
            }
          }
        ]
      },
      {
        id: "forces-basics", 
        title: "Forces Basics",
        name: "Forces Basics",
        questions: [
          {
            id: "forces_1",
            type: "multiple-choice",
            question: "What is the unit of force?",
            options: ["Newton", "Joule", "Watt", "Pascal"],
            correctAnswer: 0,
            explanation: "Force is measured in Newtons (N).",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying Newton as the unit"]
            }
          }
        ]
      }
    ]
  },
  {
    id: "Chemistry",
    name: "Chemistry",
    color: "bg-green-500",
    topics: [
      {
        id: "atoms",
        title: "Atoms and Elements", 
        name: "Atoms and Elements",
        questions: [
          {
            id: "chem_1",
            type: "multiple-choice",
            question: "What is the charge of a proton?",
            options: ["Positive", "Negative", "Neutral", "Depends on element"],
            correctAnswer: 0,
            explanation: "Protons have a positive charge.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying positive charge"]
            }
          }
        ]
      }
    ]
  },
  {
    id: "Biology",
    name: "Biology", 
    color: "bg-purple-500",
    topics: [
      {
        id: "cells",
        title: "Cells and Microscopy",
        name: "Cells and Microscopy",
        questions: [
          {
            id: "bio_1",
            type: "multiple-choice",
            question: "What is the basic unit of life?",
            options: ["Atom", "Molecule", "Cell", "Organ"],
            correctAnswer: 2,
            explanation: "The cell is the basic unit of life.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying cell"]
            }
          }
        ]
      },
      {
        id: "organs",
        title: "Organs and Organ Systems",
        name: "Organs and Organ Systems", 
        questions: [
          {
            id: "bio_2",
            type: "multiple-choice",
            question: "Which organ pumps blood around the body?",
            options: ["Lungs", "Heart", "Kidneys", "Liver"],
            correctAnswer: 1,
            explanation: "The heart pumps blood around the body.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying heart"]
            }
          }
        ]
      },
      {
        id: "photosynthesis",
        title: "Photosynthesis",
        name: "Photosynthesis",
        questions: [
          {
            id: "photo_1",
            type: "multiple-choice",
            question: "Which gas is taken in during photosynthesis?",
            options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
            correctAnswer: 1,
            explanation: "Carbon dioxide is absorbed from the atmosphere during photosynthesis.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying carbon dioxide"]
            }
          },
          {
            id: "photo_2",
            type: "multiple-choice",
            question: "Where does photosynthesis mainly occur in a plant?",
            options: ["Roots", "Stem", "Leaves", "Flowers"],
            correctAnswer: 2,
            explanation: "Photosynthesis mainly occurs in the leaves, specifically in the chloroplasts.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying leaves"]
            }
          },
          {
            id: "photo_3",
            type: "multiple-choice",
            question: "What is the chemical equation for photosynthesis?",
            options: [
              "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
              "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
              "6CO₂ + 6O₂ → C₆H₁₂O₆ + 6H₂O",
              "C₆H₁₂O₆ + 6H₂O → 6CO₂ + 6O₂"
            ],
            correctAnswer: 0,
            explanation: "The equation shows carbon dioxide and water combining to produce glucose and oxygen.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for correct equation"]
            }
          },
          {
            id: "photo_4",
            type: "multiple-choice",
            question: "Which factor does NOT directly affect the rate of photosynthesis?",
            options: ["Light intensity", "Carbon dioxide concentration", "Temperature", "Soil pH"],
            correctAnswer: 3,
            explanation: "Soil pH does not directly affect photosynthesis, unlike light, CO₂, and temperature.",
            marks: 2,
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: ["1 mark for identifying soil pH", "1 mark for understanding limiting factors"]
            }
          },
          {
            id: "photo_5",
            type: "multiple-choice",
            question: "What happens to the rate of photosynthesis as light intensity increases?",
            options: [
              "It decreases continuously",
              "It increases then levels off",
              "It remains constant",
              "It increases continuously"
            ],
            correctAnswer: 1,
            explanation: "Rate increases with light intensity until another factor becomes limiting.",
            marks: 2,
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: ["1 mark for correct pattern", "1 mark for understanding limiting factors"]
            }
          },
          {
            id: "photo_6",
            type: "multiple-choice",
            question: "Why do plants need glucose from photosynthesis?",
            options: [
              "Only for energy",
              "Only for growth",
              "For respiration and making other substances",
              "Only for storage"
            ],
            correctAnswer: 2,
            explanation: "Glucose is used for respiration and converted into other substances like starch and cellulose.",
            marks: 2,
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: ["1 mark for respiration", "1 mark for making other substances"]
            }
          },
          {
            id: "photo_7",
            type: "multiple-choice",
            question: "Which part of the plant cell contains chlorophyll?",
            options: ["Nucleus", "Mitochondria", "Chloroplasts", "Vacuole"],
            correctAnswer: 2,
            explanation: "Chloroplasts contain chlorophyll, the green pigment that absorbs light energy.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying chloroplasts"]
            }
          },
          {
            id: "photo_8",
            type: "multiple-choice",
            question: "What is the main product of photosynthesis that plants use for energy?",
            options: ["Oxygen", "Carbon dioxide", "Glucose", "Water"],
            correctAnswer: 2,
            explanation: "Glucose is the main product that provides energy through respiration.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying glucose"]
            }
          },
          {
            id: "photo_9",
            type: "multiple-choice",
            question: "How do you test a leaf for starch?",
            options: [
              "Add iodine solution",
              "Add Benedict's solution",
              "Add biuret solution",
              "Add universal indicator"
            ],
            correctAnswer: 0,
            explanation: "Iodine solution turns blue-black in the presence of starch.",
            marks: 2,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 1,
              breakdown: ["1 mark for iodine solution", "1 mark for practical knowledge"]
            }
          },
          {
            id: "photo_10",
            type: "multiple-choice",
            question: "Why must a leaf be boiled in alcohol before testing for starch?",
            options: [
              "To kill the leaf",
              "To remove chlorophyll",
              "To add starch",
              "To make it softer"
            ],
            correctAnswer: 1,
            explanation: "Chlorophyll must be removed so the iodine color change can be seen clearly.",
            marks: 3,
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: ["1 mark for removing chlorophyll", "1 mark for understanding the test", "1 mark for practical application"]
            }
          }
        ]
      },
      {
        id: "homeostasis",
        title: "Homeostasis",
        name: "Homeostasis",
        questions: [
          {
            id: "homeo_1",
            type: "multiple-choice",
            question: "What is homeostasis?",
            options: [
              "Maintaining a stable internal environment",
              "Changing external environment",
              "Growing rapidly",
              "Producing energy"
            ],
            correctAnswer: 0,
            explanation: "Homeostasis is maintaining a stable internal environment.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for defining homeostasis"]
            }
          }
        ]
      },
      {
        id: "genetics",
        title: "Genetics and Evolution",
        name: "Genetics and Evolution",
        questions: [
          {
            id: "inherit_1",
            type: "multiple-choice",
            question: "What carries genetic information?",
            options: ["Proteins", "DNA", "Lipids", "Carbohydrates"],
            correctAnswer: 1,
            explanation: "DNA carries genetic information.",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["1 mark for identifying DNA"]
            }
          }
        ]
      }
    ]
  }
];
