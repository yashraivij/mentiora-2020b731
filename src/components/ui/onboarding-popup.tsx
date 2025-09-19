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
  X,
  Flame,
  Clock,
  NotebookPen,
  User
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

  const handleNext = async () => {
    if (currentStep === 1 && selectedSubjects.length > 0) {
      await addSubjectsToDatabase();
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleUpgrade = () => {
    openPaymentLink();
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
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-hidden bg-white border-0 shadow-2xl">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50" />
        
        {/* Subtle border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-200 via-purple-200 to-pink-200 p-0.5">
          <div className="h-full w-full rounded-lg bg-white" />
        </div>

        <DialogHeader className="relative z-10 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-purple-400 rounded-3xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-4xl font-bold text-gray-800">
                  Welcome to Mentiora!
                </DialogTitle>
                <DialogDescription className="text-xl text-gray-600 font-medium">
                  Let's personalize your learning experience
                </DialogDescription>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 5</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-3 w-12 rounded-full transition-all duration-500 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-sky-400 to-purple-400 shadow-lg' 
                        : 'bg-gray-200'
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
                  <h3 className="text-3xl font-bold text-gray-800">
                    What exams are you taking? 📚
                  </h3>
                  <p className="text-lg text-gray-600">
                    Select all the subjects you're studying - we'll add them to your dashboard
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
                            ? 'ring-4 ring-sky-400 bg-sky-50 shadow-xl transform scale-105'
                            : 'hover:bg-gray-50 hover:shadow-lg hover:scale-102 border-2 border-gray-100'
                        }`}
                        onClick={() => handleSubjectToggle(subject.id)}
                      >
                        {selectedSubjects.includes(subject.id) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-purple-100 opacity-50" />
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
                                    ? 'bg-sky-400 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700'
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

                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected ✨
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext} 
                    disabled={selectedSubjects.length === 0 || isLoading}
                    className="bg-gradient-to-r from-sky-400 to-purple-400 hover:from-sky-500 hover:to-purple-500 text-white font-bold px-8 py-3 text-lg rounded-2xl shadow-lg disabled:opacity-50"
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
                className="space-y-6"
              >
                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-3xl font-bold text-gray-800">
                    What's your biggest struggle with revision? 🤔
                  </h3>
                  <p className="text-lg text-gray-600">
                    We'll personalize your experience based on your challenges
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 relative overflow-hidden h-40 rounded-3xl border-2 ${
                            revisionStruggles.includes(struggle.text)
                              ? `ring-4 ring-current shadow-xl transform scale-105 bg-gradient-to-br ${struggle.bg}`
                              : 'hover:shadow-lg hover:scale-102 border-gray-200 bg-white'
                          }`}
                          onClick={() => handleStruggleToggle(struggle.text)}
                        >
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-r ${struggle.color} shadow-lg`}>
                              <StruggleIcon className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-bold text-lg text-gray-800">{struggle.text}</p>
                            {revisionStruggles.includes(struggle.text) && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-white rounded-full p-1 shadow-lg">
                                  <Check className="h-4 w-4 text-green-500" />
                                </div>
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
                    className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-8 py-3 text-lg rounded-2xl shadow-lg"
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
                className="space-y-6"
              >
                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-3xl font-bold text-gray-800">
                    How do you usually revise? 📖
                  </h3>
                  <p className="text-lg text-gray-600">
                    We'll optimize your learning experience for your preferred methods
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 relative overflow-hidden h-40 rounded-3xl border-2 ${
                            revisionMethods.includes(method.text)
                              ? `ring-4 ring-current shadow-xl transform scale-105 bg-gradient-to-br ${method.bg}`
                              : 'hover:shadow-lg hover:scale-102 border-gray-200 bg-white'
                          }`}
                          onClick={() => handleMethodToggle(method.text)}
                        >
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                            <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-r ${method.color} shadow-lg`}>
                              <MethodIcon className="h-8 w-8 text-white" />
                            </div>
                            <p className="font-bold text-lg text-gray-800">{method.text}</p>
                            {revisionMethods.includes(method.text) && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-white rounded-full p-1 shadow-lg">
                                  <Check className="h-4 w-4 text-green-500" />
                                </div>
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
                    className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 text-lg rounded-2xl shadow-lg"
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
                className="space-y-8"
              >
                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-3xl font-bold text-gray-800">
                    Would you like us to share your progress? 👨‍👩‍👧‍👦
                  </h3>
                  <p className="text-lg text-gray-600">
                    Keep your parent/guardian informed about your academic journey (Optional)
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <Card className={`cursor-pointer transition-all duration-300 rounded-3xl border-2 ${
                    showParentProgress 
                      ? 'ring-4 ring-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl transform scale-105' 
                      : 'hover:shadow-lg hover:scale-102 border-gray-200 bg-white'
                  }`}
                  onClick={() => setShowParentProgress(!showParentProgress)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-4 rounded-3xl shadow-lg mr-4">
                          <User className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-2xl font-bold text-gray-800">Share with Parent/Guardian</h4>
                          <p className="text-gray-600">Keep them updated on your progress</p>
                        </div>
                        <div className="ml-auto">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showParentProgress ? 'bg-indigo-400 border-indigo-400' : 'border-gray-400'
                          }`}>
                            {showParentProgress && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
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
                    className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3 text-lg rounded-2xl shadow-lg"
                  >
                  <div className="flex items-center gap-2">
                    <span>Final Step!</span>
                    <span>🚀</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Premium Upgrade - Ultra Premium Design */}
            {currentStep === 5 && (
              <div className="space-y-2 max-h-[calc(98vh-140px)] overflow-hidden">
                {/* Premium Header */}
                <div className="text-center space-y-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <Gem className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-800">
                    🚀 Unlock Your Academic Superpower! ✨
                  </h3>
                  
                  <p className="text-xl text-gray-600 font-medium">
                    Join <span className="font-bold text-green-600">10,000+ students</span> getting <span className="font-bold text-purple-600">2+ grades higher</span>
                  </p>
                </div>

                {/* Revolutionary Comparison Cards - Larger */}
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  {/* Free Plan - Deliberately Limited */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="relative bg-white border-2 border-gray-200 opacity-75 rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-gray-600 text-lg">
                          <div className="bg-gray-500 p-1.5 rounded">
                            <X className="h-4 w-4 text-white" />
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
                               <X className="h-4 w-4 text-red-500" />
                               <span className="text-sm text-gray-600">
                                 {feature.text}
                               </span>
                             </div>
                           ))}
                        </div>
                         <div className="pt-2 border-t border-gray-200">
                           <div className="text-xl font-black text-gray-600">FREE</div>
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
                     {/* Colorful border */}
                     <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 via-pink-400 to-purple-400 rounded-2xl blur-md opacity-75" />
                     
                     <Card className="relative bg-white border-0 shadow-2xl rounded-2xl">
                      {/* Premium badges */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50">
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full font-black text-sm shadow-xl border-2 border-white"
                        >
                          🏆 MOST POPULAR
                        </motion.div>
                      </div>
                      
                      <div className="absolute top-2 right-2 z-10">
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                          className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold"
                        >
                          92% SUCCESS
                        </motion.div>
                      </div>
                      
                      <CardHeader className="pb-2 relative z-10 pt-5">
                        <CardTitle className="flex items-center gap-2">
                          <div className="bg-gradient-to-r from-orange-400 to-red-400 p-2 rounded-lg shadow-lg">
                            <Gem className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-lg font-black text-gray-800">
                            Premium Features
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
                               <div className="bg-green-500 rounded-full p-0.5">
                                 <Check className="h-3 w-3 text-white" />
                               </div>
                              <span className="text-sm font-semibold text-gray-800">{feature.text}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Pricing with massive discount */}
                         <div className="pt-2 border-t border-gray-200 space-y-1">
                           <div className="flex items-center gap-2">
                             <div className="text-xs text-gray-500 line-through">£19.99/mo</div>
                             <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">50% OFF!</div>
                           </div>
                           <div className="flex items-baseline gap-1">
                             <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">£9.99</div>
                             <div className="text-sm text-gray-600">/month</div>
                          </div>
                           <div className="text-xs text-green-600 font-bold">⚡ LIMITED TIME ONLY</div>
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
                   <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200">
                     <div className="flex items-center justify-center gap-4 text-sm">
                       <div className="flex items-center gap-2">
                         <Star className="h-4 w-4 text-yellow-500 fill-current" />
                         <span className="font-bold text-gray-800">4.9/5 rating</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Trophy className="h-4 w-4 text-orange-500" />
                         <span className="font-bold text-gray-800">92% grade improvement</span>
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
                       className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-500 text-white font-black px-8 py-4 text-lg rounded-2xl shadow-2xl overflow-hidden group w-full max-w-md"
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-0 group-hover:opacity-30 transition-opacity" />
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <Star className="h-5 w-5" />
                          <span>🚀 Start Your Academic Transformation! ✨</span>
                          <Star className="h-5 w-5" />
                        </div>
                    </Button>
                  </motion.div>
                  
                  {/* Guarantee & Benefits */}
                   <p className="text-sm font-bold text-green-600">
                     ✅ 30-day money-back guarantee • 📱 Cancel anytime
                   </p>
                </motion.div>
                
                {/* Action Buttons - Fixed at bottom */}
                 <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6 bg-white rounded-b-2xl">
                   <Button 
                     variant="outline" 
                     onClick={() => setCurrentStep(4)} 
                     className="px-6 py-3 text-base font-semibold rounded-2xl border-2"
                   >
                     ← Back
                   </Button>
                   <Button 
                     variant="outline" 
                     onClick={() => {
                       onSubjectsAdded(); // Call when user finishes onboarding
                       onClose();
                     }} 
                     className="px-6 py-3 text-base font-semibold rounded-2xl border-2 border-sky-400 bg-sky-50 text-sky-700 hover:bg-sky-100"
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