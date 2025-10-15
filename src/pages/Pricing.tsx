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
    "Boost your grades in just 5 minutes with Mentiora, your personal AI exam tutor.",
    "Practice with 2,500+ exam-style questions per subject with instant AI marking.",
    "Create custom practice sessions focused on your specific weak areas.",
    "Understand tough concepts with 24/7 step-by-step tutoring and exam strategy guidance.",
    "Prepare with 10+ timed mock papers per subject, designed for your specific exam board.",
    "Get exclusive access to Mentiora's 2026 Predicted Papers (releasing this April).",
    "Study efficiently with concise, exam-focused notes for every point in your curriculum.",
    "Access 40+ subjects from GCSEs, IGCSEs, A Levels and IB across multiple examination boards including AQA, Edexcel, CIE and OCR.",
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
        {/* Rating Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-base font-medium">Excellent</span>
          <span className="text-3xl font-bold">4.8</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
            ))}
          </div>
          <span className="text-base">1K+ reviews on 🍎</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-900">
          Get unlimited access to Mentiora
        </h1>

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

            {/* Right Column - Email Coming Out of Envelope */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Email Letter - slides out from top */}
                <div className="relative z-20 bg-white rounded-t-xl shadow-2xl border border-gray-200 p-6 mb-[-30px]">
                  <div className="mb-3">
                    <div className="text-sm font-bold text-gray-900 mb-1">
                      Help Your Child Get Through GCSEs
                    </div>
                    <div className="text-[10px] text-gray-500 mb-3">
                      Dear parent or guardian,
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-[10px] text-gray-700 leading-relaxed">
                    <p>Your child has expressed interest in using Medly AI to prepare for their GCSE studies. Medly AI provides 1:1 personalised learning through individualisation.</p>
                    
                    <div className="space-y-1 pl-1">
                      <div className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                        <span>Unlimited access to over 10 exam-style questions for every nook and cranny of their exam towards ...</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                        <span>Instead of copying and listening to dry voiceovers, learn with AI by asking questions, practising exam-board</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                        <span>24/7 step by step tutoring that builds your child&apos;s subject understanding and exam confidence</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                        <span>20+ timed mock predicted papers per subject</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#00A8FF] flex-shrink-0 mt-0.5" />
                        <span>Comprehensive and concise notes from each topic on their curriculum</span>
                      </div>
                    </div>
                    
                    <p className="pt-1">Exam-focused preparation aligned with upcoming exams</p>
                    
                    <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                      <span className="text-[10px] text-gray-400">mently.app/get-parent</span>
                    </div>
                  </div>
                </div>

                {/* Envelope */}
                <div className="relative z-10 bg-gradient-to-b from-gray-100 via-gray-50 to-white rounded-b-xl shadow-xl overflow-hidden">
                  {/* Envelope flap - open V shape */}
                  <div className="relative h-24">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                      {/* Left flap */}
                      <path d="M 0,0 L 200,80 L 200,0 Z" fill="#e8e8e8" stroke="#d4d4d4" strokeWidth="1"/>
                      {/* Right flap */}
                      <path d="M 400,0 L 200,80 L 200,0 Z" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                    </svg>
                  </div>
                  
                  {/* Envelope body */}
                  <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-8 py-12 rounded-b-xl">
                    <div className="opacity-0">Placeholder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loved by Students Section */}
        <div className="mb-16 py-12">
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
          <div className="text-center max-w-[600px] mx-auto">
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
            
            {/* Teacher Emoji */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-24 flex items-center justify-center">
                <div className="text-6xl">👩‍🏫</div>
              </div>
            </div>
          </div>
        </div>

        {/* Awards and Support Section */}
        <div className="mb-16 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Award-winning and supported<br />by leading institutions
          </h2>

          {/* Institution Logos */}
          <div className="flex items-center justify-center gap-16 flex-wrap opacity-70">
            <div className="h-20 flex items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">UCL</div>
                <div className="text-xs text-gray-600">INNOVATION<br />& ENTERPRISE</div>
              </div>
            </div>
            <div className="h-20 flex items-center">
              <div className="text-center">
                <div className="text-4xl text-gray-800 mb-1">🚀</div>
                <div className="text-sm font-medium text-gray-700">Microsoft<br />for Startups</div>
              </div>
            </div>
            <div className="h-20 flex items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-white bg-purple-600 px-3 py-1 mb-1">UKRI</div>
                <div className="text-sm font-medium text-gray-700">Innovate<br />UK</div>
              </div>
            </div>
            <div className="h-20 flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
                <span className="text-gray-600 ml-1 text-base">for Startups</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-16 py-12 max-w-[800px] mx-auto">
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
