import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const [examYear, setExamYear] = useState<"2026" | "2027">("2026");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const handleUpgrade = () => {
    openPaymentLink();
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
  };

  const features = [
    "Get an adaptive personalised weekly study plan tailored to your learning pace and exam goals.",
    "Practice with 2,500+ exam-style questions per subject with instant marking and feedback.",
    "Track your performance with real-time analytics showing strengths, weaknesses and predicted grades.",
    "Access 24/7 tutoring with step-by-step explanations for every concept and question.",
    "Prepare with 10+ timed mock papers per subject, designed for your specific exam board.",
    "Get exclusive access to Mentiora's 2026 Predicted Papers.",
    "Create and review custom flashcards powered by spaced repetition for better retention.",
    "Study efficiently with exam-focused notes for every topic in your curriculum.",
    "Monitor stress levels with adaptive learning recommendations to maintain optimal study performance.",
    "Access 40+ subjects from GCSEs, IGCSEs, and A Levels across multiple examination boards including AQA, Edexcel, and OCR.",
    "Start immediately - change or cancel your plan anytime."
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center justify-between px-8 py-5 max-w-[1200px] mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <img src="/src/assets/mentiora-logo.png" alt="Mentiora" className="h-7 w-7" />
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
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Start
          </h1>
          {/* Mentiora Logo Graphic */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00A8FF] to-[#0096E6] rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
              <img 
                src="/src/assets/mentiora-logo.png" 
                alt="Mentiora" 
                className="w-12 h-12"
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900">
            for free.
          </h1>
        </div>

        <p className="text-center text-gray-600 text-lg mb-6 max-w-[700px] mx-auto">
          Pay just once to get all-in-one access until the final day of your exams, or subscribe to on-the-go learning.
        </p>

        {/* Ask My Parents Link */}
        <div className="text-center mb-10">
          <button
            onClick={() => document.getElementById('parents-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#00A8FF] font-medium flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity"
          >
            Ask my parents <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Exam Year Toggle */}
        <div className="flex justify-center gap-2 mb-12">
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
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Monthly */}
          <Card className="border-2 border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Monthly</h3>
            <p className="text-gray-600 mb-6">Monthly billing, full access, cancel anytime.</p>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">£24.99</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              variant="outline"
              className="w-full h-14 rounded-full text-base font-semibold border-2 border-gray-900 hover:bg-gray-50"
            >
              Subscribe Monthly
            </Button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              £24.99 billed monthly. Cancel anytime.
            </p>
          </Card>

          {/* 2026 Exams */}
          <Card className="border-2 border-gray-200 rounded-3xl p-8 bg-[#00A8FF] text-white relative hover:shadow-xl transition-shadow">
            <div className="absolute top-6 right-6 bg-white text-[#00A8FF] px-4 py-1 rounded-full text-sm font-bold">
              Save 33%
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{examYear} Exams</h3>
            <p className="mb-6 text-white/90">
              One-time payment. Get unlimited access until {examYear === "2026" ? "31st July 2026" : "31st July 2027"}.
            </p>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold">£200.00</span>
                <span className="text-white/90">once</span>
              </div>
              <span className="text-white/70 line-through text-lg">300.00</span>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full h-14 rounded-full text-base font-semibold bg-white text-[#00A8FF] hover:bg-gray-50"
            >
              Get Exam Access
            </Button>

            <p className="text-sm text-white/80 mt-4 text-center">
              £200 billed once. Offer ends 15/10/25.
            </p>
          </Card>
        </div>

        {/* Features List */}
        <div className="mb-16 max-w-[700px] mx-auto">
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
        </div>

        {/* Want Help Asking Your Parents Section */}
        <div id="parents-section" className="mb-16 scroll-mt-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Want help asking your parents?
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
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
                className="w-full h-14 rounded-full bg-[#00A8FF] hover:bg-[#0096E6] text-white font-semibold text-base"
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
                          <div className="w-7 h-7 bg-gradient-to-br from-[#00A8FF] to-[#0096E6] rounded-full flex items-center justify-center text-white font-bold text-xs">
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
                            
                            <p>Your child has expressed interest in using Medly AI for GCSE prep...</p>
                            
                            <div className="space-y-1">
                              <div className="flex items-start gap-1.5">
                                <Check className="w-2.5 h-2.5 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                                <span className="text-[9px]">Unlimited exam-style questions</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <Check className="w-2.5 h-2.5 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                                <span className="text-[9px]">24/7 AI tutoring</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <Check className="w-2.5 h-2.5 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                                <span className="text-[9px]">Mock papers & tests</span>
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
          </div>
        </div>

        {/* Loved by Students Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Loved by 30,000+ GCSE students<br />from the UK's top schools
          </h2>

          {/* School Logos */}
          <div className="flex items-center justify-center gap-12 flex-wrap mb-12 opacity-40 grayscale">
            <div className="h-16 flex items-center">
              <div className="text-2xl font-light text-gray-400">FOREST<br /><span className="text-sm">SCHOOL</span></div>
            </div>
            <div className="h-16 flex items-center">
              <div className="text-xl font-serif text-gray-400">Queen Elizabeth's School</div>
            </div>
            <div className="h-16 flex items-center">
              <div className="text-xl font-bold text-gray-400">Chiswick School</div>
            </div>
            <div className="h-16 flex items-center">
              <div className="text-xl font-bold text-gray-400">SARACENS<br /><span className="text-sm">HIGH SCHOOL</span></div>
            </div>
          </div>

          {/* Teacher Section */}
          <div className="flex items-center justify-center gap-8 max-w-[700px] mx-auto bg-gray-50 rounded-2xl p-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Ask your teacher for your school's 20% discount code.
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                School teachers in every country are eligible to receive a free, personalised discount code offering students 20% off any Mently subscription.
              </p>
              
              <p className="text-gray-600">
                No school code yet? Ask them to email{" "}
                <a href="mailto:contact@medlyai.com" className="text-[#00A8FF] font-medium hover:underline">
                  contact@medlyai.com
                </a>{" "}
                for one.
              </p>
            </div>
            
            {/* Teacher Emoji */}
            <div className="flex-shrink-0">
              <div className="text-8xl">👩‍🏫</div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-16 max-w-[800px] mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 text-gray-900">
            FAQs
          </h2>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="border-b border-gray-200">
              <button className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity">
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Is Mentiora specific to the GCSE and A-Level specification?
                </span>
                <svg className="w-6 h-6 text-gray-900 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-gray-200">
              <button className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity">
                <span className="text-lg font-medium text-gray-900 pr-8">
                  How are answers marked on Mentiora?
                </span>
                <svg className="w-6 h-6 text-gray-900 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-gray-200">
              <button className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity">
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Can I cancel my subscription at any time?
                </span>
                <svg className="w-6 h-6 text-gray-900 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* FAQ Item 4 */}
            <div className="border-b border-gray-200">
              <button className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity">
                <span className="text-lg font-medium text-gray-900 pr-8">
                  Which exam boards does Mentiora support?
                </span>
                <svg className="w-6 h-6 text-gray-900 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
