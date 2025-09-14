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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-0">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/10 via-transparent to-pink-500/10" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 via-fuchsia-500 via-pink-500 to-orange-500 p-0.5 animate-pulse">
          <div className="h-full w-full rounded-lg bg-background/95" />
        </div>

        <DialogHeader className="relative z-10 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-2xl shadow-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
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
                  <div
                    key={step}
                    className={`h-3 w-12 rounded-full transition-all duration-500 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg' 
                        : 'bg-muted/50'
                    }`}
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
                  <div className="relative">
                    <h3 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      What exams are you taking? 📚
                    </h3>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    Select all the subjects you're studying - we'll add them to your dashboard instantly!
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
                  {AVAILABLE_SUBJECTS.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      whileHover={{ scale: 1.05 }}
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
                                <div className="absolute -top-1 -right-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                </div>
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
                  <div>
                    <p className="font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      ✨ {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext} 
                    disabled={selectedSubjects.length === 0 || isLoading}
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold px-8 py-3 text-lg shadow-lg shadow-violet-500/25 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Adding subjects...
                      </>
                    ) : (
                      <>
                        Continue Magic ✨
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
                className="space-y-6"
              >
                <div className="text-center space-y-4 mb-8">
                  <div className="relative">
                    <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                      What's your biggest struggle with revision? 🤔
                    </h3>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Brain className="h-6 w-6 text-blue-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    We'll personalize your experience based on your challenges
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { text: 'Staying motivated', icon: Heart, gradient: 'from-pink-500 to-rose-500', bg: 'from-pink-500/20 to-rose-500/20' },
                    { text: 'Knowing what to revise', icon: Target, gradient: 'from-emerald-500 to-green-500', bg: 'from-emerald-500/20 to-green-500/20' },
                    { text: 'Running out of time', icon: Timer, gradient: 'from-orange-500 to-red-500', bg: 'from-orange-500/20 to-red-500/20' },
                    { text: 'Understanding content', icon: Brain, gradient: 'from-blue-500 to-indigo-500', bg: 'from-blue-500/20 to-indigo-500/20' }
                  ].map((struggle, index) => {
                    const StruggleIcon = struggle.icon;
                    return (
                      <motion.div
                        key={struggle.text}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 relative overflow-hidden h-40 ${
                            revisionStruggles.includes(struggle.text)
                              ? `ring-2 ring-current shadow-lg bg-gradient-to-br ${struggle.bg}`
                              : 'hover:shadow-md hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/30'
                          }`}
                          onClick={() => handleStruggleToggle(struggle.text)}
                        >
                          {revisionStruggles.includes(struggle.text) && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${struggle.bg} animate-pulse`} />
                          )}
                          
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className={`p-3 rounded-full mb-4 bg-gradient-to-r ${struggle.gradient} shadow-lg`}>
                              <StruggleIcon className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-bold text-lg">{struggle.text}</p>
                            {revisionStruggles.includes(struggle.text) && (
                              <div className="absolute top-4 right-4">
                                <Check className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-6 py-2">
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={revisionStruggles.length === 0}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold px-8 py-3 shadow-lg"
                  >
                    Continue Journey ✨
                    <ChevronRight className="h-4 w-4 ml-2" />
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
                className="space-y-6"
              >
                <div className="text-center space-y-4 mb-8">
                  <div className="relative">
                    <h3 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      How do you usually revise? 📖
                    </h3>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <BookOpen className="h-6 w-6 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    We'll optimize your learning experience for your preferred methods
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { text: 'Flashcards', icon: Zap, gradient: 'from-yellow-500 to-orange-500', bg: 'from-yellow-500/20 to-orange-500/20' },
                    { text: 'Practice questions', icon: Trophy, gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-500/20 to-pink-500/20' },
                    { text: 'Reading notes', icon: BookOpen, gradient: 'from-green-500 to-teal-500', bg: 'from-green-500/20 to-teal-500/20' },
                    { text: 'Watching videos', icon: Users, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-500/20 to-cyan-500/20' }
                  ].map((method, index) => {
                    const MethodIcon = method.icon;
                    return (
                      <motion.div
                        key={method.text}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 relative overflow-hidden h-40 ${
                            revisionMethods.includes(method.text)
                              ? `ring-2 ring-current shadow-lg bg-gradient-to-br ${method.bg}`
                              : 'hover:shadow-md hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/30'
                          }`}
                          onClick={() => handleMethodToggle(method.text)}
                        >
                          {revisionMethods.includes(method.text) && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${method.bg} animate-pulse`} />
                          )}
                          
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className={`p-3 rounded-full mb-4 bg-gradient-to-r ${method.gradient} shadow-lg`}>
                              <MethodIcon className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-bold text-lg">{method.text}</p>
                            {revisionMethods.includes(method.text) && (
                              <div className="absolute top-4 right-4">
                                <Check className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-6 py-2">
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={revisionMethods.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 shadow-lg"
                  >
                    Almost Done! 🎯
                    <ChevronRight className="h-4 w-4 ml-2" />
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
                className="space-y-8"
              >
                <div className="text-center space-y-4 mb-8">
                  <div className="relative">
                    <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Would you like us to share your progress? 👨‍👩‍👧‍👦
                    </h3>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Users className="h-6 w-6 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    Keep your parent/guardian informed about your academic journey (Optional)
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <Card className={`cursor-pointer transition-all duration-300 ${
                    showParentProgress 
                      ? 'ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setShowParentProgress(!showParentProgress)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-2xl shadow-lg mr-4">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-2xl font-bold">Share with Parent/Guardian</h4>
                          <p className="text-muted-foreground">Keep them updated on your progress</p>
                        </div>
                        <div className="ml-auto">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showParentProgress ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'
                          }`}>
                            {showParentProgress && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We'll send them weekly progress reports including your study streaks, 
                        grade predictions, and achievements. You can change this anytime in settings.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-6 py-2">
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 shadow-lg"
                  >
                    Final Step! 🚀
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Premium Upgrade */}
            {currentStep === 5 && (
              <div className="space-y-8 max-h-none overflow-visible">
                {/* Premium Header */}
                <div className="text-center space-y-4 relative">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 p-4 rounded-3xl shadow-2xl">
                      <Crown className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-5xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Unlock Premium Power! 🚀
                  </h3>
                  
                  <p className="text-xl text-muted-foreground font-medium">
                    Transform your revision with <span className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">AI-powered insights</span>
                  </p>
                  
                  {/* Stats Banner */}
                  <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-4 mx-auto max-w-md">
                    <p className="text-sm font-bold text-emerald-600">
                      ⚡ Premium students achieve <span className="text-2xl">2.3x</span> better grades on average!
                    </p>
                  </div>
                </div>

                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  {/* Free Plan */}
                  <Card className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-2 rounded-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span>Free Plan</span>
                      </CardTitle>
                      <CardDescription className="text-lg font-medium">
                        Good for getting started
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          'Basic practice questions',
                          'Limited analytics',
                          '3 subjects maximum',
                          'Basic progress tracking'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                              <Check className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-3xl font-black text-gray-600">FREE</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Premium Plan */}
                  <div className="relative">
                    <Card className="relative h-full bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-pink-950/20 border-2 border-gradient-to-r from-yellow-400 to-pink-400 overflow-hidden">
                      {/* Recommended badge */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                          🏆 MOST POPULAR
                        </div>
                      </div>
                      
                      <CardHeader className="pb-4 relative z-10">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg shadow-lg">
                            <Crown className="h-6 w-6 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-black">
                            Premium Plan
                          </span>
                        </CardTitle>
                        <CardDescription className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                          Supercharge your revision! 🚀
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 relative z-10">
                        <div className="space-y-3">
                          {[
                            { icon: Sparkles, text: 'AI-powered grade predictions' },
                            { icon: TrendingUp, text: 'Advanced analytics & insights' },
                            { icon: Infinity, text: 'Unlimited subjects & questions' },
                            { icon: Trophy, text: 'Personalized study plans' },
                            { icon: Zap, text: 'Smart topic recommendations' },
                            { icon: Globe, text: 'Premium question database' },
                            { icon: Award, text: 'Priority support' }
                          ].map((feature, index) => {
                            const FeatureIcon = feature.icon;
                            return (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <FeatureIcon className="h-4 w-4 text-yellow-600" />
                                  <span className="font-medium">{feature.text}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-4 border-t border-yellow-200">
                          <div className="flex items-center gap-2">
                            <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">£4.99</div>
                            <div className="text-muted-foreground">/month</div>
                          </div>
                          <p className="text-sm text-emerald-600 font-medium">💰 Save 60% vs individual tutoring!</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4 pt-8 border-t">
                  <Button 
                    onClick={handleUpgrade}
                    className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white font-black px-12 py-4 text-xl shadow-2xl shadow-orange-500/25 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="flex items-center gap-3">
                      <Crown className="h-6 w-6" />
                      <span>✨ Upgrade to Premium Power!</span>
                      <Rocket className="h-5 w-5" />
                    </div>
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    ✅ 30-day money-back guarantee • 📱 Cancel anytime • 🔒 Secure payment
                  </p>
                  
                  <div className="flex justify-between items-center pt-4">
                    <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                      Maybe later
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep(4)} className="px-6 py-2">
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};