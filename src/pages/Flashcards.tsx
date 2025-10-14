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
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

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

      // Group flashcards by set_id to create distinct sets
      const setsMap = new Map<string, FlashcardSet>();
      
      data?.forEach(flashcard => {
        const setKey = flashcard.set_id || `${flashcard.subject_id}-${flashcard.exam_board}`;
        
        if (!setsMap.has(setKey)) {
          const setTitle = flashcard.title || `${flashcard.subject_id} (${flashcard.exam_board})`;
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
        .eq('set_id', setId);

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

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
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
        <main className="flex-1 p-6">
          <div className="w-full max-w-4xl mx-auto">
            <FlashcardCreator onSetCreated={handleSetCreated} />
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading your flashcard sets...</p>
              </div>
            ) : flashcardSets.length === 0 ? (
              <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-800/50 shadow-sm">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-sky-400 dark:bg-sky-600 rounded-full w-fit mx-auto mb-6 shadow-sm">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-sky-700 dark:text-sky-300">No flashcard sets yet</h3>
                  <p className="text-sky-600 dark:text-sky-400 mb-6 max-w-md mx-auto">
                    Create your first set of flashcards from your notes to start studying more effectively!
                  </p>
                  <Button onClick={() => setActiveTab("create")} size="lg" className="bg-sky-400 hover:bg-sky-500 dark:bg-sky-600 dark:hover:bg-sky-700 text-white shadow-sm hover:shadow-md">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Set
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {flashcardSets.map((set) => (
                  <div key={set.id}>
                    <Card className="mb-6 rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                      <CardHeader className="border-b border-[#E2E8F0]/30 dark:border-gray-800/50 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight mb-2">{set.title}</CardTitle>
                            <CardDescription className="text-sm font-medium text-[#64748B] dark:text-gray-400">
                              Study with flashcards for this subject
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
                        <div className="flex items-center gap-3 mt-4">
                          <Badge className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white border-0 font-bold shadow-md px-3 py-1.5">
                            {set.card_count} cards
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Created {formatDate(set.created_at)}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex gap-3 mb-6">
                          <Button
                            onClick={() => {
                              setSelectedSet(set);
                              setViewMode("flashcards");
                            }}
                            className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Cards
                          </Button>
                          <Button
                            onClick={() => setActiveTab("create")}
                            variant="outline"
                            className="border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 dark:hover:bg-[#0EA5E9]/20 font-bold rounded-xl"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New
                          </Button>
                        </div>
                        
                        {/* Individual Flashcards with Flip */}
                        <div className="space-y-4">
                          {set.flashcards.map((card, index) => {
                            const isFlipped = flippedCards.has(card.id);
                            return (
                              <div
                                key={card.id}
                                className="perspective-1000"
                                onClick={() => toggleCardFlip(card.id)}
                              >
                                <motion.div
                                  className="relative cursor-pointer"
                                  initial={false}
                                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                                  style={{ transformStyle: "preserve-3d" }}
                                >
                                  <Card className="min-h-32 border-2 border-[#E2E8F0] dark:border-gray-700 hover:border-[#0EA5E9]/50 dark:hover:border-[#0EA5E9]/50 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl">
                                    <CardContent className="p-6">
                                      <AnimatePresence mode="wait">
                                        {!isFlipped ? (
                                          <motion.div
                                            key="front"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            <Badge variant="outline" className="mb-3 font-bold text-[#0EA5E9] border-[#0EA5E9]">
                                              Question
                                            </Badge>
                                            <p className="text-base font-medium text-[#0F172A] dark:text-white leading-relaxed">
                                              {card.front}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-4 italic">
                                              Click to reveal answer
                                            </p>
                                          </motion.div>
                                        ) : (
                                          <motion.div
                                            key="back"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ transform: "rotateY(180deg)" }}
                                          >
                                            <Badge variant="outline" className="mb-3 font-bold text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400">
                                              Answer
                                            </Badge>
                                            <p className="text-base font-medium text-[#0F172A] dark:text-white leading-relaxed whitespace-pre-wrap">
                                              {card.back}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-4 italic">
                                              Click to show question
                                            </p>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Flashcards;