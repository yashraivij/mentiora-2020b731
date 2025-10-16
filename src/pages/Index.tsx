import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  FileText,
  CalendarClock,
  Check,
  X as XIcon,
  Menu,
  Crown,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"GCSE" | "IGCSE" | "A-Level" | "IB">("GCSE");

  const subjects = {
    GCSE: [
      { name: "Biology", icon: "🧬", color: "#10B981" },
      { name: "Chemistry", icon: "⚗️", color: "#F59E0B" },
      { name: "Physics", icon: "⚛️", color: "#EF4444" },
      { name: "Combined Science", icon: "🔬", color: "#8B5CF6" },
      { name: "Mathematics", icon: "🔢", color: "#FBBF24" },
      { name: "English Language", icon: "📖", color: "#EC4899" },
      { name: "English Literature", icon: "📚", color: "#DB2777" },
      { name: "Computer Science", icon: "💻", color: "#3B82F6" },
      { name: "History", icon: "📜", color: "#92400E" },
      { name: "Geography", icon: "🌍", color: "#059669" },
      { name: "Business", icon: "💼", color: "#0EA5E9" },
      { name: "Economics", icon: "📈", color: "#0891B2" },
      { name: "Religious Studies", icon: "🕊️", color: "#7C3AED" },
      { name: "French", icon: "🇫🇷", color: "#2563EB" },
      { name: "Spanish", icon: "🇪🇸", color: "#DC2626" },
    ],
    IGCSE: [
      { name: "Biology", icon: "🧬", color: "#10B981" },
      { name: "Chemistry", icon: "⚗️", color: "#F59E0B" },
      { name: "Physics", icon: "⚛️", color: "#EF4444" },
      { name: "Mathematics", icon: "🔢", color: "#FBBF24" },
      { name: "English", icon: "📖", color: "#EC4899" },
    ],
    "A-Level": [
      { name: "Biology", icon: "🧬", color: "#10B981" },
      { name: "Chemistry", icon: "⚗️", color: "#F59E0B" },
      { name: "Physics", icon: "⚛️", color: "#EF4444" },
      { name: "Mathematics", icon: "🔢", color: "#FBBF24" },
      { name: "Further Mathematics", icon: "🧮", color: "#F97316" },
      { name: "English Literature", icon: "📚", color: "#DB2777" },
      { name: "Computer Science", icon: "💻", color: "#3B82F6" },
      { name: "Psychology", icon: "🧠", color: "#8B5CF6" },
      { name: "Economics", icon: "📈", color: "#0891B2" },
      { name: "Business", icon: "💼", color: "#0EA5E9" },
    ],
    IB: [
      { name: "Biology", icon: "🧬", color: "#10B981" },
      { name: "Chemistry", icon: "⚗️", color: "#F59E0B" },
      { name: "Physics", icon: "⚛️", color: "#EF4444" },
      { name: "Mathematics", icon: "🔢", color: "#FBBF24" },
      { name: "English", icon: "📖", color: "#EC4899" },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={mentioraLogo} 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold text-black flex items-center">
              Ment<Crown className="w-4 h-4 text-yellow-500 -mt-2" />ora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button className="text-base font-medium text-gray-600 hover:text-black transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0BA5E9] transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => navigate("/pricing")} className="text-base font-medium text-gray-600 hover:text-black transition-colors relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0BA5E9] transition-all group-hover:w-full"></span>
            </button>
            <button className="text-base font-medium text-gray-600 hover:text-black transition-colors relative group">
              Subjects
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0BA5E9] transition-all group-hover:w-full"></span>
            </button>
            <button className="text-base font-medium text-gray-600 hover:text-black transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0BA5E9] transition-all group-hover:w-full"></span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate("/dashboard")} style={{ backgroundColor: '#0BA5E9' }} className="text-white px-7 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="ghost" className="text-gray-600 hover:text-black font-medium">
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/register")} 
                  style={{ backgroundColor: '#0BA5E9' }}
                  className="text-white px-7 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                >
                  Try Mentiora
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-white px-6 pt-[140px] pb-[140px]">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[13px] font-bold tracking-[1.5px] text-[#0BA5E9] mb-6 uppercase">
              GCSE & A-LEVEL AI TUTOR
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[72px] font-extrabold leading-[1.1] tracking-[-0.03em] text-black mb-7"
          >
            Your revision, finally made <span className="text-[#0BA5E9]">personal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[22px] text-[#6B7280] leading-[1.6] max-w-[750px] mx-auto mb-12"
          >
            AI-powered tutoring that predicts your grades, creates personalized notes, 
            and adapts your study plan in real-time. Get 1-on-1 tutor results at 5% of the cost.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-5"
          >
            <Button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="text-[20px] font-semibold px-14 py-6 rounded-xl hover:scale-[1.02] transition-all"
              style={{ 
                backgroundColor: '#0BA5E9',
                boxShadow: '0px 8px 24px rgba(11,165,233,0.25)'
              }}
            >
              Start free trial
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-[15px] text-[#6B7280] mb-[60px]"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>No credit card required</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>50,000+ students</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>Setup in 60 seconds</span>
            </div>
          </motion.div>

          {/* University Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-[14px] text-[#6B7280] mb-6">Helping students get into</p>
            <div className="flex items-center justify-center gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="text-[24px] font-bold text-[#002147]">Oxford</div>
              <div className="text-[24px] font-bold text-[#003B5C]">Cambridge</div>
              <div className="text-[24px] font-bold text-[#003E74]">Imperial</div>
              <div className="text-[24px] font-bold text-[#500778]">UCL</div>
              <div className="text-[24px] font-bold text-[#1E3A8A]">LSE</div>
              <div className="text-[24px] font-bold text-[#D4011D]">King's</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE DO SECTION */}
      <section className="bg-[#FAFBFC] px-6 py-[120px]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-[13px] font-bold tracking-[1.5px] text-[#0BA5E9] mb-4 uppercase">
              WHAT MENTIORA DOES
            </p>
            <h2 className="text-[48px] font-bold text-black mb-5 leading-tight">
              Three features that work together
            </h2>
            <p className="text-[20px] text-[#6B7280]">
              One intelligent system that learns how you learn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Predicted Grades */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4, boxShadow: '0px 12px 32px rgba(0,0,0,0.08)' }}
            >
              <Card className="bg-white rounded-[20px] p-12 border border-[#F0F0F0] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all h-full">
                <div className="w-24 h-24 bg-[#E0F2FE] rounded-full flex items-center justify-center mb-7">
                  <Target className="w-14 h-14 text-[#0BA5E9]" />
                </div>
                <h3 className="text-[28px] font-bold text-black mb-4">
                  Predicted Grades
                </h3>
                <p className="text-[17px] leading-[1.7] text-[#374151] mb-8">
                  Know exactly where you stand. Our AI analyzes your performance across 50+ data points to predict your exam grade with 92% accuracy. Updates in real-time after every session.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Real-time predictions</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>92% accuracy rate</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Updates after every question</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Card 2: Auto-Generated Notes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4, boxShadow: '0px 12px 32px rgba(0,0,0,0.08)' }}
            >
              <Card className="bg-white rounded-[20px] p-12 border border-[#F0F0F0] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all h-full">
                <div className="w-24 h-24 bg-[#FEF3C7] rounded-full flex items-center justify-center mb-7">
                  <FileText className="w-14 h-14 text-[#F59E0B]" />
                </div>
                <h3 className="text-[28px] font-bold text-black mb-4">
                  Auto-Generated Notes
                </h3>
                <p className="text-[17px] leading-[1.7] text-[#374151] mb-8">
                  Stop wasting time writing summaries. Mentiora creates personalized notes automatically as you study, focused on your weak areas and written at your comprehension level.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Saves 14+ hours monthly</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Personalized to your level</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Focused on weak topics</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Card 3: Smart Planner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4, boxShadow: '0px 12px 32px rgba(0,0,0,0.08)' }}
            >
              <Card className="bg-white rounded-[20px] p-12 border border-[#F0F0F0] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all h-full">
                <div className="w-24 h-24 bg-[#DBEAFE] rounded-full flex items-center justify-center mb-7">
                  <CalendarClock className="w-14 h-14 text-[#3B82F6]" />
                </div>
                <h3 className="text-[28px] font-bold text-black mb-4">
                  Adaptive Study Planner
                </h3>
                <p className="text-[17px] leading-[1.7] text-[#374151] mb-8">
                  Your perfect week, automatically planned. Our AI creates and continuously adapts your study schedule based on your performance, peak focus times, and exam dates.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Adapts in real-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Optimizes for your schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Spaced repetition built-in</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW PERSONALIZATION WORKS */}
      <section className="bg-white px-6 py-[120px]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-[13px] font-bold tracking-[1.5px] text-[#0BA5E9] mb-4 uppercase">
              PERSONALIZATION ENGINE
            </p>
            <h2 className="text-[48px] font-bold text-black mb-5 leading-tight">
              Learning that adapts to you
            </h2>
            <p className="text-[20px] text-[#6B7280]">
              Every question you answer makes Mentiora smarter about how you learn
            </p>
          </motion.div>

          {/* Before & After Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Without Personalization */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-[#F9FAFB] rounded-[20px] p-12 border border-[#E5E7EB] h-full">
                <div className="inline-block bg-[#9CA3AF] text-white px-3 py-1.5 rounded-md text-[12px] font-semibold mb-6">
                  Without Personalization
                </div>
                <div className="text-[48px] mb-5 grayscale opacity-60">📚</div>
                <h3 className="text-[24px] font-bold text-black mb-5">
                  One-size-fits-all approach
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-2 text-[16px] text-[#374151]">
                    <XIcon className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>Same content for everyone</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-[#374151]">
                    <XIcon className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>No adaptation to your pace</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-[#374151]">
                    <XIcon className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>Generic study schedules</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-[#374151]">
                    <XIcon className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>Guess your current grade</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-[#374151]">
                    <XIcon className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>Manual note-taking required</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* With Mentiora */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card 
                className="rounded-[20px] p-12 border-2 h-full"
                style={{ 
                  background: 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%)',
                  borderColor: '#0BA5E9',
                  boxShadow: '0px 8px 32px rgba(11,165,233,0.15)'
                }}
              >
                <div className="inline-block text-white px-3 py-1.5 rounded-md text-[12px] font-semibold mb-6" style={{ backgroundColor: '#0BA5E9' }}>
                  Personalized Learning
                </div>
                <div className="text-[48px] mb-5">✨</div>
                <h3 className="text-[24px] font-bold text-black mb-5">
                  Tailored to your learning
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-2 text-[16px] text-black">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Content adapts to your level</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-black">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Accelerates when you're strong</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-black">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Extra support when you struggle</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-black">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>92% accurate grade predictions</span>
                  </div>
                  <div className="flex items-start gap-2 text-[16px] text-black">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Auto-generated personalized notes</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F0F9FF] rounded-[16px] p-12 max-w-[1100px] mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-[32px] mb-2">📈</div>
                <div className="text-[56px] font-black text-[#0BA5E9] leading-none mb-2">
                  +1.8
                </div>
                <div className="text-[16px] text-[#6B7280]">
                  Average grade improvement
                </div>
              </div>
              <div className="text-center">
                <div className="text-[32px] mb-2">⚡</div>
                <div className="text-[56px] font-black text-[#0BA5E9] leading-none mb-2">
                  14.7h
                </div>
                <div className="text-[16px] text-[#6B7280]">
                  Time saved per month
                </div>
              </div>
              <div className="text-center">
                <div className="text-[32px] mb-2">🎯</div>
                <div className="text-[56px] font-black text-[#0BA5E9] leading-none mb-2">
                  92%
                </div>
                <div className="text-[16px] text-[#6B7280]">
                  Prediction accuracy
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SUBJECTS & EXAM BOARDS */}
      <section className="bg-white px-6 py-[120px]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[13px] font-bold tracking-[1.5px] text-[#0BA5E9] mb-4 uppercase">
              CURRICULUM COVERAGE
            </p>
            <h2 className="text-[48px] font-bold text-black mb-5 leading-tight">
              Built for your exact exam board
            </h2>
            <p className="text-[20px] text-[#6B7280] max-w-[800px] mx-auto">
              Unlike generic AI tutors, Mentiora is trained on specific exam board syllabuses and mark schemes
            </p>
          </motion.div>

          {/* Tab Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex bg-[#F3F4F6] rounded-xl p-1.5">
              {(["GCSE", "IGCSE", "A-Level", "IB"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-lg text-[16px] font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[#6B7280] hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Subject Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8"
          >
            {subjects[activeTab].map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: '#0BA5E9',
                  boxShadow: '0px 4px 12px rgba(11,165,233,0.15)'
                }}
                className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-3 cursor-pointer transition-all"
                onClick={() => navigate('/register')}
              >
                <div className="text-[32px]">{subject.icon}</div>
                <div className="text-[16px] font-semibold text-black">{subject.name}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/register')}
              className="text-[16px] font-medium text-[#0BA5E9] hover:underline inline-flex items-center gap-1 group"
            >
              View all subjects
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING COMPARISON */}
      <section className="bg-[#FAFBFC] px-6 py-[120px]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-[13px] font-bold tracking-[1.5px] text-[#0BA5E9] mb-4 uppercase">
              PRICING
            </p>
            <h2 className="text-[48px] font-bold text-black mb-5 leading-tight">
              Premium tutoring at <span className="text-[#0BA5E9]">5% of the cost</span>
            </h2>
            <p className="text-[20px] text-[#6B7280]">
              Get better results than private tutoring for a fraction of the price
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Effectiveness Graph */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-[36px] font-bold text-[#0BA5E9] mb-8 leading-tight">
                68% better grade improvement
              </h3>
              <Card className="bg-white rounded-[20px] p-12 border border-[#E5E7EB] shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
                <div className="relative h-[300px]">
                  {/* Y-axis label */}
                  <div className="absolute -left-2 top-0 text-[14px] text-[#6B7280] font-medium">
                    Grade achieved
                  </div>
                  
                  {/* Mentiora curve */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                    <path
                      d="M 0 250 Q 100 150, 200 80 T 400 20"
                      fill="none"
                      stroke="#0BA5E9"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-8 right-8 text-[14px] font-semibold text-[#0BA5E9] flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0BA5E9]"></div>
                    With Mentiora
                  </div>

                  {/* Traditional curve */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                    <path
                      d="M 0 250 Q 100 200, 200 160 T 400 120"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-32 right-8 text-[14px] font-medium text-[#6B7280] flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#9CA3AF]"></div>
                    Traditional tutoring
                  </div>

                  {/* X-axis label */}
                  <div className="absolute bottom-0 right-0 text-[14px] text-[#6B7280] font-medium">
                    Study hours
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right: Price Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Traditional Tutoring Card */}
              <Card className="bg-white rounded-[16px] p-8 border border-[#E5E7EB]">
                <div className="text-[14px] text-[#6B7280] uppercase tracking-wide mb-3">
                  Private Tutoring
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[64px] font-extrabold text-black leading-none">£500</span>
                  <span className="text-[24px] text-[#6B7280]">/month</span>
                </div>
                <div className="border-t border-[#E5E7EB] my-4"></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>4 hours per month</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Fixed schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Generic curriculum</span>
                  </div>
                </div>
              </Card>

              {/* Savings Banner */}
              <div 
                className="rounded-xl p-4 text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #0BA5E9 100%)',
                  boxShadow: '0px 4px 16px rgba(11,165,233,0.3)'
                }}
              >
                <span className="text-[20px] font-bold text-white">Save 95% →</span>
              </div>

              {/* Mentiora Card */}
              <Card 
                className="rounded-[16px] p-8 border-2"
                style={{ 
                  background: 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%)',
                  borderColor: '#0BA5E9'
                }}
              >
                <div className="text-[14px] text-[#0BA5E9] font-bold uppercase tracking-wide mb-3">
                  Mentiora
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[64px] font-extrabold text-black leading-none">£25</span>
                  <span className="text-[24px] text-[#6B7280]">/month</span>
                </div>
                <div className="border-t border-[#0BA5E9] my-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[15px] text-black">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Unlimited 24/7 access</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-black">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Adapts to your schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-black">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Board-specific content</span>
                  </div>
                  <div className="flex items-center gap-2 text-[15px] text-black">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>Grade predictions + auto-notes</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/register')}
                  className="w-full py-6 text-[16px] font-semibold rounded-lg hover:scale-[1.02] transition-all"
                  style={{ backgroundColor: '#0BA5E9' }}
                >
                  Start free trial
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-6 py-[120px]">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[56px] font-extrabold text-black mb-6 leading-tight">
              Ready to transform your revision?
            </h2>
            <p className="text-[22px] text-[#6B7280] mb-10 leading-relaxed">
              Join 50,000+ students achieving their target grades with personalized AI tutoring
            </p>
            <Button
              onClick={() => navigate('/register')}
              className="text-[20px] font-semibold px-14 py-6 rounded-xl hover:scale-[1.02] transition-all"
              style={{ 
                backgroundColor: '#0BA5E9',
                boxShadow: '0px 8px 24px rgba(11,165,233,0.25)'
              }}
            >
              Start free trial
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111827] text-white px-6 py-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={mentioraLogo} 
                  alt="Mentiora" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold flex items-center">
                  Ment<Crown className="w-4 h-4 text-yellow-500 -mt-2" />ora
                </span>
              </div>
              <p className="text-[14px] text-[#9CA3AF]">
                AI-powered personalized tutoring for GCSE & A-Level students
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-wide mb-4">Product</h4>
              <div className="space-y-2">
                <button onClick={() => navigate('/register')} className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Features</button>
                <button onClick={() => navigate('/pricing')} className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Pricing</button>
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Subjects</button>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-wide mb-4">Company</h4>
              <div className="space-y-2">
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">About</button>
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Contact</button>
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Careers</button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-wide mb-4">Legal</h4>
              <div className="space-y-2">
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Privacy</button>
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Terms</button>
                <button className="block text-[14px] text-[#9CA3AF] hover:text-white transition-colors">Cookie Policy</button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#374151] pt-8 text-center">
            <p className="text-[14px] text-[#9CA3AF]">
              © 2025 Mentiora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;