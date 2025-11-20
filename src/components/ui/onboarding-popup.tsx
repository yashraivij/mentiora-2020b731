import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { Slider } from "@/components/ui/slider";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectsAdded: () => void;
}

interface OnboardingData {
  firstName: string;
  grade: string;
  satExperience: string;
  targetScore: number;
  profileEmoji: string;
}

const GRADES = [
  { id: '9th', label: '9th grade (Freshman)' },
  { id: '10th', label: '10th grade (Sophomore)' },
  { id: '11th', label: '11th grade (Junior)' },
  { id: '12th', label: '12th grade (Senior)' },
  { id: 'gap_year', label: 'Taking a gap year' },
  { id: 'other', label: 'Other' },
];

const SAT_EXPERIENCES = [
  { id: 'taken_real', label: "I've taken the real SAT" },
  { id: 'practice_tests', label: "I've taken practice tests" },
  { id: 'both', label: "I've done both" },
  { id: 'just_starting', label: "I'm just getting started" },
];

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(0);
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
      case 0:
        return true;
      case 1:
        return onboardingData.firstName.trim().length > 0;
      case 2:
        return onboardingData.grade !== '';
      case 3:
        return onboardingData.satExperience !== '';
      case 4:
        return onboardingData.targetScore >= 400 && onboardingData.targetScore <= 1600;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    setShowCompletion(true);
    setCompletionStage(1);

    setTimeout(() => setCompletionStage(2), 1200);
    setTimeout(() => setCompletionStage(3), 2400);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
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
    onSubjectsAdded();
    onClose();
    navigate('/dashboard');
  };

  const getProgressPercentage = () => {
    if (currentStep === 0) return 0;
    return (currentStep / 5) * 100;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-[12px] w-[640px] max-h-[85vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}
      >
        <div className="p-10 flex-1 overflow-y-auto">
          {/* Progress Bar */}
          {currentStep >= 1 && currentStep <= 5 && !showCompletion && (
            <div className="mb-8">
              <div className="w-full h-[6px] bg-[#E5E7EB] rounded-[3px] overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <p className="text-[14px] text-[#6B7280] text-center font-normal">
                Step {currentStep} of 5
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-[12px] flex items-center justify-center bg-[#2563EB]">
                      <img
                        src={mentioraLogo}
                        alt="Mentiora"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <h1 className="text-[32px] font-bold text-[#111827] mb-3" style={{ lineHeight: 1.4 }}>
                      Welcome to Mentiora
                    </h1>
                    <p className="text-[16px] text-[#6B7280] font-normal max-w-[420px] mx-auto" style={{ lineHeight: 1.6 }}>
                      Let's personalize your SAT prep journey in under a minute
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full h-[56px] rounded-[12px] text-white font-semibold text-[17px] bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200"
                  >
                    Let's go →
                  </button>

                  <p className="text-[14px] text-[#9CA3AF] mt-5 font-normal">
                    Takes about 60 seconds • Your info stays private
                  </p>
                </div>
              )}

              {/* Step 1: What's your name? */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-[32px] font-bold text-[#111827] mb-3" style={{ lineHeight: 1.4 }}>
                    What should we call you?
                  </h2>
                  <p className="text-[16px] text-[#6B7280] font-normal mb-8" style={{ lineHeight: 1.6 }}>
                    We'll use this to personalize your experience
                  </p>
                  
                  <input
                    type="text"
                    placeholder="First name"
                    value={onboardingData.firstName}
                    onChange={(e) => setOnboardingData({ ...onboardingData, firstName: e.target.value })}
                    className="w-full h-[56px] px-4 text-[16px] font-medium border-2 border-[#E5E7EB] rounded-[12px] focus:outline-none focus:border-[#2563EB] transition-colors"
                    autoFocus
                  />
                </div>
              )}

              {/* Step 2: What grade are you in? */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-[32px] font-bold text-[#111827] mb-3" style={{ lineHeight: 1.4 }}>
                    What grade are you in?
                  </h2>
                  <p className="text-[16px] text-[#6B7280] font-normal mb-8" style={{ lineHeight: 1.6 }}>
                    This helps us show you relevant content
                  </p>
                  <div className="space-y-4">
                    {GRADES.map((grade) => (
                      <button
                        key={grade.id}
                        onClick={() => setOnboardingData({ ...onboardingData, grade: grade.id })}
                        className={`w-full h-[64px] flex items-center justify-between px-6 rounded-[12px] border-2 transition-all duration-200 ${
                          onboardingData.grade === grade.id
                            ? 'border-[#2563EB] bg-[#EFF6FF]'
                            : 'border-[#E5E7EB] hover:border-[#93C5FD]'
                        }`}
                        style={{ boxShadow: onboardingData.grade === grade.id ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' }}
                      >
                        <span className="text-[16px] font-medium text-[#111827]">{grade.label}</span>
                        {onboardingData.grade === grade.id && (
                          <Check className="w-5 h-5 text-[#2563EB]" strokeWidth={2.5} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: What's your SAT experience? */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-[32px] font-bold text-[#111827] mb-3" style={{ lineHeight: 1.4 }}>
                    What's your experience with the SAT?
                  </h2>
                  <p className="text-[16px] text-[#6B7280] font-normal mb-8" style={{ lineHeight: 1.6 }}>
                    No worries if you're just starting—we'll meet you where you are
                  </p>
                  <div className="space-y-4">
                    {SAT_EXPERIENCES.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => setOnboardingData({ ...onboardingData, satExperience: exp.id })}
                        className={`w-full h-[64px] flex items-center justify-between px-6 rounded-[12px] border-2 transition-all duration-200 ${
                          onboardingData.satExperience === exp.id
                            ? 'border-[#2563EB] bg-[#EFF6FF]'
                            : 'border-[#E5E7EB] hover:border-[#93C5FD]'
                        }`}
                        style={{ boxShadow: onboardingData.satExperience === exp.id ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' }}
                      >
                        <span className="text-[16px] font-medium text-[#111827]">{exp.label}</span>
                        {onboardingData.satExperience === exp.id && (
                          <Check className="w-5 h-5 text-[#2563EB]" strokeWidth={2.5} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: What's your target score? */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-[32px] font-bold text-[#111827] mb-3" style={{ lineHeight: 1.4 }}>
                    What's your dream SAT score?
                  </h2>
                  <p className="text-[16px] text-[#6B7280] font-normal mb-8" style={{ lineHeight: 1.6 }}>
                    Don't worry, we can adjust this later
                  </p>
                  
                  <div className="bg-[#F9FAFB] rounded-[12px] p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div className="text-center mb-8">
                      <div className="text-[56px] font-bold text-[#2563EB] mb-2" style={{ lineHeight: 1 }}>
                        {onboardingData.targetScore}
                      </div>
                      <div className="text-[14px] text-[#6B7280] font-normal">
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
                    
                    <div className="flex justify-between text-[13px] text-[#9CA3AF] font-medium">
                      <span>400</span>
                      <span>1600</span>
                    </div>
                  </div>

                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-[12px] p-4">
                    <div className="text-[14px] text-[#92400E] font-normal" style={{ lineHeight: 1.6 }}>
                      <strong className="font-semibold">Tip:</strong> Average SAT score is ~1050. Top schools look for 1400+
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Completion animation */}
              {showCompletion && (
                <div className="text-center py-8">
                  <AnimatePresence mode="wait">
                    {completionStage === 1 && (
                      <motion.div
                        key="stage1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 mx-auto mb-6 bg-[#2563EB] rounded-full flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
                          />
                        </div>
                        <h2 className="text-[28px] font-bold text-[#111827] mb-2" style={{ lineHeight: 1.4 }}>
                          Setting up your personalized learning plan
                        </h2>
                        <p className="text-[16px] text-[#6B7280] font-normal" style={{ lineHeight: 1.6 }}>
                          This will only take a moment
                        </p>
                      </motion.div>
                    )}

                    {completionStage === 2 && (
                      <motion.div
                        key="stage2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 mx-auto mb-6 bg-[#2563EB] rounded-full flex items-center justify-center">
                          <Check className="w-8 h-8 text-white" strokeWidth={3} />
                        </div>
                        <h2 className="text-[28px] font-bold text-[#111827] mb-2" style={{ lineHeight: 1.4 }}>
                          Almost there
                        </h2>
                        <p className="text-[16px] text-[#6B7280] font-normal" style={{ lineHeight: 1.6 }}>
                          Preparing your dashboard
                        </p>
                      </motion.div>
                    )}

                    {completionStage === 3 && (
                      <motion.div
                        key="stage3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-[56px] mb-6">
                          🎉
                        </div>
                        <h2 className="text-[32px] font-bold text-[#111827] mb-3" style={{ lineHeight: 1.4 }}>
                          You're all set!
                        </h2>
                        <p className="text-[16px] text-[#6B7280] mb-10 font-normal" style={{ lineHeight: 1.6 }}>
                          Let's start crushing your SAT prep
                        </p>
                        
                        <button
                          onClick={handleFinish}
                          className="w-full h-[56px] rounded-[12px] text-white font-semibold text-[17px] bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-200"
                          style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
                        >
                          Go to Dashboard →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {currentStep > 0 && currentStep <= 5 && !showCompletion && (
            <div className="flex gap-3 mt-10">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 h-[56px] rounded-[12px] font-semibold text-[17px] text-[#6B7280] border-2 border-[#E5E7EB] hover:border-[#D1D5DB] transition-all duration-200"
                >
                  ← Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`flex-1 h-[56px] rounded-[12px] font-semibold text-[17px] text-white transition-all duration-200 ${
                  canContinue()
                    ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                    : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                }`}
                style={{ boxShadow: canContinue() ? '0 2px 8px rgba(37,99,235,0.3)' : 'none' }}
              >
                {currentStep === 4 ? 'Start my journey →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
