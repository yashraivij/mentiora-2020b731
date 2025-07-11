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
    const markingCriteria = question.markingCriteria.breakdown.join(' ').toLowerCase();
    
    // Extract key terms from model answer for more specific hints
    const extractKeyTerms = (text: string) => {
      // Remove common words and extract meaningful terms
      const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'];
      return text.split(' ').filter(word => word.length > 3 && !commonWords.includes(word));
    };
    
    const modelKeyTerms = extractKeyTerms(modelAnswer);
    const criteriaKeyTerms = extractKeyTerms(markingCriteria);
    
    // Biology-specific hints
    if (subjectId === 'biology') {
      // Osmosis and water movement
      if (questionText.includes('osmosis') || modelAnswer.includes('osmosis')) {
        return "Focus on water movement from high to low concentration across a partially permeable membrane.";
      }
      
      // Photosynthesis
      if (questionText.includes('photosynthesis') || modelAnswer.includes('photosynthesis')) {
        if (modelAnswer.includes('equation') || modelAnswer.includes('formula')) {
          return "Remember the word equation: carbon dioxide + water → glucose + oxygen (with light energy and chlorophyll).";
        }
        return "Consider the inputs (CO₂, water, light), outputs (glucose, oxygen), and where it occurs (chloroplasts).";
      }
      
      // Enzymes
      if (questionText.includes('enzyme') || modelAnswer.includes('enzyme')) {
        if (modelAnswer.includes('temperature') || modelAnswer.includes('denature')) {
          return "Think about how temperature affects enzyme shape and activity - what happens at high temperatures?";
        }
        if (modelAnswer.includes('active site') || modelAnswer.includes('substrate')) {
          return "Consider the lock and key model - enzymes are specific to their substrates via the active site.";
        }
        return "Think about enzyme specificity, active sites, and factors that affect enzyme activity.";
      }
      
      // Cell division
      if (questionText.includes('mitosis') || modelAnswer.includes('mitosis')) {
        return "Think about cell division that produces two identical diploid cells for growth and repair.";
      }
      if (questionText.includes('meiosis') || modelAnswer.includes('meiosis')) {
        return "Consider cell division that produces four genetically different haploid gametes.";
      }
      
      // Respiration
      if (questionText.includes('respiration') || modelAnswer.includes('respiration')) {
        if (modelAnswer.includes('aerobic')) {
          return "Consider aerobic respiration: glucose + oxygen → carbon dioxide + water + ATP.";
        }
        if (modelAnswer.includes('anaerobic')) {
          return "Think about anaerobic respiration - what happens when there's no oxygen available?";
        }
        return "Consider whether oxygen is present and the energy release process in cells.";
      }
      
      // Homeostasis
      if (questionText.includes('homeostasis') || modelAnswer.includes('homeostasis')) {
        return "Think about maintaining constant internal conditions - negative feedback mechanisms.";
      }
      
      // Inheritance
      if (questionText.includes('genetic') || questionText.includes('inherit') || modelAnswer.includes('allele')) {
        return "Consider dominant and recessive alleles, and how they're passed from parents to offspring.";
      }
    }
    
    // Mathematics-specific hints
    if (subjectId === 'mathematics') {
      // Factorization
      if (questionText.includes('factorize') || questionText.includes('factorise')) {
        // Extract coefficients from the question
        const coeffMatch = questionText.match(/x²\s*[+-]\s*(\d+)x\s*[+-]\s*(\d+)/);
        if (coeffMatch) {
          const [, bCoeff, cCoeff] = coeffMatch;
          return `Find two numbers that multiply to ${cCoeff} and add to ${bCoeff}.`;
        }
        return "Find two numbers that multiply to give the constant term and add to give the coefficient of x.";
      }
      
      // Solving equations
      if (questionText.includes('solve') && questionText.includes('x')) {
        if (modelAnswer.includes('=')) {
          return "Isolate x by performing the same operation on both sides of the equation.";
        }
        return "Get all x terms on one side and all numbers on the other side.";
      }
      
      // Percentage calculations
      if (questionText.includes('percentage') || questionText.includes('%')) {
        if (questionText.includes('increase') || questionText.includes('decrease')) {
          return "Use percentage change = (new value - original value) / original value × 100.";
        }
        return "Remember: percentage = (part/whole) × 100.";
      }
      
      // Circle geometry
      if (questionText.includes('circle')) {
        if (questionText.includes('area')) {
          return "Use the formula A = πr², where r is the radius.";
        }
        if (questionText.includes('circumference') || questionText.includes('perimeter')) {
          return "Use the formula C = πd or C = 2πr, where d is diameter and r is radius.";
        }
      }
      
      // Trigonometry
      if (questionText.includes('sin') || questionText.includes('cos') || questionText.includes('tan')) {
        return "Remember SOH CAH TOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent.";
      }
    }
    
    // Chemistry-specific hints
    if (subjectId === 'chemistry') {
      // Periodic table
      if (questionText.includes('periodic') || modelAnswer.includes('group') || modelAnswer.includes('period')) {
        return "Consider the arrangement by atomic number and patterns in groups (vertical) and periods (horizontal).";
      }
      
      // Bonding
      if (questionText.includes('ionic') || modelAnswer.includes('ionic')) {
        return "Think about electron transfer between metals and non-metals forming charged ions.";
      }
      if (questionText.includes('covalent') || modelAnswer.includes('covalent')) {
        return "Consider electron sharing between non-metal atoms to form molecules.";
      }
      
      // Chemical equations
      if (questionText.includes('balance') || questionText.includes('equation')) {
        return "Start with the most complex molecule and balance atoms one element at a time.";
      }
      
      // Acids and bases
      if (questionText.includes('acid') || questionText.includes('alkali') || modelAnswer.includes('ph')) {
        return "Think about hydrogen ions (H⁺) in acids and hydroxide ions (OH⁻) in alkalis.";
      }
    }
    
    // Physics-specific hints
    if (subjectId === 'physics') {
      // Forces and motion
      if (questionText.includes('force') || modelAnswer.includes('newton')) {
        if (modelAnswer.includes('acceleration')) {
          return "Use Newton's second law: Force = mass × acceleration (F = ma).";
        }
        return "Consider the size and direction of forces, and whether they're balanced or unbalanced.";
      }
      
      // Energy
      if (questionText.includes('energy') || modelAnswer.includes('energy')) {
        if (modelAnswer.includes('kinetic')) {
          return "Think about kinetic energy = ½mv² - energy due to motion.";
        }
        if (modelAnswer.includes('potential')) {
          return "Consider gravitational potential energy = mgh - energy due to position.";
        }
        return "Think about energy conservation and transfers between kinetic, potential, and thermal energy.";
      }
      
      // Waves
      if (questionText.includes('wave') || modelAnswer.includes('frequency')) {
        return "Consider the wave equation: wave speed = frequency × wavelength (v = fλ).";
      }
      
      // Electricity
      if (questionText.includes('current') || questionText.includes('voltage') || modelAnswer.includes('ohm')) {
        return "Remember Ohm's law: Voltage = Current × Resistance (V = IR).";
      }
    }
    
    // Question type-based hints using model answer analysis
    if (questionText.includes('calculate') || questionText.includes('find')) {
      if (modelKeyTerms.length > 0) {
        return `Look for the key concept: ${modelKeyTerms[0]}. Identify what values you're given and what formula applies.`;
      }
      return "Identify the given values and determine which formula or method to use.";
    }
    
    if (questionText.includes('explain') || questionText.includes('describe')) {
      if (criteriaKeyTerms.length > 0) {
        return `Make sure to mention: ${criteriaKeyTerms.slice(0, 2).join(' and ')}. Use clear scientific terminology.`;
      }
      return "Structure your answer with clear points and use appropriate scientific terminology.";
    }
    
    if (questionText.includes('compare') || questionText.includes('difference')) {
      return "Identify similarities and differences, explaining the scientific reasons for each.";
    }
    
    // Fallback with specific guidance based on marking criteria
    if (criteriaKeyTerms.length > 0) {
      return `Consider the key concept: ${criteriaKeyTerms[0]}. Think about what the question is specifically testing.`;
    }
    
    return "Break down the question systematically and identify the key scientific concepts being tested.";
  };

  const finishSession = () => {
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
