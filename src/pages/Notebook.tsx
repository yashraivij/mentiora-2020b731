import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Crown, Brain, TrendingUp, Star, Filter, Calendar, Target } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { NotebookEntry } from "@/components/notebook/NotebookEntry";
import { PremiumPaywall } from "@/components/ui/premium-paywall";
import { toast } from "sonner";

interface NotebookEntryData {
  id: string;
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  question_label: string;
  confidence_level: string;
  what_tripped_up: string;
  fix_sentence: string;
  bulletproof_notes: string[];
  mini_example?: string;
  keywords: string[];
  spec_link: string;
  next_step_suggestion: string;
  skill_type: string;
  bloom_level: string;
  mark_loss: number;
  created_at: string;
}

const Notebook = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  
  const [entries, setEntries] = useState<NotebookEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    loadNotebookEntries();
  }, [user?.id, navigate]);

  const loadNotebookEntries = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notebook entries:', error);
        toast.error('Failed to load notebook entries');
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading notebook entries:', error);
      toast.error('Failed to load notebook entries');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (selectedSubject !== 'all' && entry.subject !== selectedSubject) return false;
    if (selectedConfidence !== 'all' && entry.confidence_level.toLowerCase() !== selectedConfidence) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        // Ensure newest entries are always at the top
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Descending order (newest first)
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'confidence':
        const confidenceOrder = { 'low': 0, 'medium': 1, 'high': 2 };
        return confidenceOrder[a.confidence_level.toLowerCase() as keyof typeof confidenceOrder] - 
               confidenceOrder[b.confidence_level.toLowerCase() as keyof typeof confidenceOrder];
      case 'marks':
        return b.mark_loss - a.mark_loss;
      default:
        // Default to newest first as well
        const defaultDateA = new Date(a.created_at).getTime();
        const defaultDateB = new Date(b.created_at).getTime();
        return defaultDateB - defaultDateA;
    }
  });

  const getSubjects = () => {
    const subjects = Array.from(new Set(entries.map(entry => entry.subject)));
    return subjects;
  };

  const getStats = () => {
    const totalEntries = entries.length;
    const totalMarksLost = entries.reduce((sum, entry) => sum + entry.mark_loss, 0);
    const lowConfidence = entries.filter(entry => entry.confidence_level.toLowerCase() === 'low').length;
    // Calculate time saved: Assume each note saves 15 minutes of manual revision time
    const timeSavedMinutes = totalEntries * 15;
    const timeSavedHours = Math.round(timeSavedMinutes / 60 * 10) / 10;
    const subjects = getSubjects();

    return { totalEntries, totalMarksLost, lowConfidence, timeSavedHours, subjectsWithNotes: subjects.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-2xl shadow-primary/10">
            <p className="text-foreground font-medium text-lg">Loading your Smart Revision Notebook...</p>
            <p className="text-muted-foreground text-sm mt-2">Preparing your AI-generated study notes</p>
          </div>
        </div>
      </div>
    );
  }

  const isPremium = subscription.subscribed;

  const handleUpgrade = () => {
    navigate('/premium');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50">
      {/* Premium Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 dark:from-violet-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Smart Revision Notebook
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Crown className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Premium AI Feature</span>
                    </div>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Auto-Generated</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Premium Welcome Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 dark:from-slate-200 dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent mb-4">
              Your AI-Generated Revision Notes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ultra-clear, Grade 9-level notes for every mark you've lost, powered by advanced AI analysis
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>

          {/* Premium Stats Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative ${!isPremium ? 'blur-sm' : ''}`}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-blue-900/50 border-blue-200/50 dark:border-blue-800/30 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-full"></div>
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent mb-1">{stats.totalEntries}</div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Notes</div>
                <div className="text-xs text-blue-500/70 dark:text-blue-400/70 mt-1">AI Generated</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-emerald-900/50 border-emerald-200/50 dark:border-emerald-800/30 shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-bl-full"></div>
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent mb-1">{stats.timeSavedHours}h</div>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Time Saved</div>
                <div className="text-xs text-emerald-500/70 dark:text-emerald-400/70 mt-1">Auto Notes</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 dark:from-violet-950/50 dark:via-purple-950/50 dark:to-violet-900/50 border-violet-200/50 dark:border-violet-800/30 shadow-xl shadow-violet-500/10 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-400/20 to-transparent rounded-bl-full"></div>
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent mb-1">{stats.subjectsWithNotes}</div>
                <div className="text-sm font-medium text-violet-600 dark:text-violet-400">Subjects</div>
                <div className="text-xs text-violet-500/70 dark:text-violet-400/70 mt-1">Covered</div>
              </CardContent>
            </Card>
            
            {/* Stats Lock Overlay for Non-Premium */}
            {!isPremium && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-sky-200 dark:border-sky-800 shadow-xl">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-sky-600" />
                  <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Premium Stats</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl shadow-black/5 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-200 dark:to-slate-300 bg-clip-text text-transparent">Revision Notes</h3>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-44 bg-white/50 dark:bg-slate-800/50 border-slate-300/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjects().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                  <SelectTrigger className="w-44 bg-white/50 dark:bg-slate-800/50 border-slate-300/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                    <SelectValue placeholder="All Confidence" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                    <SelectItem value="all">All Confidence</SelectItem>
                    <SelectItem value="low">Low Confidence</SelectItem>
                    <SelectItem value="medium">Medium Confidence</SelectItem>
                    <SelectItem value="high">High Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Notebook Entries */}
        {sortedEntries.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Revision Notes Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Start practicing questions to generate your personalized AI revision notes!
              </p>
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Enhanced Premium CTA for non-premium users */}
            {!isPremium && sortedEntries.length > 0 && (
              <div className="relative mb-8">
                {/* Premium glow effects */}
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/30 via-blue-400/30 to-indigo-400/30 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-300/20 via-blue-300/20 to-indigo-300/20 rounded-2xl blur-xl animate-[pulse_3s_ease-in-out_infinite]"></div>
                
                <Card className="relative bg-gradient-to-br from-white via-sky-50/50 to-blue-50 dark:from-slate-900 dark:via-sky-950/30 dark:to-blue-950/30 border-2 border-transparent bg-clip-padding shadow-2xl">
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-2xl animate-[spin_20s_linear_infinite]"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-br from-white via-sky-50/50 to-blue-50 dark:from-slate-900 dark:via-sky-950/30 dark:to-blue-950/30 rounded-[14px]"></div>
                  
                  {/* Premium header strip */}
                  <div className="relative bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 p-4 text-center overflow-hidden rounded-t-[14px]">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <Crown className="h-6 w-6 text-white animate-bounce" />
                      <span className="text-white font-bold text-lg">Premium Feature</span>
                      <Crown className="h-6 w-6 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </div>
                  
                  <CardContent className="relative p-10 text-center">
                    {/* Main icon with glow */}
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400 rounded-3xl blur-lg opacity-40 animate-pulse"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400 rounded-3xl flex items-center justify-center shadow-2xl">
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent mb-6 leading-tight">
                      Unlock Your Detailed<br />Revision Notes
                    </h2>
                    
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                      Get instant access to AI-powered study materials that show you exactly what went wrong and how to fix it
                    </p>
                    
                    {/* Feature grid with enhanced styling */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div className="group p-6 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/50 dark:to-sky-900/50 rounded-2xl border border-sky-200/50 dark:border-sky-800/30 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-sky-700 dark:text-sky-300 mb-2">Smart Analysis</h3>
                        <p className="text-sm text-sky-600 dark:text-sky-400">Detailed explanations of your mistakes</p>
                      </div>
                      
                      <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Worked Examples</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Step-by-step solution guides</p>
                      </div>
                      
                      <div className="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">Key Insights</h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">Essential concepts you need to master</p>
                      </div>
                    </div>
                    
                    {/* Enhanced CTA button */}
                    <Button 
                      onClick={handleUpgrade}
                      className="relative group bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 hover:from-sky-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-blue-500/30 transform hover:scale-[1.05] transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Crown className="h-6 w-6 mr-4 group-hover:animate-bounce" />
                      <span className="relative">Upgrade to Premium</span>
                    </Button>
                    
                    <p className="text-sm text-muted-foreground mt-4 opacity-75">
                      Instant access • Cancel anytime • 30-day money back guarantee
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="space-y-8">
              {sortedEntries.map((entry, index) => (
                <div key={entry.id} className="transform hover:scale-[1.02] transition-all duration-200">
                  <NotebookEntry 
                    entry={entry} 
                    isPremium={isPremium}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Premium Action Buttons */}
        <div className="flex justify-center space-x-6 mt-16">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline"
            className="px-8 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button 
            onClick={() => {
              navigate('/dashboard');
              window.scrollTo(0, 0);
            }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Practice More Questions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notebook;