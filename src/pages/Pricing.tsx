import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
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
    { name: "Advanced analytics", free: false, premium: true },
    { name: "Personalized insights", free: false, premium: true },
  ];

  const handleStartTrial = () => {
    openPaymentLink();
  };

  const handleNoThanks = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-600 to-purple-700 relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="text-white hover:bg-white/20 rounded-full p-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Super badge */}
      <div className="absolute top-6 right-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
          SUPER
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-32 -left-32 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/3 rounded-full -bottom-48 -right-48 animate-pulse"></div>
        <div className="absolute w-32 h-32 bg-white/10 rounded-full top-1/3 right-1/4 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Progress faster in your
          </h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            studies with Super!
          </h1>
        </div>

        {/* Pricing comparison card */}
        <Card className="w-full max-w-2xl bg-white/10 border-white/20 backdrop-blur-md shadow-2xl">
          <CardContent className="p-0">
            {/* Header row */}
            <div className="grid grid-cols-3 border-b border-white/20">
              <div className="p-6"></div>
              <div className="p-6 text-center">
                <h3 className="text-white text-xl font-bold">FREE</h3>
              </div>
              <div className="p-6 text-center">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm inline-block shadow-lg">
                  SUPER
                </div>
              </div>
            </div>

            {/* Feature rows */}
            {features.map((feature, index) => (
              <div key={feature.name} className={`grid grid-cols-3 border-b border-white/10 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                <div className="p-4 flex items-center">
                  <span className="text-white font-medium">{feature.name}</span>
                </div>
                <div className="p-4 flex items-center justify-center">
                  {feature.free ? (
                    <Check className="h-6 w-6 text-green-400" />
                  ) : (
                    <X className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center space-y-4 w-full max-w-md">
          <Button
            onClick={handleStartTrial}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            START MY FREE 14 DAYS
          </Button>
          
          <button
            onClick={handleNoThanks}
            className="text-white/80 hover:text-white font-medium underline underline-offset-4 transition-colors duration-200"
          >
            NO THANKS
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center text-white/70 text-sm max-w-md">
          <p>Cancel anytime. No commitment required.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;