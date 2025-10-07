import { useState, useEffect } from "react";
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
import { ChatAssistant } from "@/components/practice/ChatAssistant";
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setShowChatAssistant(false);
    } else {
      finishSession();
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

  const currentAttempt = attempts.find(a => a.questionId === currentQuestion.id);

  return (
    <div className={`min-h-screen font-inter ${isPremium ? '' : 'pt-12'}`} style={{ backgroundColor: '#F5F5F5' }}>
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
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    setUserAnswer("");
                    setShowFeedback(false);
                    setShowChatAssistant(false);
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-700 border-2 border-gray-900 p-0.5" />
                <h1 className="text-base font-semibold text-slate-900">{topic?.name}</h1>
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

            {/* Center: Avatar (using fox icon) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">🦊</span>
              </div>
            </div>

            {/* Right: Textbook button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard?subject=${subjectId}`)}
              className="border-gray-900 border-2 font-medium text-sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Textbook
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start">
          {/* Left Pane: Question Sheet */}
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-10">
            {/* Question Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  {/* Question reference numbers - two separate boxes */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="inline-block border-2 border-gray-900 px-3 py-1 text-base font-normal min-w-[40px] text-center">0</span>
                    <span className="inline-block border-2 border-gray-900 px-3 py-1 text-base font-normal min-w-[40px] text-center">{currentQuestionIndex + 1}</span>
                    <span className="inline-block border-2 border-gray-900 px-3 py-1 text-base font-normal min-w-[40px] text-center">.</span>
                    <span className="inline-block border-2 border-gray-900 px-3 py-1 text-base font-normal min-w-[40px] text-center">1</span>
                  </div>
                  
                  {/* Question text */}
                  <p className="text-base text-slate-900 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>
                
                {/* Marks - right aligned */}
                <div className="text-base font-normal text-slate-900 whitespace-nowrap pt-8">
                  [{currentQuestion.marks} marks]
                </div>
              </div>
            </div>

            {/* Answer area - large white space with invisible textarea */}
            <div className="min-h-[350px] mb-8">
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder=""
                disabled={showFeedback}
                className="w-full h-full min-h-[350px] border-0 focus:ring-0 focus:outline-none text-base resize-none p-0 bg-transparent shadow-none"
                style={{ boxShadow: 'none' }}
              />
            </div>

            {/* Check answer button - bottom right */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !userAnswer.trim() || showFeedback}
                className="bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white rounded-full px-8 py-3 font-medium text-base disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? "Marking..." : showFeedback ? "Marked" : "Check answer"}
              </Button>
            </div>
          </div>

          {/* Right Pane: Ask medly */}
          <aside className="flex flex-col h-[600px]">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-700">Ask medly</h2>
            </div>

            {/* Spacer to push content to bottom */}
            <div className="flex-1"></div>

            {/* Chat suggestions at bottom */}
            <div className="space-y-3 mb-4">
              <button
                onClick={() => setShowChatAssistant(true)}
                className="w-full text-left text-sm text-slate-700 hover:text-slate-900 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                I don&apos;t understand this problem
              </button>
              <button
                onClick={() => setShowChatAssistant(true)}
                className="w-full text-left text-sm text-slate-700 hover:text-slate-900 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Can you walk me through this step by step
              </button>
            </div>

            {/* Reply input at very bottom */}
            <div className="flex gap-2">
              <Input
                placeholder="Reply"
                className="h-11 px-4 flex-1 border border-gray-300 focus:ring-1 focus:ring-[#3BAFDA] rounded-lg text-sm bg-white"
                disabled
              />
              <Button 
                className="h-11 w-11 p-0 rounded-full bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white flex items-center justify-center"
                disabled
              >
                <div className="transform rotate-45">
                  <Send className="h-4 w-4" />
                </div>
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Feedback Modal (shown after marking) */}
      {showFeedback && currentAttempt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Your Feedback
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentAttempt.score}/{currentQuestion.marks}
                </span>
                <span className="text-sm text-muted-foreground">marks</span>
                <Badge className={currentAttempt.score >= currentQuestion.marks * 0.85 ? "bg-green-500" : currentAttempt.score >= currentQuestion.marks * 0.6 ? "bg-yellow-500" : "bg-red-500"}>
                  {currentAttempt.score >= currentQuestion.marks * 0.85 ? "Excellent" : currentAttempt.score >= currentQuestion.marks * 0.6 ? "Good" : "Needs Work"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Answer */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <BookOpenCheck className="h-4 w-4 mr-2 text-emerald-600" />
                  Model Answer
                </h4>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-foreground space-y-2">
                    {currentAttempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                      <p key={index} className="leading-relaxed">{sentence.trim()}{index < currentAttempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).length - 1 ? '.' : ''}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Why This Gets Marks */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-blue-600" />
                  Why This Gets Full Marks
                </h4>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <pre className="text-foreground whitespace-pre-wrap font-sans">
                    {currentAttempt.feedback.whyThisGetsMark}
                  </pre>
                </div>
              </div>

              {/* Smart Feedback */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Teacher&apos;s Notes
                </h4>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-foreground">{currentAttempt.feedback.whyYoursDidnt}</p>
                </div>
              </div>

              {/* Spec Reference */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Specification Reference</h4>
                <Badge variant="outline">{currentAttempt.feedback.specLink}</Badge>
              </div>

              <div className="space-y-3">
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestionIndex < shuffledQuestions.length - 1 ? "Next Question" : "Finish Session"}
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard?tab=notes')}
                  variant="outline"
                  className="w-full"
                >
                  <span className="font-medium">📚 View Smart Notebook</span>
                </Button>
              </div>
            </CardContent>
          </Card>
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