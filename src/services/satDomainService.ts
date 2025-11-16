export const SAT_DOMAINS = [
  {
    id: 'information-ideas',
    name: 'Information & Ideas',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    icon: '📚',
    category: 'Reading & Writing',
    description: 'Understanding and analyzing written passages',
    status: 'Active'
  },
  {
    id: 'craft-structure',
    name: 'Craft & Structure',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    icon: '✏️',
    category: 'Reading & Writing',
    description: 'Analyzing text structure and word choice',
    status: 'Active'
  },
  {
    id: 'expression-ideas',
    name: 'Expression of Ideas',
    color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    icon: '💭',
    category: 'Reading & Writing',
    description: 'Effective communication and style',
    status: 'Active'
  },
  {
    id: 'standard-english',
    name: 'Standard English Conventions',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    icon: '📝',
    category: 'Reading & Writing',
    description: 'Grammar, punctuation, and sentence structure',
    status: 'Active'
  },
  {
    id: 'algebra',
    name: 'Algebra',
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    icon: '🔢',
    category: 'Math',
    description: 'Equations, functions, and algebraic thinking',
    status: 'Active'
  },
  {
    id: 'advanced-math',
    name: 'Advanced Math',
    color: 'bg-gradient-to-br from-teal-500 to-teal-600',
    icon: '📐',
    category: 'Math',
    description: 'Complex equations and mathematical concepts',
    status: 'Active'
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving & Data Analysis',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    icon: '📊',
    category: 'Math',
    description: 'Quantitative reasoning and data interpretation',
    status: 'Active'
  },
  {
    id: 'geometry-trig',
    name: 'Geometry & Trigonometry',
    color: 'bg-gradient-to-br from-amber-500 to-amber-600',
    icon: '📏',
    category: 'Math',
    description: 'Shapes, angles, and spatial relationships',
    status: 'Active'
  }
];

export const getSATDomainById = (id: string) => {
  return SAT_DOMAINS.find(domain => domain.id === id);
};

export const getSATDomainsByCategory = (category: 'Reading & Writing' | 'Math') => {
  return SAT_DOMAINS.filter(domain => domain.category === category);
};
