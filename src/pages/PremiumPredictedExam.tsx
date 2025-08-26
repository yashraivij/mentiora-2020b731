import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, AlertCircle, CheckCircle, Crown, Target } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";
import { supabase } from "@/integrations/supabase/client";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";

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

const PremiumPredictedExam = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  const {
    notification,
    handlePredictedExamWrongAnswer,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();
  
  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/premium-predicted-questions');
    return null;
  }

  const examDurations = {
    chemistry: 105,
    "chemistry-edexcel": 105,
    biology: 105,
    physics: 105,
    mathematics: 90,
    "english-language": 105,
    "english-literature": 105,
    history: 75,
    geography: 90,
    "computer-science": 90,
    psychology: 105,
    "combined-science-aqa": 75
  };

  const duration = examDurations[subjectId as keyof typeof examDurations] || 90;

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && timeLeft === 0) {
      setIsTimeUp(true);
      handleSubmitExam();
    }
  }, [timeLeft, examStarted]);

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(duration * 60); // Convert minutes to seconds
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    navigate(`/premium-predicted-results/${subjectId}`, {
      state: {
        questions: [], // Would be populated with actual questions
        answers,
        timeElapsed: (duration * 60) - timeLeft,
        totalMarks: 0 // Would be calculated
      }
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

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => navigate('/premium-predicted-questions')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Predicted Questions
                  </Button>
                  <ThemeToggle />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Crown className="h-8 w-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold">{subject.name} - Paper 1</h1>
                  </div>
                  <CardDescription className="text-lg">
                    Premium Predicted Exam • {duration} minutes • Foundation & Higher Tier
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                    Exam Instructions
                  </h2>
                  <ul className="space-y-2 text-sm">
                    <li>• Answer ALL questions in the spaces provided</li>
                    <li>• Show all your working for calculation questions</li>
                    <li>• Use appropriate scientific terminology</li>
                    <li>• Quality of written communication will be assessed</li>
                    <li>• This exam follows the official {subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' ? 'Edexcel' : 'AQA'} format</li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold">{duration} Minutes</div>
                    <div className="text-sm text-muted-foreground">Real exam timing</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="font-semibold">Full Paper</div>
                    <div className="text-sm text-muted-foreground">Complete coverage</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-semibold">AI Marking</div>
                    <div className="text-sm text-muted-foreground">Instant feedback</div>
                  </div>
                </div>

                <Button 
                  onClick={startExam}
                  className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Start Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Timer Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{subject.name} - Paper 1</h1>
              <Badge variant="outline">Question {currentQuestion + 1}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                timeLeft < 900 ? 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400' :
                'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  This would contain the actual exam question content...
                </p>
              </div>
              
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-[200px]"
                value={answers.find(a => a.questionId === `q${currentQuestion}`)?.answer || ''}
                onChange={(e) => {
                  const newAnswers = answers.filter(a => a.questionId !== `q${currentQuestion}`);
                  newAnswers.push({ questionId: `q${currentQuestion}`, answer: e.target.value });
                  setAnswers(newAnswers);
                }}
              />
              
              <div className="flex justify-between">
                <Button 
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={currentQuestion >= 9} // Assuming 10 questions
                >
                  Next
                </Button>
              </div>
              
              <Button onClick={handleSubmitExam} className="w-full" variant="destructive">
                Submit Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Notifications - placeholder */}
      {notification && (
        <div>
          {/* Notification placeholder */}
        </div>
      )}
    </div>
  );
};

export default PremiumPredictedExam;
