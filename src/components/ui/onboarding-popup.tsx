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
  { id: '9th', label: '9th grade (Freshman)', emoji: '📚' },
  { id: '10th', label: '10th grade (Sophomore)', emoji: '📚' },
  { id: '11th', label: '11th grade (Junior)', emoji: '🎓' },
  { id: '12th', label: '12th grade (Senior)', emoji: '🎓' },
  { id: 'gap_year', label: 'Taking a gap year', emoji: '🌍' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

const SAT_EXPERIENCES = [
  { id: 'taken_real', label: "I've taken the real SAT", emoji: '📝' },
  { id: 'practice_tests', label: "I've taken practice tests", emoji: '📖' },
  { id: 'both', label: "I've done both", emoji: '🎯' },
  { id: 'just_starting', label: "I'm just getting started", emoji: '🌱' },
];

const PROFILE_EMOJIS = [
  '😊', '😎', '🤓', '😄', '🥳', '😇', '🤩', '😁', '😀', '🙂',
  '😌', '🤗', '🥰', '😏', '🤠', '🧐', '🤔', '🤫', '🤪', '😜',
  '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐶', '🐱', '🐰', '🐸',
  '🦄', '🐙', '🦉', '🦆', '🐧', '🦋', '🐝', '🦈', '🐬', '🦑',
  '🎯', '⚡', '✨', '🔥', '💡', '🌟', '💫', '🎨', '🎸', '🎮',
  '🚀', '🛸', '🌈', '⭐', '🌙', '☀️', '🌺', '🌻', '🍕', '🍔'
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
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-[24px] shadow-[0px_20px_80px_rgba(0,0,0,0.2)] w-[90%] max-w-[560px] p-10 max-h-[88vh] overflow-hidden flex flex-col"
      >
        {/* Progress Bar */}
        {currentStep >= 1 && currentStep <= 5 && !showCompletion && (
          <div className="mb-6 flex-shrink-0">
            <div className="w-full h-[6px] bg-[#E5E7EB] rounded-[3px] overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#3B82F6]"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <p className="text-[13px] text-[#6B7280] text-center font-medium">
              Step {currentStep} of 5
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 overflow-y-auto"
          >
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-[#3B82F6] to-[#2563EB] shadow-xl">
                    <img
                      src={mentioraLogo}
                      alt="Mentiora"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h1 className="text-[34px] font-bold text-black mb-3 leading-tight">
                    Welcome to Mentiora! 👋
                  </h1>
                  <p className="text-[17px] text-[#6B7280] max-w-[400px] mx-auto leading-relaxed">
                    Let's personalize your SAT prep journey in under a minute
                  </p>
                </motion.div>

                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  onClick={handleNext}
                  className="w-full py-4 rounded-[14px] text-white font-semibold text-[16px] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  Let's go
                  <span className="text-[18px]">→</span>
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-[13px] text-[#9CA3AF] mt-5"
                >
                  Takes about 60 seconds • Your info stays private 🔒
                </motion.p>
              </div>
            )}

            {/* Step 1: What's your name? */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">What should we call you?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">We'll use this to personalize your experience</p>
                
                <input
                  type="text"
                  placeholder="First name"
                  value={onboardingData.firstName}
                  onChange={(e) => setOnboardingData({ ...onboardingData, firstName: e.target.value })}
                  className="w-full px-4 py-3 text-[15px] border-2 border-[#E5E7EB] rounded-[12px] focus:outline-none focus:border-[#3B82F6] transition-colors"
                  autoFocus
                />
              </div>
            )}

            {/* Step 2: What grade are you in? */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">What grade are you in?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">This helps us show you relevant content</p>
                <div className="space-y-2.5">
                  {GRADES.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => setOnboardingData({ ...onboardingData, grade: grade.id })}
                      className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all ${
                        onboardingData.grade === grade.id
                          ? 'border-[#3B82F6] bg-[#F0F9FF]'
                          : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">{grade.emoji}</span>
                        <span className="text-[15px] font-medium">{grade.label}</span>
                      </div>
                      {onboardingData.grade === grade.id && (
                        <Check className="w-[20px] h-[20px] text-[#3B82F6]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: What's your SAT experience? */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">What's your experience with the SAT?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">No worries if you're just starting—we'll meet you where you are!</p>
                <div className="space-y-2.5">
                  {SAT_EXPERIENCES.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setOnboardingData({ ...onboardingData, satExperience: exp.id })}
                      className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all ${
                        onboardingData.satExperience === exp.id
                          ? 'border-[#3B82F6] bg-[#F0F9FF]'
                          : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">{exp.emoji}</span>
                        <span className="text-[15px] font-medium">{exp.label}</span>
                      </div>
                      {onboardingData.satExperience === exp.id && (
                        <Check className="w-[20px] h-[20px] text-[#3B82F6]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: What's your target score? */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">What's your dream SAT score?</h2>
                <p className="text-[15px] text-[#6B7280] mb-6">Don't worry, we can adjust this later!</p>
                
                <div className="bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] rounded-[16px] p-8 mb-6">
                  <div className="text-center mb-6">
                    <div className="text-[56px] font-bold text-[#3B82F6] mb-2">
                      {onboardingData.targetScore}
                    </div>
                    <div className="text-[13px] text-[#6B7280]">
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
                  
                  <div className="flex justify-between text-[12px] text-[#9CA3AF] font-medium">
                    <span>400</span>
                    <span>1600</span>
                  </div>
                </div>

                <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-[12px] p-4 flex gap-3">
                  <span className="text-[20px]">💡</span>
                  <div className="text-[13px] text-[#92400E]">
                    <strong>Tip:</strong> Average SAT score is ~1050. Top schools look for 1400+
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
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
                        />
                      </div>
                      <h2 className="text-[24px] font-bold text-black mb-2">Setting up your personalized learning plan...</h2>
                      <p className="text-[15px] text-[#6B7280]">This will only take a moment</p>
                    </motion.div>
                  )}

                  {completionStage === 2 && (
                    <motion.div
                      key="stage2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          <Check className="w-10 h-10 text-white" strokeWidth={3} />
                        </motion.div>
                      </div>
                      <h2 className="text-[24px] font-bold text-black mb-2">Almost there...</h2>
                      <p className="text-[15px] text-[#6B7280]">Preparing your dashboard</p>
                    </motion.div>
                  )}

                  {completionStage === 3 && (
                    <motion.div
                      key="stage3"
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
                      <h2 className="text-[32px] font-bold text-black mb-3">You're all set!</h2>
                      <p className="text-[17px] text-[#6B7280] mb-8">Let's start crushing your SAT prep</p>
                      
                      <motion.button
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleFinish}
                        className="w-full py-4 rounded-[14px] text-white font-semibold text-[16px] shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: '#3B82F6' }}
                      >
                        Go to Dashboard →
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentStep > 0 && currentStep <= 5 && !showCompletion && (
          <div className="flex gap-3 mt-6 flex-shrink-0">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-[12px] font-medium text-[15px] text-[#6B7280] border-2 border-[#E5E7EB] hover:border-[#D1D5DB] transition-all"
              >
                ← Back
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className={`flex-1 py-3 rounded-[12px] font-semibold text-[15px] text-white transition-all duration-300 ${
                canContinue()
                  ? 'shadow-md hover:shadow-lg'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: '#3B82F6' }}
            >
              {currentStep === 4 ? 'Start my journey →' : 'Continue →'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
