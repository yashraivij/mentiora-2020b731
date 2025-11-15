import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SATQuestion, SATAnswer } from '@/types/sat';
import { Loader2, Clock } from 'lucide-react';
import { DiagnosticResults } from '@/components/sat/DiagnosticResults';
import { generateDiagnosticTest, scoreDigagnostic } from '@/services/satDiagnosticService';
import { generateDailyPlan } from '@/services/satPlanGenerator';

export default function SATDiagnostic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<SATQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SATAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [testStartTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    loadDiagnostic();
  }, []);

  const loadDiagnostic = async () => {
    try {
      const diagnosticQuestions = await generateDiagnosticTest();
      setQuestions(diagnosticQuestions);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error loading diagnostic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const answer: SATAnswer = {
      question_id: currentQuestion.id,
      user_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: selectedAnswer === currentQuestion.correct_answer,
      time_spent_seconds: timeSpent,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setStartTime(Date.now());
    } else {
      completeTest(newAnswers);
    }
  };

  const completeTest = async (finalAnswers: SATAnswer[]) => {
    try {
      const totalTimeMinutes = Math.floor((Date.now() - testStartTime) / 60000);
      const diagnosticResults = await scoreDigagnostic(questions, finalAnswers);
      
      // Save session log
      if (user?.id) {
        const { error: logError } = await supabase.from('sat_session_logs').insert([{
          user_id: user.id,
          session_type: 'diagnostic',
          questions_answered: questions.length,
          correct: diagnosticResults.correct_answers,
          incorrect: questions.length - diagnosticResults.correct_answers,
          domains_improved: diagnosticResults.strengths.map(s => s.domain),
          domains_needing_review: diagnosticResults.weaknesses.map(w => w.domain),
          time_spent_minutes: totalTimeMinutes,
          answers: finalAnswers as any,
        }]);

        if (logError) {
          console.error('Error saving session log:', logError);
        }
      }

      // Update profile with diagnostic results
      await supabase
        .from('profiles')
        .update({
          sat_diagnostic_completed: true,
          sat_baseline_score_low: diagnosticResults.score_low,
          sat_baseline_score_high: diagnosticResults.score_high,
          sat_predicted_score_low: diagnosticResults.score_low,
          sat_predicted_score_high: diagnosticResults.score_high,
          sat_strength_domains: diagnosticResults.strengths.map(s => s.domain),
          sat_weak_domains: diagnosticResults.weaknesses.map(w => w.domain),
          sat_daily_minutes: diagnosticResults.recommended_daily_minutes,
        })
        .eq('id', user?.id);

      setResults(diagnosticResults);
      setShowResults(true);

      // Generate first daily plan
      if (user?.id) {
        await generateDailyPlan(user.id);
      }
    } catch (error) {
      console.error('Error completing test:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showResults && results) {
    return <DiagnosticResults results={results} onContinue={() => navigate('/dashboard')} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">SAT Diagnostic Test</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {currentQuestion.domain}
            </div>
            
            {currentQuestion.passage_text && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.passage_text}
                </p>
              </div>
            )}

            <h2 className="text-lg font-semibold text-foreground mb-4">
              {currentQuestion.question_text}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.choices?.map((choice, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(choice.charAt(0))}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === choice.charAt(0)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-foreground">{choice}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleAnswer}
            disabled={!selectedAnswer}
            className="w-full"
            size="lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Test'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
