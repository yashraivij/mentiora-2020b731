import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, TrendingUp, Clock, Star, CheckCircle, Target, BookOpen, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePremium } from '@/hooks/usePremium';

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPaywall: React.FC<PremiumPaywallProps> = ({ isOpen, onClose, onUpgrade }) => {
  const { user } = useAuth();
  const { isPremium, subscriptionTier, subscriptionEnd } = usePremium();
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Don't show paywall to premium users
  if (isPremium) {
    return null;
  }
  
  const handleUpgradeClick = async () => {
    if (!user) {
      toast.error('Please log in to upgrade to Premium');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription');
      
      if (error) {
        toast.error('Failed to create subscription. Please try again.');
        console.error('Subscription error:', error);
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onUpgrade();
      } else {
        toast.error('Invalid response from subscription service');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) {
      toast.error('Please log in to cancel subscription');
      return;
    }

    setIsCanceling(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) {
        toast.error('Failed to cancel subscription. Please try again.');
        console.error('Cancel subscription error:', error);
        return;
      }

      if (data?.success) {
        toast.success('Subscription cancelled successfully');
        // Force refresh of premium status
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };
  const benefits = [
    {
      icon: TrendingUp,
      title: "Predicted Grade 9s",
      description: "Advanced analytics predict Grade 9 outcomes across all subjects based on your performance",
      highlight: "92% accuracy rate"
    },
    {
      icon: Clock,
      title: "Save 15+ Hours Weekly",
      description: "Smart study recommendations and auto-generated notes reduce revision time",
      highlight: "Worth £300+ in tutoring"
    },
    {
      icon: Target,
      title: "Exam Board Mastery",
      description: "Access to AQA, Edexcel, OCR, and WJEC predicted questions for 2026",
      highlight: "All specifications"
    },
    {
      icon: BookOpen,
      title: "Weakness Analysis",
      description: "Get detailed breakdowns of your weak areas with targeted improvement strategies",
      highlight: "Personalized insights"
    },
    {
      icon: Award,
      title: "University Ready",
      description: "Track your progress toward top university requirements and A-Level readiness",
      highlight: "Russell Group focused"
    },
    {
      icon: Star,
      title: "Advanced Analytics",
      description: "Deep insights into your performance with detailed progress tracking and recommendations",
      highlight: "Comprehensive reports"
    }
  ];

  const testimonials = [
    {
      quote: "Mentiora Premium helped me achieve Grade 9s in Maths and Physics. Now I'm at Oxford!",
      name: "Sarah Chen",
      university: "Oxford University"
    },
    {
      quote: "Saved me £2000 in tutoring costs and still got into Imperial College London.",
      name: "Marcus Thompson",
      university: "Imperial College"
    },
    {
      quote: "The grade predictions were spot on. Got into Cambridge for Medicine!",
      name: "Aisha Patel",
      university: "Cambridge University"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-emerald-900 rounded-3xl shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Header */}
            <div className="relative p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-emerald-600/30 rounded-t-3xl" />
              
              {/* Sparkles Animation */}
              <div className="absolute top-8 left-1/4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </motion.div>
              </div>
              <div className="absolute top-12 right-1/3">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </motion.div>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative inline-flex items-center space-x-4 mb-6"
              >
                <Crown className="h-16 w-16 text-amber-400" />
                <span className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Mentiora Premium
                </span>
                <Crown className="h-16 w-16 text-amber-400" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Secure Academic Future Success
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Get the competitive edge to achieve Grade 9s and secure places at top universities
              </p>
            </div>

            {/* Main Pricing Card */}
            <div className="px-8 mb-8">
              <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl">
                <div className="text-white/80 text-lg mb-3">Limited Time Offer</div>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-white/60 line-through text-2xl">£19.99</span>
                  <span className="text-6xl font-bold text-white">£9.99</span>
                  <span className="text-white/90 text-xl">/month</span>
                </div>
                <div className="text-amber-400 text-lg font-semibold mb-2">Save 50% - First 3 months</div>
                <div className="text-white/70 text-base mb-6">Less than a single tutoring session</div>
                
                <Button
                  onClick={handleUpgradeClick}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  {isLoading ? 'Creating Subscription...' : 'Start Free Trial'}
                </Button>
              </div>
            </div>

            {/* Premium Features */}
            <div className="px-8 mb-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Premium Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group hover:scale-105"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-xl group-hover:scale-110 transition-transform border border-amber-400/30">
                        <benefit.icon className="h-7 w-7 text-amber-400" />
                      </div>
                      <h3 className="font-bold text-white text-lg">{benefit.title}</h3>
                    </div>
                    <p className="text-white/80 text-base mb-4 leading-relaxed">{benefit.description}</p>
                    <div className="inline-block bg-gradient-to-r from-emerald-400/20 to-blue-400/20 border border-emerald-400/40 rounded-full px-4 py-2">
                      <span className="text-emerald-300 text-sm font-semibold">{benefit.highlight}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="px-8 mb-8">
              <h2 className="text-xl font-bold text-white text-center mb-6">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <p className="text-white/80 text-sm italic mb-3">"{testimonial.quote}"</p>
                    <div className="text-white font-medium text-sm">{testimonial.name}</div>
                    <div className="text-amber-400 text-xs">{testimonial.university}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div className="px-8 mb-8">
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-red-400" />
                  <span className="text-red-300 font-medium">Limited Time - 50% Off Ends Soon!</span>
                </div>
                <p className="text-white/70 text-sm">Join before spots fill up for the next academic year</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="px-8 pb-8">
              <div className="space-y-4">
                {isPremium ? (
                  // Show subscription management for premium users
                  <div className="space-y-4">
                    <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Crown className="h-5 w-5 text-emerald-400" />
                        <span className="text-emerald-300 font-medium">You're Premium!</span>
                      </div>
                      <p className="text-white/70 text-sm">
                        {subscriptionTier && `${subscriptionTier} plan`}
                        {subscriptionEnd && ` • Renews ${new Date(subscriptionEnd).toLocaleDateString()}`}
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleCancelSubscription}
                      disabled={isCanceling}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      {isCanceling ? 'Cancelling...' : 'Cancel Subscription'}
                    </Button>
                    
                    <button
                      onClick={onClose}
                      className="w-full text-white/60 hover:text-white/80 text-sm transition-colors py-2"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  // Show upgrade buttons for non-premium users
                  <>
                    <Button
                      onClick={handleUpgradeClick}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <Zap className="h-6 w-6" />
                        <span>{isLoading ? 'Creating Subscription...' : 'Upgrade to Premium Now'}</span>
                        <Crown className="h-6 w-6" />
                      </div>
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-white/60 text-sm">
                        🔒 Cancel anytime • ⚡ Instant access
                      </p>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="w-full text-white/60 hover:text-white/80 text-sm transition-colors py-2"
                    >
                      Maybe later
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 left-4 opacity-20">
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Award className="h-8 w-8 text-amber-400" />
              </motion.div>
            </div>
            <div className="absolute top-1/3 right-4 opacity-20">
              <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <Target className="h-8 w-8 text-emerald-400" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};