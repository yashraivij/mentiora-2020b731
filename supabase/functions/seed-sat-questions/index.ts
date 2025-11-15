import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SATQuestion {
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_type: 'mcq' | 'grid_in';
  question_text: string;
  passage_text?: string;
  choices?: string[];
  correct_answer: string;
  explanation: string;
  tags: string[];
}

// Initial SAT question bank - 30 questions across all domains
const SAT_QUESTIONS: SATQuestion[] = [
  // READING & WRITING - Information & Ideas (6 questions)
  {
    domain: 'Information & Ideas',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'The passage suggests that renewable energy sources are:',
    passage_text: 'Solar and wind energy have become increasingly cost-effective alternatives to fossil fuels. Recent studies show that in many regions, renewable energy is now cheaper than coal or natural gas.',
    choices: ['A) More expensive than fossil fuels', 'B) Cost-competitive with traditional energy', 'C) Only available in certain climates', 'D) Less reliable than nuclear power'],
    correct_answer: 'B',
    explanation: 'The passage states that renewable energy is "now cheaper than coal or natural gas," making it cost-competitive.',
    tags: ['main_idea', 'inference']
  },
  {
    domain: 'Information & Ideas',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'Which choice best describes the data in the graph?',
    passage_text: 'A graph shows global temperature increases from 1900 to 2020, with a sharp upward trend beginning around 1980.',
    choices: ['A) Temperatures remained constant throughout the period', 'B) The most significant warming occurred after 1980', 'C) Temperature decreased in the 1900s', 'D) Changes were minimal overall'],
    correct_answer: 'B',
    explanation: 'The passage explicitly mentions "a sharp upward trend beginning around 1980," indicating the most significant warming after that date.',
    tags: ['data_analysis', 'graphs']
  },
  {
    domain: 'Information & Ideas',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'According to the text, what is the primary benefit of urban gardens?',
    passage_text: 'Urban gardens provide fresh produce to city residents while also creating green spaces that improve air quality and mental health.',
    choices: ['A) They reduce traffic congestion', 'B) They provide multiple community benefits', 'C) They increase property values', 'D) They require minimal maintenance'],
    correct_answer: 'B',
    explanation: 'The passage lists multiple benefits: fresh produce, green spaces, improved air quality, and mental health - all community benefits.',
    tags: ['main_idea', 'supporting_details']
  },
  {
    domain: 'Information & Ideas',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'The author uses the example of bee population decline primarily to:',
    passage_text: 'While many focus on charismatic megafauna like pandas and elephants, the decline of bee populations poses a far more immediate threat to human food security. Bees pollinate roughly one-third of the food crops we consume.',
    choices: ['A) Criticize conservation priorities', 'B) Illustrate the interconnection between species and human survival', 'C) Argue against protecting large animals', 'D) Demonstrate the effects of climate change'],
    correct_answer: 'B',
    explanation: 'The author contrasts focus on large animals with bees to show how bee decline directly threatens human food security, illustrating species interconnection.',
    tags: ['authors_purpose', 'rhetorical_analysis']
  },
  {
    domain: 'Information & Ideas',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'Based on the passage, which statement would the author most likely agree with?',
    passage_text: 'Artificial intelligence will undoubtedly transform many industries, but concerns about AI replacing human workers are often exaggerated. History shows that technological advances typically create more jobs than they eliminate, though the nature of work changes.',
    choices: ['A) AI will have no impact on employment', 'B) Job displacement from AI is inevitable and permanent', 'C) Technological change reshapes rather than eliminates employment', 'D) AI should be banned to protect workers'],
    correct_answer: 'C',
    explanation: 'The author states that technology "typically create[s] more jobs than they eliminate, though the nature of work changes," supporting answer C.',
    tags: ['inference', 'authors_perspective']
  },
  {
    domain: 'Information & Ideas',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'The data in the study most directly challenges which common assumption?',
    passage_text: 'A recent study found that students who took notes by hand scored higher on conceptual questions than those who used laptops, despite laptop users recording more information verbatim.',
    choices: ['A) More notes lead to better understanding', 'B) Technology always improves learning', 'C) Handwriting is obsolete', 'D) Conceptual understanding is unimportant'],
    correct_answer: 'A',
    explanation: 'The study shows that despite recording more information, laptop users scored lower, challenging the assumption that more notes equal better understanding.',
    tags: ['data_interpretation', 'logical_reasoning']
  },

  // READING & WRITING - Craft & Structure (6 questions)
  {
    domain: 'Craft & Structure',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'As used in line 3, "novel" most nearly means:',
    passage_text: 'The researcher\'s novel approach to treating the disease involved using the body\'s own immune system rather than external medications.',
    choices: ['A) A long fictional work', 'B) Original or new', 'C) Strange or unusual', 'D) Difficult to understand'],
    correct_answer: 'B',
    explanation: 'In this context, "novel" means new or original - describing an innovative approach to treatment.',
    tags: ['vocabulary_in_context']
  },
  {
    domain: 'Craft & Structure',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'The primary purpose of the third paragraph is to:',
    passage_text: '[Paragraph 3] However, recent discoveries have forced scientists to reconsider this longstanding theory. New fossil evidence suggests an alternative timeline that contradicts previous assumptions.',
    choices: ['A) Introduce a new topic', 'B) Present a contrasting viewpoint', 'C) Summarize the main argument', 'D) Provide supporting examples'],
    correct_answer: 'B',
    explanation: 'The paragraph begins with "However" and describes discoveries that "contradict previous assumptions," clearly presenting a contrasting viewpoint.',
    tags: ['text_structure', 'purpose']
  },
  {
    domain: 'Craft & Structure',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'Which choice best describes the overall structure of the text?',
    passage_text: 'The article begins with a historical overview of migration patterns, then examines current trends, and concludes with predictions for future population movements.',
    choices: ['A) Problem and solution', 'B) Chronological progression', 'C) Cause and effect', 'D) Compare and contrast'],
    correct_answer: 'B',
    explanation: 'The text moves from historical to current to future, following a chronological progression through time.',
    tags: ['text_structure', 'organization']
  },
  {
    domain: 'Craft & Structure',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'The author\'s use of the phrase "so-called experts" in line 12 primarily serves to:',
    passage_text: 'Many so-called experts claim to have solutions, but their track record suggests otherwise.',
    choices: ['A) Show respect for authority', 'B) Express skepticism about their expertise', 'C) Introduce qualified professionals', 'D) Emphasize their importance'],
    correct_answer: 'B',
    explanation: 'The phrase "so-called" typically indicates doubt or skepticism, especially when followed by criticism of their track record.',
    tags: ['tone', 'rhetorical_analysis']
  },
  {
    domain: 'Craft & Structure',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'As used in the passage, "tempered" most nearly means:',
    passage_text: 'Initial enthusiasm for the project was tempered by concerns about its environmental impact.',
    choices: ['A) Hardened', 'B) Moderated or restrained', 'C) Increased', 'D) Eliminated'],
    correct_answer: 'B',
    explanation: 'In this context, "tempered" means moderated or restrained - the enthusiasm was reduced by concerns.',
    tags: ['vocabulary_in_context']
  },
  {
    domain: 'Craft & Structure',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'The shift from the second to the third paragraph primarily serves to:',
    passage_text: '[Para 2 ends with general principles] [Para 3] Consider, for example, the case of Maria Rodriguez, whose experience illustrates these principles in action.',
    choices: ['A) Introduce conflicting evidence', 'B) Move from general to specific', 'C) Present counterarguments', 'D) Conclude the discussion'],
    correct_answer: 'B',
    explanation: 'The text explicitly moves from "general principles" to a specific example (Maria Rodriguez), showing a general-to-specific shift.',
    tags: ['text_structure', 'transitions']
  },

  // STANDARD ENGLISH CONVENTIONS (6 questions)
  {
    domain: 'Standard English Conventions',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'Which choice completes the sentence with correct punctuation?',
    passage_text: 'The study analyzed three major cities___Paris, London, and Tokyo.',
    choices: ['A) cities:', 'B) cities;', 'C) cities,', 'D) cities'],
    correct_answer: 'A',
    explanation: 'A colon is used to introduce a list, making "cities:" the correct choice.',
    tags: ['punctuation', 'colons']
  },
  {
    domain: 'Standard English Conventions',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'Which choice maintains parallel structure?',
    passage_text: 'The program aims to reduce poverty, improving education, and___.',
    choices: ['A) the promotion of healthcare', 'B) to promote healthcare', 'C) promoting healthcare', 'D) healthcare promotion'],
    correct_answer: 'C',
    explanation: 'The series uses gerund forms ("reducing," "improving"), so "promoting" maintains parallel structure.',
    tags: ['parallelism', 'grammar']
  },
  {
    domain: 'Standard English Conventions',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'Which choice correctly uses the possessive form?',
    passage_text: 'The___findings were published last month.',
    choices: ['A) researchers', 'B) researchers\'', 'C) researcher\'s', 'D) researchers\'s'],
    correct_answer: 'B',
    explanation: 'For plural nouns ending in "s," add only an apostrophe to show possession: "researchers\'".',
    tags: ['possessives', 'apostrophes']
  },
  {
    domain: 'Standard English Conventions',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'Which choice provides the most effective transition?',
    passage_text: 'The initial results were promising.___the long-term effects remain uncertain.',
    choices: ['A) Therefore,', 'B) Additionally,', 'C) However,', 'D) Similarly,'],
    correct_answer: 'C',
    explanation: 'The second sentence contrasts with the first (promising vs. uncertain), requiring the contrasting transition "However."',
    tags: ['transitions', 'logical_flow']
  },
  {
    domain: 'Standard English Conventions',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'Which choice corrects the verb tense error?',
    passage_text: 'By the time we arrived, the concert already started.',
    choices: ['A) already starts', 'B) had already started', 'C) has already started', 'D) was already starting'],
    correct_answer: 'B',
    explanation: 'The past perfect "had already started" is needed to show an action completed before another past action (arrived).',
    tags: ['verb_tense', 'past_perfect']
  },
  {
    domain: 'Standard English Conventions',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'Which choice maintains proper subject-verb agreement?',
    passage_text: 'Neither the teachers nor the principal___aware of the policy change.',
    choices: ['A) were', 'B) are', 'C) was', 'D) have been'],
    correct_answer: 'C',
    explanation: 'With "neither...nor," the verb agrees with the nearest subject ("principal" - singular), requiring "was."',
    tags: ['subject_verb_agreement', 'neither_nor']
  },

  // MATH - Algebra (6 questions)
  {
    domain: 'Algebra',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'If 3x + 5 = 20, what is the value of x?',
    choices: ['A) 3', 'B) 5', 'C) 7', 'D) 15'],
    correct_answer: 'B',
    explanation: 'Subtract 5 from both sides: 3x = 15. Divide by 3: x = 5.',
    tags: ['linear_equations', 'solving']
  },
  {
    domain: 'Algebra',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'Which expression is equivalent to (2x + 3)(x - 4)?',
    choices: ['A) 2x² - 5x - 12', 'B) 2x² - 8x - 12', 'C) 2x² + 11x - 12', 'D) 2x² - 12'],
    correct_answer: 'A',
    explanation: 'Use FOIL: (2x)(x) + (2x)(-4) + (3)(x) + (3)(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12.',
    tags: ['polynomials', 'multiplication']
  },
  {
    domain: 'Algebra',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'If y = 2x - 3, what is y when x = 4?',
    choices: ['A) 5', 'B) 6', 'C) 8', 'D) 11'],
    correct_answer: 'A',
    explanation: 'Substitute x = 4: y = 2(4) - 3 = 8 - 3 = 5.',
    tags: ['functions', 'substitution']
  },
  {
    domain: 'Algebra',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'If x² - 6x + k = (x - 3)², what is the value of k?',
    choices: ['A) 3', 'B) 6', 'C) 9', 'D) 12'],
    correct_answer: 'C',
    explanation: 'Expand (x - 3)²: x² - 6x + 9. Comparing to x² - 6x + k, we see k = 9.',
    tags: ['quadratics', 'perfect_squares']
  },
  {
    domain: 'Algebra',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'Which equation represents a line parallel to y = 3x + 2?',
    choices: ['A) y = 3x - 5', 'B) y = -3x + 2', 'C) y = (1/3)x + 2', 'D) y = 2x + 3'],
    correct_answer: 'A',
    explanation: 'Parallel lines have the same slope. The slope is 3, so y = 3x - 5 is parallel (different y-intercept, same slope).',
    tags: ['linear_functions', 'slope']
  },
  {
    domain: 'Algebra',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'If 2x + y = 10 and x - y = 5, what is the value of x?',
    choices: ['A) 3', 'B) 5', 'C) 7', 'D) 10'],
    correct_answer: 'B',
    explanation: 'Add the equations: (2x + y) + (x - y) = 10 + 5, so 3x = 15, therefore x = 5.',
    tags: ['systems_of_equations', 'elimination']
  },

  // MATH - Problem Solving & Data Analysis (6 questions)
  {
    domain: 'Problem Solving & Data Analysis',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'What is 30% of 80?',
    choices: ['A) 18', 'B) 24', 'C) 26', 'D) 30'],
    correct_answer: 'B',
    explanation: '30% = 0.30, so 0.30 × 80 = 24.',
    tags: ['percentages', 'basic_math']
  },
  {
    domain: 'Problem Solving & Data Analysis',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'A store marks up items by 40%. If an item costs $50 after markup, what was its original cost?',
    choices: ['A) $30', 'B) $35.71', 'C) $40', 'D) $45'],
    correct_answer: 'B',
    explanation: 'If original cost is x, then x + 0.40x = 50, so 1.40x = 50, x = 50/1.40 ≈ $35.71.',
    tags: ['percentages', 'word_problems']
  },
  {
    domain: 'Problem Solving & Data Analysis',
    difficulty: 'easy',
    question_type: 'mcq',
    question_text: 'The mean of 5 numbers is 12. What is their sum?',
    choices: ['A) 17', 'B) 48', 'C) 60', 'D) 72'],
    correct_answer: 'C',
    explanation: 'Mean = Sum/Count, so 12 = Sum/5, therefore Sum = 12 × 5 = 60.',
    tags: ['statistics', 'mean']
  },
  {
    domain: 'Problem Solving & Data Analysis',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'A survey of 200 people found that 60% like coffee and 40% like tea. If 25% like both, how many like neither?',
    choices: ['A) 30', 'B) 40', 'C) 50', 'D) 60'],
    correct_answer: 'C',
    explanation: 'Like coffee only: 60% - 25% = 35%. Like tea only: 40% - 25% = 15%. Like at least one: 35% + 15% + 25% = 75%. Like neither: 100% - 75% = 25% = 50 people.',
    tags: ['sets', 'venn_diagrams']
  },
  {
    domain: 'Problem Solving & Data Analysis',
    difficulty: 'medium',
    question_type: 'mcq',
    question_text: 'If the ratio of boys to girls in a class is 3:5 and there are 24 students, how many are girls?',
    choices: ['A) 9', 'B) 12', 'C) 15', 'D) 18'],
    correct_answer: 'C',
    explanation: 'Total ratio parts: 3 + 5 = 8. Girls are 5/8 of total: (5/8) × 24 = 15.',
    tags: ['ratios', 'proportions']
  },
  {
    domain: 'Problem Solving & Data Analysis',
    difficulty: 'hard',
    question_type: 'mcq',
    question_text: 'Based on the scatterplot, which statement is most accurate?',
    passage_text: 'A scatterplot shows a negative correlation between hours studied and test anxiety scores.',
    choices: ['A) More study increases anxiety', 'B) More study correlates with lower anxiety', 'C) Study time has no effect on anxiety', 'D) The relationship is positive'],
    correct_answer: 'B',
    explanation: 'A negative correlation means as one variable increases, the other decreases - so more study time correlates with lower anxiety.',
    tags: ['data_interpretation', 'correlation']
  }
];

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if questions already exist
    const { count } = await supabaseClient
      .from('sat_questions')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Questions already seeded', 
          count 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert questions
    const { data, error } = await supabaseClient
      .from('sat_questions')
      .insert(SAT_QUESTIONS);

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        message: 'Successfully seeded SAT questions',
        count: SAT_QUESTIONS.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error seeding questions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
