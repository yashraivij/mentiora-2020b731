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

  // Check for recent exam completion and show weak topic recommendation
  const checkForWeakTopicRecommendation = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get the most recent exam completion from last 24 hours
      const { data: recentExam, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !recentExam) return;

      // Check if we've already shown a notification for this exam
      const notificationKey = `notification_shown_${recentExam.id}`;
      if (localStorage.getItem(notificationKey)) return;

      // Analyze wrong answers to find most frequent weak topic
      const questions = recentExam.questions as any[];
      const answers = recentExam.answers as any[];
      const results = recentExam.results as any[];

      const topicErrors: Record<string, number> = {};

      questions.forEach((question, index) => {
        const result = results[index];
        if (result && result.marksAwarded < result.totalMarks) {
          const topic = question.topic || 'General';
          topicErrors[topic] = (topicErrors[topic] || 0) + 1;
        }
      });

      // Find the topic with most errors
      const weakestTopic = Object.entries(topicErrors).sort((a, b) => b[1] - a[1])[0];

      if (weakestTopic && weakestTopic[1] >= 2) { // Show if 2+ errors in same topic
        setNotification({
          isVisible: true,
          type: "weak-topic-recommendation",
          weakestTopic: weakestTopic[0],
          subjectName: recentExam.subject_id,
          subjectId: recentExam.subject_id
        });

        // Mark notification as shown
        localStorage.setItem(notificationKey, 'true');
      }
    } catch (error) {
      console.error('Error checking for weak topic recommendation:', error);
    }
  }, [user?.id]);


  return {
    notification,
    handlePracticeQuestionResult,
    handlePredictedExamWrongAnswer,
    checkForWeakTopicRecommendation,
    checkForExamRecommendation,
    hideNotification,
    clearNotification
  };
};