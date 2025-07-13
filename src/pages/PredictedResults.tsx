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

  // Use exact same AI marking system as Practice.tsx
  const markAnswerWithAI = async (question: ExamQuestion, answer: string) => {
    try {
      console.log('Calling AI marking function with:', { 
        question: question.text || question.question, 
        answer: answer.substring(0, 100) + '...' 
      });

      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.text || question.question,
          userAnswer: answer,
          modelAnswer: question.modelAnswer || await generateModelAnswer(question.text || question.question || '', question.marks),
          markingCriteria: question.markingCriteria || generateMarkingCriteria(question.text || question.question || ''),
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
      toast.error("Failed to mark answer with AI. Please try again.");
      
      // Fallback to basic marking
      return {
        marksAwarded: answer.trim() ? Math.round(question.marks * 0.5) : 0,
        feedback: "AI marking temporarily unavailable. Answer has been given partial credit.",
        assessment: "Needs Review"
      };
    }
  };

  const generateMarkingCriteria = (questionText: string): string => {
    const question = questionText.toLowerCase();
    
    // Subject-specific marking criteria with AO breakdown
    if (subjectId === 'chemistry') {
      if (question.includes('balance') && question.includes('equation')) {
        return "AO1 (Knowledge): Recall correct chemical formulae and symbols (1 mark)\nAO2 (Application): Apply balancing rules to achieve correct coefficients (1 mark)\nAO2 (Application): Include state symbols where specified (1 mark)";
      }
      if (question.includes('calculate') && question.includes('mole')) {
        return "AO1 (Knowledge): Recall formula: moles = mass ÷ Mr (1 mark)\nAO2 (Application): Correctly substitute given values (1 mark)\nAO3 (Analysis): Complete calculation with correct units and significant figures (1 mark)";
      }
      if (question.includes('ph') || question.includes('acid')) {
        return "AO1 (Knowledge): Define pH scale and its relationship to H+ concentration (1 mark)\nAO2 (Application): Identify correct pH value for given scenario (1 mark)\nAO3 (Analysis): Explain significance of pH value in context (1 mark)";
      }
      return "AO1 (Knowledge): Demonstrate understanding of chemical concepts and principles (2 marks)\nAO2 (Application): Apply knowledge correctly to the specific context (2 marks)\nAO3 (Analysis): Use appropriate scientific terminology and show clear reasoning (1 mark)";
    }
    
    if (subjectId === 'physics') {
      if (question.includes('calculate') && (question.includes('force') || question.includes('energy') || question.includes('power'))) {
        return "AO1 (Knowledge): Select and state correct formula (1 mark)\nAO2 (Application): Substitute values correctly with appropriate units (1 mark)\nAO3 (Analysis): Complete calculation with correct final answer and units (1 mark)";
      }
      if (question.includes('wave') || question.includes('frequency')) {
        return "AO1 (Knowledge): Demonstrate understanding of wave properties and relationships (1 mark)\nAO2 (Application): Correctly apply wave equation v = fλ (1 mark)\nAO3 (Analysis): Link calculation to physical meaning in given context (1 mark)";
      }
      return "AO1 (Knowledge): Recall physics principles and laws (2 marks)\nAO2 (Application): Apply mathematical relationships correctly (2 marks)\nAO3 (Analysis): Present answer with correct units and appropriate significant figures (1 mark)";
    }
    
    if (subjectId === 'biology') {
      if (question.includes('enzyme') || question.includes('protein')) {
        return "AO1 (Knowledge): Describe structure of enzymes including active site (1 mark)\nAO2 (Application): Explain lock and key/induced fit mechanism (1 mark)\nAO3 (Analysis): Analyse factors affecting enzyme activity with examples (1 mark)";
      }
      if (question.includes('photosynthesis') || question.includes('respiration')) {
        return "AO1 (Knowledge): State correct word or symbol equation (1 mark)\nAO2 (Application): Identify location and cellular structures involved (1 mark)\nAO3 (Analysis): Explain limiting factors and their effects on rate (1 mark)";
      }
      return "AO1 (Knowledge): Demonstrate understanding of biological concepts (2 marks)\nAO2 (Application): Apply knowledge to specific biological context (2 marks)\nAO3 (Analysis): Use scientific terminology and evaluate information (1 mark)";
    }
    
    // Default marking criteria with AO breakdown
    return "AO1 (Knowledge): Demonstrate clear understanding of key concepts (2 marks)\nAO2 (Application): Apply knowledge correctly to the specific question context (2 marks)\nAO3 (Analysis): Use appropriate terminology and show clear reasoning (1 mark)";
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
  
  // Mark all answers using same system as Practice.tsx
  const markAllAnswers = async () => {
    setIsMarking(true);
    const markedAttempts: QuestionAttempt[] = [];
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const answer = answers.find((a: ExamAnswer) => a.questionId === question.id);
      
      if (answer) {
        try {
          const markingResult = await markAnswerWithAI(question, answer.answer);
          
          // Generate AI model answer for this specific question
          const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
          
          const feedback = {
            modelAnswer: aiModelAnswer,
            whyThisGetsMark: generateMarkingCriteria(question.text || question.question || ''),
            whyYoursDidnt: markingResult.feedback,
            specLink: question.specReference || generateSpecReference(question.text || question.question || '', subjectId || '')
          };

          const attempt: QuestionAttempt = {
            questionId: question.id,
            userAnswer: answer.answer,
            score: markingResult.marksAwarded,
            feedback
          };
          
          markedAttempts.push(attempt);
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
              whyThisGetsMark: generateMarkingCriteria(question.text || question.question || ''),
              whyYoursDidnt: "Unable to mark this answer automatically. Please review with your teacher.",
              specLink: generateSpecReference(question.text || question.question || '', subjectId || '')
            }
          };
          
          markedAttempts.push(attempt);
        }
      }
    }
    
    setAttempts(markedAttempts);
    setIsMarking(false);
  };
  
  useEffect(() => {
    markAllAnswers();
  }, []);

  if (isMarking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <CardTitle className="text-foreground">Marking Your Exam</CardTitle>
            <CardDescription className="text-muted-foreground">
              Using the same AI marking system as Practice Questions...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-medium text-foreground">
                AI is analyzing each answer with AQA mark schemes
              </div>
              <Progress value={100} className="w-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total marks
  const totalMarks = questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = attempts.reduce((sum: number, attempt: QuestionAttempt) => sum + attempt.score, 0);
  const percentage = totalMarks > 0 ? Math.round((achievedMarks / totalMarks) * 100) : 0;

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
                  {achievedMarks}/{totalMarks}
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
          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Exam Results Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{achievedMarks}</div>
                  <div className="text-sm text-muted-foreground">Marks Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{totalMarks}</div>
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

                {/* AI Feedback */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                    ❌ Why Your Answer Didn't Get Full Marks
                  </h4>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-500">
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