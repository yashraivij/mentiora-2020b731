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
    <div className="min-h-screen bg-background">
      {/* Clean Simple Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* Centered Header with Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Smart Revision Notebook
          </h1>
          <p className="text-sm text-muted-foreground">
            Instant notes for every lost mark
          </p>
        </div>

        {/* Filter Card */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Subject
                </label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getSubjects().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Confidence
                </label>
                <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="All Confidence" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
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

        {/* Notebook Entries */}
        {sortedEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Notes Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Start practicing questions to generate your personalized revision notes
            </p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Practicing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <NotebookEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Action Button */}
        {sortedEntries.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => {
                navigate('/dashboard');
                window.scrollTo(0, 0);
              }}
              variant="outline"
              size="sm"
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