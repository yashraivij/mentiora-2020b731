import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Crown, 
  Star, 
  Sparkles, 
  Check,
  Trophy,
  Rocket,
  Lock,
  Shield
} from "lucide-react";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumUpgradeModal = ({ isOpen, onClose, onUpgrade }: PremiumUpgradeModalProps) => {
  const handleUpgrade = () => {
    onUpgrade();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-0">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/10 via-transparent to-pink-500/10" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 via-fuchsia-500 via-pink-500 to-orange-500 p-0.5 animate-pulse">
          <div className="h-full w-full rounded-lg bg-background/95" />
        </div>

        <DialogHeader className="relative z-10 pb-6">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-2xl shadow-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-4xl font-black flex items-center gap-2">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome to Mentiora!
                  </span>
                  <span style={{ fontSize: '1em' }}>👋</span>
                </DialogTitle>
                <DialogDescription className="text-xl text-muted-foreground font-medium">
                  Let's personalize your <span className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">premium</span> learning experience
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="relative z-10 flex-1 overflow-hidden">
          {/* Step 5: Premium Upgrade - Ultra Premium Design - Exact duplicate */}
          <div className="space-y-2 max-h-[calc(98vh-140px)] overflow-hidden">
            {/* Animated Premium Header - Dynamic & Bigger */}
            <div className="text-center space-y-2 relative overflow-hidden">
              {/* Floating background elements */}
              <div className="absolute inset-0 flex justify-center items-center opacity-10">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-32 h-32 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-full blur-3xl"
                />
              </div>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 360, 0] 
                }}
                transition={{ 
                  duration: 1,
                  type: "spring",
                  bounce: 0.5
                }}
                className="relative inline-block z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-2xl blur-xl opacity-75">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-full h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-2xl"
                  />
                </div>
                <div className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 p-4 rounded-2xl shadow-2xl">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Crown className="h-10 w-10 text-white drop-shadow-2xl" />
                  </motion.div>
                </div>
              </motion.div>
              
               <motion.h3
                 initial={{ opacity: 0, y: 30, scale: 0.8 }}
                 animate={{ 
                   opacity: 1, 
                   y: 0, 
                   scale: 1
                 }}
                 transition={{ 
                   delay: 0.3,
                   duration: 0.8,
                   type: "spring"
                 }}
                 className="text-4xl font-black relative z-10 flex items-center justify-center gap-2"
               >
                 <motion.span
                   animate={{ 
                     textShadow: [
                       "0 0 0px rgba(255,255,255,0)",
                       "0 0 20px rgba(255,255,255,0.5)",
                       "0 0 0px rgba(255,255,255,0)"
                     ]
                   }}
                   transition={{ 
                     duration: 3, 
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                   style={{ fontSize: '1em' }}
                 >
                   🚀
                 </motion.span>
                 <span className="bg-gradient-to-r from-yellow-500 via-orange-500 via-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                   Unlock Your Academic Superpower!
                 </span>
                 <motion.span
                   animate={{ 
                     textShadow: [
                       "0 0 0px rgba(255,255,255,0)",
                       "0 0 20px rgba(255,255,255,0.5)",
                       "0 0 0px rgba(255,255,255,0)"
                     ]
                   }}
                   transition={{ 
                     duration: 3, 
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                   style={{ fontSize: '1em' }}
                 >
                   ✨
                 </motion.span>
               </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.5,
                  duration: 0.6
                }}
                className="text-xl font-bold relative z-10"
              >
                <motion.span
                  animate={{ 
                    color: ["#059669", "#0891b2", "#7c3aed", "#059669"]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Join{" "}
                  <motion.span 
                    className="font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    10,000+ students
                  </motion.span>
                  {" "}getting{" "}
                  <motion.span 
                    className="font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    2+ grades higher
                  </motion.span>
                </motion.span>
              </motion.p>
              
              {/* Floating sparkles */}
                 {[...Array(6)].map((_, i) => (
                   <motion.div
                     key={i}
                     className="absolute"
                     style={{
                       left: `${20 + i * 12}%`,
                       top: `${10 + (i % 2) * 60}%`,
                       fontSize: '1.2em'
                     }}
                     animate={{
                       y: [0, -20, 0],
                       rotate: [0, 180, 360],
                       scale: [0.5, 1, 0.5]
                     }}
                     transition={{
                       duration: 3 + i * 0.5,
                       repeat: Infinity,
                       delay: i * 0.3,
                       ease: "easeInOut"
                     }}
                   >
                     ✨
                   </motion.div>
                 ))}
            </div>

            {/* Revolutionary Comparison Cards - Larger */}
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              {/* Free Plan - Deliberately Limited */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 opacity-75">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
                      <div className="bg-gray-500 p-1.5 rounded">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold">Free (Limited)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-3">
                    <div className="space-y-2">
                      {[
                        { text: 'Basic practice questions', limited: true },
                        { text: 'No grade predictions', limited: true },
                        { text: 'No advanced analytics', limited: true },
                        { text: 'Basic progress tracking', limited: true }
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <div className="text-xl font-black text-gray-600">FREE</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Premium Plan - Ultra Desirable */}
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="relative"
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 via-pink-500 to-purple-500 rounded-xl blur-md opacity-75 animate-pulse" />
                
                <Card className="relative bg-gradient-to-br from-yellow-50 via-orange-50 via-pink-50 to-purple-50 dark:from-yellow-950/30 dark:via-orange-950/30 dark:via-pink-950/30 dark:to-purple-950/30 border-0 shadow-xl">
                  {/* Premium badges */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full font-black text-sm shadow-xl border-2 border-white"
                    >
                      🏆 MOST POPULAR
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-2 right-2 z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold"
                    >
                      92% SUCCESS
                    </motion.div>
                  </div>
                  
                  <CardHeader className="pb-2 relative z-10 pt-5">
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg shadow-lg">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Premium Superpower
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 relative z-10 pb-3">
                    <div className="space-y-2">
                      {[
                        { text: '🤖 Grade Predictor (99% accurate)', premium: true },
                        { text: '🧠 Smart Study Plans', premium: true },
                        { text: '♾️ Unlimited Everything', premium: true },
                        { text: '📊 Advanced Analytics', premium: true },
                        { text: '⚡ Weak Topic Detection', premium: true },
                        { text: '🎯 Exam Predictions', premium: true }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + (index * 0.05) }}
                          className="flex items-center gap-2"
                        >
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm font-semibold">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Pricing with massive discount */}
                    <div className="pt-2 border-t border-gradient-to-r from-yellow-200 to-orange-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground line-through">£19.99/mo</div>
                        <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">50% OFF!</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <div className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">£9.99</div>
                        <div className="text-sm text-muted-foreground">/month</div>
                      </div>
                      <div className="text-xs text-emerald-600 font-bold">⚡ LIMITED TIME ONLY</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Social Proof & CTA Section - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center space-y-3 pt-2"
            >
              {/* Social Proof */}
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 rounded-lg p-2 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="font-bold">4.9/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-orange-500" />
                    <span className="font-bold">92%</span>
                    <span className="text-muted-foreground">grade improvement</span>
                  </div>
                </div>
              </div>

              {/* Main CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleUpgrade}
                  className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white font-black px-6 py-2.5 text-sm shadow-xl shadow-orange-500/50 overflow-hidden group w-full max-w-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                   <div className="flex items-center justify-center gap-2 relative z-10">
                     <Rocket className="h-4 w-4" />
                     <span style={{ fontSize: '1em' }}>🚀</span>
                     <span>Start Your Academic Transformation!</span>
                     <Sparkles className="h-4 w-4" />
                   </div>
                </Button>
              </motion.div>
              
              {/* Guarantee & Benefits */}
              <p className="text-xs font-bold text-emerald-600">
                <span style={{ fontSize: '1em' }}>✅</span> 30-day money-back guarantee • <span style={{ fontSize: '1em' }}>📱</span> Cancel anytime
              </p>
            </motion.div>
            
            {/* Action Buttons - Fixed at bottom */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4 bg-background">
              <Button 
                variant="outline" 
                onClick={() => {}} 
                className="px-6 py-3 text-base font-semibold border-2 border-gray-400 hover:bg-gray-100 shadow-lg"
                style={{ visibility: 'hidden' }}
              >
                ← Back
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="px-6 py-3 text-base font-semibold border-2 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-lg"
              >
                Continue with Free Version
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};