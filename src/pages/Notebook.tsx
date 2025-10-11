import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Crown, Brain, TrendingUp, Star, Filter, Calendar, Unlock } from "lucide-react";
import { motion } from "framer-motion";

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

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
        {/* Hero Section - Medly Style */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20 mb-10"
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-3 tracking-tight"
            >
              Smart Revision Notebook
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#64748B] dark:text-gray-400 font-light"
            >
              Ultra-clear, Grade 9-level notes for every mark you've lost
            </motion.p>

            {/* KPI Belt */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30 shadow-sm hover:shadow-md hover:shadow-[#0EA5E9]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                    <BookOpen className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Total Notes</span>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-3xl font-bold text-[#0F172A] dark:text-white"
                >
                  <BlurSpan>{stats.totalEntries}</BlurSpan>
                </motion.div>
                <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">Notes created</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#16A34A]/20 dark:border-[#16A34A]/30 shadow-sm hover:shadow-md hover:shadow-[#16A34A]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                    <TrendingUp className="h-5 w-5 text-[#16A34A]" />
                  </div>
                  <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Time Saved</span>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, type: "spring" }}
                  className="text-3xl font-bold text-[#0F172A] dark:text-white"
                >
                  <BlurSpan>{stats.timeSavedHours}h</BlurSpan>
                </motion.div>
                <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">Study time saved</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#A855F7]/20 dark:border-[#A855F7]/30 shadow-sm hover:shadow-md hover:shadow-[#A855F7]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#A855F7]/5">
                    <Brain className="h-5 w-5 text-[#A855F7]" />
                  </div>
                  <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Subjects</span>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-3xl font-bold text-[#0F172A] dark:text-white"
                >
                  <BlurSpan>{stats.subjectsWithNotes}</BlurSpan>
                </motion.div>
                <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">Subjects covered</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">Your Notes</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48 bg-card border-border/50 rounded-xl hover:border-[#0EA5E9]/50 transition-colors">
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
              <SelectTrigger className="w-full sm:w-48 bg-card border-border/50 rounded-xl hover:border-[#0EA5E9]/50 transition-colors">
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

        {/* Notebook Entries */}
        {sortedEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-3xl text-center py-16 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm">
              <CardContent>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 inline-flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-[#0EA5E9]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3">No Revision Notes Yet</h3>
                <p className="text-[#64748B] dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Start practicing questions to generate your personalized revision notes!
                </p>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/25 hover:shadow-xl hover:shadow-[#0EA5E9]/30 transition-all duration-300 font-medium px-6"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Practicing
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <NotebookEntry entry={entry} />
              </motion.div>
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
              className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/25 hover:shadow-xl hover:shadow-[#0EA5E9]/30 transition-all duration-300 font-medium px-6"
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