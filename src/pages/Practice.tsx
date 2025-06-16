import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum, Question } from "@/data/curriculum";
import { ArrowLeft, CheckCircle, AlertCircle, Book, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

  const subject = curriculum.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);
  const questions = topic?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!subject || !topic) {
      navigate('/dashboard');
    }
  }, [subject, topic, navigate]);

  const simulateAIMarking = async (question: Question, answer: string) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!answer.trim()) {
      return {
        modelAnswer: question.modelAnswer,
        whyThisGetsMark: question.markingCriteria.breakdown.join('\n'),
        whyYoursDidnt: "No answer provided - cannot award any marks.",
        specLink: question.specReference
      };
    }

    // Enhanced marking logic based on key concepts and scientific accuracy
    const modelWords = question.modelAnswer.toLowerCase().split(/\s+/);
    const userWords = answer.toLowerCase().split(/\s+/);
    
    // Extract key scientific terms and concepts from model answer
    const keyTerms = extractKeyTerms(question.modelAnswer, subjectId!);
    const userKeyTerms = extractKeyTerms(answer, subjectId!);
    
    // Calculate different scoring components
    const keyTermScore = calculateKeyTermScore(keyTerms, userKeyTerms);
    const conceptualScore = calculateConceptualScore(question, answer, subjectId!);
    const structureScore = calculateStructureScore(answer, question.marks);
    const accuracyScore = calculateAccuracyScore(question, answer, subjectId!);
    
    // Weight the scores appropriately and convert to marks
    const percentageScore = Math.round(
      (keyTermScore * 0.3) +
      (conceptualScore * 0.4) +
      (structureScore * 0.15) +
      (accuracyScore * 0.15)
    );
    
    // Convert percentage to actual marks out of total
    const marksAwarded = Math.round((percentageScore / 100) * question.marks);
    
    // Generate detailed feedback based on performance
    const feedback = generateDetailedFeedback(question, answer, percentageScore, keyTerms, userKeyTerms);
    
    return {
      modelAnswer: question.modelAnswer,
      whyThisGetsMark: question.markingCriteria.breakdown.join('\n'),
      whyYoursDidnt: feedback,
      specLink: question.specReference
    };
  };

  const extractKeyTerms = (text: string, subjectId: string): string[] => {
    const commonTerms = {
      biology: [
        'osmosis', 'diffusion', 'enzyme', 'catalyst', 'active site', 'substrate',
        'mitochondria', 'nucleus', 'membrane', 'cell wall', 'photosynthesis',
        'respiration', 'glucose', 'oxygen', 'carbon dioxide', 'water potential',
        'concentration gradient', 'partially permeable', 'energy', 'ATP',
        'antibody', 'antigen', 'phagocyte', 'lymphocyte', 'pathogen'
      ],
      chemistry: [
        'atom', 'proton', 'neutron', 'electron', 'nucleus', 'shell', 'orbital',
        'ionic', 'covalent', 'metallic', 'bond', 'molecule', 'compound',
        'element', 'periodic table', 'mass number', 'atomic number',
        'electrostatic', 'melting point', 'boiling point', 'relative formula mass'
      ],
      maths: [
        'fraction', 'decimal', 'percentage', 'ratio', 'proportion', 'equation',
        'solve', 'simplify', 'multiply', 'divide', 'area', 'perimeter',
        'probability', 'outcome', 'formula', 'substitute', 'rearrange'
      ]
    };

    const subjectTerms = commonTerms[subjectId as keyof typeof commonTerms] || [];
    const textLower = text.toLowerCase();
    
    // More accurate term matching - check if the term or its variations exist in the text
    return subjectTerms.filter(term => {
      const termLower = term.toLowerCase();
      // Check for exact matches or partial matches (but not just single letters)
      return textLower.includes(termLower) || 
             textLower.includes(termLower.replace(' ', '')) || // handles "activesite" vs "active site"
             (termLower.includes(' ') && termLower.split(' ').every(word => textLower.includes(word)));
    });
  };

  const calculateKeyTermScore = (modelTerms: string[], userTerms: string[]): number => {
    if (modelTerms.length === 0) return 70;
    
    // More lenient matching - if user has the key terms, give them credit
    const matchedTerms = modelTerms.filter(modelTerm => 
      userTerms.some(userTerm => {
        const modelLower = modelTerm.toLowerCase();
        const userLower = userTerm.toLowerCase();
        return modelLower === userLower || 
               modelLower.includes(userLower) || 
               userLower.includes(modelLower) ||
               // Handle compound terms like "active site"
               (modelLower.includes(' ') && modelLower.split(' ').every(word => userLower.includes(word)));
      })
    );
    
    return Math.min((matchedTerms.length / modelTerms.length) * 100, 100);
  };

  const calculateConceptualScore = (question: Question, answer: string, subjectId: string): number => {
    const answerLower = answer.toLowerCase();
    
    // Subject-specific conceptual checking
    if (subjectId === 'biology') {
      if (question.question.toLowerCase().includes('osmosis')) {
        const hasWaterMovement = answerLower.includes('water') && (answerLower.includes('move') || answerLower.includes('transport'));
        const hasMembrane = answerLower.includes('membrane') || answerLower.includes('permeable');
        const hasConcentration = answerLower.includes('concentration') || answerLower.includes('potential');
        
        return (hasWaterMovement ? 30 : 0) + (hasMembrane ? 35 : 0) + (hasConcentration ? 35 : 0);
      }
      
      if (question.question.toLowerCase().includes('enzyme')) {
        const hasCatalyst = answerLower.includes('catalyst') || answerLower.includes('speed');
        const hasActiveSite = answerLower.includes('active site') || answerLower.includes('specific');
        const hasSubstrate = answerLower.includes('substrate');
        
        return (hasCatalyst ? 40 : 0) + (hasActiveSite ? 30 : 0) + (hasSubstrate ? 30 : 0);
      }
    }
    
    if (subjectId === 'chemistry') {
      if (question.question.toLowerCase().includes('ionic')) {
        const hasElectrons = answerLower.includes('electron') || answerLower.includes('charge');
        const hasAttraction = answerLower.includes('attraction') || answerLower.includes('electrostatic');
        const hasIons = answerLower.includes('ion') || answerLower.includes('positive') || answerLower.includes('negative');
        
        return (hasElectrons ? 35 : 0) + (hasAttraction ? 35 : 0) + (hasIons ? 30 : 0);
      }
    }
    
    if (subjectId === 'maths') {
      if (question.question.toLowerCase().includes('solve')) {
        const hasMethod = answerLower.includes('=') || answerLower.includes('equation');
        const hasSteps = answer.split('\n').length > 1 || answer.includes(',');
        
        return (hasMethod ? 60 : 0) + (hasSteps ? 40 : 0);
      }
    }
    
    // General conceptual understanding (fallback)
    const answerLength = answer.split(' ').length;
    if (answerLength < 5) return 20;
    if (answerLength < 15) return 50;
    return 70;
  };

  const calculateStructureScore = (answer: string, maxMarks: number): number => {
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const expectedSentences = Math.max(maxMarks, 2);
    
    if (sentences.length === 0) return 0;
    if (sentences.length >= expectedSentences) return 100;
    
    return (sentences.length / expectedSentences) * 100;
  };

  const calculateAccuracyScore = (question: Question, answer: string, subjectId: string): number => {
    const answerLower = answer.toLowerCase();
    
    // Check for common misconceptions or errors
    const commonErrors = {
      biology: ['plants breathe', 'oxygen goes in', 'carbon dioxide comes out during photosynthesis'],
      chemistry: ['atoms can be split in chemical reactions', 'ionic bonds are weak'],
      maths: ['probability can be greater than 1', 'divide by zero']
    };
    
    const subjectErrors = commonErrors[subjectId as keyof typeof commonErrors] || [];
    const hasErrors = subjectErrors.some(error => answerLower.includes(error.toLowerCase()));
    
    if (hasErrors) return 20;
    
    // Check if answer is relevant to the question
    const questionWords = question.question.toLowerCase().split(' ');
    const relevantWords = questionWords.filter(word => 
      word.length > 3 && answerLower.includes(word)
    );
    
    const relevanceScore = Math.min((relevantWords.length / Math.max(questionWords.length * 0.3, 1)) * 100, 100);
    
    return Math.max(relevanceScore, 60); // Minimum 60% if no major errors
  };

  const generateDetailedFeedback = (
    question: Question, 
    answer: string, 
    score: number, 
    modelTerms: string[], 
    userTerms: string[]
  ): string => {
    // Improved logic to only suggest terms that are actually missing
    const answerLower = answer.toLowerCase();
    const actuallyMissedTerms = modelTerms.filter(term => {
      const termLower = term.toLowerCase();
      return !answerLower.includes(termLower) && 
             !answerLower.includes(termLower.replace(' ', '')) &&
             !(termLower.includes(' ') && termLower.split(' ').every(word => answerLower.includes(word)));
    });
    
    if (score >= 85) {
      return `Excellent answer! You demonstrated strong understanding of the key concepts. ${
        actuallyMissedTerms.length > 0 ? `Consider including: ${actuallyMissedTerms.slice(0, 2).join(', ')} for even more precision.` : 'Your answer covers all the essential points well.'
      }`;
    } else if (score >= 70) {
      return `Good answer with solid understanding. To improve: ${
        actuallyMissedTerms.length > 0 ? `Include key terms like: ${actuallyMissedTerms.slice(0, 3).join(', ')}. ` : ''
      }Provide more specific examples and clearer explanations.`;
    } else if (score >= 50) {
      return `Partial understanding shown. Your answer needs: ${
        actuallyMissedTerms.length > 0 ? `Essential terms: ${actuallyMissedTerms.slice(0, 3).join(', ')}. ` : ''
      }More detailed explanations and better structure. Focus on the specific question being asked.`;
    } else if (score >= 25) {
      return `Limited understanding demonstrated. Your answer lacks key scientific concepts and terminology. ${
        actuallyMissedTerms.length > 0 ? `Must include: ${actuallyMissedTerms.slice(0, 4).join(', ')}. ` : ''
      }Review the topic thoroughly and practice explaining concepts clearly.`;
    } else {
      return `Answer shows minimal understanding. ${
        answer.trim() ? 'Review the topic content and focus on key scientific principles, terminology, and clear explanations.' : 'No answer provided - you must attempt to answer to receive marks.'
      }`;
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedback = await simulateAIMarking(currentQuestion, userAnswer);
      
      // Calculate marks awarded out of total marks
      const marksAwarded = await calculateMarksAwarded(currentQuestion, userAnswer);
      
      const attempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        userAnswer,
        score: marksAwarded,
        feedback
      };
      
      setAttempts([...attempts, attempt]);
      setShowFeedback(true);
      
    } catch (error) {
      toast.error("Error processing your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateMarksAwarded = async (question: Question, answer: string): Promise<number> => {
    if (!answer.trim()) return 0;

    const keyTerms = extractKeyTerms(question.modelAnswer, subjectId!);
    const userKeyTerms = extractKeyTerms(answer, subjectId!);
    
    const keyTermScore = calculateKeyTermScore(keyTerms, userKeyTerms);
    const conceptualScore = calculateConceptualScore(question, answer, subjectId!);
    const structureScore = calculateStructureScore(answer, question.marks);
    const accuracyScore = calculateAccuracyScore(question, answer, subjectId!);
    
    const percentageScore = Math.round(
      (keyTermScore * 0.3) +
      (conceptualScore * 0.4) +
      (structureScore * 0.15) +
      (accuracyScore * 0.15)
    );
    
    // Convert percentage to actual marks out of total
    return Math.round((percentageScore / 100) * question.marks);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowFeedback(false);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
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
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const marksEarned = attempts.reduce((sum, a) => sum + a.score, 0);
    const averagePercentage = totalMarks > 0 ? (marksEarned / totalMarks) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Session Complete!</CardTitle>
            <CardDescription>
              {topic?.name} - {subject?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {marksEarned}/{totalMarks}
              </div>
              <p className="text-slate-600">Total Marks</p>
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate(`/subject/${subjectId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{topic?.name}</h1>
                <p className="text-sm text-slate-600">{subject?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-24" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Question Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question</CardTitle>
                  <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-900 mb-6 leading-relaxed">
                  {currentQuestion.question}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={isSubmitting || !userAnswer.trim()}
                      className="w-full"
                    >
                      {isSubmitting ? "Marking..." : "Submit Answer"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Panel */}
            {showFeedback && currentAttempt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Examiner Feedback
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {currentAttempt.score}/{currentQuestion.marks}
                    </span>
                    <span className="text-sm text-slate-600">marks</span>
                    <Badge className={currentAttempt.score >= currentQuestion.marks * 0.85 ? "bg-green-500" : currentAttempt.score >= currentQuestion.marks * 0.6 ? "bg-yellow-500" : "bg-red-500"}>
                      {currentAttempt.score >= currentQuestion.marks * 0.85 ? "Excellent" : currentAttempt.score >= currentQuestion.marks * 0.6 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Model Answer */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                      <Book className="h-4 w-4 mr-2" />
                      Model Answer
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-slate-700">{currentAttempt.feedback.modelAnswer}</p>
                    </div>
                  </div>

                  {/* Why This Gets Marks */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Why This Gets Full Marks
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <pre className="text-slate-700 whitespace-pre-wrap font-sans">
                        {currentAttempt.feedback.whyThisGetsMark}
                      </pre>
                    </div>
                  </div>

                  {/* Why Yours Didn't */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      How to Improve
                    </h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <p className="text-slate-700">{currentAttempt.feedback.whyYoursDidnt}</p>
                    </div>
                  </div>

                  {/* Spec Reference */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Specification Reference</h4>
                    <Badge variant="outline">{currentAttempt.feedback.specLink}</Badge>
                  </div>

                  <Button onClick={handleNextQuestion} className="w-full">
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Session"}
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
