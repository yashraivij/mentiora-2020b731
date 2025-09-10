import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, CheckCircle, AlertCircle, Book, Lightbulb, HelpCircle, X, StickyNote } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { playCelebratorySound } from "@/lib/celebratory-sound";

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

// Filter out questions that require diagrams or visual interpretation
const filterNonDiagramQuestions = (questions: Question[]): Question[] => {
  const diagramKeywords = [
    'diagram', 'chart', 'graph', 'scatter', 'plot', 'histogram', 'bar chart',
    'pie chart', 'line graph', 'draw', 'sketch', 'show on', 'using the diagram',
    'from the diagram', 'in the diagram', 'on the graph', 'from the graph',
    'in the chart', 'from the chart', 'interpret the', 'read from',
    'using the scatter', 'scatter diagram', 'box plot', 'stem and leaf',
    'frequency polygon', 'cumulative frequency', 'pictogram'
  ];
  
  return questions.filter(question => {
    const questionText = question.question.toLowerCase();
    return !diagramKeywords.some(keyword => questionText.includes(keyword));
  });
};

// Fisher-Yates shuffle algorithm to randomize questions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Practice: React.FC = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const {
    notification,
    handlePracticeQuestionResult,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

  const subject = curriculum.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Load session state from localStorage
  useEffect(() => {
    if (!user?.id || !subjectId || !topicId) return;

    const sessionKey = `mentiora_practice_${user.id}_${subjectId}_${topicId}`;
    const savedSession = localStorage.getItem(sessionKey);
    
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setShuffledQuestions(sessionData.shuffledQuestions || []);
        setCurrentQuestionIndex(sessionData.currentQuestionIndex || 0);
        setAttempts(sessionData.attempts || []);
        setUserAnswer(sessionData.userAnswer || "");
      } catch (error) {
        console.error("Error loading session:", error);
      }
    }

    // If no saved session or empty questions, initialize with new questions
    if (!savedSession || shuffledQuestions.length === 0) {
      if (topic?.questions) {
        const filteredQuestions = filterNonDiagramQuestions(topic.questions);
        const questionPool = filteredQuestions.slice(0, 10);
        const randomizedQuestions = shuffleArray(questionPool);
        setShuffledQuestions(randomizedQuestions);
        setCurrentQuestionIndex(0);
        setAttempts([]);
        setUserAnswer("");
      }
    }
  }, [user?.id, subjectId, topicId, topic?.questions]);

  // Save session state to localStorage
  useEffect(() => {
    if (!user?.id || !subjectId || !topicId || shuffledQuestions.length === 0) return;

    const sessionKey = `mentiora_practice_${user.id}_${subjectId}_${topicId}`;
    const sessionData = {
      shuffledQuestions,
      currentQuestionIndex,
      attempts,
      userAnswer
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
  }, [shuffledQuestions, currentQuestionIndex, attempts, userAnswer, user?.id, subjectId, topicId]);

  const clearSessionState = () => {
    if (!user?.id || !subjectId || !topicId) return;
    const sessionKey = `mentiora_practice_${user.id}_${subjectId}_${topicId}`;
    localStorage.removeItem(sessionKey);
  };

  const markAnswerWithAI = async (question: Question, userAnswer: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.question,
          userAnswer: userAnswer.trim(),
          modelAnswer: question.modelAnswer,
          markingCriteria: question.markingCriteria.breakdown,
          totalMarks: question.marks,
          subjectId: subjectId
        }
      });

      if (error) throw error;

      return {
        score: data.marksAwarded || 0,
        feedback: {
          modelAnswer: question.modelAnswer,
          whyThisGetsMark: data.feedback || "No detailed feedback available.",
          whyYoursDidnt: data.assessment || "",
          specLink: `Review ${subject?.name} - ${topic?.name} content`
        }
      };
    } catch (error) {
      console.error('Error marking answer:', error);
      
      // Fallback marking logic
      const cleanUserAnswer = userAnswer.trim().toLowerCase();
      const cleanModelAnswer = question.modelAnswer.toLowerCase();
      
      let score = 0;
      if (cleanUserAnswer && cleanUserAnswer.length > 10) {
        const keyWords = cleanModelAnswer.split(' ').filter(word => word.length > 3);
        const matchingWords = keyWords.filter(word => cleanUserAnswer.includes(word));
        score = Math.min(question.marks, Math.floor((matchingWords.length / Math.max(keyWords.length, 1)) * question.marks));
      }
      
      return {
        score,
        feedback: {
          modelAnswer: question.modelAnswer,
          whyThisGetsMark: "This answer covers the key points mentioned in the model answer.",
          whyYoursDidnt: score < question.marks ? "Your answer could include more specific details and key terms." : "",
          specLink: `Review ${subject?.name} - ${topic?.name} content`
        }
      };
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await markAnswerWithAI(currentQuestion, userAnswer);
      
      const newAttempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        userAnswer: userAnswer.trim(),
        score: result.score,
        feedback: result.feedback
      };
      
      setAttempts(prev => [...prev, newAttempt]);
      setShowFeedback(true);
      
      // Log activity - removing this since daily_activity_log table doesn't exist
      // if (user?.id) {
      //   try {
      //     await supabase
      //       .from('daily_activity_log')
      //       .upsert(...)
      //   } catch (error) {
      //     console.error('Error logging activity:', error);
      //   }
      // }

      // Handle notifications for wrong answers
      if (result.score < currentQuestion.marks) {
        handlePracticeQuestionResult(false, subjectId || '', topicId || '', currentQuestion.question);
      } else {
        handlePracticeQuestionResult(true, subjectId || '', topicId || '', currentQuestion.question);
        playCelebratorySound();
      }
      
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
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
    
    // Extract key terms from model answer
    const extractKeyTerms = () => {
      const terms = new Set<string>();
      const answerWords = modelAnswer.split(/[\s,.:;()]+/).filter(word => word.length > 2);
      
      // Add scientific/technical terms
      answerWords.forEach(word => {
        if (word.length > 4 && 
            (word.includes('tion') || word.includes('ment') || word.includes('ology') || 
             word.includes('phys') || word.includes('chem') || word.includes('bio'))) {
          terms.add(word);
        }
      });
      
      return Array.from(terms);
    };

    const keyTerms = extractKeyTerms();

    // Subject-specific hints based on question content and model answer
    if (subjectId === 'geography') {
      if (questionText.includes('natural hazard')) {
        if (questionText.includes('definition') || questionText.includes('what is')) {
          return "Define as 'a natural process that poses a threat to people and property'. Include examples and mention the risk equation: Risk = Hazard × Vulnerability.";
        }
        if (questionText.includes('factor') && questionText.includes('risk')) {
          return "Consider: vulnerability of population, magnitude/intensity of hazard, frequency of occurrence, population density, level of development/wealth, geographical location.";
        }
      }
      
      if (questionText.includes('plate') && (questionText.includes('margin') || questionText.includes('boundary'))) {
        return "Explain the three main plate boundary types: constructive (divergent) - plates move apart; destructive (convergent) - plates collide; conservative (transform) - plates slide past each other.";
      }
      
      if ((questionText.includes('earthquake') || questionText.includes('volcanic')) && 
          (questionText.includes('effect') || questionText.includes('impact'))) {
        return "Separate primary effects (immediate: building collapse, deaths, infrastructure damage) from secondary effects (later: disease, unemployment, economic impact).";
      }
      
      if (questionText.includes('climate change')) {
        if (questionText.includes('evidence')) {
          return "Use multiple evidence types: ice cores (CO₂ levels from trapped air), tree rings (growth patterns), temperature records, coral data, and satellite observations.";
        }
        if (questionText.includes('cause')) {
          return "Distinguish natural causes (solar variations, volcanic eruptions, orbital cycles) from human causes (fossil fuel burning, deforestation, agriculture).";
        }
      }
    }
    
    if (subjectId === 'biology') {
      if (questionText.includes('photosynthesis')) {
        if (questionText.includes('limiting factor')) {
          return "Limiting factors: light intensity, CO₂ concentration, temperature. The factor in shortest supply controls the rate. Use graphs to show this relationship.";
        }
        if (questionText.includes('equation')) {
          return "Word equation: carbon dioxide + water → glucose + oxygen. Symbol: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (needs light energy and chlorophyll).";
        }
      }
      
      if (questionText.includes('genetic') || questionText.includes('inherit') || questionText.includes('allele')) {
        if (questionText.includes('cross') || questionText.includes('offspring')) {
          return "Set up genetic cross clearly: 1) Parent phenotypes/genotypes, 2) Possible gametes, 3) Punnett square, 4) Offspring genotypes/phenotypes, 5) Ratio.";
        }
      }
      
      if (questionText.includes('osmosis')) {
        return "Osmosis: water moves from dilute solution (high water potential) to concentrated solution (low water potential) through partially permeable membrane. Consider effects on cell turgor pressure.";
      }
    }
    
    if (subjectId === 'chemistry') {
      if (questionText.includes('balance') && questionText.includes('equation')) {
        return "Balancing equations: 1) Count atoms of each element on both sides, 2) Start with most complex molecule, 3) Use coefficients (not subscripts), 4) Check all atoms balance.";
      }
      
      if (questionText.includes('ionic') && questionText.includes('bond')) {
        return "Ionic bonds: metal atoms lose electrons (become cations), non-metals gain electrons (become anions), then oppositely charged ions attract.";
      }
      
      if (questionText.includes('covalent') && questionText.includes('bond')) {
        return "Covalent bonding: non-metal atoms share electron pairs to achieve full outer shells. Each shared pair = one covalent bond.";
      }
    }
    
    if (subjectId === 'physics') {
      if (questionText.includes('force') && questionText.includes('newton')) {
        return "Newton's laws: 1st (inertia), 2nd (F=ma), 3rd (action-reaction). Apply the relevant law to this situation.";
      }
      
      if (questionText.includes('energy')) {
        return "Consider energy types (kinetic KE=½mv², gravitational potential GPE=mgh) and conservation principle. Use appropriate formulas and show calculations.";
      }
      
      if (questionText.includes('circuit')) {
        if (questionText.includes('series')) {
          return "Series circuits: current same throughout, voltage adds up, resistance adds up (R_total=R₁+R₂+R₃).";
        }
        if (questionText.includes('parallel')) {
          return "Parallel circuits: voltage same across branches, current splits, 1/R_total = 1/R₁ + 1/R₂ + 1/R₃.";
        }
      }
    }
    
    if (subjectId === 'mathematics') {
      if (questionText.includes('expand') || questionText.includes('multiply out')) {
        return "Use FOIL method: First terms, Outside terms, Inside terms, Last terms. Then collect like terms. E.g., (a+b)(c+d) = ac + ad + bc + bd.";
      }
      
      if (questionText.includes('solve') && questionText.includes('equation')) {
        if (questionText.includes('simultaneous')) {
          return "Simultaneous equations: use elimination (make coefficients equal, subtract equations) or substitution (solve one for a variable, substitute into other).";
        }
      }
      
      if (questionText.includes('probability')) {
        return "Calculate probability as favorable outcomes ÷ total outcomes. For multiple events, use P(A and B) = P(A) × P(B) if independent. Draw tree diagrams for complex scenarios.";
      }
    }

    // Command word specific hints
    if (questionText.includes('explain')) {
      return keyTerms.length > 0 ?
        `Give clear reasons using scientific terminology. Key terms from model answer: ${keyTerms.slice(0, 3).join(', ')}.` :
        "Provide clear scientific explanations with reasoning. Use appropriate terminology and explain cause-and-effect relationships.";
    }
    
    if (questionText.includes('describe')) {
      return keyTerms.length > 0 ?
        `Give a detailed account of key features. Important terms: ${keyTerms.slice(0, 4).join(', ')}.` :
        "Provide a detailed account focusing on key features, processes, or characteristics. Use specific examples and scientific terms.";
    }
    
    if (questionText.includes('compare') || questionText.includes('contrast')) {
      return "Make direct comparisons showing both similarities and differences. Use comparative language: 'whereas', 'however', 'in contrast', 'similarly'.";
    }
    
    if (questionText.includes('evaluate') || questionText.includes('assess')) {
      return "Consider multiple perspectives, weigh evidence for and against, then make a reasoned judgment. Use evaluative language and justify your conclusion.";
    }
    
    if (questionText.includes('calculate') || questionText.includes('find')) {
      return keyTerms.length > 0 ?
        `This requires calculation. Key terms: ${keyTerms.slice(0, 3).join(', ')}. Identify given values, choose the right formula, show all working.` :
        "Identify given values, determine what you need to find, select appropriate formula, substitute values, show all working steps clearly, include units.";
    }

    // Mark-based hints with content awareness
    if (question.marks >= 6) {
      return keyTerms.length > 0 ?
        `Extended answer required (${question.marks} marks). Key concepts: ${keyTerms.slice(0, 5).join(', ')}. Structure your response logically with detailed explanations.` :
        "This is an extended response question. Plan your answer structure, provide detailed explanations, use specific examples, and ensure you address all parts.";
    } else if (question.marks >= 3) {
      return keyTerms.length > 0 ?
        `Medium-length answer (${question.marks} marks). Focus on: ${keyTerms.slice(0, 3).join(', ')}. Be specific and use correct terminology.` :
        "Provide a clear explanation with specific details. Address all parts of the question and use appropriate scientific terminology.";
    }
    
    return keyTerms.length > 0 ?
      `Key concepts for this answer: ${keyTerms.slice(0, 2).join(', ')}. Keep focused and precise.` :
      "Focus on the key concept being tested. Give a clear, accurate response using appropriate terminology.";
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
        } catch (error) {
          console.error('Error tracking topic mastery:', error);
        }
      }
    }
    
    setSessionComplete(true);
    toast.success("Practice session completed!");
  };

  if (!subject || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Subject or topic not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold border-0"
              >
                Practice More
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
                      <Badge variant="secondary" className="text-xs">
                        Calculator: {currentQuestion.calculatorGuidance}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.question}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[120px] resize-none border border-border bg-background text-foreground"
                    disabled={showFeedback}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={submitAnswer} 
                      disabled={!userAnswer.trim() || isSubmitting || showFeedback}
                      className="flex-1"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Answer"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(!showHint)}
                      className="shrink-0"
                      disabled={showFeedback}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Hint
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
              </CardContent>
            </Card>

            {/* Feedback Panel */}
            <Card className="bg-card/80 backdrop-blur-sm border border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  {showFeedback ? "Feedback" : "Your Progress"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showFeedback && currentAttempt ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div className="flex items-center">
                        {currentAttempt.score === currentQuestion.marks ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                        )}
                        <span className="font-medium text-foreground">
                          Score: {currentAttempt.score}/{currentQuestion.marks}
                        </span>
                      </div>
                      <Badge variant={currentAttempt.score === currentQuestion.marks ? "default" : "secondary"}>
                        {Math.round((currentAttempt.score / currentQuestion.marks) * 100)}%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-2">Model Answer:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          {currentAttempt.feedback.modelAnswer}
                        </p>
                      </div>
                      
                      {currentAttempt.feedback.whyThisGetsMark && (
                        <div>
                          <h4 className="font-semibold text-sm text-foreground mb-2">Why this gets marks:</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                            {currentAttempt.feedback.whyThisGetsMark}
                          </p>
                        </div>
                      )}
                      
                      {currentAttempt.feedback.whyYoursDidnt && (
                        <div>
                          <h4 className="font-semibold text-sm text-foreground mb-2">How to improve:</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                            {currentAttempt.feedback.whyYoursDidnt}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-2">Specification Link:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          {currentAttempt.feedback.specLink}
                        </p>
                      </div>
                    </div>
                    
                    <Button onClick={nextQuestion} className="w-full">
                      {currentQuestionIndex < shuffledQuestions.length - 1 ? "Next Question" : "Finish Session"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Practice?</h3>
                      <p className="text-sm text-muted-foreground">
                        Answer the question to receive detailed feedback and move to the next question.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <div className="font-semibold text-foreground">{attempts.length}</div>
                        <div className="text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <div className="font-semibold text-foreground">{shuffledQuestions.length - currentQuestionIndex}</div>
                        <div className="text-muted-foreground">Remaining</div>
                      </div>
                    </div>
                    
                    {attempts.length > 0 && (
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <div className="font-semibold text-foreground">
                          {Math.round((attempts.reduce((sum, a) => sum + a.score, 0) / attempts.reduce((sum, a, _, arr) => sum + shuffledQuestions[arr.indexOf(a)]?.marks || 0, 0)) * 100) || 0}%
                        </div>
                        <div className="text-muted-foreground">Average Score</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Personalized Notification */}
      {notification && (
        <PersonalizedNotification
          type={notification.type}
          onClose={hideNotification}
          onClear={clearNotification}
        />
      )}
      
      {/* Note: NotebookGenerator component removed due to type issues */}
    </div>
  );
};

export default Practice;