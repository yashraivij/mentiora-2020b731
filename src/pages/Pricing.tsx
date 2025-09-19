import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { ArrowLeft } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();

  const features = [
    { name: "Learning content", free: true, premium: true },
    { name: "Unlimited Hearts", free: false, premium: true },
    { name: "Skills practice", free: false, premium: true },
    { name: "Mistakes review", free: false, premium: true },
    { name: "Free challenge entry", free: false, premium: true },
    { name: "No ads", free: false, premium: true },
  ];

  const handleStartTrial = () => {
    openPaymentLink();
  };

  const handleNoThanks = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700 relative overflow-hidden">
      {/* Super badge */}
      <div className="absolute top-6 right-6">
        <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg">
          SUPER
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            Progress faster in your
          </h1>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
            Spanish course with Super!
          </h1>
        </div>

        {/* Pricing comparison card */}
        <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header row */}
            <div className="grid grid-cols-3 border-b border-white/20 bg-white/5">
              <div className="p-3"></div>
              <div className="p-3 text-center">
                <h3 className="text-white text-lg font-bold">FREE</h3>
              </div>
              <div className="p-3 text-center">
                <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-2.5 py-1 rounded-full font-bold text-xs inline-block shadow-md">
                  SUPER
                </div>
              </div>
            </div>

            {/* Feature rows */}
            {features.map((feature, index) => (
              <div key={feature.name} className="grid grid-cols-3 border-b border-white/10 last:border-b-0">
                <div className="p-3 flex items-center">
                  <span className="text-white text-sm font-medium">{feature.name}</span>
                </div>
                <div className="p-3 flex items-center justify-center">
                  {feature.free ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="p-3 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center space-y-3 w-full max-w-sm">
          <Button
            onClick={handleStartTrial}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-2xl text-base shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            START MY FREE 14 DAYS
          </Button>
          
          <button
            onClick={handleNoThanks}
            className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200"
          >
            NO THANKS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;