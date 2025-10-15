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
  Send
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

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {/* Partner Logos */}
            <div className="flex items-center justify-center gap-12 mb-16 opacity-60">
              <div className="text-sm font-medium text-gray-500">Microsoft for Startups</div>
              <div className="text-sm font-medium text-gray-500 bg-purple-600 text-white px-3 py-1">UKRI Innovate UK</div>
              <div className="text-sm font-medium text-gray-500">Google for Startups</div>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-extrabold text-black leading-tight mb-6 tracking-tight">
              Your revision, finally<br />
              <span style={{ color: '#0BA5E9' }}>made personal</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Mentiora teaches you how to answer every question
              in your exams to get full marks.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              style={{ 
                backgroundColor: '#0BA5E9',
                boxShadow: '0px 4px 12px rgba(11, 165, 233, 0.3)'
              }}
              className="text-white text-lg font-semibold px-12 py-6 rounded-full hover:scale-105 transition-all mb-3"
            >
              Try now for free
            </Button>

            <p className="text-sm text-gray-400">No credit card required</p>
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

      {/* INTERACTIVE PERSONALIZATION SECTION */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Two-Column Header */}
          <div className="grid lg:grid-cols-[60%_40%] gap-12 mb-16">
            {/* Left Column */}
            <div>
              <div className="inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: '#E6F7FF', color: '#00B4D8' }}>
                HOW IT WORKS
              </div>
              <h2 className="text-5xl font-extrabold text-black leading-tight mb-5">
                Three features.<br />
                <span style={{ color: '#00B4D8' }}>One adaptive brain.</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Mentiora analyzes how you learn and automatically personalizes your entire study experience. No setup required.
              </p>
            </div>

            {/* Right Column - Animated Illustration */}
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
                  <Brain className="w-32 h-32" style={{ color: '#00B4D8' }} />
                  {/* Animated nodes */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-12 right-12 w-4 h-4 rounded-full"
                    style={{ backgroundColor: '#00B4D8' }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-16 left-8 w-4 h-4 rounded-full"
                    style={{ backgroundColor: '#9333EA' }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute top-20 left-16 w-4 h-4 rounded-full"
                    style={{ backgroundColor: '#00B4D8' }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="mt-16">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-gray-100 rounded-2xl p-2 gap-2">
                {[
                  { id: 'grades', label: 'Grade Predictions', icon: '🎯' },
                  { id: 'notes', label: 'Auto-Notes', icon: '📝' },
                  { id: 'planner', label: 'Smart Planner', icon: '📅' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      const section = document.getElementById(`tab-${tab.id}`);
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 ${
                      true ? 'bg-white text-black shadow-md' : 'bg-transparent text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab 1: Grade Predictions */}
            <div id="tab-grades" className="mb-20">
              <div 
                className="rounded-3xl p-16 min-h-[600px] border border-gray-200 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #E6F7FF 0%, #FFFFFF 100%)' }}
              >
                <div className="grid lg:grid-cols-[40%_60%] gap-16 items-center">
                  {/* Left - Explanation */}
                  <div>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-5" style={{ backgroundColor: '#E6F7FF' }}>
                      🎯
                    </div>
                    <h3 className="text-4xl font-bold text-black mb-4">
                      Always know where you stand
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                      Our AI constantly analyzes your performance—accuracy, speed, consistency—to predict your exam grade with 92% accuracy. No guessing, just data.
                    </p>
                    
                    <div className="space-y-3">
                      {[
                        'Updates after every question',
                        'Tracks 50+ performance metrics',
                        'Compares to 100K+ student data',
                        'Predicts grade boundaries'
                      ].map((point, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-base text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right - Interactive Visual */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-10 shadow-2xl"
                  >
                    <div className="flex items-center gap-2 mb-8">
                      <FlaskConical className="w-5 h-5" style={{ color: '#00B4D8' }} />
                      <span className="font-bold text-lg">Chemistry (AQA)</span>
                    </div>

                    {/* Circular Progress */}
                    <div className="flex justify-center mb-8">
                      <div className="relative w-56 h-56">
                        <svg className="transform -rotate-90 w-56 h-56">
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            stroke="#E5E7EB"
                            strokeWidth="12"
                            fill="none"
                          />
                          <motion.circle
                            cx="112"
                            cy="112"
                            r="100"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 628" }}
                            whileInView={{ strokeDasharray: "439 628" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#00B4D8" />
                              <stop offset="100%" stopColor="#0284C7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-sm text-gray-500 mb-1">Your Grade</div>
                          <motion.div 
                            className="text-7xl font-extrabold text-black"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            7
                          </motion.div>
                          <div className="text-sm text-gray-500 mt-1">Target: Grade 9</div>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Prediction Confidence</span>
                        <span className="text-sm font-bold text-black">92%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #10B981, #00B4D8)' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: '92%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: '↗ +1.2', sub: 'Last 7 days' },
                        { label: '⚡ 89%', sub: 'Accuracy' },
                        { label: '📊 12/15', sub: 'Topics strong' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="font-bold text-sm text-black">{stat.label}</div>
                          <div className="text-xs text-gray-600">{stat.sub}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Tab 2: Auto-Notes */}
            <div id="tab-notes" className="mb-20">
              <div 
                className="rounded-3xl p-16 min-h-[600px] border border-gray-200 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)' }}
              >
                <div className="grid lg:grid-cols-[40%_60%] gap-16 items-start">
                  {/* Left - Explanation */}
                  <div>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-5" style={{ backgroundColor: '#FAE8FF' }}>
                      📝
                    </div>
                    <h3 className="text-4xl font-bold text-black mb-4">
                      Notes that write themselves
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                      As you study, Mentiora generates personalized notes automatically. Focused on what you need to know, written in a way you understand. Stop wasting time on summaries.
                    </p>
                    
                    <div 
                      className="rounded-xl p-6 text-white"
                      style={{ background: 'linear-gradient(135deg, #9333EA, #EC4899)' }}
                    >
                      <div className="text-2xl font-bold">⚡ 14 hours saved this month</div>
                    </div>
                  </div>

                  {/* Right - Visual Comparison */}
                  <div>
                    {/* Split Comparison */}
                    <div className="grid grid-cols-2 rounded-2xl overflow-hidden shadow-xl mb-6">
                      {/* Traditional */}
                      <div className="bg-gray-100 p-8">
                        <div className="text-sm font-semibold text-gray-500 mb-4">Manual Notes</div>
                        <div className="text-4xl font-bold text-gray-400 mb-4">3h 45m</div>
                        <div className="text-2xl mb-4">😰</div>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Time-consuming</li>
                          <li>• Often incomplete</li>
                          <li>• Hard to review</li>
                        </ul>
                      </div>

                      {/* With Mentiora */}
                      <div className="p-8" style={{ background: 'linear-gradient(135deg, #E6F7FF, #FFFFFF)' }}>
                        <div className="text-sm font-semibold mb-4" style={{ color: '#00B4D8' }}>Auto-Notes</div>
                        <div className="text-4xl font-bold mb-4" style={{ color: '#00B4D8' }}>12m</div>
                        <div className="text-2xl mb-4">✨</div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Instant generation</li>
                          <li>• Personalized to you</li>
                          <li>• AI-organized</li>
                        </ul>
                      </div>
                    </div>

                    {/* Sample Note Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white border-2 rounded-xl p-6 shadow-lg"
                      style={{ borderColor: '#00B4D8' }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-lg text-black">Chemical Bonding - Your Notes</div>
                        <div className="text-xs text-gray-500">Generated 2 mins ago</div>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Strong Areas
                          </div>
                          <ul className="text-gray-700 space-y-1 ml-6">
                            <li>• Ionic bonding formation</li>
                            <li>• Simple molecular structures</li>
                          </ul>
                        </div>

                        <div>
                          <div className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Review This
                          </div>
                          <ul className="text-gray-700 space-y-1 ml-6">
                            <li>• Metallic bonding (you got 2/5 questions wrong)</li>
                            <li>• Intermolecular forces</li>
                          </ul>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="font-semibold text-black mb-2">Key Takeaways:</div>
                          <p className="text-gray-700 leading-relaxed">
                            Ionic bonds form between metals and non-metals through electron transfer. 
                            You're struggling with metallic bonding - focus on the "sea of electrons" concept.
                          </p>
                        </div>

                        <div className="text-xs" style={{ color: '#00B4D8' }}>
                          📚 Suggested Practice: Questions 12-15, Topic 3.2
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab 3: Smart Planner */}
            <div id="tab-planner" className="mb-20">
              <div 
                className="rounded-3xl p-16 min-h-[600px] border border-gray-200 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)' }}
              >
                {/* Centered Intro */}
                <div className="text-center mb-12">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mx-auto mb-5" style={{ backgroundColor: '#FFEDD5' }}>
                    📅
                  </div>
                  <h3 className="text-4xl font-bold text-black mb-4">
                    Your week, perfectly planned
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    Mentiora builds your study schedule automatically and adapts it in real-time. 
                    If you're acing a topic, we move you forward. Struggling? We add targeted practice.
                  </p>
                </div>

                {/* Weekly Planner Interface */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <div className="font-bold text-lg">Your Adaptive Plan</div>
                    <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-black">←</button>
                      <span className="font-semibold">Oct 14-20</span>
                      <button className="text-gray-400 hover:text-black">→</button>
                    </div>
                    <div className="px-4 py-1.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: '#00B4D8' }}>
                      2.5h total
                    </div>
                  </div>

                  {/* Day Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Monday */}
                    <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-green-500">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-sm">Monday, Oct 14</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#E6F7FF', color: '#00B4D8' }}>
                          45 min
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">9:00 AM - Chemistry</div>
                          <div className="font-semibold text-sm text-black mb-2">Ionic Bonding Practice</div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-0.5">
                              {[1, 2, 0].map((filled, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-black' : 'bg-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                              Completed ✓
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tuesday - With Adaptation Badge */}
                    <div className="bg-gray-50 rounded-xl p-5 border-l-4 relative" style={{ borderLeftColor: '#00B4D8' }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                      >
                        ⚡ Plan adjusted!
                      </motion.div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-sm">Tuesday, Oct 15</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#E6F7FF', color: '#00B4D8' }}>
                          50 min
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3 border-2" style={{ borderColor: '#00B4D8' }}>
                        <div className="text-xs text-gray-600 mb-1">6:30 PM - Biology</div>
                        <div className="font-semibold text-sm text-black mb-2">Cell Structure Deep Dive</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-0.5">
                            {[1, 1, 1].map((filled, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-black' : 'bg-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#E6F7FF', color: '#00B4D8' }}>
                            Up next
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">🎯 Peak focus time</div>
                      </div>
                    </div>

                    {/* Wednesday */}
                    <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-orange-500">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-sm">Wednesday, Oct 16</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#E6F7FF', color: '#00B4D8' }}>
                          55 min
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="text-xs text-gray-600 mb-1">4:00 PM - Computer Science</div>
                        <div className="font-semibold text-sm text-black mb-2">Algorithms Deep Dive</div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {[1, 1, 1].map((filled, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-black' : 'bg-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                            Advanced
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">You mastered basics faster</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="mt-6 pt-6 border-t text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>🔄</span>
                      <span>Plans adapt after every study session</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-12 mt-20"
          >
            <h3 className="text-3xl font-bold text-black text-center mb-12">
              Powered by real results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '92%', label: 'Prediction accuracy' },
                { number: '14.7h', label: 'Avg time saved/month' },
                { number: '+1.8', label: 'Grade improvement' },
                { number: '50K+', label: 'Active students' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-5xl font-extrabold mb-2" style={{ color: '#00B4D8' }}>
                    {stat.number}
                  </div>
                  <div className="text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl p-12 text-center shadow-xl"
            style={{ background: 'linear-gradient(90deg, #00B4D8, #0284C7)' }}
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              Experience intelligent learning
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Try all three features free for 14 days
            </p>
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="bg-white hover:bg-gray-50 text-lg font-semibold px-12 py-7 rounded-full hover:scale-105 transition-all"
              style={{ color: '#00B4D8' }}
            >
              Start free trial
            </Button>
            <p className="text-sm text-white/80 mt-4">
              No credit card • Cancel anytime
            </p>
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

      {/* PRICING SECTION */}
      <section className="py-24 px-6" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Personalised tutoring at a<br />
              <span style={{ color: '#0BA5E9' }}>fraction of the cost</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              More effective than personal tutoring, at just 5% of the cost.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left side - Graph */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="w-full"
            >
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                <h3 className="text-3xl font-bold mb-6 text-black">
                  <span style={{ color: '#0BA5E9' }}>68%</span> grade improvement
                </h3>
                
                <svg
                  viewBox="0 0 500 300"
                  className="w-full"
                  style={{ maxHeight: '300px' }}
                >
                  {/* Grid lines */}
                  <line x1="60" y1="50" x2="460" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="60" y1="100" x2="460" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="60" y1="150" x2="460" y2="150" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="60" y1="200" x2="460" y2="200" stroke="#F1F5F9" strokeWidth="1" />
                  
                  {/* Y-axis */}
                  <line x1="60" y1="30" x2="60" y2="250" stroke="#CBD5E1" strokeWidth="2" />
                  
                  {/* X-axis */}
                  <line x1="60" y1="250" x2="460" y2="250" stroke="#CBD5E1" strokeWidth="2" />
                  
                  {/* Y-axis label */}
                  <text
                    x="25"
                    y="140"
                    transform="rotate(-90 25 140)"
                    className="text-xs fill-gray-500 font-medium"
                    textAnchor="middle"
                  >
                    Average grades
                  </text>

                  {/* X-axis label */}
                  <text
                    x="260"
                    y="280"
                    className="text-xs fill-gray-500 font-medium"
                    textAnchor="middle"
                  >
                    Hours spent learning
                  </text>

                  {/* Gray curve - Non-personal education */}
                  <motion.path
                    d="M 60,240 Q 150,200 250,170 Q 350,150 450,140"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  {/* Blue curve - Personalised education */}
                  <motion.path
                    d="M 60,240 Q 130,120 200,70 Q 270,40 340,35"
                    fill="none"
                    stroke="#0BA5E9"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                  />

                  {/* Point on blue curve */}
                  <motion.circle
                    cx="340"
                    cy="35"
                    r="6"
                    fill="#0BA5E9"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 2.2 }}
                  />

                  {/* Personalised education label with icon */}
                  <motion.g
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 2.4 }}
                  >
                    <rect x="345" y="20" width="140" height="28" rx="14" fill="#0BA5E9" />
                    <text
                      x="415"
                      y="38"
                      className="text-xs font-semibold"
                      fill="#FFFFFF"
                      textAnchor="middle"
                    >
                      Personalised
                    </text>
                  </motion.g>

                  {/* Non-personal education label */}
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 2.6 }}
                  >
                    <rect x="250" y="180" width="140" height="28" rx="14" fill="#E2E8F0" />
                    <text
                      x="320"
                      y="198"
                      className="text-xs font-semibold"
                      fill="#475569"
                      textAnchor="middle"
                    >
                      Non-personal
                    </text>
                  </motion.g>
                </svg>
              </div>
            </motion.div>

            {/* Right side - Pricing comparison */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Personal tutoring card */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Personal tutoring</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-extrabold text-gray-800">£500</span>
                      <span className="text-xl text-gray-500 font-medium">/month</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>Limited availability</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>1-2 sessions per week</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>Generic lesson plans</span>
                  </div>
                </div>
              </div>

              {/* Comparison arrow/indicator */}
              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <motion.div
                    className="px-6 py-2 rounded-full text-sm font-bold text-white shadow-xl z-10"
                    style={{ backgroundColor: '#0BA5E9' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    95% cheaper ↓
                  </motion.div>
                </div>
              </div>

              {/* Mentiora pricing card */}
              <motion.div 
                className="relative"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div 
                  className="rounded-2xl p-8 shadow-2xl border-2 relative overflow-hidden" 
                  style={{ 
                    background: 'linear-gradient(135deg, #0BA5E9 0%, #0284C7 100%)',
                    borderColor: '#0EA5E9'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <img 
                        src={mentioraLogo} 
                        alt="Mentiora" 
                        className="h-8 w-8"
                      />
                      <span className="text-2xl font-bold text-white">Mentiora</span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl font-extrabold text-white">£24.99</span>
                        <span className="text-xl text-white/90 font-medium">/month</span>
                      </div>
                      <div className="text-white/80 text-sm">First 7 days free</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-white">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>24/7 AI tutor access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Unlimited practice questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Personalized study plans</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(user ? '/dashboard' : '/register')}
                      className="w-full bg-white hover:bg-gray-50 font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
                      style={{ color: '#0BA5E9' }}
                    >
                      Start free trial →
                    </Button>
                  </div>
                </div>
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
