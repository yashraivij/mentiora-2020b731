import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, TrendingUp, Clock, Star, CheckCircle, Target, BookOpen, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { supabase } from '@/integrations/supabase/client';
import { stripePromise } from '@/lib/stripe';

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPaywall: React.FC<PremiumPaywallProps> = ({ isOpen, onClose, onUpgrade }) => {
  const { user } = useAuth();
  const { isPremium } = usePremium();

  // Don't show paywall for premium users
  if (isPremium) {
    return null;
  }
  
  const handleUpgradeClick = async () => {
    console.log('Premium paywall - Start Free Trial clicked');
    try {
      console.log('User:', user);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: user ? {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        } : {}
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Error creating checkout session:', error);
        alert(`Error: ${error.message}`);
        return;
      }

      if (data?.id) {
        console.log('Redirecting to Stripe checkout with session ID:', data.id);
        // Use Stripe.js to redirect to checkout
        const stripe = await stripePromise;
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: data.id,
          });
          if (stripeError) {
            console.error('Stripe redirect error:', stripeError);
            alert(`Stripe redirect error: ${stripeError.message}`);
          }
        }
      } else {
        console.error('No session ID returned');
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`Unexpected error: ${error}`);
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
            <div className="relative p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-t-3xl" />
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative inline-flex items-center space-x-3 mb-4"
              >
                <Crown className="h-12 w-12 text-amber-400" />
                <span className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Mentiora Premium
                </span>
                <Crown className="h-12 w-12 text-amber-400" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Secure Academic Future Success
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Get the competitive edge to achieve Grade 9s and secure places at top universities
              </p>
              
              {/* Sparkles Animation */}
              <div className="absolute top-4 left-1/4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </motion.div>
              </div>
              <div className="absolute top-8 right-1/3">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </motion.div>
              </div>
            </div>

            {/* Pricing */}
            <div className="px-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center max-w-md mx-auto">
                <div className="text-white/70 text-sm mb-2">Limited Time Offer</div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-white/60 line-through text-lg">£19.99</span>
                  <span className="text-3xl font-bold text-white">£9.99</span>
                  <span className="text-white/80">/month</span>
                </div>
                <div className="text-amber-400 text-sm font-medium">Save 50% - First 3 months</div>
                <div className="text-white/60 text-xs mt-2">Less than a single tutoring session</div>
                <Button
                  onClick={handleUpgradeClick}
                  className="w-full mt-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="px-8 mb-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Premium Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-lg group-hover:scale-110 transition-transform">
                        <benefit.icon className="h-6 w-6 text-amber-400" />
                      </div>
                      <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{benefit.description}</p>
                    <div className="inline-block bg-gradient-to-r from-emerald-400/20 to-blue-400/20 border border-emerald-400/30 rounded-full px-3 py-1">
                      <span className="text-emerald-300 text-xs font-medium">{benefit.highlight}</span>
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
                <Button
                  onClick={handleUpgradeClick}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <span>Upgrade to Premium Now</span>
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