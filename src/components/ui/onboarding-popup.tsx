import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { useCurriculum } from "@/hooks/useCurriculum";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectsAdded: () => void;
}

interface SubjectWithGrade {
  id: string;
  targetGrade: string;
}

interface OnboardingData {
  acquisitionSource: string;
  acquisitionSourceOther: string | null;
  yearGroup: string;
  subjects: SubjectWithGrade[];
  studyPreferences: string[];
  parentUpdates: boolean;
  parentEmail: string | null;
  profileEmoji: string;
  selectedTutor: string;
}

// Extract unique subjects from curriculum by level
const getSubjectsByLevel = (curriculum: any[], level: 'gcse' | 'alevel' | 'igcse' | 'sat') => {
  const subjectMap: { [key: string]: { id: string; name: string; examBoard: string; emoji: string } } = {};
  
  curriculum.forEach((subject) => {
    const subjectId = subject.id.toLowerCase();
    // Remove exam board from subject name if it exists (e.g., "Biology (Edexcel)" -> "Biology")
    const subjectName = subject.name.replace(/\s*\([^)]*\)\s*/g, '').trim();
    
    // Skip Geography Paper 2 for GCSE
    if (subjectName.toLowerCase().includes('geography paper 2') || subjectName.toLowerCase().includes('geography - paper 2')) {
      return;
    }
    
    // Extract exam board and level from ID (e.g., "biology-aqa-alevel" or "combined-science-aqa")
    const parts = subjectId.split('-');
    const examBoardRaw = parts.find(p => ['aqa', 'edexcel', 'ocr', 'eduqas'].includes(p)) || 'aqa';
    // Keep AQA and OCR in all caps, capitalize others properly
    const examBoard = (examBoardRaw === 'aqa' || examBoardRaw === 'ocr') 
      ? examBoardRaw.toUpperCase() 
      : examBoardRaw.charAt(0).toUpperCase() + examBoardRaw.slice(1).toLowerCase();
    const isAlevel = subjectId.includes('alevel');
    const isIgcse = subjectId.includes('igcse');
    const isGcse = !isAlevel && !isIgcse;
    
    // Assign emojis based on subject name
    const getEmoji = (name: string) => {
      const nameLower = name.toLowerCase();
      if (nameLower.includes('biology')) return '🧬';
      if (nameLower.includes('chemistry')) return '⚗️';
      if (nameLower.includes('physics')) return '⚛️';
      if (nameLower.includes('math') || nameLower.includes('statistic')) return '🔢';
      if (nameLower.includes('english')) return '📖';
      if (nameLower.includes('psychology')) return '🧠';
      if (nameLower.includes('history')) return '📜';
      if (nameLower.includes('geography')) return '🌍';
      if (nameLower.includes('business')) return '💼';
      if (nameLower.includes('computer')) return '💻';
      if (nameLower.includes('science')) return '🔬';
      if (nameLower.includes('music')) return '🎵';
      return '📚';
    };
    
    if ((level === 'gcse' && isGcse) || (level === 'alevel' && isAlevel) || (level === 'igcse' && isIgcse)) {
      const key = `${subjectName}-${examBoard}`;
      if (!subjectMap[key]) {
        subjectMap[key] = {
          id: subject.id,
          name: subjectName,
          examBoard: examBoard,
          emoji: getEmoji(subjectName)
        };
      }
    }
  });
  
  // Handle SAT separately as it doesn't come from curriculum
  if (level === 'sat') {
    return SAT_SUBJECTS;
  }
  
  return Object.values(subjectMap).sort((a, b) => a.name.localeCompare(b.name));
};

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
  { id: 'year10', label: 'Grade 9/Year 10 (GCSE)', emoji: '📚' },
  { id: 'year11', label: 'Grade 10/Year 11 (GCSE)', emoji: '📚' },
  { id: 'year12', label: 'Grade 11/Year 12 (SAT/A-Level/AS)', emoji: '🎓' },
  { id: 'year13', label: 'Grade 12/Year 13 (SAT/A-Level)', emoji: '🎓' },
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

const TUTOR_OPTIONS = [
  {
    id: 'miss_patel',
    name: 'Miss Patel',
    avatar: '/lovable-uploads/miss-patel-avatar.png',
    personality: 'Patient and supportive, breaks down complex topics step-by-step',
    specialty: 'Sciences'
  },
  {
    id: 'mr_chen',
    name: 'Mr. Chen',
    avatar: '/lovable-uploads/mr-chen-avatar.png',
    personality: 'Methodical and clear, focuses on understanding core concepts',
    specialty: 'Maths & Physics'
  },
  {
    id: 'ms_johnson',
    name: 'Ms. Johnson',
    avatar: '/lovable-uploads/ms-johnson-avatar.png',
    personality: 'Energetic and creative, makes learning fun with examples',
    specialty: 'English & Humanities'
  },
  {
    id: 'mr_williams',
    name: 'Mr. Williams',
    avatar: '/lovable-uploads/mr-williams-avatar.png',
    personality: 'Straight to the point, focuses on exam technique',
    specialty: 'All subjects'
  },
  {
    id: 'dr_singh',
    name: 'Dr. Singh',
    avatar: '/lovable-uploads/dr-singh-avatar.png',
    personality: 'Detailed and thorough, ensures deep understanding',
    specialty: 'Advanced topics'
  }
];

const PROFILE_EMOJIS = [
  '😊', '😎', '🤓', '😄', '🥳', '😇', '🤩', '😁', '😀', '🙂',
  '😌', '🤗', '🥰', '😏', '🤠', '🧐', '🤔', '🤫', '🤪', '😜',
  '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐶', '🐱', '🐰', '🐸',
  '🦄', '🐙', '🦉', '🦆', '🐧', '🦋', '🐝', '🦈', '🐬', '🦑',
  '🎯', '⚡', '✨', '🔥', '💡', '🌟', '💫', '🎨', '🎸', '🎮',
  '🚀', '🛸', '🌈', '⭐', '🌙', '☀️', '🌺', '🌻', '🍕', '🍔'
];

const GCSE_GRADES = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];
const ALEVEL_GRADES = ['A*', 'A', 'B', 'C', 'D', 'E'];

const SAT_SUBJECTS = [
  {
    id: 'sat-reading-writing',
    name: 'SAT Reading and Writing',
    examBoard: 'College Board',
    emoji: '📖'
  },
  {
    id: 'sat-math',
    name: 'SAT Math',
    examBoard: 'College Board',
    emoji: '🔢'
  }
];

const SAT_SCORES = ['1600', '1550', '1500', '1450', '1400', '1350', '1300', '1250', '1200', '1150', '1100', '1050', '1000'];

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const { curriculum, isLoading: curriculumLoading } = useCurriculum();
  const [currentStep, setCurrentStep] = useState(0);
  const [subjectLevel, setSubjectLevel] = useState<'gcse' | 'alevel' | 'igcse' | 'sat'>('gcse');
  const [selectedSubjectForGrade, setSelectedSubjectForGrade] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    acquisitionSource: '',
    acquisitionSourceOther: null,
    yearGroup: '',
    subjects: [],
    studyPreferences: [],
    parentUpdates: false,
    parentEmail: null,
    profileEmoji: '😊',
    selectedTutor: 'miss_patel',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionStage, setCompletionStage] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('onboardingData');
      if (saved) {
        setOnboardingData(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentStep > 0 && currentStep < 6) {
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    }
  }, [onboardingData, currentStep]);

  // Auto-select all SAT subjects when SAT tab is selected
  useEffect(() => {
    if (subjectLevel === 'sat') {
      const hasSATSubjects = onboardingData.subjects.some(s => s.id.startsWith('sat-'));
      
      if (!hasSATSubjects) {
        const satSubjects = SAT_SUBJECTS.map(subject => ({
          id: subject.id,
          targetGrade: '1400'
        }));
        
        setOnboardingData({
          ...onboardingData,
          subjects: [...onboardingData.subjects, ...satSubjects]
        });
      }
    }
  }, [subjectLevel]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.selectedTutor !== '';
      case 2:
        return onboardingData.acquisitionSource !== '';
      case 3:
        return onboardingData.yearGroup !== '';
      case 4:
        return onboardingData.subjects.length > 0;
      case 5:
        return onboardingData.studyPreferences.length > 0;
      case 6:
        if (!onboardingData.parentUpdates) return true;
        return onboardingData.parentEmail && isValidEmail(onboardingData.parentEmail);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 6) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStep === 1 || currentStep === 2) return;
    handleNext();
  };

  const handleComplete = async () => {
    setShowCompletion(true);
    
    setTimeout(() => setCompletionStage(1), 100);
    setTimeout(() => setCompletionStage(2), 2000);
    setTimeout(() => setCompletionStage(3), 3500);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save profile emoji and selected tutor
        await supabase
          .from('profiles')
          .update({ 
            profile_emoji: onboardingData.profileEmoji,
            selected_tutor_id: onboardingData.selectedTutor
          })
          .eq('id', user.id);

        // Save parent email to onboarding_parent_emails table
        if (onboardingData.parentEmail) {
          await supabase
            .from('onboarding_parent_emails')
            .insert({
              user_id: user.id,
              parent_email: onboardingData.parentEmail
            });
        }

        if (onboardingData.subjects.length > 0) {
          const allSubjects = [...GCSE_SUBJECTS, ...ALEVEL_SUBJECTS, ...IGCSE_SUBJECTS, ...SAT_SUBJECTS];
          const subjectEntries = onboardingData.subjects.map(subjectWithGrade => {
            const subject = allSubjects.find(s => s.id === subjectWithGrade.id);
            
            // Check if this is an A-Level or SAT subject
            const isALevel = subjectWithGrade.id.toLowerCase().includes('alevel');
            const isSAT = subjectWithGrade.id.toLowerCase().startsWith('sat-');
            
            const subjectName = isALevel && subject?.name && !subject.name.includes('(A-Level)')
              ? `${subject.name} (A-Level)`
              : isSAT && subject?.name && !subject.name.includes('(SAT)')
                ? `${subject.name} (SAT)`
                : subject?.name || subjectWithGrade.id;
            
            return {
              user_id: user.id,
              subject_id: subjectWithGrade.id,
              subject_name: subjectName,
              exam_board: subject?.examBoard || 'AQA',
              predicted_grade: isSAT ? '1000' : 'U',
              target_grade: subjectWithGrade.targetGrade,
              priority_level: 3
            };
          });

          await supabase.from('user_subjects').insert(subjectEntries);
        }
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
    return (currentStep / 6) * 100;
  };

  const getCurrentSubjects = () => {
    if (curriculumLoading && subjectLevel !== 'sat') return [];
    if (subjectLevel === 'sat') return SAT_SUBJECTS;
    return getSubjectsByLevel(curriculum, subjectLevel);
  };

  const currentSubjects = getCurrentSubjects();
  const GCSE_SUBJECTS = getSubjectsByLevel(curriculum, 'gcse');
  const ALEVEL_SUBJECTS = getSubjectsByLevel(curriculum, 'alevel');
  const IGCSE_SUBJECTS = getSubjectsByLevel(curriculum, 'igcse');
  const filteredSubjects = currentSubjects.filter(subject =>
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
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-[24px] shadow-[0px_20px_80px_rgba(0,0,0,0.2)] w-[90%] max-w-[560px] p-10 max-h-[88vh] overflow-hidden flex flex-col"
      >
        {/* Progress Bar */}
        {currentStep >= 1 && currentStep <= 6 && !showCompletion && (
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
              Step {currentStep} of 6
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
              <div className="text-center">
                <img src={mentioraLogo} alt="Mentiora Logo" className="h-14 mx-auto mb-9" />
                <h1 className="text-[40px] font-[800] text-black mb-4">Welcome to Mentiora! 👋</h1>
                <p className="text-[18px] text-[#6B7280] mb-10">Let's personalize your learning in under a minute</p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full bg-[#3B82F6] text-white font-semibold text-[16px] py-[18px] px-12 rounded-[12px] hover:bg-[#2563eb] transition-all shadow-[0px_4px_16px_rgba(59,130,246,0.3)] hover:translate-y-[-2px]"
                >
                  Let's go →
                </button>
                <p className="text-[14px] text-[#6B7280] mt-6">Takes about 60 seconds • Your info stays private 🔒</p>
              </div>
            )}

            {/* Step 1: Select Your Tutor */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">Select Your Tutor</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">Choose a tutor who will guide you when you need help</p>
                
                {/* Tutor grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {TUTOR_OPTIONS.map((tutor) => (
                    <button
                      key={tutor.id}
                      onClick={() => setOnboardingData({ ...onboardingData, selectedTutor: tutor.id })}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        onboardingData.selectedTutor === tutor.id
                          ? 'border-[#3B82F6] bg-[#F0F9FF] scale-[1.02]'
                          : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-[#E5E7EB]">
                        <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Name */}
                      <h4 className="text-sm font-bold text-center mb-1">{tutor.name}</h4>
                      
                      {/* Personality */}
                      <p className="text-xs text-[#6B7280] text-center line-clamp-3 mb-1">{tutor.personality}</p>
                      
                      {/* Specialty */}
                      <p className="text-[10px] text-[#3B82F6] text-center font-medium">{tutor.specialty}</p>
                      
                      {/* Selected indicator */}
                      {onboardingData.selectedTutor === tutor.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: How did you hear about us */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">How did you hear about us?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">This helps us understand how students find Mentiora</p>
                <div className="space-y-2.5 mb-4">
                  {ACQUISITION_SOURCES.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setOnboardingData({ ...onboardingData, acquisitionSource: source.id })}
                      className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all ${
                        onboardingData.acquisitionSource === source.id
                          ? 'border-[#3B82F6] bg-[#F0F9FF]'
                          : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">{source.emoji}</span>
                        <span className="text-[15px] font-medium">{source.label}</span>
                      </div>
                      {onboardingData.acquisitionSource === source.id && (
                        <Check className="w-[20px] h-[20px] text-[#3B82F6]" />
                      )}
                    </button>
                  ))}
                </div>
                {onboardingData.acquisitionSource === 'other' && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={onboardingData.acquisitionSourceOther || ''}
                    onChange={(e) => setOnboardingData({ ...onboardingData, acquisitionSourceOther: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-[10px] focus:outline-none focus:border-[#3B82F6]"
                  />
                )}
              </div>
            )}

            {/* Step 3: Year group */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">What year are you in?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">This helps us show you the right content</p>
                <div className="space-y-2.5">
                  {YEAR_GROUPS.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => setOnboardingData({ ...onboardingData, yearGroup: year.id })}
                      className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all ${
                        onboardingData.yearGroup === year.id
                          ? 'border-[#3B82F6] bg-[#F0F9FF]'
                          : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">{year.emoji}</span>
                        <span className="text-[15px] font-medium">{year.label}</span>
                      </div>
                      {onboardingData.yearGroup === year.id && (
                        <Check className="w-[20px] h-[20px] text-[#3B82F6]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Select subjects WITH TABS */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">Which subjects are you studying?</h2>
                <p className="text-[15px] text-[#6B7280] mb-4">Select all that apply. You can add more later.</p>

                {/* Level tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSubjectLevel('gcse')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-[14px] transition-all duration-200 ${
                      subjectLevel === 'gcse'
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    GCSE
                  </button>
                  <button
                    onClick={() => setSubjectLevel('alevel')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-[14px] transition-all duration-200 ${
                      subjectLevel === 'alevel'
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    A-Level
                  </button>
                  <button
                    onClick={() => setSubjectLevel('igcse')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-[14px] transition-all duration-200 ${
                      subjectLevel === 'igcse'
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    IGCSE
                  </button>
                  <button
                    onClick={() => setSubjectLevel('sat')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-[14px] transition-all duration-200 ${
                      subjectLevel === 'sat'
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    SAT
                  </button>
                </div>

                {/* Search + grid */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-[#D1D5DB] rounded-[10px] focus:outline-none focus:border-[#3B82F6] text-[14px]"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[18px]">🔍</span>
                </div>

                <div className="max-h-[240px] overflow-y-auto mb-3">
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredSubjects.map((subject) => {
                      const isSelected = onboardingData.subjects.some(s => s.id === subject.id);
                      const subjectData = onboardingData.subjects.find(s => s.id === subject.id);
                      const isSelectingGrade = selectedSubjectForGrade === subject.id;
                      const isSAT = subject.id.startsWith('sat-');
                      
                      return (
                        <div key={subject.id} className="space-y-2">
                          <button
                            onClick={() => {
                              if (isSAT) {
                                // SAT subjects can't be deselected, only allow changing target score
                                setSelectedSubjectForGrade(subject.id);
                                return;
                              }
                              
                              if (isSelected) {
                                // Remove subject
                                const newSubjects = onboardingData.subjects.filter(s => s.id !== subject.id);
                                setOnboardingData({ ...onboardingData, subjects: newSubjects });
                                setSelectedSubjectForGrade(null);
                              } else {
                                // Show grade picker
                                setSelectedSubjectForGrade(subject.id);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-[10px] border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-[#3B82F6] bg-[#F0F9FF]'
                                : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                            } ${isSAT ? 'cursor-default' : ''}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-[18px]">{subject.emoji}</span>
                              <div className="text-left">
                                <div className="text-[14px] font-medium">{subject.name}</div>
                                <div className="text-[11px] text-[#6B7280] font-medium">
                                  {subject.examBoard}
                                  {subjectData && ` • Target: ${subjectData.targetGrade}`}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-[16px] h-[16px] text-[#3B82F6] flex-shrink-0" />
                            )}
                          </button>
                          
                          {/* Grade picker */}
                          {isSelectingGrade && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 pr-2"
                            >
                              <p className="text-[12px] text-[#6B7280] mb-2 font-medium">
                                {subjectLevel === 'sat' ? 'Select your target score:' : 'Select your target grade:'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(subjectLevel === 'sat' 
                                  ? SAT_SCORES 
                                  : subjectLevel === 'alevel' 
                                    ? ALEVEL_GRADES 
                                    : GCSE_GRADES
                                ).map((grade) => (
                                  <button
                                    key={grade}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const isSAT = subject.id.startsWith('sat-');
                                      
                                      if (isSAT) {
                                        // Update existing SAT subject's target
                                        const newSubjects = onboardingData.subjects.map(s => 
                                          s.id === subject.id ? { ...s, targetGrade: grade } : s
                                        );
                                        setOnboardingData({ ...onboardingData, subjects: newSubjects });
                                      } else {
                                        // Add new non-SAT subject
                                        const newSubjects = [...onboardingData.subjects, { id: subject.id, targetGrade: grade }];
                                        setOnboardingData({ ...onboardingData, subjects: newSubjects });
                                      }
                                      
                                      setSelectedSubjectForGrade(null);
                                    }}
                                    className="px-3 py-1.5 text-[13px] font-semibold rounded-md border-2 border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F0F9FF] transition-all"
                                  >
                                    {grade}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {onboardingData.subjects.length > 0 && (
                  <p className="text-[13px] text-[#3B82F6] font-semibold text-center mb-2">
                    {onboardingData.subjects.length} subject{onboardingData.subjects.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {/* Step 5: Study preferences */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">How do you like to study?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">Select all that apply. We'll personalize your experience.</p>
                <div className="space-y-2.5">
                  {STUDY_PREFERENCES.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => {
                        const newPrefs = onboardingData.studyPreferences.includes(pref.id)
                          ? onboardingData.studyPreferences.filter(p => p !== pref.id)
                          : [...onboardingData.studyPreferences, pref.id];
                        setOnboardingData({ ...onboardingData, studyPreferences: newPrefs });
                      }}
                      className={`w-full flex items-start justify-between p-3 rounded-[12px] border-2 transition-all duration-200 ${
                        onboardingData.studyPreferences.includes(pref.id)
                          ? 'border-[#3B82F6] bg-[#F0F9FF]'
                          : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 text-left">
                        <span className="text-[22px] mt-0.5">{pref.emoji}</span>
                        <div>
                          <div className="text-[14px] font-semibold mb-0.5">{pref.title}</div>
                          <div className="text-[12px] text-[#6B7280]">{pref.description}</div>
                        </div>
                      </div>
                      {onboardingData.studyPreferences.includes(pref.id) && (
                        <Check className="w-[18px] h-[18px] text-[#3B82F6] flex-shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Parent updates */}
            {currentStep === 6 && !showCompletion && (
              <div>
                <h2 className="text-[26px] font-bold text-black mb-2">Keep your parents in the loop?</h2>
                <p className="text-[15px] text-[#6B7280] mb-5">We can send them weekly progress updates (optional)</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setOnboardingData({ ...onboardingData, parentUpdates: true })}
                    className={`w-full flex items-center justify-between p-3 rounded-[12px] border-2 transition-all duration-200 ${
                      onboardingData.parentUpdates
                        ? 'border-[#3B82F6] bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[22px]">📧</span>
                      <span className="text-[14px] font-medium">Yes, send weekly updates</span>
                    </div>
                    {onboardingData.parentUpdates && (
                      <Check className="w-[18px] h-[18px] text-[#3B82F6]" />
                    )}
                  </button>

                  <button
                    onClick={() => setOnboardingData({ ...onboardingData, parentUpdates: false, parentEmail: null })}
                    className={`w-full flex items-center justify-between p-3 rounded-[12px] border-2 transition-all duration-200 ${
                      !onboardingData.parentUpdates
                        ? 'border-[#3B82F6] bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] hover:border-[#3B82F6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[22px]">🚫</span>
                      <span className="text-[14px] font-medium">No thanks, just me</span>
                    </div>
                    {!onboardingData.parentUpdates && (
                      <Check className="w-[18px] h-[18px] text-[#3B82F6]" />
                    )}
                  </button>
                </div>

                {onboardingData.parentUpdates && (
                  <div className="mt-4">
                    <label className="block text-[13px] font-medium text-[#374151] mb-2">
                      Parent's email address
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={onboardingData.parentEmail || ''}
                      onChange={(e) => setOnboardingData({ ...onboardingData, parentEmail: e.target.value })}
                      className="w-full px-4 py-2.5 text-[14px] border border-[#D1D5DB] rounded-[10px] focus:outline-none focus:border-[#3B82F6]"
                    />
                    {onboardingData.parentEmail && !isValidEmail(onboardingData.parentEmail) && (
                      <p className="text-[12px] text-red-500 mt-1.5">Please enter a valid email address</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Completion animation */}
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
                          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
                        />
                      </div>
                      <h2 className="text-[28px] font-bold text-black mb-3">Setting up your account...</h2>
                      <p className="text-[16px] text-[#6B7280]">This will only take a moment</p>
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
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="w-12 h-12 text-white" strokeWidth={3} />
                        </motion.div>
                      </div>
                      <h2 className="text-[28px] font-bold text-black mb-3">Adding your subjects...</h2>
                      <p className="text-[16px] text-[#6B7280]">Getting everything ready for you</p>
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
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-[64px] mb-6"
                      >
                        🎉
                      </motion.div>
                      <h2 className="text-[32px] font-bold text-black mb-3">You're all set!</h2>
                      <p className="text-[16px] text-[#6B7280] mb-8">Let's start your learning journey</p>
                      <button
                        onClick={handleFinish}
                        className="bg-[#3B82F6] text-white font-semibold text-[16px] py-[16px] px-12 rounded-[12px] hover:bg-[#2563eb] transition-all shadow-[0px_4px_16px_rgba(59,130,246,0.3)] hover:translate-y-[-2px]"
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
        {currentStep > 0 && currentStep < 7 && !showCompletion && (
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-200 flex-shrink-0">
            {currentStep > 1 && (
              <button onClick={handleBack} className="text-[#6B7280] hover:text-black font-medium text-[14px] underline transition-colors duration-200">
                Back
              </button>
            )}
            <div className="flex-1" />
            {currentStep !== 1 && currentStep !== 2 && (
              <button onClick={handleSkip} className="text-[#6B7280] hover:text-black font-medium text-[14px] underline mr-4 transition-colors duration-200">
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className={`px-8 py-3 rounded-[10px] font-semibold text-[14px] transition-all duration-200 ${
                canContinue()
                  ? 'bg-[#3B82F6] text-white hover:bg-[#2563eb] hover:shadow-md hover:-translate-y-0.5'
                  : 'bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
