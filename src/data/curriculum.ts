export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export const curriculum: Subject[] = [
  {
    id: 'maths',
    name: 'Maths',
    topics: [
      { id: 'number', name: 'Number' },
      { id: 'algebra', name: 'Algebra' },
      { id: 'ratio-proportion-rates-of-change', name: 'Ratio, proportion and rates of change' },
      { id: 'geometry-and-measures', name: 'Geometry and measures' },
      { id: 'probability', name: 'Probability' },
      { id: 'statistics', name: 'Statistics' }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    topics: [
      { id: 'cell-biology', name: 'Cell biology' },
      { id: 'organisation', name: 'Organisation' },
      { id: 'infection-and-response', name: 'Infection and response' },
      { id: 'bioenergetics', name: 'Bioenergetics' },
      { id: 'homeostasis-and-response', name: 'Homeostasis and response' },
      { id: 'inheritance-variation-and-evolution', name: 'Inheritance, variation and evolution' },
      { id: 'ecology', name: 'Ecology' }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    topics: [
      { id: 'atomic-structure-and-the-periodic-table', name: 'Atomic structure and the periodic table' },
      { id: 'bonding-structure-and-the-properties-of-matter', name: 'Bonding, structure, and the properties of matter' },
      { id: 'quantitative-chemistry', name: 'Quantitative chemistry' },
      { id: 'chemical-changes', name: 'Chemical changes' },
      { id: 'energy-changes', name: 'Energy changes' },
      { id: 'the-rate-and-extent-of-chemical-change', name: 'The rate and extent of chemical change' },
      { id: 'organic-chemistry', name: 'Organic chemistry' },
      { id: 'chemical-analysis', name: 'Chemical analysis' },
      { id: 'chemistry-of-the-atmosphere', name: 'Chemistry of the atmosphere' },
      { id: 'using-resources', name: 'Using resources' }
    ]
  },
  {
    id: 'english-language',
    name: 'English Language',
    topics: [
      { id: 'reading', name: 'Reading' },
      { id: 'writing', name: 'Writing' },
      { id: 'speaking-and-listening', name: 'Speaking and Listening' }
    ]
  },
  {
    id: 'english-literature',
    name: 'English Literature',
    topics: [
      { id: 'shakespeare', name: 'Shakespeare' },
      { id: '19th-century-novel', name: '19th-century Novel' },
      { id: 'modern-texts', name: 'Modern Texts' },
      { id: 'poetry', name: 'Poetry' }
    ]
  },
  {
    id: 'history',
    name: 'History',
    topics: [
      { id: 'crime-and-punishment', name: 'Crime and Punishment' },
      { id: 'elizabethan-england', name: 'Elizabethan England' },
      { id: 'weimar-and-nazi-germany', name: 'Weimar and Nazi Germany' },
      { id: 'cold-war', name: 'Cold War' }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    topics: [
      { id: 'the-challenge-of-natural-hazards', name: 'The challenge of natural hazards' },
      { id: 'the-living-world', name: 'The living world' },
      { id: 'physical-landscapes-in-the-uk', name: 'Physical landscapes in the UK' },
      { id: 'urban-issues-and-challenges', name: 'Urban issues and challenges' },
      { id: 'the-changing-economic-world', name: 'The changing economic world' },
      { id: 'the-challenge-of-resource-management', name: 'The challenge of resource management' }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    topics: [
      { id: 'energy', name: 'Energy' },
      { id: 'electricity', name: 'Electricity' },
      { id: 'particle-model-of-matter', name: 'Particle model of matter' },
      { id: 'atomic-structure', name: 'Atomic structure' },
      { id: 'forces', name: 'Forces' },
      { id: 'waves', name: 'Waves' },
      { id: 'magnetism-and-electromagnetism', name: 'Magnetism and electromagnetism' },
      { id: 'space-physics', name: 'Space physics (physics only)' }
    ]
  }
];
