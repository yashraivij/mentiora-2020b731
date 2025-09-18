import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Gift, Users, Zap, Crown, Sparkles, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GamificationCardProps {
  isPremium: boolean;
  onUpgrade: () => void;
  currentStreak: number;
}

interface UserPoints {
  total_points: number;
  daily_login_complete: boolean;
  practice_complete: boolean;
  predicted_exam_complete: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
}

interface RewardTier {
  points: number;
  title: string;
  description: string;
  icon: any;
}

interface RewardRedemption {
  id: string;
  reward_title: string;
  reward_description: string;
  mp_cost: number;
  redeemed_at: string;
  fulfilled: boolean;
}

const REWARDS = [
  { points: 100, title: "Theme/Badge", description: "Custom themes & badges", icon: Sparkles },
  { points: 200, title: "VIP Discord Role", description: "Exclusive Discord access", icon: Crown },
  { points: 500, title: "£5 Food Voucher", description: "Coffee & food voucher", icon: Gift },
  { points: 1000, title: "£10 Amazon Voucher", description: "Amazon shopping credit", icon: Gift },
  { points: 2000, title: "£20 Amazon Voucher", description: "Premium shopping credit", icon: Gift },
  { points: 5000, title: "AirPods/Beats", description: "Premium tech prizes", icon: Trophy },
];

export function GamificationCard({ isPremium, onUpgrade, currentStreak }: GamificationCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState<UserPoints>({
    total_points: 0,
    daily_login_complete: false,
    practice_complete: false,
    predicted_exam_complete: false,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRedemptions, setUserRedemptions] = useState<RewardRedemption[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<typeof REWARDS[0] | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [actualMPBalance, setActualMPBalance] = useState(0);
  
  // Calculate next reward progress
  const getNextRewardProgress = () => {
    const currentPoints = userPoints.total_points;
    const nextReward = REWARDS.find(reward => reward.points > currentPoints);
    
    if (!nextReward) {
      // Already at max reward
      return {
        current: currentPoints,
        target: 5000,
        progress: 100,
        nextReward: REWARDS[REWARDS.length - 1]
      };
    }
    
    const progressPercent = (currentPoints / nextReward.points) * 100;
    
    return {
      current: currentPoints,
      target: nextReward.points,
      progress: progressPercent,
      nextReward
    };
  };

  const rewardProgress = getNextRewardProgress();

  // Play enhanced progress sound (similar to confetti sound)
  const playProgressSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playSound = (frequency: number, duration: number, delay: number, waveType: OscillatorType = 'sine') => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = waveType;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };

    // Progress celebration sound sequence
    playSound(659.25, 0.1, 0); // E5
    playSound(783.99, 0.1, 80); // G5
    playSound(1046.5, 0.15, 150); // C6
  };

  useEffect(() => {
    if (user) {
      loadUserProgress();
      loadLeaderboard();
      loadUserRedemptions();
      loadActualMPBalance();
    }
  }, [user]);

  // Play sound when points increase
  useEffect(() => {
    if (userPoints.total_points > 0) {
      try {
        playProgressSound();
      } catch (error) {
        console.log('Audio not supported');
      }
    }
  }, [userPoints.total_points]);

  const loadUserProgress = async () => {
    if (!user) return;
    
    // This would normally fetch from a user_gamification table
    // For now, simulate based on existing data
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Check for today's activities
      const { data: activities } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today);
      
      const { data: exams } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id);

      const hasLogin = true; // User is logged in
      const hasPractice = activities?.some(a => a.activity_type === 'practice_question') || false;
      const hasExam = exams && exams.length > 0;

      // Calculate points (this would be stored in database)
      let totalPoints = 0;
      if (hasLogin) totalPoints += 10;
      if (hasPractice) totalPoints += 40;
      if (hasExam) totalPoints += 500;
      
      setUserPoints({
        total_points: totalPoints,
        daily_login_complete: hasLogin,
        practice_complete: hasPractice,
        predicted_exam_complete: hasExam,
      });
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const loadLeaderboard = () => {
    // Mock leaderboard data - would come from database
    setLeaderboard([
      { rank: 1, name: "StudyMaster99", points: 2450 },
      { rank: 2, name: "GCSEPro", points: 2100 },
      { rank: 3, name: "RevisionKing", points: 1850 },
      { rank: 4, name: "ExamAce", points: 1600 },
      { rank: 5, name: "StudyGuru", points: 1400 },
    ]);
  };

  const loadActualMPBalance = async () => {
    if (!user) return;
    
    try {
      // Get or create user points record
      const { data: userPointsData, error } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't have points record, create one with default points
        const { data: newUserPoints } = await supabase
          .from('user_points')
          .insert({ user_id: user.id, total_points: 1240 }) // Default starting balance
          .select('total_points')
          .single();
        
        if (newUserPoints) {
          setActualMPBalance(newUserPoints.total_points);
        }
      } else if (userPointsData) {
        setActualMPBalance(userPointsData.total_points);
      }
    } catch (error) {
      console.error('Error loading MP balance:', error);
      setActualMPBalance(1240); // Fallback balance
    }
  };

  const loadUserRedemptions = async () => {
    if (!user) return;
    
    try {
      const { data: redemptions } = await supabase
        .from('reward_redemptions')
        .select('*')
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false });
      
      if (redemptions) {
        setUserRedemptions(redemptions);
      }
    } catch (error) {
      console.error('Error loading user redemptions:', error);
    }
  };

  const canRedeemReward = (reward: typeof REWARDS[0]) => {
    if (!isPremium || actualMPBalance < reward.points) return false;
    
    // Check if user has redeemed this reward in the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const hasRedeemedThisMonth = userRedemptions.some(redemption => {
      const redemptionDate = new Date(redemption.redeemed_at);
      return redemption.reward_title === reward.title &&
             redemptionDate.getMonth() === currentMonth &&
             redemptionDate.getFullYear() === currentYear;
    });
    
    return !hasRedeemedThisMonth;
  };

  const handleRedeemClick = (reward: typeof REWARDS[0]) => {
    if (!canRedeemReward(reward)) return;
    setSelectedReward(reward);
    setShowConfirmModal(true);
  };

  const handleConfirmRedemption = async () => {
    if (!selectedReward || !user || isRedeeming) return;
    
    setIsRedeeming(true);
    
    try {
      // 1. Deduct MP from user balance
      const newBalance = actualMPBalance - selectedReward.points;
      const { error: pointsError } = await supabase
        .from('user_points')
        .update({ total_points: newBalance })
        .eq('user_id', user.id);
      
      if (pointsError) throw pointsError;
      
      // 2. Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_title: selectedReward.title,
          reward_description: selectedReward.description,
          mp_cost: selectedReward.points
        });
      
      if (redemptionError) throw redemptionError;
      
      // 3. Create admin notification
      const { error: notificationError } = await supabase
        .from('admin_notifications')
        .insert({
          title: 'New Reward Redemption',
          message: `Student has redeemed ${selectedReward.title} for ${selectedReward.points} MP`,
          data: {
            user_id: user.id,
            reward_title: selectedReward.title,
            reward_description: selectedReward.description,
            mp_cost: selectedReward.points
          }
        });
      
      if (notificationError) throw notificationError;
      
      // 4. Update local state
      setActualMPBalance(newBalance);
      await loadUserRedemptions();
      
      // 5. Show success modal
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      toast({
        title: "🎉 Reward Redeemed!",
        description: `We'll send your ${selectedReward.title} to you within 48 hours.`,
      });
      
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const getDaysUntilNextRedemption = (reward: typeof REWARDS[0]) => {
    const redemption = userRedemptions.find(r => r.reward_title === reward.title);
    if (!redemption) return 0;
    
    const redemptionDate = new Date(redemption.redeemed_at);
    const nextMonth = new Date(redemptionDate.getFullYear(), redemptionDate.getMonth() + 1, 1);
    const today = new Date();
    const diffTime = nextMonth.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const RewardsModal = () => (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white via-slate-50/80 to-purple-50/60 dark:from-slate-950 dark:via-slate-900/90 dark:to-purple-950/60 border-0 shadow-2xl backdrop-blur-sm">
      {/* Premium background with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Organized gradient orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-purple-400/25 via-pink-400/15 to-amber-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-tl from-blue-400/20 via-cyan-400/15 to-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header with premium styling */}
      <div className="relative z-10 text-center pb-8 pt-6">
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mr-4 p-3 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-lg shadow-amber-500/30"
            >
              <Gift className="h-10 w-10 text-white drop-shadow-lg" />
            </motion.div>
            
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-500 via-amber-500 to-orange-600 bg-clip-text text-transparent mb-2 tracking-tight">
                Rewards Shop
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full mb-4" />
            </div>
            
            <motion.div
              animate={{ 
                rotate: [0, -15, 15, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="ml-4 p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 shadow-lg shadow-purple-500/30"
            >
              <Crown className="h-10 w-10 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          
          <motion.p 
            className="text-xl text-muted-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Turn your dedication into <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">amazing prizes</span>
          </motion.p>
          
           {/* MP Balance display */}
           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.5, duration: 0.6 }}
             className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl"
           >
             <Zap className="h-5 w-5 text-emerald-500" />
             <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
               Your Balance: {actualMPBalance} MP
             </span>
           </motion.div>
        </motion.div>
      </div>
      
      {/* Scrollable rewards section */}
      <div className="relative z-10 max-h-[45vh] overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 pb-4">
           {REWARDS.map((reward, index) => {
             const canRedeem = canRedeemReward(reward);
             const Icon = reward.icon;
             const isHighValue = reward.points >= 1000;
             const isPremiumTier = reward.points >= 2000;
             const daysUntilNext = getDaysUntilNextRedemption(reward);
             const hasRedeemedThisMonth = daysUntilNext > 0;
            
            return (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0, rotateX: 15 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.12,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.08,
                  rotateY: 8,
                  z: 50,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
                className="group perspective-1000"
              >
                <Card className={`relative overflow-hidden border-0 transition-all duration-500 hover:shadow-2xl backdrop-blur-sm ${
                  canRedeem 
                    ? 'bg-gradient-to-br from-emerald-50/80 via-green-50/70 to-teal-50/80 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/40 shadow-emerald-500/20' 
                    : isPremium 
                      ? 'bg-gradient-to-br from-white/90 via-slate-50/80 to-purple-50/70 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-purple-950/60 shadow-purple-500/10' 
                      : 'bg-gradient-to-br from-gray-100/60 to-slate-200/60 dark:from-gray-800/60 dark:to-slate-700/60 opacity-85'
                }`}>
                  
                  {/* Glassmorphism border with premium glow */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r p-[2px] transition-all duration-500 group-hover:p-[3px] ${
                    canRedeem 
                      ? 'from-emerald-400 via-green-400 to-teal-400 shadow-lg shadow-emerald-500/30' 
                      : isPremiumTier
                        ? 'from-purple-500 via-pink-500 to-amber-500 shadow-xl shadow-purple-500/40'
                        : isHighValue
                          ? 'from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/30'
                          : 'from-indigo-400 via-purple-400 to-pink-400 shadow-md shadow-indigo-500/20'
                  }`}>
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-[10px] h-full w-full" />
                  </div>

                  {/* Premium tier badges */}
                  {(isHighValue || isPremiumTier) && (
                    <div className="absolute top-3 right-3 z-20">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.15, 1]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg shadow-amber-500/40 border border-white/30"
                      >
                        PREMIUM
                      </motion.div>
                    </div>
                  )}

                  {/* Floating premium particles */}
                  {isPremiumTier && (
                    <>
                      <div className="absolute top-4 left-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping opacity-70" />
                      <div className="absolute bottom-6 right-12 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '1s' }} />
                      <div className="absolute top-8 right-8 w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: '2s' }} />
                    </>
                  )}

                  <CardContent className="relative z-10 p-4">
                    <div className="text-center space-y-3">
                      {/* Enhanced icon with multiple gradient layers */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.15,
                          rotate: 360
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative mx-auto w-14 h-14 flex items-center justify-center"
                      >
                        {/* Outer glow ring */}
                        <div className={`absolute inset-0 rounded-2xl blur-lg opacity-40 ${
                          canRedeem 
                            ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500' 
                            : isPremiumTier
                              ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500'
                              : isHighValue
                                ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
                        }`} />
                        
                        {/* Main icon container */}
                        <div className={`relative w-full h-full rounded-2xl shadow-xl flex items-center justify-center ${
                          canRedeem 
                            ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-emerald-500/40' 
                            : isPremiumTier
                              ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 shadow-purple-500/40'
                              : isHighValue
                                ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 shadow-blue-500/40'
                                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-500/40'
                        }`}>
                          {/* Inner highlight */}
                          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/30 via-white/10 to-transparent" />
                          <Icon className="h-6 w-6 text-white relative z-10 drop-shadow-lg" />
                        </div>
                      </motion.div>
                      
                      {/* Title with enhanced typography */}
                      <div className="space-y-2">
                        <h3 className={`text-sm font-bold tracking-tight ${
                          isPremiumTier 
                            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm'
                            : isHighValue
                              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
                              : 'text-foreground font-bold'
                        }`}>
                          {reward.title}
                        </h3>
                        <p className="text-xs text-muted-foreground/90 leading-relaxed font-medium">
                          {reward.description}
                        </p>
                      </div>

                      {/* Enhanced points badge */}
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center"
                      >
                        <div className={`relative px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg overflow-hidden ${
                          isPremiumTier 
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white shadow-purple-500/40'
                            : isHighValue 
                              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-amber-500/40'
                              : canRedeem
                                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white shadow-emerald-500/40'
                                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/40'
                        }`}>
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                          <span className="relative z-10">{reward.points} MP ⚡</span>
                        </div>
                      </motion.div>

                      {/* Enhanced action buttons */}
                      <div className="pt-2">
                        {!isPremium ? (
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button 
                              onClick={onUpgrade} 
                              className="w-full h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-500/30 border-0 rounded-lg text-xs tracking-wide transition-all duration-300"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Upgrade
                            </Button>
                          </motion.div>
                         ) : canRedeem ? (
                           <motion.div
                             whileHover={{ scale: 1.03 }}
                             whileTap={{ scale: 0.97 }}
                           >
                             <Button 
                               onClick={() => handleRedeemClick(reward)}
                               className="w-full h-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/30 border-0 rounded-lg text-xs tracking-wide transition-all duration-300"
                             >
                               <Sparkles className="w-3 h-3 mr-1" />
                               Redeem
                             </Button>
                           </motion.div>
                         ) : hasRedeemedThisMonth ? (
                           <div className="relative p-2 bg-gradient-to-r from-orange-100/80 to-amber-100/80 dark:from-orange-900/40 dark:to-amber-900/40 rounded-lg border border-dashed border-orange-300/50">
                             <div className="text-center">
                               <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-0.5 flex items-center justify-center gap-1">
                                 <Clock className="w-3 h-3" />
                                 Next redemption in {daysUntilNext} days
                               </div>
                             </div>
                           </div>
                        ) : (
                          <div className="relative p-2 bg-gradient-to-r from-slate-100/80 to-gray-100/80 dark:from-slate-800/80 dark:to-gray-800/80 rounded-lg border border-dashed border-muted-foreground/20">
                            <div className="text-center">
                               <div className="text-xs font-bold text-muted-foreground/80 mb-0.5">
                                 {reward.points - actualMPBalance} more MP
                               </div>
                              <div className="text-xs text-muted-foreground/60 font-medium">
                                Keep studying! 💪
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {!isPremium && (
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="relative z-10 mt-10"
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/90 dark:from-slate-900/95 dark:via-purple-950/60 dark:to-pink-950/60 shadow-2xl backdrop-blur-sm">
            {/* Premium animated border */}
            <div className="absolute inset-0 rounded-xl p-[3px] bg-gradient-to-r from-purple-500 via-pink-500 via-amber-500 via-orange-500 to-red-500 animate-gradient-x">
              <div className="bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/90 dark:from-slate-900/95 dark:via-purple-950/60 dark:to-pink-950/60 rounded-[9px] h-full w-full backdrop-blur-sm" />
            </div>
            
            {/* Floating premium elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-6 right-8 opacity-30">
                <motion.div
                  animate={{ 
                    y: [-8, 8, -8],
                    rotate: [0, 15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Crown className="h-20 w-20 text-amber-400 drop-shadow-lg" />
                </motion.div>
              </div>
              
              <div className="absolute top-8 left-8 opacity-20">
                <motion.div
                  animate={{ 
                    y: [5, -5, 5],
                    rotate: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Gift className="h-16 w-16 text-purple-400 drop-shadow-md" />
                </motion.div>
              </div>
              
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-25">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.25, 0.4, 0.25]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Sparkles className="h-12 w-12 text-pink-400" />
                </motion.div>
              </div>
            </div>

            <CardContent className="relative z-10 p-10 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Premium icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.08, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30"
                >
                  <Crown className="h-8 w-8 text-white drop-shadow-lg" />
                </motion.div>
                
                {/* Enhanced title */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 via-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                    Unlock Premium Rewards
                  </h3>
                  <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full" />
                </div>
                
                {/* Enhanced description */}
                <p className="text-muted-foreground/90 text-lg leading-relaxed max-w-md mx-auto font-medium">
                  Transform your study points into <span className="font-bold text-purple-600 dark:text-purple-400">real rewards</span> including vouchers, exclusive Discord roles, and premium tech prizes!
                </p>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-8">
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border border-emerald-200/50 dark:border-emerald-800/50">
                    <Gift className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Food Vouchers</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-200/50 dark:border-purple-800/50">
                    <Users className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">VIP Access</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/50 dark:border-amber-800/50">
                    <Trophy className="h-6 w-6 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Tech Prizes</span>
                  </div>
                </div>
                
                {/* Enhanced CTA button */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={onUpgrade} 
                    className="h-14 px-8 bg-gradient-to-r from-purple-600 via-pink-600 via-amber-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:via-amber-700 hover:to-orange-700 text-white font-black text-lg shadow-2xl shadow-purple-500/30 border-0 rounded-2xl tracking-wide transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      <span>Upgrade to Premium</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Crown className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </Button>
                </motion.div>
                
                {/* Trust indicator */}
                <p className="text-xs text-muted-foreground/70 mt-4 font-medium">
                  Join thousands of students already earning rewards ⭐
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </DialogContent>
  );

  const LeaderboardModal = () => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Weekly Leaderboard
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-2 mt-4">
        {leaderboard.map((entry, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                entry.rank === 1 ? 'bg-yellow-500 text-white' :
                entry.rank === 2 ? 'bg-gray-400 text-white' :
                entry.rank === 3 ? 'bg-amber-600 text-white' :
                'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {entry.rank}
              </div>
              <span className="font-medium">{entry.name}</span>
            </div>
            <Badge variant="secondary">{entry.points} MP</Badge>
          </div>
        ))}
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Resets every Monday
      </p>
    </DialogContent>
  );

  return (
    <div className="mb-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-purple-50/60 to-blue-50/60 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-xl hover:shadow-2xl transition-all duration-500 group transform hover:scale-[1.02]">
        {/* Enhanced glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating orbs */}
        <div className="absolute top-4 right-6 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-8 right-12 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float-delayed opacity-50" />
        <div className="absolute bottom-6 left-8 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-bounce opacity-40" />
        
        {/* Premium border with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-xl p-[2px] group-hover:p-[3px] transition-all duration-300">
          <div className="bg-gradient-to-br from-white via-purple-50/60 to-blue-50/60 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 rounded-[10px] h-full w-full" />
        </div>

        {/* Additional floating particles with staggered animations */}
        <div className="absolute top-3 right-4 w-1.5 h-1.5 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-4 left-6 w-1 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute top-12 left-4 w-1.5 h-1.5 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }} />

        <CardContent className="relative p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Turn Revision Into Rewards
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT SIDE: Points & Progress */}
            <div className="space-y-4">
              {/* MP Progress */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-purple-500/30 transition-all duration-300 group-hover:scale-105 mx-auto">
                    <div className="absolute inset-1 rounded-xl bg-white/20" />
                    <Trophy className="h-7 w-7 text-white relative z-10 drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                    <Gift className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                <motion.div
                  key={userPoints.total_points}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="space-y-2"
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {userPoints.total_points} MP
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    Next: {rewardProgress.nextReward.title} • {rewardProgress.current}/{rewardProgress.target} MP
                  </p>
                  <div className="relative">
                    <Progress 
                      value={rewardProgress.progress} 
                      className="w-full h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:via-amber-400 [&>div]:to-orange-400"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white drop-shadow-lg">
                        {Math.round(rewardProgress.progress)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Streak Display */}
              <div className="relative p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/20 rounded-2xl border-2 border-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 dark:border-orange-800 overflow-hidden group/streak hover:shadow-lg transition-all duration-300">
                {/* Animated background particles */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 left-4 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-4 left-12 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
                  <div className="absolute bottom-2 right-4 w-2.5 h-2.5 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-amber-400/10 opacity-0 group-hover/streak:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center justify-center space-x-3">
                  <motion.span 
                    className="text-3xl animate-bounce"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🔥
                  </motion.span>
                  <div className="text-center">
                    <motion.span 
                      className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent"
                      key={currentStreak}
                      initial={{ scale: 0.5, y: 20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 10, stiffness: 200 }}
                    >
                      Streak: {currentStreak} days
                    </motion.span>
                    <motion.div 
                      className="text-xs font-medium text-orange-700 dark:text-orange-300 mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Keep it going! 🚀
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Quests & Actions */}
            <div className="space-y-4">
              {/* Daily Quests */}
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-foreground">Today's Quests</h4>
                
                {/* Login Quest */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {userPoints.daily_login_complete ? (
                      <span className="text-lg">✅</span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">Log in today</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+10 MP</Badge>
                </div>

                {/* Practice Quest */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {userPoints.practice_complete ? (
                      <span className="text-lg">✅</span>
                    ) : (
                      <span className="text-lg">📚</span>
                    )}
                    <span className="text-sm font-medium">Finish 1 set of practice questions</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">+40 MP</Badge>
                </div>

                {/* Special Milestone - Enhanced */}
                <motion.div 
                  className="relative p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-indigo-950/30 border-2 border-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 dark:border-purple-800 overflow-hidden group/milestone hover:shadow-xl transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Premium background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-indigo-400/10 opacity-0 group-hover/milestone:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-2 right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-40" />
                  <div className="absolute bottom-2 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-4 left-4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-60" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Crown className="h-6 w-6 text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text" style={{
                          WebkitBackgroundClip: 'text',
                          filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))'
                        }} />
                      </motion.div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span>🎯</span>
                          <motion.span 
                            className="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent"
                            animate={{ 
                              textShadow: [
                                "0 0 0px rgba(168, 85, 247, 0)",
                                "0 0 10px rgba(168, 85, 247, 0.3)",
                                "0 0 0px rgba(168, 85, 247, 0)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Predicted 2026 Exam
                          </motion.span>
                        </div>
                        <p className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-medium">
                          ✨ One-time mega milestone ✨
                        </p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Badge className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 border-0 px-3 py-1">
                        +500 MP 💎
                      </Badge>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg">
                      <Gift className="mr-2 h-4 w-4" />
                      View Rewards
                    </Button>
                  </DialogTrigger>
                  <RewardsModal />
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-2">
                      <Users className="mr-2 h-4 w-4" />
                      Leaderboard
                    </Button>
                  </DialogTrigger>
                  <LeaderboardModal />
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-white via-slate-50/80 to-purple-50/60 dark:from-slate-950 dark:via-slate-900/90 dark:to-purple-950/60 border-0 shadow-2xl backdrop-blur-sm">
          {selectedReward && (
            <div className="text-center space-y-6 py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 shadow-xl flex items-center justify-center">
                    <selectedReward.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">{selectedReward.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                
                <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Cost: {selectedReward.points} MP
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <span>Balance: {actualMPBalance} MP → {actualMPBalance - selectedReward.points} MP</span>
                </div>

                {!canRedeemReward(selectedReward) && (
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                    You can't redeem the same reward twice in the same month.
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                  disabled={isRedeeming}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRedemption}
                  disabled={isRedeeming || !canRedeemReward(selectedReward)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  {isRedeeming ? "Redeeming..." : "Confirm Purchase"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal with Confetti */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-white via-slate-50/80 to-purple-50/60 dark:from-slate-950 dark:via-slate-900/90 dark:to-purple-950/60 border-0 shadow-2xl backdrop-blur-sm">
          <div className="text-center space-y-6 py-8">
            {/* Confetti Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="relative"
            >
              {/* Confetti particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    i % 4 === 0 ? 'bg-purple-400' :
                    i % 4 === 1 ? 'bg-pink-400' :
                    i % 4 === 2 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
              
              <div className="text-6xl">🎉</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                🎉 Reward Redeemed!
              </h2>
              
              {selectedReward && (
                <p className="text-muted-foreground">
                  We'll send your <span className="font-semibold text-foreground">{selectedReward.title}</span> to you within 48 hours.
                </p>
              )}

              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  New Balance: {actualMPBalance} MP
                </span>
              </div>
            </motion.div>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}