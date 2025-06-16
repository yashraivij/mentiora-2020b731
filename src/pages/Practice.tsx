
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
    
    // Simple scoring logic based on keywords and length
    const keywords = question.modelAnswer.toLowerCase().split(' ');
    const userWords = answer.toLowerCase().split(' ');
    const matchedKeywords = keywords.filter(keyword => 
      userWords.some(word => word.includes(keyword) || keyword.includes(word))
    );
    
    const keywordScore = Math.min((matchedKeywords.length / keywords.length) * 100, 100);
    const lengthScore = Math.min((answer.length / question.modelAnswer.length) * 100, 100);
    const finalScore = Math.round((keywordScore * 0.7 + lengthScore * 0.3));
    
    // Generate feedback based on score
    let whyThisGetsMark = question.markingCriteria.breakdown.join('\n');
    let whyYoursDidnt = "";
    
    if (finalScore < 50) {
      whyYoursDidnt = "Your answer lacked key scientific terminology and detailed explanations required for full marks.";
    } else if (finalScore < 85) {
      whyYoursDidnt = "Your answer included some correct points but missed some key details or used imprecise language.";
    } else {
      whyYoursDidnt = "Good answer! Minor improvements could include more specific examples or clearer explanations.";
    }

    return {
      modelAnswer: question.modelAnswer,
      whyThisGetsMark,
      whyYoursDidnt,
      specLink: question.specReference
    };
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedback = await simulateAIMarking(currentQuestion, userAnswer);
      
      // Calculate score based on answer quality
      const score = Math.max(20, Math.min(100, 
        Math.round((userAnswer.length / currentQuestion.modelAnswer.length) * 85)
      ));
      
      const attempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        userAnswer,
        score,
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
    const averageScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    
    // Save progress
    const progressKey = `mentiora_progress_${user?.id}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    
    const topicProgressIndex = existingProgress.findIndex(
      (p: any) => p.subjectId === subjectId && p.topicId === topicId
    );
    
    if (topicProgressIndex >= 0) {
      existingProgress[topicProgressIndex].attempts += 1;
      existingProgress[topicProgressIndex].averageScore = Math.round(
        (existingProgress[topicProgressIndex].averageScore + averageScore) / 2
      );
      existingProgress[topicProgressIndex].lastAttempt = new Date();
    } else {
      existingProgress.push({
        subjectId,
        topicId,
        attempts: 1,
        averageScore: Math.round(averageScore),
        lastAttempt: new Date()
      });
    }
    
    localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    
    // Handle weak topics
    if (averageScore < 85) {
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
    const averageScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    
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
                {Math.round(averageScore)}%
              </div>
              <p className="text-slate-600">Average Score</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-medium">{attempts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <Badge className={averageScore >= 85 ? "bg-green-500" : averageScore >= 60 ? "bg-yellow-500" : "bg-red-500"}>
                  {averageScore >= 85 ? "Excellent" : averageScore >= 60 ? "Good" : "Needs Work"}
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
                      {currentAttempt.score}%
                    </span>
                    <Badge className={currentAttempt.score >= 85 ? "bg-green-500" : currentAttempt.score >= 60 ? "bg-yellow-500" : "bg-red-500"}>
                      {currentAttempt.score >= 85 ? "Excellent" : currentAttempt.score >= 60 ? "Good" : "Needs Work"}
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
