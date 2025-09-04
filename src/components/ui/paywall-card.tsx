import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Sparkles, Star, Zap, Trophy, TrendingUp, Brain, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface PaywallCardProps {
  title: string;
  description?: string;
  onUpgrade: () => void;
  children?: React.ReactNode;
  theme?: 'grades' | 'questions' | 'notebook';
  benefits?: string[];
}

const getThemeConfig = (theme: 'grades' | 'questions' | 'notebook' = 'grades') => {
  const configs = {
    grades: {
      gradients: {
        main: 'from-violet-500/10 via-purple-500/10 to-fuchsia-500/10',
        bg: 'from-violet-600/20 via-purple-600/20 to-fuchsia-600/20',
        border: 'from-violet-500 via-purple-500 to-fuchsia-500',
        button: 'from-violet-600 via-purple-600 to-fuchsia-600',
        buttonHover: 'from-violet-700 via-purple-700 to-fuchsia-700',
        text: 'from-violet-600 via-purple-600 to-fuchsia-600'
      },
      colors: {
        accent: 'text-violet-400',
        lock: 'text-violet-500',
        crown: 'text-yellow-500'
      },
      icon: Trophy,
      emoji: '🏆',
      orbitIcons: [Sparkles, Zap, TrendingUp, Star]
    },
    questions: {
      gradients: {
        main: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
        bg: 'from-emerald-600/20 via-teal-600/20 to-cyan-600/20',
        border: 'from-emerald-500 via-teal-500 to-cyan-500',
        button: 'from-emerald-600 via-teal-600 to-cyan-600',
        buttonHover: 'from-emerald-700 via-teal-700 to-cyan-700',
        text: 'from-emerald-600 via-teal-600 to-cyan-600'
      },
      colors: {
        accent: 'text-emerald-400',
        lock: 'text-emerald-500',
        crown: 'text-amber-500'
      },
      icon: Target,
      emoji: '🎯',
      orbitIcons: [Zap, Star, TrendingUp, Sparkles]
    },
    notebook: {
      gradients: {
        main: 'from-rose-500/10 via-pink-500/10 to-orange-500/10',
        bg: 'from-rose-600/20 via-pink-600/20 to-orange-600/20',
        border: 'from-rose-500 via-pink-500 to-orange-500',
        button: 'from-rose-600 via-pink-600 to-orange-600',
        buttonHover: 'from-rose-700 via-pink-700 to-orange-700',
        text: 'from-rose-600 via-pink-600 to-orange-600'
      },
      colors: {
        accent: 'text-rose-400',
        lock: 'text-rose-500',
        crown: 'text-amber-500'
      },
      icon: Brain,
      emoji: '🧠',
      orbitIcons: [BookOpen, Star, Sparkles, Zap]
    }
  };
  return configs[theme];
};

export const PaywallCard = ({ title, description, onUpgrade, children, theme = 'grades', benefits = [] }: PaywallCardProps) => {
  const config = getThemeConfig(theme);
  return (
    <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${config.gradients.main} shadow-2xl`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradients.bg} animate-pulse`} />
      
      {/* Floating sparkle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className={`h-2 w-2 ${config.colors.accent}`} />
          </motion.div>
        ))}
      </div>
      
      {/* Glowing border effect */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${config.gradients.border} p-0.5`}>
        <div className="h-full w-full rounded-lg bg-card" />
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock className={`h-6 w-6 ${config.colors.lock}`} />
          </motion.div>
          <CardTitle className={`text-xl bg-gradient-to-r ${config.gradients.text} bg-clip-text text-transparent font-bold`}>
            {title}
          </CardTitle>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto"
          >
            <Crown className={`h-6 w-6 ${config.colors.crown} drop-shadow-lg`} />
          </motion.div>
        </div>
        {description && (
          <CardDescription className="text-foreground/80 font-medium text-base">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        {children && (
          <div className="mb-6 opacity-40 pointer-events-none blur-sm relative">
            <div className={`absolute inset-0 bg-gradient-to-t ${config.gradients.bg} to-transparent rounded-lg`} />
            {children}
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-6 py-8">
          {/* Central premium icon with multiple animations */}
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradients.border} blur-xl opacity-50`}
            />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity
              }}
              className={`relative bg-gradient-to-br ${config.gradients.button} p-6 rounded-2xl shadow-2xl`}
            >
              <config.icon className="h-16 w-16 text-white drop-shadow-lg" />
            </motion.div>
            
            {/* Orbiting icons */}
            {config.orbitIcons.map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0 0",
                }}
                animate={{
                  rotate: [0, 360],
                  x: Math.cos((i * 90) * Math.PI / 180) * 60 - 12,
                  y: Math.sin((i * 90) * Math.PI / 180) * 60 - 12,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              >
                <Icon className={`h-6 w-6 ${config.colors.accent}`} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center space-y-4">
            <motion.h3 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className={`font-bold text-2xl bg-gradient-to-r ${config.gradients.text} bg-clip-text text-transparent bg-300% bg-size-200`}
              style={{ backgroundSize: "200% 100%" }}
            >
              {config.emoji} Premium Feature
            </motion.h3>
            <p className="text-foreground/90 max-w-md font-medium leading-relaxed">
              {description}
            </p>
            
            {/* Benefits showcase */}
            {benefits.length > 0 && (
              <div className="grid grid-cols-1 gap-3 mt-6 max-w-sm mx-auto">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-foreground/5 p-3 rounded-lg"
                  >
                    <Star className={`h-4 w-4 ${config.colors.lock} flex-shrink-0`} />
                    <span className="text-left">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onUpgrade}
              size="lg"
              className={`relative bg-gradient-to-r ${config.gradients.button} hover:${config.gradients.buttonHover} text-white font-bold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 text-lg overflow-hidden group`}
              style={{ 
                boxShadow: `0 20px 40px -10px ${theme === 'grades' ? 'rgba(139, 92, 246, 0.3)' : theme === 'questions' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Crown className="h-5 w-5 mr-3" />
              ✨ Upgrade to Premium
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};