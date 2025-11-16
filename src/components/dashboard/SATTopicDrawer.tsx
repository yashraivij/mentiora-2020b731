import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, Calendar, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SAT_TOPICS } from "@/services/satTopicsConfig";

interface SATTopicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string | null;
  performance: {
    accuracy: number;
    questionsAttempted: number;
    lastPracticed: Date | null;
    trend: number[];
    strongAreas: string[];
    focusAreas: string[];
  };
}

export function SATTopicDrawer({ open, onOpenChange, topicId, performance }: SATTopicDrawerProps) {
  const navigate = useNavigate();
  const topic = SAT_TOPICS.find(t => t.id === topicId);

  if (!topic) return null;

  const getMasteryLevel = (acc: number) => {
    if (acc >= 75) return { label: 'Strong', color: 'text-emerald-600', emoji: '🟢' };
    if (acc >= 60) return { label: 'Developing', color: 'text-yellow-600', emoji: '🟡' };
    return { label: 'Needs Focus', color: 'text-red-500', emoji: '🔴' };
  };

  const mastery = getMasteryLevel(performance.accuracy);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6">
          <div className={`w-12 h-12 rounded-xl ${topic.color} opacity-20`} />
          <div>
            <SheetTitle className="text-2xl">{topic.name}</SheetTitle>
            <SheetDescription className="text-base">{topic.description}</SheetDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">{topic.section}</Badge>
            <Badge variant="outline" className={`${mastery.color} text-sm`}>
              {mastery.emoji} {mastery.label}
            </Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Accuracy</span>
                    <span className={`font-bold ${mastery.color}`}>{performance.accuracy}%</span>
                  </div>
                  <Progress value={performance.accuracy} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Questions Attempted</p>
                    <p className="text-2xl font-bold">{performance.questionsAttempted}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Practiced</p>
                    <p className="text-sm font-medium">
                      {performance.lastPracticed 
                        ? new Date(performance.lastPracticed).toLocaleDateString()
                        : 'Not yet'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strong Areas */}
            {performance.strongAreas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Strong Areas
                </h3>
                <div className="space-y-2">
                  {performance.strongAreas.map((area, idx) => (
                    <Card key={idx}>
                      <CardContent className="py-3">
                        <p className="text-sm">{area}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Focus Areas */}
            {performance.focusAreas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  Areas to Focus On
                </h3>
                <div className="space-y-2">
                  {performance.focusAreas.map((area, idx) => (
                    <Card key={idx} className="border-red-200 dark:border-red-900">
                      <CardContent className="py-3">
                        <p className="text-sm">{area}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-4">
                  <Play className="w-12 h-12 mx-auto text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Ready to Practice?</h3>
                    <p className="text-sm text-muted-foreground">
                      Start a focused practice session on {topic.name}
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => {
                      navigate(`/sat-session?topic=${topic.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Practice Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Practice Tips</h3>
              <Card>
                <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
                  <p>• Focus on understanding the concepts, not just memorizing answers</p>
                  <p>• Review explanations for both correct and incorrect answers</p>
                  <p>• Practice regularly to build confidence and accuracy</p>
                  <p>• Track your progress and adjust your study plan accordingly</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Calendar className="w-12 h-12 mx-auto text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">This Week's Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Practice this topic as part of your weekly study plan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Recommended Activities</h3>
              <div className="space-y-2">
                <Card>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Daily Practice</p>
                      <p className="text-xs text-muted-foreground">10-15 minutes per day</p>
                    </div>
                    <Badge variant="outline">Daily</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Review Mistakes</p>
                      <p className="text-xs text-muted-foreground">Understand what went wrong</p>
                    </div>
                    <Badge variant="outline">Weekly</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
