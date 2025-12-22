import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Calculator, BookOpen, Atom, FlaskConical, Globe, Clock, PenTool, Microscope, ArrowRight, Lightbulb, Home, Target, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { curriculum } from "@/data/curriculum";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";

const subjectIcons: Record<string, React.ReactNode> = {
  "maths-edexcel": <Calculator className="h-6 w-6" />,
  "mathematics": <Calculator className="h-6 w-6" />,
  "english-language": <PenTool className="h-6 w-6" />,
  "english-literature": <BookOpen className="h-6 w-6" />,
  "physics": <Atom className="h-6 w-6" />,
  "physics-edexcel": <Atom className="h-6 w-6" />,
  "chemistry": <FlaskConical className="h-6 w-6" />,
  "chemistry-edexcel": <FlaskConical className="h-6 w-6" />,
  "biology": <Microscope className="h-6 w-6" />,
  "biology-edexcel": <Microscope className="h-6 w-6" />,
  "geography": <Globe className="h-6 w-6" />,
  "history": <Clock className="h-6 w-6" />,
};

const subjectColors: Record<string, { bg: string, iconBg: string, iconColor: string, selectedBorder: string }> = {
  "maths-edexcel": { bg: "bg-sticky-pink", iconBg: "bg-pink-200", iconColor: "text-pink-600", selectedBorder: "border-primary" },
  "mathematics": { bg: "bg-sticky-pink", iconBg: "bg-pink-200", iconColor: "text-pink-600", selectedBorder: "border-primary" },
  "english-language": { bg: "bg-sticky-blue", iconBg: "bg-blue-200", iconColor: "text-blue-600", selectedBorder: "border-primary" },
  "english-literature": { bg: "bg-sticky-purple", iconBg: "bg-purple-200", iconColor: "text-purple-600", selectedBorder: "border-primary" },
  "physics": { bg: "bg-sticky-yellow", iconBg: "bg-amber-200", iconColor: "text-amber-600", selectedBorder: "border-primary" },
  "physics-edexcel": { bg: "bg-sticky-yellow", iconBg: "bg-amber-200", iconColor: "text-amber-600", selectedBorder: "border-primary" },
  "chemistry": { bg: "bg-sticky-green", iconBg: "bg-emerald-200", iconColor: "text-emerald-600", selectedBorder: "border-primary" },
  "chemistry-edexcel": { bg: "bg-sticky-green", iconBg: "bg-emerald-200", iconColor: "text-emerald-600", selectedBorder: "border-primary" },
  "biology": { bg: "bg-sticky-green", iconBg: "bg-lime-200", iconColor: "text-lime-600", selectedBorder: "border-primary" },
  "biology-edexcel": { bg: "bg-sticky-green", iconBg: "bg-lime-200", iconColor: "text-lime-600", selectedBorder: "border-primary" },
  "geography": { bg: "bg-sticky-blue", iconBg: "bg-cyan-200", iconColor: "text-cyan-600", selectedBorder: "border-primary" },
  "history": { bg: "bg-sticky-yellow", iconBg: "bg-orange-200", iconColor: "text-orange-600", selectedBorder: "border-primary" },
};

const PracticeNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [userSubjects, setUserSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Load user subjects
  useEffect(() => {
    const loadUserSubjects = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', user.id);

      if (data && data.length > 0) {
        // Map to curriculum subjects
        const mappedSubjects = data.map(s => {
          const subjectId = s.subject_id || s.subject_name.toLowerCase().replace(/\s+/g, '-');
          const currSubject = curriculum.find(c => c.id === subjectId);
          return {
            id: subjectId,
            name: s.subject_name,
            topics: currSubject?.topics || []
          };
        });
        setUserSubjects(mappedSubjects);
      } else {
        // Default subjects from curriculum
        setUserSubjects(curriculum.slice(0, 6).map(s => ({
          id: s.id,
          name: s.name,
          topics: s.topics
        })));
      }
    };

    loadUserSubjects();
  }, [user?.id]);

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopics([]);
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartSession = () => {
    if (selectedSubject && selectedTopics.length > 0) {
      navigate(`/practice/${selectedSubject}/${selectedTopics[0]}`);
    }
  };

  const selectedSubjectData = userSubjects.find(s => s.id === selectedSubject);

  const content = (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-foreground mb-2">
          Build Your <span className="italic">Practice Set</span>
        </h1>
        <p className="text-muted-foreground">
          Customize your daily workout exactly how you want it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Choose Subject */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2 className="font-playfair text-xl font-semibold text-foreground">Choose Subject</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userSubjects.map((subject) => {
                const colors = subjectColors[subject.id] || subjectColors['mathematics'];
                const isSelected = selectedSubject === subject.id;
                
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject.id)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all text-left",
                      colors.bg,
                      isSelected ? colors.selectedBorder : "border-transparent",
                      "hover:shadow-md hover:-translate-y-0.5"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", colors.iconBg)}>
                      <span className={colors.iconColor}>
                        {subjectIcons[subject.id] || <BookOpen className="h-6 w-6" />}
                      </span>
                    </div>
                    <h3 className="font-medium text-foreground">{subject.name}</h3>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2: Select Topics */}
          {selectedSubject && selectedSubjectData && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="font-playfair text-xl font-semibold text-foreground">Select Topics</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedSubjectData.topics.slice(0, 12).map((topic: any) => {
                  const isSelected = selectedTopics.includes(topic.id);
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicToggle(topic.id)}
                      className={cn(
                        "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all",
                        isSelected
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:border-foreground"
                      )}
                    >
                      {topic.name}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Session Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-8">
            <h3 className="font-playfair text-lg font-semibold text-foreground mb-4">Session Preview</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Focus Area</span>
                <span className="font-medium text-foreground">
                  {selectedSubject ? userSubjects.find(s => s.id === selectedSubject)?.name : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Topic Scope</span>
                <span className="font-medium text-foreground">
                  {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time</span>
                <span className="font-medium text-foreground">
                  {selectedTopics.length * 10 || 0} min
                </span>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-sticky-pink border border-sticky-pink-border rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <span className="font-medium">Pro tip:</span> Focus on 2-3 topics per session for optimal learning.
                </p>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartSession}
              disabled={!selectedSubject || selectedTopics.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg rounded-xl"
            >
              Start Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Dotted grid background */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className="relative z-10">
          {content}
        </div>
        
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavItem 
            icon={<Home className="h-5 w-5" />} 
            label="Home" 
            onClick={() => navigate('/dashboard')}
          />
          <MobileNavItem 
            icon={<Target className="h-5 w-5" />} 
            label="Practice" 
            isActive={true}
            onClick={() => {}}
          />
          <MobileNavItem 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Analytics" 
            onClick={() => navigate('/analytics')}
          />
          <MobileNavItem 
            icon={<User className="h-5 w-5" />} 
            label="Profile" 
            onClick={() => navigate('/settings')}
          />
        </MobileNav>
      </div>
    );
  }

  return (
    <AppLayout>
      {content}
    </AppLayout>
  );
};

export default PracticeNew;
