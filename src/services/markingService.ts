
import { Question } from "@/data/curriculum";

export interface MarkingResult {
  score: number;
  feedback: string;
  detailedBreakdown: {
    point: string;
    awarded: number;
    possible: number;
    reason: string;
  }[];
}

export class MarkingService {
  private subjectId: string;

  constructor(subjectId: string) {
    this.subjectId = subjectId;
  }

  async markAnswer(question: Question, userAnswer: string): Promise<MarkingResult> {
    if (!userAnswer.trim()) {
      return {
        score: 0,
        feedback: "No answer provided - cannot award any marks.",
        detailedBreakdown: []
      };
    }

    const normalizedAnswer = this.normalizeText(userAnswer);
    const normalizedModel = this.normalizeText(question.modelAnswer);
    
    // Check for exact or near-exact matches first
    const similarity = this.calculateSimilarity(normalizedAnswer, normalizedModel);
    if (similarity > 0.85) {
      return {
        score: question.marks,
        feedback: "Excellent answer! Very close to the model answer.",
        detailedBreakdown: question.markingCriteria.breakdown.map(point => ({
          point,
          awarded: question.marks / question.markingCriteria.breakdown.length,
          possible: question.marks / question.markingCriteria.breakdown.length,
          reason: "Comprehensive understanding demonstrated"
        }))
      };
    }

    // Mark each point individually
    const detailedBreakdown = await this.markIndividualPoints(question, normalizedAnswer);
    const totalScore = detailedBreakdown.reduce((sum, item) => sum + item.awarded, 0);
    
    // Apply bonus for comprehensive answers
    let finalScore = totalScore;
    if (userAnswer.length > 100 && totalScore > question.marks * 0.6) {
      finalScore = Math.min(finalScore + 0.5, question.marks);
    }

    const feedback = this.generateDetailedFeedback(question, detailedBreakdown, finalScore);

    return {
      score: Math.round(finalScore * 10) / 10, // Round to 1 decimal
      feedback,
      detailedBreakdown
    };
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private async markIndividualPoints(question: Question, normalizedAnswer: string) {
    const marksPerPoint = question.marks / question.markingCriteria.breakdown.length;
    
    return question.markingCriteria.breakdown.map(point => {
      const pointScore = this.evaluateMarkingPoint(point, normalizedAnswer, marksPerPoint);
      return {
        point,
        awarded: pointScore.score,
        possible: marksPerPoint,
        reason: pointScore.reason
      };
    });
  }

  private evaluateMarkingPoint(markingPoint: string, answer: string, maxMarks: number) {
    const normalizedPoint = this.normalizeText(markingPoint);
    const keyTerms = this.extractKeyTerms(normalizedPoint);
    
    let score = 0;
    let matchedTerms: string[] = [];
    let reasons: string[] = [];

    // Check for key scientific/mathematical terms
    for (const term of keyTerms) {
      if (this.checkTermPresence(term, answer)) {
        const termWeight = this.getTermWeight(term);
        score += (maxMarks * termWeight) / keyTerms.length;
        matchedTerms.push(term);
      }
    }

    // Check for conceptual understanding
    const conceptualScore = this.checkConceptualUnderstanding(normalizedPoint, answer);
    score += conceptualScore * maxMarks;

    // Check for partial credit opportunities
    if (score === 0) {
      const partialCredit = this.checkPartialCredit(normalizedPoint, answer);
      score = partialCredit * maxMarks;
      if (partialCredit > 0) {
        reasons.push("Partial credit for relevant attempt");
      }
    }

    // Generate reason
    let reason = "";
    if (matchedTerms.length > 0) {
      reason = `Correctly mentioned: ${matchedTerms.join(', ')}`;
    } else if (score > 0) {
      reason = "Partial understanding shown";
    } else {
      reason = "Key concepts not addressed";
    }

    return {
      score: Math.min(score, maxMarks),
      reason
    };
  }

  private extractKeyTerms(text: string): string[] {
    // Subject-specific important terms
    const subjectTerms = {
      biology: [
        'osmosis', 'diffusion', 'enzyme', 'active site', 'substrate', 'catalyst',
        'membrane', 'concentration', 'gradient', 'water potential', 'photosynthesis',
        'respiration', 'mitochondria', 'chloroplast', 'glucose', 'oxygen',
        'carbon dioxide', 'energy', 'atp', 'dna', 'rna', 'protein', 'cell',
        'tissue', 'organ', 'system', 'homeostasis', 'hormone'
      ],
      chemistry: [
        'atom', 'molecule', 'ion', 'electron', 'proton', 'neutron', 'bond',
        'ionic', 'covalent', 'metallic', 'compound', 'element', 'reaction',
        'oxidation', 'reduction', 'acid', 'base', 'ph', 'catalyst', 'equilibrium',
        'concentration', 'molarity', 'precipitation', 'crystallization'
      ],
      maths: [
        'equation', 'formula', 'solve', 'calculate', 'fraction', 'decimal',
        'percentage', 'ratio', 'proportion', 'area', 'volume', 'perimeter',
        'probability', 'graph', 'function', 'derivative', 'integral', 'limit',
        'theorem', 'proof', 'algebra', 'geometry', 'trigonometry'
      ]
    };

    const relevantTerms = subjectTerms[this.subjectId as keyof typeof subjectTerms] || [];
    
    // Extract terms that appear in both the marking point and subject vocabulary
    const words = text.split(' ').filter(word => word.length > 2);
    const keyTerms = words.filter(word => 
      relevantTerms.includes(word) || 
      relevantTerms.some(term => term.includes(word) || word.includes(term))
    );

    // Also include important phrases and compound terms
    const phrases = this.extractPhrases(text);
    
    return [...new Set([...keyTerms, ...phrases])];
  }

  private extractPhrases(text: string): string[] {
    const commonPhrases = [
      'active site', 'concentration gradient', 'water potential', 'active transport',
      'passive transport', 'cell membrane', 'cell wall', 'nuclear membrane',
      'ionic bond', 'covalent bond', 'metallic bond', 'hydrogen bond',
      'acid base', 'redox reaction', 'chemical equation', 'balanced equation',
      'quadratic equation', 'linear equation', 'simultaneous equation',
      'right angle', 'acute angle', 'obtuse angle'
    ];

    return commonPhrases.filter(phrase => text.includes(phrase));
  }

  private checkTermPresence(term: string, answer: string): boolean {
    // Direct match
    if (answer.includes(term)) return true;

    // Check synonyms and variations
    const synonyms = this.getTermSynonyms(term);
    return synonyms.some(synonym => answer.includes(synonym));
  }

  private getTermSynonyms(term: string): string[] {
    const synonymMap: Record<string, string[]> = {
      'osmosis': ['water movement', 'water transport', 'selective permeability'],
      'diffusion': ['spreading', 'dispersal', 'movement of particles'],
      'enzyme': ['biological catalyst', 'protein catalyst', 'biocatalyst'],
      'substrate': ['reactant', 'starting material'],
      'photosynthesis': ['light dependent reaction', 'carbon fixation', 'glucose synthesis'],
      'respiration': ['cellular respiration', 'glucose breakdown', 'energy release'],
      'catalyst': ['accelerator', 'speed up', 'rate increase'],
      'concentration': ['amount', 'density', 'molarity'],
      'gradient': ['difference', 'slope', 'change'],
      'bond': ['attraction', 'force', 'connection'],
      'reaction': ['process', 'change', 'transformation'],
      'equation': ['formula', 'expression', 'relationship'],
      'calculate': ['work out', 'find', 'determine', 'compute'],
      'solve': ['find solution', 'work out', 'determine']
    };

    return synonymMap[term] || [];
  }

  private getTermWeight(term: string): number {
    // More important terms get higher weights
    const highPriorityTerms = [
      'osmosis', 'diffusion', 'enzyme', 'photosynthesis', 'respiration',
      'catalyst', 'reaction', 'equation', 'bond', 'concentration'
    ];

    return highPriorityTerms.includes(term) ? 1.0 : 0.7;
  }

  private checkConceptualUnderstanding(markingPoint: string, answer: string): number {
    // Look for explanatory words and logical connections
    const explanatoryWords = [
      'because', 'therefore', 'so', 'thus', 'hence', 'as a result',
      'due to', 'caused by', 'leads to', 'results in', 'means that'
    ];

    const hasExplanation = explanatoryWords.some(word => answer.includes(word));
    
    if (hasExplanation) {
      // Check if the explanation makes sense in context
      const contextWords = markingPoint.split(' ').slice(0, 3);
      const relevantContext = contextWords.some(word => answer.includes(word));
      
      return relevantContext ? 0.3 : 0.1;
    }

    return 0;
  }

  private checkPartialCredit(markingPoint: string, answer: string): number {
    // Award partial credit for relevant attempts
    const pointWords = markingPoint.split(' ');
    let matches = 0;

    for (const word of pointWords) {
      if (word.length > 3 && answer.includes(word)) {
        matches++;
      }
    }

    const matchRatio = matches / Math.max(pointWords.length, 1);
    
    // Award up to 25% for partial understanding
    return Math.min(matchRatio * 0.25, 0.25);
  }

  private generateDetailedFeedback(question: Question, breakdown: any[], finalScore: number): string {
    const percentage = (finalScore / question.marks) * 100;
    const correctPoints = breakdown.filter(b => b.awarded > b.possible * 0.5);
    const missedPoints = breakdown.filter(b => b.awarded <= b.possible * 0.5);

    let feedback = "";

    if (percentage >= 90) {
      feedback = "Excellent answer! You demonstrated comprehensive understanding.";
    } else if (percentage >= 75) {
      feedback = "Very good answer showing solid understanding.";
    } else if (percentage >= 60) {
      feedback = "Good attempt with reasonable understanding.";
    } else if (percentage >= 40) {
      feedback = "Fair attempt but missing key concepts.";
    } else {
      feedback = "Limited understanding shown - review the topic carefully.";
    }

    if (correctPoints.length > 0) {
      feedback += ` You correctly addressed: ${correctPoints.map(p => p.point.substring(0, 50) + "...").join("; ")}.`;
    }

    if (missedPoints.length > 0) {
      feedback += ` To improve, focus on: ${missedPoints.slice(0, 2).map(p => p.point.substring(0, 50) + "...").join("; ")}.`;
    }

    return feedback;
  }
}
