import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw, Book, Lightbulb, HelpCircle, User } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const PredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isMarking, setIsMarking] = useState(true);
  
  const { questions, answers, timeElapsed, isReview, completion, totalMarks } = location.state || {};
  
  if (!questions || !answers) {
    navigate('/predicted-questions');
    return null;
  }

  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
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
          markingCriteria: question.markingCriteria || generateMarkingCriteria(question.text || question.question || '', question.marks),
          totalMarks: question.marks,
          subjectId: subjectId
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

  const generateMarkingCriteria = (questionText: string, marks: number): string => {
    const question = questionText.toLowerCase();
    
    // Generate marking criteria based on actual question marks
    if (marks === 1) {
      return "AO1 (Knowledge): Demonstrate understanding of key concept (1 mark)";
    }
    
    if (marks === 2) {
      return "AO1 (Knowledge): Demonstrate understanding of key concept (1 mark)\nAO2 (Application): Apply knowledge correctly to context (1 mark)";
    }
    
    if (marks === 3) {
      return "AO1 (Knowledge): Demonstrate understanding of key concepts (1 mark)\nAO2 (Application): Apply knowledge correctly to context (1 mark)\nAO3 (Analysis): Use appropriate terminology and show clear reasoning (1 mark)";
    }
    
    if (marks === 4) {
      return "AO1 (Knowledge): Demonstrate comprehensive understanding (1 mark)\nAO2 (Application): Apply knowledge correctly to specific context (1 mark)\nAO2 (Application): Provide relevant examples or evidence (1 mark)\nAO3 (Analysis): Use appropriate terminology and clear reasoning (1 mark)";
    }
    
    if (marks === 5) {
      return "AO1 (Knowledge): Demonstrate comprehensive understanding (2 marks)\nAO2 (Application): Apply knowledge correctly to specific context (2 marks)\nAO3 (Analysis): Use appropriate terminology and show clear reasoning (1 mark)";
    }
    
    if (marks === 6) {
      return "AO1 (Knowledge): Demonstrate comprehensive understanding (2 marks)\nAO2 (Application): Apply knowledge correctly to specific context (2 marks)\nAO3 (Analysis): Use appropriate terminology and detailed reasoning (1 mark)\nAO3 (Evaluation): Show clear analysis and evaluation of information (1 mark)";
    }
    
    // Default for other marks
    const aoMarks = Math.ceil(marks / 3);
    return `AO1 (Knowledge): Demonstrate understanding of key concepts (${aoMarks} marks)\nAO2 (Application): Apply knowledge correctly to context (${aoMarks} marks)\nAO3 (Analysis): Use appropriate terminology and reasoning (${marks - (aoMarks * 2)} marks)`;
  };

  const generateSpecReference = (questionText: string, subject: string): string => {
    const question = questionText.toLowerCase();
    
    if (subject === 'chemistry') {
      if (question.includes('atomic structure')) return "4.1.1 - Atomic Structure";
      if (question.includes('periodic')) return "4.1.2 - Periodic Table";
      if (question.includes('bond') || question.includes('ionic') || question.includes('covalent')) return "4.2 - Bonding and Structure";
      if (question.includes('mole') || question.includes('calculate')) return "4.3 - Quantitative Chemistry";
      if (question.includes('energy') || question.includes('enthalpy')) return "4.5 - Energy Changes";
      if (question.includes('rate') || question.includes('catalyst')) return "4.6 - Rate and Extent of Chemical Change";
      if (question.includes('acid') || question.includes('ph')) return "4.4 - Chemical Changes";
      return "4.1 - Atomic Structure and Periodic Table";
    }
    
    if (subject === 'physics') {
      if (question.includes('force') || question.includes('motion')) return "4.1 - Forces";
      if (question.includes('energy') || question.includes('power')) return "4.2 - Energy";
      if (question.includes('wave') || question.includes('frequency')) return "4.3 - Waves";
      if (question.includes('electric') || question.includes('current')) return "4.4 - Electricity";
      if (question.includes('magnetic') || question.includes('field')) return "4.5 - Magnetism and Electromagnetism";
      if (question.includes('particle') || question.includes('atom')) return "4.6 - Particle Model of Matter";
      return "4.1 - Energy";
    }
    
    if (subject === 'biology') {
      if (question.includes('cell') || question.includes('organelle')) return "4.1 - Cell Biology";
      if (question.includes('enzyme') || question.includes('protein')) return "4.1.1 - Cell Structure and Transport";
      if (question.includes('photosynthesis')) return "4.4.1 - Photosynthesis";
      if (question.includes('respiration')) return "4.4.2 - Respiration";
      if (question.includes('inheritance') || question.includes('gene')) return "4.6 - Inheritance and Variation";
      if (question.includes('evolution') || question.includes('selection')) return "4.6.2 - Evolution";
      return "4.1 - Cell Biology";
    }
    
    return `${subject.charAt(0).toUpperCase() + subject.slice(1)} Specification`;
  };

  const generateModelAnswer = async (questionText: string, marks: number): Promise<string> => {
    try {
      console.log('Generating AI model answer for question:', questionText.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('generate-model-answer', {
        body: {
          question: questionText,
          subjectId: subjectId,
          marks: marks
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI model answer generated successfully');
      return data.modelAnswer || generateFallbackModelAnswer(questionText);

    } catch (error) {
      console.error('Error generating AI model answer:', error);
      // Fallback to improved static model answer
      return generateFallbackModelAnswer(questionText);
    }
  };

  const generateFallbackModelAnswer = (questionText: string): string => {
    const question = questionText.toLowerCase();
    
    // Generate specific model answers based on question content
    if (question.includes('photosynthesis')) {
      return "Carbon dioxide + Water → Glucose + Oxygen (in the presence of light energy and chlorophyll). This process occurs in chloroplasts and converts light energy into chemical energy stored in glucose.";
    }
    
    if (question.includes('respiration')) {
      return "Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP). This process occurs in mitochondria and releases energy from glucose for life processes.";
    }
    
    if (question.includes('calculate') && question.includes('mole')) {
      return "Use the formula: moles = mass ÷ Mr. For example, if 24g of carbon (Mr = 12): moles = 24 ÷ 12 = 2 moles.";
    }
    
    if (question.includes('force') && question.includes('calculate')) {
      return "Use Newton's second law: Force = Mass × Acceleration (F = ma). Substitute the given values and calculate in Newtons (N).";
    }
    
    return "This answer should demonstrate clear understanding of the key concepts, apply relevant knowledge to the specific context, and use appropriate scientific terminology.";
  };
  
  // Calculate GCSE grade based on percentage
  const getGCSEGrade = (percentage: number): string => {
    if (percentage >= 90) return "9";
    if (percentage >= 80) return "8";
    if (percentage >= 70) return "7";
    if (percentage >= 60) return "6";
    if (percentage >= 50) return "5";
    if (percentage >= 40) return "4";
    if (percentage >= 30) return "3";
    if (percentage >= 20) return "2";
    if (percentage >= 10) return "1";
    return "U";
  };

  // Save exam completion to database
  const saveExamCompletion = async (markedAttempts: QuestionAttempt[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, skipping database save');
        return;
      }

      // Calculate results - use passed totalMarks for English Literature (60) or calculate for other subjects
      const examTotalMarks = totalMarks || questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
      const achievedMarks = markedAttempts.reduce((sum: number, attempt: QuestionAttempt) => sum + attempt.score, 0);
      const percentage = examTotalMarks > 0 ? Math.round((achievedMarks / examTotalMarks) * 100) : 0;
      const grade = getGCSEGrade(percentage);

      const examCompletion = {
        user_id: user.id,
        subject_id: subjectId === 'geography-paper-2' ? 'geography' : subjectId,
        exam_date: new Date().toISOString().split('T')[0],
        total_marks: examTotalMarks,
        achieved_marks: achievedMarks,
        percentage: percentage,
        grade: grade,
        time_taken_seconds: timeElapsed || 0,
        questions: questions as any,
        answers: answers as any,
        results: markedAttempts as any
      };

      console.log('Saving exam completion to database:', examCompletion);

      const { error } = await supabase
        .from('predicted_exam_completions')
        .insert(examCompletion);

      if (error) {
        console.error('Database error saving exam completion:', error);
        toast.error("Failed to save exam results to database");
      } else {
        console.log('Exam completion saved successfully');
        toast.success("Exam results saved successfully!");
      }
    } catch (error) {
      console.error('Error saving exam completion:', error);
      toast.error("Failed to save exam results");
    }
  };

  // Mark all answers using same system as Practice.tsx - OPTIMIZED for speed
  const markAllAnswers = async () => {
    console.log('Starting to mark all answers in parallel...');
    setIsMarking(true);
    
    try {
      // Process all questions in parallel for much faster marking
      const markingPromises = questions.map(async (question: ExamQuestion, index: number) => {
        const answer = answers.find((a: ExamAnswer) => a.questionId === question.id);
        
        console.log(`Processing question ${index + 1}/${questions.length}:`, question.text?.substring(0, 50) + '...');
        
        if (answer) {
          try {
            // Generate model answer first, then use it for marking in parallel
            const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
            const markingResult = await markAnswerWithAI(question, answer.answer, aiModelAnswer);
            
            // Determine if full marks were achieved
            const fullMarks = markingResult.marksAwarded === question.marks;
            
            const feedback = {
              modelAnswer: aiModelAnswer,
              whyThisGetsMark: generateMarkingCriteria(question.text || question.question || '', question.marks),
              whyYoursDidnt: fullMarks 
                ? `Excellent work! Your answer demonstrates strong understanding and addresses all key points effectively. You've shown good use of subject terminology and clear reasoning.`
                : markingResult.feedback,
              specLink: question.specReference || generateSpecReference(question.text || question.question || '', subjectId || ''),
              fullMarks: fullMarks
            };

            const attempt: QuestionAttempt = {
              questionId: question.id,
              userAnswer: answer.answer,
              score: markingResult.marksAwarded,
              feedback
            };
            
            console.log(`Question ${index + 1} marked with score: ${markingResult.marksAwarded}/${question.marks}`);
            return attempt;
            
          } catch (error) {
            console.error('Error marking question:', error);
            
            // Fallback attempt with AI model answer
            const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
            
            const attempt: QuestionAttempt = {
              questionId: question.id,
              userAnswer: answer.answer,
              score: 0,
              feedback: {
                modelAnswer: aiModelAnswer,
                whyThisGetsMark: generateMarkingCriteria(question.text || question.question || '', question.marks),
                whyYoursDidnt: "Unable to mark this answer automatically. Please review with your teacher.",
                specLink: generateSpecReference(question.text || question.question || '', subjectId || '')
              }
            };
            
            return attempt;
          }
        } else {
          console.log(`No answer found for question ${index + 1}`);
          // Create empty attempt for unanswered questions
          const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
          
          const attempt: QuestionAttempt = {
            questionId: question.id,
            userAnswer: '',
            score: 0,
            feedback: {
              modelAnswer: aiModelAnswer,
              whyThisGetsMark: generateMarkingCriteria(question.text || question.question || '', question.marks),
              whyYoursDidnt: "No answer provided.",
              specLink: generateSpecReference(question.text || question.question || '', subjectId || '')
            }
          };
          
          return attempt;
        }
      });
      
      // Wait for all questions to be marked in parallel
      const markedAttempts = await Promise.all(markingPromises);
      
      console.log('All answers marked in parallel, setting results...', markedAttempts);
      setAttempts(markedAttempts);
      
      // Save to database (only if not reviewing existing completion)
      if (!isReview) {
        await saveExamCompletion(markedAttempts);
      }
      
      toast.success("Exam marked successfully!");
      
    } catch (error) {
      console.error('Error in markAllAnswers:', error);
      toast.error("Failed to mark exam. Please try refreshing the page.");
    } finally {
      setIsMarking(false);
      console.log('Marking completed, isMarking set to false');
    }
  };
  
  useEffect(() => {
    if (questions && answers) {
      markAllAnswers();
    }
  }, [questions, answers]);

  if (isMarking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <CardTitle className="text-foreground">Marking Your Predicted 2026 Exam</CardTitle>
            <CardDescription className="text-muted-foreground">
              AI is analyzing your answers with premium marking intelligence...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-medium text-foreground">
                Applying AQA mark schemes with advanced AI analysis
              </div>
              <Progress value={100} className="w-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total marks and grade - use passed totalMarks for English Literature (60) or calculate for other subjects
  const examTotalMarks = totalMarks || questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = attempts.reduce((sum: number, attempt: QuestionAttempt) => sum + attempt.score, 0);
  const percentage = examTotalMarks > 0 ? Math.round((achievedMarks / examTotalMarks) * 100) : 0;


  const grade = getGCSEGrade(percentage);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/predicted-questions')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {subject?.name} - Predicted Exam Results
                </h1>
                <p className="text-sm text-muted-foreground">
                  Marked using the same AI system as Practice Questions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {achievedMarks}/{examTotalMarks}
                </div>
                <div className="text-sm text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Grade Display Banner */}
          <Card className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white border-0">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold">
                  Grade {grade}
                </div>
                <div className="text-xl">
                  {achievedMarks}/{examTotalMarks} marks ({percentage}%)
                </div>
                <div className="text-lg opacity-90">
                  {subject?.name} Predicted 2026 Exam
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Detailed Results Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{achievedMarks}</div>
                  <div className="text-sm text-muted-foreground">Marks Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{examTotalMarks}</div>
                  <div className="text-sm text-muted-foreground">Total Marks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Percentage</div>
                </div>
              </div>
              <Progress value={percentage} className="mt-4" />
            </CardContent>
          </Card>

          {/* Question by Question Feedback */}
          {attempts.map((attempt, index) => (
            <Card key={attempt.questionId} className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {index + 1}
                    </div>
                    Question {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {attempt.score}/{questions[index]?.marks || 5} marks
                    </Badge>
                    <Badge 
                      variant={attempt.score >= (questions[index]?.marks || 5) * 0.85 ? "default" : 
                             attempt.score >= (questions[index]?.marks || 5) * 0.6 ? "secondary" : "destructive"}
                    >
                      {attempt.score >= (questions[index]?.marks || 5) * 0.85 ? "Excellent" : 
                       attempt.score >= (questions[index]?.marks || 5) * 0.6 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-blue-600" />
                    Question
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-foreground">{questions[index]?.text || questions[index]?.question}</p>
                  </div>
                </div>

                {/* Student Answer */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-purple-600" />
                    Your Answer
                  </h4>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-foreground">{attempt.userAnswer}</p>
                  </div>
                </div>

                {/* Model Answer */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Book className="h-4 w-4 mr-2 text-green-600" />
                    ✅ Model Answer
                  </h4>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="text-foreground space-y-2">
                      {attempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                        <p key={index} className="leading-relaxed">{sentence.trim()}{index < attempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).length - 1 ? '.' : ''}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Why This Gets Marks */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                    🎯 Why This Gets Full Marks
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                    <pre className="text-foreground whitespace-pre-wrap font-sans">
                      {attempt.feedback.whyThisGetsMark}
                    </pre>
                  </div>
                </div>

                {/* AI Feedback - Conditional based on performance */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    {attempt.feedback.fullMarks ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        ✅ Teacher Feedback - Well Done!
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                        ❌ Why Your Answer Didn't Get Full Marks
                      </>
                    )}
                  </h4>
                  <div className={`p-4 rounded-lg border-l-4 ${
                    attempt.feedback.fullMarks 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500' 
                      : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500'
                  }`}>
                    <p className="text-foreground">{attempt.feedback.whyYoursDidnt}</p>
                  </div>
                </div>

                {/* Spec Reference */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Book className="h-4 w-4 mr-2 text-indigo-600" />
                    🔗 Specification Reference
                  </h4>
                  <Badge variant="outline" className="text-sm">
                    {attempt.feedback.specLink}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mt-12">
            <Button 
              onClick={() => navigate(`/predicted-exam/${subjectId}`)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake This Exam
            </Button>
            <Button 
              onClick={() => navigate('/predicted-questions')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Try Another Subject
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline"
            >
              <Target className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;