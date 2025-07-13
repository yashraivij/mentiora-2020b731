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

  // Calculate total marks and grade
  const totalMarks = questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = attempts.reduce((sum: number, attempt: QuestionAttempt) => sum + attempt.score, 0);
  const percentage = totalMarks > 0 ? Math.round((achievedMarks / totalMarks) * 100) : 0;

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

  const grade = getGCSEGrade(percentage);

  // Save exam completion to database
  const saveExamCompletion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const examData = {
        user_id: user.id,
        subject_id: subjectId || '',
        exam_date: new Date().toISOString().split('T')[0],
        total_marks: totalMarks,
        achieved_marks: achievedMarks,
        percentage: percentage,
        grade: grade,
        time_taken_seconds: timeElapsed || 0,
        questions: JSON.parse(JSON.stringify(questions)),
        answers: JSON.parse(JSON.stringify(answers)),
        results: JSON.parse(JSON.stringify(attempts))
      };

      const { error } = await supabase
        .from('predicted_exam_completions')
        .insert(examData);

      if (error) {
        console.error('Error saving exam completion:', error);
      } else {
        console.log('Exam completion saved successfully');
      }
    } catch (error) {
      console.error('Error in saveExamCompletion:', error);
    }
  };

  // Save completion when attempts are ready (only if not review mode)
  useEffect(() => {
    if (attempts.length > 0 && !isReview) {
      saveExamCompletion();
    }
  }, [attempts]);

  const handleRetryIncorrect = () => {
    // Get only the questions that were answered incorrectly
    const incorrectQuestions = questions.filter((q: ExamQuestion, index: number) => {
      const attempt = attempts.find(a => a.questionId === q.id);
      return attempt && attempt.score < q.marks;
    });

    if (incorrectQuestions.length === 0) {
      toast.success("Congratulations! You got all questions correct!");
      return;
    }

    // Navigate to a new exam with only incorrect questions
    navigate(`/predicted-exam/${subjectId}`, { 
      state: { 
        retryQuestions: incorrectQuestions,
        isRetry: true
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="bg-white dark:bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/predicted-questions')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Predicted Questions
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Clean Results Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Great Job!</h1>
          <p className="text-lg text-muted-foreground mb-4">You've completed your {subject?.name} predicted exam</p>
          
          {/* Score Summary */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">Grade {grade}</div>
                <div className="text-sm text-muted-foreground">GCSE Grade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{achievedMarks}/{totalMarks}</div>
                <div className="text-sm text-muted-foreground">Marks Achieved</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button 
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              onClick={() => {
                // Scroll to detailed results section
                document.getElementById('detailed-results')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Review Marking
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5 font-semibold py-3"
              onClick={handleRetryIncorrect}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retry Incorrect
            </Button>
          </div>
        </div>

        {/* Detailed Results Section */}
        <div id="detailed-results" className="space-y-6">
          {/* Question by Question Review */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">📝 Detailed Review & Feedback</h2>
            <p className="text-muted-foreground">Review your answers with AI marking and model solutions</p>
          </div>

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
                    <p className="text-foreground">{attempt.feedback.modelAnswer}</p>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 max-w-2xl mx-auto">
            <Button 
              onClick={handleRetryIncorrect}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-semibold"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retry Incorrect Questions Only
            </Button>
            <Button 
              onClick={() => navigate(`/predicted-exam/${subjectId}`)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 font-semibold"
              size="lg"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Retake Full Exam
            </Button>
            <Button 
              onClick={() => navigate('/predicted-questions')}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Target className="h-5 w-5 mr-2" />
              Back to Subjects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;