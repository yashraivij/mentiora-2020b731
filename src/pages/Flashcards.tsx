import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Trophy,
  TrendingUp,
  User,
  Home,
  NotebookPen,
  CreditCard,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Brain,
  Trash2,
  Play,
  Edit,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlashcardViewer } from "@/components/flashcards/FlashcardViewer";
import { FlashcardCreator } from "@/components/flashcards/FlashcardCreator";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  subject_id: string;
  exam_board: string;
  flashcards: Flashcard[];
  created_at: string;
  card_count: number;
}

const Flashcards = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    return tab === 'library' ? 'library' : 'create';
  });
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [viewMode, setViewMode] = useState<"flashcards" | "learn" | null>(null);

  const sidebarItems = [
    { id: "learn", label: "LEARN", icon: Home, bgColor: "bg-sky-50 dark:bg-sky-900/20", textColor: "text-sky-700 dark:text-sky-300", activeColor: "bg-sky-400 dark:bg-sky-600" },
    { id: "leaderboards", label: "LEADERBOARDS", icon: Trophy, bgColor: "bg-yellow-50 dark:bg-yellow-900/20", textColor: "text-yellow-700 dark:text-yellow-300", activeColor: "bg-yellow-400 dark:bg-yellow-600" },
    { id: "progress", label: "PROGRESS", icon: TrendingUp, bgColor: "bg-green-50 dark:bg-green-900/20", textColor: "text-green-700 dark:text-green-300", activeColor: "bg-green-400 dark:bg-green-600" },
    { id: "notes", label: "NOTES", icon: NotebookPen, bgColor: "bg-blue-50 dark:bg-blue-900/20", textColor: "text-blue-700 dark:text-blue-300", activeColor: "bg-blue-400 dark:bg-blue-600" },
    { id: "flashcards", label: "FLASHCARDS", icon: Brain, bgColor: "bg-purple-50 dark:bg-purple-900/20", textColor: "text-purple-700 dark:text-purple-300", activeColor: "bg-purple-400 dark:bg-purple-600" },
    { id: "profile", label: "PROFILE", icon: User, bgColor: "bg-muted dark:bg-muted/30", textColor: "text-muted-foreground dark:text-muted-foreground/90", activeColor: "bg-primary dark:bg-primary/70" },
  ];

  const mobileNavItems = [
    { id: "learn", label: "Learn", icon: Home, href: "/dashboard" },
    { id: "leaderboards", label: "Leaderboards", icon: Trophy, href: "/dashboard?tab=leaderboards" },
    { id: "progress", label: "Progress", icon: TrendingUp, href: "/dashboard?tab=progress" },
    { id: "notes", label: "Notes", icon: NotebookPen, href: "/dashboard?tab=notes" },
    { id: "flashcards", label: "Flashcards", icon: Brain, href: "/flashcards", active: true },
    { id: "profile", label: "Profile", icon: User, href: "/dashboard?tab=profile" },
  ];

  useEffect(() => {
    loadFlashcardSets();
  }, [user]);

  const loadFlashcardSets = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading flashcard sets:', error);
        toast({
          title: "Error",
          description: "Failed to load flashcard sets",
          variant: "destructive"
        });
        return;
      }

      // Group flashcards by subject and exam board to create sets
      const setsMap = new Map<string, FlashcardSet>();
      
      data?.forEach(flashcard => {
        const setKey = `${flashcard.subject_id}-${flashcard.exam_board}`;
        const setTitle = `${flashcard.subject_id} (${flashcard.exam_board})`;
        
        if (!setsMap.has(setKey)) {
          setsMap.set(setKey, {
            id: setKey,
            title: setTitle,
            subject_id: flashcard.subject_id,
            exam_board: flashcard.exam_board,
            flashcards: [],
            created_at: flashcard.created_at || new Date().toISOString(),
            card_count: 0
          });
        }
        
        const set = setsMap.get(setKey)!;
        set.flashcards.push({
          id: flashcard.id,
          front: flashcard.front,
          back: flashcard.back
        });
        set.card_count = set.flashcards.length;
        
        // Update created_at to the earliest flashcard date
        if (flashcard.created_at && flashcard.created_at < set.created_at) {
          set.created_at = flashcard.created_at;
        }
      });

      setFlashcardSets(Array.from(setsMap.values()));
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
      toast({
        title: "Error",
        description: "Failed to load flashcard sets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetCreated = () => {
    loadFlashcardSets();
    setActiveTab("library");
    toast({
      title: "Success",
      description: "Flashcards created and saved!",
    });
  };

  const handleDeleteSet = async (setId: string) => {
    const set = flashcardSets.find(s => s.id === setId);
    if (!set) return;

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('user_id', user?.id)
        .eq('subject_id', set.subject_id)
        .eq('exam_board', set.exam_board);

      if (error) throw error;

      setFlashcardSets(sets => sets.filter(s => s.id !== setId));
      toast({
        title: "Success",
        description: "Flashcard set deleted",
      });
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      toast({
        title: "Error",
        description: "Failed to delete flashcard set",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (selectedSet && viewMode) {
    return (
      <FlashcardViewer
        flashcardSet={selectedSet}
        mode={viewMode}
        onBack={() => {
          setSelectedSet(null);
          setViewMode(null);
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-4 flex justify-between items-center shadow-sm">
          <img src={mentioraLogo} alt="Mentiora" className="h-8" />
          <ThemeToggle />
        </header>

        <div className="p-4">
          <FlashcardCreator onSetCreated={handleSetCreated} />
        </div>

        <MobileNav>
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <MobileNavItem 
                key={item.id}
                onClick={() => navigate(item.href)}
                className={item.active ? "bg-primary text-primary-foreground" : ""}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </MobileNavItem>
            );
          })}
        </MobileNav>
      </div>
    );
  }

  // Calculate stats
  const totalSets = flashcardSets.length;
  const totalCards = flashcardSets.reduce((sum, set) => sum + set.card_count, 0);
  const avgCardsPerSet = totalSets > 0 ? Math.round(totalCards / totalSets) : 0;
  
  // Get most studied subject
  const subjectCounts = flashcardSets.reduce((acc, set) => {
    acc[set.subject_id] = (acc[set.subject_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <img src={mentioraLogo} alt="Mentiora" className="h-8 mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = item.id === "flashcards";
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id !== "flashcards") {
                      window.location.href = item.id === "learn" ? "/dashboard" : `/dashboard?tab=${item.id}`;
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    isActive
                      ? `${item.activeColor} text-white font-medium`
                      : `${item.bgColor} ${item.textColor} hover:${item.activeColor} hover:text-white`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Your Flashcards</h1>
                <p className="text-muted-foreground text-lg">
                  Master your subjects with spaced repetition learning.
                </p>
              </div>
              <Button 
                onClick={() => setActiveTab("create")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Set
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Total Sets
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{totalSets}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Flashcard collections
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Total Cards
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{totalCards}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Items to study
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Avg Cards/Set
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{avgCardsPerSet}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cards per collection
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Top Subject
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold truncate">{topSubject}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Most flashcard sets
                      </p>
                    </div>
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Flashcard Sets Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Sets</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading your flashcard sets...</p>
                </div>
              ) : flashcardSets.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="text-center py-16">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-6">
                      <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">No flashcard sets yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create your first set of flashcards to start studying more effectively with spaced repetition!
                    </p>
                    <Button 
                      onClick={() => setActiveTab("create")} 
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Set
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {flashcardSets.map((set) => (
                    <Card key={set.id} className="hover-lift group">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold mb-1">{set.title}</CardTitle>
                            <CardDescription>
                              {set.card_count} cards • Created {formatDate(set.created_at)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSet(set.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge variant="secondary" className="font-medium">
                          {set.subject_id}
                        </Badge>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedSet(set);
                              setViewMode("flashcards");
                            }}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedSet(set);
                              setViewMode("learn");
                            }}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Learn
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Creator Section - Expandable */}
            {activeTab === "create" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Create New Flashcard Set</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("library")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FlashcardCreator onSetCreated={handleSetCreated} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Flashcards;