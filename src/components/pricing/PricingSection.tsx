import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const PricingSection = () => {
  const { user } = useAuth();
  
  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: user ? {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        } : {}
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        return;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="mb-32">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-amber-700 text-sm font-bold mb-8"
        >
          <Crown className="h-5 w-5 mr-2 text-amber-600 animate-pulse" />
          Simple Pricing
        </motion.div>
        <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Choose Your <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Learning Journey</span>
        </h3>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Start free and upgrade when you're ready to unlock advanced features.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group"
        >
          <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 rounded-3xl h-full">
            <CardHeader className="p-8 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Free Plan</CardTitle>
              <CardDescription className="text-gray-600 mb-6">Perfect for getting started</CardDescription>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">£0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Basic practice questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Subject selection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Basic progress tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
              <Button 
                onClick={() => window.location.href = '/register'} 
                variant="outline" 
                className="w-full py-3 text-lg font-semibold hover:bg-gray-50"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="group"
        >
          <Card className="relative overflow-hidden border-2 border-violet-300 hover:border-violet-400 transition-all duration-300 rounded-3xl h-full shadow-2xl">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-50" />
            <CardHeader className="p-8 text-center relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-violet-600" />
                Premium Plan
              </CardTitle>
              <CardDescription className="text-gray-600 mb-6">Unlock your full potential</CardDescription>
              <div className="mb-6">
                <span className="text-4xl font-bold text-violet-600">£49.99</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                  <span className="text-gray-700">Everything in Free</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                  <span className="text-gray-700">Smart revision notebook</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                  <span className="text-gray-700">Predicted exam papers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                  <span className="text-gray-700">Personalized study plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <Button 
                onClick={handleUpgrade} 
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
              >
                <Zap className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};