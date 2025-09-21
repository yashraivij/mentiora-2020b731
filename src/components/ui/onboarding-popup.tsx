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

const AVAILABLE_SUBJECTS: Subject[] = [
  { id: 'physics-edexcel', name: 'Physics', examBoard: 'Edexcel', topicCount: getTopicCount('physics-edexcel') },
  { id: 'chemistry-edexcel', name: 'Chemistry', examBoard: 'Edexcel', topicCount: getTopicCount('chemistry-edexcel') },
  { id: 'english-language', name: 'English Language', examBoard: 'AQA', topicCount: getTopicCount('english-language') },
  { id: 'religious-studies', name: 'Religious Studies', examBoard: 'AQA', topicCount: getTopicCount('religious-studies') },
  { id: 'history', name: 'History', examBoard: 'AQA', topicCount: getTopicCount('history') },
  { id: 'english-literature', name: 'English Literature', examBoard: 'AQA', topicCount: getTopicCount('english-literature') },
  { id: 'physics', name: 'Physics', examBoard: 'AQA', topicCount: getTopicCount('physics') },
  { id: 'geography', name: 'Geography', examBoard: 'AQA', topicCount: getTopicCount('geography') },
  { id: 'maths', name: 'Mathematics', examBoard: 'AQA', topicCount: getTopicCount('maths') },
  { id: 'maths-edexcel', name: 'Mathematics', examBoard: 'Edexcel', topicCount: getTopicCount('maths-edexcel') },
  { id: 'business-edexcel-igcse', name: 'Business', examBoard: 'Edexcel IGCSE', topicCount: getTopicCount('business-edexcel-igcse') },
  { id: 'biology', name: 'Biology', examBoard: 'AQA', topicCount: getTopicCount('biology') },
  { id: 'chemistry', name: 'Chemistry', examBoard: 'AQA', topicCount: getTopicCount('chemistry') },
  { id: 'business', name: 'Business', examBoard: 'AQA', topicCount: getTopicCount('business') },
  { id: 'combined-science-aqa', name: 'Combined Science', examBoard: 'AQA', topicCount: getTopicCount('combined-science-aqa') },
  { id: 'edexcel-english-language', name: 'English Language', examBoard: 'Edexcel', topicCount: getTopicCount('edexcel-english-language') },
];

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [revisionStruggles, setRevisionStruggles] = useState<string[]>([]);
  const [revisionMethods, setRevisionMethods] = useState<string[]>([]);
  const [showParentProgress, setShowParentProgress] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
        const subject = AVAILABLE_SUBJECTS.find(s => s.id === subjectId);
        
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
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-hidden bg-background dark:bg-background border-0 shadow-2xl">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 dark:from-sky-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        
        {/* Subtle border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-200 via-purple-200 to-pink-200 dark:from-sky-800 dark:via-purple-800 dark:to-pink-800 p-0.5">
          <div className="h-full w-full rounded-lg bg-background dark:bg-background" />
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
                <DialogTitle className="text-4xl font-bold text-foreground dark:text-foreground">
                  Welcome to Mentiora!
                </DialogTitle>
                <DialogDescription className="text-xl text-muted-foreground dark:text-muted-foreground font-medium">
                  Let's personalize your learning experience
                </DialogDescription>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Step {currentStep} of 4</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
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
                  <h3 className="text-3xl font-bold text-foreground dark:text-foreground">
                    What exams are you taking? 📚
                  </h3>
                  <p className="text-lg text-muted-foreground dark:text-muted-foreground">
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
                            ? 'ring-4 ring-sky-400 bg-sky-50 dark:bg-sky-950/30 shadow-xl transform scale-105'
                            : 'hover:bg-muted/50 dark:hover:bg-muted/30 hover:shadow-lg hover:scale-102 border-2 border-border dark:border-border'
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
                              <p className="font-bold text-sm truncate text-gray-900 dark:text-white">{subject.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                {subject.topicCount} topic{subject.topicCount !== 1 ? 's' : ''} available
                              </p>
                               <Badge 
                                variant="secondary" 
                                className={`text-xs mt-1 ${
                                  selectedSubjects.includes(subject.id)
                                    ? 'bg-sky-400 text-white shadow-lg'
                                    : 'bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground'
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
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
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
                    Keep your parent/guardian informed about your academic journey
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
                  
                  {/* Parent Email Input - Show when opted in */}
                  {showParentProgress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <Label 
                              htmlFor="parentEmail" 
                              className="text-base font-bold text-gray-800 flex items-center gap-2"
                            >
                              <User className="h-4 w-4 text-indigo-500" />
                              Parent/Guardian Email Address *
                            </Label>
                            <Input
                              id="parentEmail"
                              type="email"
                              value={parentEmail}
                              onChange={(e) => setParentEmail(e.target.value)}
                              placeholder="parent@example.com"
                              className="text-base p-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              required
                            />
                            <p className="text-xs text-gray-600 italic">
                              Weekly progress reports with study statistics and achievements.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-6 py-2">
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
                    className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3 text-lg rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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