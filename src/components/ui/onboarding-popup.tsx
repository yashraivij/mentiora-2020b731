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
  X
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
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-hidden bg-card/95 border border-border/50">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <div className="absolute inset-0 bg-accent/10" />
        
        {/* Subtle border effect */}
        <div className="absolute inset-0 rounded-lg bg-primary/20 p-0.5">
          <div className="h-full w-full rounded-lg bg-card/95" />
        </div>

        <DialogHeader className="relative z-10 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-primary p-3 rounded-2xl shadow-lg">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-4xl font-black">
                  <div className="flex items-center gap-2">
                    <span className="text-gradient-primary">
                      Welcome to Mentiora!
                    </span>
                    <div>👋</div>
                  </div>
                </DialogTitle>
                <DialogDescription className="text-xl text-muted-foreground font-medium">
                  Let's personalize your <span className="font-bold text-primary">premium</span> learning experience
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
                        ? 'bg-primary shadow-lg' 
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
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-black text-gradient-primary">
                        What exams are you taking?
                      </h3>
                      <div className="text-3xl">📚</div>
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
                            ? 'ring-2 ring-primary bg-primary/10 shadow-lg'
                            : 'hover:bg-accent/50 hover:shadow-md'
                        }`}
                        onClick={() => handleSubjectToggle(subject.id)}
                      >
                        {selectedSubjects.includes(subject.id) && (
                          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
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
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground'
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

                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <div>
                    <div className="flex items-center justify-center gap-3">
                      <p className="font-bold text-lg text-gradient-primary">
                        {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="text-lg">✨</div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleNext} 
                    disabled={selectedSubjects.length === 0 || isLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 text-lg shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Adding subjects...
                      </>
                    ) : (
                      <>
                        Let's Continue! 
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
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-black text-gradient-primary">
                        What's your biggest struggle with revision?
                      </h3>
                      <div className="text-3xl">🤔</div>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    We'll personalize your experience based on your challenges
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { text: 'Staying motivated', icon: Heart },
                    { text: 'Knowing what to revise', icon: Target },
                    { text: 'Running out of time', icon: Timer },
                    { text: 'Understanding content', icon: Brain }
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
                              ? 'ring-2 ring-primary shadow-lg bg-primary/10'
                              : 'hover:shadow-md hover:bg-accent/50'
                          }`}
                          onClick={() => handleStruggleToggle(struggle.text)}
                        >
                          {revisionStruggles.includes(struggle.text) && (
                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                          )}
                          
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className="p-3 rounded-full mb-4 bg-primary shadow-lg">
                              <StruggleIcon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <p className="font-bold text-lg">{struggle.text}</p>
                            {revisionStruggles.includes(struggle.text) && (
                              <div className="absolute top-4 right-4">
                                <Check className="h-5 w-5 text-primary" />
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 shadow-lg"
                  >
                  <div className="flex items-center gap-2">
                    <span>Continue Journey</span>
                    <div>✨</div>
                  </div>
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
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-black text-gradient-primary">
                        How do you usually revise?
                      </h3>
                      <div className="text-3xl">📖</div>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    We'll optimize your learning experience for your preferred methods
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { text: 'Flashcards', icon: Zap },
                    { text: 'Practice questions', icon: Trophy },
                    { text: 'Reading notes', icon: BookOpen },
                    { text: 'Watching videos', icon: Users }
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
                              ? 'ring-2 ring-primary shadow-lg bg-primary/10'
                              : 'hover:shadow-md hover:bg-accent/50'
                          }`}
                          onClick={() => handleMethodToggle(method.text)}
                        >
                          {revisionMethods.includes(method.text) && (
                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                          )}
                          
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className="p-3 rounded-full mb-4 bg-primary shadow-lg">
                              <MethodIcon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <p className="font-bold text-lg">{method.text}</p>
                            {revisionMethods.includes(method.text) && (
                              <div className="absolute top-4 right-4">
                                <Check className="h-5 w-5 text-primary" />
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 shadow-lg"
                  >
                  <div className="flex items-center gap-2">
                    <span>Almost Done!</span>
                    <div>🎯</div>
                  </div>
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
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-black text-gradient-primary">
                        Would you like us to share your progress?
                      </h3>
                      <div className="text-3xl">👨‍👩‍👧‍👦</div>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">
                    Keep your parent/guardian informed about your academic journey (Optional)
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <Card className={`cursor-pointer transition-all duration-300 ${
                    showParentProgress 
                      ? 'ring-2 ring-primary bg-primary/10 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setShowParentProgress(!showParentProgress)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary p-4 rounded-2xl shadow-lg mr-4">
                          <Users className="h-10 w-10 text-primary-foreground" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-2xl font-bold">Share with Parent/Guardian</h4>
                          <p className="text-muted-foreground">Keep them updated on your progress</p>
                        </div>
                        <div className="ml-auto">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showParentProgress ? 'bg-primary border-primary' : 'border-muted-foreground'
                          }`}>
                            {showParentProgress && <Check className="h-4 w-4 text-primary-foreground" />}
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 shadow-lg"
                  >
                  <div className="flex items-center gap-2">
                    <span>Final Step!</span>
                    <div>🚀</div>
                  </div>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Premium Upgrade - Ultra Premium Design */}
            {currentStep === 5 && (
              <div className="space-y-2 max-h-[calc(98vh-140px)] overflow-hidden">
                {/* Animated Premium Header - Dynamic & Bigger */}
                <div className="text-center space-y-2 relative overflow-hidden">
                  {/* Floating background elements */}
                  <div className="absolute inset-0 flex justify-center items-center opacity-10">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-32 h-32 bg-primary rounded-full blur-3xl"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: [0, 1.2, 1],
                      rotate: [0, 360, 0] 
                    }}
                    transition={{ 
                      duration: 1,
                      type: "spring",
                      bounce: 0.5
                    }}
                    className="relative inline-block z-10"
                  >
                    <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-75">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-full h-full bg-primary rounded-2xl"
                      />
                    </div>
                    <div className="relative bg-primary p-4 rounded-2xl shadow-2xl">
                      <motion.div
                        animate={{ 
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Crown className="h-10 w-10 text-primary-foreground drop-shadow-2xl" />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                   <motion.h3
                     initial={{ opacity: 0, y: 30, scale: 0.8 }}
                     animate={{ 
                       opacity: 1, 
                       y: 0, 
                       scale: 1
                     }}
                     transition={{ 
                       delay: 0.3,
                       duration: 0.8,
                       type: "spring"
                     }}
                     className="text-4xl font-black relative z-10 flex items-center justify-center gap-2"
                   >
                     <motion.span
                       animate={{ 
                         textShadow: [
                           "0 0 0px rgba(255,255,255,0)",
                           "0 0 20px rgba(255,255,255,0.5)",
                           "0 0 0px rgba(255,255,255,0)"
                         ]
                       }}
                       transition={{ 
                         duration: 3, 
                         repeat: Infinity,
                         ease: "easeInOut"
                       }}
                       style={{ fontSize: '1em' }}
                     >
                       🚀
                     </motion.span>
                      <span className="text-gradient-primary">
                        Unlock Your Academic Superpower!
                      </span>
                     <motion.span
                       animate={{ 
                         textShadow: [
                           "0 0 0px rgba(255,255,255,0)",
                           "0 0 20px rgba(255,255,255,0.5)",
                           "0 0 0px rgba(255,255,255,0)"
                         ]
                       }}
                       transition={{ 
                         duration: 3, 
                         repeat: Infinity,
                         ease: "easeInOut"
                       }}
                       style={{ fontSize: '1em' }}
                     >
                       ✨
                     </motion.span>
                   </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5,
                      duration: 0.6
                    }}
                    className="text-xl font-bold relative z-10"
                  >
                    <motion.span
                      animate={{ 
                        color: ["#059669", "#0891b2", "#7c3aed", "#059669"]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Join{" "}
                       <motion.span 
                         className="font-black text-primary"
                         animate={{ scale: [1, 1.05, 1] }}
                         transition={{ 
                           duration: 2, 
                           repeat: Infinity,
                           ease: "easeInOut"
                         }}
                       >
                         10,000+ students
                       </motion.span>
                       {" "}getting{" "}
                       <motion.span 
                         className="font-black text-primary"
                         animate={{ scale: [1, 1.1, 1] }}
                         transition={{ 
                           duration: 1.5, 
                           repeat: Infinity,
                           ease: "easeInOut",
                           delay: 0.5
                         }}
                       >
                         2+ grades higher
                       </motion.span>
                    </motion.span>
                  </motion.p>
                  
                  {/* Floating sparkles */}
                     {[...Array(6)].map((_, i) => (
                       <motion.div
                         key={i}
                         className="absolute"
                         style={{
                           left: `${20 + i * 12}%`,
                           top: `${10 + (i % 2) * 60}%`,
                           fontSize: '1.2em'
                         }}
                         animate={{
                           y: [0, -20, 0],
                           rotate: [0, 180, 360],
                           scale: [0.5, 1, 0.5]
                         }}
                         transition={{
                           duration: 3 + i * 0.5,
                           repeat: Infinity,
                           delay: i * 0.3,
                           ease: "easeInOut"
                         }}
                       >
                         ✨
                       </motion.div>
                     ))}
                </div>

                {/* Revolutionary Comparison Cards - Larger */}
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  {/* Free Plan - Deliberately Limited */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="relative bg-muted border-2 border-muted-foreground opacity-75">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-muted-foreground text-lg">
                          <div className="bg-muted-foreground p-1.5 rounded">
                            <Lock className="h-4 w-4 text-background" />
                          </div>
                          <span className="font-bold">Free (Limited)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-3">
                        <div className="space-y-2">
                           {[
                             { text: 'Basic practice questions', limited: true },
                             { text: 'No grade predictions', limited: true },
                             { text: 'No advanced analytics', limited: true },
                             { text: 'Basic progress tracking', limited: true }
                           ].map((feature, index) => (
                             <div key={index} className="flex items-center gap-2">
                               <Shield className="h-4 w-4 text-destructive" />
                               <span className="text-sm text-muted-foreground">
                                 {feature.text}
                               </span>
                             </div>
                           ))}
                        </div>
                         <div className="pt-2 border-t border-muted">
                           <div className="text-xl font-black text-muted-foreground">FREE</div>
                         </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Premium Plan - Ultra Desirable */}
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="relative"
                  >
                     {/* Glowing border effect */}
                     <div className="absolute inset-0 bg-primary rounded-xl blur-md opacity-75 animate-pulse" />
                     
                     <Card className="relative bg-card border-0 shadow-xl">
                      {/* Premium badges */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50">
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-black text-sm shadow-xl border-2 border-background"
                        >
                          🏆 MOST POPULAR
                        </motion.div>
                      </div>
                      
                      <div className="absolute top-2 right-2 z-10">
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                          className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold"
                        >
                          92% SUCCESS
                        </motion.div>
                      </div>
                      
                      <CardHeader className="pb-2 relative z-10 pt-5">
                        <CardTitle className="flex items-center gap-2">
                          <div className="bg-primary p-2 rounded-lg shadow-lg">
                            <Crown className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <span className="text-lg font-black text-gradient-primary">
                            Premium Superpower
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 relative z-10 pb-3">
                        <div className="space-y-2">
                          {[
                            { text: '🤖 Grade Predictor (99% accurate)', premium: true },
                            { text: '🧠 Smart Study Plans', premium: true },
                            { text: '♾️ Unlimited Everything', premium: true },
                            { text: '📊 Advanced Analytics', premium: true },
                            { text: '⚡ Weak Topic Detection', premium: true },
                            { text: '🎯 Exam Predictions', premium: true }
                          ].map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + (index * 0.05) }}
                              className="flex items-center gap-2"
                            >
                               <div className="bg-accent rounded-full p-0.5">
                                 <Check className="h-3 w-3 text-accent-foreground" />
                               </div>
                              <span className="text-sm font-semibold">{feature.text}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Pricing with massive discount */}
                         <div className="pt-2 border-t border-border space-y-1">
                           <div className="flex items-center gap-2">
                             <div className="text-xs text-muted-foreground line-through">£19.99/mo</div>
                             <div className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs font-bold">50% OFF!</div>
                           </div>
                           <div className="flex items-baseline gap-1">
                             <div className="text-2xl font-black text-gradient-primary">£9.99</div>
                             <div className="text-sm text-muted-foreground">/month</div>
                          </div>
                          <div className="text-xs text-accent font-bold">⚡ LIMITED TIME ONLY</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Social Proof & CTA Section - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center space-y-3 pt-2"
                >
                  {/* Social Proof */}
                   <div className="bg-accent/10 rounded-lg p-2 border border-accent">
                     <div className="flex items-center justify-center gap-3 text-xs">
                       <div className="flex items-center gap-1">
                         <Star className="h-3 w-3 text-primary fill-current" />
                         <span className="font-bold">4.9/5</span>
                       </div>
                       <div className="flex items-center gap-1">
                         <Trophy className="h-3 w-3 text-primary" />
                         <span className="font-bold">92%</span>
                         <span className="text-muted-foreground">grade improvement</span>
                       </div>
                     </div>
                   </div>

                  {/* Main CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                     <Button 
                       onClick={handleUpgrade}
                       className="relative bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 py-2.5 text-sm shadow-xl overflow-hidden group w-full max-w-md"
                     >
                       <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-20 transition-opacity" />
                       <div className="flex items-center justify-center gap-2 relative z-10">
                         <Rocket className="h-4 w-4" />
                         <span style={{ fontSize: '1em' }}>🚀</span>
                         <span>Start Your Academic Transformation!</span>
                         <Sparkles className="h-4 w-4" />
                       </div>
                    </Button>
                  </motion.div>
                  
                  {/* Guarantee & Benefits */}
                   <p className="text-xs font-bold text-accent">
                     <span style={{ fontSize: '1em' }}>✅</span> 30-day money-back guarantee • <span style={{ fontSize: '1em' }}>📱</span> Cancel anytime
                   </p>
                </motion.div>
                
                {/* Action Buttons - Fixed at bottom */}
                 <div className="flex justify-between items-center pt-4 border-t border-border mt-4 bg-background">
                   <Button 
                     variant="outline" 
                     onClick={() => setCurrentStep(4)} 
                     className="px-6 py-3 text-base font-semibold"
                   >
                     ← Back
                   </Button>
                   <Button 
                     variant="outline" 
                     onClick={onClose} 
                     className="px-6 py-3 text-base font-semibold"
                   >
                     Continue with Free Version
                   </Button>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};