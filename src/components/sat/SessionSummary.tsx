import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, Clock, Award, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SessionSummaryProps {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  domainsImproved: string[];
  scoreDelta: number;
  timeSpentMinutes: number;
  onContinue: () => void;
  onDoMore?: () => void;
}

export function SessionSummary({
  questionsAnswered,
  correctAnswers,
  accuracy,
  domainsImproved,
  scoreDelta,
  timeSpentMinutes,
  onContinue,
  onDoMore
}: SessionSummaryProps) {
  const incorrectAnswers = questionsAnswered - correctAnswers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 mb-4">
            <Award className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold">Session Complete!</h1>
          <p className="text-lg text-muted-foreground">
            Consistency beats intensity — and today counts.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{questionsAnswered}</div>
            <p className="text-sm text-muted-foreground mt-1">Questions</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
            <p className="text-sm text-muted-foreground mt-1">Correct</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{incorrectAnswers}</div>
            <p className="text-sm text-muted-foreground mt-1">Incorrect</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{timeSpentMinutes}</div>
            <p className="text-sm text-muted-foreground mt-1">Minutes</p>
          </Card>
        </motion.div>

        {/* Accuracy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Accuracy</h3>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {accuracy}%
                </Badge>
              </div>
              <Progress value={accuracy} className="h-3" />
            </div>
          </Card>
        </motion.div>

        {/* Domains Improved */}
        {domainsImproved.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold">Domains Improved</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {domainsImproved.map((domain, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {domain}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Score Delta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Predicted Score Adjustment</p>
              <div className={`text-4xl font-bold ${scoreDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {scoreDelta > 0 ? '+' : ''}{scoreDelta}
              </div>
              <p className="text-sm text-muted-foreground">points</p>
            </div>
          </Card>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={onContinue}
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Come back tomorrow
          </button>
          {onDoMore && (
            <button
              onClick={onDoMore}
              className="w-full px-8 py-3 text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Do 5 more questions
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
