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
              Mentiora AI teaches you how to answer every question
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
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-5 leading-tight">
              Unlike any other app<br />
              A <span style={{ color: '#0BA5E9' }}>personalised AI tutor</span>.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Mentiora AI teaches you how to answer every question
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
                      Hi Medly, What did this question mean by potential energy?
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
                icon: "🏃",
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
              The only AI tutor that's<br />
              <span style={{ color: '#0BA5E9' }}>specific to your exam curriculum</span>
            </h2>
            <p className="text-base text-gray-600">
              Other AI tutoring platforms are not based on Exam Board Curriculums.<br />
              Don't see your subject? <button style={{ color: '#0BA5E9' }} className="underline hover:opacity-80 transition-opacity">Request it here</button>.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* GCSE Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <h3 className="text-2xl font-bold text-black">GCSE</h3>
                <span className="text-sm text-gray-500">AQA</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {[
                  { name: "Biology", emoji: "🧬" },
                  { name: "Chemistry", emoji: "🧪" },
                  { name: "Physics", emoji: "🧲" },
                  { name: "Computer Science", emoji: "💻" },
                  { name: "English", emoji: "✍️" },
                  { name: "Maths", emoji: "📐" },
                  { name: "Geography", emoji: "🌍" }
                ].map((subject, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#0BA5E9] hover:shadow-md transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-2xl mb-1">{subject.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{subject.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* IGCSE Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <h3 className="text-2xl font-bold text-black">IGCSE</h3>
                <span className="text-sm text-gray-500">CIE</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {[
                  { name: "Biology", emoji: "🧬" },
                  { name: "Chemistry", emoji: "🧪" },
                  { name: "Physics", emoji: "🧲" },
                  { name: "Computer Science", emoji: "💻" },
                  { name: "Economics", emoji: "💰" },
                  { name: "Geography", emoji: "🌍" },
                  { name: "History", emoji: "⏳" }
                ].map((subject, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#0BA5E9] hover:shadow-md transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-2xl mb-1">{subject.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{subject.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* A-Level Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <h3 className="text-2xl font-bold text-black">A-Level</h3>
                <span className="text-sm text-gray-500">AQA</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {[
                  { name: "Biology", emoji: "🧬" },
                  { name: "Chemistry", emoji: "🧪" },
                  { name: "Physics", emoji: "🧲" },
                  { name: "Maths", emoji: "📐" },
                  { name: "Computer Science", emoji: "💻" },
                  { name: "Economics", emoji: "💰" },
                  { name: "Psychology", emoji: "🧠" }
                ].map((subject, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#0BA5E9] hover:shadow-md transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-2xl mb-1">{subject.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{subject.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* IB Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <h3 className="text-2xl font-bold text-black">IB</h3>
                <span className="text-sm text-gray-500">International Baccalaureate</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {[
                  { name: "Biology", emoji: "🧬" },
                  { name: "Chemistry", emoji: "🧪" },
                  { name: "Physics", emoji: "🧲" },
                  { name: "Economics", emoji: "💰" },
                  { name: "Maths AA", emoji: "📐" },
                  { name: "Maths AI", emoji: "📊" },
                  { name: "Psychology", emoji: "🧠" }
                ].map((subject, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#0BA5E9] hover:shadow-md transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-2xl mb-1">{subject.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{subject.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 px-6" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-5 leading-tight">
              Personalised tutoring<br />
              <span style={{ color: '#0BA5E9' }}>at a fraction of the cost</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trained to be more effective than personal tutoring,
              at just 5% of the cost of private tuition.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#0BA5E9' }}>
                68% grade improvement
              </h3>
              <Card className="bg-white rounded-2xl shadow-lg">
                <CardContent className="p-10">
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    [Grade Improvement Graph]
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-5"
            >
              <div className="bg-gray-100 rounded-xl p-8">
                <div className="text-4xl font-bold text-black">£500/month</div>
                <div className="text-sm text-gray-500 mt-1">Personal tutoring</div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border-2 relative" style={{ borderColor: '#0BA5E9' }}>
                <div className="absolute -top-3 right-6 px-4 py-1 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: '#0BA5E9' }}>
                  95% cheaper than private tutoring
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-extrabold text-black">£24.99</span>
                  <span className="text-2xl font-semibold text-gray-500">/month</span>
                </div>
                <img src={mentioraLogo} alt="Mentiora" className="h-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-5 leading-tight">
              Track your progress with<br />
              <span style={{ color: '#0BA5E9' }}>real-time insights</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Metrics Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Target, label: "OVERALL PROGRESS", value: "0 → 0", color: '#0BA5E9' },
                { icon: Brain, label: "RETENTION", value: "14%", color: '#10B981' },
                { icon: Clock, label: "YOU PERFORM BEST AT", value: "6–8pm", color: '#F59E0B' },
                { icon: Calendar, label: "THIS WEEK", value: "5h 45m", color: '#0BA5E9' }
              ].map((metric, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="bg-white rounded-xl shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${metric.color}20` }}>
                          <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 mb-2">{metric.label}</div>
                      <div className="text-2xl font-bold text-black">{metric.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Subject Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Laptop, subject: "Computer Science (AQA)", target: "3", color: '#3B82F6' },
                { icon: FlaskConical, subject: "Chemistry (AQA)", target: "7", color: '#F97316' },
                { icon: Dna, subject: "Biology (AQA)", target: "9", color: '#10B981' }
              ].map((subject, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
                          <subject.icon className="w-6 h-6" style={{ color: subject.color }} />
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Not started</span>
                      </div>
                      <h3 className="text-lg font-bold text-black mb-6">{subject.subject}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">PREDICTED</div>
                          <div className="text-2xl font-bold text-gray-400">U</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">TARGET</div>
                          <div className="text-2xl font-bold text-black">{subject.target}</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">Strong: Various topics</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">Focus: Core concepts</span>
                        </div>
                      </div>

                      <Button 
                        style={{ backgroundColor: '#0BA5E9' }}
                        className="w-full text-white font-semibold rounded-lg"
                      >
                        Topics
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Join thousands of students already improving with Mentiora AI
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
              <p className="text-sm text-gray-400">AI-powered personalised learning</p>
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
