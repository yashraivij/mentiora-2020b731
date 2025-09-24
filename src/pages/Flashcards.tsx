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
        <header className="bg-card border-b border-border p-4 flex justify-between items-center">
          <img src={mentioraLogo} alt="Mentiora" className="h-8" />
          <ThemeToggle />
        </header>

        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="library">My Sets</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6">
              <FlashcardCreator onSetCreated={handleSetCreated} />
            </TabsContent>

            <TabsContent value="library" className="mt-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading flashcards...</p>
                  </div>
                ) : flashcardSets.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No flashcard sets yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first set to get started!</p>
                      <Button onClick={() => setActiveTab("create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Flashcards
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  flashcardSets.map((set) => (
                    <Card key={set.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{set.title}</CardTitle>
                            <CardDescription>
                              {set.card_count} cards • Created {formatDate(set.created_at)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSet(set.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
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
                            size="sm"
                            onClick={() => {
                              setSelectedSet(set);
                              setViewMode("learn");
                            }}
                            className="w-full"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Learn
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
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
      <div className="flex-1 flex flex-col">
        <header className="bg-sky-50 dark:bg-sky-900/20 border-b border-sky-200 dark:border-sky-700/50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-400 rounded-lg shadow-sm">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-sky-700 dark:text-sky-300">Flashcards</h1>
          </div>
          <p className="text-sky-600 dark:text-sky-400">Create and study with AI-generated flashcards</p>
        </header>

        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50">
              <TabsTrigger value="create" className="data-[state=active]:bg-orange-400 data-[state=active]:text-white text-orange-700 dark:text-orange-300">Create Flashcards</TabsTrigger>
              <TabsTrigger value="library" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white text-blue-700 dark:text-blue-300">My Flashcard Sets</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6">
              <FlashcardCreator onSetCreated={handleSetCreated} />
            </TabsContent>

            <TabsContent value="library" className="mt-6">
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading your flashcard sets...</p>
                  </div>
                ) : flashcardSets.length === 0 ? (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
                    <CardContent className="text-center py-12">
                      <div className="p-4 bg-blue-400 rounded-full w-fit mx-auto mb-6">
                        <Brain className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300">No flashcard sets yet</h3>
                      <p className="text-blue-600 dark:text-blue-400 mb-6 max-w-md mx-auto">
                        Create your first set of flashcards from your notes to start studying more effectively!
                      </p>
                      <Button onClick={() => setActiveTab("create")} size="lg" className="bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Set
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {flashcardSets.map((set) => (
                      <Card key={set.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-semibold">{set.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {set.card_count} cards
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSet(set.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <Badge variant="secondary" className="mb-2">
                              {set.subject_id}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              Created {formatDate(set.created_at)}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
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
                              className="w-full"
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Flashcards;