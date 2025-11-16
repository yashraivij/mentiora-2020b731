import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SATQuestion } from '@/types/sat';
import { Loader2, Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function SATSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<SATQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<any[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    loadSessionQuestions();
  }, []);

  const loadSessionQuestions = async () => {
    try {
      // Fetch user's weak domains from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('sat_weak_domains')
        .eq('id', user?.id)
        .single();

      const weakDomains = profile?.sat_weak_domains || [];

      // Fetch 10 questions - prioritize weak domains
      const { data: questionsData, error } = await supabase
        .from('sat_questions')
        .select('*')
        .in('domain', weakDomains.length > 0 ? weakDomains : ['Algebra', 'Information and Ideas'])
        .limit(10);

      if (error) throw error;

      if (!questionsData || questionsData.length === 0) {
        toast.error('No questions available for practice');
        navigate('/dashboard');
        return;
      }

      // Shuffle questions
      const shuffled = questionsData.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } catch (error) {
      console.error('Error loading session questions:', error);
      toast.error('Failed to load practice questions');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correct_answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    // Record answer
    const answerRecord = {
      question_id: currentQuestion.id,
      user_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: correct,
      domain: currentQuestion.domain,
    };

    setSessionAnswers([...sessionAnswers, answerRecord]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    try {
      const totalTimeMinutes = Math.floor((Date.now() - startTime) / 60000);
      const correctCount = sessionAnswers.filter(a => a.is_correct).length + (isCorrect ? 1 : 0);
      const incorrectCount = questions.length - correctCount;

      // Get domains that were improved and need review
      const domainPerformance: Record<string, { correct: number; total: number }> = {};
      [...sessionAnswers, { domain: questions[currentQuestionIndex].domain, is_correct: isCorrect }].forEach(answer => {
        if (!domainPerformance[answer.domain]) {
          domainPerformance[answer.domain] = { correct: 0, total: 0 };
        }
        domainPerformance[answer.domain].total++;
        if (answer.is_correct) {
          domainPerformance[answer.domain].correct++;
        }
      });

      const domainsImproved = Object.keys(domainPerformance).filter(
        domain => (domainPerformance[domain].correct / domainPerformance[domain].total) >= 0.7
      );
      
      const domainsNeedingReview = Object.keys(domainPerformance).filter(
        domain => (domainPerformance[domain].correct / domainPerformance[domain].total) < 0.5
      );

      // Save session log
      await supabase.from('sat_session_logs').insert({
        user_id: user?.id,
        session_type: 'practice',
        questions_answered: questions.length,
        correct: correctCount,
        incorrect: incorrectCount,
        domains_improved: domainsImproved,
        domains_needing_review: domainsNeedingReview,
        time_spent_minutes: totalTimeMinutes,
        answers: [...sessionAnswers, {
          question_id: questions[currentQuestionIndex].id,
          user_answer: selectedAnswer,
          correct_answer: questions[currentQuestionIndex].correct_answer,
          is_correct: isCorrect,
          domain: questions[currentQuestionIndex].domain,
        }],
      });

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase
        .from('profiles')
        .select('sat_streak_days, sat_last_session_date')
        .eq('id', user?.id)
        .single();

      let newStreak = 1;
      if (profile?.sat_last_session_date) {
        const lastSession = new Date(profile.sat_last_session_date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If last session was yesterday, increment streak
        if (lastSession.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
          newStreak = (profile.sat_streak_days || 0) + 1;
        } else if (lastSession.toISOString().split('T')[0] === today) {
          // If already did a session today, keep current streak
          newStreak = profile.sat_streak_days || 1;
        }
      }

      await supabase
        .from('profiles')
        .update({
          sat_last_session_date: today,
          sat_streak_days: newStreak,
        })
        .eq('id', user?.id);

      setShowSummary(true);
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to save session results');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showSummary) {
    const correctCount = sessionAnswers.filter(a => a.is_correct).length + (isCorrect ? 1 : 0);
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Session Complete!</h1>
              <p className="text-muted-foreground">Great work on completing your practice session</p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{correctCount}/{questions.length}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{Math.floor((Date.now() - startTime) / 60000)}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full">
                Return to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" size="lg" className="w-full">
                Start Another Session
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">Practice Session</h1>
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
                onClick={() => handleAnswerSelect(choice.charAt(0))}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showFeedback
                    ? choice.charAt(0) === currentQuestion.correct_answer
                      ? 'border-green-500 bg-green-500/10'
                      : choice.charAt(0) === selectedAnswer
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-border'
                    : selectedAnswer === choice.charAt(0)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {showFeedback && choice.charAt(0) === currentQuestion.correct_answer && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  {showFeedback && choice.charAt(0) === selectedAnswer && choice.charAt(0) !== currentQuestion.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-foreground">{choice}</span>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-foreground mb-2">
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </p>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!showFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="w-full"
                size="lg"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Session'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
