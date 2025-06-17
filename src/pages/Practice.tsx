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

    // More accurate teacher-like marking
    const marksAwarded = await calculateMarksAwarded(question, answer);
    const feedback = generateTeacherFeedback(question, answer, marksAwarded);
    
    return {
      modelAnswer: question.modelAnswer,
      whyThisGetsMark: question.markingCriteria.breakdown.join('\n'),
      whyYoursDidnt: feedback,
      specLink: question.specReference
    };
  };

  const calculateMarksAwarded = async (question: Question, answer: string): Promise<number> => {
    if (!answer.trim()) return 0;

    const answerLower = answer.toLowerCase();
    const modelLower = question.modelAnswer.toLowerCase();
    
    // Extract key marking points from the marking criteria
    const markingPoints = question.markingCriteria.breakdown;
    let totalMarksAwarded = 0;
    
    // Check each marking point individually
    for (const point of markingPoints) {
      const pointMarks = checkMarkingPoint(point, answer, question, subjectId!);
      totalMarksAwarded += pointMarks;
    }
    
    // Ensure we don't exceed the maximum marks for the question
    const finalMarks = Math.min(totalMarksAwarded, question.marks);
    
    // Give some credit for partial understanding even if specific points are missed
    if (finalMarks === 0 && answer.length > 20) {
      // Check for general relevance and effort
      const relevanceScore = calculateRelevanceScore(question, answer);
      if (relevanceScore > 0.3) {
        return Math.min(1, question.marks); // Give at least 1 mark for relevant attempt
      }
    }
    
    return Math.max(0, finalMarks);
  };

  const checkMarkingPoint = (markingPoint: string, answer: string, question: Question, subjectId: string): number => {
    const answerLower = answer.toLowerCase();
    const pointLower = markingPoint.toLowerCase();
    
    // Extract key concepts from the marking point
    const keyWords = extractKeyWordsFromPoint(pointLower, subjectId);
    const marksPerPoint = question.marks / question.markingCriteria.breakdown.length;
    
    let pointScore = 0;
    
    // Check if the answer contains the key concepts from this marking point
    for (const keyWord of keyWords) {
      if (checkConceptPresent(keyWord, answerLower, subjectId)) {
        pointScore += marksPerPoint / keyWords.length;
      }
    }
    
    // Bonus for exact or very close matches
    if (answerLower.includes(pointLower.substring(0, Math.min(pointLower.length, 20)))) {
      pointScore = marksPerPoint; // Full marks for this point
    }
    
    return Math.min(pointScore, marksPerPoint);
  };

  const extractKeyWordsFromPoint = (point: string, subjectId: string): string[] => {
    // Remove common words and extract meaningful terms
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'this', 'that', 'these', 'those'];
    
    const words = point.replace(/[^\w\s]/g, ' ').split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    // Subject-specific important terms that should be weighted more heavily
    const importantTerms = {
      biology: ['osmosis', 'diffusion', 'enzyme', 'active site', 'substrate', 'catalyst', 'membrane', 'concentration', 'gradient', 'water potential', 'photosynthesis', 'respiration', 'mitochondria', 'chloroplast', 'glucose', 'oxygen', 'carbon dioxide', 'energy', 'atp'],
      chemistry: ['atom', 'molecule', 'ion', 'electron', 'proton', 'neutron', 'bond', 'ionic', 'covalent', 'metallic', 'compound', 'element', 'reaction', 'oxidation', 'reduction', 'acid', 'base', 'ph', 'catalyst'],
      maths: ['equation', 'formula', 'solve', 'calculate', 'fraction', 'decimal', 'percentage', 'ratio', 'proportion', 'area', 'volume', 'perimeter', 'probability', 'graph', 'function']
    };
    
    const subjectTerms = importantTerms[subjectId as keyof typeof importantTerms] || [];
    
    // Prioritize subject-specific terms
    const prioritizedWords = words.filter(word => subjectTerms.includes(word));
    const otherWords = words.filter(word => !subjectTerms.includes(word));
    
    return [...prioritizedWords, ...otherWords.slice(0, 3)]; // Take up to 3 other words
  };

  const checkConceptPresent = (concept: string, answer: string, subjectId: string): boolean => {
    // Direct match
    if (answer.includes(concept)) return true;
    
    // Check for variations and synonyms
    const synonyms = {
      'osmosis': ['water movement', 'water transport', 'movement of water'],
      'diffusion': ['movement', 'transport', 'spread'],
      'enzyme': ['catalyst', 'protein catalyst', 'biological catalyst'],
      'active site': ['binding site', 'catalytic site', 'enzyme site'],
      'substrate': ['reactant', 'molecule that binds'],
      'concentration gradient': ['concentration difference', 'gradient', 'difference in concentration'],
      'photosynthesis': ['light reaction', 'carbon fixation', 'glucose production'],
      'respiration': ['glucose breakdown', 'energy release', 'oxygen use'],
      'ionic bond': ['electrostatic attraction', 'electron transfer', 'charged particles'],
      'covalent bond': ['electron sharing', 'shared electrons', 'molecular bond'],
      'equation': ['formula', 'mathematical expression', 'equals'],
      'solve': ['find', 'calculate', 'work out', 'determine']
    };
    
    const conceptSynonyms = synonyms[concept as keyof typeof synonyms] || [];
    
    for (const synonym of conceptSynonyms) {
      if (answer.includes(synonym)) return true;
    }
    
    // Check for partial matches (for longer terms)
    if (concept.length > 6) {
      const conceptWords = concept.split(' ');
      if (conceptWords.length > 1) {
        // For multi-word concepts, check if all words are present (not necessarily together)
        return conceptWords.every(word => word.length > 2 && answer.includes(word));
      } else {
        // For single long words, check for partial matches
        return answer.includes(concept.substring(0, concept.length - 2));
      }
    }
    
    return false;
  };

  const calculateRelevanceScore = (question: Question, answer: string): number => {
    const questionWords = question.question.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3);
    const answerWords = answer.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const qWord of questionWords) {
      if (answerWords.some(aWord => aWord.includes(qWord) || qWord.includes(aWord))) {
        matches++;
      }
    }
    
    return matches / Math.max(questionWords.length, 1);
  };

  const generateTeacherFeedback = (question: Question, answer: string, marksAwarded: number): string => {
    const percentage = (marksAwarded / question.marks) * 100;
    const answerLower = answer.toLowerCase();
    
    // Analyze what the student got right
    const correctPoints = [];
    const missedPoints = [];
    
    for (const point of question.markingCriteria.breakdown) {
      const keyWords = extractKeyWordsFromPoint(point.toLowerCase(), subjectId!);
      let pointCovered = false;
      
      for (const keyWord of keyWords) {
        if (checkConceptPresent(keyWord, answerLower, subjectId!)) {
          pointCovered = true;
          break;
        }
      }
      
      if (pointCovered) {
        correctPoints.push(point);
      } else {
        missedPoints.push(point);
      }
    }
    
    let feedback = "";
    
    if (percentage >= 90) {
      feedback = `Excellent answer! You demonstrated comprehensive understanding. `;
      if (correctPoints.length > 0) {
        feedback += `You correctly covered: ${correctPoints.slice(0, 2).join('; ')}. `;
      }
      if (missedPoints.length > 0) {
        feedback += `For perfection, also mention: ${missedPoints[0]}.`;
      } else {
        feedback += `Your answer is thorough and accurate.`;
      }
    } else if (percentage >= 75) {
      feedback = `Good answer showing solid understanding. `;
      if (correctPoints.length > 0) {
        feedback += `You correctly identified: ${correctPoints.slice(0, 2).join('; ')}. `;
      }
      if (missedPoints.length > 0) {
        feedback += `To improve further, include: ${missedPoints.slice(0, 2).join('; ')}.`;
      }
    } else if (percentage >= 50) {
      feedback = `Reasonable attempt with some correct understanding. `;
      if (correctPoints.length > 0) {
        feedback += `You got credit for: ${correctPoints.join('; ')}. `;
      }
      if (missedPoints.length > 0) {
        feedback += `Missing key points: ${missedPoints.slice(0, 3).join('; ')}.`;
      }
    } else if (percentage >= 25) {
      feedback = `Limited understanding shown. `;
      if (correctPoints.length > 0) {
        feedback += `Some credit given for: ${correctPoints.join('; ')}. `;
      }
      feedback += `Need to focus on: ${missedPoints.slice(0, 3).join('; ')}.`;
    } else if (percentage > 0) {
      feedback = `Minimal marks awarded for attempting the question. `;
      feedback += `Review the key concepts: ${missedPoints.slice(0, 3).join('; ')}.`;
    } else {
      feedback = `No marks awarded. The answer doesn't address the key points: ${missedPoints.slice(0, 3).join('; ')}.`;
    }
    
    return feedback;
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
