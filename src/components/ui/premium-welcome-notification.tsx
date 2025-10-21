import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, BookOpen, TrendingUp, Calendar, Brain, Check, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PremiumWelcomeNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function PremiumWelcomeNotification({ isVisible, onClose }: PremiumWelcomeNotificationProps) {
  const premiumFeatures = [
    {
      icon: FileText,
      title: "Predicted 2026 Papers",
      description: "AI-generated exam papers based on past patterns and current trends",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconBg: "bg-blue-500"
    },
    {
      icon: Brain,
      title: "Smart Revision Notes",
      description: "Auto-generated notes from your mistakes with bulletproof explanations",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconBg: "bg-purple-500"
    },
    {
      icon: Calendar,
      title: "Adaptive Weekly Plan",
      description: "Personalized study schedule that adapts to your progress and goals",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      iconBg: "bg-green-500"
    },
    {
      icon: TrendingUp,
      title: "Enhanced Analytics",
      description: "Deep insights into your performance with predictive grade tracking",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      iconBg: "bg-orange-500"
    },
    {
      icon: BookOpen,
      title: "Unlimited Flashcards",
      description: "Create and study unlimited AI-enhanced flashcard sets",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      iconBg: "bg-indigo-500"
    },
    {
      icon: Sparkles,
      title: "Priority Support",
      description: "Get faster responses and dedicated help when you need it",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      iconBg: "bg-yellow-500"
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl"
          >
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-background shadow-2xl">
              {/* Header Section */}
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border p-8">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-background/80 hover:bg-background border border-border transition-all hover:scale-110"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="flex items-center gap-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Crown className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  </motion.div>

                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="mb-3 bg-primary/20 text-primary border-primary/30 px-3 py-1">
                        Premium Activated
                      </Badge>
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Welcome to Mentiora Premium
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        You now have access to everything you need to ace your exams
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">Your Premium Features</h3>
                  <p className="text-muted-foreground">Everything you need to maximize your study efficiency</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {premiumFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Card className={`${feature.bgColor} border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group`}>
                          <CardContent className="p-5">
                            <div className="flex gap-4">
                              <div className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
                                  {feature.title}
                                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={onClose}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Start Using Premium Features
                  </Button>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-center text-sm text-muted-foreground mt-6"
                >
                  Your premium features are now active. Head to your dashboard to get started!
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}