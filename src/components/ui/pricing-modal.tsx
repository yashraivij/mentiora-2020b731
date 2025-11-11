import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  console.log('PricingModal render - open state:', open);
  const { openPaymentLink } = useSubscription();
  const [examYear, setExamYear] = useState<"2026" | "2027">("2026");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [showParentForm, setShowParentForm] = useState(false);

  // Dynamic pricing based on exam year
  const pricingData = {
    "2026": {
      monthlyPrice: "9.99",
      oneTimePrice: "79.99",
      originalPrice: "199.99",
      savingsPercent: "15%",
      endDate: "31st July 2026",
      offerEnds: "15/10/25",
      monthsUntilExam: "16"
    },
    "2027": {
      monthlyPrice: "9.99",
      oneTimePrice: "179.99",
      originalPrice: "449.99",
      savingsPercent: "20%",
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

  const handleOneTimePayment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const stripeLink = examYear === "2027" 
      ? "https://buy.stripe.com/dRm3cu33W4Vsc6sdlu8N208"
      : "https://buy.stripe.com/7sY5kC33Wew2daw95e8N207";
    const join = stripeLink.includes("?") ? "&" : "?";
    const successUrl = `${window.location.origin}/payment-success`;
    window.location.href =
      stripeLink + join +
      "client_reference_id=" + encodeURIComponent(user.id) +
      "&prefilled_email=" + encodeURIComponent(user.email || "") +
      "&success_url=" + encodeURIComponent(successUrl);
    onOpenChange(false);
  };

  const handleSendParentEmail = async () => {
    if (!studentName || !parentEmail) {
      toast({
        title: "Missing information",
        description: "Please enter both your name and parent's email.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('paywall_parent_emails')
          .insert({
            user_id: user.id,
            parent_email: parentEmail,
            student_name: studentName
          });
      }
      
      toast({
        title: "Email sent!",
        description: "We've sent an email to your parent explaining Mentiora.",
      });
    } catch (error) {
      console.error('Error saving parent email:', error);
      toast({
        title: "Saved!",
        description: "We'll notify your parent about your exam prep plan.",
      });
    }
    
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
          <motion.div 
            className="flex flex-col items-center justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-full mb-4">
              <img src={mentioraLogo} alt="Mentiora" className="h-5 w-5" />
              <span className="text-sm font-semibold text-gray-900">Mentiora</span>
            </div>
            <h1 className="text-4xl font-bold text-center text-gray-900">
              All-in-one exam prep.{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                One simple price.
              </span>
            </h1>
          </motion.div>
        </DialogHeader>

        <div className="px-2">
          <motion.p 
            className="text-center text-gray-600 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            Study smarter with 2,500+ questions, AI tutoring, and predicted papers—all built for your exact exam board.
          </motion.p>

          {!showParentForm ? (
            <>
              {/* Ask My Parents Link */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => setShowParentForm(true)}
                  className="text-blue-600 font-medium flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity"
                >
                  Ask my parents <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Exam Year Toggle */}
              <motion.div 
                className="flex justify-center gap-2 mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => setExamYear("2026")}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                    examYear === "2026"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  2026 Exams
                </button>
                <button
                  onClick={() => setExamYear("2027")}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                    examYear === "2027"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  2027 Exams
                </button>
              </motion.div>

              {/* Pricing Cards */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={examYear}
                  className="grid md:grid-cols-2 gap-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Monthly */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 border-gray-200/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-white/80 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl -z-10" />
                      
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 text-gray-900">7-Day Free Trial</h3>
                          <p className="text-gray-600">Start free, then continue monthly.</p>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full text-xs font-bold">
                          Popular
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">£0</span>
                          <span className="text-gray-600">/week</span>
                        </div>
                        <p className="text-gray-500">Then £{currentPricing.monthlyPrice}/month after trial</p>
                      </div>

                      <Button
                        onClick={handleUpgrade}
                        className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all mb-3"
                      >
                        Start Free Trial
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Cancel anytime • No commitment • Full access
                      </p>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={handleOneTimePayment}
                          className="w-full text-sm text-center text-gray-600 hover:text-gray-900"
                        >
                          Or get <span className="font-semibold text-blue-600">{examYear} Exam Access for £{currentPricing.oneTimePrice}</span> <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">Save {currentPricing.savingsPercent}</span>
                        </button>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Removed second card */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Features List */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  {features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Parent Form */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowParentForm(false)}
                    className="text-gray-600 hover:text-gray-900 mb-4 text-sm"
                  >
                    ← Back to pricing
                  </button>
                  
                  <motion.h3 
                    className="text-xl font-bold mb-3 text-gray-900"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    Want help asking your parents?
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 mb-6 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Mentiora can send an email on your behalf to explain the subscription details.
                  </motion.p>

                  <div className="space-y-4 mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Your Name*
                      </label>
                      <Input
                        placeholder="Enter your name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="h-12 rounded-lg"
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
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
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Button 
                      onClick={handleSendParentEmail}
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30"
                    >
                      Send Email to My Parents
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
