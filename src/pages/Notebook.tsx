import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NotebookEntry } from '@/components/notebook/NotebookEntry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Filter, TrendingDown, Target, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotebookEntryData {
  id: string;
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  question_id: string;
  question_label: string;
  confidence_level: 'Low' | 'Medium' | 'High';
  what_tripped_up: string;
  fix_sentence: string;
  bulletproof_notes: string[];
  mini_example?: string;
  keywords: string[];
  spec_link: string;
  next_step_suggestion: string;
  mark_loss: number;
  skill_type: string;
  bloom_level: string;
  created_at: string;
  updated_at: string;
}

export function Notebook() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<NotebookEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchNotebookEntries();
    }
  }, [user]);

  const fetchNotebookEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type assertion to ensure confidence_level is properly typed
      const typedData = (data || []).map(entry => ({
        ...entry,
        confidence_level: entry.confidence_level as 'Low' | 'Medium' | 'High'
      }));
      setEntries(typedData);
    } catch (error) {
      console.error('Error fetching notebook entries:', error);
      toast({
        title: "Error",
        description: "Failed to load notebook entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter entries based on search and filters
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.subtopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.question_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || entry.subject === selectedSubject;
    const matchesConfidence = selectedConfidence === 'all' || entry.confidence_level === selectedConfidence;
    
    return matchesSearch && matchesSubject && matchesConfidence;
  });

  // Group entries by subject
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.subject]) acc[entry.subject] = [];
    acc[entry.subject].push(entry);
    return acc;
  }, {} as Record<string, NotebookEntryData[]>);

  // Get statistics
  const totalMarksLost = entries.reduce((sum, entry) => sum + entry.mark_loss, 0);
  const lowConfidenceCount = entries.filter(e => e.confidence_level === 'Low').length;
  const uniqueTopics = new Set(entries.map(e => e.topic)).size;
  const subjects = [...new Set(entries.map(e => e.subject))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Personal Notebook</h1>
            <p className="text-muted-foreground">Your AI-generated study notes from practice questions and exams</p>
          </div>
          <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Premium
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{totalMarksLost}</p>
                  <p className="text-sm text-red-600">Total Marks Lost</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold text-amber-700">{lowConfidenceCount}</p>
                  <p className="text-sm text-amber-600">Low Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-700">{uniqueTopics}</p>
                  <p className="text-sm text-blue-600">Topics Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{entries.length}</p>
                  <p className="text-sm text-green-600">Total Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search topics, questions, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Confidence</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notebook Entries */}
        {Object.keys(groupedEntries).length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notebook entries yet</h3>
              <p className="text-muted-foreground">
                Start practicing questions or taking predicted exams to build your personal study notes!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={Object.keys(groupedEntries)[0]} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              {Object.keys(groupedEntries).map(subject => (
                <TabsTrigger key={subject} value={subject} className="flex items-center gap-2">
                  {subject}
                  <Badge variant="secondary">{groupedEntries[subject].length}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(groupedEntries).map(([subject, subjectEntries]) => (
              <TabsContent key={subject} value={subject} className="space-y-4">
                {subjectEntries.map(entry => (
                  <NotebookEntry key={entry.id} entry={entry} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}