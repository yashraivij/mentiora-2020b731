import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Gift, Users, Zap, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [userPoints, setUserPoints] = useState<UserPoints>({
    total_points: 0,
    daily_login_complete: false,
    practice_complete: false,
    predicted_exam_complete: false,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
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

  const RewardsModal = () => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Mentiora Rewards Shop
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {REWARDS.map((reward, index) => {
          const canRedeem = isPremium && userPoints.total_points >= reward.points;
          const Icon = reward.icon;
          
          return (
            <Card 
              key={index} 
              className={`p-4 border-2 transition-all duration-300 ${
                canRedeem 
                  ? 'border-green-400 bg-green-50 dark:bg-green-950/20' 
                  : isPremium 
                    ? 'border-gray-300 dark:border-gray-600' 
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${canRedeem ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{reward.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {reward.points} MP
                    </Badge>
                    {!isPremium ? (
                      <Button size="sm" variant="outline" onClick={onUpgrade} className="text-xs h-7">
                        Upgrade
                      </Button>
                    ) : canRedeem ? (
                      <Button size="sm" className="text-xs h-7">
                        Redeem
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Need {reward.points - userPoints.total_points} MP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {!isPremium && (
        <Card className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
          <div className="text-center">
            <Crown className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Upgrade to Premium</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Redeem rewards with Premium to claim vouchers, VIP roles, and tech prizes.
            </p>
            <Button onClick={onUpgrade} className="bg-gradient-to-r from-purple-500 to-pink-500">
              Upgrade Now
            </Button>
          </div>
        </Card>
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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-purple-50/60 to-blue-50/60 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-xl hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm transform hover:scale-[1.02]">
        {/* Enhanced glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating orbs */}
        <div className="absolute top-4 right-6 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-8 right-12 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float-delayed opacity-50" />
        <div className="absolute bottom-6 left-8 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-bounce opacity-40" />
        
        {/* Premium border with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-xl p-[2px] group-hover:p-[3px] transition-all duration-300">
          <div className="bg-gradient-to-br from-white via-purple-50/60 to-blue-50/60 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 rounded-[10px] h-full w-full backdrop-blur-sm" />
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
                    <div className="absolute inset-1 rounded-xl bg-white/20 backdrop-blur-sm" />
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
    </div>
  );
}