import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PaywallCardProps {
  title: string;
  description?: string;
  onUpgrade: () => void;
  children?: React.ReactNode;
}

export const PaywallCard = ({ title, description, onUpgrade, children }: PaywallCardProps) => {
  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
          <Crown className="h-4 w-4 text-accent ml-auto" />
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="relative">
        {children && (
          <div className="mb-4 opacity-30 pointer-events-none blur-sm">
            {children}
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-4 py-6">
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Premium Feature</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Unlock advanced analytics, predicted grades, and personalized study insights with Premium.
            </p>
          </div>
          
          <Button 
            onClick={onUpgrade}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};