import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DiagnosticResults as DiagnosticResultsType } from '@/types/sat';
import { Trophy, TrendingUp, Target, Clock, Zap } from 'lucide-react';

interface DiagnosticResultsProps {
  results: DiagnosticResultsType;
  onContinue: () => void;
}

export function DiagnosticResults({ results, onContinue }: DiagnosticResultsProps) {
  const getEncouragementMessage = () => {
    if (results.percentage >= 80) return "Outstanding! You're already performing at a high level.";
    if (results.percentage >= 65) return "Great work! You have a solid foundation to build on.";
    if (results.percentage >= 50) return "Good start! With focused practice, you'll see significant improvement.";
    return "You've identified clear areas for growth - that's the first step to success!";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Trophy className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Diagnostic Complete!</h1>
            <p className="text-muted-foreground">{getEncouragementMessage()}</p>
          </div>

          {/* Score Range Card */}
          <Card className="p-6 md:p-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Estimated SAT Score</p>
              <div className="text-5xl font-bold text-primary mb-2">
                {results.score_low} - {results.score_high}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {results.correct_answers} of {results.total_questions} correct ({Math.round(results.percentage)}%)
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Your Strengths</h2>
              </div>
              {results.strengths.length > 0 ? (
                <div className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{strength.domain}</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {Math.round(strength.percentage)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keep practicing to develop your strengths!
                </p>
              )}
            </Card>

            {/* Areas to Improve */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Focus Areas</h2>
              </div>
              {results.weaknesses.length > 0 ? (
                <div className="space-y-3">
                  {results.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{weakness.domain}</span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {Math.round(weakness.percentage)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Great job! Continue building on all areas.
                </p>
              )}
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Your Personalized Plan</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Daily Practice</p>
                  <p className="text-sm text-muted-foreground">
                    {results.recommended_daily_minutes} minutes per day
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Priority Focus</p>
                  <p className="text-sm text-muted-foreground">
                    {results.weaknesses[0]?.domain || 'Balanced practice'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button onClick={onContinue} size="lg" className="px-8">
              View Your Dashboard
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              We've created your first daily study plan. Let's get started!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
