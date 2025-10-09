import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Trophy, Award, BookOpenCheck, X, StickyNote, Star, BookOpen, MessageCircleQuestion, MessageCircle, Send, CheckCircle2, TrendingUp, Target, Zap } from "lucide-react";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { playCelebratorySound } from "@/lib/celebratory-sound";
import { useMPRewards } from "@/hooks/useMPRewards";
import { useSubscription } from "@/hooks/useSubscription";

interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  score: number;
  feedback: {
    modelAnswer: string;
    whyThisGetsMark: string;
    whyYoursDidnt: string;
    specLink: string;
  };
}

// Filter out questions that require diagrams or visual interpretation
const filterNonDiagramQuestions = (questions: Question[]): Question[] => {
  const diagramKeywords = [
    'diagram', 'chart', 'graph', 'scatter', 'plot', 'histogram', 'bar chart',
    'pie chart', 'line graph', 'draw', 'sketch', 'show on', 'using the diagram',
    'from the diagram', 'in the diagram', 'on the graph', 'from the graph',
    'in the chart', 'from the chart', 'interpret the', 'read from',
    'using the scatter', 'scatter diagram', 'box plot', 'stem and leaf',
    'frequency polygon', 'cumulative frequency', 'pictogram'
  ];
  
  return questions.filter(question => {
    const questionText = question.question.toLowerCase();
    return !diagramKeywords.some(keyword => questionText.includes(keyword));
  });
};

// Fisher-Yates shuffle algorithm to randomize questions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Practice = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [showChatAssistant, setShowChatAssistant] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatStage, setChatStage] = useState<'intro' | 'guiding' | 'struggling' | 'answer_check' | 'final'>('intro');
  const [hintCount, setHintCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Grade animation states
  const [oldGrade, setOldGrade] = useState<string | null>(null);
  const [newGrade, setNewGrade] = useState<string | null>(null);
  const [showGradeAnimation, setShowGradeAnimation] = useState(false);
  
  const {
    notification,
    handlePracticeQuestionResult,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

  const { showMPReward } = useMPRewards();

  const subject = curriculum.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Save session state to localStorage
  const saveSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionState = {
      currentQuestionIndex,
      userAnswer,
      attempts,
      showFeedback,
      shuffledQuestions: shuffledQuestions.map(q => q.id), // Only save question IDs
      sessionStartTime,
      lastSaved: new Date().toISOString()
    };
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    localStorage.setItem(sessionKey, JSON.stringify(sessionState));
  };

  // Load session state from localStorage
  const loadSessionState = () => {
    if (!user?.id || !subjectId || !topicId || !topic) return false;
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    const savedState = localStorage.getItem(sessionKey);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
        // Restore shuffled questions order and filter out diagram questions
        const restoredQuestions = state.shuffledQuestions
          .map((id: string) => topic.questions?.find(q => q.id === id))
          .filter((q: Question | undefined): q is Question => q !== undefined);
        const filteredRestoredQuestions = filterNonDiagramQuestions(restoredQuestions);
        
        if (filteredRestoredQuestions.length > 0) {
          setShuffledQuestions(filteredRestoredQuestions);
          setCurrentQuestionIndex(state.currentQuestionIndex || 0);
          setUserAnswer(state.userAnswer || "");
          setAttempts(state.attempts || []);
          setShowFeedback(state.showFeedback || false);
          setSessionStartTime(state.sessionStartTime || Date.now());
          
          return true;
        }
      } catch (error) {
        console.error('Error loading session state:', error);
      }
    }
    
    return false;
  };

  // Clear session state
  const clearSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    localStorage.removeItem(sessionKey);
  };

  useEffect(() => {
    // Record activity when user visits practice page
    const recordVisit = async () => {
      if (user?.id) {
        try {
          await supabase
            .from('user_activities')
            .insert({
              user_id: user.id,
              activity_type: 'practice_visit'
            });
        } catch (error) {
          console.error('Error recording practice visit:', error);
        }
      }
    };
    
    recordVisit();
    if (!subject || !topic) {
      navigate('/dashboard');
      return;
    }
    
    // Debug logging for Macbeth specifically
    if (topicId === 'macbeth') {
      console.log('DEBUG: Macbeth topic data:', topic);
      console.log('DEBUG: Raw questions count:', topic.questions?.length || 0);
      console.log('DEBUG: All questions:', topic.questions?.map(q => q.id) || []);
    }
    
    // Try to load existing session first
    const sessionRestored = loadSessionState();
    
    // Only shuffle questions if no session was restored
    if (!sessionRestored) {
      const filteredQuestions = filterNonDiagramQuestions(topic.questions || []);
      
      // More debug logging for Macbeth
      if (topicId === 'macbeth') {
        console.log('DEBUG: Filtered questions count:', filteredQuestions.length);
        console.log('DEBUG: Filtered questions:', filteredQuestions.map(q => q.id));
      }
      
      const shuffled = shuffleArray(filteredQuestions);
      
      if (topicId === 'macbeth') {
        console.log('DEBUG: Shuffled questions count:', shuffled.length);
        console.log('DEBUG: Final shuffled questions:', shuffled.map(q => q.id));
      }
      
      setShuffledQuestions(shuffled);
    }
  }, [subject, topic, navigate, topicId, user?.id]);

  // Save state whenever important values change
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      saveSessionState();
    }
  }, [currentQuestionIndex, userAnswer, attempts, showFeedback, shuffledQuestions]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Fetch and calculate predicted grade change when session completes
  useEffect(() => {
    if (!sessionComplete || !user?.id || !subjectId) return;
    
    const fetchGradeData = async () => {
      const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
      const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
      const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
      
      // Fetch current subject performance
      const { data: perfData } = await supabase
        .from('subject_performance')
        .select('accuracy_rate')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .single();
      
      if (perfData?.accuracy_rate) {
        // Calculate old grade from existing accuracy
        const currentAccuracy = Number(perfData.accuracy_rate) || 0;
        let oldCalculatedGrade = 'U';
        if (currentAccuracy >= 90) oldCalculatedGrade = 'A*';
        else if (currentAccuracy >= 80) oldCalculatedGrade = 'A';
        else if (currentAccuracy >= 70) oldCalculatedGrade = 'B';
        else if (currentAccuracy >= 60) oldCalculatedGrade = 'C';
        else if (currentAccuracy >= 50) oldCalculatedGrade = 'D';
        else if (currentAccuracy >= 40) oldCalculatedGrade = 'E';
        
        setOldGrade(oldCalculatedGrade);
        
        // Calculate new predicted grade based on session performance
        const sessionWeight = 0.15; // This session contributes 15% to overall
        const newAccuracy = (currentAccuracy * (1 - sessionWeight)) + (averagePercentage * sessionWeight);
        
        // Map accuracy to grade
        let calculatedGrade = 'U';
        if (newAccuracy >= 90) calculatedGrade = 'A*';
        else if (newAccuracy >= 80) calculatedGrade = 'A';
        else if (newAccuracy >= 70) calculatedGrade = 'B';
        else if (newAccuracy >= 60) calculatedGrade = 'C';
        else if (newAccuracy >= 50) calculatedGrade = 'D';
        else if (newAccuracy >= 40) calculatedGrade = 'E';
        
        setNewGrade(calculatedGrade);
        
        // Trigger animation after a short delay
        setTimeout(() => setShowGradeAnimation(true), 500);
      } else {
        // First session - show new grade
        let calculatedGrade = 'U';
        if (averagePercentage >= 90) calculatedGrade = 'A*';
        else if (averagePercentage >= 80) calculatedGrade = 'A';
        else if (averagePercentage >= 70) calculatedGrade = 'B';
        else if (averagePercentage >= 60) calculatedGrade = 'C';
        else if (averagePercentage >= 50) calculatedGrade = 'D';
        else if (averagePercentage >= 40) calculatedGrade = 'E';
        
        setNewGrade(calculatedGrade);
        setTimeout(() => setShowGradeAnimation(true), 500);
      }
    };
    
    fetchGradeData();
  }, [sessionComplete, user?.id, subjectId, shuffledQuestions, attempts]);

  const markAnswerWithSmart = async (question: Question, answer: string) => {
    try {
      console.log('Calling Smart marking function with:', { 
        question: question.question, 
        answer: answer.substring(0, 100) + '...' 
      });

      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.question,
          userAnswer: answer,
          modelAnswer: question.modelAnswer,
          markingCriteria: question.markingCriteria,
          totalMarks: question.marks,
          subject: subjectId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Smart marking result:', data);

      return {
        marksAwarded: data.marksAwarded || 0,
        feedback: data.feedback || "No feedback available",
        assessment: data.assessment || "Needs Review"
      };

    } catch (error) {
      console.error('Error calling Smart marking function:', error);
      toast.error("Failed to mark answer with Smart system. Please try again.");
      
      // Fallback to basic marking - only give marks for substantial answers
      const isSubstantialAnswer = answer.trim().length >= 3 && 
        answer.trim().split(/\s+/).length >= 1 && 
        /[a-zA-Z]/.test(answer.trim());
      
      return {
        marksAwarded: isSubstantialAnswer ? Math.round(question.marks * 0.3) : 0,
        feedback: "Good effort! Your answer shows you're thinking about this topic. While our Smart teacher is taking a quick break, I want to encourage you to keep practicing - every answer helps you learn and grow!",
        assessment: "Keep Going!"
      };
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    
    // Record practice activity
    if (user?.id) {
      try {
        await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: 'question_answered'
          });
      } catch (error) {
        console.error('Error recording activity:', error);
      }
    }
    
    try {
      console.log('Starting to mark answer...');
      
      const markingResult = await markAnswerWithSmart(currentQuestion, userAnswer);
      
      const feedback = {
        modelAnswer: currentQuestion.modelAnswer,
        whyThisGetsMark: currentQuestion.markingCriteria.breakdown.join('\n'),
        whyYoursDidnt: markingResult.feedback,
        specLink: currentQuestion.specReference
      };

      const attempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        userAnswer,
        score: markingResult.marksAwarded,
        feedback
      };
      
      setAttempts([...attempts, attempt]);
      setShowFeedback(true);
      
      // Play celebratory sound if user got marks (but not if they got zero)
      if (markingResult.marksAwarded > 0) {
        playCelebratorySound();
      }
      
      // Generate notebook notes if marks were lost
      const marksLost = currentQuestion.marks - markingResult.marksAwarded;
      if (marksLost > 0 && user?.id) {
        console.log('Generating notebook notes for lost marks:', marksLost);
        try {
          await NotebookGenerator.generateAndSaveNotes(
            user.id,
            currentQuestion,
            userAnswer,
            marksLost,
            subjectId || '',
            topicId || ''
          );
        } catch (error) {
          console.error('Error generating notebook notes:', error);
        }
      }

      // Handle personalized notifications for practice results
      if (user?.id && subjectId && subject?.name) {
        await handlePracticeQuestionResult(
          subjectId,
          subject.name,
          markingResult.marksAwarded > 0,
          markingResult.marksAwarded,
          currentQuestion.marks
        );
      }
      
    } catch (error) {
      console.error('Error marking answer:', error);
      toast.error("Error processing your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      const nextQuestion = shuffledQuestions[currentQuestionIndex + 1];
      const nextAttempts = attempts.filter(a => a.questionId === nextQuestion.id);
      const nextAttempt = nextAttempts.length > 0 ? nextAttempts[nextAttempts.length - 1] : null;
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Restore the saved answer if it exists
      setUserAnswer(nextAttempt?.userAnswer || "");
      setShowFeedback(nextAttempt ? true : false);
      setChatMessages([]);
      setHintCount(0);
      setChatStage('intro');
    } else {
      await finishSession();
    }
  };

  // Send chat message
  const sendChatMessage = async (message: string) => {
    if (!message.trim() || isChatLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      // If this is the first message, use 'intro' stage, otherwise determine stage
      let currentStage = chatStage;
      if (chatMessages.length === 0) {
        currentStage = 'intro';
      } else if (hintCount >= 3 && chatStage !== 'final') {
        currentStage = 'struggling';
      } else if (chatStage === 'intro') {
        currentStage = 'guiding';
      }

      const conversation = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          question: currentQuestion.question,
          studentAnswer: message,
          subject: subjectId,
          conversation,
          stage: currentStage
        }
      });

      if (error) throw error;

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.response
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setChatStage(currentStage);
      setHintCount(prev => prev + 1);

      if (hintCount >= 4 && currentStage !== 'final') {
        setChatStage('final');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const finishSession = async () => {
    console.log('🏁 finishSession START');
    console.log('User:', user);
    console.log('Subject ID:', subjectId);
    console.log('Topic ID:', topicId);
    console.log('Attempts:', attempts);
    
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    console.log('Session stats:', { totalMarks, marksEarned, averagePercentage, attemptsCount: attempts.length });
    
    // DON'T clear session state yet - need user data for saving
    // clearSessionState();
    
    // Handle MP rewards for practice completion server-side
    if (user?.id && subjectId && topicId) {
      try {
        const { MPPointsSystemClient } = await import('@/lib/mpPointsSystemClient');
        const result = await MPPointsSystemClient.awardPracticeCompletion(user.id, subjectId, topicId, marksEarned, totalMarks);
        
        if (result.awarded > 0) {
          console.log(`Practice completion rewards: +${result.awarded} MP`);
          
          // Show toast for practice completion (main reward)
          if (result.breakdown?.practice > 0) {
            showMPReward(result.breakdown.practice, "Quest complete: Complete 1 practice set");
          }
          
          if (result.breakdown) {
            console.log('MP Breakdown:', result.breakdown);
            
            // Show additional toasts for weekly bonuses with proper delays
            if (result.breakdown.weeklyTopics > 0) {
              setTimeout(() => showMPReward(result.breakdown.weeklyTopics, "Weekly quest: Practice 3 different topics"), 500);
            }
            if (result.breakdown.weeklyPractice > 0) {
              setTimeout(() => showMPReward(result.breakdown.weeklyPractice, "Weekly quest: Complete 5 practice sets"), 1000);
            }
            if (result.breakdown.streak > 0) {
              setTimeout(() => showMPReward(result.breakdown.streak, "Epic quest: 7 day practice streak"), 1500);
            }
          }
        }
      } catch (error) {
        console.error('Error awarding practice completion MP:', error);
      }
    }
    
    // Save progress
    const progressKey = `mentiora_progress_${user?.id}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    
    const topicProgressIndex = existingProgress.findIndex(
      (p: any) => p.subjectId === subjectId && p.topicId === topicId
    );
    
    if (topicProgressIndex >= 0) {
      existingProgress[topicProgressIndex].attempts += 1;
      existingProgress[topicProgressIndex].averageScore = Math.round(
        (existingProgress[topicProgressIndex].averageScore + averagePercentage) / 2
      );
      existingProgress[topicProgressIndex].lastAttempt = new Date();
    } else {
      existingProgress.push({
        subjectId,
        topicId,
        attempts: 1,
        averageScore: Math.round(averagePercentage),
        lastAttempt: new Date()
      });
    }
    
    localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    
    // Update subject_performance table in Supabase
    if (user?.id && subjectId) {
      try {
        const subject = curriculum.find(s => s.id === subjectId);
        const examBoard = subjectId.includes('aqa') ? 'AQA' : 
                         subjectId.includes('edexcel') ? 'Edexcel' : 
                         subjectId.includes('ocr') ? 'OCR' : 'AQA';
        
        // Calculate actual time spent in minutes
        const timeSpentMs = Date.now() - sessionStartTime;
        const timeSpentMinutes = Math.max(1, Math.round(timeSpentMs / 60000)); // At least 1 minute
        
        console.log('📊 Saving subject performance:', {
          userId: user.id,
          subjectId,
          examBoard,
          timeSpentMinutes,
          questionsCount: attempts.length
        });
        
        // Get current performance data
        const { data: currentPerf, error: fetchError } = await supabase
          .from('subject_performance')
          .select('*')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .eq('exam_board', examBoard)
          .maybeSingle();
        
        if (fetchError) {
          console.error('Error fetching subject performance:', fetchError);
        } else {
          console.log('Current performance data:', currentPerf);
        }
        
        if (currentPerf) {
          // Update existing record - calculate accuracy based on marks earned, not just perfect answers
          const newTotalQuestions = (currentPerf.total_questions_answered || 0) + attempts.length;
          const totalMarksAvailable = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
          const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
          
          // Get previous marks data
          const prevTotalMarks = (currentPerf.total_questions_answered || 0) * 5; // Assume 5 marks per question average
          const prevMarksEarned = prevTotalMarks * ((currentPerf.accuracy_rate || 0) / 100);
          
          const newTotalMarks = prevTotalMarks + totalMarksAvailable;
          const newMarksEarned = prevMarksEarned + marksEarned;
          const newAccuracy = newTotalMarks > 0 ? (newMarksEarned / newTotalMarks) * 100 : 0;
          const newStudyHours = (currentPerf.study_hours || 0) + (timeSpentMinutes / 60);
          
          console.log('Updating existing record with:', {
            newTotalQuestions,
            totalMarksAvailable,
            marksEarned,
            newAccuracy: newAccuracy.toFixed(1) + '%',
            newStudyHours
          });
          
          const { error: updateError } = await supabase
            .from('subject_performance')
            .update({
              total_questions_answered: newTotalQuestions,
              correct_answers: Math.round(newMarksEarned), // Store total marks earned
              accuracy_rate: newAccuracy,
              study_hours: newStudyHours,
              last_activity_date: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString()
            })
            .eq('id', currentPerf.id);
          
          if (updateError) {
            console.error('❌ Error updating subject performance:', updateError);
          } else {
            console.log('✅ Subject performance updated successfully');
          }
        } else {
          // Insert new record - calculate accuracy based on marks earned
          const totalMarksAvailable = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
          const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
          const accuracy = totalMarksAvailable > 0 ? (marksEarned / totalMarksAvailable) * 100 : 0;
          
          console.log('Inserting new record with:', {
            userId: user.id,
            subjectId,
            examBoard,
            totalQuestions: attempts.length,
            totalMarksAvailable,
            marksEarned,
            accuracy: accuracy.toFixed(1) + '%',
            studyHours: timeSpentMinutes / 60
          });
          
          const { error: insertError } = await supabase
            .from('subject_performance')
            .insert({
              user_id: user.id,
              subject_id: subjectId,
              exam_board: examBoard,
              total_questions_answered: attempts.length,
              correct_answers: marksEarned, // Store total marks earned
              accuracy_rate: accuracy,
              study_hours: timeSpentMinutes / 60,
              last_activity_date: new Date().toISOString().split('T')[0]
            });
          
          if (insertError) {
            console.error('❌ Error inserting subject performance:', insertError);
          } else {
            console.log('✅ Subject performance inserted successfully');
          }
        }
      } catch (error) {
        console.error('Error updating subject performance:', error);
      }
    }
    
    // Handle weak topics
    if (averagePercentage < 85) {
      const weakTopicsKey = `mentiora_weak_topics_${user?.id}`;
      const weakTopics = JSON.parse(localStorage.getItem(weakTopicsKey) || '[]');
      if (!weakTopics.includes(topicId)) {
        weakTopics.push(topicId);
        localStorage.setItem(weakTopicsKey, JSON.stringify(weakTopics));
      }
    } else {
      // Remove from weak topics if score is good
      const weakTopicsKey = `mentiora_weak_topics_${user?.id}`;
      const weakTopics = JSON.parse(localStorage.getItem(weakTopicsKey) || '[]');
      const filteredTopics = weakTopics.filter((id: string) => id !== topicId);
      localStorage.setItem(weakTopicsKey, JSON.stringify(filteredTopics));
      
      // Track topic mastery (85%+ score)
      if (user?.id && subjectId && topicId) {
        try {
          await supabase
            .from('daily_topic_mastery')
            .upsert(
              {
                user_id: user.id,
                subject_id: subjectId,
                topic_id: topicId,
                score: averagePercentage,
                date: new Date().toISOString().split('T')[0]
              },
              {
                onConflict: 'user_id,subject_id,topic_id,date'
              }
            );
          
          // Celebratory feedback removed - keeping it clean
        } catch (error) {
          console.error('Error tracking topic mastery:', error);
        }
      }
    }
    
    setSessionComplete(true);
    
    // Clear session state AFTER setting sessionComplete
    setTimeout(() => clearSessionState(), 100);
    
    console.log('🏁 finishSession END - sessionComplete set to true');
  };

  if (sessionComplete) {
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    // Calculate performance metrics
    const correctAnswers = attempts.filter(a => a.score === shuffledQuestions.find(q => q.id === a.questionId)?.marks).length;
    const partialAnswers = attempts.filter(a => {
      const questionMarks = shuffledQuestions.find(q => q.id === a.questionId)?.marks || 0;
      return a.score > 0 && a.score < questionMarks;
    }).length;
    const incorrectAnswers = attempts.length - correctAnswers - partialAnswers;
    
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
        {/* Header with Medly Blue */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b bg-white dark:bg-gray-900 shadow-sm"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-5">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20"
              >
                <CheckCircle2 className="h-6 w-6 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Session Complete</h1>
                <p className="text-sm text-[#64748B] dark:text-gray-400">{topic?.name}</p>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-4xl mx-auto px-6 md:px-8 py-8 space-y-5">
          {/* Predicted Grade Card with Animation */}
          {(oldGrade || newGrade) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-[0_8px_32px_rgba(14,165,233,0.12)] bg-white dark:bg-gray-900 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(14,165,233,0.18)] transition-shadow duration-300">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 via-transparent to-[#38BDF8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#0F172A] dark:text-white">
                    <motion.div 
                      className="w-9 h-9 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring" }}
                    >
                      <Award className="h-5 w-5 text-[#0EA5E9]" />
                    </motion.div>
                    Predicted Grade Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center justify-center gap-8 py-2">
                    {oldGrade && (
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ 
                          opacity: showGradeAnimation ? 0.5 : 1,
                          scale: showGradeAnimation ? 0.9 : 1 
                        }}
                        transition={{ duration: 0.7 }}
                      >
                        <p className="text-xs text-[#64748B] dark:text-gray-400 mb-2 font-medium">Previous</p>
                        <div className="text-5xl font-black text-[#94A3B8] dark:text-gray-500">
                          {oldGrade}
                        </div>
                      </motion.div>
                    )}
                    
                    {oldGrade && newGrade && (
                      <motion.div
                        animate={{ 
                          scale: showGradeAnimation ? [1, 1.2, 1] : 1,
                          rotate: showGradeAnimation ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      >
                        <TrendingUp className={`h-8 w-8 transition-colors duration-700 ${
                          showGradeAnimation ? 'text-[#0EA5E9]' : 'text-[#CBD5E1]'
                        }`} />
                      </motion.div>
                    )}
                    
                    {newGrade && (
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ 
                          opacity: showGradeAnimation ? 1 : 0.5,
                          scale: showGradeAnimation ? 1.1 : 0.9 
                        }}
                        transition={{ duration: 0.7 }}
                      >
                        <p className="text-xs text-[#64748B] dark:text-gray-400 mb-2 font-medium">
                          {oldGrade ? 'Updated' : 'Current'}
                        </p>
                        <motion.div 
                          className="text-5xl font-black text-[#0EA5E9]"
                          animate={showGradeAnimation ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5, repeat: 2 }}
                        >
                          {newGrade}
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                  
                  {oldGrade && newGrade && oldGrade !== newGrade && showGradeAnimation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 text-center"
                    >
                      <Badge className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white border-0 px-4 py-1.5">
                        🎉 Grade Improved!
                      </Badge>
                    </motion.div>
                  )}
                  
                  {oldGrade && newGrade && oldGrade === newGrade && showGradeAnimation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 text-center"
                    >
                      <Badge className="bg-[#0EA5E9] text-white border-0 px-4 py-1.5">
                        ⭐ Maintaining Excellence
                      </Badge>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Performance Overview Card with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-[0_8px_32px_rgba(14,165,233,0.12)] bg-white dark:bg-gray-900 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(14,165,233,0.18)] transition-shadow duration-300">
              {/* Floating orbs */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 bg-[#0EA5E9]/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#0F172A] dark:text-white">
                    <motion.div 
                      className="w-9 h-9 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring" }}
                    >
                      <Trophy className="h-5 w-5 text-[#0EA5E9]" />
                    </motion.div>
                    Session Performance
                  </CardTitle>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.7 }}
                  >
                    <Badge className={
                      averagePercentage >= 85 
                        ? 'bg-emerald-500 text-white border-0' 
                        : averagePercentage >= 60 
                        ? 'bg-amber-500 text-white border-0' 
                        : 'bg-rose-500 text-white border-0'
                    }>
                      {averagePercentage >= 85 ? "Excellent" : averagePercentage >= 60 ? "Good" : "Keep Practicing"}
                    </Badge>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 relative z-10">
                <div className="text-center py-3">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.8 }}
                    className="text-6xl font-black text-[#0EA5E9] mb-2"
                  >
                    {Math.round(averagePercentage)}%
                  </motion.div>
                  <p className="text-sm text-[#64748B] dark:text-gray-400 font-medium">Overall Score</p>
                </div>

                {/* Score Breakdown with stagger animation */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: marksEarned, label: "Marks Earned" },
                    { value: totalMarks, label: "Total Marks" },
                    { value: attempts.length, label: "Questions" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="text-center p-4 rounded-xl bg-gradient-to-br from-[#0EA5E9]/5 to-[#38BDF8]/5 border border-[#0EA5E9]/10 cursor-default"
                    >
                      <div className="text-3xl font-bold text-[#0EA5E9] mb-1">
                        {item.value}
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Animated Progress Bar */}
                <div className="relative h-2 bg-[#E2E8F0] dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${averagePercentage}%` }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] rounded-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Analytics with stagger */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: CheckCircle2, value: correctAnswers, title: "Fully Correct", desc: "Perfect answers", color: "emerald", delay: 1.2 },
              { icon: TrendingUp, value: partialAnswers, title: "Partially Correct", desc: "Some marks earned", color: "amber", delay: 1.3 },
              { icon: Target, value: incorrectAnswers, title: "Needs Review", desc: "Focus areas", color: "rose", delay: 1.4 }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <Card className="border-0 shadow-md bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 cursor-default">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div 
                          className={`w-11 h-11 rounded-xl bg-${item.color}-500/10 flex items-center justify-center`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                        </motion.div>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: item.delay + 0.2 }}
                          className="text-3xl font-bold text-[#0F172A] dark:text-white"
                        >
                          {item.value}
                        </motion.div>
                      </div>
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{item.title}</p>
                      <p className="text-xs text-[#64748B] dark:text-gray-400 mt-1">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-3 pt-3"
          >
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate('/dashboard', { 
                  state: { 
                    openSubjectDrawer: true, 
                    subjectId: subjectId,
                    drawerTab: 'overview'
                  } 
                })}
                className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-[#0EA5E9]/25 hover:shadow-xl hover:shadow-[#0EA5E9]/30 transition-all"
              >
                <Zap className="h-5 w-5 mr-2" />
                View Insights
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/5 rounded-xl py-6 text-base font-semibold"
              >
                Practice Again
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">No questions available</h2>
          <Button onClick={() => {
            console.log('Back button clicked (no questions)');
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/dashboard';
            }
          }}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Get the most recent attempt for this question (in case of retries)
  const questionAttempts = attempts.filter(a => a.questionId === currentQuestion.id);
  const currentAttempt = questionAttempts.length > 0 ? questionAttempts[questionAttempts.length - 1] : undefined;

  return (
    <div className={`min-h-screen ${isPremium ? '' : 'pt-12'}`} style={{ backgroundColor: '#ffffff' }}>
      {/* Medly-style Top Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Left: Topic name with navigation */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigate('/dashboard', { 
                    state: { 
                      openSubjectDrawer: true, 
                      subjectId: subjectId,
                      drawerTab: 'overview'
                    } 
                  });
                }}
                className="h-9 w-9 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <BookOpen className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <h1 className="text-lg font-semibold text-slate-900 truncate">{topic?.name}</h1>
              </div>
            </div>

            {/* Center: Modern Progress indicator with fox */}
            <div className="flex justify-center md:justify-end">
              <div className="flex items-center gap-2">
                {shuffledQuestions.map((question, index) => {
                  // Find the attempt for this question
                  const questionAttempts = attempts.filter(a => a.questionId === question.id);
                  const attempt = questionAttempts.length > 0 ? questionAttempts[questionAttempts.length - 1] : null;
                  
                  // Determine color based on marks
                  let circleColor = 'bg-gray-200 border-gray-300'; // Not attempted yet
                  const isAttempted = attempt !== null;
                  
                  if (isAttempted) {
                    if (attempt.score === question.marks) {
                      circleColor = 'bg-emerald-500 border-emerald-600 shadow-sm shadow-emerald-500/50'; // Full marks
                    } else if (attempt.score <= question.marks / 2) {
                      circleColor = 'bg-red-500 border-red-600 shadow-sm shadow-red-500/50'; // Half or less
                    } else {
                      circleColor = 'bg-amber-500 border-amber-600 shadow-sm shadow-amber-500/50'; // In between
                    }
                  }
                  
                  // Show fox only on current question if not attempted yet
                  const showFox = index === currentQuestionIndex && !isAttempted;
                  
                  return (
                    <div key={index} className="relative flex items-center">
                      {/* Connecting line */}
                      {index > 0 && (
                        <div className={`absolute right-full w-2 h-0.5 ${
                          attempts.filter(a => a.questionId === shuffledQuestions[index - 1].id).length > 0
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                        }`} />
                      )}
                      
                      {/* Question circle */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            setCurrentQuestionIndex(index);
                            const targetAttempt = attempts.filter(a => a.questionId === question.id)[0];
                            setUserAnswer(targetAttempt?.userAnswer || "");
                            setShowFeedback(targetAttempt ? true : false);
                            setChatMessages([]);
                            setHintCount(0);
                            setChatStage('intro');
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 ${circleColor} ${
                            showFox ? 'ring-2 ring-orange-300 ring-offset-2' : ''
                          }`}
                        >
                          {/* Show checkmark or X for attempted questions */}
                          {isAttempted && (
                            <span className="text-white text-sm font-bold">
                              {attempt.score === question.marks ? '✓' : attempt.score === 0 ? '✗' : '◐'}
                            </span>
                          )}
                          
                          {/* Mentiora logo on current unattempted question */}
                          {showFox && (
                            <img src={mentioraLogo} alt="Current question" className="w-5 h-5 object-contain" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start">
          {/* Left Pane: Question Sheet */}
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                {/* Question reference numbers */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-1">
                    {(currentQuestionIndex + 1).toString().padStart(2, '0').split('').map((digit, idx) => (
                      <span key={idx} className="inline-block border-2 border-slate-900 px-3 py-1 text-base font-mono font-semibold">{digit}</span>
                    ))}
                  </div>
                </div>
                  
                  {/* Question text */}
                  <p className="text-base text-slate-900 leading-relaxed mb-2">
                    {currentQuestion.question}
                  </p>
                </div>
                
                {/* Marks pill */}
                <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                  [{currentQuestion.marks} marks]
                </div>
              </div>
            </div>

            {/* Answer area - large white space */}
            <div className="min-h-[400px] mb-6">
              {!showFeedback ? (
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder=""
                  disabled={showFeedback}
                  className="w-full h-full min-h-[400px] border border-gray-300 focus:ring-0 text-base resize-none p-4 bg-transparent rounded-md"
                />
              ) : (
                <div className="space-y-4">
                  {/* User's answer - color based on performance */}
                  <div className={`p-5 rounded-[20px] shadow-sm border ${
                    currentAttempt.score === currentQuestion.marks
                      ? 'bg-[#E8F8F0] border-[#10B981]/20'
                      : currentAttempt.score <= currentQuestion.marks / 2
                      ? 'bg-[#FEF2F2] border-[#EF4444]/20'
                      : 'bg-[#FEF9C3] border-[#EAB308]/20'
                  }`}>
                    <h4 className={`font-bold mb-3 text-sm uppercase tracking-wide ${
                      currentAttempt.score === currentQuestion.marks
                        ? 'text-[#059669]'
                        : currentAttempt.score <= currentQuestion.marks / 2
                        ? 'text-[#DC2626]'
                        : 'text-[#CA8A04]'
                    }`}>Your Answer</h4>
                    <p className="text-gray-800 font-medium leading-relaxed">{userAnswer}</p>
                  </div>
                  
                  {/* Marks display inline */}
                  {currentAttempt && (
                    <>
                      <div className="flex items-center gap-3 mt-4">
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                          currentAttempt.score === currentQuestion.marks 
                            ? 'bg-emerald-50 border border-emerald-200' 
                            : currentAttempt.score <= currentQuestion.marks / 2
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-amber-50 border border-amber-200'
                        }`}>
                          <span className={`font-bold text-base ${
                            currentAttempt.score === currentQuestion.marks 
                              ? 'text-emerald-600' 
                              : currentAttempt.score <= currentQuestion.marks / 2
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}>{currentAttempt.score}/{currentQuestion.marks}</span>
                          <span className={`text-sm font-medium ${
                            currentAttempt.score === currentQuestion.marks 
                              ? 'text-emerald-600' 
                              : currentAttempt.score <= currentQuestion.marks / 2
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}>marks</span>
                        </div>
                        <button 
                          onClick={() => {
                            setShowFeedback(false);
                            setUserAnswer("");
                          }}
                          className={
                            currentAttempt.score === currentQuestion.marks 
                              ? 'text-emerald-500 hover:text-emerald-600' 
                              : currentAttempt.score <= currentQuestion.marks / 2
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-amber-500 hover:text-amber-600'
                          }
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Model answer */}
                      {currentAttempt.feedback?.modelAnswer && (
                        <div className="mt-6 p-5 bg-[#E8F8F0] rounded-[20px] shadow-sm border border-[#10B981]/20">
                          <h4 className="font-bold text-[#059669] mb-3 text-sm uppercase tracking-wide">Model Answer</h4>
                          <p className="text-gray-800 font-medium leading-relaxed">{currentAttempt.feedback.modelAnswer}</p>
                        </div>
                      )}
                      
                      {/* Teacher feedback */}
                      {currentAttempt.feedback?.whyYoursDidnt && (
                        <div className="mt-6 p-5 bg-[#E8F6FB] rounded-[20px] shadow-sm border border-[#3BAFDA]/20">
                          <h4 className="font-bold text-[#2A9BC7] mb-3 text-sm uppercase tracking-wide">Teacher Feedback</h4>
                          <p className="text-gray-800 font-medium leading-relaxed">{currentAttempt.feedback.whyYoursDidnt}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Bottom action area */}
            {!showFeedback ? (
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !userAnswer.trim()}
                  className="bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white rounded-full px-10 py-6 font-semibold text-base disabled:opacity-50 shadow-[0_6px_24px_rgba(59,175,218,0.25)] hover:shadow-[0_8px_32px_rgba(59,175,218,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? "Marking..." : "Check answer"}
                </Button>
              </div>
            ) : null}
          </div>

          {/* Right Pane: Ask mentiora */}
          <aside className="flex flex-col h-[600px]">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-700">Ask mentiora</h2>
            </div>

            {/* Feedback content or chat messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-auto mb-4 space-y-3">
              {chatMessages.length > 0 ? (
                <>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-[20px] p-4 text-sm font-medium max-w-[80%] ${
                        msg.role === 'user' 
                          ? 'bg-[#3BAFDA] text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-[20px] p-4 text-sm text-gray-800 font-medium">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : showFeedback && currentAttempt ? (
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-[20px] p-4 text-sm text-gray-800 font-medium">
                    You got {currentAttempt.score} out of {currentQuestion.marks} marks for this question.
                  </div>
                  {currentAttempt.score === 0 && (
                    <div className="bg-gray-100 rounded-[20px] p-4 text-sm text-gray-800 font-medium">
                      It looks like you weren&apos;t sure how to answer, and that&apos;s completely okay!
                    </div>
                  )}
                  <div className="bg-gray-100 rounded-[20px] p-4 text-sm text-gray-800 font-medium">
                    Let&apos;s go through it together.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-1" />
                  <div className="space-y-3">
                    <button
                      onClick={() => sendChatMessage("I don't understand this problem")}
                      className="w-full text-left text-sm text-slate-700 hover:text-slate-900 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      I don&apos;t understand this problem
                    </button>
                    <button
                      onClick={() => sendChatMessage("Can you walk me through this step by step")}
                      className="w-full text-left text-sm text-slate-700 hover:text-slate-900 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Can you walk me through this step by step
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reply input at very bottom - always available */}
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && chatMessage.trim()) {
                    e.preventDefault();
                    sendChatMessage(chatMessage);
                  }
                }}
                placeholder="Reply"
                disabled={isChatLoading}
                className="h-11 px-4 flex-1 border border-gray-300 focus:ring-1 focus:ring-[#3BAFDA] rounded-lg text-sm"
              />
              <Button 
                onClick={() => {
                  if (chatMessage.trim()) {
                    sendChatMessage(chatMessage);
                  }
                }}
                disabled={!chatMessage.trim() || isChatLoading}
                className="h-11 w-11 p-0 rounded-full bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white flex items-center justify-center disabled:opacity-50"
              >
                <Send className="h-4 w-4 rotate-45" />
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Fixed bottom bar for marks and next question */}
      {showFeedback && currentAttempt && (
        <div className={`fixed bottom-0 left-0 right-0 border-t shadow-lg z-50 ${
          currentAttempt.score === currentQuestion.marks
            ? 'bg-emerald-50 border-emerald-200'
            : currentAttempt.score <= currentQuestion.marks / 2
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: currentQuestion.marks }).map((_, i) => (
                    <span key={i} className={`text-xl font-bold ${
                      i < currentAttempt.score 
                        ? 'text-emerald-500' 
                        : currentAttempt.score <= currentQuestion.marks / 2
                        ? 'text-red-500'
                        : 'text-gray-300'
                    }`}>
                      {i < currentAttempt.score ? '✓' : '✗'}
                    </span>
                  ))}
                </div>
                <span className={`font-semibold ${
                  currentAttempt.score === currentQuestion.marks 
                    ? 'text-emerald-600' 
                    : currentAttempt.score <= currentQuestion.marks / 2
                    ? 'text-red-600'
                    : 'text-amber-600'
                }`}>Total: {currentAttempt.score}/{currentQuestion.marks} marks</span>
                <button 
                  onClick={() => {
                    setShowFeedback(false);
                    setUserAnswer("");
                  }}
                  className={`flex items-center gap-2 font-medium ml-4 ${
                    currentAttempt.score === currentQuestion.marks 
                      ? 'text-emerald-600 hover:text-emerald-700' 
                      : currentAttempt.score <= currentQuestion.marks / 2
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-amber-600 hover:text-amber-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>
              <Button
                onClick={handleNextQuestion}
                className="bg-[#3BAFDA] hover:bg-[#2A9BC7] text-white rounded-full px-10 py-6 text-base font-medium shadow-md"
              >
                {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Submit' : 'Next question'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Notification */}
      {notification.isVisible && (
        <PersonalizedNotification
          type={notification.type!}
          questionNumber={notification.questionNumber}
          topicName={notification.topicName}
          subjectName={notification.subjectName}
          streakCount={notification.streakCount}
          onClose={clearNotification}
        />
      )}
    </div>
  );
};

export default Practice;