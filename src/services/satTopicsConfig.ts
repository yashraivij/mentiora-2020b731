// SAT Topics Configuration - Fixed curriculum
export const SAT_TOPICS = [
  {
    id: 'reading-information-ideas',
    name: 'Information & Ideas',
    section: 'Reading & Writing',
    color: 'bg-blue-500',
    description: 'Central ideas, details, inferences'
  },
  {
    id: 'reading-craft-structure',
    name: 'Craft & Structure', 
    section: 'Reading & Writing',
    color: 'bg-cyan-500',
    description: 'Word meaning, text structure, purpose'
  },
  {
    id: 'writing-conventions',
    name: 'Standard English Conventions',
    section: 'Reading & Writing',
    color: 'bg-teal-500',
    description: 'Grammar, punctuation, sentence structure'
  },
  {
    id: 'math-algebra',
    name: 'Algebra',
    section: 'Math',
    color: 'bg-purple-500',
    description: 'Linear equations, systems, inequalities'
  },
  {
    id: 'math-advanced',
    name: 'Advanced Math',
    section: 'Math',
    color: 'bg-violet-500',
    description: 'Quadratics, polynomials, functions'
  },
  {
    id: 'math-problem-solving',
    name: 'Problem Solving & Data Analysis',
    section: 'Math',
    color: 'bg-pink-500',
    description: 'Ratios, percentages, statistics'
  },
  {
    id: 'math-geometry',
    name: 'Geometry & Trigonometry',
    section: 'Math',
    color: 'bg-orange-500',
    description: 'Shapes, angles, coordinate geometry'
  }
];

// Map SAT question domains to topic IDs
export const DOMAIN_TO_TOPIC_MAP: Record<string, string> = {
  'Information and Ideas': 'reading-information-ideas',
  'Craft and Structure': 'reading-craft-structure',
  'Standard English Conventions': 'writing-conventions',
  'Algebra': 'math-algebra',
  'Advanced Math': 'math-advanced',
  'Problem-Solving and Data Analysis': 'math-problem-solving',
  'Geometry and Trigonometry': 'math-geometry'
};
