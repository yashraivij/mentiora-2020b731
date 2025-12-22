import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Target, BarChart3, User, ArrowLeft, TrendingUp, Clock, HelpCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";
import { AppLayout } from "@/components/layout/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface SubjectPerformance {
  subject: string;
  accuracy: number;
  avgTime: number;
  questions: number;
  status: 'improving' | 'stable' | 'declining';
}

const AnalyticsNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [gradeData, setGradeData] = useState<any[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.id) return;

      // Load user subjects
      const { data: subjects } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', user.id);

      // Load user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (subjects) {
        // Create performance data
        const performance: SubjectPerformance[] = subjects.map(s => {
          const subjectProgress = progress?.filter(p => 
            p.subject_id === s.subject_id || 
            p.subject_id === s.subject_name.toLowerCase().replace(/\s+/g, '-')
          ) || [];
          
          const totalAttempts = subjectProgress.reduce((sum, p) => sum + p.attempts, 0);
          const avgScore = subjectProgress.length > 0
            ? subjectProgress.reduce((sum, p) => sum + p.average_score, 0) / subjectProgress.length
            : 0;

          return {
            subject: s.subject_name,
            accuracy: Math.round(avgScore),
            avgTime: Math.floor(Math.random() * 3 + 1.5), // Mock data for now
            questions: totalAttempts,
            status: avgScore > 70 ? 'improving' : avgScore > 50 ? 'stable' : 'declining'
          };
        });

        setSubjectPerformance(performance);

        // Create grade chart data
        const chartData = subjects.map(s => ({
          name: s.subject_name.length > 10 ? s.subject_name.substring(0, 10) + '...' : s.subject_name,
          current: parseInt(s.predicted_grade) || 5,
          target: parseInt(s.target_grade) || 7
        }));
        setGradeData(chartData);
      }
    };

    loadAnalytics();
  }, [user?.id]);

  // Default data if no subjects
  useEffect(() => {
    if (subjectPerformance.length === 0) {
      setSubjectPerformance([
        { subject: 'Mathematics', accuracy: 78, avgTime: 2.3, questions: 145, status: 'improving' },
        { subject: 'English Language', accuracy: 65, avgTime: 3.1, questions: 89, status: 'stable' },
        { subject: 'Physics', accuracy: 82, avgTime: 2.8, questions: 112, status: 'improving' },
        { subject: 'Chemistry', accuracy: 71, avgTime: 2.5, questions: 98, status: 'declining' },
      ]);
      setGradeData([
        { name: 'Maths', current: 6, target: 8 },
        { name: 'English', current: 5, target: 7 },
        { name: 'Physics', current: 7, target: 8 },
        { name: 'Chemistry', current: 6, target: 7 },
      ]);
    }
  }, [subjectPerformance.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-emerald-600 bg-emerald-100';
      case 'stable': return 'text-amber-600 bg-amber-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'improving': return <TrendingUp className="h-4 w-4" />;
      case 'stable': return <Check className="h-4 w-4" />;
      case 'declining': return <TrendingUp className="h-4 w-4 rotate-180" />;
      default: return null;
    }
  };

  const content = (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-foreground">
              Performance <span className="italic">Analytics</span>
            </h1>
            <p className="text-muted-foreground">
              Track your progress and identify areas for improvement
            </p>
          </div>
        </div>
      </div>

      {/* Grade Predictions Chart */}
      <section className="mb-10">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-playfair text-xl font-semibold text-foreground mb-6">
            Grade <span className="italic">Predictions</span>
          </h2>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 9]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  name="Current Grade"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Grade"
                  stroke="hsl(220, 90%, 56%)" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(220, 90%, 56%)', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Subject Breakdown Table */}
      <section>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-playfair text-xl font-semibold text-foreground">
              Subject <span className="italic">Breakdown</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Accuracy</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Avg Time</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Questions</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjectPerformance.map((item, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{item.subject}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        item.accuracy >= 70 ? "bg-emerald-100 text-emerald-700" :
                        item.accuracy >= 50 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {item.accuracy}%
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.avgTime} min</td>
                    <td className="p-4 text-muted-foreground">{item.questions}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize",
                        getStatusColor(item.status)
                      )}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
            onClick={() => navigate('/subject/maths-edexcel')}
          />
          <MobileNavItem 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Analytics" 
            isActive={true}
            onClick={() => {}}
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

export default AnalyticsNew;
