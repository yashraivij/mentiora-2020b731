
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Target, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  subtopic: string;
  marking_criteria: string;
  spec_reference: string;
}

const Practice = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample questions - in real app, this would come from your database
  const questions: Question[] = [
    {
      id: "1",
      text: "Explain the process of photosynthesis and its importance in the ecosystem.",
      marks: 6,
      difficulty: "medium",
      topic: "Biology",
      subtopic: "Plant Biology",
      marking_criteria: "Students should explain the light-dependent and light-independent reactions, mention chloroplasts, and discuss oxygen production.",
      spec_reference: "B2.1.3"
    },
    {
      id: "2", 
      text: "Calculate the area of a circle with radius 5cm. Show your working.",
      marks: 3,
      difficulty: "easy",
      topic: "Mathematics",
      subtopic: "Geometry",
      marking_criteria: "Correct formula (πr²), substitution, and final answer with units.",
      spec_reference: "M3.2.1"
    },
    {
      id: "3",
      text: "Discuss the causes and consequences of World War I.",
      marks: 8,
      difficulty: "hard", 
      topic: "History",
      subtopic: "20th Century",
      marking_criteria: "Multiple causes identified, consequences for different countries, balanced argument.",
      spec_reference: "H4.1.2"
    }
  ];

  const currentQuestionData = questions[currentQuestion];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const submitAnswer = async () => {
    if (!answers[currentQuestion]?.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to get AI feedback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFeedback = `Great attempt! Your answer shows good understanding of the key concepts. 

**Strengths:**
- Clear explanation of the main process
- Good use of scientific terminology
- Well-structured response

**Areas for improvement:**
- Consider adding more specific examples
- Include quantitative data where relevant
- Link to wider implications

**Marking criteria coverage:**
${currentQuestionData.marking_criteria}

**Specification reference:** ${currentQuestionData.spec_reference}

**Estimated marks:** ${Math.floor(currentQuestionData.marks * 0.7)}/${currentQuestionData.marks}`;

      const newFeedback = [...feedback];
      newFeedback[currentQuestion] = mockFeedback;
      setFeedback(newFeedback);
      setShowFeedback(true);
      
      toast.success("Answer submitted! Check your feedback below.");
    } catch (error) {
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowFeedback(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800"; 
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <p>No questions available for this topic.</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeSpent)}
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{currentQuestionData.text}</CardTitle>
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                  <Badge className={getDifficultyColor(currentQuestionData.difficulty)}>
                    {currentQuestionData.difficulty}
                  </Badge>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {currentQuestionData.marks} marks
                  </div>
                  <div>
                    {currentQuestionData.topic} • {currentQuestionData.subtopic}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Answer
                </label>
                <Textarea
                  id="answer"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
                <Button
                  onClick={submitAnswer}
                  disabled={isSubmitting || !answers[currentQuestion]?.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        {showFeedback && feedback[currentQuestion] && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Lightbulb className="h-5 w-5 mr-2" />
                AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-blue-800">
                {feedback[currentQuestion].split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Practice;
