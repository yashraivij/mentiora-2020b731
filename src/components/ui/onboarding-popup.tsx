import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Crown, 
  Star, 
  Sparkles, 
  Zap,
  ChevronRight,
  Check,
  Lock,
  Trophy,
  Brain,
  Target,
  Timer,
  Award,
  Rocket,
  Gem,
  Shield,
  Heart,
  Globe,
  X,
  Flame,
  Clock,
  NotebookPen,
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectsAdded: () => void;
}

interface Subject {
  id: string;
  name: string;
  examBoard: string;
  topicCount: number;
}

// Get topic counts from curriculum data
const getTopicCount = (subjectId: string): number => {
  const subject = curriculum.find(s => s.id === subjectId);
  return subject?.topics.length || 0;
};

const GCSE_SUBJECTS: Subject[] = [
  { id: 'physics-edexcel', name: 'Physics', examBoard: 'Edexcel', topicCount: getTopicCount('physics-edexcel') },
  { id: 'chemistry-edexcel', name: 'Chemistry', examBoard: 'Edexcel', topicCount: getTopicCount('chemistry-edexcel') },
  { id: 'english-language', name: 'English Language', examBoard: 'AQA', topicCount: getTopicCount('english-language') },
  { id: 'religious-studies', name: 'Religious Studies', examBoard: 'AQA', topicCount: getTopicCount('religious-studies') },
  { id: 'history', name: 'History', examBoard: 'AQA', topicCount: getTopicCount('history') },
  { id: 'english-literature', name: 'English Literature', examBoard: 'AQA', topicCount: getTopicCount('english-literature') },
  { id: 'physics', name: 'Physics', examBoard: 'AQA', topicCount: getTopicCount('physics') },
  { id: 'geography', name: 'Geography', examBoard: 'AQA', topicCount: getTopicCount('geography') },
  { id: 'geography-edexcel', name: 'Geography', examBoard: 'Edexcel', topicCount: getTopicCount('geography-edexcel') },
  { id: 'maths', name: 'Mathematics', examBoard: 'AQA', topicCount: getTopicCount('maths') },
  { id: 'maths-edexcel', name: 'Mathematics', examBoard: 'Edexcel', topicCount: getTopicCount('maths-edexcel') },
  { id: 'business-edexcel-igcse', name: 'Business', examBoard: 'Edexcel IGCSE', topicCount: getTopicCount('business-edexcel-igcse') },
  { id: 'biology', name: 'Biology', examBoard: 'AQA', topicCount: getTopicCount('biology') },
  { id: 'chemistry', name: 'Chemistry', examBoard: 'AQA', topicCount: getTopicCount('chemistry') },
  { id: 'business', name: 'Business', examBoard: 'AQA', topicCount: getTopicCount('business') },
  { id: 'combined-science-aqa', name: 'Combined Science', examBoard: 'AQA', topicCount: getTopicCount('combined-science-aqa') },
  { id: 'edexcel-english-language', name: 'English Language', examBoard: 'Edexcel', topicCount: getTopicCount('edexcel-english-language') },
  { id: 'music-eduqas-gcse', name: 'Music', examBoard: 'Eduqas', topicCount: getTopicCount('music-eduqas-gcse') },
];

const ALEVEL_SUBJECTS: Subject[] = [
  { id: 'psychology-aqa-alevel', name: 'Psychology', examBoard: 'AQA', topicCount: getTopicCount('psychology-aqa-alevel') },
];

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [revisionStruggles, setRevisionStruggles] = useState<string[]>([]);
  const [revisionMethods, setRevisionMethods] = useState<string[]>([]);
  const [showParentProgress, setShowParentProgress] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'gcse' | 'alevel'>('gcse');
  
  const { openPaymentLink } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleStruggleToggle = (struggle: string) => {
    setRevisionStruggles(prev => 
      prev.includes(struggle) 
        ? prev.filter(s => s !== struggle)
        : [...prev, struggle]
    );
  };

  const handleMethodToggle = (method: string) => {
    setRevisionMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const addSubjectsToDatabase = async () => {
    if (selectedSubjects.length === 0) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Convert subjects to the format expected by the database
      const subjectEntries = selectedSubjects.flatMap(subjectId => {
        const allSubjects = [...GCSE_SUBJECTS, ...ALEVEL_SUBJECTS];
        const subject = allSubjects.find(s => s.id === subjectId);
        
        // Special handling for Geography - create separate entries for Paper 1 and Paper 2
        if (subjectId === 'geography') {
          return [
            {
              user_id: user.id,
              subject_name: 'Geography Paper 1',
              exam_board: subject?.examBoard || 'AQA',
              predicted_grade: 'Not Set',
              target_grade: null,
              priority_level: 3
            },
            {
              user_id: user.id,
              subject_name: 'Geography Paper 2',
              exam_board: subject?.examBoard || 'AQA',
              predicted_grade: 'Not Set',
              target_grade: null,
              priority_level: 3
            }
          ];
        }
        
        return {
          user_id: user.id,
          subject_name: subject?.name || subjectId,
          exam_board: subject?.examBoard || 'AQA',
          predicted_grade: 'Not Set',
          target_grade: null,
          priority_level: 3
        };
      });

      const { error } = await supabase
        .from('user_subjects')
        .insert(subjectEntries);

      if (error) {
        console.error('Error adding subjects:', error);
        toast({
          title: "Error",
          description: "Failed to add subjects. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success! 🎉",
          description: `Added ${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''} to your list`,
        });
        // Don't call onSubjectsAdded() here - it should only be called when onboarding is complete
      }
    } catch (error) {
      console.error('Error adding subjects:', error);
      toast({
        title: "Error",
        description: "Failed to add subjects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    if (currentStep === 1 && selectedSubjects.length > 0) {
      await addSubjectsToDatabase();
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const saveParentEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ parent_email: parentEmail })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving parent email:', error);
        toast({
          title: "Error",
          description: "Failed to save parent email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving parent email:', error);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
    onSubjectsAdded(); // Call when user upgrades
    onClose();
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-hidden p-0 bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 rounded-3xl shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20">
        {/* Header */}
        <div className="relative p-6 border-b border-[#E2E8F0]/50 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Welcome to Mentiora!
              </h2>
              <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 font-light">
                Let's personalize your learning experience
              </p>
              {/* Progress indicator */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm font-medium text-[#64748B] dark:text-gray-400">Step {currentStep} of 4</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-2 w-12 rounded-full transition-all duration-500 ${
                        step <= currentStep 
                          ? 'bg-[#0EA5E9]' 
                          : 'bg-[#E2E8F0] dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Subject Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                    What exams are you taking? 📚
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-gray-400">
                    Select all the subjects you're studying - we'll add them to your dashboard
                  </p>
                </div>

                <Tabs value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as 'gcse' | 'alevel')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F1F5F9] dark:bg-gray-800 p-1 h-12 rounded-xl">
                    <TabsTrigger 
                      value="gcse"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#0F172A] dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748B] dark:text-gray-400 font-semibold rounded-lg transition-all duration-200"
                    >
                      GCSE Subjects
                    </TabsTrigger>
                    <TabsTrigger 
                      value="alevel"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#0F172A] dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748B] dark:text-gray-400 font-semibold rounded-lg transition-all duration-200"
                    >
                      A-Level Subjects
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gcse" className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        const subjectEmojis: { [key: string]: string } = {
                          "Physics": "⚛️",
                          "Chemistry": "🧪",
                          "Biology": "🔬",
                          "Combined Science": "🔬",
                          "Mathematics": "🔢",
                          "Statistics": "📊",
                          "English Language": "✍️",
                          "English Literature": "📖",
                          "Geography": "🌍",
                          "History": "🕰️",
                          "Religious Studies": "⛪",
                          "Business": "💼",
                          "Computer Science": "💻",
                          "Psychology": "🧠",
                          "Music": "🎵",
                        };

                        // Group subjects by base name
                        const groupedSubjects = new Map<string, Subject[]>();
                        GCSE_SUBJECTS.forEach(subject => {
                          let baseName = subject.name;
                          if (!groupedSubjects.has(baseName)) {
                            groupedSubjects.set(baseName, []);
                          }
                          groupedSubjects.get(baseName)!.push(subject);
                        });

                        return Array.from(groupedSubjects.entries()).map(([baseName, subjects]) => {
                          const emoji = subjectEmojis[baseName] || "📚";
                          const isSelected = subjects.some(s => selectedSubjects.includes(s.id));
                          
                          return (
                            <motion.div
                              key={baseName}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card 
                                className={`cursor-pointer rounded-3xl transition-all duration-300 ${
                                  isSelected
                                    ? 'border-2 border-[#0EA5E9] bg-[#0EA5E9]/5 dark:bg-[#0EA5E9]/10 shadow-[0_8px_24px_rgba(14,165,233,0.15)]'
                                    : 'border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900'
                                }`}
                                onClick={() => {
                                  // Toggle all subjects in this group
                                  const allSelected = subjects.every(s => selectedSubjects.includes(s.id));
                                  if (allSelected) {
                                    setSelectedSubjects(prev => prev.filter(id => !subjects.some(s => s.id === id)));
                                  } else {
                                    // Add the first subject from the group (default)
                                    setSelectedSubjects(prev => [...prev.filter(id => !subjects.some(s => s.id === id)), subjects[0].id]);
                                  }
                                }}
                              >
                                <CardContent className="p-5">
                                  <div className="flex items-center space-x-4">
                                    <div className="text-4xl">{emoji}</div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mobile-text-wrap tracking-tight">
                                        {baseName}
                                      </h3>
                                      <p className="text-sm text-[#64748B] dark:text-gray-400 mobile-text-wrap flex items-center gap-1.5 mt-0.5">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        {subjects.length > 1 ? `${subjects.length} exam boards available` : `1 exam board available`}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <ChevronRight className="h-5 w-5 text-[#0EA5E9] group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        });
                      })()}
                    </div>
                  </TabsContent>

                  <TabsContent value="alevel" className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        const subjectEmojis: { [key: string]: string } = {
                          "Psychology": "🧠",
                        };

                        // Group subjects by base name
                        const groupedSubjects = new Map<string, Subject[]>();
                        ALEVEL_SUBJECTS.forEach(subject => {
                          let baseName = subject.name;
                          if (!groupedSubjects.has(baseName)) {
                            groupedSubjects.set(baseName, []);
                          }
                          groupedSubjects.get(baseName)!.push(subject);
                        });

                        return Array.from(groupedSubjects.entries()).map(([baseName, subjects]) => {
                          const emoji = subjectEmojis[baseName] || "📚";
                          const isSelected = subjects.some(s => selectedSubjects.includes(s.id));
                          
                          return (
                            <motion.div
                              key={baseName}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card 
                                className={`cursor-pointer rounded-3xl transition-all duration-300 ${
                                  isSelected
                                    ? 'border-2 border-[#0EA5E9] bg-[#0EA5E9]/5 dark:bg-[#0EA5E9]/10 shadow-[0_8px_24px_rgba(14,165,233,0.15)]'
                                    : 'border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900'
                                }`}
                                onClick={() => {
                                  // Toggle all subjects in this group
                                  const allSelected = subjects.every(s => selectedSubjects.includes(s.id));
                                  if (allSelected) {
                                    setSelectedSubjects(prev => prev.filter(id => !subjects.some(s => s.id === id)));
                                  } else {
                                    // Add the first subject from the group (default)
                                    setSelectedSubjects(prev => [...prev.filter(id => !subjects.some(s => s.id === id)), subjects[0].id]);
                                  }
                                }}
                              >
                                <CardContent className="p-5">
                                  <div className="flex items-center space-x-4">
                                    <div className="text-4xl">{emoji}</div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mobile-text-wrap tracking-tight">
                                        {baseName}
                                      </h3>
                                      <p className="text-sm text-[#64748B] dark:text-gray-400 mobile-text-wrap flex items-center gap-1.5 mt-0.5">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        {subjects.length > 1 ? `${subjects.length} exam boards available` : `1 exam board available`}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <ChevronRight className="h-5 w-5 text-[#0EA5E9] group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        });
                      })()}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] dark:border-gray-700 mt-6">
                  <div>
                    <p className="font-bold text-lg text-[#0F172A] dark:text-white">
                      {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected ✨
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext} 
                    disabled={selectedSubjects.length === 0 || isLoading}
                    className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 h-12"
                  >
                    {isLoading ? (
                      <>
                        <Star className="h-4 w-4 mr-2 animate-spin" />
                        Adding subjects...
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Revision Struggles */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                    What's your biggest struggle with revision? 🤔
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-gray-400">
                    We'll personalize your experience based on your challenges
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { text: 'Staying motivated', icon: Flame, color: 'from-pink-400 to-rose-400', bg: 'from-pink-50 to-rose-50' },
                    { text: 'Knowing what to revise', icon: Brain, color: 'from-green-400 to-emerald-400', bg: 'from-green-50 to-emerald-50' },
                    { text: 'Running out of time', icon: Clock, color: 'from-orange-400 to-red-400', bg: 'from-orange-50 to-red-50' },
                    { text: 'Understanding content', icon: BookOpen, color: 'from-blue-400 to-indigo-400', bg: 'from-blue-50 to-indigo-50' }
                  ].map((struggle, index) => {
                    const StruggleIcon = struggle.icon;
                    return (
                      <motion.div
                        key={struggle.text}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 rounded-3xl h-40 ${
                            revisionStruggles.includes(struggle.text)
                              ? 'border-2 border-[#0EA5E9] bg-[#0EA5E9]/5 dark:bg-[#0EA5E9]/10 shadow-[0_8px_24px_rgba(14,165,233,0.15)]'
                              : 'border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900'
                          }`}
                          onClick={() => handleStruggleToggle(struggle.text)}
                        >
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className={`p-3 rounded-2xl mb-3 bg-gradient-to-r ${struggle.color} shadow-lg`}>
                              <StruggleIcon className="h-6 w-6 text-white" />
                            </div>
                            <p className="font-bold text-sm text-[#0F172A] dark:text-white">{struggle.text}</p>
                            {revisionStruggles.includes(struggle.text) && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-[#0EA5E9] rounded-full p-1 shadow-lg">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] dark:border-gray-700 mt-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(1)} 
                    className="px-6 hover:bg-[#F1F5F9] dark:hover:bg-gray-700 text-[#64748B] dark:text-gray-400"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={revisionStruggles.length === 0}
                    className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <span>Continue Journey</span>
                      <span>✨</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Revision Methods */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                    How do you usually revise? 📖
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-gray-400">
                    We'll optimize your learning experience for your preferred methods
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { text: 'Flashcards', icon: Star, color: 'from-yellow-400 to-orange-400', bg: 'from-yellow-50 to-orange-50' },
                    { text: 'Practice questions', icon: NotebookPen, color: 'from-purple-400 to-pink-400', bg: 'from-purple-50 to-pink-50' },
                    { text: 'Reading notes', icon: BookOpen, color: 'from-green-400 to-teal-400', bg: 'from-green-50 to-teal-50' },
                    { text: 'Watching videos', icon: TrendingUp, color: 'from-blue-400 to-cyan-400', bg: 'from-blue-50 to-cyan-50' }
                  ].map((method, index) => {
                    const MethodIcon = method.icon;
                    return (
                      <motion.div
                        key={method.text}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 rounded-3xl h-40 ${
                            revisionMethods.includes(method.text)
                              ? 'border-2 border-[#0EA5E9] bg-[#0EA5E9]/5 dark:bg-[#0EA5E9]/10 shadow-[0_8px_24px_rgba(14,165,233,0.15)]'
                              : 'border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900'
                          }`}
                          onClick={() => handleMethodToggle(method.text)}
                        >
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className={`p-3 rounded-2xl mb-3 bg-gradient-to-r ${method.color} shadow-lg`}>
                              <MethodIcon className="h-6 w-6 text-white" />
                            </div>
                            <p className="font-bold text-sm text-[#0F172A] dark:text-white">{method.text}</p>
                            {revisionMethods.includes(method.text) && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-[#0EA5E9] rounded-full p-1 shadow-lg">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] dark:border-gray-700 mt-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(2)} 
                    className="px-6 hover:bg-[#F1F5F9] dark:hover:bg-gray-700 text-[#64748B] dark:text-gray-400"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={revisionMethods.length === 0}
                    className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <span>Almost Done!</span>
                      <span>🎯</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Parent Progress Sharing */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                    Would you like us to share your progress? 👨‍👩‍👧‍👦
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-gray-400">
                    Keep your parent/guardian informed about your academic journey
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <Card 
                    className={`cursor-pointer transition-all duration-300 rounded-3xl ${
                      showParentProgress 
                        ? 'border-2 border-[#0EA5E9] bg-[#0EA5E9]/5 dark:bg-[#0EA5E9]/10 shadow-[0_8px_24px_rgba(14,165,233,0.15)]' 
                        : 'border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900'
                    }`}
                    onClick={() => setShowParentProgress(!showParentProgress)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] p-4 rounded-3xl shadow-lg mr-4">
                          <User className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-2xl font-bold text-[#0F172A] dark:text-white">Share with Parent/Guardian</h4>
                          <p className="text-sm text-[#64748B] dark:text-gray-400">Keep them updated on your progress</p>
                        </div>
                        <div className="ml-auto">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showParentProgress ? 'bg-[#0EA5E9] border-[#0EA5E9]' : 'border-[#64748B]'
                          }`}>
                            {showParentProgress && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#64748B] dark:text-gray-400">
                        We'll send them weekly progress reports including your study streaks, 
                        grade predictions, and achievements. You can change this anytime in settings.
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Parent Email Input - Show when opted in */}
                  {showParentProgress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <Card className="border-2 border-[#0EA5E9] bg-[#0EA5E9]/5 dark:bg-[#0EA5E9]/10 rounded-xl shadow-md">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <Label 
                              htmlFor="parentEmail" 
                              className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2"
                            >
                              <User className="h-4 w-4 text-[#0EA5E9]" />
                              Parent/Guardian Email Address *
                            </Label>
                            <Input
                              id="parentEmail"
                              type="email"
                              value={parentEmail}
                              onChange={(e) => setParentEmail(e.target.value)}
                              placeholder="parent@example.com"
                              className="text-base p-3 rounded-lg border-2 border-[#0EA5E9]/30 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10"
                              required
                            />
                            <p className="text-xs text-[#64748B] dark:text-gray-400 italic">
                              Weekly progress reports with study statistics and achievements.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] dark:border-gray-700 mt-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(3)} 
                    className="px-6 hover:bg-[#F1F5F9] dark:hover:bg-gray-700 text-[#64748B] dark:text-gray-400"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      if (showParentProgress && parentEmail) {
                        saveParentEmail();
                      }
                      onSubjectsAdded(); // Complete onboarding
                      onClose();
                    }}
                    disabled={showParentProgress && (!parentEmail.trim() || !isValidEmail(parentEmail))}
                    className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12"
                  >
                    <div className="flex items-center gap-2">
                      <span>Complete Setup!</span>
                      <span>🎉</span>
                      <Check className="h-4 w-4" />
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
