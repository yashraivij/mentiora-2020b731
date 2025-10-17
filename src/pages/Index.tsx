import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  Crown,
  Menu,
  X,
  Send,
  Zap,
  Circle,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import mentioraLogo from "@/assets/mentiora-logo.png";
import cambridgeLogo from "@/assets/cambridge-logo.png";
import oxfordLogo from "@/assets/oxford-logo.webp";
import lseLogo from "@/assets/lse-logo.png";
import exeterLogo from "@/assets/exeter-logo.webp";
import bathLogo from "@/assets/bath-logo.svg";
import bristolLogo from "@/assets/bristol-logo.png";
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
            <span className="text-xl font-bold text-black flex items-center">
              Ment<Crown className="w-4 h-4 text-yellow-500 -mt-2" />ora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/pricing")} className="text-base text-gray-600 hover:text-black transition-colors">
              Pricing
            </button>
            <button className="text-base text-gray-600 hover:text-black transition-colors">
              About us
            </button>
            <button className="text-base text-gray-600 hover:text-black transition-colors">
              GCSE Results Day 2025
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate("/dashboard")} style={{ backgroundColor: '#0BA5E9' }} className="text-white px-6 rounded-lg font-semibold hover:opacity-90">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="ghost" className="text-gray-600 hover:text-black">
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
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={cambridgeLogo} 
                  alt="University of Cambridge" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={oxfordLogo} 
                  alt="University of Oxford" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={lseLogo} 
                  alt="London School of Economics" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={exeterLogo} 
                  alt="University of Exeter" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={bathLogo} 
                  alt="University of Bath" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={bristolLogo} 
                  alt="University of Bristol" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              {/* Second set - duplicate for seamless loop */}
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={cambridgeLogo} 
                  alt="University of Cambridge" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={oxfordLogo} 
                  alt="University of Oxford" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={lseLogo} 
                  alt="London School of Economics" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={exeterLogo} 
                  alt="University of Exeter" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={bathLogo} 
                  alt="University of Bath" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <div className="h-12 flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" style={{ width: '160px' }}>
                <img 
                  src={bristolLogo} 
                  alt="University of Bristol" 
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* UNLIKE ANY OTHER APP SECTION */}
      <section className="py-24 px-6" style={{ backgroundColor: '#F0F9FF' }}>
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
      <section className="py-20 px-6 bg-white">
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
      <section className="relative py-20 px-6 overflow-hidden bg-white">
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
                className="flex flex-col items-center"
              >
                <div className="w-[2px] h-16 bg-gradient-to-b from-primary via-primary/70 to-primary/40 rounded-full" />
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-primary -mt-1">
                  <path d="M8 0L8 12M8 12L4 8M8 12L12 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                className="flex flex-col items-center"
              >
                <div className="w-[2px] h-16 bg-gradient-to-b from-primary via-primary/70 to-primary/40 rounded-full" />
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-primary -mt-1">
                  <path d="M8 0L8 12M8 12L4 8M8 12L12 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <div className="grid md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
                {/* Card 1: Predicted Grades - Matching Dashboard Style */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg overflow-hidden border-0 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🧪</span>
                      <h3 className="text-sm font-bold text-foreground">Chemistry</h3>
                    </div>
                    
                    <div className="bg-muted rounded-lg px-4 py-3 space-y-3 mb-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Predicted</span>
                          <span className="text-2xl font-bold text-foreground">7</span>
                        </div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
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
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target</span>
                          <span className="text-2xl font-bold text-foreground">9</span>
                        </div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-2 rounded-lg font-bold text-sm text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#0BA5E9' }}
                    >
                      Topics
                    </button>
                  </div>
                </motion.div>

                {/* Card 2: Auto-Notes - Matching Dashboard Style */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg overflow-hidden border-0 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
                      <p className="text-sm text-muted-foreground">Review notes from your mistakes and learning progress</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-500 text-white mb-3">
                          Low Confidence
                        </span>
                        <h4 className="font-bold text-base text-foreground mb-2">
                          Explain how clock speed, cache size, and number of cores affect CPU performance.
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span className="text-primary">• Systems Architecture</span>
                          <span>📅 13 Oct 2025</span>
                          <span className="text-red-500">-6 marks lost</span>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="text-red-500 text-xs">⚠</span>
                          </div>
                          <h5 className="text-sm font-bold text-foreground">What Went Wrong</h5>
                        </div>
                        <p className="text-xs text-muted-foreground ml-7">
                          Insufficient understanding of key concepts
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-green-500 text-xs">✓</span>
                          </div>
                          <h5 className="text-sm font-bold text-foreground">The Solution</h5>
                        </div>
                        <p className="text-xs text-muted-foreground ml-7">
                          Review the fundamental principles and practice similar questions
                        </p>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs">💡</span>
                          </div>
                          <h5 className="text-sm font-bold text-foreground">Key Points to Remember</h5>
                        </div>
                        <div className="ml-7 space-y-2 text-xs text-muted-foreground">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary text-white font-bold text-xs flex-shrink-0">1</span>
                            <p>Clock Speed refers to the number of cycles a CPU can execute per second</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Smart Planner - Matching Dashboard Style */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="bg-card rounded-2xl shadow-lg overflow-hidden border-0 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-foreground">Mon</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#0BA5E9', color: 'white' }}>
                          30 mins
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">— Kickstart Week</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-card border border-border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-foreground flex-1">
                            Create 10 flashcards on Systems Architecture
                          </h4>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500 text-white ml-2 flex-shrink-0">
                            Priority
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">15 mins</p>
                        <div className="flex gap-2">
                          <button 
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded font-semibold text-sm text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#0BA5E9' }}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3 2l10 6-10 6V2z"/>
                            </svg>
                            Start
                          </button>
                          <button className="flex-1 py-1.5 rounded font-semibold text-sm border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                            Done
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-card border border-border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-foreground flex-1">
                            Practice questions on Systems Architecture
                          </h4>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500 text-white ml-2 flex-shrink-0">
                            Priority
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">15 mins</p>
                        <div className="flex gap-2">
                          <button 
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded font-semibold text-sm text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#0BA5E9' }}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3 2l10 6-10 6V2z"/>
                            </svg>
                            Start
                          </button>
                          <button className="flex-1 py-1.5 rounded font-semibold text-sm border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                            Done
                          </button>
                        </div>
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
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
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start max-w-6xl mx-auto">
            
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
              <div className="bg-white border border-gray-200 p-10 min-h-[500px]">
                <svg
                  viewBox="0 0 600 400"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Y-axis label (rotated) */}
                  <text
                    x="-200"
                    y="20"
                    transform="rotate(-90)"
                    className="text-sm fill-gray-500"
                    textAnchor="middle"
                  >
                    Average grade
                  </text>

                  {/* X-axis label */}
                  <text
                    x="350"
                    y="385"
                    className="text-sm fill-gray-500"
                    textAnchor="middle"
                  >
                    Hours spent learning
                  </text>

                  {/* Gray curve - Non-personal education */}
                  <motion.path
                    d="M 80,320 Q 200,250 350,210 Q 450,190 580,180"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />

                  {/* Blue curve - Personalised education */}
                  <motion.path
                    d="M 80,320 Q 180,140 300,80 Q 400,40 520,30"
                    fill="none"
                    stroke="#0BA5E9"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                  />

                  {/* Personalised education label with dashed line */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.3, duration: 0.5 }}
                  >
                    {/* Dashed line from curve to label */}
                    <line
                      x1="520"
                      y1="30"
                      x2="420"
                      y2="70"
                      stroke="#0BA5E9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Circle on curve */}
                    <circle cx="520" cy="30" r="4" fill="#0BA5E9" />
                    {/* Infinity symbol (Medly logo) */}
                    <path
                      d="M 375,65 Q 372,60 370,65 Q 368,70 370,75 Q 372,70 375,65 M 375,65 Q 378,60 380,65 Q 382,70 380,75 Q 378,70 375,65"
                      fill="none"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                    {/* Label text */}
                    <text
                      x="390"
                      y="72"
                      className="text-sm font-medium fill-black"
                    >
                      Personalised education
                    </text>
                  </motion.g>

                  {/* Non-personal education label with dashed line */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                  >
                    {/* Dashed line from curve to label */}
                    <line
                      x1="450"
                      y1="190"
                      x2="400"
                      y2="240"
                      stroke="#9CA3AF"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Circle on curve */}
                    <circle cx="450" cy="190" r="4" fill="#9CA3AF" />
                    {/* Label text */}
                    <text
                      x="320"
                      y="247"
                      className="text-sm font-medium fill-black"
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
              className="flex flex-col justify-between min-h-[500px] relative"
            >
              {/* Top Section - Personal Tutoring Price */}
              <div className="text-right">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <div className="text-5xl font-bold text-black">
                    £500<span className="text-2xl text-gray-600">/month</span>
                  </div>
                </motion.div>

                {/* Tall Gray Bar (Pill-shaped) */}
                <motion.div
                  className="bg-gray-200 rounded-full mx-auto mb-6"
                  style={{ width: '200px', height: '280px', marginLeft: 'auto' }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6 }}
                />

                <div className="text-base text-gray-600">Personal tutoring</div>
              </div>

              {/* Middle Section - Cost Comparison Text */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-right my-8"
              >
                <h3 className="text-3xl font-bold leading-tight">
                  <span className="text-black">95% cheaper than</span>
                  <br />
                  <span style={{ color: '#0BA5E9' }}>private tutoring</span>
                </h3>
              </motion.div>

              {/* Bottom Section - Mentiora Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="text-right relative"
              >
                <div className="mb-4">
                  <div className="text-5xl font-bold text-black">
                    £24.99<span className="text-xl text-gray-600">/month</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="mb-6 px-8 py-5 rounded-full font-semibold text-base hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#0BA5E9', color: 'white' }}
                >
                  Get started
                </Button>

                <div className="flex items-center justify-end gap-2 mb-4">
                  <img 
                    src={mentioraLogo} 
                    alt="Mentiora" 
                    className="h-8 w-8"
                  />
                  <span className="text-2xl font-bold" style={{ color: '#0BA5E9' }}>mentiora</span>
                </div>

                {/* Small Dashboard Preview (bottom right corner) */}
                <motion.div
                  className="absolute bottom-0 right-0 w-48 rounded-lg overflow-hidden shadow-2xl border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 }}
                  style={{ transform: 'translateY(60px)' }}
                >
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3">
                    <div className="bg-white rounded-md p-2 mb-2">
                      <div className="h-2 bg-cyan-500 rounded w-3/4 mb-1"></div>
                      <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-red-100 rounded h-12"></div>
                      <div className="bg-blue-100 rounded h-12"></div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section 
        className="py-20 px-6"
        style={{ 
          background: 'linear-gradient(120deg, #0BA5E9, #06B6D4)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Start your journey to better grades
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already improving with Mentiora
            </p>
            <Button 
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="bg-white hover:bg-gray-50 text-lg font-semibold px-12 py-6 rounded-full shadow-lg hover:scale-105 transition-all"
              style={{ color: '#0BA5E9' }}
            >
              Try now for free
            </Button>
            <p className="text-sm text-white/80 mt-4">
              No credit card required • Get started in 60 seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={mentioraLogo} alt="Mentiora" className="h-6 w-6 brightness-0 invert" />
                <span className="text-lg font-bold">Mentiora</span>
              </div>
              <p className="text-sm text-gray-400">Personalised learning for GCSE & A-Levels</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/pricing')} className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</button></li>
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">Subjects</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">About us</button></li>
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">Careers</button></li>
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 Mentiora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
