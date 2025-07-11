import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, CheckCircle, AlertCircle, Book, Lightbulb, HelpCircle, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

// Fisher-Yates shuffle algorithm to randomize questions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Practice = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [showHint, setShowHint] = useState(false);

  const subject = curriculum.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Save session state to localStorage
  const saveSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionState = {
      currentQuestionIndex,
      userAnswer,
      attempts,
      showFeedback,
      shuffledQuestions: shuffledQuestions.map(q => q.id), // Only save question IDs
      lastSaved: new Date().toISOString()
    };
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    localStorage.setItem(sessionKey, JSON.stringify(sessionState));
  };

  // Load session state from localStorage
  const loadSessionState = () => {
    if (!user?.id || !subjectId || !topicId || !topic) return false;
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    const savedState = localStorage.getItem(sessionKey);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
        // Restore shuffled questions order
        const restoredQuestions = state.shuffledQuestions
          .map((id: string) => topic.questions?.find(q => q.id === id))
          .filter((q: Question | undefined): q is Question => q !== undefined);
        
        if (restoredQuestions.length > 0) {
          setShuffledQuestions(restoredQuestions);
          setCurrentQuestionIndex(state.currentQuestionIndex || 0);
          setUserAnswer(state.userAnswer || "");
          setAttempts(state.attempts || []);
          setShowFeedback(state.showFeedback || false);
          
          toast.success("Previous session restored! Continuing from where you left off.");
          return true;
        }
      } catch (error) {
        console.error('Error loading session state:', error);
      }
    }
    
    return false;
  };

  // Clear session state
  const clearSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    
    const sessionKey = `mentiora_session_${user.id}_${subjectId}_${topicId}`;
    localStorage.removeItem(sessionKey);
  };

  useEffect(() => {
    if (!subject || !topic) {
      navigate('/dashboard');
      return;
    }
    
    // Try to load existing session first
    const sessionRestored = loadSessionState();
    
    // Only shuffle questions if no session was restored
    if (!sessionRestored) {
      const shuffled = shuffleArray(topic.questions || []);
      setShuffledQuestions(shuffled);
    }
  }, [subject, topic, navigate, topicId, user?.id]);

  // Save state whenever important values change
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      saveSessionState();
    }
  }, [currentQuestionIndex, userAnswer, attempts, showFeedback, shuffledQuestions]);

  const markAnswerWithAI = async (question: Question, answer: string) => {
    try {
      console.log('Calling AI marking function with:', { 
        question: question.question, 
        answer: answer.substring(0, 100) + '...' 
      });

      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.question,
          userAnswer: answer,
          modelAnswer: question.modelAnswer,
          markingCriteria: question.markingCriteria,
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

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting to mark answer...');
      
      const markingResult = await markAnswerWithAI(currentQuestion, userAnswer);
      
      const feedback = {
        modelAnswer: currentQuestion.modelAnswer,
        whyThisGetsMark: currentQuestion.markingCriteria.breakdown.join('\n'),
        whyYoursDidnt: markingResult.feedback,
        specLink: currentQuestion.specReference
      };

      const attempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        userAnswer,
        score: markingResult.marksAwarded,
        feedback
      };
      
      setAttempts([...attempts, attempt]);
      setShowFeedback(true);
      
      // Show success toast with score
      toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
      
    } catch (error) {
      console.error('Error marking answer:', error);
      toast.error("Error processing your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setShowHint(false);
    } else {
      finishSession();
    }
  };

  const generateHint = (question: Question) => {
    const questionText = question.question.toLowerCase();
    const modelAnswer = question.modelAnswer.toLowerCase();
    
    // Analyze the main focus of the question by looking at key command words and topics
    const getQuestionFocus = () => {
      // Limiting factors
      if (questionText.includes('limiting factor')) {
        return 'limiting_factors';
      }
      
      // Specific biology processes
      if (questionText.includes('osmosis') && !questionText.includes('photosynthesis')) {
        return 'osmosis';
      }
      if (questionText.includes('photosynthesis') && !questionText.includes('respiration') && !questionText.includes('limiting')) {
        return 'photosynthesis';
      }
      if (questionText.includes('respiration') && !questionText.includes('photosynthesis')) {
        return 'respiration';
      }
      if (questionText.includes('enzyme') && !questionText.includes('photosynthesis')) {
        return 'enzymes';
      }
      
      // Cell biology
      if (questionText.includes('mitosis') || questionText.includes('cell division')) {
        return 'mitosis';
      }
      if (questionText.includes('meiosis')) {
        return 'meiosis';
      }
      if (questionText.includes('cell membrane') || questionText.includes('cell wall')) {
        return 'cell_structure';
      }
      
      // Genetics
      if (questionText.includes('allele') || questionText.includes('genetic') || questionText.includes('inheritance')) {
        return 'genetics';
      }
      if (questionText.includes('mutation')) {
        return 'mutation';
      }
      
      // Ecology
      if (questionText.includes('ecosystem') || questionText.includes('food chain') || questionText.includes('food web')) {
        return 'ecology';
      }
      if (questionText.includes('competition') && questionText.includes('organism')) {
        return 'competition';
      }
      
      // Homeostasis
      if (questionText.includes('homeostasis') || questionText.includes('temperature regulation') || questionText.includes('blood sugar')) {
        return 'homeostasis';
      }
      
      // Evolution
      if (questionText.includes('evolution') || questionText.includes('natural selection')) {
        return 'evolution';
      }
      
      return 'general';
    };
    
    const questionFocus = getQuestionFocus();
    
    // Biology-specific hints based on question focus
    if (subjectId === 'biology') {
      switch (questionFocus) {
        case 'limiting_factors':
          return "Think about what factors can slow down or stop a biological process. Consider light intensity, temperature, and CO₂ concentration for photosynthesis. Explain how the slowest factor controls the overall rate.";
          
        case 'osmosis':
          return "Focus on water movement from high to low water concentration across a partially permeable membrane. Think about what happens to cells in different solutions.";
          
        case 'photosynthesis':
          return "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (with light energy and chlorophyll). Consider where it happens, what's needed, and what's produced.";
          
        case 'respiration':
          return "Aerobic: glucose + oxygen → CO₂ + water + ATP. Anaerobic: glucose → lactic acid + ATP (animals) or ethanol + CO₂ + ATP (plants/yeast).";
          
        case 'enzymes':
          return "Think about the lock and key model, active sites, and how temperature and pH affect enzyme shape and activity. Consider what happens when enzymes denature.";
          
        case 'mitosis':
          return "Cell division producing two identical diploid cells for growth and repair. Think about the stages: prophase, metaphase, anaphase, telophase.";
          
        case 'meiosis':
          return "Cell division producing four genetically different haploid gametes for reproduction. Consider crossing over and independent assortment.";
          
        case 'genetics':
          return "Think about dominant and recessive alleles, homozygous vs heterozygous, and how traits are inherited from parents to offspring.";
          
        case 'homeostasis':
          return "Maintaining constant internal conditions through negative feedback. Think about receptors detecting changes, processing centers, and effectors responding.";
          
        case 'evolution':
          return "Consider variation, inheritance, selection pressure, and time. Think about how advantageous traits become more common in populations.";
          
        case 'ecology':
          return "Think about energy flow through trophic levels, nutrient cycling, and how organisms interact with each other and their environment.";
          
        case 'competition':
          return "Consider what organisms compete for (food, space, mates, light) and how this affects population sizes and distribution.";
          
        default:
          // Fallback for general biology questions
          if (questionText.includes('explain')) {
            return "Structure your answer clearly. Define key terms, explain the process step by step, and give examples where relevant.";
          }
          if (questionText.includes('compare')) {
            return "Identify similarities and differences. Use a table or clear points to contrast the features being compared.";
          }
          return "Read the question carefully and identify the key biological concept being tested. Use appropriate scientific terminology.";
      }
    }
    
    // Mathematics-specific detailed hints
    if (subjectId === 'mathematics') {
      // Algebra - Expanding brackets
      if (questionText.includes('expand') || questionText.includes('multiply out')) {
        return "Use FOIL method: multiply First terms, Outside terms, Inside terms, then Last terms. Then collect like terms together.";
      }
      
      // Algebra - Factorizing
      if (questionText.includes('factorize') || questionText.includes('factorise')) {
        // Look for quadratic patterns
        const quadraticMatch = questionText.match(/x²\s*[+-]\s*(\d+)x\s*[+-]\s*(\d+)/);
        if (quadraticMatch) {
          const bCoeff = questionText.match(/x²\s*[+-]\s*(\d+)x/)?.[1];
          const cCoeff = questionText.match(/[+-]\s*(\d+)(?!\s*x)/)?.[1];
          
          if (bCoeff && cCoeff) {
            return `Find two numbers that multiply to ${cCoeff} and add to ${bCoeff}. Write as (x + ?)(x + ?).`;
          }
        }
        return "Look for common factors first, then find two numbers that multiply to give the constant term and add to give the coefficient of x.";
      }
      
      // Algebra - Solving equations
      if (questionText.includes('solve') && questionText.includes('x')) {
        return "Keep the equation balanced: whatever you do to one side, do to the other. Get all x terms on one side and numbers on the other.";
      }
      
      // Algebra - Substitution
      if (questionText.includes('substitute') || questionText.includes('when')) {
        return "Replace each variable with its given value, then calculate step by step. Remember to follow BIDMAS/BODMAS order.";
      }
      
      // Algebra - Simplifying expressions
      if (questionText.includes('simplify')) {
        return "Collect like terms together. Add/subtract coefficients of the same variables (e.g., 3x + 2x = 5x).";
      }
      
      // Percentage calculations
      if (questionText.includes('percentage') || questionText.includes('%')) {
        if (questionText.includes('increase') || questionText.includes('decrease')) {
          return "Percentage change = (new value - original value) ÷ original value × 100. Or use multipliers (e.g., +15% means ×1.15).";
        }
        return "To find a percentage of an amount: (percentage ÷ 100) × amount. E.g., 15% of 80 = 0.15 × 80.";
      }
      
      // Geometry
      if (questionText.includes('area')) {
        if (questionText.includes('triangle')) {
          return "Area of triangle = ½ × base × height. Make sure you identify the correct base and perpendicular height.";
        }
        if (questionText.includes('circle')) {
          return "Area of circle = πr². Remember r is the radius (half the diameter).";
        }
        return "Identify the shape and use the correct area formula. Break complex shapes into simpler parts.";
      }
      
      if (questionText.includes('circumference') || questionText.includes('perimeter')) {
        if (questionText.includes('circle')) {
          return "Circumference = πd or 2πr. Remember d = diameter, r = radius.";
        }
        return "Perimeter = sum of all side lengths. For rectangles: 2(length + width).";
      }
      
      // Trigonometry
      if (questionText.includes('sin') || questionText.includes('cos') || questionText.includes('tan')) {
        return "Use SOH CAH TOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. Label the triangle sides first.";
      }
    }
    
    // Chemistry-specific hints
    if (subjectId === 'chemistry') {
      if (questionText.includes('balance') || questionText.includes('equation')) {
        return "Balance atoms one element at a time. Start with the most complex molecule. Same number of each type of atom on both sides.";
      }
      if (questionText.includes('ionic')) {
        return "Metal loses electrons to become positive ion, non-metal gains electrons to become negative ion. Opposite charges attract.";
      }
      if (questionText.includes('covalent')) {
        return "Non-metal atoms share electrons to complete their outer shells. Think about how many electrons each atom needs.";
      }
    }
    
    // Physics-specific hints
    if (subjectId === 'physics') {
      if (questionText.includes('force')) {
        return "F = ma. Consider direction of forces. Balanced forces = no acceleration. Unbalanced forces = acceleration.";
      }
      if (questionText.includes('energy')) {
        return "Energy is conserved. KE = ½mv², GPE = mgh. Think about energy transfers between kinetic, potential, and thermal.";
      }
      if (questionText.includes('wave')) {
        return "Wave speed = frequency × wavelength (v = fλ). Think about the relationship between these three quantities.";
      }
    }
    
    // General question type hints
    if (questionText.includes('calculate') || questionText.includes('find')) {
      return "Identify the given values, what you need to find, and which formula applies. Show your working step by step.";
    }
    
    if (questionText.includes('explain') || questionText.includes('describe')) {
      return "Use clear scientific language. Give reasons for your statements. Structure your answer with logical, numbered points.";
    }
    
    if (questionText.includes('compare') || questionText.includes('contrast')) {
      return "State similarities and differences clearly. Explain the scientific reasons behind each point you make.";
    }
    
    // Fallback hint
    return "Read the question carefully and identify the key concept being tested. Think about what knowledge and skills you need to demonstrate.";
  };

  const finishSession = async () => {
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    // Clear the current session state since it's completed
    clearSessionState();
    
    // Save progress
    const progressKey = `mentiora_progress_${user?.id}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    
    const topicProgressIndex = existingProgress.findIndex(
      (p: any) => p.subjectId === subjectId && p.topicId === topicId
    );
    
    if (topicProgressIndex >= 0) {
      existingProgress[topicProgressIndex].attempts += 1;
      existingProgress[topicProgressIndex].averageScore = Math.round(
        (existingProgress[topicProgressIndex].averageScore + averagePercentage) / 2
      );
      existingProgress[topicProgressIndex].lastAttempt = new Date();
    } else {
      existingProgress.push({
        subjectId,
        topicId,
        attempts: 1,
        averageScore: Math.round(averagePercentage),
        lastAttempt: new Date()
      });
    }
    
    localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    
    // Handle weak topics
    if (averagePercentage < 85) {
      const weakTopicsKey = `mentiora_weak_topics_${user?.id}`;
      const weakTopics = JSON.parse(localStorage.getItem(weakTopicsKey) || '[]');
      if (!weakTopics.includes(topicId)) {
        weakTopics.push(topicId);
        localStorage.setItem(weakTopicsKey, JSON.stringify(weakTopics));
      }
    } else {
      // Remove from weak topics if score is good
      const weakTopicsKey = `mentiora_weak_topics_${user?.id}`;
      const weakTopics = JSON.parse(localStorage.getItem(weakTopicsKey) || '[]');
      const filteredTopics = weakTopics.filter((id: string) => id !== topicId);
      localStorage.setItem(weakTopicsKey, JSON.stringify(filteredTopics));
      
      // Track topic mastery (85%+ score)
      if (user?.id && subjectId && topicId) {
        try {
          await supabase
            .from('daily_topic_mastery')
            .upsert(
              {
                user_id: user.id,
                subject_id: subjectId,
                topic_id: topicId,
                score: averagePercentage,
                date: new Date().toISOString().split('T')[0]
              },
              {
                onConflict: 'user_id,subject_id,topic_id,date'
              }
            );
          
          // Show celebratory toast for mastery
          toast.success(`🎉 Topic mastered! Great work on ${topic?.name}!`, {
            duration: 3000,
          });
        } catch (error) {
          console.error('Error tracking topic mastery:', error);
        }
      }
    }
    
    setSessionComplete(true);
  };

  if (sessionComplete) {
    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
            <CardTitle className="text-foreground">Session Complete!</CardTitle>
            <CardDescription className="text-muted-foreground">
              {topic?.name} - {subject?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {marksEarned}/{totalMarks}
              </div>
              <p className="text-muted-foreground">Total Marks</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-medium">{attempts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <Badge className={averagePercentage >= 85 ? "bg-green-500" : averagePercentage >= 60 ? "bg-yellow-500" : "bg-red-500"}>
                  {averagePercentage >= 85 ? "Excellent" : averagePercentage >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button onClick={() => navigate(`/subject/${subjectId}`)}>
                Back to {subject?.name}
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No questions available</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentAttempt = attempts.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate(`/subject/${subjectId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{topic?.name}</h1>
                <p className="text-sm text-muted-foreground">{subject?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
              </span>
              <Progress value={((currentQuestionIndex + 1) / shuffledQuestions.length) * 100} className="w-24" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Question Panel */}
            <Card className="bg-card/80 backdrop-blur-sm border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Question</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                    {currentQuestion.calculatorGuidance && (
                      <Badge 
                        variant={currentQuestion.calculatorGuidance === 'calc-recommended' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          currentQuestion.calculatorGuidance === 'calc-recommended' 
                            ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30' 
                            : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30'
                        }`}
                      >
                        {currentQuestion.calculatorGuidance === 'calc-recommended' ? '🟩 Calc recommended' : '🟦 Non-calc friendly'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-6 leading-relaxed">
                  {currentQuestion.question}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Answer:
                    </label>
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your full answer here..."
                      className="min-h-[200px]"
                      disabled={showFeedback}
                    />
                  </div>
                  
                  {!showFeedback && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSubmitAnswer}
                          disabled={isSubmitting || !userAnswer.trim()}
                          className="flex-1"
                        >
                          {isSubmitting ? "AI is marking your answer..." : "Submit Answer"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowHint(!showHint)}
                          className="px-4"
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          {showHint ? "Hide Hint" : "Hint"}
                        </Button>
                      </div>
                      
                      {showHint && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Hint
                              </h4>
                              <p className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed">
                                {generateHint(currentQuestion)}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowHint(false)}
                              className="ml-2 h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Panel */}
            {showFeedback && currentAttempt && (
              <Card className="bg-card/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    AI Teacher Feedback
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {currentAttempt.score}/{currentQuestion.marks}
                    </span>
                    <span className="text-sm text-muted-foreground">marks</span>
                    <Badge className={currentAttempt.score >= currentQuestion.marks * 0.85 ? "bg-green-500" : currentAttempt.score >= currentQuestion.marks * 0.6 ? "bg-yellow-500" : "bg-red-500"}>
                      {currentAttempt.score >= currentQuestion.marks * 0.85 ? "Excellent" : currentAttempt.score >= currentQuestion.marks * 0.6 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Model Answer */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <Book className="h-4 w-4 mr-2" />
                      Model Answer
                    </h4>
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-foreground">{currentAttempt.feedback.modelAnswer}</p>
                    </div>
                  </div>

                  {/* Why This Gets Marks */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Why This Gets Full Marks
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                      <pre className="text-foreground whitespace-pre-wrap font-sans">
                        {currentAttempt.feedback.whyThisGetsMark}
                      </pre>
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      AI Teacher Feedback
                    </h4>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-500">
                      <p className="text-foreground">{currentAttempt.feedback.whyYoursDidnt}</p>
                    </div>
                  </div>

                  {/* Spec Reference */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Specification Reference</h4>
                    <Badge variant="outline">{currentAttempt.feedback.specLink}</Badge>
                  </div>

                  <Button onClick={handleNextQuestion} className="w-full">
                    {currentQuestionIndex < shuffledQuestions.length - 1 ? "Next Question" : "Finish Session"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
