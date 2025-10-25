import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Trophy, Award, BookOpenCheck, X, StickyNote, Star, BookOpen, MessageCircleQuestion, MessageCircle, Send, CheckCircle2, TrendingUp, TrendingDown, Target, Zap, AlertCircle, Brain, ArrowRight, BarChart3, NotebookPen, Clock, Lightbulb, RotateCcw, Flame } from "lucide-react";
import mentioraLogo from "@/assets/mentiora-logo.png";

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
  console.log('🚀 Practice Component START - Component is rendering');
  
  const { subjectId, topicId } = useParams();
  console.log('📍 URL params extracted:', { subjectId, topicId });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  
  // Subject colors mapping
  const subjectColors: { [key: string]: { bg: string } } = {
    "physics": { bg: "bg-blue-400" },
    "physics-edexcel": { bg: "bg-blue-400" },
    "chemistry": { bg: "bg-green-400" },
    "chemistry-edexcel": { bg: "bg-green-400" },
    "biology": { bg: "bg-orange-400" },
    "biology-edexcel": { bg: "bg-orange-400" },
    "biology-aqa-alevel": { bg: "bg-lime-400" },
    "mathematics": { bg: "bg-purple-400" },
    "maths-edexcel": { bg: "bg-purple-400" },
    "maths-aqa-alevel": { bg: "bg-indigo-400" },
    "english-language": { bg: "bg-pink-400" },
    "english-literature": { bg: "bg-rose-400" },
    "geography": { bg: "bg-emerald-400" },
    "geography-paper-2": { bg: "bg-emerald-400" },
    "history": { bg: "bg-amber-400" },
    "religious-studies": { bg: "bg-violet-400" },
    "business-edexcel-igcse": { bg: "bg-teal-400" },
    "computer-science": { bg: "bg-cyan-400" },
    "psychology": { bg: "bg-fuchsia-400" },
  };
  
  // Debug logging at component entry
  console.log('=== Practice Component Rendered ===');
  console.log('URL params:', { subjectId, topicId });
  console.log('Available subjects:', curriculum.map(s => ({ id: s.id, name: s.name })));
  
  // Helper function to check if subject is A-Level
  const isALevel = (subjectId: string | undefined) => {
    return subjectId?.toLowerCase().includes('alevel') || false;
  };

  // Helper function to convert numeric grade to letter grade for A-Level
  const getDisplayGrade = (numericGrade: number, subjectId: string | undefined) => {
    if (!isALevel(subjectId)) {
      return numericGrade.toFixed(1);
    }
    
    // Convert 1-9 scale to A-Level letter grades
    if (numericGrade >= 8.5) return 'A*';
    if (numericGrade >= 7.5) return 'A';
    if (numericGrade >= 6.5) return 'B';
    if (numericGrade >= 5.5) return 'C';
    if (numericGrade >= 4.5) return 'D';
    return 'E';
  };

  // Helper function to get progress bar labels
  const getProgressBarLabels = (subjectId: string | undefined) => {
    if (isALevel(subjectId)) {
      return { min: 'Grade E', max: 'Grade A*' };
    }
    return { min: 'Grade 4.0', max: 'Grade 9.0' };
  };

  // Helper function to calculate progress percentage
  const getProgressPercentage = (grade: number, subjectId: string | undefined) => {
    if (isALevel(subjectId)) {
      // Map 4-9 scale to E-A* (4=E, 9=A*)
      return Math.max(0, ((grade - 4) / 5) * 100);
    }
    return Math.max(0, ((grade - 4) / 5) * 100);
  };

  // Helper function to get progress description
  const getProgressDescription = (grade: number, subjectId: string | undefined) => {
    const percentage = Math.max(0, Math.round(((grade - 4) / 5) * 100));
    if (isALevel(subjectId)) {
      return `Progress: ${percentage}% towards grade A*`;
    }
    return `Progress: ${percentage}% towards grade 9`;
  };
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showChatAssistant, setShowChatAssistant] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatStage, setChatStage] = useState<'intro' | 'guiding' | 'struggling' | 'answer_check' | 'final'>('intro');
  const [hintCount, setHintCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [actualPredictedGrade, setActualPredictedGrade] = useState<number | null>(null);
  const [existingGradeData, setExistingGradeData] = useState<{ grade: string; currentGrade?: string; isFirst: boolean } | null>(null);
  const [savedGradeData, setSavedGradeData] = useState<{ oldGrade: number; newGrade: number; isFirst: boolean } | null>(null);
  const [beforeSessionGrade, setBeforeSessionGrade] = useState<number | null>(null);
  const [isFirstPracticeSession, setIsFirstPracticeSession] = useState<boolean>(false);
  const [showFullMarksReward, setShowFullMarksReward] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
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
  
  // Log subject/topic lookup results
  console.log('Subject lookup:', { found: !!subject, subjectId, subjectName: subject?.name });
  if (subject) {
    console.log('Available topics in subject:', subject.topics.map(t => ({ id: t.id, name: t.name })));
    console.log('Topic lookup:', { found: !!topic, topicId, topicName: topic?.name });
  }

  // Fetch existing grade when session completes
  useEffect(() => {
    const fetchExistingGrade = async () => {
      if (sessionComplete && user?.id && subjectId) {
        const { data } = await supabase
          .from('predicted_exam_completions')
          .select('grade, created_at')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .order('created_at', { ascending: false });
        
        // If there's only 1 record, this IS the first practice (the one just saved)
        // If there are 2+ records, use the second most recent as the "before" grade
        if (data && data.length > 1) {
          setExistingGradeData({ 
            grade: data[1].grade, // Before grade (second most recent)
            currentGrade: data[0].grade, // Current grade (most recent/just saved)
            isFirst: false 
          });
        } else {
          setExistingGradeData({ 
            grade: '0', 
            currentGrade: data && data[0] ? data[0].grade : '0', // First grade saved
            isFirst: true 
          });
        }
      }
    };
    fetchExistingGrade();
  }, [sessionComplete, user?.id, subjectId]);

  // Confetti effect when session completes
  useEffect(() => {
    if (sessionComplete && !showConfetti) {
      setShowConfetti(true);
      
      const createConfetti = () => {
        const colors = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const confettiCount = 50;
        const confettiElements: HTMLDivElement[] = [];

        for (let i = 0; i < confettiCount; i++) {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = Math.random() * 100 + '%';
          confetti.style.top = '-10px';
          confetti.style.opacity = '1';
          confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
          confetti.style.zIndex = '9999';
          confetti.style.pointerEvents = 'none';
          confetti.style.animation = `fall ${2 + Math.random() * 3}s linear forwards`;
          confetti.style.animationDelay = `${Math.random() * 0.5}s`;
          
          document.body.appendChild(confetti);
          confettiElements.push(confetti);
        }

        // Clean up confetti after animation
        setTimeout(() => {
          confettiElements.forEach(el => el.remove());
        }, 6000);
      };

      createConfetti();
    }
  }, [sessionComplete, showConfetti]);

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
    
    console.log('🔍 Practice page loaded:', { subjectId, topicId, hasSubject: !!subject, hasTopic: !!topic });
    
    if (!subject || !topic) {
      console.error('❌ REDIRECT: Subject or topic not found');
      console.error('Looking for subjectId:', subjectId);
      console.error('Looking for topicId:', topicId);
      console.error('Subject found:', !!subject, subject?.name);
      console.error('Topic found:', !!topic);
      if (subject) {
        console.error('Available topics in subject:', subject.topics.map(t => ({ id: t.id, name: t.name })));
      }
      setIsLoadingQuestions(false);
      navigate('/dashboard');
      return;
    }
    
    // Debug logging
    console.log('Topic data:', topic);
    console.log('Raw questions count:', topic.questions?.length || 0);
    console.log('All questions:', topic.questions?.map(q => q.id) || []);
    
    // Try to load existing session first
    const sessionRestored = loadSessionState();
    
    // Only shuffle questions if no session was restored
    if (!sessionRestored) {
      const filteredQuestions = filterNonDiagramQuestions(topic.questions || []);
      
      console.log('Filtered questions count:', filteredQuestions.length);
      console.log('Filtered questions:', filteredQuestions.map(q => q.id));
      
      const shuffled = shuffleArray(filteredQuestions);
      
      console.log('Shuffled questions count:', shuffled.length);
      console.log('Final shuffled questions:', shuffled.map(q => q.id));
      
      setShuffledQuestions(shuffled);
    }
    
    setIsLoadingQuestions(false);
  }, [subject, topic, navigate, topicId, user?.id]);

  // Save state whenever important values change
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      saveSessionState();
    }
  }, [currentQuestionIndex, userAnswer, attempts, showFeedback, shuffledQuestions]);

  // Fetch and store the current predicted grade when practice session starts
  useEffect(() => {
    const fetchCurrentPredictedGrade = async () => {
      if (!user?.id || !subjectId || shuffledQuestions.length === 0 || beforeSessionGrade !== null) {
        return;
      }

      try {
        console.log('🔍 Fetching current predicted grade before practice session starts...');
        
        const { data: existingGrades } = await supabase
          .from('predicted_exam_completions')
          .select('grade')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (existingGrades && existingGrades.length > 0) {
          const currentGrade = parseFloat(existingGrades[0].grade);
          setBeforeSessionGrade(currentGrade);
          setIsFirstPracticeSession(false);
          console.log('✅ Before session grade captured:', currentGrade.toFixed(1));
        } else {
          // First time practicing this subject
          setBeforeSessionGrade(null);
          setIsFirstPracticeSession(true);
          console.log('🆕 First practice session - no previous grade');
        }
      } catch (error) {
        console.error('Error fetching current predicted grade:', error);
      }
    };

    fetchCurrentPredictedGrade();
  }, [user?.id, subjectId, shuffledQuestions.length, beforeSessionGrade]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

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

      // Award 10MP for full marks
      if (markingResult.marksAwarded === currentQuestion.marks && user?.id) {
        try {
          const { data } = await supabase.functions.invoke('award-mp', {
            body: { action: 'full_marks_question', userId: user.id }
          });
          
          if (data?.awarded > 0) {
            setShowFullMarksReward(true);
            setTimeout(() => setShowFullMarksReward(false), 3000);
          }
        } catch (error) {
          console.error('Error awarding full marks MP:', error);
        }
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
    
    // Save progress to both database and localStorage
    const progressKey = `mentiora_progress_${user?.id}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    
    console.log('💾 SAVING SCORE - Before:', {
      subjectId,
      topicId,
      newScore: Math.round(averagePercentage),
      existingProgress: existingProgress.find((p: any) => p.subjectId === subjectId && p.topicId === topicId)
    });
    
    const topicProgressIndex = existingProgress.findIndex(
      (p: any) => p.subjectId === subjectId && p.topicId === topicId
    );
    
    let finalScore = Math.round(averagePercentage);
    let finalAttempts = 1;
    
    if (topicProgressIndex >= 0) {
      const oldScore = existingProgress[topicProgressIndex].averageScore;
      const newScore = Math.round(averagePercentage);
      
      finalAttempts = existingProgress[topicProgressIndex].attempts + 1;
      
      // Only update if new score is better OR if it's a significant attempt (not 0%)
      if (newScore > oldScore) {
        finalScore = newScore;
        existingProgress[topicProgressIndex].averageScore = newScore;
        console.log('✅ Score IMPROVED - updating from', oldScore, 'to', newScore);
      } else if (newScore > 0) {
        // Average with existing score only if new score is not 0
        finalScore = Math.round((oldScore + newScore) / 2);
        existingProgress[topicProgressIndex].averageScore = finalScore;
        console.log('📊 Score AVERAGED - from', oldScore, 'and', newScore, 'to', finalScore);
      } else {
        finalScore = oldScore;
        console.log('⚠️ Score NOT UPDATED - new score is 0%, keeping', oldScore);
      }
      
      existingProgress[topicProgressIndex].attempts = finalAttempts;
      existingProgress[topicProgressIndex].lastAttempt = new Date();
    } else {
      existingProgress.push({
        subjectId,
        topicId,
        attempts: finalAttempts,
        averageScore: finalScore,
        lastAttempt: new Date()
      });
      console.log('🆕 NEW SCORE - created entry with', finalScore + '%');
    }
    
    console.log('💾 SAVING SCORE - After:', {
      saved: existingProgress.find((p: any) => p.subjectId === subjectId && p.topicId === topicId)
    });
    
    // Save to localStorage
    localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    
    // Save to database
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            subject_id: subjectId,
            topic_id: topicId,
            attempts: finalAttempts,
            average_score: finalScore,
            last_attempt: new Date().toISOString()
          }, {
            onConflict: 'user_id,subject_id,topic_id'
          });
        
        if (error) {
          console.error('Error saving progress to database:', error);
        } else {
          console.log('✅ Progress saved to database');
        }
      } catch (error) {
        console.error('Error upserting progress:', error);
      }
    }
    
    // Fetch actual predicted grade from predicted_exam_completions (same as Dashboard)
    let fetchedPredictedGrade: number | null = null;
    if (user?.id && subjectId) {
      try {
        const subject = curriculum.find(s => s.id === subjectId);
        const subjectName = subject?.name || '';
        
        console.log('🔍 Fetching predicted grade for:', { subjectId, subjectName, userId: user.id });
        
        // Query predicted_exam_completions to get calculated predicted grade (same as Dashboard)
        const { data: predictedGradeData, error: gradeError } = await supabase
          .from('predicted_exam_completions')
          .select('grade, subject_id')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
        
        if (gradeError) {
          console.error('❌ Error fetching predicted grades:', gradeError);
        } else if (predictedGradeData && predictedGradeData.length > 0) {
          console.log('📊 All predicted grades:', predictedGradeData);
          
          // Find the matching subject - try matching by subject_id or subject name
          const matchingGrade = predictedGradeData.find(pg => 
            pg.subject_id === subjectName || 
            pg.subject_id?.toLowerCase() === subjectName.toLowerCase() ||
            pg.subject_id === subjectId
          );
          
          if (matchingGrade?.grade) {
            const grade = typeof matchingGrade.grade === 'string' 
              ? parseFloat(matchingGrade.grade) 
              : matchingGrade.grade;
            if (!isNaN(grade) && grade > 0) {
              console.log('✅ Found predicted grade:', grade, 'for subject:', matchingGrade.subject_id);
              fetchedPredictedGrade = grade;
              setActualPredictedGrade(grade);
            }
          } else {
            console.warn('⚠️ No matching predicted grade found for:', subjectName, 'or', subjectId);
          }
        } else {
          console.warn('⚠️ No predicted exam data found');
        }
      } catch (error) {
        console.error('❌ Error in fetch logic:', error);
      }
    }
    
    // Store the fetched grade for use in the completion screen
    console.log('💾 Storing fetched grade:', fetchedPredictedGrade);
    (window as any).__lastFetchedPredictedGrade = fetchedPredictedGrade;
    
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
    
      // Save predicted grade to database
    if (user?.id && subjectId) {
      try {
        // Convert current percentage to grade
        const currentTopicGrade = percentageToGrade(averagePercentage);
        
        // Use the before session grade that was captured when questions were generated
        const oldGrade = beforeSessionGrade !== null ? beforeSessionGrade : 0;
        const isFirstSession = beforeSessionGrade === null || beforeSessionGrade === 0;
        
        let newPredictedGrade: number;
        
        if (isFirstSession) {
          // First time practicing this subject
          newPredictedGrade = currentTopicGrade;
          console.log('🆕 First predicted grade:', newPredictedGrade.toFixed(1));
        } else {
          // Update predicted grade: 50% previous grade + 50% current performance
          newPredictedGrade = (oldGrade * 0.5) + (currentTopicGrade * 0.5);
          
          console.log('📊 Updating predicted grade:', {
            beforeGrade: oldGrade.toFixed(1),
            currentSessionGrade: currentTopicGrade.toFixed(1),
            nowGrade: newPredictedGrade.toFixed(1)
          });
        }
        
        // Store grade data for display (before database insert)
        setSavedGradeData({
          oldGrade: oldGrade,
          newGrade: newPredictedGrade,
          isFirst: isFirstSession
        });
        
        console.log('💾 Session Complete - Grade progression:', {
          beforeGrade: isFirstSession ? 'N/A (first session)' : oldGrade.toFixed(1),
          nowGrade: newPredictedGrade.toFixed(1),
          improvement: isFirstSession ? `+${newPredictedGrade.toFixed(1)} (baseline)` : `${(newPredictedGrade - oldGrade) >= 0 ? '+' : ''}${(newPredictedGrade - oldGrade).toFixed(1)}`,
          willBeUsedAcrossApp: 'Yes - until next practice session'
        });
        
        // Insert new predicted grade record with explicit completed_at timestamp
        const completionTimestamp = new Date().toISOString();
        const insertData = {
          user_id: user.id,
          subject_id: subjectId,
          grade: newPredictedGrade.toFixed(1),
          percentage: averagePercentage,
          total_marks: shuffledQuestions.reduce((sum, q) => sum + q.marks, 0),
          achieved_marks: attempts.reduce((sum, a) => sum + a.score, 0),
          questions: [],
          answers: [],
          results: {},
          exam_date: new Date().toISOString().split('T')[0],
          completed_at: completionTimestamp,
          time_taken_seconds: Math.floor((Date.now() - sessionStartTime) / 1000)
        };
        
        console.log('💾 Inserting grade data:', insertData);
        
        const { error: gradeError, data: insertedData } = await supabase
          .from('predicted_exam_completions')
          .insert(insertData)
          .select();
        
        if (gradeError) {
          console.error('❌ Error saving predicted grade:', gradeError);
        } else {
          console.log('✅ Predicted grade saved successfully:', insertedData);
        }
      } catch (error) {
        console.error('❌ Error saving predicted grade (catch):', error);
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

  // Helper function to convert percentage to GCSE grade
  const percentageToGrade = (percentage: number): number => {
    if (percentage >= 90) return 9.0;
    if (percentage >= 80) return 8.0 + ((percentage - 80) / 10);
    if (percentage >= 70) return 7.0 + ((percentage - 70) / 10);
    if (percentage >= 60) return 6.0 + ((percentage - 60) / 10);
    if (percentage >= 50) return 5.0 + ((percentage - 50) / 10);
    if (percentage >= 40) return 4.0 + ((percentage - 40) / 10);
    if (percentage >= 30) return 3.0 + ((percentage - 30) / 10);
    if (percentage >= 20) return 2.0 + ((percentage - 20) / 10);
    if (percentage >= 10) return 1.0 + ((percentage - 10) / 10);
    return percentage / 10; // 0-9% = 0.0-0.9 (U grade)
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
    
    // Calculate time metrics
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 60000);
    const avgTimePerQuestion = Math.floor((Date.now() - sessionStartTime) / attempts.length / 1000);
    
    // Use the saved grade data calculated during the save operation (not from database fetch)
    if (!savedGradeData) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    const isFirstPractice = savedGradeData.isFirst;
    const oldPredictedGrade = savedGradeData.oldGrade;
    const newPredictedGrade = savedGradeData.newGrade;
    const gradeImprovement = isFirstPractice ? newPredictedGrade : newPredictedGrade - oldPredictedGrade;
    
    console.log('📊 SESSION COMPLETE - Displaying to user:', {
      isFirstPractice,
      beforeGradeShown: isFirstPractice ? 'N/A (first session)' : oldPredictedGrade.toFixed(1),
      nowGradeShown: newPredictedGrade.toFixed(1),
      improvementShown: gradeImprovement.toFixed(1),
      currentSessionScore: averagePercentage.toFixed(1) + '%',
      explanation: isFirstPractice 
        ? 'First practice - establishing baseline predicted grade'
        : `Before grade (${oldPredictedGrade.toFixed(1)}) was the predicted grade before this session. Now grade (${newPredictedGrade.toFixed(1)}) is the updated predicted grade after this session. This Now grade will be used everywhere in the app until the next session.`
    });
    
    // Percentile rank
    const percentileRank = Math.min(Math.round(averagePercentage * 0.9), 95);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          
          {/* Hero Header */}
          <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0ms' }}>
            <h1 className="text-3xl font-bold text-foreground">
              Section Complete!
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              You've just finished <span className="font-semibold text-cyan-600 dark:text-cyan-400">{topic?.name}</span> — here's how you did.
            </p>
          </div>

          {/* Performance Summary Card - Overall Score Only */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Card className="bg-card rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(195,69%,54%)]/10 to-[hsl(195,69%,54%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Overall Score
                    </p>
                    <p className="text-5xl font-bold text-[hsl(195,69%,54%)]">
                      {Math.round(averagePercentage)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {correctAnswers} out of {shuffledQuestions.length} questions correct
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predicted Grade Improvement - Premium Card */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Card className="bg-gradient-to-br from-card via-[hsl(195,69%,54%)]/10 to-[hsl(195,69%,54%)]/5 rounded-3xl border-0 shadow-2xl overflow-hidden relative">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[hsl(195,69%,54%)]/20 to-[hsl(195,60%,60%)]/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[hsl(195,60%,60%)]/20 to-[hsl(195,69%,54%)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              <CardHeader className="border-b border-border/50 relative pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(195,69%,54%)]/10 border border-[hsl(195,69%,54%)]/20">
                    <TrendingUp className="h-3 w-3 text-[hsl(195,69%,54%)]" />
                    <span className="text-xs font-semibold text-[hsl(195,69%,54%)]">Grade Improvement</span>
                  </div>
                  <CardTitle className="text-2xl font-bold">Predicted Grade</CardTitle>
                  <p className="text-sm text-muted-foreground">Based on your recent performance</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 relative">
                <div className="space-y-6">
                  {/* Grade Comparison */}
                  {isFirstPractice ? (
                    /* First Practice - Show only current grade */
                    <div className="flex items-center justify-center">
                      <div className="text-center space-y-2 group">
                        <Badge className="mb-1 bg-[hsl(195,69%,54%)] text-white border-0 text-xs">
                          Your Predicted Grade
                        </Badge>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(195,69%,54%)]/30 to-[hsl(195,60%,60%)]/30 blur-2xl rounded-full animate-pulse group-hover:scale-110 transition-transform duration-500" />
                          <div className="relative text-6xl font-bold text-[hsl(195,69%,54%)]">
                            {getDisplayGrade(newPredictedGrade, subjectId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Subsequent Practices - Show before/after comparison */
                    <div className="flex items-center justify-center gap-12">
                      <div className="text-center space-y-2 group">
                        <Badge variant="outline" className="mb-1 border-[hsl(195,69%,54%)]/30 text-xs">
                          Before
                        </Badge>
                        <div className="relative">
                          <div className="absolute inset-0 bg-[hsl(195,69%,54%)]/20 blur-2xl rounded-full group-hover:scale-110 transition-transform duration-500" />
                          <div className="relative text-5xl font-bold text-[hsl(195,69%,54%)]">
                            {getDisplayGrade(oldPredictedGrade, subjectId)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className={`px-5 py-2 rounded-2xl ${gradeImprovement >= 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30' : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/30'} text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300`}>
                          {gradeImprovement >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{gradeImprovement >= 0 ? '+' : ''}{gradeImprovement.toFixed(1)}</span>
                        </div>
                        <ArrowRight className="h-6 w-6 text-[hsl(195,69%,54%)] animate-pulse" />
                      </div>

                      <div className="text-center space-y-2 group">
                        <Badge className="mb-1 bg-[hsl(195,69%,54%)] text-white border-0 text-xs">
                          Now
                        </Badge>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(195,69%,54%)]/30 to-[hsl(195,60%,60%)]/30 blur-2xl rounded-full animate-pulse group-hover:scale-110 transition-transform duration-500" />
                          <div className="relative text-5xl font-bold text-[hsl(195,69%,54%)]">
                            {getDisplayGrade(newPredictedGrade, subjectId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Animated Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>{getProgressBarLabels(subjectId).min}</span>
                      <span>{getProgressBarLabels(subjectId).max}</span>
                    </div>
                    <div className="relative h-4 bg-muted rounded-full overflow-hidden shadow-inner">
                      {/* Old grade position - only show if not first practice */}
                      {!isFirstPractice && (
                        <div 
                          className="absolute top-0 bottom-0 bg-[hsl(195,69%,54%)]/30 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: '0%',
                            animation: 'fillProgress 1s ease-out 600ms forwards',
                            '--target-width': `${Math.max(0, ((oldPredictedGrade - 4) / 5) * 100)}%`
                          } as React.CSSProperties}
                        />
                      )}
                      {/* New grade position - animated bright fill */}
                      <div 
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-[hsl(195,69%,54%)] via-[hsl(195,60%,60%)] to-[hsl(195,69%,54%)] rounded-full transition-all duration-1500 ease-out shadow-lg shadow-[hsl(195,69%,54%)]/50"
                        style={{ 
                          width: '0%',
                          backgroundSize: '200% 100%',
                          animation: isFirstPractice 
                            ? 'fillProgress 1.5s ease-out 600ms forwards, shimmer 3s infinite 2100ms'
                            : 'fillProgress 1.5s ease-out 1200ms forwards, shimmer 3s infinite 2700ms',
                          '--target-width': `${Math.max(0, ((newPredictedGrade - 4) / 5) * 100)}%`
                        } as React.CSSProperties}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0" style={{ animation: isFirstPractice ? 'slideAndFade 2s infinite 2100ms' : 'slideAndFade 2s infinite 2700ms' }} />
                      </div>
                    </div>
                    <div className="text-center pt-1">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-[hsl(195,69%,54%)]">{Math.max(0, Math.round(((newPredictedGrade - 4) / 5) * 100))}%</span> {getProgressDescription(newPredictedGrade, subjectId).replace('Progress: ', '').replace(`${Math.max(0, Math.round(((newPredictedGrade - 4) / 5) * 100))}% `, '')}
                      </p>
                    </div>
                  </div>

                  {/* Percentile Badge */}
                  <div className="flex justify-center pt-2">
                    <div className="px-5 py-2 rounded-2xl bg-[hsl(195,69%,54%)]/5 border border-[hsl(195,69%,54%)]/20">
                      <p className="text-sm text-center">
                        <span className="text-xl">👏</span> You scored better than <span className="font-bold text-[hsl(195,69%,54%)]">{percentileRank}%</span> of students this week
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <div className="space-y-5 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h2 className="text-2xl font-bold text-foreground">{isFirstPractice ? 'Your Performance' : 'Performance Comparison'}</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Predicted Grade */}
              <Card className="bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(195,69%,54%)]/5 to-[hsl(195,60%,60%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Predicted Grade
                      </p>
                      <span className="text-3xl font-bold text-[hsl(195,69%,54%)]">
                        {getDisplayGrade(newPredictedGrade, subjectId)}
                      </span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 bg-[hsl(195,69%,54%)] rounded-full transition-all duration-1500"
                        style={{ width: `${(newPredictedGrade / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target Grade */}
              <Card className="bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Target Grade
                      </p>
                      <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        9
                      </span>
                    </div>
                    <div className="relative h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1500"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
            {/* Strong Areas */}
            <Card className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="border-b border-emerald-200/50 dark:border-emerald-800/50 pb-4 relative">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">Strong Performance</div>
                    <div className="text-xs font-normal text-muted-foreground mt-0.5">Questions you answered well</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative">
                <div className="space-y-3">
                  {correctAnswers > 0 ? (
                    <>
                      {attempts
                        .filter(attempt => {
                          const question = shuffledQuestions.find(q => q.id === attempt.questionId);
                          return question && (attempt.score / question.marks) >= 0.7;
                        })
                        .slice(0, 3)
                        .map((attempt, index) => {
                          const question = shuffledQuestions.find(q => q.id === attempt.questionId);
                          if (!question) return null;
                          const percentage = (attempt.score / question.marks) * 100;
                          
                          return (
                            <div key={attempt.questionId} className="group/item">
                              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-emerald-200/30 dark:border-emerald-800/30 hover:border-emerald-400/50 dark:hover:border-emerald-600/50 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all duration-300 hover:shadow-md">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                                  <span className="text-white font-bold text-sm">{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                                    {question.question.length > 80 
                                      ? question.question.substring(0, 80) + '...' 
                                      : question.question}
                                  </p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0 text-xs px-2 py-0.5">
                                      {attempt.score}/{question.marks} marks
                                    </Badge>
                                    <Badge className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-xs px-2 py-0.5">
                                      {Math.round(percentage)}% correct
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {correctAnswers > 3 && (
                        <div className="text-center pt-2">
                          <Badge variant="outline" className="text-xs text-muted-foreground border-emerald-300/50 dark:border-emerald-700/50">
                            +{correctAnswers - 3} more correct {correctAnswers - 3 === 1 ? 'answer' : 'answers'}
                          </Badge>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-3">
                        <Target className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Complete more questions to identify strengths
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="border-b border-amber-200/50 dark:border-amber-800/50 pb-4 relative">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">Focus Areas</div>
                    <div className="text-xs font-normal text-muted-foreground mt-0.5">Questions that need review</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative">
                <div className="space-y-4">
                  <div className="space-y-3">
                    {(attempts.length - correctAnswers) > 0 ? (
                      <>
                        {attempts
                          .filter(attempt => {
                            const question = shuffledQuestions.find(q => q.id === attempt.questionId);
                            return question && (attempt.score / question.marks) < 0.7;
                          })
                          .slice(0, 3)
                          .map((attempt, index) => {
                            const question = shuffledQuestions.find(q => q.id === attempt.questionId);
                            if (!question) return null;
                            const percentage = (attempt.score / question.marks) * 100;
                            const marksLost = question.marks - attempt.score;
                            
                            return (
                              <div key={attempt.questionId} className="group/item">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-amber-200/30 dark:border-amber-800/30 hover:border-amber-400/50 dark:hover:border-amber-600/50 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 transition-all duration-300 hover:shadow-md">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                                    <span className="text-white font-bold text-sm">{index + 1}</span>
                                  </div>
                                  <div className="flex-1 min-w-0 space-y-1.5">
                                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                                      {question.question.length > 80 
                                        ? question.question.substring(0, 80) + '...' 
                                        : question.question}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-0 text-xs px-2 py-0.5">
                                        {attempt.score}/{question.marks} marks
                                      </Badge>
                                      <Badge className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-0 text-xs px-2 py-0.5">
                                        -{marksLost} {marksLost === 1 ? 'mark' : 'marks'} lost
                                      </Badge>
                                      {percentage > 0 && percentage < 70 && (
                                        <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-0 text-xs px-2 py-0.5">
                                          {Math.round(percentage)}% partial
                                        </Badge>
                                      )}
                                    </div>
                                    {attempt.feedback.whyYoursDidnt && (
                                      <p className="text-xs text-muted-foreground line-clamp-2 pt-1 italic">
                                        "{attempt.feedback.whyYoursDidnt.length > 100 
                                          ? attempt.feedback.whyYoursDidnt.substring(0, 100) + '...' 
                                          : attempt.feedback.whyYoursDidnt}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        {(attempts.length - correctAnswers) > 3 && (
                          <div className="text-center pt-2">
                            <Badge variant="outline" className="text-xs text-muted-foreground border-amber-300/50 dark:border-amber-700/50">
                              +{(attempts.length - correctAnswers) - 3} more to review
                            </Badge>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100/50 dark:bg-emerald-900/20 mb-3">
                          <Trophy className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          Perfect performance! 🎉
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          No areas need review
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA to Smart Revision Notebook */}
                  {(attempts.length - correctAnswers) > 0 && (
                    <div className="pt-3 border-t border-amber-200/30 dark:border-amber-800/30">
                      <Button
                        onClick={() => navigate('/dashboard', { state: { openSubjectDrawer: true, subjectId, drawerTab: 'notes' } })}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group/btn"
                      >
                        <NotebookPen className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Review in Smart Notebook
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              onClick={() => {
                setSessionComplete(false);
                setCurrentQuestionIndex(0);
                setAttempts([]);
                setShowFeedback(false);
                localStorage.removeItem(`practice-session-${subjectId}-${topicId}`);
              }}
              variant="outline"
              size="lg"
              className="px-10 py-6 rounded-xl text-base font-semibold border-2 hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Practice Again
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="px-10 py-6 rounded-xl text-base font-semibold bg-[hsl(195,69%,54%)] hover:bg-[hsl(195,69%,48%)] text-white shadow-lg shadow-[hsl(195,69%,54%)]/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Continue to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Footer Message */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50">
              <Star className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <p className="text-base font-medium text-foreground">
                +30 MP added for completing this section
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    console.log('No questions available after loading:', { 
      shuffledQuestionsLength: shuffledQuestions.length, 
      currentQuestionIndex,
      topicQuestionsCount: topic?.questions?.length || 0 
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">No questions available</h2>
          <p className="text-muted-foreground mb-4">This topic doesn't have any practice questions yet.</p>
          <Button onClick={() => {
            console.log('Back button clicked (no questions)');
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/dashboard';
            }
          }}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Get the most recent attempt for this question (in case of retries)
  const questionAttempts = attempts.filter(a => a.questionId === currentQuestion.id);
  const currentAttempt = questionAttempts.length > 0 ? questionAttempts[questionAttempts.length - 1] : undefined;

  return (
    <div className={`min-h-screen ${isPremium ? '' : 'pt-12'} bg-background`}>
      {/* Medly-style Top Navigation */}
      <header className="border-b border-border bg-card dark:bg-card/95">
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
                <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h1 className="text-lg font-semibold text-foreground truncate">{topic?.name}</h1>
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
                  let circleColor = 'bg-muted border-border dark:bg-muted/50'; // Not attempted yet
                  const isAttempted = attempt !== null;
                  
                  if (isAttempted) {
                    if (attempt.score === question.marks) {
                      circleColor = 'bg-emerald-500 border-emerald-600 shadow-sm shadow-emerald-500/50 dark:bg-emerald-600 dark:border-emerald-700'; // Full marks
                    } else if (attempt.score <= question.marks / 2) {
                      circleColor = 'bg-red-500 border-red-600 shadow-sm shadow-red-500/50 dark:bg-red-600 dark:border-red-700'; // Half or less
                    } else {
                      circleColor = 'bg-amber-500 border-amber-600 shadow-sm shadow-amber-500/50 dark:bg-amber-600 dark:border-amber-700'; // In between
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
                            ? 'bg-muted-foreground/40 dark:bg-muted-foreground/30'
                            : 'bg-border dark:bg-border/50'
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
          <div className="rounded-lg bg-card dark:bg-card/95 shadow-sm border border-border p-8">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                {/* Question reference numbers */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-1">
                    {(currentQuestionIndex + 1).toString().padStart(2, '0').split('').map((digit, idx) => (
                      <span key={idx} className="inline-block border-2 border-foreground px-3 py-1 text-base font-mono font-semibold text-foreground dark:border-foreground/80">{digit}</span>
                    ))}
                  </div>
                </div>
                  
                  {/* Question text */}
                  <p className="text-base text-foreground leading-relaxed mb-2">
                    {currentQuestion.question}
                  </p>
                </div>
                
                {/* Marks pill */}
                <div className="text-sm font-semibold text-foreground whitespace-nowrap">
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
                  className="w-full h-full min-h-[400px] border border-border focus:ring-0 text-base resize-none p-4 bg-background/50 dark:bg-background/30 rounded-md text-foreground"
                />
              ) : (
                <div className="space-y-4">
                  {/* User's answer bubble */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-xs font-semibold text-muted-foreground">Your Answer</span>
                      </div>
                      <div className={`rounded-3xl rounded-tl-md px-5 py-4 shadow-sm backdrop-blur-sm border ${
                        currentAttempt.score === currentQuestion.marks
                          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200/50 dark:border-emerald-800/50'
                          : currentAttempt.score <= currentQuestion.marks / 2
                          ? 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30 border-red-200/50 dark:border-red-800/50'
                          : 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200/50 dark:border-amber-800/50'
                      }`}>
                        <p className="text-foreground leading-relaxed">{userAnswer}</p>
                      </div>
                    </div>
                  </div>
                  
                   {/* Marks display */}
                  {currentAttempt && (
                    <div className="flex justify-start px-1">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                          currentAttempt.score === currentQuestion.marks 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' 
                            : currentAttempt.score <= currentQuestion.marks / 2
                            ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
                            : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                        }`}>
                          <span className={`font-bold text-sm ${
                            currentAttempt.score === currentQuestion.marks 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : currentAttempt.score <= currentQuestion.marks / 2
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>{currentAttempt.score}/{currentQuestion.marks}</span>
                          <span className={`text-xs font-medium ${
                            currentAttempt.score === currentQuestion.marks 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : currentAttempt.score <= currentQuestion.marks / 2
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>marks</span>
                        </div>
                        <button 
                          onClick={() => {
                            setShowFeedback(false);
                            setUserAnswer("");
                          }}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted"
                          title="Try again"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Full marks MP reward notification */}
                  {showFullMarksReward && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="max-w-[85%] space-y-2">
                        <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-950/60 dark:via-yellow-950/50 dark:to-amber-900/40 px-5 py-4 shadow-lg border border-amber-300/60 dark:border-amber-700/50 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600 flex items-center justify-center shadow-md">
                              <Star className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-amber-900 dark:text-amber-100">Perfect! +10 MP</p>
                              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Full marks reward earned</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentAttempt && (
                    <>
                      {/* Model answer bubble */}
                      {currentAttempt.feedback?.modelAnswer && (
                        <div className="flex justify-start mt-6">
                          <div className="max-w-[85%] space-y-2">
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Model Answer</span>
                            </div>
                            <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 px-5 py-4 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
                              <p className="text-foreground leading-relaxed">{currentAttempt.feedback.modelAnswer}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Teacher feedback bubble */}
                      {currentAttempt.feedback?.whyYoursDidnt && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] space-y-2">
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Teacher Feedback</span>
                            </div>
                            <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 px-5 py-4 shadow-sm border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                              <p className="text-foreground leading-relaxed">{currentAttempt.feedback.whyYoursDidnt}</p>
                            </div>
                          </div>
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 font-semibold text-base disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
              <h2 className="text-base font-semibold text-foreground">Ask mentiora</h2>
            </div>

            {/* Feedback content or chat messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-auto mb-4 space-y-3">
              {chatMessages.length > 0 ? (
                <>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-[20px] p-4 text-sm font-medium max-w-[80%] ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-[20px] p-4 text-sm text-foreground font-medium">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : showFeedback && currentAttempt ? (
                <div className="space-y-3">
                  <div className="bg-muted rounded-[20px] p-4 text-sm text-foreground font-medium">
                    You got {currentAttempt.score} out of {currentQuestion.marks} marks for this question.
                  </div>
                  {currentAttempt.score === 0 && (
                    <div className="bg-muted rounded-[20px] p-4 text-sm text-foreground font-medium">
                      It looks like you weren&apos;t sure how to answer, and that&apos;s completely okay!
                    </div>
                  )}
                  <div className="bg-muted rounded-[20px] p-4 text-sm text-foreground font-medium">
                    Let&apos;s go through it together.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-1" />
                  <div className="space-y-3">
                    <button
                      onClick={() => sendChatMessage("I don't understand this problem")}
                      className="w-full text-left text-sm text-foreground hover:text-foreground/90 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      I don&apos;t understand this problem
                    </button>
                    <button
                      onClick={() => sendChatMessage("Can you walk me through this step by step")}
                      className="w-full text-left text-sm text-foreground hover:text-foreground/90 p-3 rounded-lg hover:bg-muted transition-colors"
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
                className="h-11 px-4 flex-1 border border-border focus:ring-1 focus:ring-primary rounded-lg text-sm"
              />
              <Button 
                onClick={() => {
                  if (chatMessage.trim()) {
                    sendChatMessage(chatMessage);
                  }
                }}
                disabled={!chatMessage.trim() || isChatLoading}
                className="h-11 w-11 p-0 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center disabled:opacity-50"
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
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
            : currentAttempt.score <= currentQuestion.marks / 2
            ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
            : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 text-base font-medium shadow-md"
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