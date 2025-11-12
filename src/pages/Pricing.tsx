import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { supabase } from "@/integrations/supabase/client";
import bristolLogo from "@/assets/bristol-logo.png";
import newcastleLogo from "@/assets/newcastle-logo.svg";
import birminghamLogo from "@/assets/birmingham-logo.png";
import oxfordLogo from "@/assets/oxford-logo.png";
import bathLogo from "@/assets/bath-logo.png";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const [examYear, setExamYear] = useState<"2026" | "2027">("2026");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleUpgrade = () => {
    openPaymentLink();
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
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your parent's email.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from('paywall_parent_emails')
      .insert({
        user_id: session.user.id,
        parent_email: parentEmail,
        student_name: studentName
      });

    if (error) {
      console.error('Error saving parent email:', error);
      toast({
        title: "Error",
        description: `Failed to save: ${error.message}`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Saved!",
      description: "We've saved your parent's email and will notify them about Mentiora.",
    });
    
    setStudentName("");
    setParentEmail("");
  };

  const features = [
    "Get an adaptive personalised weekly study plan tailored to your learning pace and exam goals.",
    "Practice with 2,500+ exam-style questions per subject with instant marking and feedback.",
    "Track your performance with real-time analytics showing strengths, weaknesses and predicted grades.",
    "Access 24/7 tutoring with step-by-step explanations for every concept and question.",
    "Get exclusive access to Mentiora's 2026 Predicted Papers.",
    "Create and review custom flashcards powered by spaced repetition for better retention.",
    "Study efficiently with exam-focused notes for every topic in your curriculum.",
    "Monitor stress levels with adaptive learning recommendations to maintain optimal study performance.",
    "Access 40+ subjects from GCSEs, IGCSEs, and A Levels across multiple examination boards including AQA, Edexcel, and OCR.",
    "Start immediately - change or cancel your plan anytime."
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center justify-between px-8 py-5 max-w-[1200px] mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <img src={mentioraLogo} alt="Mentiora" className="h-7 w-7" />
            <span className="text-base font-semibold">Mentiora</span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-sm hover:bg-gray-100"
          >
            ← Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-16">
        {/* Main Headline */}
        <motion.div 
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            One plan. All features. Simple pricing.
          </h1>
          <p className="text-xl text-gray-600 max-w-[650px] mx-auto">
            Everything you need to ace your exams, from practice questions to AI tutoring.
          </p>
        </motion.div>

        {/* Ask My Parents Link */}
        <motion.div 
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => document.getElementById('parents-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#00A8FF] font-medium flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity"
          >
            Ask my parents <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Exam Year Toggle */}
        <motion.div 
          className="flex justify-center gap-2 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => setExamYear("2026")}
            className={`px-8 py-3 rounded-full text-base font-medium transition-all ${
              examYear === "2026"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            2026 Exams
          </button>
          <button
            onClick={() => setExamYear("2027")}
            className={`px-8 py-3 rounded-full text-base font-medium transition-all ${
              examYear === "2027"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            2027 Exams
          </button>
        </motion.div>

        {/* Pricing Cards - Vertically Stacked */}
        <motion.div 
          className="space-y-4 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Monthly */}
          <Card className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">7-Day Free Trial</h3>
                <p className="text-gray-600 text-sm">Start free, then £9.99/month.</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">£0</span>
                  <span className="text-gray-600">/week</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Then £9.99/month</p>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              variant="outline"
              className="w-full h-12 rounded-lg text-base font-semibold border-2 border-gray-900 hover:bg-gray-50"
            >
              Start Free Trial
            </Button>

            <p className="text-sm text-gray-500 mt-3 text-center">
              Cancel anytime.
            </p>
          </Card>

          {/* Exam Access */}
          <Card className="border-l-4 border-l-[#00A8FF] border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow relative">
            <div className="absolute top-6 right-6 bg-[#00A8FF] text-white px-3 py-1 rounded-md text-xs font-semibold">
              Save {examYear === "2026" ? "60%" : "60%"}
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">{examYear} Exam Access</h3>
                <p className="text-gray-600 text-sm">
                  One-time payment. Access until {examYear === "2026" ? "31st July 2026" : "31st July 2027"}.
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">£{examYear === "2026" ? "79.99" : "179.99"}</span>
                  <span className="text-gray-600">once</span>
                </div>
                <span className="text-gray-400 line-through text-sm">£{examYear === "2026" ? "199.99" : "449.99"}</span>
              </div>
            </div>

            <Button
              onClick={handleOneTimePayment}
              className="w-full h-12 rounded-lg text-base font-semibold bg-[#00A8FF] hover:bg-[#0096E6] text-white"
            >
              Get Exam Access
            </Button>

            <p className="text-sm text-gray-500 mt-3 text-center">
              £{examYear === "2026" ? "79.99" : "179.99"} billed once.
            </p>
          </Card>
        </motion.div>

        {/* Comparison Line */}
        <motion.div 
          className="text-center text-sm text-gray-600 mb-16 pb-16 border-b border-gray-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Both plans include all features—full access, no limitations.
        </motion.div>

        {/* Features List */}
        <motion.div 
          className="mb-24 max-w-[700px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-base leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-12 text-gray-600">
            <a href="mailto:contact@mentiora.com" className="underline hover:text-gray-900">
              Interested for a school or classroom? Contact us here.
            </a>
          </p>
        </motion.div>

        {/* Want Help Asking Your Parents Section */}
        <div id="parents-section" className="mb-32 scroll-mt-8">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Want help asking your parents?
          </motion.h2>

          <motion.div 
            className="max-w-[550px] mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Most students have their subscription covered by their parents.
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                We understand that conversations about subscriptions can be awkward. Mentiora can send an email on your behalf to explain the subscription details.
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
                    className="h-11 rounded-lg"
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
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSendParentEmail}
                className="w-full h-12 rounded-lg bg-[#00A8FF] hover:bg-[#0096E6] text-white font-semibold text-base"
              >
                Send Email
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Universities Section - Static Grid */}
        <motion.div 
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-gray-600 mb-8 text-base">
            Join 10,000+ students studying for Russell Group universities
          </p>
          
          {/* Static Logo Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center max-w-[700px] mx-auto">
            <img src={oxfordLogo} alt="Oxford" className="h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src={bristolLogo} alt="Bristol" className="h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src={newcastleLogo} alt="Newcastle" className="h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src={birminghamLogo} alt="Birmingham" className="h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src={bathLogo} alt="Bath" className="h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
            <img src={oxfordLogo} alt="Oxford" className="h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
          </div>
        </motion.div>

        {/* Teacher Discount Section */}
        <motion.div 
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm text-center max-w-[600px] mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00A8FF]/10 rounded-lg mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Teacher Discount Available</h3>
            <p className="text-gray-600 mb-4 text-sm">
              School teachers in every country are eligible to receive a free, personalized discount code offering students 20% off any Mentiora subscription.
            </p>
            <a 
              href="mailto:yash@mentiora.com"
              className="text-[#00A8FF] font-medium hover:opacity-80 transition-opacity text-sm"
            >
              Contact us for details →
            </a>
          </Card>
        </motion.div>

        {/* FAQs Section */}
        <div className="mb-24 max-w-[700px] mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.div 
            className="space-y-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  Is Mentiora specific to the GCSE and A-Level specification?
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${
                    expandedFAQ === 0 ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFAQ === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                      Yes! Mentiora is designed specifically for UK GCSE and A-Level students. Our content covers all major exam boards including AQA, Edexcel, OCR, and more. Every question, flashcard, and note is aligned with the official specification for your chosen exam board, ensuring you're learning exactly what you need for your exams.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  How are answers marked on Mentiora?
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${
                    expandedFAQ === 1 ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFAQ === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                      Mentiora uses advanced AI technology to mark your answers instantly, just like a real examiner would. Our marking system follows the official mark schemes from exam boards, awarding marks for key points, accuracy, and exam technique. You'll receive detailed feedback on every answer, showing where you gained or lost marks, plus step-by-step explanations to help you improve.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  Can I cancel my subscription at any time?
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${
                    expandedFAQ === 2 ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFAQ === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                      Absolutely! You can cancel your monthly subscription at any time with no penalties or fees. Simply go to your account settings and click "Manage Subscription." Your access will continue until the end of your current billing period. If you choose the one-time exam access payment, you'll have access until the end of your exam period with no recurring charges.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 3 ? null : 3)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  Which exam boards does Mentiora support?
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${
                    expandedFAQ === 3 ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFAQ === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                      Mentiora supports all major UK exam boards including AQA, Edexcel (Pearson), OCR, WJEC, CCEA, and Cambridge IGCSE. We cover 40+ subjects across GCSEs, IGCSEs, and A-Levels. When you sign up, you can select your specific exam board for each subject to ensure all content is tailored to your exact specification.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
