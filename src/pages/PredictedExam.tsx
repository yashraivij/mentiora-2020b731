import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, AlertCircle, CheckCircle, Crown, Target } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";

interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  marks: number;
  section?: string;
}

interface ExamAnswer {
  questionId: string;
  answer: string;
}

const PredictedExam = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }

  // Check if this is a retry scenario
  const { retryQuestions, isRetry } = location.state || {};

  // Generate exam questions from subject topics or use retry questions
  const generateExamQuestions = (): ExamQuestion[] => {
    // If retry mode, use the provided retry questions
    if (isRetry && retryQuestions) {
      return retryQuestions.map((q: any, index: number) => ({
        ...q,
        questionNumber: index + 1
      }));
    }

    // Otherwise generate fresh questions
    const questions: ExamQuestion[] = [];
    let questionNumber = 1;
    
    subject.topics.forEach((topic, topicIndex) => {
      // Take 2-3 questions from each topic for a full paper
      const topicQuestions = topic.questions.slice(0, 3);
      
      topicQuestions.forEach((q, qIndex) => {
        questions.push({
          id: `${topicIndex}-${qIndex}`,
          questionNumber: questionNumber++,
          text: q.question,
          marks: q.marks || 2,
          section: topicIndex < Math.ceil(subject.topics.length / 2) ? 'A' : 'B'
        });
      });
    });
    
    return questions.slice(0, 20); // Limit to 20 questions for exam length
  };

  const [examQuestions] = useState<ExamQuestion[]>(generateExamQuestions());

  const getExamDuration = () => {
    const durations = {
      chemistry: 105, // 1h 45min
      biology: 105,
      physics: 105,
      mathematics: 90, // 1h 30min
      "english-language": 105,
      "english-literature": 105,
      history: 75, // 1h 15min
      geography: 90,
      "computer-science": 90,
      psychology: 105
    };
    return durations[subjectId as keyof typeof durations] || 90;
  };

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimeUp(true);
            toast({
              title: "Time's Up!",
              description: "The exam timer has finished, but you can continue working.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft, toast]);

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(getExamDuration() * 60); // Convert to seconds
    toast({
      title: "Exam Started!",
      description: "Good luck with your predicted exam practice."
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer } : a);
      }
      return [...prev, { questionId, answer }];
    });
  };

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer || '';
  };

  const handleSubmit = () => {
    if (answers.length < examQuestions.length) {
      toast({
        title: "Incomplete Exam",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitted(true);
    navigate(`/predicted-results/${subjectId}`, { 
      state: { 
        questions: examQuestions, 
        answers: answers,
        timeElapsed: getExamDuration() * 60 - timeLeft
      } 
    });
  };

  const progress = (answers.length / examQuestions.length) * 100;

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => navigate('/predicted-questions')} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-16 max-w-2xl">
          <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Crown className="h-8 w-8 text-amber-500" />
                <div>
                  <CardTitle className="text-2xl font-bold">{subject.name} Predicted Exam</CardTitle>
                  <CardDescription>AQA GCSE • {getExamDuration()} minutes</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border">
                  <div className="text-2xl font-bold text-primary">{examQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-card rounded-xl border">
                  <div className="text-2xl font-bold text-primary">{getExamDuration()}min</div>
                  <div className="text-sm text-muted-foreground">Time Limit</div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-amber-800 dark:text-amber-200">Exam Instructions</span>
                </div>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Answer all questions in the spaces provided</li>
                  <li>• You have {getExamDuration()} minutes to complete this paper</li>
                  <li>• Read each question carefully before answering</li>
                  <li>• Check your work before submitting</li>
                </ul>
              </div>
              
              <Button 
                onClick={startExam}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 py-3 font-semibold"
              >
                <Clock className="h-4 w-4 mr-2" />
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Fixed Header with Timer */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Crown className="h-6 w-6 text-amber-500" />
              <div>
                <h1 className="text-lg font-bold text-foreground">{subject.name} Predicted Exam</h1>
                <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {examQuestions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${isTimeUp ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-card border-border'}`}>
                <Clock className={`h-4 w-4 ${isTimeUp ? 'text-red-600' : 'text-muted-foreground'}`} />
                <span className={`font-mono font-bold ${isTimeUp ? 'text-red-600' : 'text-foreground'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{answers.length}/{examQuestions.length} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {examQuestions.map((q, index) => (
                    <Button
                      key={q.id}
                      variant={currentQuestion === index ? "default" : answers.find(a => a.questionId === q.id) ? "outline" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs ${
                        answers.find(a => a.questionId === q.id) ? 'border-green-300 bg-green-50 dark:bg-green-950/20' : ''
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {answers.find(a => a.questionId === q.id) && (
                        <CheckCircle className="h-3 w-3 text-green-600 absolute top-0 right-0 transform translate-x-1 -translate-y-1" />
                      )}
                      {q.questionNumber}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Question {examQuestions[currentQuestion].questionNumber}
                    </CardTitle>
                    {examQuestions[currentQuestion].section && (
                      <Badge variant="outline" className="mt-2">
                        Section {examQuestions[currentQuestion].section}
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {examQuestions[currentQuestion].marks} {examQuestions[currentQuestion].marks === 1 ? 'mark' : 'marks'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {examQuestions[currentQuestion].text}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Answer:</label>
                  <Textarea
                    value={getAnswer(examQuestions[currentQuestion].id)}
                    onChange={(e) => handleAnswerChange(examQuestions[currentQuestion].id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aim for detailed explanations to maximize marks
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentQuestion === examQuestions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-primary to-primary/90"
                      disabled={answers.length < examQuestions.length}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Submit for Marking
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}
                    >
                      Next
                    </Button>
                  )}
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