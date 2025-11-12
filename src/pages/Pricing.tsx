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

      <div className="max-w-[900px] mx-auto px-6 py-12">
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
          className="grid md:grid-cols-3 gap-6 mb-16"
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
            <div className="absolute top-6 right-6 bg-white text-[#3B82F6] px-4 py-1 rounded-full text-sm font-bold">
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

          {/* Enterprise */}
          <Card className="border-2 border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-6">For schools and institutions.</p>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">Custom</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Tailored pricing for your school</p>
            </div>

            <Button
              onClick={() => window.location.href = 'mailto:yash@mentiora.com?subject=Enterprise Inquiry'}
              variant="outline"
              className="w-full h-14 rounded-full text-base font-semibold border-2 border-gray-900 hover:text-[#3B82F6] hover:bg-white transition-colors"
            >
              Contact Sales
            </Button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Bulk licenses available.
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
            className="grid md:grid-cols-2 gap-12 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Left Column - Form */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Most students have their subscription covered by their parents.
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                We understand that conversations about subscriptions can be awkward.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
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
                className="w-full h-14 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-base"
              >
                Send Email
              </Button>
            </div>

            {/* Right Column - Email on Laptop */}
            <div className="relative flex items-center justify-center pt-8">
              <div className="relative w-full max-w-xl">
                {/* Laptop Screen */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg p-2 shadow-2xl">
                  {/* Screen bezel */}
                  <div className="bg-black rounded-lg p-1 shadow-inner">
                    {/* Browser Chrome */}
                    <div className="bg-white rounded-md overflow-hidden">
                      {/* Browser toolbar */}
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 border-b border-gray-200">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 bg-white rounded px-2 py-0.5 text-[9px] text-gray-600">
                          mently.app/get-parent
                        </div>
                      </div>
                      
                      {/* Email Content */}
                      <div className="p-4 bg-white h-[240px] overflow-hidden">
                        {/* Email Header */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center text-white font-bold text-xs">
                            M
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-xs">Mentiora</div>
                            <div className="text-[9px] text-gray-500">hello@mentiora.com</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="text-[8px] text-gray-500 mb-0.5">To: Parent/Guardian</div>
                            <h3 className="text-xs font-bold text-gray-900">
                              Help Your Child Get Through GCSEs
                            </h3>
                          </div>
                          
                          <div className="space-y-1.5 text-[10px] text-gray-700 leading-relaxed">
                            <p className="text-gray-600">Dear parent or guardian,</p>
                            
                            <p>Your child has expressed interest in using Mentiora for GCSE prep...</p>
                            
                            <div className="space-y-1">
                              <div className="flex items-start gap-1.5">
                                <Check className="w-2.5 h-2.5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                                <span className="text-[9px]">2,500+ exam-style questions with instant marking</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <Check className="w-2.5 h-2.5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                                <span className="text-[9px]">24/7 tutoring with step-by-step explanations</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <Check className="w-2.5 h-2.5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                                <span className="text-[9px]">Predicted Papers & performance analytics</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop Base */}
                <div className="relative">
                  {/* Keyboard section */}
                  <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 px-4 py-3 rounded-b-md shadow-2xl">
                    {/* Keyboard keys */}
                    <div className="space-y-0.5 opacity-30">
                      <div className="flex gap-0.5 justify-center">
                        {[...Array(13)].map((_, i) => (
                          <div key={i} className="w-6 h-4 bg-gray-600 rounded-sm shadow-sm"></div>
                        ))}
                      </div>
                      <div className="flex gap-0.5 justify-center px-2">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-6 h-4 bg-gray-600 rounded-sm shadow-sm"></div>
                        ))}
                      </div>
                      <div className="flex gap-0.5 justify-center">
                        <div className="w-8 h-4 bg-gray-600 rounded-sm shadow-sm"></div>
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="w-6 h-4 bg-gray-600 rounded-sm shadow-sm"></div>
                        ))}
                        <div className="w-8 h-4 bg-gray-600 rounded-sm shadow-sm"></div>
                      </div>
                      <div className="flex gap-0.5 justify-center px-12">
                        <div className="flex-1 h-4 bg-gray-600 rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                    {/* Trackpad */}
                    <div className="mt-1.5 mx-auto w-24 h-12 bg-gray-700 rounded border border-gray-600 opacity-20 shadow-inner"></div>
                  </div>
                  {/* Bottom edge */}
                  <div className="mx-auto w-2/3 h-1.5 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg shadow-2xl opacity-80"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Russell Group Section */}
        <div className="mb-32">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Helping GCSE & A-Level students<br />get into Russell Group universities
          </motion.h2>

          {/* University Logos Strip */}
          <motion.div 
            className="py-8 px-6 overflow-hidden bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <motion.div
                className="flex items-center gap-12"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of logos */}
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={bristolLogo} 
                    alt="University of Bristol" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={newcastleLogo} 
                    alt="Newcastle University" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={birminghamLogo} 
                    alt="University of Birmingham" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={oxfordLogo} 
                    alt="University of Oxford" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={bathLogo} 
                    alt="University of Bath" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                {/* Second set - duplicate for seamless loop */}
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={bristolLogo} 
                    alt="University of Bristol" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={newcastleLogo} 
                    alt="Newcastle University" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={birminghamLogo} 
                    alt="University of Birmingham" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={oxfordLogo} 
                    alt="University of Oxford" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
                <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                  <img 
                    src={bathLogo} 
                    alt="University of Bath" 
                    className="w-auto object-contain"
                    style={{ height: '40px', maxWidth: '160px' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Teacher Section */}
          <motion.div 
            className="flex items-center justify-center gap-8 max-w-[700px] mx-auto bg-gray-50 rounded-2xl p-8 mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Ask your teacher for your school's 20% discount code.
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                School teachers in every country are eligible to receive a free, personalised discount code offering students 20% off any Mently subscription.
              </p>
              
              <p className="text-gray-600">
                No school code yet? Ask them to email{" "}
                <a href="mailto:yash@mentiora.com" className="text-[#3B82F6] font-medium hover:underline">
                  yash@mentiora.com
                </a>{" "}
                for one.
              </p>
            </div>
            
            {/* Teacher Emoji */}
            <div className="flex-shrink-0">
              <div className="text-8xl">👩‍🏫</div>
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
            {/* FAQ Item 1 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Is Mentiora specific to the GCSE and A-Level specification?
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
                      Yes! Mentiora is designed specifically for UK GCSE and A-Level students. Our content covers all major exam boards including AQA, Edexcel, OCR, and more. Every question, flashcard, and note is aligned with the official specification for your chosen exam board, ensuring you're learning exactly what you need for your exams.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  How are answers marked on Mentiora?
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
                      Mentiora uses advanced AI technology to mark your answers instantly, just like a real examiner would. Our marking system follows the official mark schemes from exam boards, awarding marks for key points, accuracy, and exam technique. You'll receive detailed feedback on every answer, showing where you gained or lost marks, plus step-by-step explanations to help you improve.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Can I cancel my subscription at any time?
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
                      Absolutely! You can cancel your monthly subscription at any time with no penalties or fees. Simply go to your account settings and click "Manage Subscription." Your access will continue until the end of your current billing period. If you choose the one-time exam access payment, you'll have access until the end of your exam period with no recurring charges.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 4 */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setExpandedFAQ(expandedFAQ === 3 ? null : 3)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Which exam boards does Mentiora support?
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
