import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Crown } from "lucide-react";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 p-4">
      <Card className="max-w-md w-full border-2 border-gray-200 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            Payment Cancelled
          </CardTitle>
          <p className="text-gray-600">
            Your subscription was not created.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-gray-800 font-medium mb-2">
              No charges were made
            </p>
            <p className="text-gray-600 text-sm">
              You can try again anytime to unlock premium features.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/predicted-questions')}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Try Premium Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;