import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, BookOpen, Target, Users, Crown, Sparkles, Star, Zap, CheckCircle, X } from 'lucide-react';
import { curriculum } from '@/data/curriculum';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface OnboardingPopupProps {
  isVisible: boolean;
  onComplete: () => void;
}

interface SubjectOption {
  id: string;
  name: string;
  examBoard: string;
}

const SUBJECT_OPTIONS: SubjectOption[] = [
  { id: 'maths-aqa', name: 'Mathematics', examBoard: 'AQA' },
  { id: 'maths-edexcel', name: 'Mathematics', examBoard: 'Edexcel' },
  { id: 'maths-ocr', name: 'Mathematics', examBoard: 'OCR' },
  { id: 'english-aqa', name: 'English Language', examBoard: 'AQA' },
  { id: 'edexcel-english-language', name: 'English Language', examBoard: 'Edexcel' },
  { id: 'english-ocr', name: 'English Language', examBoard: 'OCR' },
  { id: 'physics-aqa', name: 'Physics', examBoard: 'AQA' },
  { id: 'physics-edexcel', name: 'Physics', examBoard: 'Edexcel' },
  { id: 'physics-ocr', name: 'Physics', examBoard: 'OCR' },
  { id: 'chemistry-aqa', name: 'Chemistry', examBoard: 'AQA' },
  { id: 'chemistry-edexcel', name: 'Chemistry', examBoard: 'Edexcel' },
  { id: 'chemistry-ocr', name: 'Chemistry', examBoard: 'OCR' },
  { id: 'biology-aqa', name: 'Biology', examBoard: 'AQA' },
  { id: 'biology-edexcel', name: 'Biology', examBoard: 'Edexcel' },
  { id: 'biology-ocr', name: 'Biology', examBoard: 'OCR' },
  { id: 'history-aqa', name: 'History', examBoard: 'AQA' },
  { id: 'history-edexcel', name: 'History', examBoard: 'Edexcel' },
  { id: 'history-ocr', name: 'History', examBoard: 'OCR' },
  { id: 'geography-aqa', name: 'Geography', examBoard: 'AQA' },
  { id: 'geography-edexcel', name: 'Geography', examBoard: 'Edexcel' },
  { id: 'geography-ocr', name: 'Geography', examBoard: 'OCR' },
  { id: 'business-aqa', name: 'Business Studies', examBoard: 'AQA' },
  { id: 'business-edexcel-igcse', name: 'Business Studies', examBoard: 'Edexcel' },
  { id: 'business-ocr', name: 'Business Studies', examBoard: 'OCR' },
  { id: 'computer-science-aqa', name: 'Computer Science', examBoard: 'AQA' },
  { id: 'computer-science-edexcel', name: 'Computer Science', examBoard: 'Edexcel' },
  { id: 'computer-science-ocr', name: 'Computer Science', examBoard: 'OCR' },
];

export function OnboardingPopup({ isVisible, onComplete }: OnboardingPopupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [revisionStruggle, setRevisionStruggle] = useState('');
  const [revisionMethod, setRevisionMethod] = useState('');
  const [parentTracking, setParentTracking] = useState<'yes' | 'no' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { openPaymentLink } = useSubscription();
  const { toast } = useToast();

  const steps = [
    { title: 'What exams are you taking?', key: 'subjects' },
    { title: 'What\'s your biggest struggle?', key: 'struggle' },
    { title: 'How do you usually revise?', key: 'method' },
    { title: 'Parent/Guardian Progress?', key: 'parent' },
    { title: 'Upgrade to Premium', key: 'premium' }
  ];

  const strugglesOptions = [
    'Staying motivated',
    'Knowing what to revise',
    'Running out of time',
    'Understanding content'
  ];

  const methodOptions = [
    'Flashcards',
    'Practice questions',
    'Reading notes',
    'Watching videos'
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleNext = async () => {
    if (currentStep === 0 && selectedSubjects.length === 0) {
      toast({
        title: "Please select at least one subject",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === steps.length - 2) {
      // Last step before premium - save all data
      await saveOnboardingData();
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const saveOnboardingData = async () => {
    if (!user?.id || selectedSubjects.length === 0) return;

    setIsSubmitting(true);

    try {
      // Save selected subjects to user_subjects table
      const subjectInserts = selectedSubjects.map(subjectId => {
        const subject = SUBJECT_OPTIONS.find(s => s.id === subjectId);
        return {
          user_id: user.id,
          subject_name: subject?.name || '',
          exam_board: subject?.examBoard || '',
          predicted_grade: 'Not set',
          target_grade: 'Not set',
          priority_level: 3
        };
      });

      const { error: subjectsError } = await supabase
        .from('user_subjects')
        .insert(subjectInserts);

      if (subjectsError) {
        console.error('Error saving subjects:', subjectsError);
        toast({
          title: "Error saving subjects",
          description: "Please try again",
          variant: "destructive"
        });
        return;
      }

      // Save onboarding preferences (could be added to profiles table or new table)
      const { error: prefsError } = await supabase
        .from('profiles')
        .update({
          // Add custom metadata for onboarding responses
          // This could be stored in a jsonb field if available
        })
        .eq('id', user.id);

      toast({
        title: "Setup complete! 🎉",
        description: "Your subjects have been added to your dashboard"
      });

    } catch (error) {
      console.error('Error during onboarding save:', error);
      toast({
        title: "Setup error",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipPremium = () => {
    onComplete();
  };

  const handleUpgradePremium = () => {
    openPaymentLink();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Subjects selection
        const groupedSubjects = SUBJECT_OPTIONS.reduce((acc, subject) => {
          if (!acc[subject.name]) acc[subject.name] = [];
          acc[subject.name].push(subject);
          return acc;
        }, {} as Record<string, SubjectOption[]>);

        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">
              Select the subjects and exam boards you're studying for your GCSEs
            </p>
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {Object.entries(groupedSubjects).map(([subjectName, options]) => (
                <div key={subjectName} className="space-y-2">
                  <h4 className="font-semibold text-foreground">{subjectName}</h4>
                  <div className="grid grid-cols-1 gap-2 pl-4">
                    {options.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={() => handleSubjectToggle(subject.id)}
                        />
                        <Label 
                          htmlFor={subject.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span>{subject.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {subject.examBoard}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Selected: {selectedSubjects.length} subjects
            </p>
          </div>
        );

      case 1: // Revision struggle
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              This helps us personalize your experience
            </p>
            <RadioGroup value={revisionStruggle} onValueChange={setRevisionStruggle}>
              {strugglesOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2: // Revision method
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              We'll tailor content recommendations based on your preferences
            </p>
            <RadioGroup value={revisionMethod} onValueChange={setRevisionMethod}>
              {methodOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3: // Parent tracking
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              Optional: Share your progress to keep them in the loop
            </p>
            <RadioGroup value={parentTracking || ''} onValueChange={(value) => setParentTracking(value as 'yes' | 'no')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="parent-yes" />
                <Label htmlFor="parent-yes" className="cursor-pointer">Yes, share my progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="parent-no" />
                <Label htmlFor="parent-no" className="cursor-pointer">No, keep it private</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4: // Premium upgrade
        return (
          <div className="space-y-6">
            {/* Premium Features Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Version */}
              <Card className="border border-muted">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-muted-foreground">Free</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Basic practice questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Limited subject access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Basic progress tracking</span>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Version */}
              <Card className="relative border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 overflow-hidden">
                {/* Premium glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 animate-pulse" />
                
                {/* Premium border */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg p-[2px]">
                  <div className="bg-card rounded-[6px] h-full w-full" />
                </div>

                <CardHeader className="relative text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-violet-500" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">Unlimited practice questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">All subjects & exam boards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">AI-powered study notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">Predicted exam questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium">Grade predictions</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleUpgradePremium}
                size="lg"
                className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Crown className="h-5 w-5 mr-3" />
                ✨ Upgrade to Premium
              </Button>
              
              <Button
                onClick={handleSkipPremium}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Continue with Free Version
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.5, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="relative w-full max-w-2xl"
        >
          <Card className="relative overflow-hidden bg-card">
            {/* Header */}
            <CardHeader className="text-center border-b">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="opacity-70 hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
                <div className="flex items-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onComplete}
                  className="opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold">
                {steps[currentStep]?.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            {/* Footer */}
            {currentStep < steps.length - 1 && (
              <div className="p-6 border-t flex justify-end">
                <Button 
                  onClick={handleNext}
                  disabled={isSubmitting || (currentStep === 1 && !revisionStruggle) || (currentStep === 2 && !revisionMethod)}
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      {currentStep === steps.length - 2 ? 'Continue' : 'Next'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}