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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3DB4E8] border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-900 font-medium text-lg">Loading your Smart Revision Notebook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5FD] via-white to-white">
      {/* Premium Gradient Header */}
      <div className="bg-gradient-to-r from-[#3DB4E8] via-[#4AC3F7] to-[#5DD4FF] text-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:text-white hover:bg-white/20 transition-all duration-200 -ml-2"
            >
              <ArrowLeft className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1">
                Smart Revision Notebook
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                Ultra-clear, Grade 9-level notes for every mark you've lost
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Stats Cards with Gradient Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-16 relative z-10">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] bg-clip-text text-transparent mb-1">
                <BlurSpan>{stats.totalEntries}</BlurSpan>
              </div>
              <div className="text-sm font-medium text-gray-600">Total Notes</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] bg-clip-text text-transparent mb-1">
                <BlurSpan>{stats.timeSavedHours}h</BlurSpan>
              </div>
              <div className="text-sm font-medium text-gray-600">Time Saved</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] bg-clip-text text-transparent mb-1">
                <BlurSpan>{stats.subjectsWithNotes}</BlurSpan>
              </div>
              <div className="text-sm font-medium text-gray-600">Subjects Covered</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-5 shadow-sm border-0 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#3DB4E8]" />
              <h3 className="text-base font-semibold text-gray-900">Filter Notes</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-44 bg-white border-gray-300 hover:border-[#3DB4E8] transition-colors">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {getSubjects().map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                <SelectTrigger className="w-full sm:w-44 bg-white border-gray-300 hover:border-[#3DB4E8] transition-colors">
                  <SelectValue placeholder="All Confidence" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All Confidence</SelectItem>
                  <SelectItem value="low">Low Confidence</SelectItem>
                  <SelectItem value="medium">Medium Confidence</SelectItem>
                  <SelectItem value="high">High Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notebook Entries */}
        {sortedEntries.length === 0 ? (
          <Card className="text-center py-16 bg-white border-0 shadow-lg">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#3DB4E8]/10 to-[#5DD4FF]/10 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-[#3DB4E8]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Revision Notes Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start practicing questions to generate your personalized Smart revision notes!
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#2EA3D7] hover:to-[#4AC3F7] text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-12">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-[#3DB4E8] hover:bg-[#3DB4E8]/5 text-gray-700 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={() => {
              navigate('/dashboard');
              window.scrollTo(0, 0);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#2EA3D7] hover:to-[#4AC3F7] text-white shadow-lg hover:shadow-xl transition-all duration-200"
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