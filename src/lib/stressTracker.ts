// Stress tracking utility for monitoring student emotional well-being
export interface StressData {
  subjectId: string;
  topicId?: string;
  level: number; // 0-100 scale
  lastUpdated: Date;
  factors: {
    correctStreak: number;
    wrongStreak: number;
    abandoned: number;
    skipped: number;
    completedTasks: number;
  };
}

export interface UserInteraction {
  type: 'correct' | 'wrong' | 'abandoned' | 'skipped' | 'completed';
  subjectId: string;
  topicId?: string;
  timestamp: Date;
}

export class StressTracker {
  private static STORAGE_KEY = 'mentiora_stress_data';
  
  // Stress level thresholds
  private static STRESS_LEVELS = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 85
  };

  // Factor weights for stress calculation
  private static WEIGHTS = {
    WRONG_STREAK: 15, // Each wrong answer in a row adds stress
    ABANDONED: 20,    // Quitting tasks adds significant stress
    SKIPPED: 10,      // Skipping questions adds moderate stress
    CORRECT_RELIEF: -12, // Correct answers reduce stress
    COMPLETED_RELIEF: -18, // Completing tasks reduces stress significantly
    TIME_DECAY: 0.95  // Natural stress reduction over time (5% per day)
  };

  static getUserStressData(userId: string): StressData[] {
    const key = `${this.STORAGE_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    return JSON.parse(stored).map((data: any) => ({
      ...data,
      lastUpdated: new Date(data.lastUpdated)
    }));
  }

  static saveUserStressData(userId: string, stressData: StressData[]): void {
    const key = `${this.STORAGE_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(stressData));
  }

  static recordInteraction(userId: string, interaction: UserInteraction): void {
    const stressData = this.getUserStressData(userId);
    const key = interaction.topicId 
      ? `${interaction.subjectId}_${interaction.topicId}`
      : interaction.subjectId;
    
    let existing = stressData.find(d => 
      d.subjectId === interaction.subjectId && 
      d.topicId === interaction.topicId
    );

    if (!existing) {
      existing = {
        subjectId: interaction.subjectId,
        topicId: interaction.topicId,
        level: 20, // Start with low baseline stress
        lastUpdated: new Date(),
        factors: {
          correctStreak: 0,
          wrongStreak: 0,
          abandoned: 0,
          skipped: 0,
          completedTasks: 0
        }
      };
      stressData.push(existing);
    }

    // Update factors based on interaction
    switch (interaction.type) {
      case 'correct':
        existing.factors.correctStreak++;
        existing.factors.wrongStreak = 0; // Reset wrong streak
        break;
      case 'wrong':
        existing.factors.wrongStreak++;
        existing.factors.correctStreak = 0; // Reset correct streak
        break;
      case 'abandoned':
        existing.factors.abandoned++;
        existing.factors.correctStreak = 0;
        break;
      case 'skipped':
        existing.factors.skipped++;
        break;
      case 'completed':
        existing.factors.completedTasks++;
        existing.factors.correctStreak = 0;
        existing.factors.wrongStreak = 0;
        break;
    }

    // Recalculate stress level
    existing.level = this.calculateStressLevel(existing.factors);
    existing.lastUpdated = new Date();

    this.saveUserStressData(userId, stressData);
  }

  private static calculateStressLevel(factors: StressData['factors']): number {
    let stress = 20; // Baseline stress level

    // Increase stress for negative patterns
    if (factors.wrongStreak >= 2) {
      stress += factors.wrongStreak * this.WEIGHTS.WRONG_STREAK;
    }
    stress += factors.abandoned * this.WEIGHTS.ABANDONED;
    stress += factors.skipped * this.WEIGHTS.SKIPPED;

    // Decrease stress for positive patterns
    if (factors.correctStreak >= 2) {
      stress += factors.correctStreak * this.WEIGHTS.CORRECT_RELIEF;
    }
    stress += factors.completedTasks * this.WEIGHTS.COMPLETED_RELIEF;

    // Ensure stress stays within bounds
    return Math.max(0, Math.min(100, stress));
  }

  static getStressLevel(userId: string, subjectId: string, topicId?: string): number {
    const stressData = this.getUserStressData(userId);
    const data = stressData.find(d => 
      d.subjectId === subjectId && d.topicId === topicId
    );
    
    if (!data) return 0;

    // Apply natural decay over time
    const daysSinceUpdate = Math.floor(
      (Date.now() - data.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const decayedLevel = data.level * Math.pow(this.WEIGHTS.TIME_DECAY, daysSinceUpdate);
    return Math.max(0, decayedLevel);
  }

  static getStressLevelCategory(level: number): 'low' | 'medium' | 'high' {
    if (level <= this.STRESS_LEVELS.LOW) return 'low';
    if (level <= this.STRESS_LEVELS.MEDIUM) return 'medium';
    return 'high';
  }

  static getStressMessage(category: 'low' | 'medium' | 'high'): string {
    switch (category) {
      case 'low':
        return "You're calm and confident in this subject. Keep going strong.";
      case 'medium':
        return "Looks like this subject's becoming tricky. Try a few practice topics to rebuild confidence.";
      case 'high':
        return "This topic might be stressing you out. Let's slow things down — want to do a calm revision session?";
      default:
        return "Keep up the great work!";
    }
  }

  static applyTimeDecay(userId: string): void {
    const stressData = this.getUserStressData(userId);
    const updated = stressData.map(data => {
      const daysSinceUpdate = Math.floor(
        (Date.now() - data.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceUpdate > 0) {
        return {
          ...data,
          level: Math.max(0, data.level * Math.pow(this.WEIGHTS.TIME_DECAY, daysSinceUpdate)),
          lastUpdated: new Date()
        };
      }
      return data;
    });
    
    this.saveUserStressData(userId, updated);
  }
}