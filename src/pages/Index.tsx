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
        <div className="max-w-[1100px] mx-auto w-full relative">
          {/* Floating Element 1 - Top Left: Sticky Note with Checkmark */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute top-[-40px] left-[-100px] hidden lg:block z-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Yellow Sticky Note */}
              <div 
                className="relative w-[180px] h-[180px] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-5"
                style={{
                  backgroundColor: '#fef08a',
                  transform: 'rotate(-8deg)'
                }}
              >
                {/* Pin */}
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 text-2xl">📌</div>
                
                {/* Handwritten text */}
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'Caveat, cursive', color: '#000' }}>
                  Study your weakest topics to master every concept on your syllabus.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 2 - Center Top: Mentiora Logo (visible on all screens) */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute top-[-30px] md:top-[-60px] left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] bg-white rounded-[15px] md:rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-3 md:p-5 flex items-center justify-center">
                <img 
                  src={mentioraLogo} 
                  alt="Mentiora" 
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element - Mobile Sticky Note (visible on mobile/tablet only) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="absolute bottom-[-60px] left-[10px] md:bottom-[-80px] md:left-[20px] block lg:hidden z-10"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <div 
                className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.1)] p-3"
                style={{
                  backgroundColor: '#fef08a',
                  transform: 'rotate(-5deg)'
                }}
              >
                <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 text-lg">📌</div>
                <p className="text-xs leading-relaxed" style={{ fontFamily: 'Caveat, cursive', color: '#000' }}>
                  Master every concept on your syllabus.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Element 3 - Top Right: Study Insights (Real Dashboard Component) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="absolute top-[-20px] right-[-140px] hidden lg:block z-10"
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
            className="absolute bottom-[-80px] left-[-100px] hidden lg:block z-10"
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
                        <p className="text-[10px] text-gray-500">15 mins • Current: 8%</p>
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
                        <p className="text-[10px] text-gray-500">15 mins • Current: 8%</p>
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
            className="absolute bottom-[-100px] right-[-120px] hidden lg:block z-10"
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
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: '78%' }}
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
          <div className="text-center relative z-20 py-16 md:py-12 px-4">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-4xl md:text-5xl lg:text-6xl"
              style={{
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              <span className="block" style={{ color: '#000000' }}>
                Learn, practice, and improve
              </span>
              <span className="block" style={{ color: '#b0b0b0' }}>
                all in one place
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
              AI-powered tutoring that predicts your grades and personalizes your learning.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="px-8 py-3.5 text-base font-semibold transition-all duration-200 w-full md:w-auto"
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(37, 99, 235, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onClick={() => navigate(user ? '/dashboard' : '/register')}
              >
                Get free demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEMO VIDEO SECTION */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              See Mentiora in action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how Mentiora adapts to your learning style and helps you achieve your target grades
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-card border border-border">
              <video
                className="w-full aspect-video"
                controls
                poster="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png"
              >
                <source src="/demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Decorative elements around video */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
          </motion.div>

          {/* Quick Stats Below Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">92%</div>
              <div className="text-muted-foreground">Grade prediction accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">14.7h</div>
              <div className="text-muted-foreground">Average time saved per month</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+1.8</div>
              <div className="text-muted-foreground">Average grade improvement</div>
            </div>
          </motion.div>
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

      {/* SUBJECT CARDS SECTION */}
      <section className="py-24 px-6" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: "📐",
                title: "GCSE Maths",
                description: "Get step-by-step guidance to solve maths problems.",
              },
              {
                icon: "✏️",
                title: "GCSE English",
                description: "Learn how to structure your answers for each question.",
              },
              {
                icon: "🔬",
                title: "GCSE Science",
                description: "Apply your knowledge in 'Explain', and 'Suggest' questions.",
              }
            ].map((subject, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <CardContent className="p-10">
                    <div className="text-5xl mb-6">{subject.icon}</div>
                    <h3 className="text-2xl font-bold text-black mb-4">{subject.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed mb-6">{subject.description}</p>
                    <button 
                      style={{ color: '#0BA5E9' }}
                      className="font-semibold text-base hover:underline inline-flex items-center group"
                    >
                      Try it now 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TOPIC PRACTICE QUESTION SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              See how <span style={{ color: '#0BA5E9' }}>questions are marked</span>
            </h2>
            <p className="text-lg text-gray-600">
              Answer topic-based questions and get instant, detailed feedback
            </p>
          </motion.div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start max-w-6xl mx-auto">
            {/* Left Pane: Question Sheet */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
                {/* Question Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      {/* Question reference numbers */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-1">
                          <span className="inline-block border-2 border-black px-3 py-1 text-base font-mono font-semibold text-black">0</span>
                          <span className="inline-block border-2 border-black px-3 py-1 text-base font-mono font-semibold text-black">1</span>
                        </div>
                      </div>
                      
                      {/* Question text */}
                      <p className="text-base text-black leading-relaxed mb-2">
                        Explain why increasing light intensity increases the rate of photosynthesis.
                      </p>
                    </div>
                    
                    {/* Marks pill */}
                    <div className="text-sm font-semibold text-black whitespace-nowrap">
                      [3 marks]
                    </div>
                  </div>
                </div>

                {/* Answer area */}
                <div className="min-h-[400px] mb-6">
                  <Textarea 
                    placeholder=""
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full h-[400px] border-2 border-gray-200 rounded-lg p-4 resize-none focus:border-[#0BA5E9] focus:ring-1 focus:ring-[#0BA5E9] text-base text-black font-medium leading-relaxed"
                    disabled={isAnswerSubmitted}
                  />
                </div>

                {/* Bottom action area */}
                {!isAnswerSubmitted && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        if (userAnswer.trim()) {
                          setIsAnswerSubmitted(true);
                        }
                      }}
                      disabled={!userAnswer.trim()}
                      style={{ backgroundColor: '#0BA5E9' }}
                      className="text-white rounded-full px-10 py-6 font-semibold text-base disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Check answer
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Pane: Ask mentiora */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="flex flex-col h-[600px]"
            >
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-base font-semibold text-black">Ask mentiora</h2>
              </div>

              {/* Chat messages or feedback */}
              <div className="flex-1 overflow-auto mb-4 space-y-3 rounded-lg bg-gray-50 p-4">
                {!isAnswerSubmitted ? (
                  <div className="flex flex-col h-full">
                    <div className="flex-1" />
                    <div className="space-y-3">
                      <button
                        className="w-full text-left text-sm text-black hover:text-black/90 p-3 rounded-lg hover:bg-white transition-colors"
                      >
                        I don&apos;t understand this problem
                      </button>
                      <button
                        className="w-full text-left text-sm text-black hover:text-black/90 p-3 rounded-lg hover:bg-white transition-colors"
                      >
                        Can you walk me through this step by step
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-[20px] p-4 text-sm text-black font-medium max-w-[80%]">
                        You got 2 out of 3 marks for this question.
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-[20px] p-4 text-sm text-black font-medium max-w-[80%]">
                        Let&apos;s go through it together.
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-[20px] p-4 text-sm text-black font-medium max-w-[80%]">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-semibold text-green-900">Light provides energy</p>
                              <p className="text-green-700 mt-1">✓ Correct - Light energy is needed for photosynthesis</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-semibold text-green-900">Rate increases</p>
                              <p className="text-green-700 mt-1">✓ Correct - More light increases reaction rate</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-semibold text-red-900">Missing point</p>
                              <p className="text-red-700 mt-1">✗ You needed to mention that chlorophyll absorbs light energy</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-[20px] p-4 text-sm text-black font-medium max-w-[80%]">
                        Good explanation! To get full marks, remember to mention that <strong>chlorophyll in the chloroplasts absorbs light energy</strong> and converts it into chemical energy.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply input at bottom */}
              <div className="flex gap-2">
                <Input
                  placeholder="Reply"
                  className="h-11 px-4 flex-1 border border-gray-300 focus:ring-1 focus:ring-[#0BA5E9] focus:border-[#0BA5E9] rounded-lg text-sm"
                  disabled={!isAnswerSubmitted}
                />
                <Button 
                  disabled={!isAnswerSubmitted}
                  style={{ backgroundColor: '#0BA5E9' }}
                  className="h-11 w-11 p-0 rounded-full text-white flex items-center justify-center disabled:opacity-50 hover:opacity-90"
                >
                  <Send className="h-4 w-4 rotate-45" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* CIRCULAR FEEDBACK LOOP PERSONALIZATION SECTION */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#00B4D8' }}>
              HOW PERSONALIZATION WORKS
            </div>
            <h2 className="text-5xl font-extrabold leading-tight mb-5">
              <span className="text-black">A learning system that</span>
              <br />
              <span style={{ color: '#00B4D8' }}>never stops improving</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Every question you answer makes Mentiora smarter about how you learn.
              <br />Watch how the cycle works.
            </p>
          </div>

          {/* Main Circular Graphic */}
          <div 
            className="rounded-3xl p-20 relative min-h-[700px] mb-16"
            style={{ 
              background: 'radial-gradient(circle at center, #E6F7FF 0%, #FFFFFF 100%)'
            }}
          >
            {/* Central Hub */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full flex flex-col items-center justify-center border-4 border-white shadow-2xl z-10"
              style={{ 
                background: 'linear-gradient(135deg, #00B4D8, #0284C7)'
              }}
              animate={{ 
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain className="w-12 h-12 text-white mb-2" />
              <div className="text-lg font-bold text-white">AI Engine</div>
              <div className="text-xs text-white/80">Learning about you</div>
            </motion.div>

            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="lineGradient">
                  <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Lines connecting nodes to center */}
              <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="85%" y1="50%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="50%" y1="85%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="8 4" />
            </svg>

            {/* Node 1: You Study (Top) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-60 bg-white rounded-2xl p-7 shadow-xl border-2"
              style={{ borderColor: '#E0F2FE' }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-xs font-bold tracking-wider text-gray-500 mb-2">STEP 1</div>
              <h3 className="text-xl font-bold text-black mb-2">You Study</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Answer questions across your syllabus topics
              </p>
              <div className="bg-cyan-50 rounded-lg px-3 py-2 text-xs text-gray-700">
                ✓ 12 questions answered today
              </div>
            </motion.div>

            {/* Node 2: Data Collected (Right) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 w-60 bg-white rounded-2xl p-7 shadow-xl border-2"
              style={{ borderColor: '#E0F2FE' }}
              whileHover={{ x: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-xs font-bold tracking-wider text-gray-500 mb-2">STEP 2</div>
              <h3 className="text-xl font-bold text-black mb-2">Data Collected</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                We track accuracy, speed, patterns, and weak areas
              </p>
              <div className="flex gap-2">
                <div className="bg-cyan-50 rounded-lg px-2 py-1 text-xs">78%</div>
                <div className="bg-cyan-50 rounded-lg px-2 py-1 text-xs">2.3m</div>
                <div className="bg-cyan-50 rounded-lg px-2 py-1 text-xs">12 topics</div>
              </div>
            </motion.div>

            {/* Node 3: AI Analyzes (Bottom) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 bg-white rounded-2xl p-7 shadow-xl border-2"
              style={{ borderColor: '#E0F2FE' }}
              whileHover={{ y: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="text-xs font-bold tracking-wider text-gray-500 mb-2">STEP 3</div>
              <h3 className="text-xl font-bold text-black mb-2">AI Analyzes</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Machine learning identifies your learning patterns
              </p>
              <motion.div 
                className="text-xs font-semibold"
                style={{ color: '#00B4D8' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Processing 50+ data points...
              </motion.div>
            </motion.div>

            {/* Node 4: Personalized Output (Left) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 w-60 bg-white rounded-2xl p-7 shadow-xl border-2"
              style={{ borderColor: '#E0F2FE' }}
              whileHover={{ x: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <div className="text-xs font-bold tracking-wider text-gray-500 mb-2">STEP 4</div>
              <h3 className="text-xl font-bold text-black mb-2">You Get Results</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Predicted grades, auto-notes, adapted study plan
              </p>
              <div className="space-y-2">
                <div className="bg-cyan-100 rounded-md px-3 py-1 text-xs font-semibold" style={{ color: '#00B4D8' }}>
                  Grade 7
                </div>
                <div className="bg-purple-100 rounded-md px-3 py-1 text-xs font-semibold text-purple-700">
                  14h saved
                </div>
                <div className="bg-orange-100 rounded-md px-3 py-1 text-xs font-semibold text-orange-700">
                  7 days planned
                </div>
              </div>
            </motion.div>

            {/* Cycle Completion Arrow */}
            <div className="absolute top-8 left-12">
              <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  🔄 <span>Cycle repeats continuously</span>
                </div>
              </div>
            </div>

            {/* Floating Info Badges */}
            <motion.div
              className="absolute top-16 right-12 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-200 flex items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span>⚡</span>
              <span className="text-sm text-gray-700">Updates after every session</span>
            </motion.div>

            <motion.div
              className="absolute bottom-24 right-8 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-200 flex items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span>🎯</span>
              <span className="text-sm text-gray-700">92% prediction accuracy</span>
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-8 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-200 flex items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <span>🔄</span>
              <span className="text-sm text-gray-700">Real-time adaptation</span>
            </motion.div>
          </div>

          {/* Expandable "How It Works" Section */}
          <div className="bg-gray-50 rounded-2xl p-10 max-w-4xl mx-auto mb-20">
            <button
              onClick={() => setExpandedSection(!expandedSection)}
              className="w-full flex items-center justify-between text-left hover:opacity-80 transition-opacity"
            >
              <span className="text-base font-semibold text-black flex items-center gap-2">
                🔍 See detailed breakdown of each step
              </span>
              <motion.span
                animate={{ rotate: expandedSection ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-2xl"
              >
                →
              </motion.span>
            </button>

            {expandedSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 space-y-4"
              >
                {[
                  {
                    title: '1. You Study',
                    content: `As you practice with Mentiora, you answer questions across all your syllabus topics. We don't just check if you're right or wrong—we measure:\n\n• How long you take to answer\n• Which topics you attempt first\n• Your consistency across similar questions\n• Patterns in your mistakes`
                  },
                  {
                    title: '2. Data Collected',
                    content: `Every interaction generates data. We collect over 50 data points per session:\n\n• Topic-specific accuracy rates\n• Answer speed and hesitation patterns\n• Common error types\n• Time of day performance\n• Retention rates over time\n\nAll data is encrypted and used solely to personalize your learning.`
                  },
                  {
                    title: '3. AI Analyzes',
                    content: `Our machine learning models process your data in real-time:\n\n• Compare your performance to 100,000+ historical student patterns\n• Identify which topics you struggle with and why\n• Predict your current grade with 92% accuracy\n• Calculate optimal study schedules based on your focus patterns\n• Determine which explanations work best for your learning style`
                  },
                  {
                    title: '4. You Get Results',
                    content: `Personalization happens automatically across three key areas:\n\n• Grade Predictions: Know exactly where you stand (updated after each session)\n• Auto-Notes: Get personalized notes focused on YOUR weak areas\n• Smart Planner: Your weekly schedule adapts based on what you need most practice with\n\nThe best part? This cycle runs continuously. Every question you answer makes your experience more personalized.`
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedAccordion(expandedAccordion === index ? null : index)}
                      className="w-full px-6 py-4 text-left font-bold text-black hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      {item.title}
                      <motion.span
                        animate={{ rotate: expandedAccordion === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </button>
                    {expandedAccordion === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-6 pb-5"
                      >
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Stats Section */}
          <div className="text-center mb-20">
            <h3 className="text-3xl font-bold text-black mb-12">
              The results speak for themselves
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: '🎯', number: '92%', label: 'Prediction accuracy' },
                { icon: '⚡', number: '14.7h', label: 'Avg time saved monthly' },
                { icon: '📈', number: '+1.8', label: 'Grade improvement' },
                { icon: '🔄', number: '1000+', label: 'Adaptations per student' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-5xl font-black mb-2" style={{ color: '#00B4D8' }}>
                    {stat.number}
                  </div>
                  <div className="text-base text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 text-center shadow-xl max-w-3xl mx-auto"
            style={{ background: 'linear-gradient(90deg, #00B4D8, #0284C7)' }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready for learning that adapts to you?
            </h3>
            <p className="text-lg text-white/90 mb-8">
              Join 50,000+ students experiencing personalized AI learning
            </p>
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="bg-white hover:bg-gray-50 text-lg font-semibold px-12 py-6 rounded-full hover:scale-105 transition-all"
              style={{ color: '#00B4D8' }}
            >
              Start your free trial
            </Button>
            <p className="text-sm text-white/80 mt-4">
              No credit card • Setup in 60 seconds
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
