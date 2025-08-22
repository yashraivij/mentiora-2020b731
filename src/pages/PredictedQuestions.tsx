import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Crown, Target, Sparkles, Rocket, Zap, CheckCircle, RotateCcw } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCountdown } from "@/components/ui/refresh-countdown";
import { PremiumPaywall } from "@/components/ui/premium-paywall";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/contexts/AuthContext";

const PredictedQuestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium, isLoading: premiumLoading } = usePremium();
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [completedExams, setCompletedExams] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [selectedExamBoard, setSelectedExamBoard] = useState('aqa');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Ensure page starts at top when navigating here
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    fetchCompletedExams();
  }, []);

  const fetchCompletedExams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Optimized query - only get what we need and limit results
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('subject_id, grade, percentage, completed_at, questions, answers, time_taken_seconds')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10); // Only get recent completions

      if (error) {
        console.error('Database error:', error);
        setLoading(false);
        return;
      }

      // Group by subject, keeping the latest completion for each
      const completions: {[key: string]: any} = {};
      data?.forEach(completion => {
        if (!completions[completion.subject_id]) {
          completions[completion.subject_id] = completion;
        }
      });

      setCompletedExams(completions);
    } catch (error) {
      console.error('Error fetching completed exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subjectId: string) => {
    if (isPremium) {
      // Premium users can go directly to the exam
      navigate(`/predicted-exam/${subjectId}`);
    } else {
      // Non-premium users see the paywall
      setShowPaywall(true);
    }
  };

  const handleUpgrade = () => {
    const baseUrl = 'https://buy.stripe.com/14A28qbAs87E9Yk5T28N203';
    const stripeUrl = user?.id ? `${baseUrl}?client_reference_id=${user.id}` : baseUrl;
    window.open(stripeUrl, '_blank');
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = {
      chemistry: "from-green-500 to-emerald-600",
      "chemistry-edexcel": "from-green-500 to-emerald-600",
      biology: "from-emerald-500 to-green-600", 
      physics: "from-blue-500 to-indigo-600",
      mathematics: "from-purple-500 to-indigo-600",
      "english-language": "from-rose-500 to-pink-600",
      "english-literature": "from-pink-500 to-rose-600",
      history: "from-amber-500 to-orange-600",
      geography: "from-teal-500 to-cyan-600",
      "computer-science": "from-slate-500 to-gray-600",
      psychology: "from-violet-500 to-purple-600"
    };
    return colors[subjectId as keyof typeof colors] || "from-gray-500 to-slate-600";
  };

  const getExamDuration = (subjectId: string) => {
    const durations = {
      chemistry: "1h 45min",
      "chemistry-edexcel": "1h 45min",
      biology: "1h 45min",
      physics: "1h 45min", 
      mathematics: "1h 30min",
      "english-language": "1h 45min",
      "english-literature": "1h 45min",
      history: "1h 15min",
      geography: "1h 30min",
      "computer-science": "1h 30min",
      psychology: "1h 45min",
      "combined-science-aqa": "1h 15min"
    };
    return durations[subjectId as keyof typeof durations] || "1h 30min";
  };

  const getBadgeText = (subjectId: string) => {
    if (subjectId === 'maths-edexcel' || subjectId === 'business-edexcel-igcse' || subjectId === 'chemistry-edexcel' || subjectId === 'physics-edexcel') {
      return 'Edexcel GCSE';
    }
    return 'AQA GCSE';
  };

  const getSubjectDisplayName = (subject: any, examBoard?: string) => {
    let name = subject.name;
    
    // Remove brackets from Edexcel subjects and update Business to IGCSE Business
    if (subject.id === 'maths-edexcel') {
      name = 'Mathematics';
    } else if (subject.id === 'business-edexcel-igcse') {
      name = 'IGCSE Business';
    } else if (subject.id === 'chemistry-edexcel') {
      name = 'Chemistry';
    } else if (subject.id === 'combined-science-aqa') {
      name = 'Combined Science Biology';
    }
    
    // For coming soon cards in CCEA, OCR, WJEC - remove Paper 1
    if (examBoard && ['ccea', 'ocr', 'wjec'].includes(examBoard)) {
      return name;
    }
    
    // Add Paper 1 for other subjects
    if (subject.id === 'geography') {
      return 'Geography Paper 1';
    } else if (subject.id === 'geography-paper-2') {
      return 'Geography Paper 2';
    } else if (subject.id === 'business-edexcel-igcse') {
      return 'IGCSE Business Paper 1';
    } else {
      return `${name} Paper 1`;
    }
  };

  const renderSubjectCard = (subject: any, examBoard?: string) => {
    const completion = loading ? null : completedExams[subject.id];
    const isCompleted = !loading && !!completion;
    
    return (
      <Card 
        key={subject.id} 
        className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      >
        {/* Card Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getSubjectColor(subject.id)} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
        
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-green-500 text-white rounded-full p-2 shadow-xl">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getSubjectColor(subject.id)} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-white/20`}>
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
              {getBadgeText(subject.id)}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors mt-3">
            {getSubjectDisplayName(subject, examBoard)}
          </CardTitle>
          <CardDescription className="text-white/80 text-sm">
            {isCompleted ? `Last Grade: ${completion.grade} (${completion.percentage}%)` : 
             subject.id === 'combined-science-aqa' ? 
               'Biology topics 1–4: Cell Biology; Organisation; Infection and response; and Bioenergetics' : 
               'Full predicted paper practice'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative pt-0">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="p-1.5 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Duration: {getExamDuration(subject.id)}</p>
                  <p className="text-white/70 text-xs">Real exam timing</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="p-1.5 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  {subject.id === 'combined-science-aqa' ? (
                    <>
                      <p className="text-white text-sm font-medium">70 marks • 16.7% of GCSE</p>
                      <p className="text-white/70 text-xs">Foundation and Higher Tier</p>
                    </>
                  ) : (
                    <>
                      <p className="text-white text-sm font-medium">{subject.topics.length} topics covered</p>
                      <p className="text-white/70 text-xs">Full specification</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between text-white text-sm">
                <span>Questions refresh:</span>
                <RefreshCountdown />
              </div>
            </div>
            
            <div className="space-y-2">
              {isCompleted ? (
                <>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 hover:from-blue-300 hover:via-purple-300 hover:to-indigo-300 text-white font-bold py-3 px-6 rounded-xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/predicted-results/${subject.id}`, { 
                        state: { 
                          questions: completion.questions, 
                          answers: completion.answers,
                          timeElapsed: completion.time_taken_seconds,
                          isReview: true,
                          completion: completion
                        } 
                      });
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Review Marking
                    <Target className="h-4 w-4 ml-2" />
                  </Button>
                   <Button 
                     className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-bold py-3 px-6 rounded-xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleSubjectSelect(subject.id);
                     }}
                   >
                     <RotateCcw className="h-4 w-4 mr-2" />
                     Retake Exam
                     <Sparkles className="h-4 w-4 ml-2" />
                   </Button>
                </>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-bold py-3 px-6 rounded-xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectSelect(subject.id);
                  }}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Start Premium Exam
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-15 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600 via-purple-500 to-pink-500 opacity-10" />
      
      {/* Floating Sparkles */}
      <div className="absolute top-20 left-10 animate-bounce">
        <Sparkles className="h-8 w-8 text-yellow-300/60" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse">
        <Crown className="h-10 w-10 text-yellow-400/70" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-300">
        <Rocket className="h-8 w-8 text-yellow-300/60" />
      </div>
      <div className="absolute top-60 right-40 animate-pulse delay-500">
        <Zap className="h-6 w-6 text-yellow-400/50" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')} 
                className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl border border-yellow-400/30 backdrop-blur-sm">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Predicted 2026 Questions</h1>
                  <p className="text-sm text-white/90">Premium exam simulation</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 pt-4 pb-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 hover:from-yellow-300 hover:to-orange-300">
              <Crown className="h-3 w-3 mr-1" />
              PREMIUM EXCLUSIVE
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Zap className="h-3 w-3 mr-1" />
              Weekly Updates
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Select Your Subject
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Choose a subject to start your full-length predicted exam practice. 
            Each paper follows the official exam board format with real exam timing.
          </p>
        </div>

        {/* Exam Board Tabs */}
        <Tabs value={selectedExamBoard} onValueChange={setSelectedExamBoard} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="aqa" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">AQA</TabsTrigger>
            <TabsTrigger value="edexcel" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Edexcel</TabsTrigger>
            <TabsTrigger value="ccea" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">CCEA</TabsTrigger>
            <TabsTrigger value="ocr" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">OCR</TabsTrigger>
            <TabsTrigger value="wjec" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">WJEC</TabsTrigger>
          </TabsList>

          <TabsContent value="aqa" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {curriculum
                 .filter(subject => subject.id !== 'maths-edexcel' && subject.id !== 'business-edexcel-igcse' && subject.id !== 'chemistry-edexcel' && subject.id !== 'physics-edexcel' && subject.id !== 'edexcel-english-language')
                 .map((subject) => renderSubjectCard(subject))}
            </div>
          </TabsContent>

          {['edexcel', 'ccea', 'ocr', 'wjec'].map((examBoard) => (
            <TabsContent key={examBoard} value={examBoard} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {curriculum
                   .filter((subject) => {
                      // Show maths-edexcel, business-edexcel-igcse, chemistry-edexcel, and physics-edexcel only in edexcel tab
                      if (subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') {
                       return examBoard === 'edexcel';
                     }
                     
                     // For edexcel tab, exclude subjects that have AQA GCSE badge
                     if (examBoard === 'edexcel') {
                       return false; // Don't show AQA GCSE subjects in Edexcel tab
                     }
                     
                       // For other exam boards, show all other subjects as coming soon
                       return subject.id !== 'maths-edexcel' && subject.id !== 'business-edexcel-igcse' && subject.id !== 'chemistry-edexcel' && subject.id !== 'physics-edexcel' && subject.id !== 'edexcel-english-language';
                   })
                   .sort((a, b) => {
                      // In edexcel tab, put maths-edexcel first, then business-edexcel-igcse, then chemistry-edexcel, then physics-edexcel
                      if (examBoard === 'edexcel') {
                        if (a.id === 'maths-edexcel') return -1;
                        if (b.id === 'maths-edexcel') return 1;
                        if (a.id === 'business-edexcel-igcse') return -1;
                        if (b.id === 'business-edexcel-igcse') return 1;
                        if (a.id === 'chemistry-edexcel') return -1;
                        if (b.id === 'chemistry-edexcel') return 1;
                        if (a.id === 'physics-edexcel') return -1;
                        if (b.id === 'physics-edexcel') return 1;
                      }
                     return 0;
                   })
                   .map((subject) => {
                      // For non-Edexcel tabs, show subjects as coming soon if they're not actually available
                      const isAvailable = examBoard === 'edexcel' && 
                        (subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel');
                    
                    if (!isAvailable && examBoard !== 'edexcel') {
                      return (
                        <Card 
                          key={subject.id} 
                          className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 opacity-60"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${getSubjectColor(subject.id)} opacity-20`} />
                          <CardHeader className="relative pb-4">
                            <div className="flex items-center justify-between">
                              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getSubjectColor(subject.id)} flex items-center justify-center shadow-2xl border border-white/20`}>
                                <BookOpen className="h-7 w-7 text-white" />
                              </div>
                              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                                Coming Soon
                              </Badge>
                            </div>
                            <CardTitle className="text-xl font-bold text-white mt-3">
                              {getSubjectDisplayName(subject, examBoard)}
                            </CardTitle>
                            <CardDescription className="text-white/80 text-sm">
                              Available soon for {examBoard.toUpperCase()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="relative pt-0">
                            <Button 
                              disabled
                              className="w-full bg-white/10 text-white/50 font-bold py-3 px-6 rounded-xl cursor-not-allowed"
                            >
                              Coming Soon
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    return renderSubjectCard(subject);
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <PremiumPaywall 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default PredictedQuestions;