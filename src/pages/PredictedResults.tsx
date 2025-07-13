import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
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

const PredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { questions, answers, timeElapsed, isReview, completion } = location.state || {};
  
  if (!questions || !answers) {
    navigate('/predicted-questions');
    return null;
  }

  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }

  // Generate marking and feedback for each question - improved marking system
  const generateMarking = (question: ExamQuestion, answer: ExamAnswer) => {
    const studentAnswer = answer.answer.toLowerCase().trim();
    
    if (!studentAnswer) {
      return { marksAwarded: 0, feedback: "No answer provided", modelAnswer: generateModelAnswer(question) };
    }
    
    // Improved marking logic based on content quality
    const wordCount = studentAnswer.split(/\s+/).length;
    const hasScientificTerms = /\b(energy|force|momentum|reaction|element|cell|gene|equation|graph|data|temperature|pressure|volume|density|mass|weight|velocity|acceleration|current|voltage|resistance|atom|molecule|compound|mixture|solution|acid|base|alkali|salt|oxidation|reduction|catalyst|enzyme|mitosis|meiosis|photosynthesis|respiration|ecosystem|biodiversity|evolution|inheritance|variation|homeostasis|reflex|hormone|nervous|circulatory|digestive|respiratory|excretory|reproductive|skeletal|muscular|hypothesis|theory|experiment|variable|control|method|conclusion|analysis|evaluation|calculate|explain|describe|compare|discuss)\b/gi.test(studentAnswer);
    const hasDetailedExplanation = wordCount >= 20;
    const hasExamples = /\b(example|such as|for instance|like|including)\b/gi.test(studentAnswer);
    const hasStructure = /\b(firstly|secondly|finally|because|therefore|however|furthermore|in conclusion)\b/gi.test(studentAnswer);
    
    let marksAwarded = 0;
    let maxMarks = question.marks;
    
    // Award marks based on criteria
    if (hasScientificTerms) marksAwarded += Math.ceil(maxMarks * 0.3);
    if (hasDetailedExplanation) marksAwarded += Math.ceil(maxMarks * 0.4);
    if (hasExamples) marksAwarded += Math.ceil(maxMarks * 0.2);
    if (hasStructure) marksAwarded += Math.ceil(maxMarks * 0.1);
    
    // Ensure minimum mark for effort if answer has substance
    if (wordCount >= 10 && marksAwarded === 0) marksAwarded = 1;
    
    // Cap at maximum marks
    marksAwarded = Math.min(marksAwarded, maxMarks);
    
    const feedback = generateFeedback(question, studentAnswer, marksAwarded);
    const modelAnswer = generateModelAnswer(question);
    
    return { marksAwarded, feedback, modelAnswer };
  };

  const generateFeedback = (question: ExamQuestion, answer: string, marks: number) => {
    if (marks === question.marks) {
      return "Excellent answer! You've demonstrated clear understanding and included all key points.";
    } else if (marks >= question.marks * 0.7) {
      return "Good answer with most key points covered. Consider adding more detail or specific examples.";
    } else if (marks >= question.marks * 0.4) {
      return "Partial understanding shown. You've identified some key concepts but need more detail and explanation.";
    } else {
      return "Your answer needs significant improvement. Focus on key terminology and provide more detailed explanations.";
    }
  };

  const generateModelAnswer = (question: ExamQuestion) => {
    // Generate contextual model answers based on question content
    const questionLower = question.text.toLowerCase();
    
    if (questionLower.includes('energy')) {
      return `A comprehensive answer should define energy as the ability to do work, explain different types of energy (kinetic, potential, thermal, etc.), discuss energy transfers and transformations, and include relevant examples. For ${question.marks} marks, show understanding of energy conservation principles and provide calculations where appropriate.`;
    } else if (questionLower.includes('cell') || questionLower.includes('biology')) {
      return `A complete answer should include relevant biological terminology, explain key processes clearly, describe structures and their functions, and provide specific examples. For ${question.marks} marks, demonstrate understanding of biological concepts and their real-world applications.`;
    } else if (questionLower.includes('equation') || questionLower.includes('calculate')) {
      return `A full answer should show all working clearly, use correct units throughout, state the formula being used, substitute values correctly, and provide the final answer to appropriate significant figures. For ${question.marks} marks, ensure mathematical accuracy and clear presentation.`;
    } else if (questionLower.includes('experiment') || questionLower.includes('method')) {
      return `A detailed answer should outline the experimental procedure step-by-step, identify variables (independent, dependent, control), explain how to ensure accuracy and reliability, describe safety precautions, and suggest improvements. For ${question.marks} marks, show understanding of scientific methodology.`;
    } else {
      return `A comprehensive answer should include: relevant terminology for the topic, clear explanations of key concepts, specific examples to illustrate points, logical structure with good use of connectives, and detailed analysis appropriate to the command word used. For ${question.marks} marks, ensure all aspects of the question are addressed with sufficient detail.`;
    }
  };

  const results = questions.map((q: ExamQuestion) => {
    const answer = answers.find((a: ExamAnswer) => a.questionId === q.id);
    const marking = answer ? generateMarking(q, answer) : { marksAwarded: 0, feedback: "No answer provided", modelAnswer: generateModelAnswer(q) };
    return { question: q, answer, ...marking };
  });

  const totalMarks = questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const percentage = Math.round((achievedMarks / totalMarks) * 100);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "9", color: "text-purple-600" };
    if (percentage >= 80) return { grade: "8", color: "text-indigo-600" };
    if (percentage >= 70) return { grade: "7", color: "text-blue-600" };
    if (percentage >= 60) return { grade: "6", color: "text-green-600" };
    if (percentage >= 50) return { grade: "5", color: "text-yellow-600" };
    if (percentage >= 40) return { grade: "4", color: "text-orange-600" };
    if (percentage >= 30) return { grade: "3", color: "text-red-600" };
    if (percentage >= 20) return { grade: "2", color: "text-red-700" };
    return { grade: "1", color: "text-red-800" };
  };

  const grade = getGrade(percentage);
  const timeFormatted = Math.floor(timeElapsed / 60) + ":" + (timeElapsed % 60).toString().padStart(2, '0');

  // Save exam completion to database (only for new completions)
  useEffect(() => {
    if (isReview) return; // Don't save if this is a review

    const saveExamCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const examData = {
          user_id: user.id,
          subject_id: subjectId,
          total_marks: totalMarks,
          achieved_marks: achievedMarks,
          percentage: percentage,
          grade: grade.grade,
          time_taken_seconds: timeElapsed,
          questions: questions,
          answers: answers,
          results: results
        };

        const { error } = await supabase
          .from('predicted_exam_completions')
          .insert(examData);

        if (error) throw error;

        toast({
          title: "Exam Results Saved",
          description: `Your ${subject?.name} exam has been completed and saved.`
        });

      } catch (error) {
        console.error('Error saving exam completion:', error);
        toast({
          title: "Error",
          description: "Failed to save exam results. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (questions && answers && subject) {
      saveExamCompletion();
    }
  }, [questions, answers, subject, subjectId, totalMarks, achievedMarks, percentage, grade.grade, timeElapsed, results, toast, isReview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/predicted-questions')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Predicted Questions
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Results Header */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-amber-500" />
              <div>
                <CardTitle className="text-2xl font-bold">{subject.name} Exam Results</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <span>AQA GCSE Predicted Paper</span>
                  {isReview && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        Completed: {new Date(completion?.completed_at).toLocaleDateString()}
                      </Badge>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${grade.color} mb-2`}>
                  Grade {grade.grade}
                </div>
                <p className="text-sm text-muted-foreground">Predicted Grade</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {percentage}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {achievedMarks}/{totalMarks}
                </div>
                <p className="text-sm text-muted-foreground">Marks Achieved</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {timeFormatted}
                </div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{achievedMarks}/{totalMarks} marks</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Question by Question Results */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">Detailed Marking & Feedback</h3>
          
          {results.map((result, index) => (
            <Card key={result.question.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Question {result.question.questionNumber}
                    </CardTitle>
                    {result.question.section && (
                      <Badge variant="outline" className="mt-2">
                        Section {result.question.section}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={result.marksAwarded === result.question.marks ? "default" : result.marksAwarded > 0 ? "secondary" : "destructive"}>
                      {result.marksAwarded}/{result.question.marks} marks
                    </Badge>
                    {result.marksAwarded === result.question.marks ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : result.marksAwarded > 0 ? (
                      <Target className="h-5 w-5 text-amber-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Question:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{result.question.text}</p>
                </div>
                
                {result.answer && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Your Answer:</h4>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm whitespace-pre-wrap">{result.answer.answer}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Model Answer:</h4>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-800 dark:text-green-200">{result.modelAnswer}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Feedback:</h4>
                  <div className={`rounded-lg p-3 border ${
                    result.marksAwarded === result.question.marks 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      : result.marksAwarded > 0 
                        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                  }`}>
                    <p className={`text-sm ${
                      result.marksAwarded === result.question.marks 
                        ? 'text-green-800 dark:text-green-200'
                        : result.marksAwarded > 0 
                          ? 'text-amber-800 dark:text-amber-200'
                          : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.feedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => navigate(`/predicted-exam/${subjectId}`)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake This Exam
          </Button>
          <Button variant="outline" onClick={() => navigate('/predicted-questions')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Try Another Subject
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-primary to-primary/90">
            <Target className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;