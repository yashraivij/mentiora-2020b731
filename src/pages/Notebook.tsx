import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Crown, Brain, TrendingUp, Star, Filter, Calendar, Unlock } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { NotebookEntry } from "@/components/notebook/NotebookEntry";
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
  const { user, isPremium } = useAuth();
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
  
  const BlurSpan = ({ children }: { children: React.ReactNode }) => (
    <span className={!isPremium ? "blur-sm" : ""}>{children}</span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-foreground font-medium text-lg">Loading your Smart Revision Notebook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-[#3DB4E8]/10 via-[#3DB4E8]/5 to-transparent border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground hover:bg-[#3DB4E8]/10 transition-all duration-200 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline font-medium">Back to Dashboard</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-10 w-10 rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#3DB4E8]/70 items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Smart Revision Notebook
              </h1>
            </div>
            <div className="w-20 sm:w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
        {/* Welcome Section with Medly Gradient */}
        <div className="mb-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your Smart Revision Notes
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Ultra-clear, Grade 9-level notes for every mark you've lost
            </p>
          </div>

          {/* Stats Cards - Medly Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <Card className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3DB4E8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-7 text-center relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#3DB4E8]/20 to-[#3DB4E8]/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-7 w-7 text-[#3DB4E8]" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2"><BlurSpan>{stats.totalEntries}</BlurSpan></div>
                <div className="text-sm font-medium text-muted-foreground">Total Notes Created</div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-7 text-center relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2"><BlurSpan>{stats.timeSavedHours}h</BlurSpan></div>
                <div className="text-sm font-medium text-muted-foreground">Study Time Saved</div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-7 text-center relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2"><BlurSpan>{stats.subjectsWithNotes}</BlurSpan></div>
                <div className="text-sm font-medium text-muted-foreground">Subjects Covered</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters - Medly Style */}
          <Card className="rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#3DB4E8]" />
                  <h3 className="text-base font-semibold text-foreground">Filter Your Notes</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full sm:w-48 bg-background border-border/50 rounded-xl hover:border-[#3DB4E8]/50 transition-colors">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border/50 rounded-xl">
                      <SelectItem value="all">All Subjects</SelectItem>
                      {getSubjects().map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                    <SelectTrigger className="w-full sm:w-48 bg-background border-border/50 rounded-xl hover:border-[#3DB4E8]/50 transition-colors">
                      <SelectValue placeholder="All Confidence" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border/50 rounded-xl">
                      <SelectItem value="all">All Confidence</SelectItem>
                      <SelectItem value="low">Low Confidence</SelectItem>
                      <SelectItem value="medium">Medium Confidence</SelectItem>
                      <SelectItem value="high">High Confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notebook Entries */}
        {sortedEntries.length === 0 ? (
          <Card className="rounded-2xl text-center py-20 bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm">
            <CardContent>
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#3DB4E8]/20 to-[#3DB4E8]/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-[#3DB4E8]" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Revision Notes Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Start practicing questions to generate your personalized Smart revision notes!
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gradient-to-r from-[#3DB4E8] to-[#3DB4E8]/80 hover:from-[#3DB4E8]/90 hover:to-[#3DB4E8]/70 text-white px-8 py-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedEntries.map((entry) => (
              <NotebookEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Action Buttons - Medly Style */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-16">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 rounded-xl border-border/50 hover:border-[#3DB4E8]/50 hover:bg-[#3DB4E8]/5 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
          <Button 
            onClick={() => {
              navigate('/dashboard');
              window.scrollTo(0, 0);
            }}
            className="w-full sm:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-[#3DB4E8] to-[#3DB4E8]/80 hover:from-[#3DB4E8]/90 hover:to-[#3DB4E8]/70 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Practice More Questions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notebook;