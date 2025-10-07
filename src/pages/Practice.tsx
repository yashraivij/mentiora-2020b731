import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Trophy, Award, MessageCircleQuestion, BookOpenCheck, BookOpen } from "lucide-react";

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

  const saveSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionState = {
      currentQuestionIndex,
      userAnswer,
      attempts,
      showFeedback,
      shuffledQuestions: shuffledQuestions.map(q => q.id),
      lastSaved: new Date().toISOString()
    };
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    localStorage.setItem(sessionKey, JSON.stringify(sessionState));
  };

  const loadSessionState = () => {
    if (!user?.id || !subjectId || !topicId || !topic) return false;
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    const savedState = localStorage.getItem(sessionKey);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
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

  const clearSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    localStorage.removeItem(sessionKey);
  };

  useEffect(() => {
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
    
    const sessionRestored = loadSessionState();
    
    if (!sessionRestored) {
      const filteredQuestions = filterNonDiagramQuestions(topic.questions || []);
      const shuffled = shuffleArray(filteredQuestions);
      setShuffledQuestions(shuffled);
    }
  }, [subject, topic, navigate, user?.id]);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      saveSessionState();
    }
  }, [currentQuestionIndex, userAnswer, attempts, showFeedback, shuffledQuestions]);

  const markAnswerWithSmart = async (question: Question, answer: string) => {
    try {
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

      if (error) throw error;

      return {
        marksAwarded: data.marksAwarded || 0,
        feedback: data.feedback || "No feedback available",
        assessment: data.assessment || "Needs Review"
      };

    } catch (error) {
      console.error('Error calling Smart marking function:', error);
      toast.error("Failed to mark answer with Smart system. Please try again.");
      
      const isSubstantialAnswer = answer.trim().length >= 3 && 
        answer.trim().split(/\s+/).length >= 1 && 
        /[a-zA-Z]/.test(answer.trim());
      
      return {
        marksAwarded: isSubstantialAnswer ? Math.round(question.marks * 0.3) : 0,
        feedback: "Good effort! Your answer shows you're thinking about this topic.",
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
      
      if (markingResult.marksAwarded > 0) {
        playCelebratorySound();
      }
      
      const marksLost = currentQuestion.marks - markingResult.marksAwarded;
      if (marksLost > 0 && user?.id) {
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
    
    clearSessionState();
    
    if (user?.id && subjectId && topicId) {
      try {
        const { MPPointsSystemClient } = await import('@/lib/mpPointsSystemClient');
        const result = await MPPointsSystemClient.awardPracticeCompletion(user.id, subjectId, topicId, marksEarned, totalMarks);
        
        if (result.awarded > 0 && result.breakdown) {
          if (result.breakdown.practice > 0) {
            showMPReward(result.breakdown.practice, "Quest complete: Complete 1 practice set");
          }
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
      } catch (error) {
        console.error('Error awarding practice completion MP:', error);
      }
    }
    
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
    
    if (averagePercentage < 85) {
      const weakTopicsKey = `mentiora_weak_topics_${user?.id}`;
      const weakTopics = JSON.parse(localStorage.getItem(weakTopicsKey) || '[]');
      if (!weakTopics.includes(topicId)) {
        weakTopics.push(topicId);
        localStorage.setItem(weakTopicsKey, JSON.stringify(weakTopics));
      }
    } else {
      const weakTopicsKey = `mentiora_weak_topics_${user?.id}`;
      const weakTopics = JSON.parse(localStorage.getItem(weakTopicsKey) || '[]');
      const filteredTopics = weakTopics.filter((id: string) => id !== topicId);
      localStorage.setItem(weakTopicsKey, JSON.stringify(filteredTopics));
      
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
          <Button onClick={() => navigate('/dashboard')}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const currentAttempt = attempts.find(a => a.questionId === currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <>
      
      <div className="min-h-screen" style={{ backgroundColor: '#F6F9FC' }}>
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => navigate(`/dashboard?subject=${subjectId}`)}
              className="text-sm hover:bg-white/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </div>
          </div>

          <Progress value={progress} className="mb-8 h-2" />

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-6">
            {/* Left Panel - Question Area */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Example {subject?.name} Question
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{topic?.name}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-semibold px-3 py-1.5 border-0"
                  >
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Question Content */}
                <div className="space-y-4">
                  <h2 className="text-lg font-normal text-gray-900 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                  
                  {/* Instructions box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {currentQuestion.markingCriteria.breakdown[0]}
                    </p>
                  </div>
                </div>

                {!showFeedback ? (
                  <>
                    {/* Answer Area */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Your answer</label>
                      <Textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="min-h-[200px] text-base resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-gray-50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                      size="lg"
                    >
                      {isSubmitting ? "Marking..." : "Mark answer"}
                    </Button>
                  </>
                ) : currentAttempt && (
                  /* Feedback Section */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        {currentAttempt.score >= currentQuestion.marks * 0.7 ? (
                          <Trophy className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Award className="h-6 w-6 text-blue-600" />
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Your Score</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {currentAttempt.score}/{currentQuestion.marks}
                          </p>
                        </div>
                      </div>
                      <Badge className={currentAttempt.score >= currentQuestion.marks * 0.7 ? "bg-green-100 text-green-700 hover:bg-green-100 border-0" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0"}>
                        {currentAttempt.score >= currentQuestion.marks * 0.7 ? "Excellent" : "Good effort"}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-white border border-gray-200">
                        <h4 className="font-semibold mb-2 text-gray-900">Feedback:</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {currentAttempt.feedback.whyYoursDidnt}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-white border border-gray-200">
                        <h4 className="font-semibold mb-2 text-gray-900">Model Answer:</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {currentAttempt.feedback.modelAnswer}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-white border border-gray-200">
                        <h4 className="font-semibold mb-2 text-gray-900">Why this gets full marks:</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {currentAttempt.feedback.whyThisGetsMark}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleNextQuestion}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                        size="lg"
                      >
                        {currentQuestionIndex < shuffledQuestions.length - 1 ? "Next Question" : "Finish Session"}
                      </Button>
                      <Button 
                        onClick={() => navigate('/dashboard?tab=notes')}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        📚 View Smart Notebook
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Panel - Chat Assistant */}
            <div className="hidden md:block">
              {!showChatAssistant ? (
                <Button
                  variant="outline"
                  onClick={() => setShowChatAssistant(true)}
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 py-6 rounded-2xl h-auto"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircleQuestion className="h-5 w-5" />
                    <span>Get step-by-step help</span>
                  </div>
                </Button>
              ) : (
                <div className="sticky top-8">
                  <ChatAssistant
                    question={currentQuestion}
                    subject={subject?.name || ''}
                    isOpen={showChatAssistant}
                    onClose={() => setShowChatAssistant(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Chat Button */}
          <div className="md:hidden mt-4">
            <Button
              variant="outline"
              onClick={() => setShowChatAssistant(!showChatAssistant)}
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 py-4 rounded-lg"
            >
              <MessageCircleQuestion className="mr-2 h-4 w-4" />
              {showChatAssistant ? 'Hide' : 'Get'} step-by-step help
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Chat Overlay */}
      {showChatAssistant && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowChatAssistant(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white" onClick={(e) => e.stopPropagation()}>
            <ChatAssistant
              question={currentQuestion}
              subject={subject?.name || ''}
              isOpen={showChatAssistant}
              onClose={() => setShowChatAssistant(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Practice;
