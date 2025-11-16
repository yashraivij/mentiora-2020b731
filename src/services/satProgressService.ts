import { supabase } from "@/integrations/supabase/client";
import { DomainProgress } from "@/types/sat";
import { SAT_DOMAINS } from "./satDomainService";

export async function loadDomainProgress(userId: string): Promise<DomainProgress[]> {
  try {
    // Fetch all SAT session logs for this user
    const { data: sessions, error } = await supabase
      .from('sat_session_logs')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false });

    if (error) {
      console.error('Error loading domain progress:', error);
      return createEmptyProgress();
    }

    if (!sessions || sessions.length === 0) {
      return createEmptyProgress();
    }

    // Aggregate progress by domain
    const domainStats = new Map<string, {
      questionsAnswered: number;
      correctAnswers: number;
      lastAttempt: Date | null;
      attempts: number;
    }>();

    // Initialize all domains
    SAT_DOMAINS.forEach(domain => {
      domainStats.set(domain.id, {
        questionsAnswered: 0,
        correctAnswers: 0,
        lastAttempt: null,
        attempts: 0
      });
    });

    // Process session logs
    sessions.forEach(session => {
      const answers = session.answers as any[] || [];
      
      answers.forEach((answer: any) => {
        const domain = answer.domain || answer.questionDomain;
        if (!domain) return;

        // Map domain names to IDs
        const domainId = mapDomainNameToId(domain);
        if (!domainId) return;

        const stats = domainStats.get(domainId);
        if (stats) {
          stats.questionsAnswered++;
          if (answer.correct || answer.isCorrect) {
            stats.correctAnswers++;
          }
          stats.attempts++;
          
          const sessionDate = new Date(session.session_date);
          if (!stats.lastAttempt || sessionDate > stats.lastAttempt) {
            stats.lastAttempt = sessionDate;
          }
        }
      });
    });

    // Convert to DomainProgress array
    return Array.from(domainStats.entries()).map(([domainId, stats]) => {
      const domain = SAT_DOMAINS.find(d => d.id === domainId);
      const accuracy = stats.questionsAnswered > 0 
        ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
        : 0;

      return {
        domain: domain?.name || domainId,
        domainId,
        questionsAnswered: stats.questionsAnswered,
        correctAnswers: stats.correctAnswers,
        accuracy,
        lastAttempt: stats.lastAttempt,
        masteryLevel: getMasteryLevel(accuracy, stats.questionsAnswered),
        scoreContribution: calculateScoreContribution(accuracy, domainId),
        attempts: stats.attempts
      };
    });
  } catch (error) {
    console.error('Error in loadDomainProgress:', error);
    return createEmptyProgress();
  }
}

function createEmptyProgress(): DomainProgress[] {
  return SAT_DOMAINS.map(domain => ({
    domain: domain.name,
    domainId: domain.id,
    questionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    lastAttempt: null,
    masteryLevel: 'beginner' as const,
    scoreContribution: 0,
    attempts: 0
  }));
}

function mapDomainNameToId(domainName: string): string | null {
  const normalizedName = domainName.toLowerCase();
  
  if (normalizedName.includes('information') || normalizedName.includes('ideas')) {
    return 'information-ideas';
  }
  if (normalizedName.includes('craft') || normalizedName.includes('structure')) {
    return 'craft-structure';
  }
  if (normalizedName.includes('expression')) {
    return 'expression-ideas';
  }
  if (normalizedName.includes('english') || normalizedName.includes('convention')) {
    return 'standard-english';
  }
  if (normalizedName.includes('algebra') && !normalizedName.includes('advanced')) {
    return 'algebra';
  }
  if (normalizedName.includes('advanced')) {
    return 'advanced-math';
  }
  if (normalizedName.includes('problem') || normalizedName.includes('data')) {
    return 'problem-solving';
  }
  if (normalizedName.includes('geometry') || normalizedName.includes('trigonometry')) {
    return 'geometry-trig';
  }
  
  return null;
}

function getMasteryLevel(accuracy: number, questionsAnswered: number): 'beginner' | 'developing' | 'strong' | 'expert' {
  if (questionsAnswered === 0) return 'beginner';
  if (accuracy >= 90 && questionsAnswered >= 20) return 'expert';
  if (accuracy >= 75 && questionsAnswered >= 10) return 'strong';
  if (accuracy >= 60) return 'developing';
  return 'beginner';
}

function calculateScoreContribution(accuracy: number, domainId: string): number {
  // Rough estimate: each domain contributes ~150 points at 100% accuracy
  // Math domains: 800 points total / 4 domains = 200 each
  // Reading & Writing: 800 points total / 4 domains = 200 each
  const maxPoints = 200;
  return Math.round((accuracy / 100) * maxPoints);
}
