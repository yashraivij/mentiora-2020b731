
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { curriculum, Question, Topic, Subject } from "@/data/curriculum";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

// Fisher-Yates shuffle algorithm to randomize array
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Find the current subject and topic
  const subject = curriculum.find((s: Subject) => s.id === subjectId);
  const topic = subject?.topics.find((t: Topic) => t.id === topicId);

  // Shuffle questions when component loads
  useEffect(() => {
    if (topic?.questions) {
      setShuffledQuestions(shuffleArray(topic.questions));
    }
  }, [topic]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!subject || !topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use shuffled questions instead of original order
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    shuffledQuestions.forEach((question: Question, index: number) => {
      if (userAnswers[index] === question.answer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render anything until questions are shuffled
  if (shuffledQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / shuffledQuestions.length) * 100);

    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Practice Complete!</CardTitle>
            <CardDescription>
              {topic.name} - {subject.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">
                {percentage}%
              </div>
              <div className="text-xl">
                {score} out of {shuffledQuestions.length} correct
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time spent: {formatTime(timeSpent)}
              </div>
            </div>

            <div className="space-y-4">
              {shuffledQuestions.map((question: Question, index: number) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;
                
                return (
                  <Card key={question.id} className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="font-medium">{question.question}</p>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Your answer:</span>{" "}
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {userAnswer || "Not answered"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <span className="font-medium">Correct answer:</span>{" "}
                                <span className="text-green-600">{question.answer}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setUserAnswers([]);
                  setShowResults(false);
                  // Shuffle questions again for new practice session
                  setShuffledQuestions(shuffleArray(topic.questions));
                }}
                className="flex-1"
              >
                Practice Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/subjects/${subjectId}`)}
                className="flex-1"
              >
                Back to Topics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{topic.name}</h1>
            <p className="text-muted-foreground">{subject.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeSpent)}
            </div>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Question {currentQuestionIndex + 1}
            <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
          
          {currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto"
                  onClick={() => handleAnswer(option)}
                >
                  <span className="mr-3 font-bold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Type your answer and press Enter:
              </p>
              <input
                type="text"
                className="w-full p-3 border rounded-md"
                placeholder="Enter your answer..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    handleAnswer(target.value);
                  }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Practice;
