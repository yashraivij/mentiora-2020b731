import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, TrendingUp, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashcardCreator } from "@/components/flashcards/FlashcardCreator";
import { FlashcardViewer } from "@/components/flashcards/FlashcardViewer";
import { useState } from "react";

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
  const [learningMode, setLearningMode] = useState(false);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  
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

  // If in learning mode, show the flashcard viewer
  if (learningMode && selectedSet) {
    return (
      <div className="h-full">
        <FlashcardViewer 
          flashcardSet={selectedSet}
          mode="learn"
          onBack={() => {
            setLearningMode(false);
            setSelectedSet(null);
          }}
        />
      </div>
    );
  }

  const handleStartLearning = () => {
    if (flashcardSets.length > 0) {
      // Create a combined set with all flashcards
      const combinedSet = {
        id: 'all-flashcards',
        title: 'All Flashcards',
        subject_id: 'mixed',
        exam_board: 'mixed',
        flashcards: individualFlashcards.map(card => ({
          id: card.id,
          front: card.front,
          back: card.back
        })),
        created_at: new Date().toISOString(),
        card_count: individualFlashcards.length
      };
      setSelectedSet(combinedSet);
      setLearningMode(true);
    }
  };

  return (
    <Tabs defaultValue="insights" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4 bg-white dark:bg-gray-900 border border-[#E2E8F0]/50 dark:border-gray-800 rounded-xl shadow-sm p-1">
        <TabsTrigger 
          value="insights"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0EA5E9] data-[state=active]:to-[#38BDF8] data-[state=active]:text-white data-[state=active]:shadow-md font-bold tracking-tight transition-all duration-300 text-sm"
        >
          Insights
        </TabsTrigger>
        <TabsTrigger 
          value="create"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0EA5E9] data-[state=active]:to-[#38BDF8] data-[state=active]:text-white data-[state=active]:shadow-md font-bold tracking-tight transition-all duration-300 text-sm"
        >
          Create New
        </TabsTrigger>
      </TabsList>

      <TabsContent value="insights" className="space-y-4 mt-0">
        {/* Flashcard Overview */}
        <Card className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#0EA5E9]" />
            Statistics
          </CardTitle>
        </CardHeader>
          <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Total Sets */}
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30 shadow-md">
              <div className="text-3xl font-bold text-[#0EA5E9] mb-1 tracking-tight">
                {totalSets}
              </div>
              <div className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wide">
                Flashcard Sets
              </div>
            </div>

            {/* Total Cards */}
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30 shadow-md">
              <div className="text-3xl font-bold text-[#0EA5E9] mb-1 tracking-tight">
                {totalCards}
              </div>
              <div className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wide">
                Total Cards
              </div>
            </div>

            {/* Avg Per Set */}
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 dark:border-[#0EA5E9]/30 shadow-md">
              <div className="text-3xl font-bold text-[#0EA5E9] mb-1 tracking-tight">
                {avgCardsPerSet}
              </div>
              <div className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wide">
                Cards per Set
              </div>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown and Review Progress */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Subjects */}
          <Card className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#0EA5E9]" />
                Top Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topSubjects.length > 0 ? (
                <div className="space-y-3">
                  {topSubjects.map(([subject, count], index) => (
                    <div key={subject} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium capitalize">
                          {subject.replace(/-/g, ' ')}
                        </span>
                        <Badge variant="secondary" className="font-semibold text-xs">
                          {String(count)} cards
                        </Badge>
                      </div>
                      <Progress 
                        value={(Number(count) / Number(totalCards)) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Brain className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No flashcards yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Progress */}
          <Card className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#0EA5E9]" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">Collection Progress</span>
                  <span className="text-xs font-bold text-primary">
                    {Math.round(reviewProgress)}%
                  </span>
                </div>
                <Progress value={reviewProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Building your flashcard library
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 shadow-sm">
                    <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#0F172A] dark:text-white">Study Sessions</p>
                    <p className="text-xs text-[#64748B] dark:text-gray-400">
                      Regular review boosts retention by 80%
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]/50 dark:border-gray-800 space-y-2">
                {totalCards > 0 && (
                  <Button 
                    onClick={handleStartLearning}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-bold h-10 group text-sm"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Learning
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
                <Button 
                  onClick={onViewFlashcards}
                  variant="outline"
                  className="w-full border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 dark:hover:bg-[#0EA5E9]/20 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl font-bold h-10 group text-sm"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  View All Flashcards
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 shadow-sm">
                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0F172A] dark:text-white mb-1 tracking-tight text-sm">Pro Tip: Spaced Repetition</h3>
                <p className="text-xs text-[#64748B] dark:text-gray-400 leading-relaxed font-medium">
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