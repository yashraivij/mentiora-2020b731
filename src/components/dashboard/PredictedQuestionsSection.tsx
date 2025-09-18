import { Button } from "@/components/ui/button";
import { Rocket, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PredictedQuestionsSectionProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export const PredictedQuestionsSection = ({ isPremium = false, onUpgrade }: PredictedQuestionsSectionProps) => {
  const navigate = useNavigate();

  const handleStartPractice = () => {
    if (isPremium) {
      navigate('/predicted-questions');
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  // Calculate days until June 2026 GCSEs (approximate)
  const examDate = new Date('2026-06-01');
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="mb-8">
      <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-purple-100/30 dark:from-gray-900/20 dark:via-transparent dark:to-purple-900/10" />
        
        {/* Countdown Chip - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {daysLeft} days left
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex items-start space-x-6">
          {/* Hero Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
              Predicted 2026 Questions
            </h2>

            {/* Subline */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">
              Get weekly exam-style practice.
            </p>

            {/* CTA Button */}
            <Button 
              onClick={handleStartPractice}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 text-lg border-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Start Practice</span>
            </Button>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-2xl" />
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 dark:from-indigo-800/20 dark:to-blue-800/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};