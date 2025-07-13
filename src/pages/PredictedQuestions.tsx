import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Crown, Target, Sparkles, Rocket, Zap, CheckCircle, RotateCcw } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PredictedQuestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [completedExams, setCompletedExams] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedExams();
  }, []);

  // Aggressive refresh when page becomes visible - ensures buttons appear after completing exams
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible - refreshing completed exams');
        fetchCompletedExams();
      }
    };

    const handleFocus = () => {
      console.log('Window focused - refreshing completed exams');
      fetchCompletedExams();
    };

    const handlePageShow = () => {
      console.log('Page shown - refreshing completed exams');
      fetchCompletedExams();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Auto-refresh every 5 seconds to catch new completions immediately
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh: checking for new exam completions');
      fetchCompletedExams();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Also refresh when user comes back to the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🚪 User leaving page');
    };

    const handleLoad = () => {
      console.log('🔄 Page loaded - fetching completions');
      fetchCompletedExams();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const fetchCompletedExams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching ALL predicted exam completions for user:', user.id);

      // Get ALL completions with no filters to ensure we don't miss anything
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('*') // Get ALL columns to see what data exists
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('❌ Database error:', error);
        setLoading(false);
        return;
      }

      console.log('📊 FULL RAW DATA from database:', data);
      console.log('🔢 Total records found:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('📋 All subject IDs in database:', [...new Set(data.map(d => d.subject_id))]);
        console.log('📚 Curriculum subject IDs:', curriculum.map(s => s.id));
        
        // Log each completion with details
        data.forEach((completion, index) => {
          console.log(`📝 Completion ${index + 1}:`, {
            subject_id: completion.subject_id,
            grade: completion.grade,
            percentage: completion.percentage,
            completed_at: completion.completed_at
          });
        });
      }

      // Create a comprehensive mapping for ALL possible subject variations
      const createSubjectMapping = () => {
        const mapping: {[key: string]: string} = {};
        
        // For each curriculum subject, add ALL possible variations
        curriculum.forEach(subject => {
          const id = subject.id;
          mapping[id] = id; // Exact match
          mapping[id.toLowerCase()] = id; // Lowercase
          mapping[id.toUpperCase()] = id; // Uppercase
          mapping[id.replace('-', '')] = id; // No hyphens
          mapping[id.replace('-', '_')] = id; // Underscores instead of hyphens
          
          // Special cases
          if (id === 'maths') {
            mapping['mathematics'] = id;
            mapping['math'] = id;
            mapping['Math'] = id;
            mapping['Mathematics'] = id;
            mapping['MATHS'] = id;
            mapping['MATHEMATICS'] = id;
          }
          if (id === 'english-language') {
            mapping['english_language'] = id;
            mapping['englishlanguage'] = id;
            mapping['English Language'] = id;
            mapping['english language'] = id;
          }
          if (id === 'english-literature') {
            mapping['english_literature'] = id;
            mapping['englishliterature'] = id;
            mapping['English Literature'] = id;
            mapping['english literature'] = id;
          }
          if (id === 'computer-science') {
            mapping['computer_science'] = id;
            mapping['computerscience'] = id;
            mapping['Computer Science'] = id;
            mapping['computer science'] = id;
          }
        });
        
        console.log('🗺️ Subject ID mapping created:', mapping);
        return mapping;
      };

      const subjectMapping = createSubjectMapping();

      // Process completions with aggressive mapping
      const completions: {[key: string]: any} = {};
      data?.forEach(completion => {
        const rawSubjectId = completion.subject_id;
        const mappedSubjectId = subjectMapping[rawSubjectId] || rawSubjectId;
        
        console.log(`🔄 Mapping: "${rawSubjectId}" -> "${mappedSubjectId}"`);
        
        // Check if this mapped subject exists in curriculum
        const curriculumSubject = curriculum.find(s => s.id === mappedSubjectId);
        if (curriculumSubject) {
          const currentCompletion = completions[mappedSubjectId];
          if (!currentCompletion || new Date(completion.completed_at) > new Date(currentCompletion.completed_at)) {
            completions[mappedSubjectId] = {
              ...completion,
              subject_id: mappedSubjectId // Use the mapped subject ID
            };
            console.log(`✅ Added completion for ${mappedSubjectId}:`, completion.grade, completion.percentage + '%');
          }
        } else {
          console.warn(`⚠️ Subject "${mappedSubjectId}" not found in curriculum`);
        }
      });

      console.log('🎯 Final processed completions:', Object.keys(completions));
      console.log('📈 Completion details:', completions);
      
      setCompletedExams(completions);
    } catch (error) {
      console.error('💥 Error fetching completed exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/predicted-exam/${subjectId}`);
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = {
      chemistry: "from-green-500 to-emerald-600",
      biology: "from-emerald-500 to-green-600", 
      physics: "from-blue-500 to-indigo-600",
      maths: "from-purple-500 to-indigo-600",  // Updated to use "maths"
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
      biology: "1h 45min",
      physics: "1h 45min", 
      maths: "1h 30min",  // Updated to use "maths"
      "english-language": "1h 45min",
      "english-literature": "1h 45min",
      history: "1h 15min",
      geography: "1h 30min",
      "computer-science": "1h 30min",
      psychology: "1h 45min"
    };
    return durations[subjectId as keyof typeof durations] || "1h 30min";
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

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
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
            Each paper follows the exact AQA format with real exam timing.
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.map((subject) => {
            const completion = loading ? null : completedExams[subject.id];
            const isCompleted = !loading && !!completion;
            
            return (
              <Card 
                key={subject.id} 
                className="group cursor-pointer relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                onClick={() => !isCompleted && handleSubjectSelect(subject.id)}
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
                      AQA GCSE
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors mt-3">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="text-white/80 text-sm">
                    {isCompleted ? `Last Grade: ${completion.grade} (${completion.percentage}%)` : 'Full predicted paper practice'}
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
                          <p className="text-white text-sm font-medium">{subject.topics.length} topics covered</p>
                          <p className="text-white/70 text-xs">Full specification</p>
                        </div>
                      </div>
                    </div>
                    
                    {isCompleted && (
                      <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl p-3 mb-3">
                        <div className="flex items-center justify-between text-white text-sm">
                          <span>Questions refresh:</span>
                          <span className="font-bold">Next week</span>
                        </div>
                      </div>
                    )}
                    
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
          })}
        </div>
      </div>
    </div>
  );
};

export default PredictedQuestions;