import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import mentioraLogo from "@/assets/mentiora-logo.png";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const { openPaymentLink } = useSubscription();
  const [examYear, setExamYear] = useState<"2026" | "2027">("2026");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [showParentForm, setShowParentForm] = useState(false);

  // Dynamic pricing based on exam year
  const pricingData = {
    "2026": {
      monthlyPrice: "24.99",
      oneTimePrice: "200.00",
      originalPrice: "300.00",
      savingsPercent: "33%",
      endDate: "31st July 2026",
      offerEnds: "15/10/25",
      monthsUntilExam: "16"
    },
    "2027": {
      monthlyPrice: "24.99",
      oneTimePrice: "225.00",
      originalPrice: "350.00",
      savingsPercent: "36%",
      endDate: "31st July 2027",
      offerEnds: "31/12/25",
      monthsUntilExam: "28"
    }
  };

  const currentPricing = pricingData[examYear];
  const monthlySavings = ((parseFloat(currentPricing.oneTimePrice) / parseFloat(currentPricing.monthlyPrice) / parseFloat(currentPricing.monthsUntilExam)) * 100).toFixed(0);

  const handleUpgrade = () => {
    openPaymentLink();
    onOpenChange(false);
  };

  const handleSendParentEmail = () => {
    if (!studentName || !parentEmail) {
      toast({
        title: "Missing information",
        description: "Please enter both your name and parent's email.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Email sent!",
      description: "We've sent an email to your parent explaining Mentiora.",
    });
    setStudentName("");
    setParentEmail("");
    setShowParentForm(false);
  };

  const features = [
    "Get an adaptive personalised weekly study plan tailored to your learning pace and exam goals.",
    "Practice with 2,500+ exam-style questions per subject with instant marking and feedback.",
    "Track your performance with real-time analytics showing strengths, weaknesses and predicted grades.",
    "Access 24/7 tutoring with step-by-step explanations for every concept and question.",
    "Get exclusive access to Mentiora's 2026 Predicted Papers.",
    "Create and review custom flashcards powered by spaced repetition for better retention.",
    "Study efficiently with exam-focused notes for every topic in your curriculum.",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Start</h1>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00A8FF] to-[#0096E6] rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                <img 
                  src={mentioraLogo} 
                  alt="Mentiora" 
                  className="w-10 h-10"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">for free.</h1>
          </div>
        </DialogHeader>

        <div className="px-2">
          <p className="text-center text-gray-600 mb-6">
            Pay just once to get all-in-one access until {currentPricing.endDate}, or subscribe to on-the-go learning.
          </p>

          {!showParentForm ? (
            <>
              {/* Ask My Parents Link */}
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowParentForm(true)}
                  className="text-[#00A8FF] font-medium flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity"
                >
                  Ask my parents <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Exam Year Toggle */}
              <div className="flex justify-center gap-2 mb-8">
                <button
                  onClick={() => setExamYear("2026")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    examYear === "2026"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  2026 Exams
                </button>
                <button
                  onClick={() => setExamYear("2027")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    examYear === "2027"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  2027 Exams
                </button>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Monthly */}
                <Card className="border-2 border-gray-200 rounded-3xl p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">Monthly</h3>
                  <p className="text-gray-600 text-sm mb-4">Monthly billing, full access, cancel anytime.</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">£{currentPricing.monthlyPrice}</span>
                      <span className="text-gray-600 text-sm">/month</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ~£{(parseFloat(currentPricing.monthlyPrice) * parseFloat(currentPricing.monthsUntilExam)).toFixed(0)} total until {examYear} exams
                    </p>
                  </div>

                  <Button
                    onClick={handleUpgrade}
                    variant="outline"
                    className="w-full h-12 rounded-full text-sm font-semibold border-2 border-gray-900 !text-gray-900 hover:bg-gray-50 hover:!text-gray-900"
                  >
                    Subscribe Monthly
                  </Button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    £{currentPricing.monthlyPrice} billed monthly. Cancel anytime.
                  </p>
                </Card>

                {/* Exam Access Card */}
                <Card className="border-2 border-gray-200 rounded-3xl p-6 bg-[#00A8FF] text-white relative hover:shadow-xl transition-shadow">
                  <div className="absolute top-4 right-4 bg-white text-[#00A8FF] px-3 py-1 rounded-full text-xs font-bold">
                    Save {currentPricing.savingsPercent}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{examYear} Exams</h3>
                  <p className="mb-4 text-white/90 text-sm">
                    One-time payment. Get unlimited access until {currentPricing.endDate}.
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold">£{currentPricing.oneTimePrice}</span>
                      <span className="text-white/90 text-sm">once</span>
                    </div>
                    <span className="text-white/70 line-through">{currentPricing.originalPrice}</span>
                  </div>

                  <Button
                    onClick={handleUpgrade}
                    className="w-full h-12 rounded-full text-sm font-semibold bg-white text-[#00A8FF] hover:bg-gray-50"
                  >
                    Get Exam Access
                  </Button>

                  <p className="text-xs text-white/80 mt-3 text-center">
                    £{currentPricing.oneTimePrice} billed once. Offer ends {currentPricing.offerEnds}.
                  </p>
                </Card>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <div className="space-y-2">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Parent Form */}
              <div className="mb-6">
                <button
                  onClick={() => setShowParentForm(false)}
                  className="text-gray-600 hover:text-gray-900 mb-4 text-sm"
                >
                  ← Back to pricing
                </button>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Want help asking your parents?
                </h3>
                
                <p className="text-gray-600 mb-6 text-sm">
                  Mentiora can send an email on your behalf to explain the subscription details.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Your Name*
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="h-12 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Parent or Guardian Email*
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter their email address"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="h-12 rounded-lg"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendParentEmail}
                  className="w-full h-12 rounded-full bg-[#00A8FF] hover:bg-[#0096E6] text-white font-semibold"
                >
                  Send Email
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
