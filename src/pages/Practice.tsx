import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, CheckCircle, AlertCircle, Book, Lightbulb, HelpCircle, X, StickyNote } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { playCelebratorySound } from "@/lib/celebratory-sound";

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
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [showHint, setShowHint] = useState(false);
  
  const {
    notification,
    handlePracticeQuestionResult,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

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
    
    // Try to load existing session first
    const sessionRestored = loadSessionState();
    
    // Only shuffle questions if no session was restored
    if (!sessionRestored) {
      const filteredQuestions = filterNonDiagramQuestions(topic.questions || []);
      const shuffled = shuffleArray(filteredQuestions);
      setShuffledQuestions(shuffled);
    }
  }, [subject, topic, navigate, topicId, user?.id]);

  // Save state whenever important values change
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      saveSessionState();
    }
  }, [currentQuestionIndex, userAnswer, attempts, showFeedback, shuffledQuestions]);

  const markAnswerWithAI = async (question: Question, answer: string) => {
    try {
      console.log('Calling AI marking function with:', { 
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

      console.log('AI marking result:', data);

      return {
        marksAwarded: data.marksAwarded || 0,
        feedback: data.feedback || "No feedback available",
        assessment: data.assessment || "Needs Review"
      };

    } catch (error) {
      console.error('Error calling AI marking function:', error);
      toast.error("Failed to mark answer with AI. Please try again.");
      
      // Fallback to basic marking - only give marks for substantial answers
      const isSubstantialAnswer = answer.trim().length >= 3 && 
        answer.trim().split(/\s+/).length >= 1 && 
        /[a-zA-Z]/.test(answer.trim());
      
      return {
        marksAwarded: isSubstantialAnswer ? Math.round(question.marks * 0.3) : 0,
        feedback: "Good effort! Your answer shows you're thinking about this topic. While our AI teacher is taking a quick break, I want to encourage you to keep practicing - every answer helps you learn and grow!",
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
      
      const markingResult = await markAnswerWithAI(currentQuestion, userAnswer);
      
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
                onClick: () => navigate('/notebook')
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
      setShowHint(false);
    } else {
      finishSession();
    }
  };

  const generateHint = (question: Question) => {
    const questionText = question.question;
    const modelAnswer = question.modelAnswer;
    const markingCriteria = question.markingCriteria.breakdown;
    
    // Extract total marks and key points from marking criteria
    const totalMarks = markingCriteria.reduce((sum, criteria) => sum + criteria.marks, 0);
    const markingPoints = markingCriteria.map(criteria => criteria.description);
    
    // Identify question type
    const questionLower = questionText.toLowerCase();
    const isFunctionQuestion = questionLower.includes('function of') || questionLower.includes('role of') || questionLower.includes('purpose of');
    const isDefine = !isFunctionQuestion && (questionLower.includes('define') || questionLower.includes('what is') || questionLower.includes('meaning of'));
    const isExplain = questionLower.includes('explain') || questionLower.includes('describe') || questionLower.includes('how') || questionLower.includes('why');
    const isList = questionLower.includes('list') || questionLower.includes('name') || questionLower.includes('identify') || questionLower.includes('state');
    const isCalculate = questionLower.includes('calculate') || questionLower.includes('work out') || questionLower.includes('find');
    
    // Extract key terms from first sentence of model answer
    const firstSentence = modelAnswer.split(/[.!?]/)[0] || '';
    const keyTerms = firstSentence.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['this', 'that', 'these', 'those', 'they', 'them', 'provides', 'allows', 'causes', 'means'].includes(word))
      .slice(0, 2);
    
    // Generate targeted hints based on question type and marking criteria
    if (isFunctionQuestion) {
      return `Explain the specific role and what it does. Your answer needs ${totalMarks} clear points about its function and importance.`;
    }
    
    if (isDefine) {
      if (keyTerms.length > 0) {
        return `Define this clearly, making sure to mention: ${keyTerms.join(', ')}. Include the key characteristics for full marks.`;
      }
      return "Provide a precise definition with the essential characteristics. Be specific and detailed.";
    }
    
    if (isExplain) {
      if (keyTerms.length > 0) {
        return `Explain step by step, covering: ${keyTerms.join(', ')}. You need ${totalMarks} clear points or stages in your explanation.`;
      }
      return `Break this down into ${totalMarks} clear steps or points. Explain each stage thoroughly.`;
    }
    
    if (isList) {
      return `List ${totalMarks} distinct, specific points. Each point should be clearly different and detailed.`;
    }
    
    if (isCalculate) {
      const numbers = modelAnswer.match(/\d+(?:\.\d+)?/g) || [];
      if (numbers.length >= 2) {
        return `Use the numbers from the question and show all working. The calculation involves ${numbers.slice(0, 2).join(' and ')}.`;
      }
      return "Show all your working step by step. Identify the correct numbers and operation from the question.";
    }
    
    // Generic hint based on marking criteria
    if (keyTerms.length > 0) {
      return `Focus on: ${keyTerms.join(', ')}. Make sure your answer has ${totalMarks} clear points to get full marks.`;
    }
    
    return `Your answer needs ${totalMarks} clear, detailed points to get full marks. Be specific and thorough.`;
  };

  const finishSession = async () => {
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    // Clear the current session state since it's completed
    clearSessionState();
    
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
            <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
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
              <Button onClick={() => navigate(`/subject/${subjectId}`)}>
                Back to {subject?.name}
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold border-0"
              >
                Practice More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No questions available</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentAttempt = attempts.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate(`/subject/${subjectId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{topic?.name}</h1>
                <p className="text-sm text-muted-foreground">{subject?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
              </span>
              <Progress value={((currentQuestionIndex + 1) / shuffledQuestions.length) * 100} className="w-24" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Question Panel */}
            <Card className="bg-card/80 backdrop-blur-sm border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Question</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                     {currentQuestion.calculatorGuidance && (
                       <Badge 
                         variant={currentQuestion.calculatorGuidance === 'calc-recommended' ? 'default' : 'secondary'}
                         className={`text-xs ${
                           currentQuestion.calculatorGuidance === 'calc-recommended' 
                             ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30' 
                             : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30'
                         }`}
                       >
                         {currentQuestion.calculatorGuidance === 'calc-recommended' ? '🟩 Calculator recommended' : '🚫 No calculator'}
                       </Badge>
                     )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Question Text with Extract/Transcript Formatting */}
                {(() => {
                  const questionText = currentQuestion.question;
                  
                  // Check for transcript or extract sections
                  const transcriptMatch = questionText.match(/(.*?)(Transcript:|Extract:|Text A:|Text B:)(.*)/s);
                  
                  if (transcriptMatch) {
                    const [, beforeText, markerText, afterText] = transcriptMatch;
                    
                    // Split the after text to separate the actual transcript/extract from any following text
                    const parts = afterText.split(/\n(?=[A-Z][^:]*:)/);
                    const extractContent = parts[0];
                    const remainingText = parts.slice(1).join('\n');
                    
                    return (
                      <div className="space-y-4">
                        {beforeText.trim() && (
                          <p className="text-foreground leading-relaxed">
                            {beforeText.trim()}
                          </p>
                        )}
                        
                        {/* Extract/Transcript Display */}
                        <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center">
                            <Book className="h-4 w-4 mr-2" />
                            {markerText.replace(':', '')}
                          </h4>
                          <div className="text-foreground font-mono text-sm leading-relaxed whitespace-pre-line bg-background/80 p-3 rounded">
                            {extractContent.trim()}
                          </div>
                        </div>
                        
                        {remainingText.trim() && (
                          <p className="text-foreground leading-relaxed">
                            {remainingText.trim()}
                          </p>
                        )}
                      </div>
                    );
                  }
                  
                  // For questions with embedded texts (Text A: / Text B: format)
                  const textSections = questionText.split(/(Text [A-Z]:)/);
                  if (textSections.length > 1) {
                    return (
                      <div className="space-y-4">
                        {textSections.map((section, index) => {
                          if (section.match(/Text [A-Z]:/)) {
                            const nextSection = textSections[index + 1];
                            if (nextSection) {
                              return (
                                <div key={index} className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                                   <h4 className="font-mono font-semibold text-foreground mb-2 flex items-center">
                                    <Book className="h-4 w-4 mr-2" />
                                    {section}
                                  </h4>
                                  <div className="text-foreground font-normal bg-background/80 p-3 rounded">
                                    "{nextSection.trim()}"
                                  </div>
                                </div>
                              );
                            }
                          } else if (index === 0 || !textSections[index - 1]?.match(/Text [A-Z]:/)) {
                            return (
                              <p key={index} className="text-foreground leading-relaxed">
                                {section.trim()}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                  
                  // Default rendering for simple questions
                  return (
                    <p className="text-foreground mb-6 leading-relaxed">
                      {questionText}
                    </p>
                  );
                })()}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Answer:
                    </label>
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your full answer here..."
                      className="min-h-[200px]"
                      disabled={showFeedback}
                    />
                  </div>
                  
                  {!showFeedback && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSubmitAnswer}
                          disabled={isSubmitting || !userAnswer.trim()}
                          className="flex-1"
                        >
                          {isSubmitting ? "AI is marking your answer..." : "Submit Answer"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowHint(!showHint)}
                          className="px-4"
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          {showHint ? "Hide Hint" : "Hint"}
                        </Button>
                      </div>
                      
                      {showHint && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Hint
                              </h4>
                              <p className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed">
                                {generateHint(currentQuestion)}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowHint(false)}
                              className="ml-2 h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Panel */}
            {showFeedback && currentAttempt && (
              <Card className="bg-card/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    AI Teacher Feedback
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
                      <Book className="h-4 w-4 mr-2" />
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
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Why This Gets Full Marks
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                      <pre className="text-foreground whitespace-pre-wrap font-sans">
                        {currentAttempt.feedback.whyThisGetsMark}
                      </pre>
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      AI Teacher Feedback
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
                      onClick={() => navigate('/notebook')}
                      variant="outline"
                      className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-300 hover:shadow-md transition-all duration-200 dark:from-purple-950/30 dark:to-indigo-950/30 dark:border-purple-700 dark:text-purple-300 dark:hover:from-purple-950/50 dark:hover:to-indigo-950/50 dark:hover:border-purple-600"
                    >
                      <span className="font-medium">📚 View Smart Notebook</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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