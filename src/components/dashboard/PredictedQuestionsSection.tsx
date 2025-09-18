import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
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
      <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-3xl p-8 border border-purple-100 dark:border-purple-800/30">
        
        {/* Countdown Chip - Top Right */}
        <div className="absolute top-6 right-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {daysLeft} days left
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl mb-6">
            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Predicted 2026 Questions
          </h2>

          {/* Subline */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Practice exam-style papers every week.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleStartPractice}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg border-0"
          >
            {isPremium ? "Start Practice" : "Start Practice"}
          </Button>
        </div>
      </div>
    </div>
  );
};