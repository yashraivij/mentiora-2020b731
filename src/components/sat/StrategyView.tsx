import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Brain, RotateCcw, Target, Calendar, LineChart } from "lucide-react";

interface StrategyViewProps {
  onContinue: () => void;
}

const strategies = [
  {
    icon: Target,
    text: "Start with your weak areas first",
    color: "text-red-500"
  },
  {
    icon: TrendingUp,
    text: "Mix in confidence-boosting questions",
    color: "text-green-500"
  },
  {
    icon: RotateCcw,
    text: "Add review loops for mistakes",
    color: "text-blue-500"
  },
  {
    icon: Brain,
    text: "Increase difficulty as you improve",
    color: "text-purple-500"
  },
  {
    icon: Calendar,
    text: "Build exam stamina gradually",
    color: "text-orange-500"
  },
  {
    icon: LineChart,
    text: "Show predicted score changes weekly",
    color: "text-cyan-500"
  }
];

export function StrategyView({ onContinue }: StrategyViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold">Here's how I'll help you improve:</h1>
          <p className="text-lg text-muted-foreground">
            Your personalized learning strategy adapts to your progress
          </p>
        </motion.div>

        {/* Strategy Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <div className="space-y-4">
              {strategies.map((strategy, index) => {
                const Icon = strategy.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`flex-shrink-0 ${strategy.color}`}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{strategy.text}</p>
                    </div>
                    <Icon className={`w-5 h-5 ${strategy.color} flex-shrink-0`} />
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Timeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Your Learning Timeline</h3>
              <div className="flex items-center justify-between gap-2">
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, index) => (
                  <div key={week} className="flex-1">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'}`} />
                      {index < 3 && <div className="flex-1 h-0.5 bg-muted" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{week}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Adaptive difficulty progression based on your performance
              </p>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <button
            onClick={onContinue}
            className="px-12 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Build my study plan
          </button>
        </motion.div>
      </div>
    </div>
  );
}
