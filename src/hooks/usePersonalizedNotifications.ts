import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface NotificationState {
  isVisible: boolean;
  type: "wrong-answer" | "practice-streak" | null;
  questionNumber?: number;
  topicName?: string;
  subjectName?: string;
  streakCount?: number;
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
  }, [user?.id, updateConsecutiveCorrect, showPracticeStreakNotification]);

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

  return {
    notification,
    handlePracticeQuestionResult,
    handlePredictedExamWrongAnswer,
    hideNotification,
    clearNotification
  };
};