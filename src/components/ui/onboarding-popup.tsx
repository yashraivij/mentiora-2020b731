import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { useCurriculum } from "@/hooks/useCurriculum";
import { AnimatedAvatar } from "@/components/ui/AnimatedAvatar";
import { CelebrationOverlay } from "@/components/ui/CelebrationOverlay";
import { playTutorVoice, TUTOR_VOICE_LINES, initTutorVoiceSystem } from "@/lib/tutorVoice";
import avaAvatar from "@/assets/avatars/ava-avatar-new.png";
import lucasAvatar from "@/assets/avatars/lucas-avatar-new.png";
import drRiveraAvatar from "@/assets/avatars/dr-rivera-avatar-new.png";
import jaydenAvatar from "@/assets/avatars/jayden-avatar-new.png";

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
  teachingStyle: string;
}

// Extract unique subjects from curriculum by level
const getSubjectsByLevel = (curriculum: any[], level: 'gcse' | 'alevel' | 'igcse') => {
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

const TUTOR_OPTIONS = [
  {
    id: "ava",
    name: "Ava",
    avatar: avaAvatar,
    style: "Calm & patient mentor",
    color: "#7CB9E8",
    animationType: 'wave' as const,
    bestFor: "Students who feel overwhelmed",
    teachingApproach: [
      "Takes time to explain concepts thoroughly",
      "Encourages questions without judgment",
      "Creates a supportive learning environment"
    ],
  },
  {
    id: "lucas",
    name: "Lucas",
    avatar: lucasAvatar,
    style: "Efficient & structured coach",
    color: "#1E3A5F",
    animationType: 'nod' as const,
    bestFor: "Students with tight deadlines",
    teachingApproach: [
      "Gets straight to the point",
      "Helps prioritize effectively",
      "Builds confidence quickly"
    ],
  },
  {
    id: "dr-rivera",
    name: "Dr. Rivera",
    avatar: drRiveraAvatar,
    style: "Academic excellence guide",
    color: "#5F9C96",
    animationType: 'glasses-adjust' as const,
    bestFor: "Students who want mastery, not memorization",
    teachingApproach: [
      "Breaks down every concept deeply",
      "Connects ideas across topics",
      "Teaches like a university professor"
    ],
  },
  {
    id: "jayden",
    name: "Jayden",
    avatar: jaydenAvatar,
    style: "Motivational energy booster",
    color: "#FF7F50",
    animationType: 'enthusiastic-wave' as const,
    bestFor: "Students who struggle with motivation",
    teachingApproach: [
      "Keeps learning engaging and fun",
      "Celebrates every win",
      "Makes studying feel achievable"
    ],
  },
];

const TEACHING_STYLES = [
  { 
    id: 'concise', 
    label: 'Short and simple',
    description: 'Quick explanations, straight to the point',
    icon: '⚡'
  },
  { 
    id: 'detailed', 
    label: 'Detailed explanations',
    description: 'In-depth breakdown of every concept',
    icon: '📚'
  },
  { 
    id: 'balanced', 
    label: 'A mix of both',
    description: 'Balance between depth and brevity',
    icon: '⚖️'
  },
  { 
    id: 'adaptive', 
    label: 'Decide for me',
    description: 'Let your tutor adapt to your needs',
    icon: '🎯'
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

export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  const { curriculum, isLoading: curriculumLoading } = useCurriculum();
  const [currentStep, setCurrentStep] = useState(0);
  const [subjectLevel, setSubjectLevel] = useState<'gcse' | 'alevel' | 'igcse'>('gcse');
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
    selectedTutor: '',
    teachingStyle: '',
  });
  const [showTutorWelcome, setShowTutorWelcome] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [hoveredTutor, setHoveredTutor] = useState<string | null>(null);
  const [showTeachingStyle, setShowTeachingStyle] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
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

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.selectedTutor !== '' && onboardingData.teachingStyle !== '';
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
    if (currentStep === 1) {
      // Reset tutor selection states when moving to next main step
      setShowTutorWelcome(false);
      setShowTeachingStyle(false);
      setShowConfirmation(false);
    }
    
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
            selected_tutor_id: onboardingData.selectedTutor,
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
          const allSubjects = [...GCSE_SUBJECTS, ...ALEVEL_SUBJECTS, ...IGCSE_SUBJECTS];
          const subjectEntries = onboardingData.subjects.map(subjectWithGrade => {
            const subject = allSubjects.find(s => s.id === subjectWithGrade.id);
            
            // Check if this is an A-Level subject and append "(A-Level)" to the name
            const isALevel = subjectWithGrade.id.toLowerCase().includes('alevel');
            const subjectName = isALevel && subject?.name && !subject.name.includes('(A-Level)')
              ? `${subject.name} (A-Level)`
              : subject?.name || subjectWithGrade.id;
            
            return {
              user_id: user.id,
              subject_id: subjectWithGrade.id, // Keep the full subject ID (e.g., "biology-aqa-alevel")
              subject_name: subjectName,
              exam_board: subject?.examBoard || 'AQA',
              predicted_grade: 'U',
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
    if (curriculumLoading) return [];
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
        className="bg-white rounded-[24px] shadow-[0px_20px_80px_rgba(0,0,0,0.2)] w-[90%] max-w-[1100px] p-10 max-h-[88vh] overflow-hidden flex flex-col"
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

            {/* Step 1: Select Your Tutor - Initial View */}
            {currentStep === 1 && !showTeachingStyle && !showConfirmation && (
              <div>
                {/* Step indicator - smaller, above */}
                <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wide">
                  Step 1 of 6
                </p>

                {/* Main headline - emotional */}
                <h2 className="text-[28px] font-bold text-black mb-3 text-center leading-tight">
                  Pick the coach who fits your personality.
                </h2>

                {/* Subheading - emphasizes relationship */}
                <p className="text-[17px] text-muted-foreground mb-8 text-center max-w-2xl mx-auto leading-relaxed">
                  They'll be with you all the way to exam day — learning how you think, adapting to your habits, and celebrating every win with you.
                </p>
                
                {/* Tutor cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                  {TUTOR_OPTIONS.map((tutor) => (
                    <motion.button
                      key={tutor.id}
                      onClick={() => {
                        setOnboardingData({ ...onboardingData, selectedTutor: tutor.id });
                        setShowTutorWelcome(true);
                        setShowCelebration(true);
                        playTutorVoice(tutor.id);
                        setTimeout(() => setShowCelebration(false), 1500);
                      }}
                      onMouseEnter={() => setHoveredTutor(tutor.id)}
                      onMouseLeave={() => setHoveredTutor(null)}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -6,
                        boxShadow: `0 20px 40px ${tutor.color}20`
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${
                        onboardingData.selectedTutor === tutor.id && showTutorWelcome
                          ? 'shadow-2xl'
                          : 'border-border hover:shadow-lg bg-card'
                      }`}
                      style={{
                        borderColor: onboardingData.selectedTutor === tutor.id && showTutorWelcome 
                          ? tutor.color 
                          : undefined,
                        backgroundColor: onboardingData.selectedTutor === tutor.id && showTutorWelcome
                          ? `${tutor.color}05`
                          : undefined
                      }}
                    >
                      {/* Animated glow ring on selection */}
                      {onboardingData.selectedTutor === tutor.id && showTutorWelcome && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            boxShadow: `0 0 0 3px ${tutor.color}40, 0 0 20px ${tutor.color}30`
                          }}
                          animate={{
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}

                      {/* Avatar with enhanced glow + wave animation on hover */}
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <motion.div 
                          className="absolute inset-0 rounded-full blur-xl"
                          style={{ backgroundColor: tutor.color }}
                          animate={{
                            opacity: onboardingData.selectedTutor === tutor.id && showTutorWelcome ? 0.6 : 0.3,
                            scale: onboardingData.selectedTutor === tutor.id && showTutorWelcome ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                          className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl"
                          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                        </motion.div>
                        
                      </div>
                      
                      {/* Name */}
                      <h3 className="text-2xl font-bold text-center mb-2" style={{ color: tutor.color }}>
                        {tutor.name}
                      </h3>
                      
                      {/* Style descriptor */}
                      <p className="text-sm text-muted-foreground text-center mb-4 italic">
                        {tutor.style}
                      </p>
                      
                      {/* Voice line */}
                      <div className="mb-4 px-3 py-3 rounded-lg" style={{ backgroundColor: `${tutor.color}08` }}>
                        <p className="text-sm text-center leading-relaxed italic" style={{ color: tutor.color }}>
                          "{TUTOR_VOICE_LINES[tutor.id]}"
                        </p>
                      </div>
                      
                      {/* Best for badge */}
                      <div className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium mb-4 border-2"
                        style={{ borderColor: tutor.color, color: tutor.color }}>
                        Best for: {tutor.bestFor}
                      </div>
                      
                      {/* Teaching approach */}
                      <div className="space-y-2 mb-6">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                          Teaching approach:
                        </p>
                        <ul className="space-y-1.5">
                          {tutor.teachingApproach.map((point, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start">
                              <span className="mr-2 mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: tutor.color }} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Welcome message with "lock-in" feel */}
                      <AnimatePresence>
                        {onboardingData.selectedTutor === tutor.id && showTutorWelcome && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="mt-6 p-6 rounded-xl border-2"
                            style={{
                              backgroundColor: `${tutor.color}08`,
                              borderColor: `${tutor.color}40`
                            }}
                          >
                            {/* "Locked in" indicator */}
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                              className="flex justify-center mb-3"
                            >
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                style={{ backgroundColor: tutor.color }}
                              >
                                👋
                              </div>
                            </motion.div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowTeachingStyle(true);
                              }}
                              className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-base shadow-md hover:shadow-lg"
                              style={{ backgroundColor: tutor.color }}
                            >
                              Continue with {tutor.name} →
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1b: Teaching Style Preference */}
            {currentStep === 1 && showTeachingStyle && !showConfirmation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setShowTeachingStyle(false)}
                  className="mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  ← Back to tutors
                </button>
                
                <h2 className="text-[26px] font-bold text-black mb-2 text-center">
                  How should I teach you?
                </h2>
                <p className="text-[15px] text-muted-foreground mb-6 text-center">
                  This helps me tailor my explanations to your learning style
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEACHING_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setOnboardingData({ ...onboardingData, teachingStyle: style.id });
                        setShowConfirmation(true);
                      }}
                      className="p-5 rounded-xl border-2 border-border hover:border-primary hover:shadow-lg transition-all bg-card text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{style.icon}</span>
                        <div>
                          <h4 className="font-bold text-base mb-1">{style.label}</h4>
                          <p className="text-sm text-muted-foreground">{style.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1c: Confirmation */}
            {currentStep === 1 && showConfirmation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                {/* Celebration animation */}
                <div className="mb-6 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div 
                        className="absolute inset-0 rounded-full blur-2xl opacity-40"
                        style={{ backgroundColor: TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.color }}
                      ></div>
                      <img 
                        src={TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.avatar} 
                        alt="Your tutor" 
                        className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Floating stars animation */}
                  <motion.div
                    animate={{ y: [-10, -20, -10], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl"
                  >
                    ✨
                  </motion.div>
                </div>
                
                <h2 className="text-[28px] font-bold text-black mb-3">
                  Perfect choice — {TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.name} is now your personal coach.
                </h2>
                
                <p className="text-[16px] text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  {TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.name} will personalise your entire learning experience based on your exam date, goals, and study preferences. You're in good hands.
                </p>
                
                <button
                  onClick={handleNext}
                  className="px-10 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all text-lg hover:-translate-y-1"
                  style={{ 
                    backgroundColor: TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.color 
                  }}
                >
                  Start training with {TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.name} →
                </button>
                
                <p className="text-xs text-muted-foreground mt-5">
                  💡 You can switch tutors later, but most students build a strong relationship and stick with their first choice.
                </p>
                
                <p className="text-xs text-muted-foreground mt-4">
                  You can switch tutors later, but most students stay with their first choice.
                </p>
              </motion.div>
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
                      
                      return (
                        <div key={subject.id} className="space-y-2">
                          <button
                            onClick={() => {
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
                            }`}
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
                              <p className="text-[12px] text-[#6B7280] mb-2 font-medium">Select your target grade:</p>
                              <div className="flex flex-wrap gap-2">
                                {(subjectLevel === 'alevel' ? ALEVEL_GRADES : GCSE_GRADES).map((grade) => (
                                  <button
                                    key={grade}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newSubjects = [...onboardingData.subjects, { id: subject.id, targetGrade: grade }];
                                      setOnboardingData({ ...onboardingData, subjects: newSubjects });
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
        {currentStep > 0 && currentStep < 7 && !showCompletion && !showConfirmation && (
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-200 flex-shrink-0">
            {currentStep > 1 && !showTeachingStyle && (
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
            {!showTeachingStyle && (
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`px-8 py-3 rounded-[10px] font-semibold text-[15px] transition-all duration-200 ${
                  canContinue()
                    ? 'text-white hover:shadow-md hover:-translate-y-0.5'
                    : 'bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: canContinue() && currentStep === 1 && onboardingData.selectedTutor 
                    ? TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.color 
                    : canContinue() 
                    ? '#3B82F6' 
                    : '#D1D5DB'
                }}
              >
                {currentStep === 1 && onboardingData.selectedTutor
                  ? `Continue with ${TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.name}`
                  : 'Continue'
                }
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Celebration Overlay */}
      {showCelebration && onboardingData.selectedTutor && (
        <CelebrationOverlay
          isVisible={showCelebration}
          tutorName={TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.name || ""}
          tutorAvatar={TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.avatar || ""}
          tutorColor={TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.color || ""}
          animationType={TUTOR_OPTIONS.find(t => t.id === onboardingData.selectedTutor)?.animationType || 'wave'}
        />
      )}
    </div>
  );
};
