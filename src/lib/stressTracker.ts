interface StressEvent {
  type: 'correct_streak' | 'wrong_streak' | 'task_completion' | 'quiz_abandon' | 'skip_questions';
  timestamp: Date;
  value: number; // For streaks: number of consecutive answers, for completion: score
  topicId: string;
  subjectId: string;
}

interface TopicStress {
  subjectId: string;
  topicId: string;
  stressLevel: number; // 0-100
  lastUpdated: Date;
  events: StressEvent[];
}

export class StressTracker {
  private static STORAGE_KEY = 'mentiora_stress_data';
  private static MAX_STRESS = 100;
  private static MIN_STRESS = 0;
  
  // Stress modification values
  private static WRONG_STREAK_INCREASE = 15; // Per consecutive wrong answer after 2
  private static CORRECT_STREAK_DECREASE = 12; // Per consecutive correct answer after 2
  private static TASK_COMPLETION_DECREASE = 8; // Per completed task with good score
  private static QUIZ_ABANDON_INCREASE = 20; // Per abandoned quiz
  private static SKIP_QUESTIONS_INCREASE = 5; // Per skipped question

  static getStressData(userId: string): TopicStress[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveStressData(userId: string, data: TopicStress[]): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save stress data:', error);
    }
  }

  static getTopicStress(userId: string, subjectId: string, topicId: string): number {
    const stressData = this.getStressData(userId);
    const topicStress = stressData.find(
      s => s.subjectId === subjectId && s.topicId === topicId
    );
    return topicStress?.stressLevel || 0;
  }

  static getSubjectStress(userId: string, subjectId: string): number {
    const stressData = this.getStressData(userId);
    const subjectStressData = stressData.filter(s => s.subjectId === subjectId);
    
    if (subjectStressData.length === 0) return 0;
    
    const totalStress = subjectStressData.reduce((sum, s) => sum + s.stressLevel, 0);
    return Math.round(totalStress / subjectStressData.length);
  }

  static recordCorrectStreak(
    userId: string, 
    subjectId: string, 
    topicId: string, 
    streakLength: number
  ): void {
    if (streakLength < 2) return; // Only track streaks of 2+
    
    const decrease = (streakLength - 1) * this.CORRECT_STREAK_DECREASE;
    this.updateStress(userId, subjectId, topicId, -decrease, {
      type: 'correct_streak',
      timestamp: new Date(),
      value: streakLength,
      topicId,
      subjectId
    });
  }

  static recordWrongStreak(
    userId: string, 
    subjectId: string, 
    topicId: string, 
    streakLength: number
  ): void {
    if (streakLength < 2) return; // Only track streaks of 2+
    
    const increase = (streakLength - 1) * this.WRONG_STREAK_INCREASE;
    this.updateStress(userId, subjectId, topicId, increase, {
      type: 'wrong_streak',
      timestamp: new Date(),
      value: streakLength,
      topicId,
      subjectId
    });
  }

  static recordTaskCompletion(
    userId: string, 
    subjectId: string, 
    topicId: string, 
    score: number
  ): void {
    if (score < 70) return; // Only count good scores
    
    const decrease = this.TASK_COMPLETION_DECREASE;
    this.updateStress(userId, subjectId, topicId, -decrease, {
      type: 'task_completion',
      timestamp: new Date(),
      value: score,
      topicId,
      subjectId
    });
  }

  static recordQuizAbandon(
    userId: string, 
    subjectId: string, 
    topicId: string
  ): void {
    const increase = this.QUIZ_ABANDON_INCREASE;
    this.updateStress(userId, subjectId, topicId, increase, {
      type: 'quiz_abandon',
      timestamp: new Date(),
      value: 1,
      topicId,
      subjectId
    });
  }

  static recordSkippedQuestions(
    userId: string, 
    subjectId: string, 
    topicId: string, 
    skipCount: number
  ): void {
    if (skipCount < 2) return; // Only track multiple skips
    
    const increase = skipCount * this.SKIP_QUESTIONS_INCREASE;
    this.updateStress(userId, subjectId, topicId, increase, {
      type: 'skip_questions',
      timestamp: new Date(),
      value: skipCount,
      topicId,
      subjectId
    });
  }

  private static updateStress(
    userId: string,
    subjectId: string,
    topicId: string,
    change: number,
    event: StressEvent
  ): void {
    const stressData = this.getStressData(userId);
    let topicStress = stressData.find(
      s => s.subjectId === subjectId && s.topicId === topicId
    );

    if (!topicStress) {
      topicStress = {
        subjectId,
        topicId,
        stressLevel: 50, // Start at neutral
        lastUpdated: new Date(),
        events: []
      };
      stressData.push(topicStress);
    }

    // Apply stress change
    topicStress.stressLevel = Math.max(
      this.MIN_STRESS,
      Math.min(this.MAX_STRESS, topicStress.stressLevel + change)
    );
    
    topicStress.lastUpdated = new Date();
    topicStress.events.push(event);

    // Keep only last 50 events per topic to prevent memory bloat
    if (topicStress.events.length > 50) {
      topicStress.events = topicStress.events.slice(-50);
    }

    this.saveStressData(userId, stressData);
  }

  // Natural stress decay over time
  static applyStressDecay(userId: string): void {
    const stressData = this.getStressData(userId);
    const now = new Date();
    let hasChanges = false;

    stressData.forEach(topicStress => {
      const hoursSinceUpdate = (now.getTime() - new Date(topicStress.lastUpdated).getTime()) / (1000 * 60 * 60);
      
      // Decay stress by 1 point per hour, minimum 0.5 points per day
      const decayAmount = Math.max(0.5, hoursSinceUpdate * 1);
      
      if (decayAmount > 0) {
        topicStress.stressLevel = Math.max(
          this.MIN_STRESS,
          topicStress.stressLevel - decayAmount
        );
        topicStress.lastUpdated = now;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveStressData(userId, stressData);
    }
  }
}
