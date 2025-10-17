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
  Menu,
  X,
  Send,
  Zap,
  Circle,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import mentioraLogo from "@/assets/mentiora-logo.png";
import bristolLogo from "@/assets/bristol-logo.png";
import newcastleLogo from "@/assets/newcastle-logo.svg";
import birminghamLogo from "@/assets/birmingham-logo.png";
import exeterLogo from "@/assets/exeter-logo.webp";
import oxfordLogo from "@/assets/oxford-logo.png";
import cambridgeLogo from "@/assets/cambridge-logo.png";
import lseLogo from "@/assets/lse-logo.png";
import bathLogo from "@/assets/bath-logo.png";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);

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
            {user ? (
              <Button onClick={() => navigate("/dashboard")} style={{ backgroundColor: '#0BA5E9' }} className="text-white px-6 rounded-lg font-semibold hover:opacity-90">
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/login")} 
                  variant="ghost" 
                  className="hover:bg-transparent hover:text-[#0EA5E9] transition-colors duration-200"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/register")} 
                  style={{ backgroundColor: '#0BA5E9' }}
                  className="text-white px-6 rounded-lg font-semibold hover:opacity-90"
                >
                  Try Mentiora
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO SECTION - ChronoTask Style */}
      <section 
        className="relative py-24 px-4 min-h-[600px] flex items-center overflow-hidden"
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
            className="absolute top-[-40px] left-[-180px] hidden lg:block z-10"
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
                      backgroundColor: '#0BA5E9',
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
            className="absolute top-[-20px] right-[-220px] hidden lg:block z-10"
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
            className="absolute bottom-[-80px] left-[-200px] hidden lg:block z-10"
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
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ color: '#0BA5E9', border: '1.5px solid #0BA5E9' }}>
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
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#0BA5E9' }}>
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
                      <button className="px-2 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#0BA5E9' }}>
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
            className="absolute bottom-[-100px] right-[-200px] hidden lg:block z-10"
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
                        style={{ width: '78%', backgroundColor: '#0BA5E9' }}
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
                          stroke="#0BA5E9"
                          strokeWidth="2"
                          points="0,26 28,23 56,19 84,14 112,9 140,5"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Topics Button */}
                  <button 
                    className="w-full py-1.5 rounded-lg font-bold text-[10px] text-white"
                    style={{ backgroundColor: '#0BA5E9' }}
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
              className="mb-6 text-4xl md:text-5xl lg:text-6xl mx-auto"
              style={{
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              <span className="block" style={{ color: '#000000' }}>
                Your revision, finally made <span style={{ color: '#0BA5E9' }}>personal</span>
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-10 text-base md:text-lg px-4"
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
                  backgroundColor: '#0BA5E9',
                  color: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(11, 165, 233, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0891C7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0BA5E9';
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
                  src={exeterLogo} 
                  alt="University of Exeter" 
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
                  src={cambridgeLogo} 
                  alt="University of Cambridge" 
                  className="w-auto object-contain"
                  style={{ height: '40px', maxWidth: '160px' }}
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                <img 
                  src={lseLogo} 
                  alt="London School of Economics" 
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
                  src={exeterLogo} 
                  alt="University of Exeter" 
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
                  src={cambridgeLogo} 
                  alt="University of Cambridge" 
                  className="w-auto object-contain"
                  style={{ height: '40px', maxWidth: '160px' }}
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '180px' }}>
                <img 
                  src={lseLogo} 
                  alt="London School of Economics" 
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


      {/* UNLIKE ANY OTHER APP SECTION */}
      <section id="about" className="py-24 px-6" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-5 leading-tight">
              Unlike any other app<br />
              A <span style={{ color: '#0BA5E9' }}>personalised tutor</span>.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Mentiora teaches you how to answer every question
              in your exams to get full marks.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-10"
          >
            {[
              {
                icon: "📕",
                title: "Your Personal Tutor",
                description: "Mentiora teaches you based on your weakest topics so you feel confident with every topic on your Exam Syllabus.",
                visual: (
                  <div className="bg-white rounded-xl p-6 mt-6">
                    <div style={{ backgroundColor: '#0BA5E9' }} className="rounded-lg p-3 mb-4 text-white text-sm">
                      Hi Mentiora, What did this question mean by potential energy?
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-bold text-sm mb-2">Potential energy</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        When a liquid turns into a solid, the particles lose energy and move closer together...
                      </p>
                    </div>
                  </div>
                )
              },
              {
                icon: "📝",
                title: "Your Exam Guide",
                description: "Mentiora takes you through each topic in your syllabus so that you learn how to answer every exam question to get full marks.",
                visual: (
                  <div className="bg-white rounded-xl p-6 mt-6">
                    <div className="border-b border-gray-200 pb-2 mb-3">
                      <div className="font-semibold text-sm">Unit 1: Cell Biology</div>
                    </div>
                    <div className="space-y-2">
                      <div style={{ color: '#0BA5E9', backgroundColor: '#E0F2FE' }} className="text-sm px-3 py-2 rounded">
                        Eukaryotes and prokaryoti...
                      </div>
                      <div className="text-sm px-3 py-2 text-gray-700">Animal and plant cells</div>
                      <div className="text-sm px-3 py-2 text-gray-700">Cell specialisation</div>
                    </div>
                  </div>
                )
              },
              {
                icon: "✍️",
                title: "Your Examiner",
                description: "Mentiora marks your work immediately based on your exam syllabus and provides feedback to help you improve your answer.",
                visual: (
                  <div className="bg-white rounded-xl p-6 mt-6">
                    <div className="font-semibold text-sm mb-4">Your marks awarded</div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Leaves become damaged</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Less chloroplasts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" />
                        <span className="text-sm text-gray-400">Less photosynthesis</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700">
                      You got 2 out of 3 marks. Remember to mention what happens when plants have fewer chloroplasts!
                    </div>
                  </div>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
                {feature.visual}
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
              The only tutor that's<br />
              <span style={{ color: '#0BA5E9' }}>specific to your exam curriculum</span>
            </h2>
            <p className="text-base text-gray-600 mb-8">
              Other tutoring platforms are not based on Exam Board Curriculums.<br />
              Don't see your subject? <button style={{ color: '#0BA5E9' }} className="underline hover:opacity-80 transition-opacity">Request it here</button>.
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
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 hover:border-[#0BA5E9] hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#0BA5E9] hover:shadow-md transition-all duration-300 cursor-pointer text-center"
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
            <h2 className="text-5xl font-extrabold leading-tight mb-5">
              <span className="text-black">A learning system that</span>
              <br />
              <span className="text-black"><span style={{ color: '#0BA5E9' }}>never stops improving</span></span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-[800px] mx-auto">
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
                    <h3 className="text-3xl font-bold text-foreground tracking-tight">You Study</h3>
                    <p className="text-sm text-muted-foreground mt-1">Answer questions and get instant feedback</p>
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
                    style={{ backgroundColor: '#0BA5E9' }}
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
                    <h3 className="text-3xl font-bold text-foreground tracking-tight">Mentiora Analyzes</h3>
                    <p className="text-sm text-muted-foreground mt-1">We track 50+ data points from every answer</p>
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
                    <h3 className="text-3xl font-bold text-foreground tracking-tight">You Get Personalized Results</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Three features that adapt to you in real-time</p>
              </div>
              
              {/* Three Dashboard Cards - Exact Platform Style */}
              <div className="grid md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
                {/* Card 1: Predicted Grades - Matching Dashboard Style */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.12)' }}
                  className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-200 flex flex-col"
                >
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col">
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
                          style={{ backgroundColor: '#0BA5E9' }}
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
                            stroke="#0BA5E9"
                            strokeWidth="2.5"
                            points="0,39 28,35 56,29 84,21 112,14 140,8"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Topics Button */}
                    <button 
                      className="w-full py-2 rounded text-xs text-white hover:opacity-90 transition-opacity mt-auto"
                      style={{ backgroundColor: '#0BA5E9' }}
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
                  <div className="p-4 flex-1 flex flex-col">
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
                              <div className="h-1 w-1 rounded-full bg-[#0EA5E9]" />
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
                          <div className="p-1 rounded bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                            <Sparkles className="h-3 w-3 text-[#0EA5E9]" />
                          </div>
                          <h5 className="text-xs text-[#0F172A] dark:text-white">Key Points</h5>
                        </div>
                        <div className="flex gap-2 p-2 rounded bg-white dark:bg-gray-800/50 border border-[#0EA5E9]/20 shadow-sm">
                          <div className="flex-shrink-0 h-5 w-5 rounded bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
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
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col">
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
                      <span className="px-2 py-0.5 rounded text-[10px]" style={{ color: '#0BA5E9', border: '1px solid #0BA5E9' }}>
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
                        <button className="px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0BA5E9' }}>
                          <span>▶</span> Start
                        </button>
                        <button className="px-2.5 py-1 rounded text-[10px] hover:opacity-80 transition-opacity" style={{ color: '#10b981', border: '1px solid #10b981' }}>
                          Done
                        </button>
                      </div>
                    </div>
                    
                    {/* Task 2 */}
                    <div className="space-y-1.5 flex-1">
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
                        <button className="px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0BA5E9' }}>
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


      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-5">
              <span className="text-black">Personalised tutoring</span>
              <br />
              <span style={{ color: '#0BA5E9' }}>at a fraction of the cost</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Trained to be more effective than personal tutoring,
              <br />
              at just 5% of the cost of private tuition.
            </p>
          </motion.div>

          {/* Main Comparison - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT COLUMN: Effectiveness Graph */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              {/* Graph Title */}
              <h3 className="text-4xl font-bold mb-8" style={{ color: '#0BA5E9' }}>
                68% grade improvement
              </h3>

              {/* Graph Container */}
              <div className="bg-white border border-gray-200 rounded-lg p-8 h-[450px]">
                <svg
                  viewBox="0 0 600 380"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Y-axis label (rotated) */}
                  <text
                    x="-190"
                    y="25"
                    transform="rotate(-90)"
                    className="text-sm fill-gray-500"
                    textAnchor="middle"
                    fontSize="14"
                  >
                    Average grades
                  </text>

                  {/* X-axis label */}
                  <text
                    x="350"
                    y="365"
                    className="text-sm fill-gray-500"
                    textAnchor="middle"
                    fontSize="14"
                  >
                    Hours spent learning
                  </text>

                  {/* Gray curve - Non-personal education */}
                  <motion.path
                    d="M 80,300 Q 200,240 350,210 Q 480,190 560,185"
                    fill="none"
                    stroke="#D1D5DB"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  {/* Blue curve - Personalised education */}
                  <motion.path
                    d="M 80,300 Q 180,120 300,70 Q 420,30 520,20"
                    fill="none"
                    stroke="#0BA5E9"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />

                  {/* Personalised education label */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.7, duration: 0.4 }}
                  >
                    {/* Mentiora logo image */}
                    <image
                      href={mentioraLogo}
                      x="355"
                      y="56"
                      width="20"
                      height="20"
                    />
                    
                    {/* Label text */}
                    <text
                      x="382"
                      y="71"
                      className="text-base fill-black font-semibold"
                      fontSize="16"
                    >
                      Personalised education
                    </text>
                  </motion.g>

                  {/* Non-personal education label */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.9, duration: 0.4 }}
                  >
                    {/* Label text */}
                    <text
                      x="295"
                      y="246"
                      className="text-base fill-black font-semibold"
                      fontSize="16"
                    >
                      Non-personal education
                    </text>
                  </motion.g>
                </svg>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Cost Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Title above bar chart */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-3xl font-bold text-center leading-tight">
                  <span className="text-black">95% cheaper than</span>
                  <br />
                  <span style={{ color: '#0BA5E9' }}>private tutoring</span>
                </h3>
              </motion.div>

              {/* Bar Chart */}
              <div className="flex items-end gap-12 h-[350px]">
                {/* Personal Tutoring - Tall Gray Bar */}
                <div className="flex flex-col items-center justify-end h-full">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mb-3"
                  >
                    <div className="text-2xl font-bold text-gray-700">
                      £500<span className="text-base">/month</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gray-300 rounded-t-md relative"
                    style={{ width: '80px', height: '240px' }}
                    initial={{ scaleY: 0, originY: 1 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                  />
                  
                  <div className="text-sm text-gray-600 mt-3 font-medium">Personal tutoring</div>
                </div>

                {/* Mentiora - Small Blue Bar */}
                <div className="flex flex-col items-center justify-end h-full">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="mb-3"
                  >
                    <div className="text-2xl font-bold text-black">
                      £9.99<span className="text-base">/month</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="rounded-t-md relative"
                    style={{ width: '80px', height: '48px', backgroundColor: '#0BA5E9' }}
                    initial={{ scaleY: 0, originY: 1 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                  />
                  
                  <motion.div 
                    className="flex items-center gap-2 mt-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.4 }}
                  >
                    <img 
                      src={mentioraLogo} 
                      alt="Mentiora" 
                      className="h-5 w-5"
                    />
                    <span className="text-base font-bold" style={{ color: '#0BA5E9' }}>mentiora</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section 
        className="py-24 px-6 bg-gradient-to-br from-white to-gray-50"
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
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students already improving with Mentiora
            </p>
            <Button 
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="text-white text-lg font-semibold px-12 py-6 rounded-lg shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: '#0BA5E9' }}
            >
              Try now for free
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Get started in 60 seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
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
                <li><button className="text-sm text-gray-600 hover:text-black transition-colors">Careers</button></li>
                <li><button className="text-sm text-gray-600 hover:text-black transition-colors">Blog</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><button className="text-sm text-gray-600 hover:text-black transition-colors">Privacy Policy</button></li>
                <li><button className="text-sm text-gray-600 hover:text-black transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">© 2025 Mentiora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
