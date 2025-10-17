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
      <DialogContent className="max-w-7xl sm:max-w-[95vw] max-h-[98vh] overflow-y-auto bg-white border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0BA5E9' }}>
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-black">
                  Welcome to Mentiora
                </DialogTitle>
                <DialogDescription className="text-base sm:text-lg text-gray-600">
                  Let's personalize your learning experience
                </DialogDescription>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 sm:w-12 rounded-full transition-all duration-300`}
                    style={{ backgroundColor: step <= currentStep ? '#0BA5E9' : '#e5e7eb' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pt-6">
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
                <div className="text-center space-y-3 mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    What exams are you taking?
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    Select all the subjects you're studying - we'll add them to your dashboard
                  </p>
                </div>

                <Tabs value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as 'gcse' | 'alevel')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="gcse">GCSE Subjects</TabsTrigger>
                    <TabsTrigger value="alevel">A-Level Subjects</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gcse">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
                      {GCSE_SUBJECTS.map((subject, index) => (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedSubjects.includes(subject.id)
                                ? 'shadow-[0_8px_24px_rgba(11,165,233,0.2)]'
                                : 'hover:shadow-md'
                            }`}
                            style={{
                              backgroundColor: 'white',
                              border: selectedSubjects.includes(subject.id) ? '2px solid #0BA5E9' : '1px solid #e5e7eb'
                            }}
                            onClick={() => handleSubjectToggle(subject.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <Checkbox 
                                  checked={selectedSubjects.includes(subject.id)}
                                  onChange={() => {}}
                                  className="pointer-events-none"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate text-black">{subject.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {subject.topicCount} topic{subject.topicCount !== 1 ? 's' : ''} • {subject.examBoard}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="alevel">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
                      {ALEVEL_SUBJECTS.map((subject, index) => (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedSubjects.includes(subject.id)
                                ? 'shadow-[0_8px_24px_rgba(11,165,233,0.2)]'
                                : 'hover:shadow-md'
                            }`}
                            style={{
                              backgroundColor: 'white',
                              border: selectedSubjects.includes(subject.id) ? '2px solid #0BA5E9' : '1px solid #e5e7eb'
                            }}
                            onClick={() => handleSubjectToggle(subject.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <Checkbox 
                                  checked={selectedSubjects.includes(subject.id)}
                                  onChange={() => {}}
                                  className="pointer-events-none"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate text-black">{subject.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {subject.topicCount} topic{subject.topicCount !== 1 ? 's' : ''} • {subject.examBoard}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-base text-gray-600">
                      {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext} 
                    disabled={selectedSubjects.length === 0 || isLoading}
                    className="text-white font-semibold px-8 py-2 rounded-lg disabled:opacity-50"
                    style={{ backgroundColor: '#0BA5E9' }}
                  >
                    {isLoading ? (
                      'Adding subjects...'
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
                <div className="text-center space-y-3 mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    What's your biggest struggle with revision?
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    We'll personalize your experience based on your challenges
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { text: 'Staying motivated', icon: Flame },
                    { text: 'Knowing what to revise', icon: Brain },
                    { text: 'Running out of time', icon: Clock },
                    { text: 'Understanding content', icon: BookOpen }
                  ].map((struggle, index) => {
                    const StruggleIcon = struggle.icon;
                    return (
                      <motion.div
                        key={struggle.text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 h-32 ${
                            revisionStruggles.includes(struggle.text)
                              ? 'shadow-[0_8px_24px_rgba(11,165,233,0.2)]'
                              : 'hover:shadow-md'
                          }`}
                          style={{
                            backgroundColor: 'white',
                            border: revisionStruggles.includes(struggle.text) ? '2px solid #0BA5E9' : '1px solid #e5e7eb'
                          }}
                          onClick={() => handleStruggleToggle(struggle.text)}
                        >
                          <CardContent className="p-4 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#0BA5E9' }}>
                              <StruggleIcon className="h-5 w-5 text-white" />
                            </div>
                            <p className="font-semibold text-sm text-black">{struggle.text}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-6 py-2 border-gray-200">
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={revisionStruggles.length === 0}
                    className="text-white font-semibold px-8 py-2 rounded-lg"
                    style={{ backgroundColor: '#0BA5E9' }}
                  >
                    Continue
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
                <div className="text-center space-y-3 mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    How do you usually revise?
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    We'll optimize your learning experience for your preferred methods
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { text: 'Flashcards', icon: Star },
                    { text: 'Practice questions', icon: NotebookPen },
                    { text: 'Reading notes', icon: BookOpen },
                    { text: 'Watching videos', icon: TrendingUp }
                  ].map((method, index) => {
                    const MethodIcon = method.icon;
                    return (
                      <motion.div
                        key={method.text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 h-32 ${
                            revisionMethods.includes(method.text)
                              ? 'shadow-[0_8px_24px_rgba(11,165,233,0.2)]'
                              : 'hover:shadow-md'
                          }`}
                          style={{
                            backgroundColor: 'white',
                            border: revisionMethods.includes(method.text) ? '2px solid #0BA5E9' : '1px solid #e5e7eb'
                          }}
                          onClick={() => handleMethodToggle(method.text)}
                        >
                          <CardContent className="p-4 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#0BA5E9' }}>
                              <MethodIcon className="h-5 w-5 text-white" />
                            </div>
                            <p className="font-semibold text-sm text-black">{method.text}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-6 py-2 border-gray-200">
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={revisionMethods.length === 0}
                    className="text-white font-semibold px-8 py-2 rounded-lg"
                    style={{ backgroundColor: '#0BA5E9' }}
                  >
                    Continue
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
                    className="text-white font-semibold px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#0BA5E9' }}
                  >
                    Complete Setup
                    <Check className="h-4 w-4 ml-2" />
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