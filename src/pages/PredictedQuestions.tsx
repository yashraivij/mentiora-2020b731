import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Crown, Clock, Calendar, Star, Sparkles, Trophy, Target, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

const PredictedQuestions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time until May 7th, 2026
  useEffect(() => {
    const targetDate = new Date('2026-05-07T09:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/predicted-exam/${subjectId}`);
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600'
    ];
    const index = subjectId.length % colors.length;
    return colors[index];
  };

  const getFirstName = () => {
    if (!user) return 'there';
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      return fullName.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Premium Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground hover:bg-accent/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-amber-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Predicted 2026 Questions
                </h1>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  Premium
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="flex items-center space-x-2 px-4 py-2 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Crown className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{getFirstName()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Hero Section with Countdown */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-foreground mb-3 leading-tight">
              Master Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">2026 GCSEs</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience realistic exam conditions with AI-powered full-length papers. Weekly updates with the latest trends and past paper patterns.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl p-8 mb-8 shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300">Time Until First GCSE Paper</h3>
            </div>
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">Thursday, May 7th 2026 - 9:00 AM</p>
            
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/30 dark:border-amber-800/30">
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{item.value}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Update Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Weekly Updates</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              New practice paper every week — aligned with the latest trends and past paper patterns
            </p>
          </div>
        </div>

        {/* Premium Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 shadow-lg shadow-emerald-500/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-emerald-700 dark:text-emerald-300">Exam-Accurate Format</h3>
              </div>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                Full-length papers following exact AQA structure and timing
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 shadow-lg shadow-purple-500/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-2xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-purple-700 dark:text-purple-300">AI-Powered Marking</h3>
              </div>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                Detailed feedback with model answers and AO breakdowns
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 shadow-lg shadow-rose-500/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-rose-700 dark:text-rose-300">Real Exam Conditions</h3>
              </div>
              <p className="text-rose-600 dark:text-rose-400 text-sm">
                Timed practice with authentic pressure and environment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Star className="h-6 w-6 text-amber-500" />
            <h3 className="text-2xl font-bold text-foreground">Choose Your Subject</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum.map((subject) => (
              <Card 
                key={subject.id} 
                className="group cursor-pointer border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${getSubjectColor(subject.id)}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                        {subject.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Full-length predicted paper
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {subject.topics.length} topics
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>1hr 45min</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary-foreground hover:bg-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      Start Paper
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-3xl p-8">
          <Crown className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Premium Exam Experience</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Access to realistic exam conditions, AI-powered marking, and weekly updated papers. 
            Prepare like never before for your 2026 GCSEs.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Updated weekly with latest exam trends</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedQuestions;