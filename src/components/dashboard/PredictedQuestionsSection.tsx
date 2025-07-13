import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, Target, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";

export const PredictedQuestionsSection = () => {
  const navigate = useNavigate();

  const handleStartPredicted = () => {
    navigate('/predicted-questions');
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Countdown Timer */}
      <CountdownTimer />
      
      {/* Main Predicted Questions Card */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-lg">
        {/* Premium Sparkle Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />
        <div className="absolute top-4 right-4">
          <Crown className="h-6 w-6 text-amber-500" />
        </div>
        
        <CardHeader className="relative">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Predicted 2026 Questions
              </CardTitle>
              <CardDescription className="text-base">
                Premium exam simulation with real GCSE structure
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium Feature
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              <Star className="h-3 w-3 mr-1" />
              Weekly Updates
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="space-y-6">
            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-border">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Real Exam Timer</p>
                  <p className="text-xs text-muted-foreground">Authentic time pressure</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-border">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">AQA Structure</p>
                  <p className="text-xs text-muted-foreground">Exact paper format</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-border">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Expert Marking</p>
                  <p className="text-xs text-muted-foreground">Detailed AO feedback</p>
                </div>
              </div>
            </div>
            
            {/* Weekly Update Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                    New practice paper every week
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    Aligned with the latest trends and past paper patterns
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <Button 
              onClick={handleStartPredicted}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Crown className="h-4 w-4 mr-2" />
              Start Predicted Exam Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};