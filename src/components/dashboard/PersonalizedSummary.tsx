import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Download, Share2, TrendingUp, Target, Sparkles } from "lucide-react";

interface PersonalizedSummaryProps {
  predictedGrades: any[];
  userProgress: any[];
}

export const PersonalizedSummary = ({ predictedGrades, userProgress }: PersonalizedSummaryProps) => {
  // Generate AI-powered insights
  const generateInsights = () => {
    const sortedByGrade = [...predictedGrades].sort((a, b) => 
      parseInt(b.grade || "0") - parseInt(a.grade || "0")
    );
    const bestSubject = sortedByGrade[0];
    const improvingSubjects = predictedGrades.filter(g => parseInt(g.grade || "0") >= 6);

    const sortedByProgress = [...userProgress].sort((a, b) => b.averageScore - a.averageScore);
    const needsWork = sortedByProgress[sortedByProgress.length - 1];

    return {
      primary: bestSubject
        ? `Your strengths in ${bestSubject.subject_id} show strong conceptual understanding. Focus on data interpretation to reach Grade ${parseInt(bestSubject.grade) + 1}.`
        : "Complete more practice sessions to get personalized insights.",
      secondary: improvingSubjects.length > 0
        ? `You're improving fastest in ${improvingSubjects.map(s => s.subject_id).join(", ")} — keep reviewing your weak areas.`
        : "Focus on consistent practice to see improvement trends.",
      action: needsWork
        ? `Priority focus: ${needsWork.topicId}. Try breaking it down into smaller concepts and reviewing daily.`
        : "Keep up the great work!",
    };
  };

  const insights = generateInsights();

  const handleDownload = () => {
    const report = `
MENTIORA PROGRESS REPORT
========================

${insights.primary}

${insights.secondary}

${insights.action}

PREDICTED GRADES:
${predictedGrades.map(g => `${g.subject_id}: Grade ${g.grade} (${Math.round(g.percentage)}%)`).join("\n")}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentiora-progress-report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `Check out my progress on Mentiora! 📚\n\n${insights.primary}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Mentiora Progress",
          text: shareText,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Progress copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
        <div className="absolute inset-0 bg-[var(--gradient-rainbow)] opacity-10" />
        <div className="relative backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary via-success to-info bg-clip-text text-transparent">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              AI-Powered Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              AI-generated insights based on your performance
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="relative overflow-hidden p-5 rounded-xl bg-primary/10 border-l-4 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 group">
              <div className="absolute inset-0 bg-[var(--gradient-primary)] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Primary Insight</h3>
                  <p className="text-sm text-foreground font-medium">{insights.primary}</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden p-5 rounded-xl bg-success/10 border-l-4 border-success shadow-[0_0_20px_hsl(var(--success)/0.2)] hover:shadow-[0_0_30px_hsl(var(--success)/0.3)] transition-all duration-300 group">
              <div className="absolute inset-0 bg-[var(--gradient-success)] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex items-start gap-3">
                <Brain className="h-6 w-6 text-success mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Secondary Insight</h3>
                  <p className="text-sm text-foreground font-medium">{insights.secondary}</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden p-5 rounded-xl bg-warning/10 border-l-4 border-warning shadow-[0_0_20px_hsl(var(--warning)/0.2)] hover:shadow-[0_0_30px_hsl(var(--warning)/0.3)] transition-all duration-300 group">
              <div className="absolute inset-0 bg-[var(--gradient-warning)] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex items-start gap-3">
                <Target className="h-6 w-6 text-warning mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Action Needed</h3>
                  <p className="text-sm text-foreground font-medium">{insights.action}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button 
              onClick={handleDownload} 
              className="flex-1 bg-[var(--gradient-info)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 text-white font-semibold"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </Button>
            <Button 
              onClick={handleShare} 
              className="flex-1 bg-[var(--gradient-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 text-white font-semibold"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Progress
            </Button>
          </div>
        </CardContent>
        </div>
      </Card>
    </div>
  );
};
