import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Trophy, Award, BookOpenCheck, StickyNote, Star, BookOpen, MessageCircleQuestion } from "lucide-react";

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

  // Character counter
  const characterCount = userAnswer.length;
  const maxCharacters = 500;

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F6F9FC' }}>
        <Card className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-200">
          <CardHeader className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2663EB' }}>
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-gray-900">Session Complete!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Well done on completing this practice session
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 p-8 pt-0">
            <div>
              <div className="text-5xl font-bold mb-2" style={{ color: '#2663EB' }}>
                {marksEarned}/{totalMarks}
              </div>
              <p className="text-gray-600">Total Marks</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Questions Answered:</span>
                <span className="font-medium">{attempts.length}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Performance:</span>
                <Badge className={averagePercentage >= 85 ? "bg-green-500 text-white" : averagePercentage >= 60 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}>
                  {averagePercentage >= 85 ? "Excellent" : averagePercentage >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate(`/dashboard?subject=${subjectId}`)}
              className="w-full text-white font-semibold rounded-xl h-12 mt-6"
              style={{ backgroundColor: '#2663EB' }}
            >
              Back to {subject?.name}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F6F9FC' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">No questions available</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F9FC' }}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/dashboard?subject=${subjectId}&topic=${topicId}`)}
              className="hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {subject?.name}
              </h1>
              <p className="text-sm text-gray-600">{topic?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              {currentQuestionIndex + 1} / {shuffledQuestions.length}
            </Badge>
            <Progress 
              value={((currentQuestionIndex + 1) / shuffledQuestions.length) * 100} 
              className="w-32 h-2"
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          
          {/* LEFT PANEL - Question Area */}
          <div className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="space-y-4 p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </div>
                  <Badge 
                    className="shrink-0 text-base px-4 py-1.5 rounded-full font-semibold"
                    style={{ backgroundColor: '#2663EB', color: 'white' }}
                  >
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                  </Badge>
                </div>
                
                {/* Spec Reference */}
                {currentQuestion.specReference && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Specification:</span> {currentQuestion.specReference}
                    </p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6 p-8 pt-0">
                {/* Instructions Box */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <StickyNote className="h-4 w-4" style={{ color: '#2663EB' }} />
                    Write your answer below. Show all working where relevant.
                  </p>
                </div>
                
                {/* Answer Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your answer here…"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showFeedback}
                    className="min-h-[200px] text-base resize-none bg-white border-2 border-gray-300 focus:border-blue-500 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <span className="text-sm text-gray-500">
                      {characterCount} / {maxCharacters}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!showFeedback ? (
                    <Button 
                      onClick={handleSubmitAnswer} 
                      disabled={isSubmitting || !userAnswer.trim()}
                      className="flex-1 text-white font-semibold rounded-xl h-12 text-base shadow-md hover:shadow-lg transition-all duration-200"
                      style={{ backgroundColor: '#2663EB' }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Marking...
                        </>
                      ) : (
                        <>
                          Mark answer
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextQuestion}
                      className="flex-1 text-white font-semibold rounded-xl h-12 text-base shadow-md hover:shadow-lg transition-all duration-200"
                      style={{ backgroundColor: '#2663EB' }}
                    >
                      {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                        <>Next Question</>
                      ) : (
                        <>Finish Session</>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {showFeedback && (
              <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 animate-in slide-in-from-bottom duration-500">
                <CardHeader className="p-8">
                  <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    Answer Feedback
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    You scored {attempts[attempts.length - 1]?.score || 0} / {currentQuestion.marks} marks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8 pt-0">
                  {/* Model Answer */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                      <Star className="h-5 w-5" style={{ color: '#2663EB' }} />
                      Model Answer
                    </h3>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                        {attempts[attempts.length - 1]?.feedback.modelAnswer}
                      </p>
                    </div>
                  </div>

                  {/* Marking Criteria */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                      <BookOpenCheck className="h-5 w-5" style={{ color: '#2663EB' }} />
                      Why This Gets Full Marks
                    </h3>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                        {attempts[attempts.length - 1]?.feedback.whyThisGetsMark}
                      </p>
                    </div>
                  </div>

                  {/* Teacher's Notes */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                      <StickyNote className="h-5 w-5" style={{ color: '#2663EB' }} />
                      Teacher's Notes on Your Answer
                    </h3>
                    <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                        {attempts[attempts.length - 1]?.feedback.whyYoursDidnt}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT PANEL - Tutor Chat */}
          <div className="md:sticky md:top-24 h-fit">
            <ChatAssistant 
              question={currentQuestion}
              subject={subjectId || ''}
            />
          </div>
        </div>
      </div>

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
