import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Target, TrendingUp, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

interface OnboardingData {
  firstName: string;
  grade: string;
  satTiming: string;
  satExperience: string;
  targetScore: number;
}

const GRADES = [
  { id: '9th', label: '9th grade' },
  { id: '10th', label: '10th grade' },
  { id: '11th', label: '11th grade' },
  { id: '12th', label: '12th grade' },
  { id: 'other', label: 'Other' },
];

const SAT_TIMING = [
  { id: 'next_3_months', label: 'Next 3 months' },
  { id: '3_6_months', label: '3-6 months' },
  { id: '6_12_months', label: '6-12 months' },
  { id: 'just_exploring', label: 'Just exploring' },
];

const SAT_EXPERIENCES = [
  { id: 'have_score', label: 'Yes, I have a score' },
  { id: 'first_time', label: "No, this is my first time" },
  { id: 'practice_tests', label: "I've taken practice tests" },
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    firstName: '',
    grade: '',
    satTiming: '',
    satExperience: '',
    targetScore: 1200,
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved onboarding data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOnboardingData(parsed);
      } catch (e) {
        console.error('Failed to parse saved onboarding data:', e);
      }
    }
  }, []);

  // Save onboarding data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
  }, [onboardingData]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return onboardingData.firstName.trim().length > 0;
      case 3:
        return onboardingData.grade !== '' && onboardingData.satTiming !== '' && onboardingData.satExperience !== '';
      case 4:
        return onboardingData.targetScore >= 400 && onboardingData.targetScore <= 1600;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    setShowCompletion(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('profiles')
          .update({
            first_name: onboardingData.firstName,
            exam_type: 'SAT',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }

    setTimeout(() => {
      localStorage.removeItem('onboardingData');
      navigate('/dashboard');
    }, 2000);
  };

  const getProgressPercentage = () => {
    if (currentStep === 1) return 0;
    return ((currentStep - 1) / 4) * 100;
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full overflow-y-auto" style={{
      background: 'linear-gradient(135deg, #0F4C45 0%, #15685E 100%)'
    }}>
      {/* Progress Bar */}
      {currentStep >= 2 && currentStep <= 4 && !showCompletion && (
        <div className="fixed top-0 left-0 w-full h-[6px] bg-white/20 z-50">
          <motion.div
            className="h-full"
            style={{ backgroundColor: '#D4F663' }}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      )}

      {/* Back Button */}
      {currentStep > 1 && currentStep <= 4 && !showCompletion && (
        <button
          onClick={handleBack}
          className="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {/* Content Area */}
      <div className="min-h-screen w-full flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[580px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h1 className="text-[48px] font-bold text-white mb-4 leading-tight">
                      Welcome to Your SAT Prep
                    </h1>
                    <p className="text-[20px] text-white leading-relaxed mb-12 opacity-90">
                      Your personalized SAT prep journey starts here
                    </p>
                    
                    {/* Key Benefits */}
                    <div className="space-y-6 mb-16 max-w-[420px] mx-auto">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-[#D4F663]" />
                        </div>
                        <p className="text-[16px] text-white opacity-85">Personalized study plans</p>
                      </div>
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-[#D4F663]" />
                        </div>
                        <p className="text-[16px] text-white opacity-85">Adaptive practice questions</p>
                      </div>
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-[#D4F663]" />
                        </div>
                        <p className="text-[16px] text-white opacity-85">Track your score improvement</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleNext}
                        className="w-full max-w-[420px] px-12 py-4 rounded-xl text-[#0F4C45] font-semibold text-[18px] transition-all hover:opacity-90"
                        style={{ backgroundColor: '#D4F663' }}
                      >
                        Get started →
                      </button>
                      <p className="text-[14px] text-white opacity-60">Takes 2 minutes • Free to start</p>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Step 2: Name Input */}
              {currentStep === 2 && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">Let's personalize your experience</h2>
                  <p className="text-[18px] text-white/80 mb-8">What should we call you?</p>
                  
                  <div className="w-full max-w-[480px]">
                    <label className="block text-left text-[16px] text-white opacity-70 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={onboardingData.firstName}
                      onChange={(e) => setOnboardingData({ ...onboardingData, firstName: e.target.value })}
                      className="w-full px-6 py-4 text-[18px] bg-transparent border-2 border-white text-white placeholder:text-white/60 rounded-xl focus:outline-none focus:border-white/90 transition-colors mb-8 h-[56px]"
                      autoFocus
                    />

                    <button
                      onClick={handleNext}
                      disabled={!canContinue()}
                      className="w-full py-4 rounded-xl text-[#0F4C45] font-semibold text-[18px] transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[56px]"
                      style={{ backgroundColor: '#D4F663' }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Profile Setup */}
              {currentStep === 3 && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">
                    Tell us about yourself{onboardingData.firstName ? `, ${onboardingData.firstName}` : ''}
                  </h2>
                  <p className="text-[18px] text-white/80 mb-10">This helps us tailor your study plan</p>
                  
                  <div className="w-full max-w-[520px] space-y-8">
                    {/* Grade Selection */}
                    <div className="text-left">
                      <label className="block text-[16px] text-white mb-3 font-medium">
                        What grade are you in?
                      </label>
                      <div className="space-y-3">
                        {GRADES.map((grade) => (
                          <button
                            key={grade.id}
                            onClick={() => setOnboardingData({ ...onboardingData, grade: grade.id })}
                            className={`w-full flex items-center justify-center h-14 rounded-xl border-2 transition-all cursor-pointer ${
                              onboardingData.grade === grade.id
                                ? 'border-[#D4F663] bg-[#D4F663]/20'
                                : 'border-white/20 bg-white/10 hover:bg-white/15'
                            }`}
                          >
                            <span className="text-[16px] text-white font-medium">{grade.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SAT Timing */}
                    <div className="text-left">
                      <label className="block text-[16px] text-white mb-3 font-medium">
                        When are you taking the SAT?
                      </label>
                      <div className="space-y-3">
                        {SAT_TIMING.map((timing) => (
                          <button
                            key={timing.id}
                            onClick={() => setOnboardingData({ ...onboardingData, satTiming: timing.id })}
                            className={`w-full flex items-center justify-center h-14 rounded-xl border-2 transition-all cursor-pointer ${
                              onboardingData.satTiming === timing.id
                                ? 'border-[#D4F663] bg-[#D4F663]/20'
                                : 'border-white/20 bg-white/10 hover:bg-white/15'
                            }`}
                          >
                            <span className="text-[16px] text-white font-medium">{timing.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SAT Experience */}
                    <div className="text-left">
                      <label className="block text-[16px] text-white mb-3 font-medium">
                        Have you taken the SAT before?
                      </label>
                      <div className="space-y-3">
                        {SAT_EXPERIENCES.map((exp) => (
                          <button
                            key={exp.id}
                            onClick={() => setOnboardingData({ ...onboardingData, satExperience: exp.id })}
                            className={`w-full flex items-center justify-center h-14 rounded-xl border-2 transition-all cursor-pointer ${
                              onboardingData.satExperience === exp.id
                                ? 'border-[#D4F663] bg-[#D4F663]/20'
                                : 'border-white/20 bg-white/10 hover:bg-white/15'
                            }`}
                          >
                            <span className="text-[16px] text-white font-medium">{exp.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={!canContinue()}
                      className="w-full py-4 rounded-xl text-[#0F4C45] font-semibold text-[18px] transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[56px]"
                      style={{ backgroundColor: '#D4F663' }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Target Score */}
              {currentStep === 4 && !showCompletion && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">What's your target SAT score?</h2>
                  <p className="text-[18px] text-white/80 mb-16">Don't worry, you can change this anytime</p>
                  
                  <div className="w-full max-w-[520px]">
                    {/* Score display */}
                    <div className="mb-12">
                      <div className="text-[96px] font-bold text-white mb-2">
                        {onboardingData.targetScore}
                      </div>
                      <div className="text-[16px] text-white/50">
                        out of 1600
                      </div>
                    </div>
                    
                    {/* Yellow slider */}
                    <div className="mb-8">
                      <Slider
                        value={[onboardingData.targetScore]}
                        onValueChange={(value) => setOnboardingData({ ...onboardingData, targetScore: value[0] })}
                        min={400}
                        max={1600}
                        step={10}
                        className="mb-4 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/15 [&_span_span]:bg-[#D4F663] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md"
                      />
                      
                      <div className="flex justify-between text-[14px] text-white/50 font-medium">
                        <span>400</span>
                        <span>1600</span>
                      </div>
                    </div>

                    {/* Context box */}
                    <div className="bg-white/[0.08] border border-white/20 rounded-lg px-[18px] py-[14px] flex gap-3 mb-10">
                      <span className="text-[20px]">💡</span>
                      <div className="text-[15px] text-white text-left opacity-90">
                        Average SAT score is ~1050. Top schools look for 1400+
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-4 rounded-xl text-[#0F4C45] font-semibold text-[18px] transition-all h-[56px]"
                      style={{ backgroundColor: '#D4F663' }}
                    >
                      Start my journey →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Loading/Success */}
              {currentStep === 5 && (
                <div className="text-center py-12">
                  {!showCompletion ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-[36px] font-bold text-white mb-8">Creating your personalized study plan...</h2>
                      <Loader2 className="w-12 h-12 text-[#D4F663] animate-spin mx-auto mb-6" />
                      <p className="text-[18px] text-white/70">This will only take a moment</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Success icon */}
                      <div className="w-24 h-24 rounded-full bg-[#D4F663] flex items-center justify-center mx-auto mb-8">
                        <Check className="w-12 h-12 text-[#0F4C45]" />
                      </div>
                      
                      <h2 className="text-[48px] font-bold text-white mb-3">
                        You're all set{onboardingData.firstName ? `, ${onboardingData.firstName}` : ''}!
                      </h2>
                      <p className="text-[20px] text-white/80 mb-12">Your personalized study plan is ready</p>
                      
                      {/* Stats preview */}
                      <div className="space-y-4 mb-12 max-w-[420px] mx-auto">
                        <div className="flex items-center gap-3 text-left">
                          <span className="text-[24px]">📚</span>
                          <p className="text-[18px] text-white opacity-85">8 topics identified for improvement</p>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <span className="text-[24px]">⏱️</span>
                          <p className="text-[18px] text-white opacity-85">20 mins/day recommended study time</p>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <span className="text-[24px]">📅</span>
                          <p className="text-[18px] text-white opacity-85">12 weeks to reach your goal</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
