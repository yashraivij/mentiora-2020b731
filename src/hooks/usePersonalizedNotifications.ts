import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface NotificationState {
  isVisible: boolean;
  type: "wrong-answer" | "practice-streak" | "weak-topic-recommendation" | "exam-recommendation" | null;
  questionNumber?: number;
  topicName?: string;
  subjectName?: string;
  streakCount?: number;
  weakestTopic?: string;
  subjectId?: string;
}

export const usePersonalizedNotifications = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: null
  });

  // Track consecutive correct answers for practice streak detection
  const getConsecutiveCorrect = useCallback(async (userId: string, subjectId: string) => {
    const storageKey = `streak_${userId}_${subjectId}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? parseInt(stored) : 0;
  }, []);

  const updateConsecutiveCorrect = useCallback(async (
    userId: string, 
    subjectId: string, 
    isCorrect: boolean
  ) => {
    const storageKey = `streak_${userId}_${subjectId}`;
    const current = await getConsecutiveCorrect(userId, subjectId);
    
    if (isCorrect) {
      const newStreak = current + 1;
      localStorage.setItem(storageKey, newStreak.toString());
      return newStreak;
    } else {
      localStorage.setItem(storageKey, "0");
      return 0;
    }
  }, [getConsecutiveCorrect]);

  // Check if user has completed predicted exam for this subject
  const hasCompletedPredictedExam = useCallback(async (userId: string, subjectId: string) => {
    try {
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .limit(1);

      if (error) {
        console.error('Error checking predicted exam completion:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasCompletedPredictedExam:', error);
      return false;
    }
  }, []);

  // Show notification for wrong answer in predicted exam
  const showWrongAnswerNotification = useCallback((
    questionNumber: number,
    topicName: string,
    subjectName: string
  ) => {
    setNotification({
      isVisible: true,
      type: "wrong-answer",
      questionNumber,
      topicName,
      subjectName
    });
  }, []);

  // Show notification for practice streak
  const showPracticeStreakNotification = useCallback(async (
    subjectName: string,
    subjectId: string,
    streakCount: number
  ) => {
    if (!user?.id) return;

    // Only show if user hasn't completed predicted exam
    const hasCompleted = await hasCompletedPredictedExam(user.id, subjectId);
    if (hasCompleted) return;

    setNotification({
      isVisible: true,
      type: "practice-streak",
      subjectName,
      streakCount
    });
  }, [user?.id, hasCompletedPredictedExam]);

  // Check if user should be recommended to take predicted exam based on practice performance
  const checkForExamRecommendation = useCallback(async (subjectId: string, subjectName: string) => {
    if (!user?.id) return;

    // Check if they've already completed the predicted exam
    const hasCompleted = await hasCompletedPredictedExam(user.id, subjectId);
    if (hasCompleted) return;

    // Check recent practice streak
    const streak = await getConsecutiveCorrect(user.id, subjectId);
    
    // Check if we've already shown exam recommendation for this subject recently
    const recommendationKey = `exam_recommendation_${user.id}_${subjectId}`;
    const lastShown = localStorage.getItem(recommendationKey);
    if (lastShown && Date.now() - parseInt(lastShown) < 24 * 60 * 60 * 1000) return;

    if (streak >= 4) {
      setNotification({
        isVisible: true,
        type: "exam-recommendation",
        subjectName,
        subjectId,
        streakCount: streak
      });

      // Mark recommendation as shown
      localStorage.setItem(recommendationKey, Date.now().toString());
    }
  }, [user?.id, hasCompletedPredictedExam, getConsecutiveCorrect]);

  // Handle practice question result
  const handlePracticeQuestionResult = useCallback(async (
    subjectId: string,
    subjectName: string,
    isCorrect: boolean,
    marksAwarded: number,
    totalMarks: number
  ) => {
    if (!user?.id) return;

    const isFullyCorrect = marksAwarded === totalMarks;
    const newStreak = await updateConsecutiveCorrect(user.id, subjectId, isFullyCorrect);

    // Show streak notification if they got 4+ correct in a row
    if (isFullyCorrect && newStreak >= 4) {
      await showPracticeStreakNotification(subjectName, subjectId, newStreak);
    }

    // Also check for exam recommendation after a good streak
    if (isFullyCorrect && newStreak >= 4) {
      await checkForExamRecommendation(subjectId, subjectName);
    }
  }, [user?.id, updateConsecutiveCorrect, showPracticeStreakNotification, checkForExamRecommendation]);

  // Handle predicted exam wrong answer
  const handlePredictedExamWrongAnswer = useCallback((
    questionNumber: number,
    topicName: string,
    subjectName: string,
    marksAwarded: number,
    totalMarks: number
  ) => {
    // Show notification if they got less than full marks
    if (marksAwarded < totalMarks) {
      showWrongAnswerNotification(questionNumber, topicName, subjectName);
    }
  }, [showWrongAnswerNotification]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const clearNotification = useCallback(() => {
    setNotification({
      isVisible: false,
      type: null
    });
  }, []);

  
  // Helper function to extract topic from question text
  const extractTopicFromText = useCallback((questionText: string): string => {
    const text = questionText.toLowerCase();
    
    // Geography topics - more comprehensive
    if (text.includes('urbanisation') || text.includes('urban') || text.includes('city') || text.includes('megacity') || text.includes('slum') || text.includes('suburb')) return 'Urbanisation and Settlement';
    if (text.includes('migration') || text.includes('refugee') || text.includes('push factor') || text.includes('pull factor') || text.includes('immigra')) return 'Migration and Population';
    if (text.includes('development') || text.includes('gdp') || text.includes('hdi') || text.includes('poverty') || text.includes('economic') || text.includes('trade')) return 'Development and Inequality';
    if (text.includes('demographic') || text.includes('population') || text.includes('birth rate') || text.includes('death rate') || text.includes('ageing')) return 'Population Dynamics';
    if (text.includes('resource') || text.includes('energy') || text.includes('water') || text.includes('food') || text.includes('sustainability') || text.includes('renewable')) return 'Resource Management';
    if (text.includes('hazard') || text.includes('earthquake') || text.includes('volcano') || text.includes('tsunami') || text.includes('disaster') || text.includes('risk')) return 'Natural Hazards';
    if (text.includes('climate') || text.includes('weather') || text.includes('storm') || text.includes('hurricane') || text.includes('typhoon') || text.includes('monsoon')) return 'Weather and Climate';
    if (text.includes('ecosystem') || text.includes('tropical') || text.includes('desert') || text.includes('rainforest') || text.includes('savanna') || text.includes('biodiversity')) return 'Ecosystems and Biomes';
    if (text.includes('plate') || text.includes('tectonic') || text.includes('fold') || text.includes('fault') || text.includes('crust') || text.includes('mantle')) return 'Plate Tectonics';
    if (text.includes('river') || text.includes('drainage') || text.includes('meander') || text.includes('flood') || text.includes('erosion') || text.includes('deposition')) return 'Rivers and Coasts';
    if (text.includes('coast') || text.includes('beach') || text.includes('cliff') || text.includes('wave') || text.includes('longshore') || text.includes('headland')) return 'Coastal Processes';
    if (text.includes('glacier') || text.includes('ice') || text.includes('periglacial') || text.includes('moraine') || text.includes('fjord')) return 'Glaciation';
    
    // Extract from section/topic hints in question structure
    if (text.includes('section a') || text.includes('physical') || text.includes('landscape')) return 'Physical Geography';
    if (text.includes('section b') || text.includes('human') || text.includes('people')) return 'Human Geography';
    
    return 'Geography Topics';
  }, []);

  // Check for recent exam completion and show weak topic recommendation
  const checkForWeakTopicRecommendation = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('Checking for weak topic recommendations for user:', user.id);
      
      // Get the most recent exam completion from last 24 hours
      const { data: recentExam, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Recent exam query result:', { recentExam, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
        return;
      }
      
      if (!recentExam) {
        console.log('No recent exam found');
        return;
      }

      // Check if we've already shown a notification for this exam
      const notificationKey = `notification_shown_${recentExam.id}`;
      const hasShownNotification = localStorage.getItem(notificationKey);
      console.log('Notification key check:', { notificationKey, hasShownNotification });
      
      if (hasShownNotification) {
        console.log('Notification already shown for exam:', recentExam.id);
        return;
      }

      // Analyze wrong answers to find most frequent weak topic
      const questions = recentExam.questions as any[];
      const answers = recentExam.answers as any[];
      const results = recentExam.results as any[];

      console.log('Analyzing exam data:', { questionsCount: questions?.length, answersCount: answers?.length, resultsCount: results?.length });

      const topicErrors: Record<string, number> = {};

      // Analyze results to find weak topics
      if (results && results.length > 0) {
        results.forEach((result, index) => {
          const question = questions[index];
          if (result && question && result.score < question.marks) {
            // Extract topic with multiple fallback methods
            let topic = question.topic || question.section;
            
            // If no explicit topic, extract from question text
            if (!topic || topic === 'A' || topic.length < 3) {
              topic = extractTopicFromText(question.text || question.question || '');
            }
            
            // Final fallback based on subject
            if (!topic || topic === 'Geography Topics') {
              topic = recentExam.subject_id === 'geography' ? 'Physical Geography Concepts' : 'General Topics';
            }
            
            topicErrors[topic] = (topicErrors[topic] || 0) + 1;
            console.log(`Found error in topic: ${topic}, total errors: ${topicErrors[topic]}`);
          }
        });
      }

      console.log('Topic errors analysis:', topicErrors);

      // Find the topic with most errors
      const weakestTopic = Object.entries(topicErrors).sort((a, b) => b[1] - a[1])[0];

      if (weakestTopic && weakestTopic[1] >= 1) { // Show if 1+ errors (reduced threshold)
        console.log('Showing weak topic notification for:', weakestTopic[0]);
        setNotification({
          isVisible: true,
          type: "weak-topic-recommendation",
          weakestTopic: weakestTopic[0],
          subjectName: recentExam.subject_id,
          subjectId: recentExam.subject_id
        });

        // Mark notification as shown
        localStorage.setItem(notificationKey, 'true');
      } else {
        console.log('No significant weak topics found or insufficient errors');
      }
    } catch (error) {
      console.error('Error checking for weak topic recommendation:', error);
    }
  }, [user?.id, extractTopicFromText]);


  // Clear notification cache for testing
  const clearNotificationCache = useCallback(() => {
    if (!user?.id) return;
    
    // Clear all notification-related localStorage keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('notification_shown_') || key.startsWith('exam_recommendation_'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('Cleared notification cache:', keysToRemove);
  }, [user?.id]);

  return {
    notification,
    handlePracticeQuestionResult,
    handlePredictedExamWrongAnswer,
    checkForWeakTopicRecommendation,
    checkForExamRecommendation,
    clearNotificationCache,
    hideNotification,
    clearNotification
  };
};