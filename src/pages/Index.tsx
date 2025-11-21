import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  TrendingUp,
  Calendar,
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  FlaskConical,
  Dna,
  Send,
  Zap,
  Circle,
  Sparkles,
  MessageCircle,
  Bot,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import mentioraLogo from "@/assets/mentiora-logo.png";
import bristolLogo from "@/assets/bristol-logo.png";
import newcastleLogo from "@/assets/newcastle-logo.svg";
import birminghamLogo from "@/assets/birmingham-logo.png";
import oxfordLogo from "@/assets/oxford-logo.png";
import bathLogo from "@/assets/bath-logo.png";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);
  const [sliderMonths, setSliderMonths] = useState(6);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={mentioraLogo} 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-black">
              Mentiora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className="text-base text-gray-600 hover:text-black transition-colors">
              About Us
            </button>
            <button onClick={() => scrollToSection('subjects')} className="text-base text-gray-600 hover:text-black transition-colors">
              Subjects
            </button>
            <button onClick={() => scrollToSection('features')} className="text-base text-gray-600 hover:text-black transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-base text-gray-600 hover:text-black transition-colors">
              Pricing
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button 
              onClick={() => navigate('/onboarding/welcome')} 
              variant="outline" 
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold"
            >
              🧪 Test Onboarding
            </Button>
            <Button 
              onClick={() => navigate('/diagnostic-test?type=reading')} 
              variant="outline" 
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
            >
              📖 Reading Test
            </Button>
            <Button 
              onClick={() => navigate('/diagnostic-test?type=math')} 
              variant="outline" 
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold"
            >
              🔢 Math Test
            </Button>
            
            {user ? (
              <Button onClick={() => navigate("/dashboard")} style={{ backgroundColor: '#3B82F6' }} className="text-white px-6 rounded-lg font-semibold hover:opacity-90">
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/login")} 
                  variant="ghost"
                  className="hover:bg-transparent hover:text-[#3B82F6] transition-colors duration-200"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/register")} 
                  style={{ backgroundColor: '#3B82F6' }}
                  className="text-white px-6 rounded-lg font-semibold hover:opacity-90"
                >
                  Try Mentiora
                </Button>
              </>
            )}
          </div>

          {/* Mobile Sign In Button */}
          <div className="md:hidden">
            {user ? (
              <Button 
                onClick={() => navigate("/dashboard")} 
                size="sm"
                style={{ backgroundColor: '#3B82F6' }} 
                className="text-white px-4 rounded-lg font-semibold hover:opacity-90"
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/login")} 
                size="sm"
                style={{ backgroundColor: '#3B82F6' }} 
                className="text-white px-4 rounded-lg font-semibold hover:opacity-90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION - ChronoTask Style */}
      <section 
        className="relative py-20 px-4 min-h-[600px] flex items-center overflow-hidden"
        style={{
          backgroundColor: '#f8f9fa',
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <div className="max-w-[900px] mx-auto w-full relative">
          {/* Floating Element 1 - Top Left: Chat Conversation */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute top-[-70px] left-[-220px] hidden lg:block z-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Chat Conversation */}
              <div className="space-y-3" style={{ width: '240px' }}>
                {/* User Message */}
                <div className="flex justify-end">
                <div 
                    className="px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md max-w-[180px]"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white'
                    }}
                  >
                    <p className="text-sm font-medium">
                      I'm stuck on this bonding question 😅
                    </p>
                  </div>
                </div>
                
                {/* Mentiora Response */}
                <div className="flex justify-start">
                  <div 
                    className="px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-md max-w-[200px]"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <p className="text-sm font-medium mb-1">
                      Let's break it down! 💡
                    </p>
                    <p className="text-xs text-gray-600">
                      First, identify the type of bond. What elements are involved?
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 3 - Top Right: Study Insights (Real Dashboard Component) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="absolute top-[-50px] right-[-250px] hidden lg:block z-10"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              {/* Mini "You Perform Best At" Card - Exact Dashboard Design */}
              <div 
                className="w-[200px] bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-5 border border-gray-100"
                style={{ transform: 'rotate(3deg)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">You Perform Best At</h3>
                </div>
                <div className="text-2xl font-bold mb-1 text-black">6–8pm</div>
                <p className="text-xs text-gray-500">Your peak focus hours</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 4 - Bottom Left: Weekly Plan Card (Real Dashboard Component) */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute bottom-[-100px] left-[-230px] hidden lg:block z-10"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              {/* Mini Weekly Plan Card - Drawer Style */}
              <div 
                className="w-[300px] bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-gray-100"
                style={{ transform: 'rotate(-4deg)' }}
              >
                <div className="p-3 space-y-2.5">
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-black text-sm">Mon</span>
                      <span className="text-gray-500 text-xs ml-1.5">— Kickstart Week</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ color: '#3B82F6', border: '1.5px solid #3B82F6' }}>
                      30 mins
                    </span>
                  </div>
                  
                  {/* Task 1 */}
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-medium text-black">Create 10 flashcards on Bonding Structure</span>
                          <span className="px-1 py-0 rounded text-[9px] font-semibold bg-red-100 text-red-600">
                            Priority
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">15 mins • Current: 56%</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#3B82F6' }}>
                        <span>▶</span> Start
                      </button>
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ color: '#10b981', border: '1.5px solid #10b981' }}>
                        Done
                      </button>
                    </div>
                  </div>
                  
                  {/* Task 2 */}
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-medium text-black">Practice questions on Bonding Structure</span>
                          <span className="px-1 py-0 rounded text-[9px] font-semibold bg-red-100 text-red-600">
                            Priority
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">15 mins • Current: 56%</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#3B82F6' }}>
                        <span>▶</span> Start
                      </button>
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ color: '#10b981', border: '1.5px solid #10b981' }}>
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 5 - Bottom Right: Subject Card with Predicted/Target Grades (Real Dashboard Component) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-[-120px] right-[-230px] hidden lg:block z-10"
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              {/* Mini Subject Card - Exact Dashboard Design */}
              <div 
                className="w-[170px] bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
                style={{ transform: 'rotate(5deg)' }}
              >
                {/* Content */}
                <div className="p-3 space-y-2.5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🧪</span>
                      <h3 className="text-xs font-bold text-black">Chemistry</h3>
                    </div>
                  </div>
                  
                  {/* Predicted Section */}
                  <div className="bg-gray-100 rounded-lg px-2.5 py-1.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Predicted</span>
                      <span className="text-lg font-bold text-black">7</span>
                    </div>
                    <div className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: '78%', backgroundColor: '#3B82F6' }}
                      />
                    </div>
                  </div>
                  
                  {/* Target Section */}
                  <div className="bg-gray-100 rounded-lg px-2.5 py-1.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Target</span>
                      <span className="text-lg font-bold text-black">9</span>
                    </div>
                    <div className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                  
                  {/* Last 6 Attempts Section */}
                  <div className="bg-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Last 6 Attempts</span>
                    <div className="h-8 relative">
                      <svg width="100%" height="100%" viewBox="0 0 140 32" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          points="0,26 28,23 56,19 84,14 112,9 140,5"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Topics Button */}
                  <button 
                    className="w-full py-1.5 rounded-lg font-bold text-[10px] text-white"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    Topics
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content - Centered */}
          <div className="text-center relative z-20 py-16 md:py-12 px-4 mx-auto">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-5xl mx-auto"
              style={{
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              <span className="block" style={{ color: '#000000' }}>
                Your revision, finally made <span style={{ color: '#3B82F6' }}>personal</span>
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-10 text-lg px-4"
              style={{
                fontWeight: 400,
                color: '#4a4a4a',
                maxWidth: '600px'
              }}
            >
              Personalised GCSE & A-Level revision built to help you reach your best results.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                className="px-8 py-3.5 text-base font-semibold transition-all duration-200 w-full md:w-auto"
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                }}
                onClick={() => navigate(user ? '/dashboard' : '/register')}
              >
                Try now for free
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* UNIVERSITY STRIP SECTION */}
      <section 
        className="py-8 px-6 overflow-hidden"
        style={{
          backgroundColor: '#f8f9fa'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-gray-600">
              Trusted by <span className="font-bold text-black">500+ students</span> at Russell Group universities
            </p>
          </div>
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
        </div>
      </section>


      {/* HOW MENTIORA WORKS SECTION */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">
              How Mentiora Works
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to revise smarter, not harder.
            </p>
          </motion.div>

          {/* 3-Column Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {/* Column 1: Smart Question Bank */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-black mb-3">Practice Real Exam Questions</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Work through realistic, exam-style questions written to match your exact specification. Each one is built to reflect the style, difficulty, and wording of upcoming exams, so you're always revising what's most likely to appear.
              </p>
              
              {/* Question Mockup */}
              <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-6 space-y-4">
                {/* Question Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-black font-medium flex-1">
                      Explain the difference between ionic and covalent bonding. Include reference to electron transfer and sharing.
                    </p>
                    <span className="px-2 py-1 rounded-md text-xs font-bold text-white whitespace-nowrap" style={{ backgroundColor: '#3B82F6' }}>
                      [6 marks]
                    </span>
                  </div>
                </div>
                
                {/* Text Area */}
                <div className="border border-gray-300 rounded-lg p-3 bg-white min-h-[120px]">
                  <p className="text-sm text-gray-400">Your answer appears here...</p>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button 
                    className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white shadow-sm"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Column 2: AI Study Helper */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-black mb-3">Get Unstuck, Instantly</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Stuck on a concept? Ask your tutor anything. It won't give away answers, it guides you with hints and questions until you understand it yourself.
              </p>
              
              {/* Chat Mockup */}
              <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-6 space-y-3">
                {/* Student Message 1 */}
                <div className="flex justify-end">
                  <div 
                    className="px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm max-w-[280px]"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white'
                    }}
                  >
                    <p className="text-sm font-medium">
                      I don't understand ionic bonding 😅
                    </p>
                  </div>
                </div>
                
                {/* AI Response 1 */}
                <div className="flex justify-start">
                  <div 
                    className="px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[280px]"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <p className="text-sm font-medium mb-1">
                      Let me help! 💡
                    </p>
                    <p className="text-xs text-gray-600">
                      What do you know about electrons and atoms?
                    </p>
                  </div>
                </div>
                
                {/* Student Message 2 */}
                <div className="flex justify-end">
                  <div 
                    className="px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm max-w-[280px]"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white'
                    }}
                  >
                    <p className="text-sm font-medium">
                      Atoms want full outer shells?
                    </p>
                  </div>
                </div>
                
                {/* AI Response 2 */}
                <div className="flex justify-start">
                  <div 
                    className="px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[280px]"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <p className="text-sm font-medium">
                      Exactly! Now, what happens when one atom gives electrons to another?
                    </p>
                  </div>
                </div>
                
                {/* Input Box */}
                <div className="border border-gray-300 rounded-lg p-3 bg-white">
                  <p className="text-sm text-gray-400">Ask a question...</p>
                </div>
              </div>
            </motion.div>

            {/* Column 3: Track Your Progress */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-black mb-3">Watch Your Grade Improve</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                See your predicted grade update in real-time as you practice. Track which topics you've mastered and which need work, all calculated automatically.
              </p>
              
              {/* Dashboard Subject Card Mockup */}
              <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧪</span>
                      <h3 className="text-lg font-bold text-black">Chemistry</h3>
                    </div>
                  </div>
                  
                  {/* Predicted Section */}
                  <div className="bg-gray-100 rounded-lg px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Predicted</span>
                      <span className="text-2xl font-bold text-black">7</span>
                    </div>
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: '78%', backgroundColor: '#3B82F6' }}
                      />
                    </div>
                  </div>
                  
                  {/* Target Section */}
                  <div className="bg-gray-100 rounded-lg px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target</span>
                      <span className="text-2xl font-bold text-black">9</span>
                    </div>
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                  
                  {/* Last 6 Attempts Section */}
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Last 6 Attempts</span>
                    <div className="h-12 relative">
                      <svg width="100%" height="100%" viewBox="0 0 200 48" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          points="0,40 40,35 80,28 120,20 160,12 200,6"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Topics Button */}
                  <button 
                    className="w-full py-3 rounded-lg font-bold text-sm text-white"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    Topics
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* CURRICULUM COVERAGE SECTION */}
      <section id="subjects" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-black mb-4 leading-tight">
              Study what <span style={{ color: '#3B82F6' }}>actually gets marks</span>.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Aligned to your <span style={{ color: '#3B82F6' }}>exact exam board</span>. No filler. No wasted time.<br />
              Don't see your subject? <a href="mailto:yash@mentiora.com?subject=Subject Request" style={{ color: '#3B82F6' }} className="underline hover:opacity-80 transition-opacity">Request it here</a>.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto"
          >
            {/* Exam Boards */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">Exam Boards We Support</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: "AQA", level: "GCSE & A-Level" },
                  { name: "Edexcel", level: "GCSE & IGCSE" },
                  { name: "OCR", level: "GCSE" }
                ].map((board, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 hover:border-[#3B82F6] hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-xl font-bold text-black mb-1">{board.name}</div>
                    <div className="text-xs text-gray-500">{board.level}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">Subjects Available</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                  { name: "Biology", emoji: "🧬" },
                  { name: "Chemistry", emoji: "🧪" },
                  { name: "Physics", emoji: "🧲" },
                  { name: "Maths", emoji: "📐" },
                  { name: "English Language", emoji: "✍️" },
                  { name: "English Literature", emoji: "📖" },
                  { name: "Computer Science", emoji: "💻" },
                  { name: "Geography", emoji: "🌍" },
                  { name: "History", emoji: "⏳" },
                  { name: "Psychology", emoji: "🧠" },
                  { name: "Business", emoji: "💼" },
                  { name: "Religious Studies", emoji: "⛪" },
                  { name: "Combined Science", emoji: "🔬" },
                  { name: "Spanish", emoji: "🇪🇸" }
                ].map((subject, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#3B82F6] hover:shadow-md transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-3xl mb-2">{subject.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{subject.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* HOW PERSONALIZATION WORKS - DASHBOARD SHOWCASE */}
      <section id="features" className="relative py-20 px-6 overflow-hidden bg-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold leading-tight mb-5">
              <span className="text-black">A learning system that</span>
              <br />
              <span className="text-black"><span style={{ color: '#3B82F6' }}>never stops improving</span></span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-[800px] mx-auto">
              Every question you answer makes Mentiora smarter about how you learn.
              <br />Watch how the cycle works.
            </p>
          </motion.div>

          {/* Main Visual Flow */}
          <div className="relative max-w-[1200px] mx-auto space-y-16">
            {/* Stage 1: YOU STUDY */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
                    <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg shadow-lg">
                      1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">You Study</h3>
                    <p className="text-lg text-muted-foreground mt-1">Answer questions and get instant feedback</p>
                  </div>
                </div>
              </div>
                  
              {/* Question Card - Real Dashboard Style */}
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                className="max-w-[700px] mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="inline-flex items-center gap-1">
                        <span className="inline-block border-2 border-black px-3 py-1 text-sm font-mono font-semibold text-black">0</span>
                        <span className="inline-block border-2 border-black px-3 py-1 text-sm font-mono font-semibold text-black">4</span>
                      </div>
                    </div>
                    <p className="text-base text-black leading-relaxed">
                      Explain why increasing light intensity increases the rate of photosynthesis.
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-black whitespace-nowrap">
                    [3 marks]
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[100px] border-2 border-gray-200">
                  <p className="text-sm text-gray-600 italic">Your answer appears here...</p>
                </div>
                
                <div className="flex justify-end items-center">
                  <Button
                    size="sm"
                    className="text-white font-semibold rounded-full px-6"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    Submit Answer
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Connector Arrow */}
            <div className="flex justify-center my-12">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-0"
              >
                <div className="w-[2px] h-16 bg-primary rounded-full" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary -mt-1">
                  <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>

            {/* Stage 2: MENTIORA ANALYZES */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
                    <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg shadow-lg">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">Mentiora Analyzes</h3>
                    <p className="text-lg text-muted-foreground mt-1">We track 50+ data points from every answer</p>
                  </div>
                </div>
              </div>
                  
              {/* Analysis Dashboard - Exact Match to Dashboard */}
              <div className="max-w-[1000px] mx-auto grid md:grid-cols-4 gap-6">
                {/* Overall Progress */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg p-6 border-0 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Progress</div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-foreground">6.8</span>
                    <span className="text-lg text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">8</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '76%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Retention */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg p-6 border-0 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Retention</div>
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">74%</div>
                  <div className="text-xs text-muted-foreground">Last 7 days</div>
                </motion.div>

                {/* Best Study Time */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg p-6 border-0 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Best Study Time</div>
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">7-9pm</div>
                  <div className="text-xs text-muted-foreground">Most productive</div>
                </motion.div>

                {/* This Week */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg p-6 border-0 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">This Week</div>
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">5h 20m</div>
                  <div className="text-xs text-muted-foreground">Study time</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Connector Arrow */}
            <div className="flex justify-center my-12">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex flex-col items-center gap-0"
              >
                <div className="w-[2px] h-16 bg-primary rounded-full" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary -mt-1">
                  <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>

            {/* Stage 3: YOU GET PERSONALIZED RESULTS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="mb-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
                    <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg shadow-lg">
                      3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">You Get Personalized Results</h3>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">Three features that adapt to you in real-time</p>
              </div>
              
              {/* Three Dashboard Cards - Exact Platform Style */}
              <div className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
                {/* Card 1: Predicted Grades - Matching Dashboard Style */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.12)' }}
                  className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-200 flex flex-col"
                >
                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    {/* Title */}
                    <div className="mb-1">
                      <h3 className="text-sm font-bold text-[#0F172A]">Predicted Grades</h3>
                      <p className="text-xs text-[#64748B]">Track your progress</p>
                    </div>
                    
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🧪</span>
                      <h4 className="text-sm text-black">Chemistry</h4>
                    </div>
                    
                    {/* Predicted Section */}
                    <div className="bg-gray-100 rounded px-3 py-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase">Predicted</span>
                        <span className="text-2xl font-bold text-black">7</span>
                      </div>
                      <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: '#3B82F6' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: '78%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                    
                    {/* Target Section */}
                    <div className="bg-gray-100 rounded px-3 py-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase">Target</span>
                        <span className="text-2xl font-bold text-black">9</span>
                      </div>
                      <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: '70%' }}
                        />
                      </div>
                    </div>
                    
                    {/* Last 6 Attempts Section */}
                    <div className="bg-gray-100 rounded px-3 py-2 flex-1">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1.5">Last 6 Attempts</span>
                      <div className="h-10 relative">
                        <svg width="100%" height="100%" viewBox="0 0 140 48" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2.5"
                            points="0,39 28,35 56,29 84,21 112,14 140,8"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Topics Button */}
                    <button 
                      className="w-full py-2 rounded text-xs text-white hover:opacity-90 transition-opacity mt-auto"
                      style={{ backgroundColor: '#3B82F6' }}
                    >
                      Topics
                    </button>
                  </div>
                </motion.div>

                {/* Card 2: Your Notes - Exact Dashboard Style */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.12)' }}
                  className="bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 rounded-lg border border-[#E2E8F0]/50 dark:border-gray-700 shadow-lg transition-all duration-200 flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2.5">
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Your Notes</h3>
                      <p className="text-xs text-[#64748B] dark:text-gray-400">Review notes from mistakes</p>
                    </div>
                    
                    <div className="space-y-2.5 flex-1 flex flex-col">
                      {/* Header Section */}
                      <div className="pb-2.5 border-b border-[#E2E8F0]/30 dark:border-gray-700/30">
                        <div className="space-y-1.5">
                          <Badge className="rounded px-2 py-0.5 font-medium shadow-sm text-[10px] bg-[#EF4444] text-white mb-1">
                            Low Confidence
                          </Badge>
                          <h4 className="text-sm text-[#0F172A] dark:text-white leading-tight">
                            Explain how clock speed affects CPU performance.
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#64748B] dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <div className="h-1 w-1 rounded-full bg-[#3B82F6]" />
                              Systems Architecture
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              13 Oct
                            </span>
                            <span className="flex items-center gap-1 font-medium text-[#EF4444]">
                              -6 marks
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* What Went Wrong */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded bg-gradient-to-br from-[#EF4444]/20 to-[#EF4444]/5">
                            <AlertTriangle className="h-3 w-3 text-[#EF4444]" />
                          </div>
                          <h5 className="text-xs text-[#0F172A] dark:text-white">What Went Wrong</h5>
                        </div>
                        <div className="p-2 rounded bg-[#FEF2F2] dark:bg-red-950/20 border border-[#EF4444]/20">
                          <p className="text-xs text-[#1E293B] dark:text-gray-200 leading-relaxed">
                            Insufficient understanding of key concepts
                          </p>
                        </div>
                      </div>
                      
                      {/* The Solution */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                            <CheckCircle2 className="h-3 w-3 text-[#16A34A]" />
                          </div>
                          <h5 className="text-xs text-[#0F172A] dark:text-white">The Solution</h5>
                        </div>
                        <div className="p-2 rounded bg-[#F0FDF4] dark:bg-green-950/20 border border-[#16A34A]/20">
                          <p className="text-xs text-[#1E293B] dark:text-gray-200 leading-relaxed">
                            Review the fundamental principles
                          </p>
                        </div>
                      </div>
                      
                      {/* Key Points to Remember */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5">
                            <Sparkles className="h-3 w-3 text-[#3B82F6]" />
                          </div>
                          <h5 className="text-xs text-[#0F172A] dark:text-white">Key Points</h5>
                        </div>
                        <div className="flex gap-2 p-2 rounded bg-white dark:bg-gray-800/50 border border-[#3B82F6]/20 shadow-sm">
                          <div className="flex-shrink-0 h-5 w-5 rounded bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                            1
                          </div>
                          <p className="text-xs text-[#1E293B] dark:text-gray-200 leading-relaxed flex-1">
                            Clock Speed: Refers to the number of cycles a CPU can execute per second, measured in GHz.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Weekly Plan - Exact Floating Card Style */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.12)' }}
                  className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-200 flex flex-col"
                >
                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    {/* Title */}
                    <div className="mb-1">
                      <h3 className="text-sm font-bold text-[#0F172A]">Weekly Plan</h3>
                      <p className="text-xs text-[#64748B]">Personalized schedule</p>
                    </div>
                    
                    {/* Day Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-black text-sm">Mon</span>
                        <span className="text-gray-500 text-xs ml-1.5">— Kickstart</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px]" style={{ color: '#3B82F6', border: '1px solid #3B82F6' }}>
                        30 mins
                      </span>
                    </div>
                    
                    {/* Task 1 */}
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs text-black">Create 10 flashcards on Bonding</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-600">
                              Priority
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">15 mins • Current: 56%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#3B82F6' }}>
                          <span>▶</span> Start
                        </button>
                        <button className="px-2.5 py-1 rounded text-[10px] hover:opacity-80 transition-opacity" style={{ color: '#10b981', border: '1px solid #10b981' }}>
                          Done
                        </button>
                      </div>
                    </div>
                    
                    {/* Task 2 */}
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs text-black">Practice questions on Bonding</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-600">
                              Priority
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">15 mins • Current: 56%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#3B82F6' }}>
                          <span>▶</span> Start
                        </button>
                        <button className="px-2.5 py-1 rounded text-[10px] hover:opacity-80 transition-opacity" style={{ color: '#10b981', border: '1px solid #10b981' }}>
                          Done
                        </button>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-3"></div>
                    
                    {/* Tuesday Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-black text-sm">Tue</span>
                        <span className="text-gray-500 text-xs ml-1.5">— Build Momentum</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px]" style={{ color: '#3B82F6', border: '1px solid #3B82F6' }}>
                        25 mins
                      </span>
                    </div>
                    
                    {/* Tuesday Task */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs text-black">Review states of matter</span>
                          </div>
                          <p className="text-[10px] text-gray-500">25 mins • Current: 72%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#3B82F6' }}>
                          <span>▶</span> Start
                        </button>
                        <button className="px-2.5 py-1 rounded text-[10px] hover:opacity-80 transition-opacity" style={{ color: '#10b981', border: '1px solid #10b981' }}>
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Section Ending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="mt-20 text-center max-w-[700px] mx-auto"
          >
            <p className="text-lg text-gray-600 leading-relaxed">
              This continuous cycle means <span className="font-bold text-black">Mentiora gets smarter about you with every answer</span>, creating a truly personalized learning experience that improves your grades.
            </p>
          </motion.div>
        </div>
      </section>


      {/* VALUE CALCULATOR SECTION */}
      <section id="pricing" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold leading-tight mb-5 text-black">
              Calculate your savings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              See how much you'll save compared to private tutoring
            </p>
          </motion.div>

          {/* Main Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg"
          >
            {/* Large Animated Savings Display */}
            <div className="text-center mb-8">
              <div className="text-gray-500 text-sm uppercase tracking-wider mb-3">
                Total Savings
              </div>
              <motion.div
                key={sliderMonths}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"
              >
                £{((500 - 9.99) * sliderMonths).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <div className="text-gray-600 text-lg mt-2">
                over {sliderMonths} {sliderMonths === 1 ? 'month' : 'months'}
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="mb-10 px-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-black font-semibold text-lg">
                  How many months will you study?
                </label>
                <div className="text-3xl font-bold text-blue-400">
                  {sliderMonths}
                </div>
              </div>
              <Slider
                value={[sliderMonths]}
                onValueChange={(value) => setSliderMonths(value[0])}
                min={1}
                max={12}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Private Tutoring Cost */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6"
              >
                <div className="text-red-600 text-sm font-semibold mb-2">
                  Private Tutoring
                </div>
                <motion.div
                  key={`tutoring-${sliderMonths}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold text-black mb-1"
                >
                  £{(500 * sliderMonths).toLocaleString('en-GB')}
                </motion.div>
                <div className="text-gray-500 text-sm">
                  £500/month × {sliderMonths}
                </div>
              </motion.div>

              {/* Mentiora Cost */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={mentioraLogo} alt="Mentiora" className="h-4 w-4" />
                  <div className="text-blue-600 text-sm font-semibold">
                    Mentiora
                  </div>
                </div>
                <motion.div
                  key={`mentiora-${sliderMonths}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold text-black mb-1"
                >
                  £{(9.99 * sliderMonths).toFixed(2)}
                </motion.div>
                <div className="text-gray-500 text-sm">
                  £9.99/month × {sliderMonths}
                </div>
              </motion.div>

              {/* Your Savings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6"
              >
                <div className="text-blue-600 text-sm font-semibold mb-2">
                  You Save
                </div>
                <motion.div
                  key={`savings-${sliderMonths}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold text-black mb-1"
                >
                  £{((500 - 9.99) * sliderMonths).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
                <div className="text-gray-500 text-sm">
                  {Math.round(((500 - 9.99) / 500) * 100)}% cheaper
                </div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-10"
            >
              <Button 
                size="lg"
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="text-white text-lg font-semibold px-12 py-6 rounded-lg shadow-lg hover:scale-105 transition-all"
                style={{ backgroundColor: '#3B82F6' }}
              >
                Start saving today
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section 
        className="py-20 px-6 bg-gradient-to-br from-white to-gray-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold text-black mb-4">
              Start your journey to better grades
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of students already improving with Mentiora
            </p>
            <Button 
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="text-white text-lg font-semibold px-12 py-6 rounded-lg shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: '#3B82F6' }}
            >
              Try now for free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-16 text-center md:text-left">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <img src={mentioraLogo} alt="Mentiora" className="h-6 w-6" />
                <span className="text-lg font-bold text-black">Mentiora</span>
              </div>
              <p className="text-sm text-gray-600">Personalised learning for GCSE & A-Levels</p>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-3">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('pricing')} className="text-sm text-gray-600 hover:text-black transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-sm text-gray-600 hover:text-black transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('subjects')} className="text-sm text-gray-600 hover:text-black transition-colors">Subjects</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-3">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('about')} className="text-sm text-gray-600 hover:text-black transition-colors">About us</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
