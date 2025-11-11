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

      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Logo Badge */}
        <motion.div 
          className="flex justify-center mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-full">
            <img src={mentioraLogo} alt="Mentiora" className="h-5 w-5" />
            <span className="text-sm font-semibold text-gray-900">Mentiora</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-center text-gray-900 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          All-in-one exam prep.{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            One simple price.
          </span>
        </motion.h1>

        <motion.p 
          className="text-center text-gray-600 text-lg mb-6 max-w-[700px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Study smarter with 2,500+ questions, AI tutoring, and predicted papers—all built for your exact exam board.
        </motion.p>

        {/* Ask My Parents Link */}
        <motion.div 
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => document.getElementById('parents-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-blue-600 font-medium flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity"
          >
            Ask my parents <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Exam Year Toggle */}
        <motion.div 
          className="flex justify-center gap-3 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={() => setExamYear("2026")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              examYear === "2026"
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            2026 Exams
          </button>
          <button
            onClick={() => setExamYear("2027")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              examYear === "2027"
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            2027 Exams
          </button>
        </motion.div>

        {/* Pricing Tabs */}
        <motion.div 
          className="flex justify-center gap-1 mb-8 bg-gray-100 rounded-2xl p-1 max-w-md mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button
            className="flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-white text-gray-900 shadow-sm"
          >
            Monthly
          </button>
          <button
            className="flex-1 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Exam Access
          </button>
        </motion.div>

        {/* Single Pricing Card */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-2 border-gray-200/50 rounded-2xl p-10 max-w-2xl mx-auto shadow-xl backdrop-blur-sm bg-white/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">7-Day Free Trial</h3>
                <p className="text-gray-600 text-lg">Start free, then continue monthly.</p>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full text-sm font-bold backdrop-blur-sm">
                Popular
              </div>
            </div>
            
            <div className="mb-10">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">£0</span>
                <span className="text-gray-600 text-xl">/week</span>
              </div>
              <p className="text-gray-500 text-lg">Then £9.99/month after trial</p>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full h-16 rounded-2xl text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all"
            >
              Start Free Trial
            </Button>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Cancel anytime • No commitment • Full access
            </p>
          </Card>
        </motion.div>

        {/* Comparison Line */}
        <motion.div 
          className="text-center mb-16 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-full">
            <span className="text-sm text-gray-600">Or get</span>
            <button
              onClick={handleOneTimePayment}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {examYear} Exam Access for £{examYear === "2026" ? "79.99" : "179.99"}
            </button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">
              Save {examYear === "2026" ? "15%" : "20%"}
            </span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-24 max-w-[1000px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Everything you need to ace your exams
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "📚", title: "2,500+ Practice Questions", text: "Exam-style questions with instant marking and detailed feedback for every subject." },
              { icon: "🤖", title: "24/7 AI Tutor", text: "Get step-by-step explanations for every concept and question, anytime you need help." },
              { icon: "📊", title: "Real-Time Analytics", text: "Track your performance with detailed insights showing strengths, weaknesses, and predicted grades." },
              { icon: "🎯", title: "Adaptive Study Plans", text: "Personalized weekly plans tailored to your learning pace and exam goals." },
              { icon: "🔮", title: "Predicted Papers", text: "Exclusive access to Mentiora's 2026 Predicted Papers to prepare for your exams." },
              { icon: "💡", title: "Smart Flashcards", text: "Create and review custom flashcards powered by spaced repetition for better retention." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex gap-4 p-6 bg-white border-2 border-gray-200/50 rounded-2xl hover:border-blue-300/50 hover:shadow-lg transition-all"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-12 text-gray-600">
            <a href="mailto:contact@mentiora.com" className="text-blue-600 hover:text-blue-700 font-medium">
              Interested for a school or classroom? Contact us here →
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
            className="max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 border-gray-200/50 rounded-2xl p-10 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">
                Most students have their subscription covered by their parents.
              </h3>
              
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
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
                    className="h-12 rounded-xl"
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
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSendParentEmail}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold text-base shadow-lg shadow-blue-500/30"
              >
                Send Email to My Parents
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Universities Trusted By Section */}
        <motion.div 
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">
            Trusted by students getting into top universities
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Join 10,000+ students studying for Russell Group universities
          </p>
          
          {/* Static Grid of Logos */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center max-w-4xl mx-auto">
            <img src={oxfordLogo} alt="Oxford" className="h-14 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-110" />
            <img src={bristolLogo} alt="Bristol" className="h-14 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-110" />
            <img src={birminghamLogo} alt="Birmingham" className="h-14 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-110" />
            <img src={newcastleLogo} alt="Newcastle" className="h-14 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-110" />
            <img src={bathLogo} alt="Bath" className="h-14 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-110" />
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
          <Card className="border-2 border-blue-200/50 rounded-2xl p-12 text-center bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mb-6">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Teacher discount codes
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              If you're a teacher at a school or tutoring centre and want discount codes for your students, email us.
            </p>
            <a 
              href="mailto:teachers@mentiora.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/30"
            >
              Get Discount Codes <ChevronRight className="w-5 h-5" />
            </a>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { icon: "📚", q: "What specifications do you support?", a: "We support AQA, Edexcel, and OCR exam boards for GCSEs, IGCSEs, and A-levels across 40+ subjects. Our content is specifically tailored to each specification to ensure you're studying exactly what you need for your exams." },
              { icon: "✅", q: "How does the marking work?", a: "Our AI marking system evaluates your answers using the actual mark schemes from exam boards. You'll get instant feedback showing exactly where you gained or lost marks, along with detailed explanations of model answers so you can learn and improve." },
              { icon: "❌", q: "Can I cancel my subscription?", a: "Yes, you can cancel your monthly subscription at any time with no cancellation fees. Your access will continue until the end of your current billing period. For one-time exam access purchases, you'll keep access until the specified end date." },
              { icon: "🎯", q: "Do you support my exam board?", a: "We currently support AQA, Edexcel, and OCR for most subjects. If you don't see your specific exam board or subject, please reach out to us at contact@mentiora.com and we'll let you know when it will be available." }
            ].map((faq, i) => (
              <motion.div
                key={i}
                className={`border-2 border-gray-200/50 rounded-2xl overflow-hidden hover:border-blue-300/50 transition-all ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{faq.icon}</span>
                    <span className="font-semibold text-gray-900 text-lg pr-4">{faq.q}</span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                      expandedFAQ === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFAQ === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 pl-[68px] text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Pricing;
