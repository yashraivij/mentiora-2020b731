import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Crown, Trophy, Clock, BookOpen, CheckCircle, Target, Star, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExamAttempt {
  questionId: string;
  userAnswer: string;
  score: number;
  maxScore: number;
}

interface Question {
  id: string;
  question: string;
  marks: number;
  modelAnswer: string;
  markingCriteria: string[];
  specReference: string;
  section?: string;
}

interface QuestionResult {
  question: Question;
  attempt: ExamAttempt;
  score: number;
  grade: string;
  feedback: string;
}

const PredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const subject = curriculum.find(s => s.id === subjectId);
  const { attempts, questions, timeTaken, timeLimit } = location.state || {};

  useEffect(() => {
    if (!attempts || !questions) {
      navigate('/predicted-questions');
      return;
    }

    markExam();
  }, [attempts, questions]);

  const markExam = async () => {
    if (!attempts || !questions) return;

    setIsLoading(true);
    const questionResults: QuestionResult[] = [];

    for (const question of questions) {
      const attempt = attempts.find((a: ExamAttempt) => a.questionId === question.id);
      
      if (!attempt) {
        questionResults.push({
          question,
          attempt: { questionId: question.id, userAnswer: "", score: 0, maxScore: question.marks },
          score: 0,
          grade: "Not Attempted",
          feedback: "No answer provided"
        });
        continue;
      }

      try {
        // Call AI marking function
        const { data, error } = await supabase.functions.invoke('mark-answer', {
          body: {
            question: question.question,
            userAnswer: attempt.userAnswer,
            modelAnswer: question.modelAnswer,
            markingCriteria: question.markingCriteria,
            totalMarks: question.marks,
            subjectId: subjectId
          }
        });

        if (error) {
          console.error('Marking error:', error);
          throw error;
        }

        const score = data?.marksAwarded || 0;
        const percentage = (score / question.marks) * 100;
        
        let grade = "Needs Improvement";
        if (percentage >= 85) grade = "Excellent";
        else if (percentage >= 70) grade = "Very Good";
        else if (percentage >= 60) grade = "Good";
        else if (percentage >= 40) grade = "Satisfactory";

        questionResults.push({
          question,
          attempt: { ...attempt, score },
          score,
          grade,
          feedback: data?.feedback || "No feedback available"
        });

      } catch (error) {
        console.error('Error marking question:', error);
        
        // Fallback marking
        const score = attempt.userAnswer.trim() ? Math.round(question.marks * 0.5) : 0;
        questionResults.push({
          question,
          attempt: { ...attempt, score },
          score,
          grade: "Needs Review",
          feedback: "AI marking temporarily unavailable"
        });
      }
    }

    setResults(questionResults);
    setIsLoading(false);

    // Save results to database
    try {
      const totalMarks = questions.reduce((sum: number, q: Question) => sum + q.marks, 0);
      const achievedMarks = questionResults.reduce((sum, r) => sum + r.score, 0);
      const percentage = (achievedMarks / totalMarks) * 100;
      
      let grade = "U";
      if (percentage >= 90) grade = "9";
      else if (percentage >= 80) grade = "8";
      else if (percentage >= 70) grade = "7";
      else if (percentage >= 60) grade = "6";
      else if (percentage >= 50) grade = "5";
      else if (percentage >= 40) grade = "4";
      else if (percentage >= 30) grade = "3";
      else if (percentage >= 20) grade = "2";
      else if (percentage >= 10) grade = "1";

      await supabase
        .from('predicted_exam_completions')
        .insert({
          user_id: user?.id,
          subject_id: subjectId,
          total_marks: totalMarks,
          achieved_marks: achievedMarks,
          percentage: percentage,
          grade: grade,
          time_taken_seconds: timeTaken,
          questions: questions as any,
          answers: attempts as any,
          results: questionResults as any
        });

      toast.success("Exam results saved!");
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const unlockFeedback = () => {
    setShowFeedback(true);
    toast.success("Detailed feedback unlocked!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center animate-pulse">
            <Crown className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AI is marking your exam...</h2>
          <p className="text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No results available</h2>
          <Button onClick={() => navigate('/predicted-questions')}>
            Back to Predicted Questions
          </Button>
        </div>
      </div>
    );
  }

  const totalMarks = results.reduce((sum, r) => sum + r.question.marks, 0);
  const achievedMarks = results.reduce((sum, r) => sum + r.score, 0);
  const percentage = (achievedMarks / totalMarks) * 100;
  
  let overallGrade = "U";
  if (percentage >= 90) overallGrade = "9";
  else if (percentage >= 80) overallGrade = "8";
  else if (percentage >= 70) overallGrade = "7";
  else if (percentage >= 60) overallGrade = "6";
  else if (percentage >= 50) overallGrade = "5";
  else if (percentage >= 40) overallGrade = "4";
  else if (percentage >= 30) overallGrade = "3";
  else if (percentage >= 20) overallGrade = "2";
  else if (percentage >= 10) overallGrade = "1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/predicted-questions')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {subject?.name} - Exam Results
                </h1>
                <div className="flex items-center space-x-2">
                  <Crown className="h-3 w-3 text-amber-500" />
                  <span className="text-xs font-medium text-muted-foreground">Predicted 2026 Paper</span>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Results Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 dark:from-primary/10 dark:via-primary/20 dark:to-accent/10 border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl text-foreground mb-2">
                Grade {overallGrade}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {achievedMarks}/{totalMarks} marks ({percentage.toFixed(1)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">{results.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {results.filter(r => r.score === r.question.marks).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Perfect Scores</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatTime(timeTaken || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {timeTaken <= timeLimit ? 'On Time' : 'Overtime'}
                  </div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Progress value={percentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Unlock */}
        {!showFeedback && (
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Unlock Detailed Feedback
              </h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Get model answers, marking breakdowns, and personalized AI teacher feedback for each question.
              </p>
              <Button 
                onClick={unlockFeedback}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              >
                <Zap className="h-4 w-4 mr-2" />
                Unlock Premium Feedback
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Question Results */}
        {showFeedback && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Detailed Question Feedback</h2>
            </div>

            {results.map((result, index) => (
              <Card key={result.question.id} className="overflow-hidden border-l-4 border-l-primary/50">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">
                      Question {index + 1}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{result.question.marks} marks</Badge>
                      {result.question.section && (
                        <Badge variant="secondary">Section {result.question.section}</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {result.question.question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* AI Teacher Feedback Header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                        AI Teacher Feedback
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-emerald-600">
                          {result.score}/{result.question.marks}
                        </span>
                        <span className="text-sm text-muted-foreground">marks</span>
                      </div>
                    </div>
                    <Badge className={
                      result.grade === "Excellent" ? "bg-emerald-500 text-white" :
                      result.grade === "Very Good" ? "bg-blue-500 text-white" :
                      result.grade === "Good" ? "bg-green-500 text-white" :
                      result.grade === "Satisfactory" ? "bg-yellow-500 text-white" :
                      "bg-red-500 text-white"
                    }>
                      {result.grade}
                    </Badge>
                  </div>

                  {/* Model Answer */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center text-lg">
                      <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                      Model Answer
                    </h4>
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border-l-4 border-emerald-500">
                      <p className="text-foreground leading-relaxed">{result.question.modelAnswer}</p>
                    </div>
                  </div>

                  {/* Why This Gets Full Marks */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center text-lg">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      Why This Gets Full Marks
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                      <ul className="space-y-2">
                        {result.question.markingCriteria.map((criteria, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                            <span className="text-foreground">{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Teacher Feedback */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center text-lg">
                      <Zap className="h-5 w-5 mr-2 text-purple-600" />
                      AI Teacher Feedback
                    </h4>
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border-l-4 border-purple-500">
                      <p className="text-foreground leading-relaxed">{result.feedback}</p>
                    </div>
                  </div>

                  {/* Specification Reference */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Specification Reference</h4>
                    <Badge variant="outline" className="text-muted-foreground">
                      {result.question.specReference}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate('/predicted-questions')} variant="outline" className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Try Another Subject
          </Button>
          <Button 
            onClick={() => navigate(`/predicted-exam/${subjectId}`)} 
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Retake Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;