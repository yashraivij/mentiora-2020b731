import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";

interface PredictedQuestionsSectionProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export const PredictedQuestionsSection = ({ isPremium = false, onUpgrade }: PredictedQuestionsSectionProps) => {
  const navigate = useNavigate();

  const handleStartPredicted = () => {
    if (isPremium) {
      navigate('/predicted-questions');
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-0 rounded-2xl hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground mb-1">
              Predicted 2026 Questions
            </CardTitle>
            <p className="text-muted-foreground">
              Weekly practice papers, exam-style
            </p>
          </div>
        </div>
        <CountdownTimer />
      </div>
      
      <Button 
        onClick={handleStartPredicted}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold rounded-xl"
      >
        {isPremium ? "Start Practice" : "Upgrade to Access"}
      </Button>
    </Card>
  );
};