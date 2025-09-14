import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  Infinity,
  X,
  type LucideIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectsAdded: () => void;
}

interface Subject {
  id: string;
  name: string;
  examBoard: string;
}

const AVAILABLE_SUBJECTS: Subject[] = [
  { id: 'physics-edexcel', name: 'Physics', examBoard: 'Edexcel' },
  { id: 'chemistry-edexcel', name: 'Chemistry', examBoard: 'Edexcel' },
  { id: 'english-language', name: 'English Language', examBoard: 'AQA' },
  { id: 'religious-studies', name: 'Religious Studies', examBoard: 'AQA' },
  { id: 'history', name: 'History', examBoard: 'AQA' },
  { id: 'english-literature', name: 'English Literature', examBoard: 'AQA' },
  { id: 'physics', name: 'Physics', examBoard: 'AQA' },
  { id: 'geography', name: 'Geography', examBoard: 'AQA' },
  { id: 'geography-paper-2', name: 'Geography Paper 2', examBoard: 'AQA' },
  { id: 'maths', name: 'Mathematics', examBoard: 'AQA' },
  { id: 'maths-edexcel', name: 'Mathematics', examBoard: 'Edexcel' },
  { id: 'business-edexcel-igcse', name: 'Business', examBoard: 'Edexcel IGCSE' },
  { id: 'biology', name: 'Biology', examBoard: 'AQA' },
  { id: 'chemistry', name: 'Chemistry', examBoard: 'AQA' },
  { id: 'business', name: 'Business', examBoard: 'AQA' },
  { id: 'combined-science-aqa', name: 'Combined Science', examBoard: 'AQA' },
  { id: 'edexcel-english-language', name: 'English Language', examBoard: 'Edexcel' },
];

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [revisionStruggles, setRevisionStruggles] = useState<string[]>([]);
  const [revisionMethods, setRevisionMethods] = useState<string[]>([]);
  const [showParentProgress, setShowParentProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { openPaymentLink } = useSubscription();
  const { toast } = useToast();

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
      const subjectEntries = selectedSubjects.map(subjectId => {
        const subject = AVAILABLE_SUBJECTS.find(s => s.id === subjectId);
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
        onSubjectsAdded();
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

  const handleNext = async () => {
    if (currentStep === 1 && selectedSubjects.length > 0) {
      await addSubjectsToDatabase();
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleUpgrade = () => {
    openPaymentLink();
    onClose();
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const floatingIcons: LucideIcon[] = [Star, Sparkles, Crown, Trophy, Zap, Rocket, Gem];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-0">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/10 via-transparent to-pink-500/10" />
        
        {/* Dynamic floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(35)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const colors = ['text-violet-400', 'text-fuchsia-400', 'text-cyan-400', 'text-emerald-400', 'text-orange-400', 'text-pink-400', 'text-yellow-400'];
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-30, -60, -30],
                  x: [-10, 10, -10],
                  opacity: [0.2, 0.9, 0.2],
                  scale: [0.3, 1.2, 0.3],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              >
                <IconComponent className={`h-3 w-3 ${colors[i % colors.length]} drop-shadow-lg`} />
              </motion.div>
            );
          })}
        </div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 via-fuchsia-500 via-pink-500 to-orange-500 p-0.5 animate-pulse">
          <div className="h-full w-full rounded-lg bg-background/95" />
        </div>

        <DialogHeader className="relative z-10 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-2xl shadow-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <div>
                <DialogTitle className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to Mentiora! 👋
                </DialogTitle>
                <DialogDescription className="text-xl text-muted-foreground font-medium">
                  Let's personalize your <span className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">premium</span> learning experience
                </DialogDescription>
              </div>
            </div>
            
            {/* Enhanced progress indicator */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of 5</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <motion.div
                    key={step}
                    className={`h-3 w-12 rounded-full transition-all duration-500 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg' 
                        : 'bg-muted/50'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: step === currentStep ? 1.1 : 1,
                      boxShadow: step === currentStep ? '0 0 20px rgba(139, 92, 246, 0.5)' : '0 0 0px rgba(139, 92, 246, 0)'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="relative z-10 flex-1 overflow-hidden">
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
                className="space-y-6"
              >
                <div className="text-center space-y-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <h3 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      What exams are you taking? 📚
                    </h3>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                    </div>
                  </motion.div>
                  <p className="text-lg text-muted-foreground font-medium">
                    Select all the subjects you're studying - we'll add them to your dashboard instantly!
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
                  {AVAILABLE_SUBJECTS.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: selectedSubjects.includes(subject.id) ? 0 : 1
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                          selectedSubjects.includes(subject.id)
                            ? 'ring-2 ring-violet-500 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-fuchsia-500/20 shadow-lg shadow-violet-500/25'
                            : 'hover:bg-gradient-to-br hover:from-violet-50 hover:to-fuchsia-50 dark:hover:from-violet-950/20 dark:hover:to-fuchsia-950/20 hover:shadow-md'
                        }`}
                        onClick={() => handleSubjectToggle(subject.id)}
                      >
                        {selectedSubjects.includes(subject.id) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 animate-pulse" />
                        )}
                        
                        <CardContent className="p-5">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Checkbox 
                                checked={selectedSubjects.includes(subject.id)}
                                onChange={() => {}}
                                className="pointer-events-none"
                              />
                              {selectedSubjects.includes(subject.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1"
                                >
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                </motion.div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{subject.name}</p>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs mt-1 ${
                                  selectedSubjects.includes(subject.id)
                                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                                    : ''
                                }`}
                              >
                                {subject.examBoard}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gradient-to-r from-violet-200 to-fuchsia-200">
                  <motion.div
                    animate={{ 
                      scale: selectedSubjects.length > 0 ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      ✨ {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleNext} 
                      disabled={selectedSubjects.length === 0 || isLoading}
                      className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold px-8 py-3 text-lg shadow-lg shadow-violet-500/25 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <Sparkles className="h-4 w-4 mr-2" />
                          </motion.div>
                          Adding subjects...
                        </>
                      ) : (
                        <>
                          Continue Magic ✨
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
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
                className="space-y-6"
              >
                <div className="text-center space-y-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <h3 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                      What's your biggest struggle? 🤔
                    </h3>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Brain className="h-6 w-6 text-rose-400 animate-pulse" />
                    </div>
                  </motion.div>
                  <p className="text-lg text-muted-foreground font-medium">
                    Help us understand your challenges so we can <span className="font-bold text-rose-600">supercharge</span> your revision!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { text: "Staying motivated", icon: TrendingUp, gradient: "from-rose-500 to-pink-500", bg: "from-rose-500/20 to-pink-500/20" },
                    { text: "Knowing what to revise", icon: BookOpen, gradient: "from-emerald-500 to-teal-500", bg: "from-emerald-500/20 to-teal-500/20" },
                    { text: "Running out of time", icon: Timer, gradient: "from-orange-500 to-amber-500", bg: "from-orange-500/20 to-amber-500/20" },
                    { text: "Understanding content", icon: Brain, gradient: "from-violet-500 to-purple-500", bg: "from-violet-500/20 to-purple-500/20" }
                  ].map((struggle, index) => (
                    <motion.div
                      key={struggle.text}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: revisionStruggles.includes(struggle.text) ? 0 : 2
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 relative overflow-hidden h-40 ${
                          revisionStruggles.includes(struggle.text)
                            ? `ring-2 ring-offset-2 bg-gradient-to-br ${struggle.bg} shadow-lg`
                            : 'hover:shadow-md hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/30'
                        }`}
                        onClick={() => handleStruggleToggle(struggle.text)}
                      >
                        {revisionStruggles.includes(struggle.text) && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${struggle.bg} animate-pulse`} />
                        )}
                        
                        <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                          <motion.div
                            animate={revisionStruggles.includes(struggle.text) ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`p-3 rounded-full mb-4 bg-gradient-to-r ${struggle.gradient} shadow-lg`}
                          >
                            <struggle.icon className="h-8 w-8 text-white" />
                          </motion.div>
                          <p className="font-bold text-lg">{struggle.text}</p>
                          {revisionStruggles.includes(struggle.text) && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="absolute top-3 right-3"
                            >
                              <div className={`bg-gradient-to-r ${struggle.gradient} p-1 rounded-full`}>
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleNext}
                      className="bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 hover:from-rose-700 hover:via-pink-700 hover:to-orange-700 text-white font-bold px-8 py-3 text-lg shadow-lg shadow-rose-500/25"
                    >
                      Got it! Continue 🚀
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
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
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">How do you usually revise?</h3>
                  <p className="text-muted-foreground">Select your preferred methods</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { text: "Flashcards", icon: Target },
                    { text: "Practice questions", icon: Brain },
                    { text: "Reading notes", icon: BookOpen },
                    { text: "Watching videos", icon: Users }
                  ].map((method) => (
                    <motion.div
                      key={method.text}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 ${
                          revisionMethods.includes(method.text)
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleMethodToggle(method.text)}
                      >
                        <CardContent className="p-6 text-center">
                          <method.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                          <p className="font-medium">{method.text}</p>
                          {revisionMethods.includes(method.text) && (
                            <Check className="h-5 w-5 text-primary mx-auto mt-2" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Parent/Guardian Progress */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Would you like us to show your parent/guardian your progress?</h3>
                  <p className="text-muted-foreground">(Optional)</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        showParentProgress
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setShowParentProgress(true)}
                    >
                      <CardContent className="p-6 text-center">
                        <Check className="h-8 w-8 mx-auto mb-3 text-green-500" />
                        <p className="font-medium">Yes, please</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        !showParentProgress
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setShowParentProgress(false)}
                    >
                      <CardContent className="p-6 text-center">
                        <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="font-medium">No, thanks</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Premium Upgrade */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Premium Header */}
                <div className="text-center space-y-4 relative">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative inline-block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 p-4 rounded-3xl shadow-2xl">
                      <Crown className="h-12 w-12 text-white" />
                    </div>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-5xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: "200% 100%" }}
                  >
                    Unlock Premium Power! 🚀
                  </motion.h3>
                  
                  <p className="text-xl text-muted-foreground font-medium">
                    Transform your revision with <span className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">AI-powered insights</span>
                  </p>
                  
                  {/* Stats Banner */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-4 mx-auto max-w-md"
                  >
                    <p className="text-sm font-bold text-emerald-600">
                      ⚡ Premium students achieve <span className="text-2xl">2.3x</span> better grades on average!
                    </p>
                  </motion.div>
                </div>

                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Free Version */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-2 border-muted/50 relative overflow-hidden h-full">
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="font-bold">FREE</Badge>
                      </div>
                      
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="bg-muted p-2 rounded-lg">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          Basic Plan
                        </CardTitle>
                        <p className="text-muted-foreground">Good for getting started</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {[
                          "Basic practice questions",
                          "Subject selection", 
                          "Simple progress tracking",
                          "Community support"
                        ].map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="bg-green-500/10 p-1 rounded-full">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        
                        {[
                          "Limited predictions",
                          "No AI insights",
                          "Basic analytics only"
                        ].map((limitation, i) => (
                          <div key={i} className="flex items-center gap-3 opacity-60">
                            <div className="bg-muted p-1 rounded-full">
                              <X className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm line-through">{limitation}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Premium Version */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border-2 border-transparent bg-gradient-to-br from-yellow-500/20 via-orange-500/20 via-pink-500/20 to-purple-500/20 relative overflow-hidden h-full shadow-2xl shadow-yellow-500/25">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 via-pink-500/10 to-purple-500/10 animate-pulse" />
                      
                      {/* Floating elements */}
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [-10, -20, -10],
                              opacity: [0.3, 0.8, 0.3],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                          >
                            <Star className="h-2 w-2 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Recommended badge */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg"
                        >
                          🏆 MOST POPULAR
                        </motion.div>
                      </div>
                      
                      <CardHeader className="pb-4 relative z-10">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg shadow-lg"
                          >
                            <Crown className="h-6 w-6 text-white" />
                          </motion.div>
                          <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-black">
                            Premium Plan
                          </span>
                        </CardTitle>
                        <p className="text-muted-foreground font-medium">The ultimate revision companion</p>
                        
                        {/* Price highlight */}
                        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg p-3 mt-2">
                          <p className="text-sm text-emerald-600 font-bold">
                            💡 Worth over £200 in private tutoring!
                          </p>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 relative z-10">
                        {[
                          { text: "Unlimited AI-powered practice questions", icon: Infinity, color: "text-violet-500" },
                          { text: "Predictive grade forecasting", icon: Trophy, color: "text-yellow-500" },
                          { text: "Smart revision notebook with AI insights", icon: Brain, color: "text-pink-500" },
                          { text: "Advanced performance analytics", icon: TrendingUp, color: "text-emerald-500" },
                          { text: "Personalized exam predictions", icon: Target, color: "text-orange-500" },
                          { text: "Priority support & guidance", icon: Shield, color: "text-cyan-500" },
                          { text: "Study streak & motivation tools", icon: Heart, color: "text-rose-500" },
                          { text: "Access to all future features", icon: Rocket, color: "text-purple-500" }
                        ].map((feature, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + (i * 0.1) }}
                            className="flex items-center gap-3 group"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 180 }}
                              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-1.5 rounded-full group-hover:shadow-lg transition-all duration-200"
                            >
                              <feature.icon className={`h-4 w-4 ${feature.color}`} />
                            </motion.div>
                            <span className="text-sm font-medium">{feature.text}</span>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="px-8 py-3 text-lg font-medium border-2 hover:bg-muted/50"
                    >
                      Maybe Later
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-xl blur-lg opacity-50 animate-pulse" />
                    <Button 
                      onClick={handleUpgrade}
                      className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white font-black px-12 py-4 text-xl shadow-2xl shadow-orange-500/25 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Crown className="h-6 w-6" />
                        </motion.div>
                        <span>✨ Upgrade to Premium Power!</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Rocket className="h-5 w-5" />
                        </motion.div>
                      </div>
                    </Button>
                  </motion.div>
                </div>
                
                {/* Trust indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center space-y-2"
                >
                  <p className="text-sm text-muted-foreground">
                    🔒 Secure payment • 💫 Cancel anytime • 🎯 30-day money-back guarantee
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    Join thousands of students already crushing their exams with Premium
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};