import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

interface OnboardingData {
  firstName: string;
  grade: string;
  satExperience: string;
  targetScore: number;
  profileEmoji: string;
}

const GRADES = [
  { id: '9th', label: '9th grade' },
  { id: '10th', label: '10th grade' },
  { id: '11th', label: '11th grade' },
  { id: '12th', label: '12th grade' },
  { id: 'not_in_hs', label: "I'm not in high school yet" },
  { id: 'other', label: 'Other' },
];

const SAT_EXPERIENCES = [
  { id: 'taken_real', label: "I've taken the real SAT" },
  { id: 'practice_tests', label: "I've taken practice tests" },
  { id: 'both', label: "I've done both" },
  { id: 'just_starting', label: "I'm just getting started" },
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    firstName: '',
    grade: '',
    satExperience: '',
    targetScore: 1200,
    profileEmoji: '😊',
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionStage, setCompletionStage] = useState(1);
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
        return onboardingData.grade !== '';
      case 4:
        return onboardingData.satExperience !== '';
      case 5:
        return onboardingData.targetScore >= 400 && onboardingData.targetScore <= 1600;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    setShowCompletion(true);
    setCompletionStage(1);

    setTimeout(() => setCompletionStage(2), 1200);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update user profile with SAT-specific data
        await supabase
          .from('profiles')
          .update({
            first_name: onboardingData.firstName,
            profile_emoji: onboardingData.profileEmoji,
            exam_type: 'SAT',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }

    localStorage.removeItem('onboardingData');
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const getProgressPercentage = () => {
    return (currentStep / 5) * 100;
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full overflow-y-auto" style={{
      background: 'linear-gradient(135deg, #0F4C45 0%, #15685E 100%)'
    }}>
      {/* Progress Bar */}
      {currentStep >= 2 && currentStep <= 5 && !showCompletion && (
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
      {currentStep > 1 && currentStep <= 5 && !showCompletion && (
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
                      Hey there! 👋
                    </h1>
                    <p className="text-[20px] text-white leading-relaxed mb-12 opacity-90">
                      Let's kick things off with a few quick questions<br />about your study goals.
                    </p>
                    
                    {/* Mascot */}
                    <div className="mb-16 flex justify-center">
                      <div className="text-[150px]">
                        🐌
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        className="px-12 py-4 rounded-full text-[#0F4C45] font-semibold text-[18px] transition-all hover:opacity-90"
                        style={{ backgroundColor: '#D4F663' }}
                      >
                        Let's go →
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Step 2: Name Input */}
              {currentStep === 2 && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">What should we call you?</h2>
                  <p className="text-[18px] text-white/80 mb-8">We'll use this to personalize your experience</p>
                  
                  <div className="w-full max-w-[480px]">
                    <input
                      type="text"
                      placeholder="First name"
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

              {/* Step 3: Grade Selection */}
              {currentStep === 3 && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">What grade are you in?</h2>
                  <p className="text-[18px] text-white/80 mb-8">The more we know about you, the better we can guide your SAT journey!</p>
                  
                  <div className="w-full max-w-[520px]">
                    <div className="space-y-4 mb-8">
                      {GRADES.map((grade) => (
                        <button
                          key={grade.id}
                          onClick={() => setOnboardingData({ ...onboardingData, grade: grade.id })}
                          className={`w-full flex items-center justify-center h-16 rounded-xl border-2 transition-all cursor-pointer ${
                            onboardingData.grade === grade.id
                              ? 'border-[#D4F663] bg-[#D4F663]/20'
                              : 'border-white/20 bg-white/10 hover:bg-white/15'
                          }`}
                        >
                          <span className="text-[18px] text-white font-medium">{grade.label}</span>
                        </button>
                      ))}
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

              {/* Step 4: Experience */}
              {currentStep === 4 && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">What's your experience with the SAT?</h2>
                  <p className="text-[18px] text-white/80 mb-8">Whether you're just starting out or giving it another go, we're here to help!</p>
                  
                  <div className="w-full max-w-[520px]">
                    <div className="space-y-4 mb-8">
                      {SAT_EXPERIENCES.map((exp) => (
                        <button
                          key={exp.id}
                          onClick={() => setOnboardingData({ ...onboardingData, satExperience: exp.id })}
                          className={`w-full flex items-center justify-center h-16 rounded-xl border-2 transition-all cursor-pointer ${
                            onboardingData.satExperience === exp.id
                              ? 'border-[#D4F663] bg-[#D4F663]/20'
                              : 'border-white/20 bg-white/10 hover:bg-white/15'
                          }`}
                        >
                          <span className="text-[18px] text-white font-medium">{exp.label}</span>
                        </button>
                      ))}
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

              {/* Step 5: Target Score */}
              {currentStep === 5 && !showCompletion && (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[36px] font-bold text-white mb-3">What's your dream SAT score?</h2>
                  <p className="text-[18px] text-white/80 mb-8">Don't worry, we can adjust this later!</p>
                  
                  <div className="w-full max-w-[520px]">
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-8 mb-6">
                      <div className="text-center mb-8">
                        <div className="text-[72px] font-bold text-white mb-2">
                          {onboardingData.targetScore}
                        </div>
                        <div className="text-[16px] text-white/60">
                          out of 1600
                        </div>
                      </div>
                      
                      <Slider
                        value={[onboardingData.targetScore]}
                        onValueChange={(value) => setOnboardingData({ ...onboardingData, targetScore: value[0] })}
                        min={400}
                        max={1600}
                        step={10}
                        className="mb-4"
                      />
                      
                      <div className="flex justify-between text-[14px] text-white/60 font-medium">
                        <span>400</span>
                        <span>1600</span>
                      </div>
                    </div>

                    <div className="bg-[#D4F663]/20 border border-[#D4F663]/40 rounded-xl p-4 flex gap-3 mb-8">
                      <span className="text-[20px]">💡</span>
                      <div className="text-[14px] text-white text-left">
                        <strong>Tip:</strong> Average SAT score is ~1050. Top schools look for 1400+
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

              {/* Step 6: Loading/Success */}
              {showCompletion && (
                <div className="text-center py-12">
                  <AnimatePresence mode="wait">
                    {completionStage === 1 && (
                      <motion.div
                        key="stage1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h2 className="text-[36px] font-bold text-white mb-4">Final stretch!</h2>
                        <p className="text-[18px] text-white/80 mb-8">Let's finish strong and make those college dreams real. 💪</p>
                        
                        <div className="flex justify-center mb-8">
                          <div className="text-[120px] animate-bounce">
                            🐌
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {completionStage === 2 && (
                      <motion.div
                        key="stage2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                          className="text-[72px] mb-6"
                        >
                          🎉
                        </motion.div>
                        <h2 className="text-[36px] font-bold text-white mb-3">You're all set!</h2>
                        <p className="text-[18px] text-white/80 mb-12">Let's start crushing your SAT prep</p>
                        
                        <button
                          onClick={handleFinish}
                          className="w-full py-4 rounded-full text-[#0F4C45] font-semibold text-[18px] transition-all"
                          style={{ backgroundColor: '#D4F663' }}
                        >
                          Continue
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
