import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { X, BookOpen, Target, TrendingUp, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PersonalizedNotificationProps {
  type: "wrong-answer" | "practice-streak" | "weak-topic-recommendation" | "exam-recommendation";
  questionNumber?: number;
  topicName?: string;
  subjectName?: string;
  streakCount?: number;
  weakestTopic?: string;
  subjectId?: string;
  onClose: () => void;
  onAction?: () => void;
}

export const PersonalizedNotification = ({
  type,
  questionNumber,
  topicName,
  subjectName,
  streakCount,
  weakestTopic,
  subjectId,
  onClose,
  onAction
}: PersonalizedNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getNotificationContent = () => {
    switch (type) {
      case "wrong-answer":
        return {
          icon: <BookOpen className="h-5 w-5" />,
          title: "Recommended Revision",
          message: `You got Q${questionNumber} wrong. We recommend revising ${topicName}.`,
          actionText: "Revise Topic",
          badgeText: "Smart Feedback",
          gradient: "from-orange-500 via-red-500 to-pink-500"
        };
      case "practice-streak":
        return {
          icon: <TrendingUp className="h-5 w-5" />,
          title: "Great Progress!",
          message: `You're doing well on practice questions. Try the 2026 Predicted Exam to see what grade you're on track for.`,
          actionText: "Take Predicted Exam",
          badgeText: `${streakCount}+ Correct`,
          gradient: "from-green-500 via-blue-500 to-purple-500"
        };
      case "weak-topic-recommendation":
        return {
          icon: <Target className="h-5 w-5" />,
          title: "Focus Your Revision",
          message: `Based on your recent exam, we recommend focusing on ${weakestTopic} to improve your grade.`,
          actionText: "Practice Topic",
          badgeText: "AI Analysis",
          gradient: "from-amber-400 via-orange-500 to-red-500"
        };
      case "exam-recommendation":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          title: "Ready for Predicted Exam?",
          message: `You've answered ${streakCount}+ practice questions correctly. Try the 2026 Predicted Exam for ${subjectName}!`,
          actionText: "Take Exam",
          badgeText: "High Performance",
          gradient: "from-emerald-500 via-teal-500 to-cyan-500"
        };
      default:
        return {
          icon: <Star className="h-5 w-5" />,
          title: "Notification",
          message: "You have a new update.",
          actionText: "View",
          badgeText: "Update",
          gradient: "from-gray-500 via-slate-500 to-zinc-500"
        };
    }
  };

  const content = getNotificationContent();

  return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-out ${
      isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
    }`}>
      <Card className="relative w-[420px] overflow-hidden border-0 shadow-2xl backdrop-blur-xl">
        {/* Premium gradient background with enhanced colors */}
        <div className={`absolute inset-0 bg-gradient-to-br ${content.gradient} opacity-95`} />
        
        {/* Enhanced glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-md" />
        
        {/* Enhanced animated sparkles with more colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-3 left-6 w-1.5 h-1.5 bg-yellow-300/80 rounded-full animate-pulse" />
          <div className="absolute top-8 right-12 w-1 h-1 bg-pink-300/60 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-cyan-300/70 rounded-full animate-pulse delay-700" />
          <div className="absolute bottom-12 right-6 w-1 h-1 bg-purple-300/80 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-8 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse delay-500" />
          <div className="absolute top-1/3 right-8 w-0.5 h-0.5 bg-emerald-300/70 rounded-full animate-pulse delay-1200" />
        </div>
        
        {/* Content */}
        <div className="relative p-6 text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/25 rounded-xl backdrop-blur-sm shadow-lg">
                {content.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-lg whitespace-nowrap">{content.title}</h3>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/25 text-white border-white/40 text-xs font-medium px-2 py-1 whitespace-nowrap"
                  >
                    {content.badgeText}
                  </Badge>
                </div>
                {subjectName && (
                  <p className="text-sm text-white/90 font-semibold capitalize">{subjectName.replace('-', ' ')}</p>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Message */}
          <p className="text-white text-base leading-relaxed mb-5 font-medium">
            {content.message}
          </p>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              onClick={onAction}
              className="bg-white/25 hover:bg-white/35 text-white border-white/40 backdrop-blur-sm text-sm font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              variant="outline"
              size="sm"
            >
              <Target className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">{content.actionText}</span>
            </Button>
            
            <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
              <Star className="h-3 w-3 fill-current text-yellow-300" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
        
        {/* Progress indicator for streak notifications */}
        {type === "practice-streak" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-white/60 transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((streakCount || 4) * 25, 100)}%` }}
            />
          </div>
        )}
        
        {/* Side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40" />
      </Card>
    </div>
  );
};