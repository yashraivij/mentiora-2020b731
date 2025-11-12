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
    "A personalised weekly study plan that adjusts to your learning pace, subjects, and target grades.",
    "Practice that mirrors the real exam, with thousands of carefully written, exam-style questions per subject.",
    "Instant feedback and worked solutions that help you understand why an answer is correct, not just what it is.",
    "Progress analytics built for results — track your predicted grades, weak topics, and improvement over time.",
    "24/7 expert support and explanations, available whenever you get stuck or need clarity.",
    "Exclusive 2026 Predicted Papers, written by experienced exam specialists to reflect your exact specification.",
    "Custom flashcards with spaced repetition, ensuring the right topics resurface just before you forget them.",
    "Condensed revision notes for every topic, written around what examiners actually reward.",
    "Adaptive study insights that balance challenge and progress to help maintain focus and reduce burnout.",
    "Full access to 40+ GCSE, IGCSE, and A Level subjects across AQA, Edexcel, and OCR exam boards.",
    "Start instantly. Cancel or change your plan anytime — no hidden fees, no commitment."
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Headline */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-gray-900">
            Start
          </h1>
          {/* Mentiora Logo Graphic */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
              <img 
                src={mentioraLogo} 
                alt="Mentiora" 
                className="w-12 h-12"
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900">
            for free.
          </h1>
        </motion.div>

        <motion.p 
          className="text-center text-gray-600 text-lg mb-6 max-w-[700px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Get complete revision support for less than the cost of one tutoring session.
        </motion.p>

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
            className="text-[#3B82F6] font-medium flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity"
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

        {/* Pricing Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Monthly */}
          <Card className="border-2 border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2">7-Day Free Trial</h3>
            <p className="text-gray-600 mb-6">Start free, then £9.99/month.</p>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">£0</span>
                <span className="text-gray-600">/week</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Then £9.99/month</p>
            </div>

            <Button
              onClick={handleUpgrade}
              variant="outline"
              className="w-full h-14 rounded-full text-base font-semibold border-2 border-gray-900 hover:text-[#3B82F6] hover:bg-white transition-colors"
            >
              Start Free Trial
            </Button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Cancel anytime.
            </p>
          </Card>

          {/* 2026 Exams */}
          <Card className="border-2 border-gray-200 rounded-3xl p-8 bg-[#3B82F6] text-white relative hover:shadow-xl transition-shadow">
            <div className="absolute top-4 right-4 bg-white text-[#3B82F6] px-4 py-1 rounded-full text-sm font-bold z-10">
              Save {examYear === "2026" ? "15%" : "20%"}
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{examYear} Exams</h3>
            <p className="mb-6 text-white/90">
              One-time payment. Get unlimited access until {examYear === "2026" ? "31st July 2026" : "31st July 2027"}.
            </p>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold">£{examYear === "2026" ? "79.99" : "179.99"}</span>
                <span className="text-white/90">once</span>
              </div>
              <span className="text-white/70 line-through text-lg">{examYear === "2026" ? "199.99" : "449.99"}</span>
            </div>

            <Button
              onClick={handleOneTimePayment}
              className="w-full h-14 rounded-full text-base font-semibold bg-white text-[#3B82F6] hover:bg-gray-50"
            >
              Get Exam Access
            </Button>

            <p className="text-sm text-white/80 mt-4 text-center">
              £{examYear === "2026" ? "79.99" : "179.99"} billed once.
            </p>
          </Card>

          {/* Enterprise for Schools */}
          <Card className="border-2 border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-6">For schools and institutions.</p>
            
            <div className="mb-8">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Schools get 25% off with a free discount code.
              </p>
              <p className="text-sm text-gray-500">
                Custom pricing and volume discounts available for larger institutions.
              </p>
            </div>

            <Button
              onClick={() => window.location.href = 'mailto:yash@mentiora.com?subject=Enterprise Inquiry for Schools'}
              variant="outline"
              className="w-full h-14 rounded-full text-base font-semibold border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Contact Sales
            </Button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Get your school discount code today.
            </p>
          </Card>
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
          <div className="divide-y divide-gray-200">
            {features.map((feature, i) => {
              const firstSentencePart = feature.split(/[,.]/, 1)[0];
              const restOfFeature = feature.substring(firstSentencePart.length);
              
              return (
                <div key={i} className="py-6 first:pt-0 last:pb-0 flex items-start gap-4">
                  <Check className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-gray-700 text-base leading-relaxed">
                    <span className="font-semibold text-gray-900">{firstSentencePart}</span>
                    {restOfFeature}
                  </p>
                </div>
              );
            })}
          </div>

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
            Let's tell your parents together.
          </motion.h2>

          <motion.div 
            className="flex flex-col md:flex-row items-start justify-center gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Form Card */}
            <div className="w-full md:w-[480px] bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Not sure how to ask?
              </h3>
              
              <p className="text-gray-600 mb-3 leading-relaxed">
                We get it – asking for help with subscription costs can feel awkward.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Let us do the talking. We'll send a professional email to your parent or guardian explaining what Mentiora is and how it helps with exam prep.
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
                className="w-full h-14 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-base"
              >
                Send Email
              </Button>
            </div>

            {/* iPhone Mockup */}
            <div className="relative flex-shrink-0">
              {/* iPhone Frame */}
              <div className="relative w-[280px] bg-black rounded-[3rem] p-3 shadow-2xl">
                {/* Screen */}
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
                  
                  {/* Status Bar */}
                  <div className="relative bg-white pt-8 px-6 pb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-black rounded-full"></div>
                        <div className="w-1 h-3 bg-black rounded-full"></div>
                        <div className="w-1 h-3 bg-black rounded-full"></div>
                        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Email App Content */}
                  <div className="bg-white h-[500px] overflow-hidden">
                    {/* Email Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          M
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">Mentiora</div>
                          <div className="text-xs text-gray-500 truncate">yash@mentiora.com</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">To: Parent/Guardian</div>
                      <h3 className="text-base font-bold text-gray-900">
                        Supporting {studentName || "Your Child"}'s Revision
                      </h3>
                    </div>
                    
                      {/* Email Body */}
                      <div className="px-6 py-4 space-y-3 text-xs text-gray-700 leading-relaxed">
                      <p className="text-gray-600">Hi there,</p>
                      
                      <p>My name is Yash, and I'm the founder of Mentiora. {studentName || "Your child"} has asked me to reach out about our revision platform. Mentiora is used by thousands of students preparing for their exams. Here's what they get access to:</p>
                      
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-1" />
                      <span className="text-xs leading-relaxed">Practice that mirrors the real exam, with thousands of carefully written, exam-style questions per subject.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-1" />
                      <span className="text-xs leading-relaxed">Instant feedback and worked solutions that help you understand why an answer is correct, not just what it is.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-1" />
                      <span className="text-xs leading-relaxed">Progress analytics built for results — track your predicted grades, weak topics, and improvement over time.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-1" />
                      <span className="text-xs leading-relaxed">24/7 expert support and explanations, available whenever you get stuck or need clarity.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-1" />
                      <span className="text-xs leading-relaxed">Exclusive 2026 Predicted Papers, written by experienced exam specialists to reflect your exact specification.</span>
                    </div>
                  </div>
                      
                      <p>It costs <span className="font-bold">£9.99/month</span> – about what you'd spend on one coffee per week, and far less than a single tutoring session. If you have any questions, feel free to reply to this email.</p>
                      
                      <p className="pt-2">
                        <span className="block">Best regards,</span>
                        <span className="block font-semibold">Yash</span>
                        <span className="block text-[10px] text-gray-500">Founder, Mentiora</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* FAQs Section */}
        <div className="mb-24 max-w-[800px] mx-auto">
          <motion.h2 
            className="text-5xl font-bold text-center mb-12 text-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            FAQs
          </motion.h2>

          <motion.div 
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* FAQ 1 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  What makes Mentiora different from other study apps?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 0 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Mentiora is fully aligned with your exact exam board and specification, so every question, note, and paper matches what you'll be tested on — nothing extra, nothing missing.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Can Mentiora really replace a private tutor?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 1 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      It's designed to. Mentiora gives step-by-step feedback, weekly study plans, and real predicted grades — all personalised to your progress. Many students use it alongside school or tutoring, but it's built to stand alone.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  How accurate are the predicted grades?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 2 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Your predicted grades update as you answer more questions. They're based on exam-board mark schemes and your past performance, so you can see how close you are to your target at any time.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 4 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 3 ? null : 3)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  How often is the content updated?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 3 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      We keep Mentiora fully up-to-date with the latest exam specifications and question trends. New questions and topics are added regularly, especially before each exam season.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 5 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 4 ? null : 4)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Can parents track progress too?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 4 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 4 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Yes — you can share progress summaries with parents. They'll see improvement over time, current predicted grades, and areas for focus.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 6 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 5 ? null : 5)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  What if my child's subject isn't listed?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 5 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 5 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      You can request any subject. Our team adds new subjects based on student demand, so if it's not available yet, it likely will be soon.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 7 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 6 ? null : 6)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  How is my data kept safe?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 6 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 6 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      We take privacy seriously. Your data is never shared or sold, and all progress and personal information are securely stored.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 8 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 7 ? null : 7)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Can I cancel anytime?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 7 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 7 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Absolutely. There's no contract — you can cancel or change your plan whenever you like, directly from your account settings.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 9 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 8 ? null : 8)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Does Mentiora work on phones and tablets?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 8 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 8 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Yes! Mentiora is fully responsive, so you can revise from your laptop, tablet, or phone whenever it suits you.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 10 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 9 ? null : 9)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Do you offer discounts for families or schools?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 9 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 9 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Yes — we offer flexible pricing for siblings, small groups, and schools. Just get in touch to find out more.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 11 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 10 ? null : 10)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  What if I need help while using Mentiora?
                </span>
                <motion.div
                  animate={{ rotate: expandedFAQ === 10 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-900 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === 10 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-2 text-gray-600 leading-relaxed">
                      Our support team is here 24/7. Whether it's a technical issue or a study question, you can reach out anytime from within the app.
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
