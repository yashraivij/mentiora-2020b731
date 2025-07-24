import { supabase } from '@/integrations/supabase/client';

interface QuestionAnalysis {
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  questionId: string;
  questionLabel: string;
  questionText: string;
  correctAnswer?: string;
  userAnswer: string;
  score: number;
  maxMarks: number;
  skillType: string;
}

interface NotebookEntryData {
  user_id: string;
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  question_id: string;
  question_label: string;
  confidence_level: 'Low' | 'Medium' | 'High';
  what_tripped_up: string;
  fix_sentence: string;
  bulletproof_notes: string[];
  mini_example?: string;
  keywords: string[];
  spec_link: string;
  next_step_suggestion: string;
  mark_loss: number;
  skill_type: string;
  bloom_level: string;
}

export class NotebookGenerator {
  private static determineConfidenceLevel(score: number, maxMarks: number): 'Low' | 'Medium' | 'High' {
    const percentage = (score / maxMarks) * 100;
    if (percentage < 30) return 'Low';
    if (percentage < 70) return 'Medium';
    return 'High';
  }

  private static determineBloomLevel(skillType: string): string {
    const bloomMapping: { [key: string]: string } = {
      'recall': 'Remember',
      'define': 'Remember',
      'calculate': 'Apply',
      'graph': 'Analyze',
      'explain': 'Understand',
      'evaluate': 'Evaluate',
      'describe': 'Understand',
      'compare': 'Analyze',
      'predict': 'Analyze'
    };
    return bloomMapping[skillType.toLowerCase()] || 'Apply';
  }

  private static generateWhatTrippedUp(analysis: QuestionAnalysis): string {
    const { skillType, questionText, userAnswer, correctAnswer } = analysis;
    
    if (skillType.toLowerCase().includes('calculate')) {
      return "I made a calculation error or used the wrong formula/units.";
    } else if (skillType.toLowerCase().includes('graph')) {
      return "I misread the graph data or plotted incorrectly.";
    } else if (skillType.toLowerCase().includes('define')) {
      return "I didn't know the precise scientific definition.";
    } else if (skillType.toLowerCase().includes('explain')) {
      return "I missed key steps in the explanation or used imprecise language.";
    } else {
      return "I didn't fully understand the concept or made a careless error.";
    }
  }

  private static generateFixSentence(analysis: QuestionAnalysis): string {
    const { subject, topic, skillType } = analysis;
    
    if (skillType.toLowerCase().includes('calculate')) {
      return `Always write the formula first, substitute values with units, then calculate step-by-step.`;
    } else if (skillType.toLowerCase().includes('graph')) {
      return `Read the axes carefully, plot points precisely, and draw smooth curves with a ruler.`;
    } else if (skillType.toLowerCase().includes('define')) {
      return `Learn the exact definition and include all key scientific terms.`;
    } else if (skillType.toLowerCase().includes('explain')) {
      return `Use precise scientific vocabulary and explain step-by-step with clear cause and effect.`;
    } else {
      return `Review the fundamental concepts and practice similar questions.`;
    }
  }

  private static generateBulletproofNotes(analysis: QuestionAnalysis): string[] {
    const { subject, topic, subtopic, skillType, questionText } = analysis;
    const notes: string[] = [];

    // Subject-specific notes
    if (subject.toLowerCase().includes('biology')) {
      notes.push(...this.generateBiologyNotes(topic, subtopic, skillType));
    } else if (subject.toLowerCase().includes('chemistry')) {
      notes.push(...this.generateChemistryNotes(topic, subtopic, skillType));
    } else if (subject.toLowerCase().includes('physics')) {
      notes.push(...this.generatePhysicsNotes(topic, subtopic, skillType));
    }

    return notes;
  }

  private static generateBiologyNotes(topic: string, subtopic: string, skillType: string): string[] {
    const notes: string[] = [];
    
    if (topic.toLowerCase().includes('cell')) {
      notes.push('<strong>Prokaryotes</strong>: No nucleus, no membrane-bound organelles (bacteria)');
      notes.push('<strong>Eukaryotes</strong>: Nucleus present, membrane-bound organelles (animals/plants)');
      notes.push('Magnification = Image size ÷ Real size');
    } else if (topic.toLowerCase().includes('transport')) {
      notes.push('<strong>Diffusion</strong>: High → low concentration, passive process');
      notes.push('<strong>Osmosis</strong>: Water diffusion through partially permeable membrane');
      notes.push('<strong>Active transport</strong>: Low → high concentration, requires energy');
    }

    return notes;
  }

  private static generateChemistryNotes(topic: string, subtopic: string, skillType: string): string[] {
    const notes: string[] = [];
    
    if (topic.toLowerCase().includes('atomic')) {
      notes.push('<strong>Atomic number</strong>: Number of protons (defines element)');
      notes.push('<strong>Mass number</strong>: Protons + neutrons');
      notes.push('Electronic structure: Maximum electrons per shell = 2, 8, 8');
    } else if (topic.toLowerCase().includes('bonding')) {
      notes.push('<strong>Ionic</strong>: Metal + non-metal, electrons transferred');
      notes.push('<strong>Covalent</strong>: Non-metal + non-metal, electrons shared');
      notes.push('<strong>Metallic</strong>: Sea of electrons, conducts electricity');
    }

    return notes;
  }

  private static generatePhysicsNotes(topic: string, subtopic: string, skillType: string): string[] {
    const notes: string[] = [];
    
    if (topic.toLowerCase().includes('energy')) {
      notes.push('<strong>KE</strong> = ½mv² (kinetic energy)');
      notes.push('<strong>GPE</strong> = mgh (gravitational potential energy)');
      notes.push('<strong>Efficiency</strong> = (useful output ÷ total input) × 100%');
    } else if (topic.toLowerCase().includes('electricity')) {
      notes.push('<strong>Current</strong>: I = Q/t (charge per second)');
      notes.push('<strong>Ohm\'s Law</strong>: V = IR');
      notes.push('<strong>Power</strong>: P = VI = I²R = V²/R');
    }

    return notes;
  }

  private static generateMiniExample(analysis: QuestionAnalysis): string | undefined {
    const { skillType, topic } = analysis;
    
    if (skillType.toLowerCase().includes('calculate')) {
      if (topic.toLowerCase().includes('energy')) {
        return 'KE = ½mv²\nKE = ½ × 2 kg × (5 m/s)²\nKE = ½ × 2 × 25 = 25 J';
      } else if (topic.toLowerCase().includes('electricity')) {
        return 'V = IR\nV = 2 A × 5 Ω\nV = 10 V';
      }
    }
    
    return undefined;
  }

  private static generateKeywords(analysis: QuestionAnalysis): string[] {
    const { subject, topic, subtopic, skillType } = analysis;
    const keywords: string[] = [];
    
    // Add subject-specific keywords
    if (subject.toLowerCase().includes('biology')) {
      keywords.push('cell', 'organism', 'enzyme', 'DNA');
    } else if (subject.toLowerCase().includes('chemistry')) {
      keywords.push('atom', 'molecule', 'reaction', 'bond');
    } else if (subject.toLowerCase().includes('physics')) {
      keywords.push('force', 'energy', 'wave', 'particle');
    }
    
    // Add topic-specific keywords
    keywords.push(topic.toLowerCase(), subtopic.toLowerCase());
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  private static generateSpecLink(analysis: QuestionAnalysis): string {
    const { subject, topic } = analysis;
    
    if (subject.toLowerCase().includes('biology')) {
      if (topic.toLowerCase().includes('cell')) return 'AQA Biology 4.1.1 Cell structure';
      if (topic.toLowerCase().includes('transport')) return 'AQA Biology 4.1.3 Transport in cells';
      if (topic.toLowerCase().includes('organisation')) return 'AQA Biology 4.2 Organisation';
    } else if (subject.toLowerCase().includes('chemistry')) {
      if (topic.toLowerCase().includes('atomic')) return 'AQA Chemistry 5.1 Atomic structure';
      if (topic.toLowerCase().includes('bonding')) return 'AQA Chemistry 5.2 Bonding and structure';
    } else if (subject.toLowerCase().includes('physics')) {
      if (topic.toLowerCase().includes('energy')) return 'AQA Physics 6.1 Energy stores';
      if (topic.toLowerCase().includes('electricity')) return 'AQA Physics 6.2 Electricity';
    }
    
    return `AQA ${subject} specification`;
  }

  private static generateNextStep(analysis: QuestionAnalysis): string {
    const { topic, skillType } = analysis;
    
    if (skillType.toLowerCase().includes('calculate')) {
      return `Practice more calculation questions on ${topic} until you can do them without checking the formula.`;
    } else if (skillType.toLowerCase().includes('explain')) {
      return `Create flashcards for ${topic} key processes and practice explaining them step-by-step.`;
    } else {
      return `Review ${topic} fundamentals and attempt 3-5 similar questions to reinforce understanding.`;
    }
  }

  public static async generateNotebookEntry(
    userId: string, 
    analysis: QuestionAnalysis
  ): Promise<void> {
    // Check if similar entry already exists
    const { data: existingEntries } = await supabase
      .from('notebook_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', analysis.subject)
      .eq('topic', analysis.topic)
      .eq('subtopic', analysis.subtopic)
      .eq('skill_type', analysis.skillType);

    // If similar entry exists and this is a minor improvement, update instead of create
    if (existingEntries && existingEntries.length > 0) {
      const markLoss = analysis.maxMarks - analysis.score;
      if (markLoss <= 2) {
        // Minor error, just update the existing entry
        await supabase
          .from('notebook_entries')
          .update({ 
            mark_loss: markLoss,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntries[0].id);
        return;
      }
    }

    const entry: NotebookEntryData = {
      user_id: userId,
      subject: analysis.subject,
      paper: analysis.paper,
      topic: analysis.topic,
      subtopic: analysis.subtopic,
      question_id: analysis.questionId,
      question_label: analysis.questionLabel,
      confidence_level: this.determineConfidenceLevel(analysis.score, analysis.maxMarks),
      what_tripped_up: this.generateWhatTrippedUp(analysis),
      fix_sentence: this.generateFixSentence(analysis),
      bulletproof_notes: this.generateBulletproofNotes(analysis),
      mini_example: this.generateMiniExample(analysis),
      keywords: this.generateKeywords(analysis),
      spec_link: this.generateSpecLink(analysis),
      next_step_suggestion: this.generateNextStep(analysis),
      mark_loss: analysis.maxMarks - analysis.score,
      skill_type: analysis.skillType,
      bloom_level: this.determineBloomLevel(analysis.skillType)
    };

    const { error } = await supabase
      .from('notebook_entries')
      .insert([entry]);

    if (error) {
      console.error('Error creating notebook entry:', error);
      throw error;
    }
  }

  public static async generateBatchNotebookEntries(
    userId: string,
    analyses: QuestionAnalysis[]
  ): Promise<void> {
    const promises = analyses.map(analysis => 
      this.generateNotebookEntry(userId, analysis)
    );
    
    await Promise.all(promises);
  }
}