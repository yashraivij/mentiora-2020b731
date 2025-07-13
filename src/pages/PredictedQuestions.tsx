import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Crown, Clock, Calendar, Zap, Target, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const PredictedQuestions = () => {
  const navigate = useNavigate();
  const [timeUntilExam, setTimeUntilExam] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeUntilExam = () => {
      const examDate = new Date('2026-05-07T09:00:00'); // Thursday May 7th, 2026, 9 AM
      const now = new Date();
      const difference = examDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeUntilExam({ days, hours, minutes, seconds });
      }
    };

    calculateTimeUntilExam();
    const interval = setInterval(calculateTimeUntilExam, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/predicted-exam/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Premium Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="hover:bg-accent/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Predicted 2026 Questions
                </h1>
                <div className="flex items-center space-x-2">
                  <Crown className="h-3 w-3 text-amber-500" />
                  <span className="text-xs font-medium text-muted-foreground">Premium Feature</span>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Countdown Timer */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 dark:from-primary/10 dark:via-primary/20 dark:to-accent/10 border-primary/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl text-foreground">GCSE 2026 Countdown</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                First exam: Thursday, May 7th, 2026
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{timeUntilExam.days}</div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{timeUntilExam.hours}</div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{timeUntilExam.minutes}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{timeUntilExam.seconds}</div>
                  <div className="text-sm text-muted-foreground">Seconds</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    🎯 New practice paper every week — aligned with the latest trends and past paper patterns.
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Full-length, exam-format papers that mimic the real GCSE 2026 experience across all subjects.
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    Premium
                  </Badge>
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Selection */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Select Your Subject</h2>
            <Badge variant="outline" className="text-muted-foreground border-border bg-card/50">
              {curriculum.length} subjects available
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {curriculum.map((subject) => (
              <Card 
                key={subject.id} 
                className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border hover:border-primary/30"
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-muted-foreground">New Paper</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Full AQA format exam paper
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Paper Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">1hr 45min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Full marks</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span>Real exam format</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span>AI-powered marking</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        <span>Detailed feedback</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start Exam
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Analytics Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Performance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Track your progress across all predicted papers with detailed analytics and grade predictions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-200/50 dark:border-emerald-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                Exam Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Practice under real exam conditions with proper timing and question formats.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/10 border-amber-200/50 dark:border-amber-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center">
                <Crown className="h-5 w-5 mr-2 text-amber-500" />
                Premium Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Get detailed marking breakdowns and personalized feedback from our AI teacher.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictedQuestions;