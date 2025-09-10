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
    const modelAnswer = question.modelAnswer;
    const markingCriteria = question.markingCriteria.breakdown;
    
    // Advanced analysis of model answer to generate contextual hints
    const analyzeModelAnswer = () => {
      const sentences = modelAnswer.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const firstSentence = sentences[0]?.trim() || '';
      const keyPoints = sentences.slice(1).map(s => s.trim()).filter(s => s.length > 5);
      
      // Extract important scientific/academic terms and concepts
      const extractImportantConcepts = (text: string) => {
        const scientificTerms = [];
        const commonWords = ['the', 'and', 'but', 'or', 'a', 'an', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'this', 'that', 'these', 'those', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'as', 'can', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'need', 'also', 'very', 'more', 'most', 'some', 'many', 'much', 'such', 'than', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'into', 'about', 'against', 'example', 'examples', 'because', 'therefore', 'however', 'although', 'while', 'when', 'where', 'what', 'which', 'who', 'how', 'why'];
        
        // Split text and find meaningful terms
        const words = text.toLowerCase().split(/[\s,.-]+/)
          .filter(word => word.length > 3 && !commonWords.includes(word))
          .map(word => word.replace(/[^a-zA-Z]/g, ''));
        
        // Look for important scientific indicators
        const patterns = [
          /\d+°c|\d+\s*degrees/i, // temperatures
          /\d+%|\d+\s*percent/i, // percentages  
          /ph\s*\d+|ph\s*scale/i, // pH values
          /formula|equation|reaction/i, // chemistry/physics
          /cell|nucleus|mitochondria|chloroplast/i, // biology
          /tectonic|volcanic|earthquake|tsunami/i, // geography
          /energy|force|velocity|acceleration/i, // physics
          /carbon|oxygen|hydrogen|nitrogen/i, // chemistry
          /photosynthesis|respiration|osmosis|diffusion/i, // biology processes
        ];
        
        patterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            scientificTerms.push(...matches.map(m => m.toLowerCase()));
          }
        });
        
        return [...new Set([...words.slice(0, 6), ...scientificTerms])];
      };
      
      return {
        mainTopic: extractImportantConcepts(firstSentence),
        supportingPoints: keyPoints.map(point => extractImportantConcepts(point)).flat(),
        keyTerms: extractImportantConcepts(modelAnswer)
      };
    };
    
    const analysis = analyzeModelAnswer();
    
    // Generate contextual hints based on question content and model answer
    const generateContextualHint = () => {
      // Identify question command words
      const isDefine = questionText.includes('define') || questionText.includes('what is') || questionText.includes('meaning of');
      const isExplain = questionText.includes('explain') || questionText.includes('describe') || questionText.includes('how does') || questionText.includes('why does');
      const isCompare = questionText.includes('compare') || questionText.includes('contrast') || questionText.includes('difference between');
      const isEvaluate = questionText.includes('evaluate') || questionText.includes('assess') || questionText.includes('discuss') || questionText.includes('advantages') || questionText.includes('disadvantages');
      const isList = questionText.includes('list') || questionText.includes('name') || questionText.includes('identify') || questionText.includes('state');
      const isCalculate = questionText.includes('calculate') || questionText.includes('work out') || questionText.includes('find the');
      
      let hint = '';
      
      // Analyze model answer for specific events, incidents, or concepts
      const analyzeContent = () => {
        const modelLower = modelAnswer.toLowerCase();
        
        // Subject-aware content analysis
        if (subjectId === 'maths') {
          // Math-specific content analysis based on actual question content
          const questionLower = questionText.toLowerCase();
          
          // Check for advanced mathematical concepts first (higher priority)
          if (questionLower.includes('probability') || questionLower.includes('chance') || questionLower.includes('likely')) {
            return "Think about favorable outcomes over total possible outcomes. For multiple events, consider if they're independent.";
          }
          
          if (questionText.match(/\d+[\^⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/) || questionLower.includes('exponent') || questionLower.includes('power') || questionLower.includes('index')) {
            return "Use the laws of exponents. When multiplying powers with the same base, add the exponents.";
          }
          
          if (questionLower.includes('algebra') || questionLower.includes('solve') || questionLower.includes('equation') || questionLower.includes('x =')) {
            return "Set up the equation step-by-step. Remember to show each algebraic manipulation clearly.";
          }
          
          if (questionLower.includes('fraction') || modelAnswer.includes('/') && modelAnswer.match(/\d+\/\d+/)) {
            return "Work with fractions by finding common denominators. Simplify your answer if possible.";
          }
          
          if (questionLower.includes('percentage') || questionLower.includes('%') || modelAnswer.includes('%')) {
            return "Remember: to find a percentage, divide by 100. To find a percentage of an amount, multiply.";
          }
          
          if (questionLower.includes('area') || questionLower.includes('perimeter') || questionLower.includes('volume')) {
            return "Use the correct formula for the shape. Draw a diagram if it helps, and include units in your answer.";
          }
          
          if (questionLower.includes('angle') || questionLower.includes('degrees') || questionLower.includes('triangle')) {
            return "Remember angle rules: angles in a triangle add to 180°, angles on a line add to 180°.";
          }
          
          if (questionLower.includes('graph') || questionLower.includes('coordinate') || questionLower.includes('plot')) {
            return "Plot points carefully on the coordinate grid. Check your x and y values match the question.";
          }
          
          // Basic arithmetic operations (lower priority)
          if (questionLower.includes('add') || questionLower.includes('sum') || (modelAnswer.includes('+') && modelAnswer.match(/^\d+\s*\+\s*\d+$/))) {
            return "Add the numbers step by step. Line up decimal places if needed and check your arithmetic.";
          }
          
          if (questionLower.includes('subtract') || questionLower.includes('difference') || (modelAnswer.includes('-') && modelAnswer.match(/^\d+\s*-\s*\d+$/))) {
            return "Subtract carefully, borrowing if necessary. Double-check by adding your answer to the smaller number.";
          }
          
          if ((questionLower.includes('multiply') || questionLower.includes('times') || questionLower.includes('product')) && !questionLower.includes('probability')) {
            return "Multiply step by step. Use the grid method or long multiplication, and check your place values.";
          }
          
          if (questionLower.includes('divide') || questionLower.includes('shared') || questionLower.includes('÷')) {
            return "Use long division or chunking method. Check your answer by multiplying back.";
          }
          
          // For general calculation questions
          if (questionLower.includes('calculate') || questionLower.includes('work out') || questionLower.includes('find')) {
            return "Work through the problem step by step, showing your method clearly. Double-check your calculations.";
          }
          
          // If no specific pattern matches, provide general guidance
          return "Think about what the question is asking and work through it step by step. Show your working clearly.";
        }
        
        // Science-specific content analysis
        if (subjectId === 'biology' || subjectId === 'chemistry' || subjectId === 'physics') {
          const questionLower = questionText.toLowerCase();
          
          // Biology-specific topics
          if (questionLower.includes('drug testing') || questionLower.includes('medicine') || questionLower.includes('clinical trial')) {
            return "Think about the stages of drug testing: laboratory testing, animal testing, then human trials (phases I, II, III). Consider safety and effectiveness at each stage.";
          }
          if (modelLower.includes('photosynthesis')) {
            return "Consider the process of photosynthesis and what's needed for it to occur.";
          }
          if (modelLower.includes('respiration')) {
            return "Think about cellular respiration and how it differs from breathing.";
          }
          if (modelLower.includes('osmosis') || modelLower.includes('diffusion')) {
            return "Focus on how substances move across membranes.";
          }
          if (modelLower.includes('enzyme')) {
            return "Consider how enzymes work and what affects their activity.";
          }
          if (modelLower.includes('ecosystem') || modelLower.includes('food chain')) {
            return "Think about the relationships between organisms in the ecosystem.";
          }
          if (questionLower.includes('antibiot') || modelLower.includes('antibiot')) {
            return "Consider how antibiotics work against bacteria and why resistance develops.";
          }
          if (questionLower.includes('vaccin') || modelLower.includes('vaccin')) {
            return "Think about how vaccines prepare the immune system to fight specific diseases.";
          }
          if (questionLower.includes('inheritance') || questionLower.includes('genetic') || modelLower.includes('allele')) {
            return "Consider how genes are passed from parents to offspring and how dominant/recessive alleles work.";
          }
          
          // Chemistry-specific topics
          if (subjectId === 'chemistry') {
            if (questionLower.includes('reaction') || modelLower.includes('reaction')) {
              return "Think about the reactants, products, and conditions needed for this chemical reaction.";
            }
            if (questionLower.includes('acid') || questionLower.includes('alkali') || modelLower.includes('ph')) {
              return "Consider the pH scale and how acids and alkalis behave in reactions.";
            }
          }
          
          // Physics-specific topics  
          if (subjectId === 'physics') {
            if (questionLower.includes('force') || questionLower.includes('motion')) {
              return "Think about the forces acting and how they affect motion. Use Newton's laws if relevant.";
            }
            if (questionLower.includes('energy') || modelLower.includes('energy')) {
              return "Consider the different types of energy and how energy is conserved or transferred.";
            }
          }
          
          // General science process questions
          if (questionLower.includes('describe') && (questionLower.includes('process') || questionLower.includes('how'))) {
            return "Break this scientific process down into clear stages. Explain what happens at each step and why.";
          }
          
          // Return early to prevent falling through to literature analysis
          return null;
        }
        
        // Business-specific content analysis
        if (subjectId === 'business') {
          const questionLower = questionText.toLowerCase();
          
          // Analyze the specific business topic being asked about
          if (questionLower.includes('interest rate') || modelLower.includes('interest rate')) {
            if (questionLower.includes('rising') || questionLower.includes('increase')) {
              return "Think about how higher interest rates affect borrowing costs and consumer spending. Consider both challenges and any potential benefits.";
            } else if (questionLower.includes('falling') || questionLower.includes('decrease')) {
              return "Consider how lower interest rates make borrowing cheaper and encourage spending. Think about the effects on business investment and consumer behavior.";
            } else {
              return "Think about how interest rate changes affect borrowing, investment decisions, and consumer spending patterns.";
            }
          }
          
          if (questionLower.includes('exchange rate') || modelLower.includes('exchange rate')) {
            if (questionLower.includes('export') || modelLower.includes('export')) {
              return "Consider how currency changes affect the price competitiveness of exported goods in foreign markets.";
            } else if (questionLower.includes('import') || modelLower.includes('import')) {
              return "Think about how currency changes affect the cost of imported materials and goods for the business.";
            } else {
              return "Consider how currency value changes affect both costs (imports) and revenues (exports) for the business.";
            }
          }
          
          if (questionLower.includes('marketing') || questionLower.includes('advertis') || modelLower.includes('marketing')) {
            return "Think about how this marketing approach affects customer awareness, brand image, and ultimately sales and profits.";
          }
          
          if (questionLower.includes('staff') || questionLower.includes('employee') || questionLower.includes('worker')) {
            if (questionLower.includes('motivat') || modelLower.includes('motivat')) {
              return "Consider what motivates employees and how this affects their productivity, job satisfaction, and loyalty to the business.";
            } else {
              return "Think about the effects on employee performance, costs, and the overall efficiency of business operations.";
            }
          }
          
          if (questionLower.includes('technology') || questionLower.includes('automation') || modelLower.includes('technology')) {
            return "Consider both the benefits (efficiency, cost savings) and challenges (initial costs, training needs) of technological changes.";
          }
          
          if (questionLower.includes('location') || questionLower.includes('relocat') || modelLower.includes('location')) {
            return "Think about factors like costs, access to customers and suppliers, transport links, and availability of skilled workers.";
          }
          
          if (questionLower.includes('price') || questionLower.includes('pricing') || modelLower.includes('price')) {
            if (questionLower.includes('increase') || questionLower.includes('rise')) {
              return "Consider how higher prices affect customer demand, competitor responses, and profit margins.";
            } else if (questionLower.includes('decrease') || questionLower.includes('lower')) {
              return "Think about how lower prices can attract customers but may reduce profit margins per sale.";
            } else {
              return "Consider how pricing changes affect customer demand, sales volume, and overall profitability.";
            }
          }
          
          if (questionLower.includes('competition') || questionLower.includes('competitor') || modelLower.includes('competit')) {
            return "Think about how competitive pressures affect pricing decisions, product development, and market share.";
          }
          
          if (questionLower.includes('cash flow') || modelLower.includes('cash flow')) {
            return "Consider how this affects the timing of money coming in and going out, and the business's ability to pay its bills.";
          }
          
          // Fallback for other business questions - analyze model answer content
          if (modelLower.includes('profit') || modelLower.includes('revenue') || modelLower.includes('cost')) {
            return "Consider the financial impact and how this affects the business's profitability and success.";
          }
          if (modelLower.includes('customer') || modelLower.includes('consumer')) {
            return "Think about how this affects customer satisfaction, loyalty, and purchasing decisions.";
          }
          if (modelLower.includes('market') || modelLower.includes('demand')) {
            return "Consider the market conditions and how supply and demand factors influence the business.";
          }
        }
        
        // General content analysis for literature/English
        if (modelLower.includes('trampl') || modelLower.includes('stomp')) {
          return "Think about the trampling incident and what it reveals about the character.";
        }
        if (modelLower.includes('murder') || modelLower.includes('kill')) {
          return "Consider the violent actions and their significance.";
        }
        if (modelLower.includes('transform') || modelLower.includes('chang')) {
          return "Focus on the transformation process and what causes it.";
        }
        if (modelLower.includes('appear') || modelLower.includes('first')) {
          return "Think about the first impression and initial description.";
        }
        if (modelLower.includes('symbol') || modelLower.includes('represent')) {
          return "Consider what this represents or symbolizes in the broader context.";
        }
        if (modelLower.includes('conflict') || modelLower.includes('tension')) {
          return "Analyze the conflict or tension being presented.";
        }
        if (modelLower.includes('reaction') && !modelLower.includes('chemical')) {
          return "Think about how characters react and what this tells us.";
        }
         
        return null;
      };
      
      const specificContent = analyzeContent();
      
      if (isDefine) {
        if (specificContent) {
          hint = `${specificContent} Start with a clear definition of the key term.`;
        } else {
          // Smart extraction of what needs to be defined
          const questionLower = questionText.toLowerCase();
          
          // Extract the term being asked to define
          let termToDefine = null;
          
          // Pattern: "What is X?" - extract X
          const whatIsMatch = questionText.match(/what\s+is\s+(?:a\s+|an\s+|the\s+)?([^?]+)/i);
          if (whatIsMatch) {
            termToDefine = whatIsMatch[1].trim();
          }
          
          // Pattern: "Define X" - extract X  
          const defineMatch = questionText.match(/define\s+(?:a\s+|an\s+|the\s+)?([^?]+)/i);
          if (defineMatch) {
            termToDefine = defineMatch[1].trim();
          }
          
          // Pattern: "What does X mean?" - extract X
          const meanMatch = questionText.match(/what\s+does\s+([^?]+?)\s+mean/i);
          if (meanMatch) {
            termToDefine = meanMatch[1].trim();
          }
          
          // Pattern: "What is meant by X?" - extract X
          const meantByMatch = questionText.match(/what\s+is\s+meant\s+by\s+([^?]+)/i);
          if (meantByMatch) {
            termToDefine = meantByMatch[1].trim();
          }
          
          // Create a proper hint based on what was found
          if (termToDefine) {
            // Clean up the term (remove articles, punctuation)
            const cleanTerm = termToDefine.replace(/[?!.,;:]$/, '').trim();
            hint = `Focus on providing a clear definition of ${cleanTerm}. Think about the key characteristics that make it unique and distinct from similar concepts.`;
          } else {
            hint = "Provide a clear, precise definition. Focus on the essential characteristics and features that make this concept unique.";
          }
        }
      } else if (isExplain) {
        if (specificContent) {
          hint = `${specificContent} Explain this step-by-step with clear reasoning.`;
        } else {
          // Analyze the question and model answer for specific guidance
          const questionLower = questionText.toLowerCase();
          const modelLower = modelAnswer.toLowerCase();
          
          // Extract key concepts from the question
          let contextualHint = null;
          
          // Literature/English specific guidance
          if (questionLower.includes('frankenstein')) {
            contextualHint = "Focus on Victor Frankenstein's character, his motivations, and the consequences of his actions.";
          } else if (questionLower.includes('monster') || questionLower.includes('creature')) {
            contextualHint = "Consider the creature's perspective, emotions, and relationship with its creator.";
          } else if (questionLower.includes('character') || questionLower.includes('protagonist')) {
            contextualHint = "Analyze the character's motivations, development, and relationships with others.";
          } else if (questionLower.includes('theme') || questionLower.includes('message')) {
            contextualHint = "Identify the main themes and explain how they're developed throughout the text.";
          } else if (questionLower.includes('language') || questionLower.includes('technique')) {
            contextualHint = "Examine the specific language techniques used and their effect on the reader.";
          } else if (questionLower.includes('setting') || questionLower.includes('atmosphere')) {
            contextualHint = "Consider how the setting creates mood and influences the events or characters.";
          }
          
          // Science specific guidance  
          else if (questionLower.includes('process') || questionLower.includes('reaction')) {
            contextualHint = "Break down the process into clear steps and explain what happens at each stage.";
          } else if (questionLower.includes('effect') || questionLower.includes('impact')) {
            contextualHint = "Explain the cause-and-effect relationship and why this happens.";
          }
          
          // Business specific guidance
          else if (questionLower.includes('business') || questionLower.includes('company')) {
            contextualHint = "Consider the business implications and how this affects different stakeholders.";
          }
          
          // Use contextual hint or analyze model answer structure
          if (contextualHint) {
            hint = contextualHint;
          } else if (modelAnswer.includes('first') || modelAnswer.includes('then') || modelAnswer.includes('finally')) {
            hint = "This needs a step-by-step explanation. Walk through the process in logical order.";
          } else {
            // Extract meaningful concepts from the model answer
            const sentences = modelAnswer.split(/[.!?]/).filter(s => s.trim().length > 0);
            if (sentences.length > 0) {
              const firstSentence = sentences[0].trim();
              
              // Filter out unhelpful words and focus on meaningful concepts
              const wordsToIgnore = new Set([
                'provides', 'does', 'uses', 'makes', 'shows', 'gives', 'takes', 'gets', 'comes', 'goes', 
                'becomes', 'seems', 'appears', 'looks', 'feels', 'sounds', 'acts', 'works', 'helps',
                'creates', 'forms', 'allows', 'causes', 'leads', 'results', 'means', 'involves',
                'includes', 'contains', 'represents', 'demonstrates', 'illustrates', 'reveals',
                'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there', 'where', 'when',
                'what', 'which', 'while', 'through', 'because', 'although', 'however', 'therefore'
              ]);
              
              const meaningfulWords = firstSentence.split(/\s+/)
                .filter(word => {
                  const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                  return cleanWord.length > 3 && 
                         !wordsToIgnore.has(cleanWord) &&
                         !/^(the|and|but|for|with|from|into|upon|over|under)$/.test(cleanWord);
                })
                .slice(0, 2);
              
              if (meaningfulWords.length > 0) {
                const concepts = meaningfulWords.join(' and ').toLowerCase();
                hint = `Think about ${concepts} and how they connect to answer this question clearly.`;
              } else {
                hint = "Break this down step by step and explain your reasoning clearly.";
              }
            } else {
              hint = "Break this down step by step and explain your reasoning clearly.";
            }
          }
        }
      } else if (isCompare) {
        if (specificContent) {
          hint = `${specificContent} Make sure to compare both sides systematically.`;
        } else {
          hint = "Compare both sides systematically. Look for similarities and differences, then explain their significance.";
        }
      } else if (isEvaluate) {
        if (specificContent) {
          hint = `${specificContent} Weigh up different viewpoints before reaching your conclusion.`;
        } else {
          hint = "Present balanced arguments from different perspectives, then give your reasoned conclusion.";
        }
      } else if (isList) {
        // Extract the number of points requested from the question text
        let requestedPoints = null;
        
        // Look for explicit numbers in the question
        const numberWords = {
          'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
          'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
        };
        
        const questionLower = questionText.toLowerCase();
        
        // Check for written numbers (e.g., "two ways", "three examples")
        for (const [word, num] of Object.entries(numberWords)) {
          if (questionLower.includes(word)) {
            requestedPoints = num;
            break;
          }
        }
        
        // Check for digit numbers (e.g., "2 ways", "3 examples")
        if (!requestedPoints) {
          const digitMatch = questionText.match(/(\d+)\s*(?:ways?|examples?|points?|reasons?|methods?|factors?|benefits?|disadvantages?|advantages?)/i);
          if (digitMatch) {
            requestedPoints = parseInt(digitMatch[1]);
          }
        }
        
        // Fallback to analyzing model answer structure if no explicit number found
        if (!requestedPoints) {
          const numberOfPoints = modelAnswer.split(/[.;]/).filter(part => part.trim().length > 0).length;
          requestedPoints = Math.max(numberOfPoints - 1, 1); // Subtract 1 to account for potential intro/conclusion
        }
        
        const targetPoints = Math.min(requestedPoints, 5);
        
        if (specificContent) {
          hint = `${specificContent} Aim for ${targetPoints} clear points.`;
        } else {
          hint = `Provide a clear list of points (aim for ${targetPoints}). Be specific and precise.`;
        }
      } else if (isCalculate) {
        if (specificContent) {
          hint = specificContent;
        } else {
          // Extract numbers from both question and model answer
          const questionNumbers = questionText.match(/\d+(?:\.\d+)?/g) || [];
          const modelNumbers = modelAnswer.match(/\d+(?:\.\d+)?/g) || [];
          
          // Analyze the model answer structure to understand the calculation
          const modelAnswerLines = modelAnswer.split(/\n|=/).map(line => line.trim()).filter(line => line);
          
          // Look for specific calculation patterns in the model answer
          if (modelAnswer.includes('×') || modelAnswer.includes('*')) {
            const factors = modelAnswer.match(/(\d+(?:\.\d+)?)\s*[×*]\s*(\d+(?:\.\d+)?)/);
            if (factors) {
              hint = `You need to multiply ${factors[1]} by ${factors[2]}. ${factors[1]} × ${factors[2]} = ${parseFloat(factors[1]) * parseFloat(factors[2])}.`;
            } else {
              hint = "Look for the numbers you need to multiply together from the question.";
            }
          } else if (modelAnswer.includes('÷') || modelAnswer.includes('/')) {
            const division = modelAnswer.match(/(\d+(?:\.\d+)?)\s*[÷/]\s*(\d+(?:\.\d+)?)/);
            if (division) {
              hint = `You need to divide ${division[1]} by ${division[2]}. Work out ${division[1]} ÷ ${division[2]}.`;
            } else {
              hint = "Find which number you need to divide by which from the question.";
            }
          } else if (modelAnswer.includes('+')) {
            const addition = modelAnswer.match(/(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)/);
            if (addition) {
              hint = `Add ${addition[1]} and ${addition[2]} together. ${addition[1]} + ${addition[2]} = ${parseFloat(addition[1]) + parseFloat(addition[2])}.`;
            } else {
              hint = "Identify which numbers from the question need to be added together.";
            }
          } else if (modelAnswer.includes('-') || modelAnswer.includes('−')) {
            const subtraction = modelAnswer.match(/(\d+(?:\.\d+)?)\s*[-−]\s*(\d+(?:\.\d+)?)/);
            if (subtraction) {
              hint = `Subtract ${subtraction[2]} from ${subtraction[1]}. Work out ${subtraction[1]} - ${subtraction[2]}.`;
            } else {
              hint = "Find which numbers you need to subtract from the question.";
            }
          } else if (modelNumbers.length > 0 && questionNumbers.length > 0) {
            // Find which question numbers appear in the model answer
            const usedNumbers = questionNumbers.filter(num => modelAnswer.includes(num));
            if (usedNumbers.length >= 2) {
              hint = `Use the numbers ${usedNumbers.slice(0, 2).join(' and ')} from the question. Look at how they're combined in the calculation.`;
            } else if (usedNumbers.length === 1) {
              hint = `Start with the number ${usedNumbers[0]} from the question and see what operation you need to perform.`;
            } else {
              hint = `The answer should be ${modelNumbers[modelNumbers.length - 1]}. Work backwards to see which numbers and operations get you there.`;
            }
          } else {
            hint = "Read the question carefully to identify what calculation is needed, then work through it step by step.";
          }
        }
      } else if (specificContent) {
        hint = specificContent;
      }
      
      return hint;
    };
    
    const contextualHint = generateContextualHint();
    if (contextualHint) {
      return contextualHint;
    }
    
    // Analyze question and model answer content for specific guidance
    if (question.marks >= 6) {
      // For longer questions, analyze the model answer structure and question content
      const questionLower = questionText.toLowerCase();
      const modelLower = modelAnswer.toLowerCase();
      const sentences = modelAnswer.split(/[.!?]/).filter(s => s.trim().length > 10);
      
      // Extract key themes or concepts from the question and model answer
      let specificGuidance = null;
      
      // Literature analysis
      if (questionLower.includes('frankenstein') || modelLower.includes('frankenstein')) {
        specificGuidance = "Consider Shelley's themes of scientific responsibility, isolation, and the consequences of unchecked ambition. Use specific examples from the text.";
      } else if (questionLower.includes('character') && (modelLower.includes('develop') || modelLower.includes('change'))) {
        specificGuidance = "Analyze how the character develops through specific events and quote key moments that show this transformation.";
      } else if (questionLower.includes('language') || questionLower.includes('technique')) {
        specificGuidance = "Identify specific literary techniques used and explain their effect on the reader with textual evidence.";
      }
      
      // Science analysis
      else if (questionLower.includes('process') || modelLower.includes('process')) {
        specificGuidance = "Break down each stage of the process and explain what happens at each step with scientific reasoning.";
      } else if (questionLower.includes('effect') || modelLower.includes('effect')) {
        specificGuidance = "Explain the cause-and-effect relationships and the scientific principles behind why this happens.";
      }
      
      // Business analysis  
      else if (questionLower.includes('business') || questionLower.includes('company')) {
        specificGuidance = "Consider the impact on different stakeholders and use business terminology to explain the effects.";
      }
      
      // Geography/History analysis
      else if (questionLower.includes('impact') || questionLower.includes('consequence')) {
        specificGuidance = "Examine both short-term and long-term effects, providing specific examples and evidence.";
      }
      
      // Fallback: analyze model answer content
      if (!specificGuidance && sentences.length >= 2) {
        const keyTerms = [];
        sentences.forEach(sentence => {
          const words = sentence.split(/\s+/).filter(word => word.length > 4 && !['this', 'that', 'which', 'where', 'when'].includes(word.toLowerCase()));
          keyTerms.push(...words.slice(0, 2));
        });
        
        if (keyTerms.length > 0) {
          const uniqueTerms = [...new Set(keyTerms.slice(0, 4))];
          specificGuidance = `Focus on ${uniqueTerms.join(', ').toLowerCase()} and develop each point with detailed explanations and specific examples.`;
        }
      }
      
      return specificGuidance || "This requires a detailed response - plan your main points and support each one with specific examples and explanations.";
      
    } else if (question.marks >= 3) {
      // For medium questions, provide targeted guidance
      const questionLower = questionText.toLowerCase();
      const modelLower = modelAnswer.toLowerCase();
      
      let targetedHint = null;
      
      // Smart extraction of what the question is asking for
      
      if (questionLower.includes('explain')) {
        // Extract what needs to be explained more intelligently
        let topicToExplain = null;
        
        // Pattern: "Explain how X works/happens" 
        const howMatch = questionText.match(/explain\s+how\s+([^?.]+?)(?:\s+works?|\s+happens?|\s+occurs?|$)/i);
        if (howMatch) {
          topicToExplain = `how ${howMatch[1].trim()} works`;
        }
        
        // Pattern: "Explain why X"
        const whyMatch = questionText.match(/explain\s+why\s+([^?.]+)/i);
        if (whyMatch) {
          topicToExplain = `why ${whyMatch[1].trim()}`;
        }
        
        // Pattern: "Explain the X"
        const theMatch = questionText.match(/explain\s+the\s+([^?.]+)/i);
        if (theMatch) {
          topicToExplain = `the ${theMatch[1].trim()}`;
        }
        
        // Pattern: "Explain X"
        const directMatch = questionText.match(/explain\s+([^?.]+)/i);
        if (directMatch && !topicToExplain) {
          topicToExplain = directMatch[1].trim();
        }
        
        if (topicToExplain) {
          targetedHint = `Break down ${topicToExplain} step by step. Consider the key factors and explain their relationships with specific details.`;
        } else {
          targetedHint = `Break down the topic step by step. Explain the key factors and their relationships with specific details.`;
        }
        
      } else if (questionLower.includes('describe')) {
        // Extract what needs to be described
        let topicToDescribe = null;
        
        // Pattern: "Describe how X"
        const howMatch = questionText.match(/describe\s+how\s+([^?.]+)/i);
        if (howMatch) {
          topicToDescribe = `how ${howMatch[1].trim()}`;
        }
        
        // Pattern: "Describe the X"
        const theMatch = questionText.match(/describe\s+the\s+([^?.]+)/i);
        if (theMatch) {
          topicToDescribe = `the ${theMatch[1].trim()}`;
        }
        
        // Pattern: "Describe X"
        const directMatch = questionText.match(/describe\s+([^?.]+)/i);
        if (directMatch && !topicToDescribe) {
          topicToDescribe = directMatch[1].trim();
        }
        
        if (topicToDescribe) {
          targetedHint = `Focus on describing ${topicToDescribe} using specific features and characteristics. Provide concrete examples to support your description.`;
        } else {
          targetedHint = `Focus on the specific features and characteristics. Provide concrete examples to support your description.`;
        }
        
      } else if (questionLower.includes('analyse') || questionLower.includes('analyze')) {
        targetedHint = `Break down the components and examine how they work together. Use evidence to support your analysis.`;
      }
      
      // Analyze model answer for specific content
      const sentences = modelAnswer.split(/[.!?]/).filter(s => s.trim().length > 5);
      if (!targetedHint && sentences.length > 0) {
        const firstSentence = sentences[0].trim();
        
        // Filter out unhelpful words and focus on meaningful concepts
        const wordsToIgnore = new Set([
          'provides', 'does', 'uses', 'makes', 'shows', 'gives', 'takes', 'gets', 'comes', 'goes', 
          'becomes', 'seems', 'appears', 'looks', 'feels', 'sounds', 'acts', 'works', 'helps',
          'creates', 'forms', 'allows', 'causes', 'leads', 'results', 'means', 'involves',
          'includes', 'contains', 'represents', 'demonstrates', 'illustrates', 'reveals',
          'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there', 'where', 'when',
          'what', 'which', 'while', 'through', 'because', 'although', 'however', 'therefore'
        ]);
        
        const meaningfulWords = firstSentence.split(/\s+/)
          .filter(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            return cleanWord.length > 3 && 
                   !wordsToIgnore.has(cleanWord) &&
                   !/^(the|and|but|for|with|from|into|upon|over|under)$/.test(cleanWord);
          })
          .slice(0, 3);
        
        if (meaningfulWords.length > 0) {
          const concepts = meaningfulWords.join(', ').toLowerCase();
          targetedHint = `Think about ${concepts} and explain how these concepts work together. Use specific details to support your explanation.`;
        }
      }
      
      return targetedHint || "Provide specific details and explanations for each point you make, using relevant examples.";
      
    } else {
      // For short questions, analyze what's being asked
      const questionLower = questionText.toLowerCase();
      
      if (questionLower.includes('define') || questionLower.includes('what is')) {
        return `Give a clear, precise definition focusing on the key characteristics that make this concept unique and distinct.`;
      } else if (questionLower.includes('state') || questionLower.includes('name')) {
        return `Provide the specific answer requested - be direct and precise in your response.`;
      } else {
        // Extract meaningful concepts from model answer for guidance
        const sentences = modelAnswer.split(/[.!?]/).filter(s => s.trim().length > 3);
        if (sentences.length > 0) {
          const firstSentence = sentences[0].trim();
          
          // Filter for meaningful concepts only
          const wordsToIgnore = new Set([
            'provides', 'does', 'uses', 'makes', 'shows', 'gives', 'takes', 'gets', 'comes', 'goes', 
            'becomes', 'seems', 'appears', 'looks', 'feels', 'sounds', 'acts', 'works', 'helps',
            'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there', 'where', 'when'
          ]);
          
          const meaningfulWords = firstSentence.split(/\s+/)
            .filter(word => {
              const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
              return cleanWord.length > 2 && !wordsToIgnore.has(cleanWord);
            })
            .slice(0, 3);
          
          if (meaningfulWords.length > 0) {
            // Create a more natural hint based on the meaningful words found
            if (meaningfulWords.length === 1) {
              return `Focus on ${meaningfulWords[0].toLowerCase()} in your answer. Be concise but accurate.`;
            } else if (meaningfulWords.length === 2) {
              return `Consider ${meaningfulWords[0].toLowerCase()} and ${meaningfulWords[1].toLowerCase()} in your response. Keep it focused and precise.`;
            } else {
              return `Think about key concepts like ${meaningfulWords[0].toLowerCase()}, ${meaningfulWords[1].toLowerCase()}, and ${meaningfulWords[2].toLowerCase()}. Address these clearly in your answer.`;
            }
          }
        }
        
        return "Keep your answer focused and precise, directly addressing what the question asks for.";
      }
    }
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
        />
      )}
    </div>
  );
};

export default Practice;