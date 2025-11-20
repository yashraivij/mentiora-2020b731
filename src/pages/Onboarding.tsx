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
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)'
    }}>
      {/* Progress Bar */}
      {currentStep >= 2 && currentStep <= 5 && !showCompletion && (
        <div className="fixed top-0 left-0 w-full h-[6px] bg-white/20 z-50">
          <motion.div
            className="h-full"
            style={{ backgroundColor: '#FF6B35' }}
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
                <div className="text-center w-full">
                  {/* App Logo/Name */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-[80px]"
                  >
                    <h2 className="text-[24px] font-semibold text-white tracking-wide">
                      SAT Prep AI
                    </h2>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="text-[56px] max-lg:text-[48px] max-md:text-[40px] font-bold text-white mb-5 leading-[1.1] max-w-[800px] mx-auto"
                  >
                    Ace Your SAT With Confidence
                  </motion.h1>

                  {/* Subheading */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="text-[22px] max-md:text-[18px] text-[#F1F5F9] opacity-90 leading-relaxed mb-20 max-w-[600px] mx-auto"
                  >
                    Personalized AI-powered prep that adapts to your learning style
                  </motion.p>

                  {/* Feature Cards */}
                  <div className="max-w-[1000px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {/* Card 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="bg-white/[0.08] border border-white/[0.12] rounded-2xl p-8 backdrop-blur-[10px] hover:bg-white/[0.12] hover:scale-[1.02] transition-all duration-200"
                    >
                      <div className="w-12 h-12 mb-4 mx-auto">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 40V32M8 32V24M8 32H16M8 24V16M8 16V8H16M8 16H16M16 8H24M16 8V16M16 16H24M16 16V24M16 24H8M16 24V32M16 32H24M24 8H32M24 8V16M24 16H32M24 16V24M24 24H16M24 24V32M24 32H32M32 8H40V16M32 16H40M32 16V24M32 24H40M32 24V32M32 32H40M40 16V24M40 24V32M40 32V40H32" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="text-[20px] font-bold text-white mb-2">
                        Personalized Plans
                      </h3>
                      <p className="text-[16px] text-[#F1F5F9] opacity-80 leading-relaxed">
                        AI adapts to your strengths and weaknesses in real-time
                      </p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="bg-white/[0.08] border border-white/[0.12] rounded-2xl p-8 backdrop-blur-[10px] hover:bg-white/[0.12] hover:scale-[1.02] transition-all duration-200"
                    >
                      <div className="w-12 h-12 mb-4 mx-auto">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="24" cy="24" r="18" stroke="#FF6B35" strokeWidth="3"/>
                          <circle cx="24" cy="24" r="10" stroke="#FF6B35" strokeWidth="3"/>
                          <circle cx="24" cy="24" r="3" fill="#FF6B35"/>
                          <path d="M24 6V14M24 34V42M6 24H14M34 24H42" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h3 className="text-[20px] font-bold text-white mb-2">
                        Proven Results
                      </h3>
                      <p className="text-[16px] text-[#F1F5F9] opacity-80 leading-relaxed">
                        Students improve 150+ points on average with our adaptive system
                      </p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      className="bg-white/[0.08] border border-white/[0.12] rounded-2xl p-8 backdrop-blur-[10px] hover:bg-white/[0.12] hover:scale-[1.02] transition-all duration-200"
                    >
                      <div className="w-12 h-12 mb-4 mx-auto">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 4L26.4 14.4L32 8L28.8 18.4L40 16L30.4 22.4L42 24L30.4 25.6L40 32L28.8 29.6L32 40L26.4 33.6L24 44L21.6 33.6L16 40L19.2 29.6L8 32L17.6 25.6L6 24L17.6 22.4L8 16L19.2 18.4L16 8L21.6 14.4L24 4Z" fill="#FF6B35" stroke="#FF6B35" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="text-[20px] font-bold text-white mb-2">
                        Study Smarter
                      </h3>
                      <p className="text-[16px] text-[#F1F5F9] opacity-80 leading-relaxed">
                        Focus on what matters most with our intelligent practice algorithm
                      </p>
                    </motion.div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="mb-5"
                  >
                    <button
                      onClick={handleNext}
                      className="w-[280px] max-md:w-full max-md:max-w-[320px] h-16 bg-[#FF6B35] hover:bg-[#FF5722] text-white font-semibold text-[18px] rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                      style={{ boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)' }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 107, 53, 0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.3)'}
                    >
                      Get Started →
                    </button>
                  </motion.div>

                  {/* Bottom Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    className="text-[15px] text-[#F1F5F9] opacity-60"
                  >
                    Takes 2 minutes • Free to start
                  </motion.p>
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
                      className="w-full py-4 rounded-xl text-white font-semibold text-[18px] transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[56px] bg-[#FF6B35] hover:bg-[#FF5722]"
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
                              ? 'border-[#FF6B35] bg-[#FF6B35]/20'
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
                      className="w-full py-4 rounded-xl text-white font-semibold text-[18px] transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[56px] bg-[#FF6B35] hover:bg-[#FF5722]"
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
                              ? 'border-[#FF6B35] bg-[#FF6B35]/20'
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
                      className="w-full py-4 rounded-xl text-white font-semibold text-[18px] transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[56px] bg-[#FF6B35] hover:bg-[#FF5722]"
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
                  <p className="text-[18px] text-white/80 mb-16">Don't worry, we can adjust this later!</p>
                  
                  <div className="w-full max-w-[520px]">
                    {/* Score display - no box, floats on background */}
                    <div className="text-center mb-12">
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
                        className="mb-4 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/20 [&_span_span]:bg-[#FF6B35] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md"
                      />
                      
                      <div className="flex justify-between text-[14px] text-white/50 font-medium">
                        <span>400</span>
                        <span>1600</span>
                      </div>
                    </div>

                    {/* Minimal tip box */}
                    <div className="bg-[#FF6B35]/[0.08] border border-[#FF6B35]/25 rounded-lg px-[18px] py-[14px] flex gap-3 mb-10">
                      <span className="text-[20px]">💡</span>
                      <div className="text-[14px] text-white text-left">
                        <strong>Tip:</strong> Average SAT score is ~1050. Top schools look for 1400+
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-4 rounded-xl text-white font-semibold text-[18px] transition-all h-[56px] bg-[#FF6B35] hover:bg-[#FF5722]"
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
                          className="w-full py-4 rounded-full text-white font-semibold text-[18px] transition-all bg-[#FF6B35] hover:bg-[#FF5722]"
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
