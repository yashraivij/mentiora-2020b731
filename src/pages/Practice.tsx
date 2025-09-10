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
  
  const {
    notification,
    handlePracticeQuestionResult,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

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
    // Record activity when user visits practice page
    const recordVisit = async () => {
      if (user?.id) {
        try {
          await supabase
            .from('user_activities')
            .insert({
              user_id: user.id,
              activity_type: 'practice_visit'
            });
        } catch (error) {
          console.error('Error recording practice visit:', error);
        }
      }
    };
    
    recordVisit();
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
      toast.error("Failed to mark answer with AI. Please try again.");
      
      // Fallback to basic marking - only give marks for substantial answers
      const isSubstantialAnswer = answer.trim().length >= 3 && 
        answer.trim().split(/\s+/).length >= 1 && 
        /[a-zA-Z]/.test(answer.trim());
      
      return {
        marksAwarded: isSubstantialAnswer ? Math.round(question.marks * 0.3) : 0,
        feedback: "Good effort! Your answer shows you're thinking about this topic. While our AI teacher is taking a quick break, I want to encourage you to keep practicing - every answer helps you learn and grow!",
        assessment: "Keep Going!"
      };
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    
    // Record practice activity
    if (user?.id) {
      try {
        await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: 'question_answered'
          });
      } catch (error) {
        console.error('Error recording activity:', error);
      }
    }
    
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
      
      // Play celebratory sound if user got marks (but not if they got zero)
      if (markingResult.marksAwarded > 0) {
        playCelebratorySound();
      }
      
      // Generate notebook notes if marks were lost
      const marksLost = currentQuestion.marks - markingResult.marksAwarded;
      if (marksLost > 0 && user?.id) {
        console.log('Generating notebook notes for lost marks:', marksLost);
        try {
          const notesGenerated = await NotebookGenerator.generateAndSaveNotes(
            user.id,
            currentQuestion,
            userAnswer,
            marksLost,
            subjectId || '',
            topicId || ''
          );
          
          if (notesGenerated) {
            toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks. Smart notes added to your Notebook!`, {
              action: {
                label: "View Notebook",
                onClick: () => navigate('/notebook')
              }
            });
          } else {
            toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
          }
        } catch (error) {
          console.error('Error generating notebook notes:', error);
          toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
        }
      } else {
        toast.success(`Answer marked! You scored ${markingResult.marksAwarded}/${currentQuestion.marks} marks`);
      }

      // Handle personalized notifications for practice results
      if (user?.id && subjectId && subject?.name) {
        await handlePracticeQuestionResult(
          subjectId,
          subject.name,
          markingResult.marksAwarded > 0,
          markingResult.marksAwarded,
          currentQuestion.marks
        );
      }
      
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
    
    // Extract key terms from model answer for more intelligent hinting
    const extractKeyTermsFromAnswer = () => {
      const terms = new Set<string>();
      
      // Split model answer into meaningful chunks
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
    
    // Analyze question for specific content clues
    const analyzeQuestionContent = () => {
      const hints = [];
      
      // Check for numbers/values that might indicate formulas needed
      const numbersInQuestion = questionText.match(/\d+(\.\d+)?/g);
      if (numbersInQuestion && numbersInQuestion.length >= 2) {
        hints.push("calculation_needed");
      }
      
      // Check for units that indicate formula work
      if (questionText.match(/(m\/s|kg|joules?|newtons?|°c|cm³|m³|ml)/i)) {
        hints.push("units_important");
      }
      
      // Check for comparison words
      if (questionText.match(/(compare|contrast|difference|similar|unlike)/)) {
        hints.push("comparison_needed");
      }
      
      // Check for process words
      if (questionText.match(/(process|steps|stages|sequence|order)/)) {
        hints.push("process_description");
      }
      
      return hints;
    };
    
    const contentAnalysis = analyzeQuestionContent();
    const keyTerms = extractKeyTermsFromAnswer();
    
    // Generate subject-specific hints with enhanced intelligence
    const generateSubjectSpecificHint = () => {
      
      // Geography-enhanced hints
      if (subjectId === 'geography') {
        // Natural Hazards - more comprehensive
        if (questionText.includes('natural hazard')) {
          if (questionText.includes('definition') || questionText.includes('what is')) {
            return "Define as 'a natural process that poses a threat to people and property'. Include examples and mention the risk equation: Risk = Hazard × Vulnerability.";
          }
          if (questionText.includes('factor') && questionText.includes('risk')) {
            const factorHints = [];
            if (modelAnswer.includes('vulnerability')) factorHints.push("vulnerability of population");
            if (modelAnswer.includes('magnitude')) factorHints.push("magnitude/intensity of hazard");
            if (modelAnswer.includes('frequency')) factorHints.push("frequency of occurrence");
            if (modelAnswer.includes('population')) factorHints.push("population density");
            if (modelAnswer.includes('development')) factorHints.push("level of development/wealth");
            if (modelAnswer.includes('location')) factorHints.push("geographical location");
            
            return factorHints.length > 0 ? 
              `Key risk factors to discuss: ${factorHints.join(', ')}. Explain how each increases or decreases risk.` :
              "Consider: population density, level of development, hazard frequency/magnitude, geographical location, and community preparedness.";
          }
        }
        
        // Tectonic processes - enhanced
        if (questionText.includes('plate') && (questionText.includes('margin') || questionText.includes('boundary'))) {
          const plateTypes = [];
          if (modelAnswer.includes('constructive') || modelAnswer.includes('divergent')) plateTypes.push("constructive (divergent) - plates move apart, new oceanic crust forms");
          if (modelAnswer.includes('destructive') || modelAnswer.includes('convergent')) plateTypes.push("destructive (convergent) - plates collide, subduction occurs");
          if (modelAnswer.includes('conservative') || modelAnswer.includes('transform')) plateTypes.push("conservative (transform) - plates slide past each other");
          
          return plateTypes.length > 0 ?
            `Plate boundary types to explain: ${plateTypes.join('; ')}.` :
            "Explain the three main plate boundary types: constructive (divergent), destructive (convergent), and conservative (transform). Include plate movement direction and processes.";
        }
        
        // Hazard impacts - enhanced specificity  
        if ((questionText.includes('earthquake') || questionText.includes('volcanic') || questionText.includes('tsunami')) && 
            (questionText.includes('effect') || questionText.includes('impact'))) {
          
          const primaryEffects = [];
          const secondaryEffects = [];
          
          if (modelAnswer.includes('building') || modelAnswer.includes('collapse')) primaryEffects.push("building collapse/damage");
          if (modelAnswer.includes('death') || modelAnswer.includes('casualties')) primaryEffects.push("deaths and injuries");
          if (modelAnswer.includes('infrastructure')) primaryEffects.push("infrastructure damage (roads, bridges, utilities)");
          if (modelAnswer.includes('ground')) primaryEffects.push("ground shaking/rupture");
          
          if (modelAnswer.includes('disease')) secondaryEffects.push("disease outbreaks");
          if (modelAnswer.includes('unemployment') || modelAnswer.includes('economic')) secondaryEffects.push("unemployment and economic losses");
          if (modelAnswer.includes('homeless')) secondaryEffects.push("homelessness");
          if (modelAnswer.includes('psychological')) secondaryEffects.push("psychological trauma");
          
          let hint = "Separate primary (immediate) and secondary (longer-term) effects. ";
          if (primaryEffects.length > 0) hint += `Primary: ${primaryEffects.join(', ')}. `;
          if (secondaryEffects.length > 0) hint += `Secondary: ${secondaryEffects.join(', ')}.`;
          
          return hint || "Primary effects occur immediately (building damage, deaths, infrastructure failure). Secondary effects happen later (disease, unemployment, economic impact).";
        }
        
        // Climate change - more specific
        if (questionText.includes('climate change')) {
          if (questionText.includes('evidence')) {
            const evidenceTypes = [];
            if (modelAnswer.includes('ice core')) evidenceTypes.push("ice cores (CO₂ levels from trapped air)");
            if (modelAnswer.includes('tree ring')) evidenceTypes.push("tree rings (growth patterns show climate)");
            if (modelAnswer.includes('coral')) evidenceTypes.push("coral reef data");
            if (modelAnswer.includes('temperature')) evidenceTypes.push("instrumental temperature records");
            if (modelAnswer.includes('photograph') || modelAnswer.includes('satellite')) evidenceTypes.push("satellite/photographic evidence");
            
            return evidenceTypes.length > 0 ?
              `Types of evidence to discuss: ${evidenceTypes.join(', ')}.` :
              "Use multiple evidence types: ice cores, tree rings, temperature records, coral data, and satellite observations.";
          }
          
          if (questionText.includes('cause')) {
            const naturalCauses = [];
            const humanCauses = [];
            
            if (modelAnswer.includes('solar')) naturalCauses.push("solar output variations");
            if (modelAnswer.includes('volcanic')) naturalCauses.push("volcanic eruptions");
            if (modelAnswer.includes('orbital')) naturalCauses.push("orbital cycles (Milankovitch)");
            
            if (modelAnswer.includes('fossil fuel') || modelAnswer.includes('burning')) humanCauses.push("burning fossil fuels");
            if (modelAnswer.includes('deforestation')) humanCauses.push("deforestation");
            if (modelAnswer.includes('agriculture')) humanCauses.push("agriculture (methane from livestock)");
            if (modelAnswer.includes('transport')) humanCauses.push("transportation emissions");
            
            let hint = "Distinguish natural and human causes. ";
            if (naturalCauses.length > 0) hint += `Natural: ${naturalCauses.join(', ')}. `;
            if (humanCauses.length > 0) hint += `Human: ${humanCauses.join(', ')}.`;
            
            return hint || "Natural causes: solar variations, volcanic eruptions, orbital cycles. Human causes: fossil fuel burning, deforestation, agriculture.";
          }
        }
      }
      
      // Biology-enhanced hints
      if (subjectId === 'biology') {
        // Photosynthesis - more detailed
        if (questionText.includes('photosynthesis')) {
          if (questionText.includes('limiting factor')) {
            const factors = [];
            if (modelAnswer.includes('light')) factors.push("light intensity");
            if (modelAnswer.includes('co2') || modelAnswer.includes('carbon dioxide')) factors.push("CO₂ concentration");
            if (modelAnswer.includes('temperature')) factors.push("temperature");
            if (modelAnswer.includes('chlorophyll')) factors.push("chlorophyll availability");
            
            return factors.length > 0 ?
              `Limiting factors to consider: ${factors.join(', ')}. Explain the principle of limiting factors - the factor in shortest supply limits the rate.` :
              "Limiting factors: light intensity, CO₂ concentration, temperature. The factor in shortest supply controls the rate. Use graphs to show this relationship.";
          }
          
          if (questionText.includes('equation')) {
            return modelAnswer.includes('symbol') ?
              "Give both word and symbol equations. Word: carbon dioxide + water → glucose + oxygen (+ energy). Symbol: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (needs light energy and chlorophyll)." :
              "Word equation: carbon dioxide + water → glucose + oxygen. Include that light energy and chlorophyll are needed for the reaction.";
          }
        }
        
        // Genetics - enhanced
        if (questionText.includes('genetic') || questionText.includes('inherit') || questionText.includes('allele')) {
          if (questionText.includes('cross') || questionText.includes('offspring')) {
            return "Set up genetic cross clearly: 1) State parent phenotypes and genotypes, 2) Show possible gametes, 3) Draw Punnett square, 4) Give offspring genotypes and phenotypes, 5) State the ratio.";
          }
          
          if (questionText.includes('dominant') || questionText.includes('recessive')) {
            const tips = [];
            if (modelAnswer.includes('homozygous')) tips.push("homozygous (same alleles, e.g., AA or aa)");
            if (modelAnswer.includes('heterozygous')) tips.push("heterozygous (different alleles, e.g., Aa)");
            if (modelAnswer.includes('phenotype')) tips.push("phenotype (physical appearance)");
            if (modelAnswer.includes('genotype')) tips.push("genotype (genetic makeup)");
            
            return tips.length > 0 ?
              `Key genetics terms: ${tips.join(', ')}. Remember: dominant alleles mask recessive ones.` :
              "Use genetics terminology correctly: alleles (gene versions), genotype (genetic makeup), phenotype (appearance), homozygous/heterozygous.";
          }
        }
        
        // Cell processes
        if (questionText.includes('osmosis')) {
          if (modelAnswer.includes('concentrated') && modelAnswer.includes('dilute')) {
            return "Osmosis: water moves from dilute solution (high water potential) to concentrated solution (low water potential) through partially permeable membrane. In cells, consider effects on turgor pressure.";
          }
          return "Define osmosis as water movement across membranes. Explain the direction (dilute to concentrated) and effects on plant/animal cells.";
        }
      }
      
      // Chemistry-enhanced hints
      if (subjectId === 'chemistry') {
        if (questionText.includes('balance') && questionText.includes('equation')) {
          return "Balancing equations: 1) Count atoms of each element on both sides, 2) Start with most complex molecule, 3) Use coefficients (not subscripts), 4) Check all atoms balance, 5) Include state symbols if required.";
        }
        
        if (questionText.includes('bond')) {
          if (questionText.includes('ionic')) {
            const details = [];
            if (modelAnswer.includes('electron transfer') || modelAnswer.includes('lose') || modelAnswer.includes('gain')) {
              details.push("electron transfer (metal loses, non-metal gains)");
            }
            if (modelAnswer.includes('electrostatic') || modelAnswer.includes('attraction')) {
              details.push("electrostatic attraction between oppositely charged ions");
            }
            
            return details.length > 0 ?
              `Ionic bonding key points: ${details.join(', ')}.` :
              "Ionic bonds: metal atoms lose electrons (become cations), non-metals gain electrons (become anions), then oppositely charged ions attract.";
          }
          
          if (questionText.includes('covalent')) {
            return modelAnswer.includes('share') || modelAnswer.includes('electron pair') ?
              "Covalent bonding: non-metal atoms share electron pairs to achieve full outer shells. Each shared pair = one covalent bond." :
              "Covalent bonds form when atoms share electrons. Focus on electron pair sharing and how this fills outer electron shells.";
          }
        }
        
        // Calculations
        if (questionText.includes('mole') || questionText.includes('calculate') && (questionText.includes('mass') || questionText.includes('concentration'))) {
          const formulas = [];
          if (modelAnswer.includes('mass')) formulas.push("moles = mass ÷ Mr");
          if (modelAnswer.includes('concentration') || modelAnswer.includes('volume')) formulas.push("moles = concentration × volume (dm³)");
          if (modelAnswer.includes('avogadro')) formulas.push("1 mole = 6.02 × 10²³ particles");
          
          return formulas.length > 0 ?
            `Key formulas: ${formulas.join(', ')}. Show all working steps clearly.` :
            "Use mole calculations: moles = mass ÷ Mr, or moles = concentration × volume. Show working and include units.";
        }
      }
      
      // Physics-enhanced hints  
      if (subjectId === 'physics') {
        if (questionText.includes('force')) {
          if (questionText.includes('newton')) {
            const laws = [];
            if (modelAnswer.includes('1st') || modelAnswer.includes('first') || modelAnswer.includes('inertia')) {
              laws.push("1st law (inertia): objects continue in uniform motion unless acted on by resultant force");
            }
            if (modelAnswer.includes('2nd') || modelAnswer.includes('second') || modelAnswer.includes('f=ma')) {
              laws.push("2nd law: F = ma (force = mass × acceleration)");
            }
            if (modelAnswer.includes('3rd') || modelAnswer.includes('third') || modelAnswer.includes('equal') || modelAnswer.includes('opposite')) {
              laws.push("3rd law: every action has equal and opposite reaction");
            }
            
            return laws.length > 0 ? laws.join('. ') : 
              "Newton's laws: 1st (inertia), 2nd (F=ma), 3rd (action-reaction). Apply the relevant law to this situation.";
          }
        }
        
        if (questionText.includes('energy')) {
          const energyTypes = [];
          if (modelAnswer.includes('kinetic')) energyTypes.push("kinetic energy (KE = ½mv²)");
          if (modelAnswer.includes('potential') || modelAnswer.includes('gravitational')) energyTypes.push("gravitational potential energy (GPE = mgh)");
          if (modelAnswer.includes('elastic')) energyTypes.push("elastic potential energy");
          if (modelAnswer.includes('conservation')) energyTypes.push("conservation of energy principle");
          
          return energyTypes.length > 0 ?
            `Energy concepts: ${energyTypes.join(', ')}.` :
            "Consider energy types (kinetic, potential) and conservation principle. Use appropriate formulas and show calculations.";
        }
        
        if (questionText.includes('circuit')) {
          if (questionText.includes('series')) {
            return "Series circuits: current same throughout (I₁=I₂=I₃), voltage adds up (V_total=V₁+V₂+V₃), resistance adds up (R_total=R₁+R₂+R₃).";
          }
          if (questionText.includes('parallel')) {
            return "Parallel circuits: voltage same across branches (V₁=V₂=V₃), current splits (I_total=I₁+I₂+I₃), 1/R_total = 1/R₁ + 1/R₂ + 1/R₃.";
          }
        }
      }
      
      // Mathematics-enhanced hints
      if (subjectId === 'mathematics') {
        if (questionText.includes('expand') || questionText.includes('multiply out')) {
          return modelAnswer.includes('foil') || (questionText.includes('bracket') && questionText.includes('bracket')) ?
            "Use FOIL method: First terms, Outside terms, Inside terms, Last terms. Then collect like terms. E.g., (a+b)(c+d) = ac + ad + bc + bd." :
            "Multiply each term in first bracket by each term in second bracket. Collect like terms at the end.";
        }
        
        if (questionText.includes('solve') && questionText.includes('equation')) {
          if (questionText.includes('simultaneous')) {
            return "Simultaneous equations: use elimination (make coefficients equal, subtract equations) or substitution (solve one for a variable, substitute into other).";
          }
          if (questionText.includes('quadratic')) {
            return "Quadratic equations: try factoring first, then quadratic formula if needed. Remember to check both solutions make sense in context.";
          }
        }
        
        if (questionText.includes('probability')) {
          if (contentAnalysis.includes('calculation_needed')) {
            return "Calculate probability as favorable outcomes ÷ total outcomes. For multiple events, use P(A and B) = P(A) × P(B) if independent. Draw tree diagrams for complex scenarios.";
          }
        }
      }
      
      return null; // No subject-specific hint found
    };
    
    // Try subject-specific hint first
    const subjectHint = generateSubjectSpecificHint();
    if (subjectHint) return subjectHint;
    
    // Enhanced general hints based on question analysis
    const generateEnhancedGeneralHint = () => {
      // Command word specific hints
      if (questionText.includes('calculate') || questionText.includes('find')) {
        if (contentAnalysis.includes('calculation_needed')) {
          return keyTerms.length > 0 ?
            `This requires calculation. Key terms from the answer: ${keyTerms.slice(0, 3).join(', ')}. Identify given values, choose the right formula, show all working.` :
            "Identify given values, determine what you need to find, select appropriate formula, substitute values, show all working steps clearly, include units.";
        }
        return "Identify the given information, what you need to calculate, and the appropriate method or formula to use.";
      }
      
      if (questionText.includes('explain')) {
        if (contentAnalysis.includes('process_description')) {
          return keyTerms.length > 0 ?
            `Explain the process step-by-step. Key concepts likely needed: ${keyTerms.slice(0, 4).join(', ')}. Use linking words like 'because', 'therefore', 'as a result'.` :
            "Break down the process into clear steps. Use scientific terminology and explain cause-and-effect relationships.";
        }
        return keyTerms.length > 0 ?
          `Give clear reasons using scientific terminology. Key terms from model answer: ${keyTerms.slice(0, 3).join(', ')}.` :
          "Provide clear scientific explanations with reasoning. Use appropriate terminology and explain cause-and-effect relationships.";
      }
      
      if (questionText.includes('describe')) {
        return keyTerms.length > 0 ?
          `Give a detailed account of key features. Important terms: ${keyTerms.slice(0, 4).join(', ')}. Focus on specific details and examples.` :
          "Provide a detailed account focusing on key features, processes, or characteristics. Use specific examples and scientific terms.";
      }
      
      if (questionText.includes('compare') || questionText.includes('contrast')) {
        if (contentAnalysis.includes('comparison_needed')) {
          return "Make direct comparisons showing both similarities and differences. Use comparative language: 'whereas', 'however', 'in contrast', 'similarly'.";
        }
      }
      
      if (questionText.includes('evaluate') || questionText.includes('assess')) {
        return "Consider multiple perspectives, weigh evidence for and against, then make a reasoned judgment. Use evaluative language and justify your conclusion.";
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
      return null; // No subject-specific hint found
    };
    
    // Try subject-specific hint first
    const subjectHint = generateSubjectSpecificHint();
    if (subjectHint) return subjectHint;
    
    // Enhanced general hints based on question analysis
    const generateEnhancedGeneralHint = () => {
      // Command word specific hints
      if (questionText.includes('calculate') || questionText.includes('find')) {
        if (contentAnalysis.includes('calculation_needed')) {
          return keyTerms.length > 0 ?
            `This requires calculation. Key terms from the answer: ${keyTerms.slice(0, 3).join(', ')}. Identify given values, choose the right formula, show all working.` :
            "Identify given values, determine what you need to find, select appropriate formula, substitute values, show all working steps clearly, include units.";
        }
        return "Identify the given information, what you need to calculate, and the appropriate method or formula to use.";
      }
      
      if (questionText.includes('explain')) {
        if (contentAnalysis.includes('process_description')) {
          return keyTerms.length > 0 ?
            `Explain the process step-by-step. Key concepts likely needed: ${keyTerms.slice(0, 4).join(', ')}. Use linking words like 'because', 'therefore', 'as a result'.` :
            "Break down the process into clear steps. Use scientific terminology and explain cause-and-effect relationships.";
        }
        return keyTerms.length > 0 ?
          `Give clear reasons using scientific terminology. Key terms from model answer: ${keyTerms.slice(0, 3).join(', ')}.` :
          "Provide clear scientific explanations with reasoning. Use appropriate terminology and explain cause-and-effect relationships.";
      }
      
      if (questionText.includes('describe')) {
        return keyTerms.length > 0 ?
          `Give a detailed account of key features. Important terms: ${keyTerms.slice(0, 4).join(', ')}. Focus on specific details and examples.` :
          "Provide a detailed account focusing on key features, processes, or characteristics. Use specific examples and scientific terms.";
      }
      
      if (questionText.includes('compare') || questionText.includes('contrast')) {
        if (contentAnalysis.includes('comparison_needed')) {
          return "Make direct comparisons showing both similarities and differences. Use comparative language: 'whereas', 'however', 'in contrast', 'similarly'.";
        }
      }
      
      if (questionText.includes('evaluate') || questionText.includes('assess')) {
        return "Consider multiple perspectives, weigh evidence for and against, then make a reasoned judgment. Use evaluative language and justify your conclusion.";
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
    
    return generateEnhancedGeneralHint();
            return "Think about ocean temperature requirements, wind conditions, location relative to equator, and atmospheric conditions needed.";
          }
          
          if (questionText.includes('structure')) {
            if (modelAnswer.includes('eye') && modelAnswer.includes('wall')) {
              return "Describe the eye (calm center with descending air), eye wall (strongest winds and heaviest rain), and spiral rain bands extending outwards.";
            }
            return "Think about the central calm area, the area of strongest winds around it, and the spiral structure extending outwards.";
          }
        }
        
        if (questionText.includes('atmospheric circulation')) {
          if (modelAnswer.includes('hadley') || modelAnswer.includes('ferrel')) {
            return "Explain the three-cell model: Hadley cells (0-30°, hot air rises at equator), Ferrel cells (30-60°), Polar cells (60-90°, cold air sinks).";
          }
          return "Think about how hot air rises at the equator and cold air sinks at the poles, creating circulation cells and pressure belts.";
        }
        
        // Climate Change
        if (questionText.includes('climate change')) {
          if (questionText.includes('evidence')) {
            if (modelAnswer.includes('ice core') || modelAnswer.includes('tree ring')) {
              return "Use evidence like ice cores (trapped air bubbles), tree rings (growth patterns), historical records, and modern temperature measurements.";
            }
            return "Think about different types of evidence - from ice, trees, historical documents, and modern measurements showing temperature changes.";
          }
          
          if (questionText.includes('cause')) {
            if (modelAnswer.includes('natural') && modelAnswer.includes('human')) {
              return "Separate natural causes (solar output changes, volcanic eruptions, orbital cycles) from human causes (burning fossil fuels, deforestation, agriculture).";
            }
            return "Consider both natural factors and human activities that affect greenhouse gas concentrations and global temperatures.";
          }
          
          if (questionText.includes('mitigation')) {
            if (modelAnswer.includes('renewable') || modelAnswer.includes('carbon capture')) {
              return "Focus on reducing causes: renewable energy sources, carbon capture technology, international agreements, reducing fossil fuel use.";
            }
            return "Think about ways to reduce greenhouse gas emissions and prevent further climate change.";
          }
          
          if (questionText.includes('adaptation')) {
            if (modelAnswer.includes('flood defense') || modelAnswer.includes('crop')) {
              return "Focus on adjusting to change: flood defenses for sea level rise, drought-resistant crops, water management, changed farming practices.";
            }
            return "Think about how humans can adjust to cope with climate change effects rather than preventing them.";
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
                       <Badge 
                         variant={currentQuestion.calculatorGuidance === 'calc-recommended' ? 'default' : 'secondary'}
                         className={`text-xs ${
                           currentQuestion.calculatorGuidance === 'calc-recommended' 
                             ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30' 
                             : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30'
                         }`}
                       >
                         {currentQuestion.calculatorGuidance === 'calc-recommended' ? '🟩 Calculator recommended' : '🚫 No calculator'}
                       </Badge>
                     )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Question Text with Extract/Transcript Formatting */}
                {(() => {
                  const questionText = currentQuestion.question;
                  
                  // Check for transcript or extract sections
                  const transcriptMatch = questionText.match(/(.*?)(Transcript:|Extract:|Text A:|Text B:)(.*)/s);
                  
                  if (transcriptMatch) {
                    const [, beforeText, markerText, afterText] = transcriptMatch;
                    
                    // Split the after text to separate the actual transcript/extract from any following text
                    const parts = afterText.split(/\n(?=[A-Z][^:]*:)/);
                    const extractContent = parts[0];
                    const remainingText = parts.slice(1).join('\n');
                    
                    return (
                      <div className="space-y-4">
                        {beforeText.trim() && (
                          <p className="text-foreground leading-relaxed">
                            {beforeText.trim()}
                          </p>
                        )}
                        
                        {/* Extract/Transcript Display */}
                        <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center">
                            <Book className="h-4 w-4 mr-2" />
                            {markerText.replace(':', '')}
                          </h4>
                          <div className="text-foreground font-mono text-sm leading-relaxed whitespace-pre-line bg-background/80 p-3 rounded">
                            {extractContent.trim()}
                          </div>
                        </div>
                        
                        {remainingText.trim() && (
                          <p className="text-foreground leading-relaxed">
                            {remainingText.trim()}
                          </p>
                        )}
                      </div>
                    );
                  }
                  
                  // For questions with embedded texts (Text A: / Text B: format)
                  const textSections = questionText.split(/(Text [A-Z]:)/);
                  if (textSections.length > 1) {
                    return (
                      <div className="space-y-4">
                        {textSections.map((section, index) => {
                          if (section.match(/Text [A-Z]:/)) {
                            const nextSection = textSections[index + 1];
                            if (nextSection) {
                              return (
                                <div key={index} className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                                   <h4 className="font-mono font-semibold text-foreground mb-2 flex items-center">
                                    <Book className="h-4 w-4 mr-2" />
                                    {section}
                                  </h4>
                                  <div className="text-foreground font-normal bg-background/80 p-3 rounded">
                                    "{nextSection.trim()}"
                                  </div>
                                </div>
                              );
                            }
                          } else if (index === 0 || !textSections[index - 1]?.match(/Text [A-Z]:/)) {
                            return (
                              <p key={index} className="text-foreground leading-relaxed">
                                {section.trim()}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                  
                  // Default rendering for simple questions
                  return (
                    <p className="text-foreground mb-6 leading-relaxed">
                      {questionText}
                    </p>
                  );
                })()}
                
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
                      <div className="text-foreground space-y-2">
                        {currentAttempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                          <p key={index} className="leading-relaxed">{sentence.trim()}{index < currentAttempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).length - 1 ? '.' : ''}</p>
                        ))}
                      </div>
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

                  <div className="space-y-3">
                    <Button onClick={handleNextQuestion} className="w-full">
                      {currentQuestionIndex < shuffledQuestions.length - 1 ? "Next Question" : "Finish Session"}
                    </Button>
                    <Button 
                      onClick={() => navigate('/notebook')}
                      variant="outline"
                      className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-300 hover:shadow-md transition-all duration-200 dark:from-purple-950/30 dark:to-indigo-950/30 dark:border-purple-700 dark:text-purple-300 dark:hover:from-purple-950/50 dark:hover:to-indigo-950/50 dark:hover:border-purple-600"
                    >
                      <span className="font-medium">📚 View Smart Notebook</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Personalized Notification */}
      {notification.isVisible && (
        <PersonalizedNotification
          type={notification.type!}
          questionNumber={notification.questionNumber}
          topicName={notification.topicName}
          subjectName={notification.subjectName}
          streakCount={notification.streakCount}
          onClose={clearNotification}
          onAction={() => {
            if (notification.type === "practice-streak") {
              navigate(`/predicted-exam/${subjectId}`);
            } else if (notification.type === "wrong-answer") {
              navigate(`/subject-topics/${subjectId}`);
            }
            clearNotification();
          }}
        />
      )}
    </div>
  );
};

export default Practice;
