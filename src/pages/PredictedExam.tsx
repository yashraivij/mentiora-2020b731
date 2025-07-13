import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Crown, Timer } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock predicted exam questions for 2026
const PREDICTED_QUESTIONS = {
  chemistry: [
    {
      id: "chem-2026-1",
      question: "Explain why ionic compounds have high melting points. Your answer should include reference to the structure and bonding in ionic compounds.",
      marks: 4,
      modelAnswer: "Ionic compounds have high melting points because they contain ionic bonds formed by electrostatic attraction between oppositely charged ions. The ionic structure forms a giant lattice with strong forces of attraction between all the ions. A lot of energy is needed to overcome these strong electrostatic forces and break the ionic bonds to melt the compound.",
      markingCriteria: [
        "Ionic bonds formed by electrostatic attraction (1 mark)",
        "Between oppositely charged ions (1 mark)",
        "Giant lattice structure (1 mark)",
        "Lot of energy needed to overcome strong forces (1 mark)"
      ],
      specReference: "4.2.1.1 - Ionic bonding",
      section: "A"
    },
    {
      id: "chem-2026-2",
      question: "A student carried out the electrolysis of sodium chloride solution using inert electrodes. State what is observed at each electrode and write ionic equations for the reactions that occur.",
      marks: 6,
      modelAnswer: "At the cathode: Bubbles of hydrogen gas are produced. 2H⁺ + 2e⁻ → H₂. At the anode: Bubbles of chlorine gas (pale green/yellow) are produced. 2Cl⁻ → Cl₂ + 2e⁻.",
      markingCriteria: [
        "Hydrogen gas at cathode (1 mark)",
        "Correct ionic equation for hydrogen (1 mark)",
        "Chlorine gas at anode (1 mark)",
        "Correct observation for chlorine (1 mark)",
        "Correct ionic equation for chlorine (1 mark)",
        "Balanced equations (1 mark)"
      ],
      specReference: "4.4.2.3 - Electrolysis",
      section: "A"
    },
    {
      id: "chem-2026-3",
      question: "Describe and explain the trend in atomic radius down Group 1 of the periodic table.",
      marks: 3,
      modelAnswer: "Atomic radius increases down Group 1. This is because there are more electron shells/energy levels as you go down the group. The outer electrons are further from the nucleus, so the atomic radius is larger.",
      markingCriteria: [
        "Atomic radius increases down Group 1 (1 mark)",
        "More electron shells/energy levels (1 mark)",
        "Outer electrons further from nucleus (1 mark)"
      ],
      specReference: "4.1.2.3 - Periodic trends",
      section: "B"
    }
  ],
  biology: [
    {
      id: "bio-2026-1",
      question: "Explain how the structure of alveoli makes them efficient for gas exchange.",
      marks: 5,
      modelAnswer: "Alveoli have a large surface area provided by millions of air sacs for maximum gas exchange. They have thin walls (one cell thick) for short diffusion distance. Rich blood supply maintains concentration gradient. Moist lining allows gases to dissolve. Good ventilation maintains concentration gradients.",
      markingCriteria: [
        "Large surface area mentioned (1 mark)",
        "Thin walls/short diffusion distance (1 mark)",
        "Rich blood supply/maintains concentration gradient (1 mark)",
        "Moist lining allows gases to dissolve (1 mark)",
        "Good ventilation mentioned (1 mark)"
      ],
      specReference: "4.2.2.2 - Gas exchange",
      section: "A"
    },
    {
      id: "bio-2026-2",
      question: "Compare the structure and function of arteries and veins.",
      marks: 6,
      modelAnswer: "Arteries: thick muscular walls to withstand high pressure, narrow lumen, carry blood away from heart at high pressure, carry oxygenated blood (except pulmonary artery). Veins: thin walls as blood at low pressure, wide lumen, contain valves to prevent backflow, carry blood towards heart, carry deoxygenated blood (except pulmonary vein).",
      markingCriteria: [
        "Arteries have thick walls, veins have thin walls (1 mark)",
        "Reference to pressure differences (1 mark)",
        "Arteries have narrow lumen, veins have wide lumen (1 mark)",
        "Veins have valves to prevent backflow (1 mark)",
        "Blood flow direction correctly stated (1 mark)",
        "Oxygenation status correctly stated (1 mark)"
      ],
      specReference: "4.2.2.1 - Blood vessels",
      section: "A"
    }
  ],
  physics: [
    {
      id: "phys-2026-1",
      question: "A car accelerates from rest to 30 m/s in 10 seconds. Calculate the acceleration of the car and the distance travelled during this time.",
      marks: 4,
      modelAnswer: "acceleration = (final velocity - initial velocity) / time = (30 - 0) / 10 = 3 m/s². distance = (initial velocity × time) + (½ × acceleration × time²) = (0 × 10) + (½ × 3 × 10²) = 0 + 150 = 150 m.",
      markingCriteria: [
        "Correct formula for acceleration (1 mark)",
        "Correct calculation: acceleration = 3 m/s² (1 mark)",
        "Correct formula for distance (1 mark)",
        "Correct calculation: distance = 150 m (1 mark)"
      ],
      specReference: "4.1.1.2 - Motion equations",
      section: "A"
    }
  ]
};

interface ExamAttempt {
  questionId: string;
  userAnswer: string;
  score: number;
  maxScore: number;
}

const PredictedExam = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(105 * 60); // 1hr 45min in seconds
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [examComplete, setExamComplete] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const subject = curriculum.find(s => s.id === subjectId);
  const questions = PREDICTED_QUESTIONS[subjectId as keyof typeof PREDICTED_QUESTIONS] || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!subject) {
      navigate('/predicted-questions');
      return;
    }
  }, [subject, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (examStarted && timeRemaining > 0 && !examComplete) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            toast.error("Time's up! You can still continue but this will be noted.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [examStarted, timeRemaining, examComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamStarted(true);
    toast.success("Exam started! Good luck!");
  };

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
  };

  const saveCurrentAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    const existingAttemptIndex = attempts.findIndex(a => a.questionId === currentQuestion.id);
    const newAttempt: ExamAttempt = {
      questionId: currentQuestion.id,
      userAnswer: userAnswer.trim(),
      score: 0, // Will be calculated during marking
      maxScore: currentQuestion.marks
    };

    if (existingAttemptIndex >= 0) {
      const newAttempts = [...attempts];
      newAttempts[existingAttemptIndex] = newAttempt;
      setAttempts(newAttempts);
    } else {
      setAttempts([...attempts, newAttempt]);
    }
  };

  const goToQuestion = (index: number) => {
    saveCurrentAnswer();
    setCurrentQuestionIndex(index);
    
    // Load saved answer if exists
    const savedAttempt = attempts.find(a => a.questionId === questions[index]?.id);
    setUserAnswer(savedAttempt?.userAnswer || "");
  };

  const handleSubmitExam = () => {
    saveCurrentAnswer();
    setShowConfirmSubmit(true);
  };

  const confirmSubmitExam = () => {
    setExamComplete(true);
    setShowConfirmSubmit(false);
    
    // Calculate final time taken
    const timeTaken = (105 * 60) - timeRemaining;
    toast.success(`Exam submitted! Time taken: ${formatTime(timeTaken)}`);
    
    // Navigate to results
    navigate(`/predicted-results/${subjectId}`, { 
      state: { 
        attempts, 
        questions, 
        timeTaken,
        timeLimit: 105 * 60
      } 
    });
  };

  if (!subject || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Subject not available</h2>
          <Button onClick={() => navigate('/predicted-questions')}>
            Back to Predicted Questions
          </Button>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              {subject.name} - Predicted 2026 Paper
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Full AQA format exam under timed conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary mb-1">
                  {questions.length}
                </div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-600 mb-1">1:45</div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Exam Instructions:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <span>Answer ALL questions in the spaces provided</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <span>You have 1 hour 45 minutes to complete this paper</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <span>You can navigate between questions and return to previous answers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <span>If time runs out, you can continue but this will be noted</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Button onClick={startExam} className="w-full" size="lg">
                <Timer className="h-4 w-4 mr-2" />
                Start Exam
              </Button>
              <Button variant="outline" onClick={() => navigate('/predicted-questions')}>
                Back to Subject Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Exam Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/predicted-questions')}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {subject.name} - Predicted 2026 Paper
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border ${
                timeRemaining <= 0 
                  ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300'
                  : timeRemaining <= 300 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-300'
                  : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300'
              }`}>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-medium">
                    {formatTime(Math.max(0, timeRemaining))}
                  </span>
                  {timeRemaining <= 0 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Questions</CardTitle>
                  <Progress 
                    value={(attempts.length / questions.length) * 100} 
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {attempts.length} of {questions.length} attempted
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {questions.map((_, index) => {
                      const hasAnswer = attempts.some(a => a.questionId === questions[index].id);
                      const isCurrent = index === currentQuestionIndex;
                      
                      return (
                        <Button
                          key={index}
                          variant={isCurrent ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToQuestion(index)}
                          className={`relative ${
                            hasAnswer && !isCurrent 
                              ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300' 
                              : ''
                          }`}
                        >
                          {index + 1}
                          {hasAnswer && (
                            <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-500 bg-background rounded-full" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button 
                    onClick={handleSubmitExam}
                    className="w-full mt-4"
                    variant="destructive"
                  >
                    Submit Exam
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Question Panel */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      Question {currentQuestionIndex + 1}
                      {currentQuestion.section && (
                        <Badge variant="outline" className="ml-2">
                          Section {currentQuestion.section}
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant="outline">
                      {currentQuestion.marks} marks
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      {currentQuestion.question}
                    </p>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Your Answer:
                      </label>
                      <Textarea
                        value={userAnswer}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder="Type your answer here..."
                        className="min-h-[300px] resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your answer is automatically saved as you type.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => goToQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => goToQuestion(currentQuestionIndex + 1)}
                      disabled={currentQuestionIndex === questions.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Submit Exam?</CardTitle>
              <CardDescription>
                Are you sure you want to submit your exam? You cannot make changes after submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <p>Questions attempted: {attempts.length} of {questions.length}</p>
                <p>Time remaining: {formatTime(Math.max(0, timeRemaining))}</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1"
                >
                  Continue Exam
                </Button>
                <Button 
                  onClick={confirmSubmitExam}
                  className="flex-1"
                >
                  Submit Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PredictedExam;