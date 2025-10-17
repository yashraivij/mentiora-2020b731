import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectsAdded: () => void;
}

interface OnboardingData {
  acquisitionSource: string;
  acquisitionSourceOther: string | null;
  yearGroup: string;
  subjects: string[];
  studyPreferences: string[];
  parentUpdates: boolean;
  parentEmail: string | null;
}

const SUBJECTS = [
  { id: 'biology', name: 'Biology', emoji: '🧬' },
  { id: 'chemistry', name: 'Chemistry', emoji: '⚗️' },
  { id: 'physics', name: 'Physics', emoji: '⚛️' },
  { id: 'maths', name: 'Mathematics', emoji: '🔢' },
  { id: 'english-language', name: 'English Language', emoji: '📖' },
  { id: 'english-literature', name: 'English Literature', emoji: '📚' },
  { id: 'computer-science', name: 'Computer Science', emoji: '💻' },
  { id: 'business', name: 'Business', emoji: '💼' },
  { id: 'geography', name: 'Geography', emoji: '🌍' },
  { id: 'history', name: 'History', emoji: '📜' },
  { id: 'religious-studies', name: 'Religious Studies', emoji: '🕌' },
  { id: 'psychology', name: 'Psychology', emoji: '🧠' },
  { id: 'music', name: 'Music', emoji: '🎵' },
  { id: 'art', name: 'Art & Design', emoji: '🎨' },
  { id: 'drama', name: 'Drama', emoji: '🎭' },
  { id: 'pe', name: 'Physical Education', emoji: '⚽' },
];

const ACQUISITION_SOURCES = [
  { id: 'google', label: 'Google search', emoji: '🔍' },
  { id: 'social', label: 'TikTok / Instagram / Social media', emoji: '📱' },
  { id: 'friend', label: 'Friend or classmate', emoji: '👥' },
  { id: 'parent', label: 'My parent told me', emoji: '👨‍👩‍👧' },
  { id: 'school', label: 'School or teacher', emoji: '🏫' },
  { id: 'youtube', label: 'YouTube video', emoji: '🎬' },
  { id: 'blog', label: 'Blog post or article', emoji: '📰' },
  { id: 'reddit', label: 'Reddit or online forum', emoji: '💬' },
  { id: 'ad', label: 'Online ad', emoji: '🌐' },
  { id: 'other', label: 'Other', emoji: '✍️' },
];

const YEAR_GROUPS = [
  { id: 'year10', label: 'Year 10 (GCSE)', emoji: '📚' },
  { id: 'year11', label: 'Year 11 (GCSE)', emoji: '📚' },
  { id: 'year12', label: 'Year 12 (A-Level/AS)', emoji: '🎓' },
  { id: 'year13', label: 'Year 13 (A-Level)', emoji: '🎓' },
  { id: 'other', label: 'Other (IGCSE, IB, etc.)', emoji: '🌍' },
];

const STUDY_PREFERENCES = [
  { 
    id: 'practice', 
    title: 'Practice questions', 
    description: 'Learn by doing lots of exam-style questions',
    emoji: '📝'
  },
  { 
    id: 'reading', 
    title: 'Reading explanations', 
    description: 'Learn by reading detailed notes and explanations',
    emoji: '📖'
  },
  { 
    id: 'visual', 
    title: 'Visual learning', 
    description: 'Learn best with diagrams, videos, and animations',
    emoji: '🎥'
  },
  { 
    id: 'flashcards', 
    title: 'Flashcards', 
    description: 'Learn by memorizing key facts with flashcards',
    emoji: '🎯'
  },
  { 
    id: 'past-papers', 
    title: 'Past papers', 
    description: 'Learn by practicing full past exam papers',
    emoji: '📊'
  },
];

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    acquisitionSource: '',
    acquisitionSourceOther: null,
    yearGroup: '',
    subjects: [],
    studyPreferences: [],
    parentUpdates: false,
    parentEmail: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionStage, setCompletionStage] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('onboardingData');
      if (saved) {
        setOnboardingData(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  // Save to localStorage on data change
  useEffect(() => {
    if (currentStep > 0 && currentStep < 6) {
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    }
  }, [onboardingData, currentStep]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.acquisitionSource !== '';
      case 2:
        return onboardingData.yearGroup !== '';
      case 3:
        return onboardingData.subjects.length > 0;
      case 4:
        return onboardingData.studyPreferences.length > 0;
      case 5:
        if (!onboardingData.parentUpdates) return true;
        return onboardingData.parentEmail && isValidEmail(onboardingData.parentEmail);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 5) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStep === 1) return; // Can't skip step 1
    handleNext();
  };

  const handleComplete = async () => {
    setShowCompletion(true);
    
    // Stage 1: Loading (2 seconds)
    setTimeout(() => setCompletionStage(1), 100);
    
    // Stage 2: Checklist items (0.3s apart)
    setTimeout(() => setCompletionStage(2), 2000);
    
    // Stage 3: Show finish button
    setTimeout(() => setCompletionStage(3), 3500);

    // Save to backend
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save onboarding data to user profile or separate table
        await supabase
          .from('profiles')
          .update({
            parent_email: onboardingData.parentEmail,
          })
          .eq('id', user.id);

        // Add subjects to user_subjects table
        if (onboardingData.subjects.length > 0) {
          const subjectEntries = onboardingData.subjects.map(subjectId => {
            const subject = SUBJECTS.find(s => s.id === subjectId);
            return {
              user_id: user.id,
              subject_name: subject?.name || subjectId,
              exam_board: 'AQA',
              predicted_grade: 'Not Set',
              target_grade: null,
              priority_level: 3
            };
          });

          await supabase
            .from('user_subjects')
            .insert(subjectEntries);
        }
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }

    // Clear localStorage
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

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[24px] shadow-[0px_20px_80px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto"
          style={{
            width: '90%',
            maxWidth: '560px',
            padding: currentStep === 0 ? '48px 40px' : '48px 40px',
          }}
        >
          {/* Progress Bar (Steps 1-5 only) */}
          {currentStep >= 1 && currentStep <= 5 && !showCompletion && (
            <div className="mb-10">
              <div className="w-full h-[6px] bg-[#E5E7EB] rounded-[3px] overflow-hidden mb-3">
                <motion.div
                  className="h-full"
                  style={{
                    background: 'linear-gradient(90deg, #00B4D8 0%, #0BA5E9 100%)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <p className="text-[13px] text-[#6B7280] text-center font-medium">
                Step {currentStep} of 5
              </p>
            </div>
          )}

          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <img 
                src={mentioraLogo} 
                alt="Mentiora Logo" 
                className="h-14 mx-auto mb-9"
              />
              <h1 className="text-[40px] font-[800] text-black mb-4">
                Welcome to Mentiora! 👋
              </h1>
              <p className="text-[18px] text-[#6B7280] mb-10">
                Let's personalize your learning in under a minute
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full bg-[#00B4D8] text-white font-semibold text-[16px] py-[18px] px-12 rounded-[12px] hover:bg-[#0099b8] transition-all shadow-[0px_4px_16px_rgba(0,180,216,0.3)] hover:translate-y-[-2px]"
              >
                Let's go →
              </button>
              <p className="text-[14px] text-[#6B7280] mt-6">
                Takes about 60 seconds • Your info stays private 🔒
              </p>
            </motion.div>
          )}

          {/* Step 1: How did you find us? */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[28px] font-[700] text-black mb-3">
                How did you find Mentiora?
              </h2>
              <p className="text-[16px] text-[#6B7280] mb-8">
                This helps us reach more students like you
              </p>
              
              <div className="space-y-3 mb-8">
                {ACQUISITION_SOURCES.map((source) => (
                  <div
                    key={source.id}
                    onClick={() => setOnboardingData({ 
                      ...onboardingData, 
                      acquisitionSource: source.id,
                      acquisitionSourceOther: null 
                    })}
                    className={`flex items-center gap-4 p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
                      onboardingData.acquisitionSource === source.id
                        ? 'border-[#00B4D8] bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] hover:border-[#00B4D8] hover:bg-[#F0F9FF]'
                    }`}
                  >
                    <span className="text-2xl">{source.emoji}</span>
                    <span className="text-[16px] font-medium text-black">{source.label}</span>
                  </div>
                ))}
                
                {onboardingData.acquisitionSource === 'other' && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    type="text"
                    placeholder="Please tell us where..."
                    value={onboardingData.acquisitionSourceOther || ''}
                    onChange={(e) => setOnboardingData({ 
                      ...onboardingData, 
                      acquisitionSourceOther: e.target.value 
                    })}
                    className="w-full p-3 border border-[#D1D5DB] rounded-[8px] focus:outline-none focus:border-[#00B4D8]"
                  />
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleSkip}
                  className="text-[#6B7280] hover:underline"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canContinue()}
                  className={`px-8 py-[14px] rounded-[10px] font-semibold text-white transition-all ${
                    canContinue()
                      ? 'bg-[#00B4D8] hover:bg-[#0099b8] hover:translate-y-[-1px]'
                      : 'bg-[#D1D5DB] cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: What year are you in? */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[28px] font-[700] text-black mb-3">
                What year are you in?
              </h2>
              <p className="text-[16px] text-[#6B7280] mb-8">
                We'll show you the right content for your level
              </p>
              
              <div className="space-y-3 mb-8">
                {YEAR_GROUPS.map((year) => (
                  <div
                    key={year.id}
                    onClick={() => setOnboardingData({ ...onboardingData, yearGroup: year.id })}
                    className={`flex items-center gap-4 p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
                      onboardingData.yearGroup === year.id
                        ? 'border-[#00B4D8] bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] hover:border-[#00B4D8] hover:bg-[#F0F9FF]'
                    }`}
                  >
                    <span className="text-2xl">{year.emoji}</span>
                    <span className="text-[16px] font-medium text-black">{year.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="text-[#6B7280] hover:underline"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="text-[#6B7280] hover:underline"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className={`px-8 py-[14px] rounded-[10px] font-semibold text-white transition-all ${
                      canContinue()
                        ? 'bg-[#00B4D8] hover:bg-[#0099b8] hover:translate-y-[-1px]'
                        : 'bg-[#D1D5DB] cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Select subjects */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[28px] font-[700] text-black mb-3">
                Which subjects are you studying?
              </h2>
              <p className="text-[16px] text-[#6B7280] mb-7">
                Select all that apply. You can add more later.
              </p>
              
              {/* Search box */}
              <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-[10px] focus:outline-none focus:border-[#00B4D8]"
                />
              </div>

              {/* Subjects grid */}
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 max-h-[400px] overflow-y-auto pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#00B4D8 #E5E7EB',
                }}
              >
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    onClick={() => {
                      const newSubjects = onboardingData.subjects.includes(subject.id)
                        ? onboardingData.subjects.filter(id => id !== subject.id)
                        : [...onboardingData.subjects, subject.id];
                      setOnboardingData({ ...onboardingData, subjects: newSubjects });
                    }}
                    className={`flex items-center justify-between p-[14px] rounded-[10px] border-2 cursor-pointer transition-all ${
                      onboardingData.subjects.includes(subject.id)
                        ? 'border-[#00B4D8] bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] hover:border-[#00B4D8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{subject.emoji}</span>
                      <span className="text-[15px] font-medium text-black">{subject.name}</span>
                    </div>
                    {onboardingData.subjects.includes(subject.id) && (
                      <Check className="w-[18px] h-[18px] text-[#00B4D8]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Selection counter */}
              <p className="text-[14px] text-[#00B4D8] font-semibold text-center mb-5">
                {onboardingData.subjects.length} subject{onboardingData.subjects.length !== 1 ? 's' : ''} selected
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="text-[#6B7280] hover:underline"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="text-[#6B7280] hover:underline"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className={`px-8 py-[14px] rounded-[10px] font-semibold text-white transition-all ${
                      canContinue()
                        ? 'bg-[#00B4D8] hover:bg-[#0099b8] hover:translate-y-[-1px]'
                        : 'bg-[#D1D5DB] cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Study preferences */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[28px] font-[700] text-black mb-3">
                How do you prefer to learn?
              </h2>
              <p className="text-[16px] text-[#6B7280] mb-8">
                Select all that work for you. We'll adapt our approach.
              </p>
              
              <div className="space-y-3 mb-8">
                {STUDY_PREFERENCES.map((pref) => (
                  <div
                    key={pref.id}
                    onClick={() => {
                      const newPrefs = onboardingData.studyPreferences.includes(pref.id)
                        ? onboardingData.studyPreferences.filter(id => id !== pref.id)
                        : [...onboardingData.studyPreferences, pref.id];
                      setOnboardingData({ ...onboardingData, studyPreferences: newPrefs });
                    }}
                    className={`flex items-center justify-between p-5 rounded-[12px] border-2 cursor-pointer transition-all ${
                      onboardingData.studyPreferences.includes(pref.id)
                        ? 'border-[#00B4D8] bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] hover:border-[#00B4D8]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[32px]">{pref.emoji}</span>
                      <div>
                        <h3 className="text-[18px] font-semibold text-black mb-1">{pref.title}</h3>
                        <p className="text-[14px] text-[#6B7280] leading-relaxed">{pref.description}</p>
                      </div>
                    </div>
                    {onboardingData.studyPreferences.includes(pref.id) && (
                      <Check className="w-[22px] h-[22px] text-[#00B4D8] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="text-[#6B7280] hover:underline"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="text-[#6B7280] hover:underline"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className={`px-8 py-[14px] rounded-[10px] font-semibold text-white transition-all ${
                      canContinue()
                        ? 'bg-[#00B4D8] hover:bg-[#0099b8] hover:translate-y-[-1px]'
                        : 'bg-[#D1D5DB] cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Parent updates */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[28px] font-[700] text-black mb-3">
                Keep your parents in the loop?
              </h2>
              <p className="text-[16px] text-[#6B7280] mb-8">
                We can send weekly progress reports to a parent or guardian
              </p>
              
              <div className="space-y-4 mb-6">
                <div
                  onClick={() => setOnboardingData({ ...onboardingData, parentUpdates: true })}
                  className={`p-6 rounded-[12px] border-2 cursor-pointer transition-all ${
                    onboardingData.parentUpdates
                      ? 'border-[#00B4D8] bg-[#F0F9FF]'
                      : 'border-[#E5E7EB] hover:border-[#00B4D8]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[32px]">✉️</span>
                    <div>
                      <h3 className="text-[18px] font-semibold text-black mb-1">Yes, send weekly updates</h3>
                      <p className="text-[14px] text-[#6B7280]">Your parent gets a progress email every Sunday</p>
                    </div>
                  </div>
                </div>

                {onboardingData.parentUpdates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-5"
                  >
                    <label className="block text-[14px] font-semibold text-black mb-2">
                      Parent/Guardian Email
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={onboardingData.parentEmail || ''}
                      onChange={(e) => setOnboardingData({ ...onboardingData, parentEmail: e.target.value })}
                      className="w-full p-3 border border-[#D1D5DB] rounded-[8px] focus:outline-none focus:border-[#00B4D8]"
                    />
                    <p className="text-[13px] text-[#6B7280] mt-2">
                      They'll get their first update next Sunday
                    </p>
                  </motion.div>
                )}

                <div
                  onClick={() => setOnboardingData({ ...onboardingData, parentUpdates: false, parentEmail: null })}
                  className={`p-6 rounded-[12px] border-2 cursor-pointer transition-all ${
                    !onboardingData.parentUpdates
                      ? 'border-[#00B4D8] bg-[#F0F9FF]'
                      : 'border-[#E5E7EB] hover:border-[#00B4D8]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[32px]">🔒</span>
                    <div>
                      <h3 className="text-[18px] font-semibold text-black mb-1">No thanks</h3>
                      <p className="text-[14px] text-[#6B7280]">Keep my progress private</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-[10px] flex items-start gap-3 mb-8">
                <span className="text-xl">🔒</span>
                <p className="text-[13px] text-[#6B7280]">
                  We never share your data. Parents only see overall progress, not individual answers.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="text-[#6B7280] hover:underline"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="text-[#6B7280] hover:underline"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className={`px-8 py-[14px] rounded-[10px] font-semibold text-white transition-all ${
                      canContinue()
                        ? 'bg-[#00B4D8] hover:bg-[#0099b8] hover:translate-y-[-1px]'
                        : 'bg-[#D1D5DB] cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Completion */}
          {showCompletion && (
            <motion.div
              key="completion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-[100px] h-[100px] mx-auto mb-8 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #00B4D8 0%, #0BA5E9 100%)',
                }}
              >
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </motion.div>

              <h1 className="text-[36px] font-[800] text-black mb-4">
                You're all set! 🎉
              </h1>
              <p className="text-[18px] text-[#6B7280] mb-10">
                Creating your personalized learning plan...
              </p>

              {/* Loading spinner */}
              {completionStage === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-10 h-10 mx-auto border-4 border-[#E5E7EB] border-t-[#00B4D8] rounded-full animate-spin"
                />
              )}

              {/* Checklist */}
              {completionStage >= 2 && (
                <div className="space-y-4 mb-10">
                  {[
                    { text: 'Analyzed your subjects', delay: 0 },
                    { text: 'Identified your weak topics', delay: 0.3 },
                    { text: 'Created your first week\'s plan', delay: 0.6 },
                    { text: 'Generated personalized notes', delay: 0.9 },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: item.delay, duration: 0.3 }}
                      className="flex items-center gap-3 justify-center"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-[16px] text-black">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Finish button */}
              {completionStage >= 3 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleFinish}
                  className="w-full max-w-[400px] bg-[#00B4D8] text-white font-semibold text-[18px] py-[18px] px-12 rounded-[12px] hover:bg-[#0099b8] transition-all shadow-[0px_4px_16px_rgba(0,180,216,0.3)] hover:translate-y-[-2px]"
                >
                  Start learning →
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};