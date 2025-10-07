import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Download, Share2, TrendingUp } from "lucide-react";

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
    const topTopic = sortedByProgress[0];
    const needsWork = sortedByProgress[sortedByProgress.length - 1];

    return {
      primary: bestSubject
        ? `Your strengths in ${bestSubject.subject_id} show strong conceptual understanding. Focus on data interpretation to reach Grade ${parseInt(bestSubject.grade) + 1}.`
        : "Complete more practice sessions to get personalized insights.",
      secondary: improvingSubjects.length > 0
        ? `You're improving fastest in ${improvingSubjects.map(s => s.subject_id).join(", ")} — keep reviewing your weak areas.`
        : "Focus on consistent practice to see improvement trends.",
      actionable: needsWork
        ? `Priority focus: ${needsWork.topicId}. Try breaking it down into smaller concepts and reviewing daily.`
        : "Keep up the great work!",
    };
  };

  const insights = generateInsights();

  const handleDownload = () => {
    // Generate report data
    const report = `
MENTIORA PROGRESS REPORT
========================

${insights.primary}

${insights.secondary}

${insights.actionable}

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Progress copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your Personalized Summary
              </h2>
              <p className="text-muted-foreground">
                AI-generated insights based on your performance
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Primary Insight */}
            <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                <p className="text-foreground leading-relaxed">{insights.primary}</p>
              </div>
            </div>

            {/* Secondary Insight */}
            <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-foreground leading-relaxed">{insights.secondary}</p>
              </div>
            </div>

            {/* Actionable Insight */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30 shadow-sm">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Action Plan:</h3>
                  <p className="text-foreground/80 leading-relaxed">{insights.actionable}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group" onClick={handleDownload}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/30 group-hover:scale-110 transition-transform duration-200">
                <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Download Report</h3>
                <p className="text-sm text-muted-foreground">Save your progress summary</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group" onClick={handleShare}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 group-hover:scale-110 transition-transform duration-200">
                <Share2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Share Progress</h3>
                <p className="text-sm text-muted-foreground">Show off your achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
