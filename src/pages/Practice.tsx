import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Trophy, Award, BookOpenCheck, X, StickyNote, Star, BookOpen, MessageCircleQuestion, MessageCircle, Send } from "lucide-react";

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

  // Save session state to localStorage
  const saveSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionState = {
      currentQuestionIndex,
      userAnswer,
      attempts,
      showFeedback,
      shuffledQuestions: shuffledQuestions.map(q => q.id), // Only save question IDs
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
          
          toast.success("Previous session restored! Continuing from where you left off.");
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
          const notesGenerated = await NotebookGenerator.generateAndSaveNotes(
            user.id,
            currentQuestion,
            userAnswer,
            marksLost,
            subjectId || '',
            topicId || ''
          );
          
          if (notesGenerated) {
            toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks. Smart notes added to your Notebook!`, {
              action: {
                label: "View Notebook",
                onClick: () => navigate('/dashboard?tab=notes')
              }
            });
          } else {
            toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
          }
        } catch (error) {
          console.error('Error generating notebook notes:', error);
          toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
        }
      } else {
        toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
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

  const handleNextQuestion = () => {
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
      finishSession();
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
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    // Clear the current session state since it's completed
    clearSessionState();
    
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
          
          // Show celebratory toast for mastery
          toast.success(`🎉 Topic mastered! Great work on ${topic?.name}!`, {
            duration: 3000,
          });
        } catch (error) {
          console.error('Error tracking topic mastery:', error);
        }
      }
    }
    
    setSessionComplete(true);
  };

  if (sessionComplete) {
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-foreground">Session Complete!</CardTitle>
            <CardDescription className="text-muted-foreground">
              {topic?.name} - {subject?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {marksEarned}/{totalMarks}
              </div>
              <p className="text-muted-foreground">Total Marks</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-medium">{attempts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <Badge className={averagePercentage >= 85 ? "bg-green-500" : averagePercentage >= 60 ? "bg-yellow-500" : "bg-red-500"}>
                  {averagePercentage >= 85 ? "Excellent" : averagePercentage >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => navigate(`/dashboard?subject=${subjectId}`)}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold border-0"
              >
                Back to {subject?.name}
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <div className="flex items-center justify-between">
            {/* Left: Topic name with navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    const previousQuestion = shuffledQuestions[currentQuestionIndex - 1];
                    const previousAttempts = attempts.filter(a => a.questionId === previousQuestion.id);
                    const previousAttempt = previousAttempts.length > 0 ? previousAttempts[previousAttempts.length - 1] : null;
                    
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    // Restore the saved answer if it exists
                    setUserAnswer(previousAttempt?.userAnswer || "");
                    setShowFeedback(previousAttempt ? true : false);
                    setChatMessages([]);
                    setHintCount(0);
                    setChatStage('intro');
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-600" />
                <h1 className="text-lg font-semibold text-slate-900">{topic?.name}</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (currentQuestionIndex < shuffledQuestions.length - 1) {
                    handleNextQuestion();
                  }
                }}
                disabled={currentQuestionIndex >= shuffledQuestions.length - 1}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>

            {/* Center: Modern Progress indicator with fox */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 relative">
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
                        <div 
                          className={`w-7 h-7 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${circleColor} ${
                            showFox ? 'ring-2 ring-orange-300 ring-offset-2' : ''
                          }`}
                        >
                          {/* Show checkmark or X for attempted questions */}
                          {isAttempted && (
                            <span className="text-white text-sm font-bold">
                              {attempt.score === question.marks ? '✓' : attempt.score === 0 ? '✗' : '◐'}
                            </span>
                          )}
                          
                          {/* Fox on current unattempted question */}
                          {showFox && (
                            <span className="text-lg">🦊</span>
                          )}
                        </div>
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
                      <span className="inline-block border-2 border-slate-900 px-3 py-1 text-base font-mono font-semibold">0</span>
                      <span className="inline-block border-2 border-slate-900 px-3 py-1 text-base font-mono font-semibold">{currentQuestionIndex + 1}</span>
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
                  className="bg-[#1F6BFF] hover:bg-[#1456DA] text-white rounded-full px-10 py-6 font-semibold text-base disabled:opacity-50 shadow-[0_6px_24px_rgba(31,107,255,0.25)] hover:shadow-[0_8px_32px_rgba(31,107,255,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-['Inter']"
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
                Next question
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