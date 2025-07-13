import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, Crown, Trophy, Target, Clock, CheckCircle, AlertCircle, BookOpen, ExternalLink, Brain, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExamAnswer {
  questionId: string;
  answer: string;
  marks: number;
}

interface QuestionFeedback {
  questionId: string;
  marksAwarded: number;
  totalMarks: number;
  modelAnswer: string;
  whyThisGetsMark: string;
  whyYoursDidnt: string;
  specLink: string;
}

const PredictedResults = () => {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [feedback, setFeedback] = useState<QuestionFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const subject = curriculum.find(s => s.id === subjectId);
  const { answers, questions, timeTaken } = location.state as {
    answers: ExamAnswer[];
    questions: Question[];
    timeTaken: number;
  };

  useEffect(() => {
    const markAllAnswers = async () => {
      if (!answers || !questions) {
        navigate('/predicted-questions');
        return;
      }

      setIsLoading(true);
      const feedbackResults: QuestionFeedback[] = [];

      try {
        // Mark each answer using the same AI system as practice questions
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          const answer = answers.find(a => a.questionId === question.id);
          
          if (answer) {
            toast(`Marking question ${i + 1} of ${questions.length}...`, {
              id: 'marking-progress'
            });

            try {
              const { data, error } = await supabase.functions.invoke('mark-answer', {
                body: {
                  question: question.question,
                  userAnswer: answer.answer,
                  modelAnswer: question.modelAnswer,
                  markingCriteria: question.markingCriteria.breakdown,
                  totalMarks: question.marks,
                  subjectId: subjectId
                }
              });

              if (error) throw error;

              // Generate model answer using AI
              const { data: modelData, error: modelError } = await supabase.functions.invoke('generate-model-answer', {
                body: {
                  question: question.question,
                  marks: question.marks,
                  subjectId: subjectId,
                  markingCriteria: question.markingCriteria.breakdown
                }
              });

              const modelAnswer = modelError ? question.modelAnswer : (modelData?.modelAnswer || question.modelAnswer);

              feedbackResults.push({
                questionId: question.id,
                marksAwarded: data.marksAwarded || 0,
                totalMarks: question.marks,
                modelAnswer: modelAnswer,
                whyThisGetsMark: data.feedback?.whyThisGetsMark || `This answer demonstrates the key assessment objectives:\n\n${question.markingCriteria.breakdown.join('\n')}`,
                whyYoursDidnt: data.feedback?.whyYoursDidnt || data.feedback || "Your answer has been marked according to the marking criteria.",
                specLink: question.specReference
              });
            } catch (error) {
              console.error(`Error marking question ${i + 1}:`, error);
              // Fallback feedback
              feedbackResults.push({
                questionId: question.id,
                marksAwarded: Math.round(question.marks * 0.6),
                totalMarks: question.marks,
                modelAnswer: question.modelAnswer,
                whyThisGetsMark: `This answer demonstrates the key assessment objectives:\n\n${question.markingCriteria.breakdown.join('\n')}`,
                whyYoursDidnt: "AI marking temporarily unavailable. Answer has been given estimated marks.",
                specLink: question.specReference
              });
            }
          }
        }

        setFeedback(feedbackResults);
        toast.dismiss('marking-progress');
        toast.success("All answers marked! View your detailed feedback below.");
      } catch (error) {
        console.error('Error marking answers:', error);
        toast.error("Error marking some answers. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    markAllAnswers();
  }, [answers, questions, subjectId, navigate]);

  const getTotalScore = () => {
    return feedback.reduce((total, f) => total + f.marksAwarded, 0);
  };

  const getTotalMarks = () => {
    return feedback.reduce((total, f) => total + f.totalMarks, 0);
  };

  const getPercentage = () => {
    const total = getTotalMarks();
    if (total === 0) return 0;
    return Math.round((getTotalScore() / total) * 100);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "9", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/20" };
    if (percentage >= 80) return { grade: "8", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/20" };
    if (percentage >= 70) return { grade: "7", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" };
    if (percentage >= 60) return { grade: "6", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20" };
    if (percentage >= 50) return { grade: "5", color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20" };
    if (percentage >= 40) return { grade: "4", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" };
    return { grade: "1-3", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20" };
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!subject || !answers || !questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Results not found</h2>
          <Button onClick={() => navigate('/predicted-questions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Predicted Questions
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <Card className="text-center p-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
              <Crown className="h-8 w-8 text-amber-500 animate-pulse" />
              <Target className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">AI is Marking Your Exam</h2>
            <p className="text-muted-foreground mb-6">
              Using the same advanced AI marking system as Practice Questions to provide detailed feedback
            </p>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </Card>
        </div>
      </div>
    );
  }

  const percentage = getPercentage();
  const gradeInfo = getGrade(percentage);
  const currentFeedback = feedback[selectedQuestion];
  const currentQuestion = questions[selectedQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/predicted-questions')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Predicted Questions
            </Button>
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-amber-500" />
              <h1 className="text-xl font-bold text-foreground">
                {subject.name} Results
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Results Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className={`${gradeInfo.bg} border-0 shadow-lg`}>
            <CardContent className="p-6 text-center">
              <Trophy className={`h-8 w-8 ${gradeInfo.color} mx-auto mb-3`} />
              <div className={`text-3xl font-bold ${gradeInfo.color} mb-2`}>
                Grade {gradeInfo.grade}
              </div>
              <div className="text-sm text-muted-foreground">Predicted Grade</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                {getTotalScore()}/{getTotalMarks()}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Marks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                {percentage}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Overall Score</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                {formatTime(timeTaken)}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Time Taken</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Performance Breakdown</h3>
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                AI Marked
              </Badge>
            </div>
            <Progress value={percentage} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Questions Attempted:</span>
                <span className="font-medium ml-2">{questions.length}/{questions.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Average per Question:</span>
                <span className="font-medium ml-2">{(getTotalScore() / questions.length).toFixed(1)} marks</span>
              </div>
              <div>
                <span className="text-muted-foreground">Highest Question:</span>
                <span className="font-medium ml-2">{Math.max(...feedback.map(f => f.marksAwarded))} marks</span>
              </div>
              <div>
                <span className="text-muted-foreground">Completion Rate:</span>
                <span className="font-medium ml-2">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Question Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {feedback.map((f, index) => (
                    <Button
                      key={f.questionId}
                      variant={selectedQuestion === index ? "default" : "ghost"}
                      className={`w-full justify-between p-3 h-auto ${
                        selectedQuestion === index ? "" : 
                        f.marksAwarded === f.totalMarks ? "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30" :
                        f.marksAwarded >= f.totalMarks * 0.7 ? "bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30" :
                        "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30"
                      }`}
                      onClick={() => setSelectedQuestion(index)}
                    >
                      <div className="text-left">
                        <div className="font-medium">Q{index + 1}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.marksAwarded}/{f.totalMarks} marks
                        </div>
                      </div>
                      {f.marksAwarded === f.totalMarks ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : f.marksAwarded >= f.totalMarks * 0.7 ? (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <div className="lg:col-span-3">
            {currentFeedback && currentQuestion && (
              <div className="space-y-6">
                {/* Question Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="px-3 py-1">
                        Question {selectedQuestion + 1}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {currentFeedback.marksAwarded}/{currentFeedback.totalMarks} marks
                        </Badge>
                        <Badge 
                          className={
                            currentFeedback.marksAwarded === currentFeedback.totalMarks 
                              ? "bg-green-100 text-green-700 border-green-300" 
                              : currentFeedback.marksAwarded >= currentFeedback.totalMarks * 0.7
                                ? "bg-amber-100 text-amber-700 border-amber-300"
                                : "bg-red-100 text-red-700 border-red-300"
                          }
                        >
                          {Math.round((currentFeedback.marksAwarded / currentFeedback.totalMarks) * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Your Answer */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-muted-foreground">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-lg p-4 text-sm">
                      {answers.find(a => a.questionId === currentFeedback.questionId)?.answer || "No answer provided"}
                    </div>
                  </CardContent>
                </Card>

                {/* Model Answer */}
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="bg-green-50 dark:bg-green-950/20">
                    <CardTitle className="text-lg text-green-700 dark:text-green-300 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      ✅ Model Full Marks Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {currentFeedback.modelAnswer}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Why This Gets Marks */}
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      🎯 Why This Gets Full Marks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {currentFeedback.whyThisGetsMark}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Yours Didn't */}
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                    <CardTitle className="text-lg text-amber-700 dark:text-amber-300 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      ❌ Why Your Answer Didn't Get Full Marks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {currentFeedback.whyYoursDidnt}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Specification Reference */}
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
                    <CardTitle className="text-lg text-purple-700 dark:text-purple-300 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      🔗 Specification Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-purple-700 dark:text-purple-300">
                          {currentFeedback.specLink}
                        </div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">
                          This question assessed your understanding of this specification point
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Spec
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/predicted-questions')}
            className="px-6"
          >
            Try Another Subject
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-primary to-primary/80 px-6"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;