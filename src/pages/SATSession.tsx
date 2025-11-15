import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowRight, Trophy, TrendingUp } from "lucide-react";
import { SATQuestion, SATDailyPlan, SATActivity, SATAnswer } from "@/types/sat";
import { markActivityCompleted } from "@/services/satPlanGenerator";
import { motion, AnimatePresence } from "framer-motion";

export default function SATSession() {
  const { planId } = useParams<{ planId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<SATDailyPlan | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<SATQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<SATAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (planId && user?.id) {
      loadSession();
    }
  }, [planId, user?.id]);

  const loadSession = async () => {
    try {
      // Load plan
      const { data: planData, error: planError } = await supabase
        .from("sat_daily_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError || !planData) {
        throw new Error("Failed to load plan");
      }

      setPlan({
        ...planData,
        activities: (planData.activities as unknown) as SATActivity[],
      } as SATDailyPlan);

      // Find first incomplete activity
      const activities = (planData.activities as unknown) as SATActivity[];
      const firstIncomplete = activities.findIndex((a) => !a.completed);
      
      if (firstIncomplete === -1) {
        setSessionComplete(true);
        setLoading(false);
        return;
      }

      setCurrentActivityIndex(firstIncomplete);
      await loadQuestion(activities[firstIncomplete]);
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (activity: SATActivity) => {
    try {
      const questionId = activity.question_ids[currentQuestionIndex];
      const { data, error } = await supabase
        .from("sat_questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (error || !data) {
        throw new Error("Failed to load question");
      }

      setCurrentQuestion(data as SATQuestion);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error loading question:", error);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    const answer: SATAnswer = {
      question_id: currentQuestion.id,
      user_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
      time_spent_seconds: timeSpent,
    };

    setSessionAnswers([...sessionAnswers, answer]);
    setShowFeedback(true);
  };

  const handleNext = async () => {
    if (!plan) return;

    const activities = Array.isArray(plan.activities) ? plan.activities : [];
    const currentActivity = activities[currentActivityIndex];

    // Check if more questions in current activity
    if (currentQuestionIndex < currentActivity.question_ids.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
      await loadQuestion(currentActivity);
    } else {
      // Mark activity as completed
      await markActivityCompleted(planId!, currentActivityIndex);

      // Move to next activity
      const nextActivityIndex = currentActivityIndex + 1;
      if (nextActivityIndex < activities.length) {
        setCurrentActivityIndex(nextActivityIndex);
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setShowFeedback(false);
        await loadQuestion(activities[nextActivityIndex]);
      } else {
        // Session complete
        await saveSessionLog();
        setSessionComplete(true);
      }
    }
  };

  const saveSessionLog = async () => {
    if (!user?.id || sessionAnswers.length === 0) return;

    const correct = sessionAnswers.filter((a) => a.is_correct).length;
    const incorrect = sessionAnswers.length - correct;

    try {
      await supabase.from("sat_session_logs").insert({
        user_id: user.id,
        session_type: "daily_plan",
        questions_answered: sessionAnswers.length,
        correct,
        incorrect,
        time_spent_minutes: Math.floor(sessionAnswers.reduce((sum, a) => sum + a.time_spent_seconds, 0) / 60),
        answers: sessionAnswers as any,
      });

      // Update streak
      const today = new Date().toISOString().split("T")[0];
      const { data: streakData } = await supabase.rpc("get_user_streak", { user_uuid: user.id });
      
      await supabase
        .from("profiles")
        .update({
          sat_last_session_date: today,
          sat_streak_days: streakData || 0,
        })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error saving session log:", error);
    }
  };

  const getSessionStats = () => {
    const correct = sessionAnswers.filter((a) => a.is_correct).length;
    const accuracy = sessionAnswers.length > 0 ? Math.round((correct / sessionAnswers.length) * 100) : 0;
    return { correct, total: sessionAnswers.length, accuracy };
  };

  const getEncouragementMessage = () => {
    const { accuracy } = getSessionStats();
    if (accuracy >= 80) return "Outstanding work! 🌟";
    if (accuracy >= 60) return "Great progress! 💪";
    if (accuracy >= 40) return "Keep practicing! 📚";
    return "Every attempt is progress! 🚀";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (sessionComplete) {
    const stats = getSessionStats();
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4">🎉</div>
                <CardTitle className="text-3xl">Session Complete!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xl text-muted-foreground">{getEncouragementMessage()}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{stats.correct}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{stats.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>

                <Button onClick={() => navigate("/dashboard")} size="lg" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentQuestion || !plan) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No questions available</p>
              <Button onClick={() => navigate("/dashboard")} className="mt-4">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const activities = Array.isArray(plan.activities) ? plan.activities : [];
  const currentActivity = activities[currentActivityIndex];
  const progress = ((currentActivityIndex * 100) / activities.length);

  const choices = currentQuestion.choices ? Object.entries(currentQuestion.choices as Record<string, string>) : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Activity {currentActivityIndex + 1} of {activities.length}
                </span>
                <Badge variant="secondary">{currentActivity.type.replace("_", " ")}</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{currentQuestion.domain}</Badge>
                  <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentQuestion.passage_text && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{currentQuestion.passage_text}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-4">{currentQuestion.question_text}</h3>

                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showFeedback}>
                    <div className="space-y-3">
                      {choices.map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-colors ${
                            showFeedback && key === currentQuestion.correct_answer
                              ? "border-green-500 bg-green-500/10"
                              : showFeedback && key === selectedAnswer && key !== currentQuestion.correct_answer
                              ? "border-red-500 bg-red-500/10"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            <span className="font-semibold mr-2">{key}.</span>
                            {value}
                          </Label>
                          {showFeedback && key === currentQuestion.correct_answer && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          {showFeedback && key === selectedAnswer && key !== currentQuestion.correct_answer && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-muted rounded-lg"
                  >
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Explanation
                    </h4>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  {!showFeedback ? (
                    <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="flex-1" size="lg">
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="flex-1" size="lg">
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
