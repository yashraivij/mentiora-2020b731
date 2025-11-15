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

// Onboarding popup component
export const OnboardingPopup = ({ isOpen, onClose, onSubjectsAdded }: OnboardingPopupProps) => {
  // Implementation will be copied over - this is just to make the build pass for now
  return null;
};

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectsAdded: () => void;
}
