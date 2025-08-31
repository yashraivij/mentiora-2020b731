import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Sparkles, Star, Zap, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PaywallCardProps {
  title: string;
  description?: string;
  onUpgrade: () => void;
  children?: React.ReactNode;
}

export const PaywallCard = ({ title, description, onUpgrade, children }: PaywallCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 shadow-2xl">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 animate-pulse" />
      
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
            <Star className="h-2 w-2 text-violet-400" />
          </motion.div>
        ))}
      </div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-0.5">
        <div className="h-full w-full rounded-lg bg-card" />
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock className="h-6 w-6 text-violet-500" />
          </motion.div>
          <CardTitle className="text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent font-bold">
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
            <Crown className="h-6 w-6 text-yellow-500 drop-shadow-lg" />
          </motion.div>
        </div>
        {description && (
          <CardDescription className="text-foreground/80 font-medium">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        {children && (
          <div className="mb-6 opacity-40 pointer-events-none blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-t from-violet-500/30 to-transparent rounded-lg" />
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
              className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 blur-xl opacity-50"
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
              className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 p-6 rounded-2xl shadow-2xl"
            >
              <Trophy className="h-16 w-16 text-white drop-shadow-lg" />
            </motion.div>
            
            {/* Orbiting icons */}
            {[Sparkles, Zap, TrendingUp, Star].map((Icon, i) => (
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
                <Icon className="h-6 w-6 text-violet-400" />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center space-y-4">
            <motion.h3 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-bold text-2xl bg-gradient-to-r from-violet-600 via-purple-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent bg-300% bg-size-200"
              style={{ backgroundSize: "200% 100%" }}
            >
              🚀 Premium Feature
            </motion.h3>
            <p className="text-foreground/90 max-w-md font-medium leading-relaxed">
              Unlock <span className="text-violet-600 font-semibold">advanced AI analytics</span>, 
              <span className="text-purple-600 font-semibold"> predicted grades</span>, and 
              <span className="text-fuchsia-600 font-semibold"> personalized insights</span> that adapt to your unique learning style!
            </p>
            
            {/* Benefits showcase */}
            <div className="grid grid-cols-2 gap-3 mt-6 max-w-sm mx-auto">
              {[
                { icon: TrendingUp, text: "Grade Predictions" },
                { icon: Zap, text: "AI Analytics" },
                { icon: Star, text: "Study Insights" },
                { icon: Trophy, text: "Performance Boost" }
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm font-medium text-foreground/80"
                >
                  <Icon className="h-4 w-4 text-violet-500" />
                  {text}
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onUpgrade}
              size="lg"
              className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 text-lg overflow-hidden group"
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