import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, BookOpen, Atom, FlaskConical, Globe, Clock, PenTool, Microscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";
import { AppLayout } from "@/components/layout/AppLayout";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { StudyPlanCard } from "@/components/dashboard/StudyPlanCard";
import { PredictedGradesGrid } from "@/components/dashboard/PredictedGradesGrid";
import { RankingCard } from "@/components/dashboard/RankingCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";
import { Home, Target, BarChart3, User } from "lucide-react";

const subjectIcons: Record<string, React.ReactNode> = {
  "maths-edexcel": <Calculator className="h-5 w-5" />,
  "mathematics": <Calculator className="h-5 w-5" />,
  "maths-aqa-alevel": <Calculator className="h-5 w-5" />,
  "english-language": <PenTool className="h-5 w-5" />,
  "english-literature": <BookOpen className="h-5 w-5" />,
  "physics": <Atom className="h-5 w-5" />,
  "physics-edexcel": <Atom className="h-5 w-5" />,
  "chemistry": <FlaskConical className="h-5 w-5" />,
  "chemistry-edexcel": <FlaskConical className="h-5 w-5" />,
  "biology": <Microscope className="h-5 w-5" />,
  "biology-edexcel": <Microscope className="h-5 w-5" />,
  "biology-aqa-alevel": <Microscope className="h-5 w-5" />,
  "geography": <Globe className="h-5 w-5" />,
  "history": <Clock className="h-5 w-5" />,
};

const subjectVariants: Record<string, 'yellow' | 'pink' | 'green' | 'blue' | 'purple'> = {
  "maths-edexcel": "yellow",
  "mathematics": "yellow",
  "maths-aqa-alevel": "yellow",
  "english-language": "pink",
  "english-literature": "pink",
  "physics": "blue",
  "physics-edexcel": "blue",
  "chemistry": "green",
  "chemistry-edexcel": "green",
  "biology": "green",
  "biology-edexcel": "green",
  "biology-aqa-alevel": "green",
  "geography": "blue",
  "history": "purple",
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [userSubjects, setUserSubjects] = useState<any[]>([]);
  const [predictedGrades, setPredictedGrades] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  // Get day name
  const getDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserName(profile.first_name || profile.full_name?.split(' ')[0] || 'Student');
      }

      // Load streak
      const { data: streakData } = await supabase.rpc('get_user_streak', { user_uuid: user.id });
      setCurrentStreak(streakData || 0);

      // Load user subjects
      const { data: subjects } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (subjects) {
        setUserSubjects(subjects);
        
        // Create predicted grades from subjects
        const grades = subjects.map(s => ({
          id: s.subject_id || s.subject_name.toLowerCase().replace(/\s+/g, '-'),
          name: s.subject_name,
          currentGrade: s.predicted_grade || '5',
          targetGrade: s.target_grade || '7',
          trend: 'up' as const,
          improvement: '+1 grade'
        }));
        setPredictedGrades(grades);
      }

      // Load progress for each subject
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('subject_id, average_score')
        .eq('user_id', user.id);

      if (progressData) {
        const progressMap: Record<string, number> = {};
        progressData.forEach(p => {
          if (!progressMap[p.subject_id]) {
            progressMap[p.subject_id] = 0;
          }
          progressMap[p.subject_id] = Math.max(progressMap[p.subject_id], p.average_score);
        });
        setUserProgress(progressMap);
      }
    };

    loadUserData();
  }, [user?.id]);

  // Get next topic for a subject
  const getNextTopic = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId || s.name.toLowerCase().replace(/\s+/g, '-') === subjectId);
    if (subject && subject.topics.length > 0) {
      return subject.topics[0].name;
    }
    return "Getting Started";
  };

  // Get subject ID from user subject
  const getSubjectId = (userSubject: any) => {
    if (userSubject.subject_id) return userSubject.subject_id;
    
    const name = userSubject.subject_name.toLowerCase();
    if (name.includes('math')) return 'maths-edexcel';
    if (name.includes('english') && name.includes('lang')) return 'english-language';
    if (name.includes('english') && name.includes('lit')) return 'english-literature';
    if (name.includes('physics')) return 'physics-edexcel';
    if (name.includes('chemistry')) return 'chemistry-edexcel';
    if (name.includes('biology')) return 'biology-edexcel';
    if (name.includes('geography')) return 'geography';
    if (name.includes('history')) return 'history';
    
    return name.replace(/\s+/g, '-');
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
  };

  const content = (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-foreground mb-2">
          Welcome back, <span className="italic">{userName}!</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Happy {getDayName()}! Let's make this week count.
        </p>
        
        {/* Streak Tracker */}
        <StreakTracker currentStreak={currentStreak} />
      </div>

      {/* Today's Study Plan */}
      <section className="mb-10">
        <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">
          Today's <span className="italic">Study Plan</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userSubjects.slice(0, 3).map((subject, index) => {
            const subjectId = getSubjectId(subject);
            const variants: ('yellow' | 'pink' | 'green')[] = ['yellow', 'pink', 'green'];
            const variant = subjectVariants[subjectId] || variants[index % 3];
            
            return (
              <StudyPlanCard
                key={subject.id || index}
                subject={subject.subject_name}
                icon={subjectIcons[subjectId] || <BookOpen className="h-5 w-5" />}
                topic={getNextTopic(subjectId)}
                duration="30 min"
                progress={userProgress[subjectId] || Math.floor(Math.random() * 40 + 20)}
                variant={variant}
                onClick={() => handleSubjectClick(subjectId)}
              />
            );
          })}
          
          {userSubjects.length === 0 && (
            <>
              <StudyPlanCard
                subject="Mathematics"
                icon={<Calculator className="h-5 w-5" />}
                topic="Quadratic Equations"
                duration="30 min"
                progress={45}
                variant="yellow"
                onClick={() => navigate('/subject/maths-edexcel')}
              />
              <StudyPlanCard
                subject="English"
                icon={<BookOpen className="h-5 w-5" />}
                topic="Poetry Analysis"
                duration="25 min"
                progress={32}
                variant="pink"
                onClick={() => navigate('/subject/english-language')}
              />
              <StudyPlanCard
                subject="Science"
                icon={<Atom className="h-5 w-5" />}
                topic="Forces & Motion"
                duration="35 min"
                progress={58}
                variant="green"
                onClick={() => navigate('/subject/physics-edexcel')}
              />
            </>
          )}
        </div>
      </section>

      {/* Predicted Grades & Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictedGradesGrid 
            subjects={predictedGrades.length > 0 ? predictedGrades : [
              { id: 'maths', name: 'Mathematics', currentGrade: '6', targetGrade: '8', trend: 'up' as const, improvement: '+1 grade' },
              { id: 'english', name: 'English Language', currentGrade: '5', targetGrade: '7', trend: 'up' as const, improvement: '+2 grades' },
              { id: 'physics', name: 'Physics', currentGrade: '7', targetGrade: '8', trend: 'stable' as const },
              { id: 'chemistry', name: 'Chemistry', currentGrade: '6', targetGrade: '7', trend: 'up' as const, improvement: '+1 grade' },
            ]}
            onSubjectClick={handleSubjectClick}
          />
        </div>
        
        <div>
          <RankingCard percentage={15} subject="Mathematics" />
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
            isActive={true}
            onClick={() => {}}
          />
          <MobileNavItem 
            icon={<Target className="h-5 w-5" />} 
            label="Practice" 
            onClick={() => navigate('/subject/maths-edexcel')}
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

export default Dashboard;
