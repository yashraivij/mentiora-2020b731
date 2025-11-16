import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ScoreData {
  section: string;
  current: number;
  target: number;
  range: { low: number; high: number };
  maxScore: number;
}

interface SATPredictedScoresGraphProps {
  onUpgrade?: () => void;
}

export const SATPredictedScoresGraph = ({ onUpgrade }: SATPredictedScoresGraphProps) => {
  const { user } = useAuth();
  const [scoresData, setScoresData] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateScores = async () => {
      if (!user?.id) return;

      try {
        // Get profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('sat_predicted_score_low, sat_predicted_score_high, sat_target_score')
          .eq('id', user.id)
          .single();

        if (!profile) return;

        // Get session logs to calculate section scores
        const { data: sessions } = await supabase
          .from('sat_session_logs')
          .select('answers')
          .eq('user_id', user.id);

        // Calculate section accuracies
        let rwCorrect = 0, rwTotal = 0, mathCorrect = 0, mathTotal = 0;
        
        sessions?.forEach(session => {
          const answers = session.answers as any[];
          answers?.forEach((answer: any) => {
            // Determine section based on domain
            const domain = answer.domain || '';
            const isRW = domain.includes('Information') || domain.includes('Craft') || domain.includes('Convention');
            
            if (isRW) {
              rwTotal++;
              if (answer.is_correct) rwCorrect++;
            } else {
              mathTotal++;
              if (answer.is_correct) mathCorrect++;
            }
          });
        });

        // Calculate section scores (200-800 scale)
        const rwAccuracy = rwTotal > 0 ? (rwCorrect / rwTotal) * 100 : 0;
        const mathAccuracy = mathTotal > 0 ? (mathCorrect / mathTotal) * 100 : 0;
        
        const calculateSectionScore = (accuracy: number) => {
          return Math.round(200 + (600 * (accuracy / 100)));
        };

        const rwScore = calculateSectionScore(rwAccuracy);
        const mathScore = calculateSectionScore(mathAccuracy);
        const totalScore = rwScore + mathScore;

        const targetScore = profile.sat_target_score || 1300;
        const targetRW = Math.round(targetScore / 2);
        const targetMath = Math.round(targetScore / 2);

        setScoresData([
          {
            section: 'Overall SAT Score',
            current: totalScore,
            target: targetScore,
            range: { 
              low: profile.sat_predicted_score_low || totalScore - 50, 
              high: profile.sat_predicted_score_high || totalScore + 50 
            },
            maxScore: 1600
          },
          {
            section: 'Reading & Writing',
            current: rwScore,
            target: targetRW,
            range: { low: rwScore - 25, high: rwScore + 25 },
            maxScore: 800
          },
          {
            section: 'Math',
            current: mathScore,
            target: targetMath,
            range: { low: mathScore - 25, high: mathScore + 25 },
            maxScore: 800
          }
        ]);
      } catch (error) {
        console.error('Error calculating SAT scores:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateScores();
  }, [user?.id]);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 81) return 'text-emerald-600 dark:text-emerald-400'; // 1300+ or 650+
    if (percentage >= 69) return 'text-yellow-600 dark:text-yellow-400'; // 1100-1299 or 550-649
    return 'text-red-500 dark:text-red-400';
  };

  const getScoreBg = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 81) return 'bg-emerald-50 dark:bg-emerald-950/30';
    if (percentage >= 69) return 'bg-yellow-50 dark:bg-yellow-950/30';
    return 'bg-red-50 dark:bg-red-950/30';
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Predicted SAT Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">Loading scores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Predicted SAT Scores
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            Score Range
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {scoresData.map((data, index) => {
          const progress = (data.current / data.maxScore) * 100;
          const targetProgress = (data.target / data.maxScore) * 100;
          const gap = data.target - data.current;

          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{data.section}</p>
                  <p className="text-xs text-muted-foreground">
                    Range: {data.range.low}-{data.range.high}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${getScoreColor(data.current, data.maxScore)}`}>
                    {data.current}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Target: {data.target} {gap > 0 && `(+${gap})`}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                {/* Current Score Bar */}
                <div 
                  className={`absolute left-0 top-0 h-full ${getScoreBg(data.current, data.maxScore)} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                >
                  <div className={`h-full ${data.current >= data.target ? 'bg-emerald-500' : 'bg-primary'} opacity-60`} />
                </div>
                
                {/* Target Marker */}
                <div 
                  className="absolute top-0 h-full w-1 bg-foreground/60"
                  style={{ left: `${targetProgress}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-foreground/60" />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <Badge 
                  variant="outline" 
                  className={`${getScoreBg(data.current, data.maxScore)} ${getScoreColor(data.current, data.maxScore)} border-0`}
                >
                  {data.current >= data.target ? '✓ Goal Reached' : gap > 0 ? `${gap} points to target` : 'On track'}
                </Badge>
                <span className="text-muted-foreground">Max: {data.maxScore}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
