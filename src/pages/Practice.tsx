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
        
        // Restore shuffled questions order and filter out diagram questions
        const restoredQuestions = state.shuffledQuestions
          .map((id: string) => topic.questions?.find(q => q.id === id))
          .filter((q: Question | undefined): q is Question => q !== undefined);
        const filteredRestoredQuestions = filterNonDiagramQuestions(restoredQuestions);
        
        if (filteredRestoredQuestions.length > 0) {
          setShuffledQuestions(filteredRestoredQuestions);
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
      const filteredQuestions = filterNonDiagramQuestions(topic.questions || []);
      const shuffled = shuffleArray(filteredQuestions);
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
    
    // Generate specific hints based on question content and keywords
    const generateSpecificHint = () => {
      
      // Geography-specific hints
      if (subjectId === 'geography') {
        // Natural Hazards
        if (questionText.includes('natural hazard')) {
          if (questionText.includes('definition') || questionText.includes('what is')) {
            return "Define natural hazards as naturally occurring events that pose threats to people and property. Consider geological, meteorological, and biological hazards.";
          }
          if (questionText.includes('factor') && questionText.includes('risk')) {
            return "Think about vulnerability (how susceptible people are), hazard frequency/magnitude, capacity to cope, and level of development.";
          }
          return "Consider the relationship between natural events and human activities. Think about vulnerability, exposure, and adaptive capacity.";
        }
        
        // Tectonic Hazards
        if (questionText.includes('plate') && (questionText.includes('margin') || questionText.includes('boundary'))) {
          return "Describe constructive (divergent), destructive (convergent), and conservative (transform) plate margins. Explain the processes at each type.";
        }
        if (questionText.includes('earthquake') || questionText.includes('volcanic')) {
          if (questionText.includes('distribution')) {
            return "Focus on the Ring of Fire around the Pacific, mid-ocean ridges, and collision zones. Link to plate tectonics theory.";
          }
          if (questionText.includes('effect') || questionText.includes('impact')) {
            return "Distinguish between primary effects (immediate) and secondary effects (follow-on). Consider social, economic, and environmental impacts.";
          }
          if (questionText.includes('response')) {
            return "Separate immediate responses (rescue, emergency aid) from long-term responses (rebuilding, prevention). Consider how wealth affects responses.";
          }
          if (questionText.includes('management') || questionText.includes('reduce')) {
            return "Consider the 4 P's: Prediction (monitoring), Protection (building design), Preparation (education, drills), and Planning (evacuation routes).";
          }
        }
        
        // Weather Hazards
        if (questionText.includes('tropical storm') || questionText.includes('hurricane') || questionText.includes('cyclone')) {
          if (questionText.includes('formation') || questionText.includes('develop')) {
            return "Think about warm ocean water (27°C+), low wind shear, sufficient distance from equator for Coriolis effect, and atmospheric instability.";
          }
          if (questionText.includes('structure')) {
            return "Describe the eye (calm center), eye wall (strongest winds), and spiral rain bands. Explain air circulation patterns.";
          }
          if (questionText.includes('distribution')) {
            return "Focus on tropical regions between 5-30° latitude, avoiding the equator. Consider seasonal patterns and ocean temperature requirements.";
          }
        }
        if (questionText.includes('atmospheric circulation')) {
          return "Explain the three-cell model: Hadley cells (0-30°), Ferrel cells (30-60°), and Polar cells (60-90°). Include pressure belts and winds.";
        }
        if (questionText.includes('uk') && questionText.includes('weather')) {
          return "Consider the UK's maritime climate, depressions from the Atlantic, and how climate change might increase extreme events like flooding and heatwaves.";
        }
        
        // Climate Change
        if (questionText.includes('climate change')) {
          if (questionText.includes('evidence')) {
            return "Use data from ice cores, tree rings, historical records, and temperature measurements. Show trends from the Quaternary period to present.";
          }
          if (questionText.includes('cause')) {
            return "Separate natural causes (solar output, orbital changes, volcanic activity) from human causes (fossil fuels, deforestation, agriculture).";
          }
          if (questionText.includes('effect') || questionText.includes('impact')) {
            return "Consider environmental effects (sea level rise, ice melt) and human effects (agriculture, water supply, migration, health).";
          }
          if (questionText.includes('mitigation')) {
            return "Focus on reducing causes: renewable energy, carbon capture, international agreements like Paris Agreement, reducing emissions.";
          }
          if (questionText.includes('adaptation')) {
            return "Focus on responding to change: flood defenses, drought-resistant crops, water management, changing agricultural practices.";
          }
        }
      }
      
      // Biology-specific hints with more detail
      if (subjectId === 'biology') {
        // Process-specific hints
        if (questionText.includes('photosynthesis')) {
          if (questionText.includes('limiting factor')) {
            return "Think about light intensity, CO₂ concentration, and temperature. Explain how the factor in shortest supply limits the rate, using graphs if mentioned.";
          }
          if (questionText.includes('equation') || questionText.includes('word')) {
            return "Word equation: carbon dioxide + water → glucose + oxygen. Symbol: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (need light energy and chlorophyll).";
          }
          return "Consider where it occurs (chloroplasts), what's needed (light, CO₂, water, chlorophyll), and what's produced (glucose, oxygen).";
        }
        
        if (questionText.includes('respiration')) {
          if (questionText.includes('aerobic')) {
            return "Aerobic respiration uses oxygen: glucose + oxygen → carbon dioxide + water + ATP. Occurs in mitochondria, releases lots of energy.";
          }
          if (questionText.includes('anaerobic')) {
            return "Anaerobic respiration without oxygen: In animals - glucose → lactic acid + ATP. In plants/yeast - glucose → ethanol + CO₂ + ATP.";
          }
          return "Consider the differences between aerobic (with oxygen, lots of ATP) and anaerobic (without oxygen, less ATP) respiration.";
        }
        
        if (questionText.includes('osmosis')) {
          if (questionText.includes('cell') || questionText.includes('plant')) {
            return "Water moves from high to low water concentration across cell membranes. In plant cells, consider turgor pressure and plasmolysis.";
          }
          return "Osmosis is the movement of water from a dilute solution to a concentrated solution through a partially permeable membrane.";
        }
        
        if (questionText.includes('enzyme')) {
          if (questionText.includes('temperature') || questionText.includes('ph')) {
            return "Enzymes have optimum conditions. Too hot or wrong pH changes the active site shape (denaturation), reducing enzyme activity.";
          }
          return "Think about the lock and key model: enzyme's active site is complementary to substrate. Consider specificity and catalytic function.";
        }
        
        // Genetics hints
        if (questionText.includes('allele') || questionText.includes('genetic') || questionText.includes('inherit')) {
          if (questionText.includes('cross') || questionText.includes('offspring')) {
            return "Use genetic diagrams: show parent genotypes, possible gametes, Punnett square, offspring genotypes and phenotypes. State the ratio.";
          }
          return "Think about dominant and recessive alleles, homozygous vs heterozygous genotypes, and how they determine phenotypes.";
        }
        
        // Cell biology
        if (questionText.includes('mitosis')) {
          return "Mitosis produces two identical diploid cells for growth and repair. Stages: prophase (chromosomes condense), metaphase (line up), anaphase (separate), telophase (nuclei reform).";
        }
        
        if (questionText.includes('meiosis')) {
          return "Meiosis produces four genetically different haploid gametes. Involves two divisions, crossing over creates variation, used for sexual reproduction.";
        }
      }
      
      // Mathematics-specific detailed hints
      if (subjectId === 'mathematics') {
        // Algebra
        if (questionText.includes('expand') || questionText.includes('multiply out')) {
          if (questionText.includes('bracket')) {
            return "Use FOIL for (a+b)(c+d): multiply First terms (ac), Outside terms (ad), Inside terms (bc), Last terms (bd). Then simplify.";
          }
          return "Multiply each term in the first bracket by each term in the second bracket, then collect like terms together.";
        }
        
        if (questionText.includes('factorize') || questionText.includes('factorise')) {
          if (questionText.includes('quadratic') || questionText.match(/x²/)) {
            return "For x² + bx + c, find two numbers that multiply to give c and add to give b. Write as (x + first number)(x + second number).";
          }
          return "Look for common factors first. For quadratics, find two numbers that multiply to the constant term and add to the x coefficient.";
        }
        
        if (questionText.includes('solve') && questionText.includes('equation')) {
          if (questionText.includes('simultaneous')) {
            return "Use elimination or substitution. For elimination: make coefficients of one variable the same, then subtract equations.";
          }
          return "Keep equations balanced: whatever you do to one side, do to the other. Aim to get the variable by itself.";
        }
        
        // Geometry
        if (questionText.includes('area')) {
          if (questionText.includes('triangle')) {
            return "Area of triangle = ½ × base × height. Make sure you use the perpendicular height, not a slanted side.";
          }
          if (questionText.includes('circle')) {
            return "Area of circle = π × radius². If given diameter, remember radius = diameter ÷ 2.";
          }
          if (questionText.includes('compound') || questionText.includes('composite')) {
            return "Break the shape into simpler parts (rectangles, triangles, circles). Calculate each area separately, then add or subtract as needed.";
          }
        }
        
        if (questionText.includes('volume')) {
          if (questionText.includes('cylinder')) {
            return "Volume of cylinder = π × radius² × height. Make sure all measurements are in the same units.";
          }
          if (questionText.includes('sphere')) {
            return "Volume of sphere = (4/3) × π × radius³. Remember to cube the radius.";
          }
        }
        
        // Statistics
        if (questionText.includes('mean') || questionText.includes('average')) {
          return "Mean = sum of all values ÷ number of values. Add all the numbers together, then divide by how many numbers there are.";
        }
        
        if (questionText.includes('probability')) {
          if (questionText.includes('independent')) {
            return "For independent events, multiply probabilities: P(A and B) = P(A) × P(B). Use tree diagrams for multiple events.";
          }
          return "Probability = number of favorable outcomes ÷ total number of possible outcomes. Answer should be between 0 and 1.";
        }
        
        // Trigonometry
        if (questionText.includes('sin') || questionText.includes('cos') || questionText.includes('tan')) {
          return "Use SOH CAH TOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. Label your triangle first.";
        }
      }
      
      // Chemistry-specific hints
      if (subjectId === 'chemistry') {
        if (questionText.includes('balance') && questionText.includes('equation')) {
          return "Balance one element at a time. Start with the most complex molecule. Count atoms on each side - they must be equal.";
        }
        
        if (questionText.includes('ionic') && questionText.includes('bond')) {
          return "Metal atoms lose electrons to become positive ions, non-metal atoms gain electrons to become negative ions. Opposite charges attract.";
        }
        
        if (questionText.includes('covalent') && questionText.includes('bond')) {
          return "Non-metal atoms share pairs of electrons to fill their outer shells. Each shared pair forms one covalent bond.";
        }
        
        if (questionText.includes('ph')) {
          return "pH scale 0-14: acids (0-6), neutral (7), alkalis (8-14). Lower pH = more acidic, higher pH = more alkaline.";
        }
        
        if (questionText.includes('mole') || questionText.includes('mol')) {
          return "1 mole = 6.02 × 10²³ particles. Use: moles = mass ÷ relative formula mass. Or moles = concentration × volume (in dm³).";
        }
      }
      
      // Physics-specific hints
      if (subjectId === 'physics') {
        if (questionText.includes('force')) {
          if (questionText.includes('newton')) {
            return "Newton's laws: 1st - objects at rest stay at rest unless acted on by force. 2nd - F = ma. 3rd - every action has equal opposite reaction.";
          }
          return "Forces can change motion, shape, or direction. Balanced forces = no change in motion. Unbalanced forces = acceleration.";
        }
        
        if (questionText.includes('energy')) {
          if (questionText.includes('kinetic')) {
            return "Kinetic energy = ½mv². Objects moving faster or with more mass have more kinetic energy.";
          }
          if (questionText.includes('potential')) {
            return "Gravitational potential energy = mgh. Higher objects or more massive objects have more potential energy.";
          }
          return "Energy is conserved - it cannot be created or destroyed, only transferred between different forms.";
        }
        
        if (questionText.includes('wave')) {
          return "Wave equation: wave speed = frequency × wavelength (v = fλ). All electromagnetic waves travel at 3×10⁸ m/s in vacuum.";
        }
        
        if (questionText.includes('circuit') || questionText.includes('current')) {
          if (questionText.includes('series')) {
            return "Series circuits: current is the same everywhere, voltage adds up, resistance adds up (R_total = R₁ + R₂ + ...).";
          }
          if (questionText.includes('parallel')) {
            return "Parallel circuits: voltage is the same across each branch, current splits, 1/R_total = 1/R₁ + 1/R₂ + ...";
          }
          return "Use Ohm's law: V = IR. Power = IV or P = I²R or P = V²/R.";
        }
      }
      
      // General question command word hints
      if (questionText.includes('calculate') || questionText.includes('find')) {
        return "Identify given values, what you need to find, and the appropriate formula. Show all working steps clearly and include units in your answer.";
      }
      
      if (questionText.includes('explain') && !questionText.includes('why')) {
        return "Give clear reasons for your statements. Use scientific terminology correctly. Structure your answer logically with linking words like 'because', 'therefore', 'as a result'.";
      }
      
      if (questionText.includes('describe')) {
        return "Give a detailed account of what happens. Use specific examples and scientific terms. Focus on the key features or processes mentioned in the question.";
      }
      
      if (questionText.includes('compare') || questionText.includes('contrast')) {
        return "Identify both similarities and differences. Make direct comparisons using words like 'whereas', 'however', 'similarly'. Consider making a table to organize your points.";
      }
      
      if (questionText.includes('evaluate') || questionText.includes('assess')) {
        return "Weigh up the pros and cons. Consider different viewpoints. Make a judgment based on evidence. Use phrases like 'on the other hand', 'however', 'overall'.";
      }
      
      if (questionText.includes('suggest') || questionText.includes('give reasons')) {
        return "Use your scientific knowledge to propose logical explanations. Consider cause and effect relationships. Multiple reasonable answers may be acceptable.";
      }
      
      // Fallback based on question marks/difficulty
      if (question.marks >= 6) {
        return "This is a longer answer question. Plan your response, use detailed scientific explanations, and include specific examples where relevant.";
      } else if (question.marks >= 3) {
        return "Provide a clear explanation with specific details. Make sure you address all parts of the question and use appropriate scientific terminology.";
      } else {
        return "Keep your answer focused and precise. Think about the key scientific concept being tested and give a clear, accurate response.";
      }
    };
    
    return generateSpecificHint();
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
