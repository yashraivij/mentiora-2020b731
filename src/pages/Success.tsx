import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "🎉 Welcome to Mentiora Premium!",
      description: "Your subscription is now active.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="max-w-md w-full border-2 border-green-200 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800 mb-2">
            Payment Successful!
          </CardTitle>
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="text-green-700 font-medium">Premium Activated</span>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium mb-2">
              Welcome to Mentiora Premium!
            </p>
            <p className="text-green-700 text-sm">
              You now have access to predicted exam papers, advanced analytics, and premium features.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/predicted-questions')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Start Premium Exam Practice
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;