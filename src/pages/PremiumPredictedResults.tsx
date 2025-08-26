import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw, Book, Lightbulb, HelpCircle, User, StickyNote, Brain } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";

interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  marks: number;
  section?: string;
  question?: string;
  modelAnswer?: string;
  markingCriteria?: any;
  specReference?: string;
}

interface ExamAnswer {
  questionId: string;
  answer: string;
}

interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  score: number;
  feedback: {
    modelAnswer: string;
    whyThisGetsMark: string;
    whyYoursDidnt: string;
    specLink: string;
    fullMarks?: boolean;
  };
}

const PremiumPredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isMarking, setIsMarking] = useState(true);
  
  const { questions, answers, timeElapsed, isReview, completion, totalMarks } = location.state || {};
  
  // If no state is provided, show a message instead of redirecting
  if (!questions || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">No Exam Results Found</CardTitle>
                <CardDescription className="text-center">
                  It looks like you haven't completed an exam yet or the session expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button 
                  onClick={() => navigate('/premium-predicted-questions')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Take a Predicted Exam
                </Button>
                <Button 
                  onClick={() => navigate('/premium-dashboard')} 
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/premium-predicted-questions');
    return null;
  }

  // Use exact same AI marking system as Practice.tsx - OPTIMIZED
  const markAnswerWithAI = async (question: ExamQuestion, answer: string, modelAnswer: string) => {
    try {
      console.log('Calling AI marking function with:', { 
        question: question.text || question.question, 
        answer: answer.substring(0, 100) + '...' 
      });

      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.text || question.question,
          userAnswer: answer,
          modelAnswer: modelAnswer,
          markingCriteria: question.markingCriteria || "Standard marking criteria",
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
      
      // Fallback to basic marking
      return {
        marksAwarded: answer.trim() ? Math.round(question.marks * 0.5) : 0,
        feedback: "AI marking temporarily unavailable. Answer has been given partial credit.",
        assessment: "Needs Review"
      };
    }
  };

  useEffect(() => {
    const markAllAnswers = async () => {
      if (!questions || !answers || !subjectId) {
        console.error('Missing questions, answers, or subjectId');
        return;
      }

      const calculatedTotalMarks = questions.reduce((sum: number, question: ExamQuestion) => sum + question.marks, 0);

      const initialAttempts: QuestionAttempt[] = [];
      let allMarksAwarded = 0;

      for (const question of questions) {
        const userAnswer = answers.find((a: ExamAnswer) => a.questionId === question.id)?.answer || '';

        try {
          const markingResult = await markAnswerWithAI(
            question,
            userAnswer,
            question.modelAnswer || ''
          );

          const feedback = {
            modelAnswer: question.modelAnswer || "No model answer available",
            whyThisGetsMark: question.markingCriteria?.breakdown?.join('\n') || "No specific marking criteria provided",
            whyYoursDidnt: markingResult.feedback,
            specLink: question.specReference || "No specification link provided",
            fullMarks: markingResult.marksAwarded === question.marks
          };

          const attempt: QuestionAttempt = {
            questionId: question.id,
            userAnswer,
            score: markingResult.marksAwarded,
            feedback
          };

          initialAttempts.push(attempt);
          allMarksAwarded += markingResult.marksAwarded;

          // Generate notebook notes if marks were lost
          const marksLost = question.marks - markingResult.marksAwarded;
          if (marksLost > 0) {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user?.id) {
                await NotebookGenerator.generateAndSaveNotes(
                  user.id,
                  {
                    ...question,
                    question: question.text || question.question
                  },
                  userAnswer,
                  marksLost,
                  subjectId || '',
                  'predicted-exam'
                );
              }
            } catch (error) {
              console.error('Error generating notebook notes:', error);
            }
          }

        } catch (error) {
          console.error('Error marking question:', question.id, error);
          toast.error(`Failed to mark question ${question.questionNumber}. Please try again.`);

          const feedback = {
            modelAnswer: question.modelAnswer || "No model answer available",
            whyThisGetsMark: question.markingCriteria?.breakdown?.join('\n') || "No specific marking criteria provided",
            whyYoursDidnt: "AI marking failed. Please review manually.",
            specLink: question.specReference || "No specification link provided",
            fullMarks: false
          };

          const attempt: QuestionAttempt = {
            questionId: question.id,
            userAnswer,
            score: 0,
            feedback
          };

          initialAttempts.push(attempt);
        }
      }

      setAttempts(initialAttempts);
      setIsMarking(false);

      // Save exam completion data - simplified structure
      if (!isReview) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.id) {
            const { error } = await supabase
              .from('predicted_exam_completions')
              .insert({
                user_id: user.id,
                subject_id: subjectId,
                grade: getGCSEGrade(Math.round((allMarksAwarded / calculatedTotalMarks) * 100)),
                percentage: Math.round((allMarksAwarded / calculatedTotalMarks) * 100),
                completed_at: new Date().toISOString(),
                questions: questions,
                answers: answers,
                achieved_marks: allMarksAwarded,
                results: JSON.stringify({ attempts: initialAttempts }),
                time_taken_seconds: timeElapsed,
                total_marks: calculatedTotalMarks
              });

            if (error) {
              console.error('Error saving exam completion:', error);
            }
          }
        } catch (error) {
          console.error('Error saving exam completion:', error);
        }
      }
    };

    markAllAnswers();
  }, [questions, answers, subjectId, isReview, timeElapsed]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getGCSEGrade = (percentage: number): string => {
    if (percentage >= 90) return '9';
    if (percentage >= 80) return '8';
    if (percentage >= 70) return '7';
    if (percentage >= 60) return '6';
    if (percentage >= 50) return '5';
    if (percentage >= 40) return '4';
    if (percentage >= 30) return '3';
    if (percentage >= 20) return '2';
    if (percentage >= 10) return '1';
    return 'U';
  };

  // Show loading while marking
  if (isMarking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-8"></div>
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl px-12 py-8 shadow-2xl shadow-primary/10 max-w-md">
            <h3 className="text-2xl font-bold text-foreground mb-4">Marking Your Exam</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Our AI is carefully reviewing each answer and providing detailed feedback...
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Analyzing your responses</p>
              <p>✓ Applying marking criteria</p>
              <p>✓ Generating personalized feedback</p>
              <p>✓ Creating revision notes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const maxPossibleScore = totalMarks || attempts.reduce((sum, a) => sum + 10, 0); // Fallback to 10 marks per question
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  const grade = getGCSEGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl shadow-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/premium-predicted-questions')}
                className="hover:bg-muted/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Predicted Questions
              </Button>
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-yellow-500" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">{subject.name} Results</h1>
                  <p className="text-sm text-muted-foreground">Premium Predicted Exam</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Results Summary */}
        <Card className="mb-8 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-xl border border-border/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-3xl font-bold">Exam Complete!</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Your predicted exam has been marked and graded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  ['9', '8', '7'].includes(grade) ? 'text-green-600' :
                  ['6', '5', '4'].includes(grade) ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  Grade {grade}
                </div>
                <div className="text-sm text-muted-foreground">GCSE Grade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{totalScore}</div>
                <div className="text-sm text-muted-foreground">Marks Awarded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-muted-foreground mb-2">{formatTime(timeElapsed || 0)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>
            
            <Progress value={percentage} className="h-3 mb-6" />
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => navigate(`/premium-predicted-exam/${subjectId}`)}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Exam
              </Button>
              <Button 
                onClick={() => navigate('/premium-predicted-questions')} 
                variant="outline"
              >
                Try Different Subject
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question by Question Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Question by Question Breakdown</h2>
          
          {attempts.map((attempt, index) => (
            <Card key={attempt.questionId} className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-2">
                      Question {index + 1}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={attempt.score > 0 ? "default" : "destructive"}>
                        {attempt.score} marks
                      </Badge>
                      {attempt.feedback.fullMarks && (
                        <Badge variant="default" className="bg-green-600">
                          Full Marks!
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {attempt.score > 0 ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    Model Answer
                  </h4>
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {attempt.feedback.modelAnswer}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Feedback on Your Answer
                  </h4>
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {attempt.feedback.whyYoursDidnt}
                    </p>
                  </div>
                </div>

                {attempt.feedback.specLink && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Specification Reference
                    </h4>
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <p className="text-sm text-foreground">
                        {attempt.feedback.specLink}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-12">
          <Button 
            onClick={() => navigate(`/premium-predicted-exam/${subjectId}`)}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Exam
          </Button>
          <Button 
            onClick={() => navigate('/premium-predicted-questions')}
            variant="outline"
          >
            Try Different Subject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPredictedResults;
