import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashcardCreator } from "@/components/flashcards/FlashcardCreator";

interface FlashcardInsightsProps {
  flashcardSets: any[];
  individualFlashcards: any[];
  onViewFlashcards: () => void;
  onFlashcardCreated?: () => void;
  userSubjects?: Array<{ subject_name: string; exam_board: string }>;
}

export const FlashcardInsights = ({ 
  flashcardSets, 
  individualFlashcards,
  onViewFlashcards,
  onFlashcardCreated,
  userSubjects = []
}: FlashcardInsightsProps) => {
  const totalCards = individualFlashcards.length;
  const totalSets = flashcardSets.length;
  
  // Group cards by subject
  const cardsBySubject = individualFlashcards.reduce((acc, card) => {
    const subject = card.subject_id || 'Unknown';
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSubjects = Object.entries(cardsBySubject)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3);

  // Calculate average cards per set
  const avgCardsPerSet = totalSets > 0 ? Math.round(Number(totalCards) / Number(totalSets)) : 0;

  // Estimate review progress (mock data - can be enhanced with actual review tracking)
  const reviewProgress = Math.min((Number(totalCards) / 100) * 100, 100);

  return (
    <Tabs defaultValue="insights" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-[#0EA5E9]/10 to-[#38BDF8]/10 dark:from-[#0EA5E9]/20 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30">
        <TabsTrigger 
          value="insights"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0EA5E9] data-[state=active]:to-[#38BDF8] data-[state=active]:text-white data-[state=active]:shadow-lg"
        >
          Insights
        </TabsTrigger>
        <TabsTrigger 
          value="create"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0EA5E9] data-[state=active]:to-[#38BDF8] data-[state=active]:text-white data-[state=active]:shadow-lg"
        >
          Create New
        </TabsTrigger>
      </TabsList>

      <TabsContent value="insights" className="space-y-6 mt-0">
        {/* Flashcard Overview */}
        <Card className="border-0 bg-gradient-to-br from-[#0EA5E9]/10 via-[#0EA5E9]/5 to-background shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#0EA5E9]" />
            Flashcard Statistics
          </CardTitle>
          <p className="text-sm text-[#64748B] dark:text-gray-400">
            Your flashcard learning progress and insights
          </p>
        </CardHeader>
          <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Total Sets */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30">
              <div className="text-4xl font-bold text-[#0EA5E9] mb-2">
                {totalSets}
              </div>
              <div className="text-sm font-medium text-[#64748B] dark:text-gray-400">
                Flashcard Sets
              </div>
            </div>

            {/* Total Cards */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30">
              <div className="text-4xl font-bold text-[#0EA5E9] mb-2">
                {totalCards}
              </div>
              <div className="text-sm font-medium text-[#64748B] dark:text-gray-400">
                Total Cards
              </div>
            </div>

            {/* Avg Per Set */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30">
              <div className="text-4xl font-bold text-[#0EA5E9] mb-2">
                {avgCardsPerSet}
              </div>
              <div className="text-sm font-medium text-[#64748B] dark:text-gray-400">
                Cards per Set
              </div>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown and Review Progress */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Subjects */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Top Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topSubjects.length > 0 ? (
                <div className="space-y-4">
                  {topSubjects.map(([subject, count], index) => (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {subject.replace(/-/g, ' ')}
                        </span>
                        <Badge variant="secondary" className="font-semibold">
                          {String(count)} cards
                        </Badge>
                      </div>
                      <Progress 
                        value={(Number(count) / Number(totalCards)) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No flashcards yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Progress */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Collection Progress</span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(reviewProgress)}%
                  </span>
                </div>
                <Progress value={reviewProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Building your flashcard library
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/30">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Study Sessions</p>
                    <p className="text-xs text-muted-foreground">
                      Regular review boosts retention by 80%
                    </p>
                  </div>
                </div>
              </div>

            <Button 
              onClick={onViewFlashcards}
              className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg"
            >
              <Brain className="h-4 w-4 mr-2" />
              View All Flashcards
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 shadow-lg border-amber-200/50 dark:border-amber-800/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Pro Tip: Spaced Repetition</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Review your flashcards at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. 
                  This scientifically proven method helps transfer knowledge to long-term memory.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="create" className="mt-0">
        <FlashcardCreator 
          onSetCreated={() => {
            onFlashcardCreated?.();
          }}
          userSubjects={userSubjects}
        />
      </TabsContent>
    </Tabs>
  );
};