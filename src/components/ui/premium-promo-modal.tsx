import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Clock, Target, Brain, Zap, CheckCircle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ isOpen, onClose, onUpgrade }: PremiumPromoModalProps) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpgrade = () => {
    onUpgrade();
    onClose();
  };

  const premiumFeatures = [
    { icon: Target, text: "Unlimited Predicted Exams", highlight: true },
    { icon: Brain, text: "AI-Generated Study Notes", highlight: true },
    { icon: Zap, text: "Advanced Performance Analytics", highlight: false },
    { icon: Crown, text: "Priority Support & Updates", highlight: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-0 bg-gradient-to-br from-card via-card to-muted/20">
        <div className="relative">
          {/* Premium gradient header */}
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-6 text-primary-foreground relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-full mb-4"
              >
                <Crown className="h-8 w-8" />
              </motion.div>
              
              <DialogTitle className="text-2xl font-bold mb-2">
                Unlock Premium Today
              </DialogTitle>
              
              <DialogDescription className="text-primary-foreground/90 text-base">
                Limited time offer - Join 10,000+ students achieving better grades
              </DialogDescription>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-3">
            <div className="flex items-center justify-center gap-2 text-destructive">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">
                Special Offer Expires: {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Social proof */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Sparkles key={star} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                "Mentiora Premium helped me improve my grades by 2 full letter grades!"
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">- Sarah K., A-Level Student</p>
            </div>

            {/* Premium features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center text-foreground mb-4">What You Get Instantly:</h3>
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      feature.highlight 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      feature.highlight 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground flex-1">{feature.text}</span>
                    {feature.highlight && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        Popular
                      </Badge>
                    )}
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                );
              })}
            </div>

            {/* Value proposition */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30">
              <div className="text-center">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                  Save 15+ Hours Per Month
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  AI-powered study optimization that adapts to your learning style
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleUpgrade}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium Now
              </Button>
              
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>✓ 30-day money-back guarantee</p>
              <p>✓ Cancel anytime • Secure payment</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};