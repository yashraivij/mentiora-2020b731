import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Brain, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Simple Header - matches dashboard */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Title Section - matches dashboard style exactly */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Smart Revision Notebook
          </h1>
          <p className="text-lg text-muted-foreground">
            Ultra-clear, Grade 9-level notes for every mark you've lost
          </p>
        </div>

        {/* Stats Cards - clean dashboard style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Notes</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                <BlurSpan>{stats.totalEntries}</BlurSpan>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Notes created</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Saved</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                <BlurSpan>{stats.timeSavedHours}h</BlurSpan>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Study time saved</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subjects</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                <BlurSpan>{stats.subjectsWithNotes}</BlurSpan>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Subjects covered</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - clean style */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Your Notes</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48 bg-card border-border rounded-xl">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent className="bg-popover rounded-xl">
                <SelectItem value="all">All Subjects</SelectItem>
                {getSubjects().map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
              <SelectTrigger className="w-full sm:w-48 bg-card border-border rounded-xl">
                <SelectValue placeholder="All Confidence" />
              </SelectTrigger>
              <SelectContent className="bg-popover rounded-xl">
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="low">Low Confidence</SelectItem>
                <SelectItem value="medium">Medium Confidence</SelectItem>
                <SelectItem value="high">High Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notebook Entries */}
        {sortedEntries.length === 0 ? (
          <Card className="rounded-2xl text-center py-16 bg-card border border-border/50 shadow-sm">
            <CardContent>
              <div className="p-4 rounded-xl bg-primary/10 inline-flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Revision Notes Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start practicing questions to generate your personalized revision notes!
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <NotebookEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Action Button */}
        {sortedEntries.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button 
              onClick={() => {
                navigate('/dashboard');
                window.scrollTo(0, 0);
              }}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Practice More Questions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notebook;