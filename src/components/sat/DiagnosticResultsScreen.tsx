import { motion } from "framer-motion";
import { DiagnosticResults } from "@/types/sat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Award, Target } from "lucide-react";

interface DiagnosticResultsScreenProps {
  results: DiagnosticResults;
  onContinue: () => void;
}

const getSectionStatus = (percentage: number) => {
  if (percentage >= 75) return { icon: "🟢", label: "Strong", color: "text-green-600" };
  if (percentage >= 60) return { icon: "🟡", label: "Developing", color: "text-yellow-600" };
  return { icon: "🔴", label: "Needs focus", color: "text-red-600" };
};

const getDomainSection = (domain: string): "Reading & Writing" | "Math" => {
  const rwDomains = ["Reading Comprehension", "Writing & Language", "Vocabulary"];
  return rwDomains.includes(domain) ? "Reading & Writing" : "Math";
};

export function DiagnosticResultsScreen({ results, onContinue }: DiagnosticResultsScreenProps) {
  // Calculate section performance
  const sectionScores = results.strengths
    .concat(results.weaknesses)
    .reduce((acc, item) => {
      const section = getDomainSection(item.domain);
      if (!acc[section]) {
        acc[section] = { total: 0, count: 0 };
      }
      acc[section].total += item.percentage;
      acc[section].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

  const rwPercentage = sectionScores["Reading & Writing"] 
    ? sectionScores["Reading & Writing"].total / sectionScores["Reading & Writing"].count 
    : 0;
  const mathPercentage = sectionScores["Math"] 
    ? sectionScores["Math"].total / sectionScores["Math"].count 
    : 0;

  const rwStatus = getSectionStatus(rwPercentage);
  const mathStatus = getSectionStatus(mathPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Your SAT Baseline</h1>
          <p className="text-xl text-muted-foreground">
            Great start — you've already given me enough to understand how you think. Now we build.
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Estimated SAT Score</p>
              <div className="text-6xl font-bold text-primary">
                {results.score_low}–{results.score_high}
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>Based on {results.total_questions} questions</span>
                <Badge variant="secondary">{results.percentage}% accuracy</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Section Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Reading & Writing</span>
                <div className="flex items-center gap-2">
                  <span className={`${rwStatus.color} font-medium`}>
                    {rwStatus.icon} {rwStatus.label}
                  </span>
                  <Badge variant="outline">{Math.round(rwPercentage)}%</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Math</span>
                <div className="flex items-center gap-2">
                  <span className={`${mathStatus.color} font-medium`}>
                    {mathStatus.icon} {mathStatus.label}
                  </span>
                  <Badge variant="outline">{Math.round(mathPercentage)}%</Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Strengths and Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Strengths */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-bold">Your Strengths</h3>
            </div>
            <div className="space-y-3">
              {results.strengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <span className="font-medium text-sm">{strength.domain}</span>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                    {strength.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Focus Areas */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-bold">Focus Areas</h3>
            </div>
            <div className="space-y-3">
              {results.weaknesses.slice(0, 3).map((weakness, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                  <span className="font-medium text-sm">{weakness.domain}</span>
                  <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                    {weakness.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={onContinue}
            className="px-12 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
