import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Crown, Timer, FileText, Target } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ExamAnswer {
  questionId: string;
  answer: string;
  marks: number;
}

const PredictedExam = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(105 * 60); // 1hr 45min in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [examComplete, setExamComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subject = curriculum.find(s => s.id === subjectId);
  
  // Generate exam questions (filter out diagram questions and select subset)
  const generateExamQuestions = (): Question[] => {
    if (!subject) return [];
    
    const allQuestions = subject.topics.flatMap(topic => topic.questions || []);
    const diagramKeywords = [
      'diagram', 'chart', 'graph', 'scatter', 'plot', 'histogram', 'bar chart',
      'pie chart', 'line graph', 'draw', 'sketch', 'show on', 'using the diagram',
      'from the diagram', 'in the diagram', 'on the graph', 'from the graph'
    ];
    
    const filteredQuestions = allQuestions.filter(question => {
      const questionText = question.question.toLowerCase();
      return !diagramKeywords.some(keyword => questionText.includes(keyword));
    });
    
    // Select questions to create a realistic paper length (15-20 questions)
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(18, shuffled.length));
  };

  const [examQuestions] = useState<Question[]>(() => generateExamQuestions());
  const currentQuestion = examQuestions[currentQuestionIndex];

  // Timer functionality
  useEffect(() => {
    if (!examStarted || examComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setExamComplete(true);
          toast.error("Time's up! The exam has ended.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examStarted, examComplete]);

  // Auto-save current answer
  useEffect(() => {
    if (examStarted && currentQuestion) {
      const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
      const updatedAnswers = [...answers];
      
      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          answer: currentAnswer
        };
      } else {
        updatedAnswers.push({
          questionId: currentQuestion.id,
          answer: currentAnswer,
          marks: 0
        });
      }
      
      setAnswers(updatedAnswers);
    }
  }, [currentAnswer, currentQuestion, examStarted]);

  // Load existing answer when changing questions
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
      setCurrentAnswer(existingAnswer?.answer || "");
    }
  }, [currentQuestionIndex, currentQuestion, answers]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return "text-red-500"; // Last 5 minutes
    if (timeLeft <= 900) return "text-amber-500"; // Last 15 minutes
    return "text-foreground";
  };

  const startExam = () => {
    setExamStarted(true);
    toast.success("Exam started! Good luck!");
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const submitExam = () => {
    if (answers.some(a => !a.answer.trim())) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    setExamComplete(true);
    
    // Simulate submission process
    setTimeout(() => {
      navigate(`/predicted-results/${subjectId}`, { 
        state: { 
          answers, 
          questions: examQuestions,
          timeTaken: (105 * 60) - timeLeft
        } 
      });
    }, 1500);
  };

  const getTotalMarks = () => {
    return examQuestions.reduce((total, q) => total + q.marks, 0);
  };

  const getAnsweredCount = () => {
    return answers.filter(a => a.answer.trim()).length;
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Subject not found</h2>
          <Button onClick={() => navigate('/predicted-questions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Predicted Questions
          </Button>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => navigate('/predicted-questions')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Predicted Questions
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Crown className="h-8 w-8 text-amber-500" />
              <h1 className="text-3xl font-bold text-foreground">Predicted 2026 {subject.name} Paper</h1>
            </div>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 mb-6">
              Premium Exam Experience
            </Badge>
          </div>

          <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-foreground mb-4">Exam Instructions</CardTitle>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-2xl p-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{examQuestions.length}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Questions</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-2xl p-4">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">{getTotalMarks()}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Total Marks</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-2xl p-4">
                  <Timer className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300">1h 45m</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Time Limit</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4">
                <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Important Notes:</h3>
                <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                  <li>• All questions must be answered using the keyboard</li>
                  <li>• You can navigate between questions freely</li>
                  <li>• Your answers are auto-saved as you type</li>
                  <li>• Timer will turn red in the final 5 minutes</li>
                  <li>• Detailed AI feedback will be provided after submission</li>
                </ul>
              </div>
              
              <Button 
                onClick={startExam} 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-6 text-lg"
              >
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Submitting Your Exam</h2>
          <p className="text-muted-foreground">AI is marking your answers...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Exam Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-amber-500" />
                <h1 className="text-xl font-bold text-foreground">
                  {subject.name} Predicted Paper 2026
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Question Navigator</CardTitle>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Progress: {getAnsweredCount()}/{examQuestions.length}</span>
                  <span>{Math.round((getAnsweredCount() / examQuestions.length) * 100)}%</span>
                </div>
                <Progress value={(getAnsweredCount() / examQuestions.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {examQuestions.map((_, index) => {
                    const isAnswered = answers.some(a => a.questionId === examQuestions[index].id && a.answer.trim());
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <Button
                        key={index}
                        variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                        size="sm"
                        className={`h-10 w-10 p-0 ${
                          isCurrent 
                            ? "bg-primary text-primary-foreground" 
                            : isAnswered 
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700" 
                              : "border-2 border-dashed"
                        }`}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-dashed border-border rounded"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="px-3 py-1">
                      Question {currentQuestionIndex + 1} of {examQuestions.length}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {currentQuestion?.marks} {currentQuestion?.marks === 1 ? 'mark' : 'marks'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 ${
                        currentQuestion?.difficulty === 'easy' ? 'text-green-600 border-green-300' :
                        currentQuestion?.difficulty === 'medium' ? 'text-amber-600 border-amber-300' :
                        'text-red-600 border-red-300'
                      }`}
                    >
                      {currentQuestion?.difficulty}
                    </Badge>
                  </div>
                  
                  {timeLeft <= 300 && (
                    <div className="flex items-center space-x-2 text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Time running out!</span>
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion?.question}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[200px] text-base"
                  />
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      {answers.find(a => a.questionId === currentQuestion?.id)?.answer.trim() && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Answer saved</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      
                      {currentQuestionIndex === examQuestions.length - 1 ? (
                        <Button 
                          onClick={submitExam}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                          disabled={getAnsweredCount() < examQuestions.length}
                        >
                          Submit Exam
                        </Button>
                      ) : (
                        <Button onClick={nextQuestion}>
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedExam;