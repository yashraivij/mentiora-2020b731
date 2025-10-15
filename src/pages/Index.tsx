import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  TrendingUp,
  Award,
  Play,
  CheckCircle2,
  Star,
  Brain
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7" style={{ color: '#3B82F6' }} />
            <span className="text-xl font-semibold text-gray-900">Mentiora</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/pricing")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate("/login")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </button>
            <Button onClick={() => navigate("/register")} className="rounded-full px-6" style={{ backgroundColor: '#3B82F6' }}>
              Try Mentiora
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ backgroundColor: '#EEF2FF' }} />
          <div className="absolute top-40 -right-20 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ backgroundColor: '#F3E8FF' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] text-gray-900">
                  Your revision, finally made{" "}
                  <span style={{ color: '#3B82F6' }}>
                    personal.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  The GCSE & A-Level tutor built around you.
                  Mentiora creates a study plan that adapts to your goals, strengths, and pace — so you always know exactly what to do next.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-7 rounded-full border-2 border-gray-300 transition-all font-medium"
                  style={{ borderColor: '#3B82F6', color: '#3B82F6' }}
                  onClick={() => navigate('/practice')}
                >
                  Explore Dashboard
                </Button>
              </div>

              <p className="text-sm text-gray-500 pt-2">
                No credit card required
              </p>
            </motion.div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="aspect-[4/3] rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #EEF2FF, white, #F3E8FF)' }}>
                  <div className="text-center space-y-4 p-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <TrendingUp className="w-8 h-8 mb-2" style={{ color: '#3B82F6' }} />
                        <p className="text-xs text-gray-600">Predicted Grades</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <Target className="w-8 h-8 mb-2" style={{ color: '#A78BFA' }} />
                        <p className="text-xs text-gray-600">Weekly Plan</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 col-span-2">
                        <BookOpen className="w-8 h-8 mb-2 mx-auto" style={{ color: '#4338CA' }} />
                        <p className="text-xs text-gray-600">Smart Notebook</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #F9FAFB, white)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Your <span style={{ color: '#3B82F6' }}>personalised</span> revision journey.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From your first topic to exam day, Mentiora guides every step — tracking progress, updating grades, and keeping revision simple.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="aspect-video rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #EEF2FF, #F9FAFB, #F3E8FF)' }}>
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: '#3B82F6', opacity: 0.2 }} />
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: '#A78BFA', opacity: 0.2, animationDelay: '1s' }} />
              </div>
              <div className="text-center relative z-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp className="w-24 h-24 mx-auto mb-4" style={{ color: '#3B82F6' }} />
                </motion.div>
                <p className="text-lg text-gray-600 font-medium">Your progress, visualized</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, white, #F9FAFB)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              From confusion to confidence — <span style={{ color: '#3B82F6' }}>step by step.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute h-1 rounded-full" style={{ 
              top: '80px',
              left: 0,
              right: 0,
              background: 'linear-gradient(to right, #3B82F6, #A78BFA, #4338CA)'
            }} />

            {[
              {
                icon: Target,
                title: "Discover your strengths & gaps",
                description: "Diagnostic quizzes highlight what needs work.",
                color: "#3B82F6"
              },
              {
                icon: BookOpen,
                title: "Build your personal plan",
                description: "Your schedule adjusts automatically as you improve.",
                color: "#A78BFA"
              },
              {
                icon: TrendingUp,
                title: "See your grades rise",
                description: "Track predicted grades that grow with every session.",
                color: "#4338CA"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: index * 0.2 } 
                  }
                }}
                className="relative"
              >
                <Card className="bg-white backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 p-8 h-full border border-gray-200 rounded-2xl">
                  <div className="space-y-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon className="w-8 h-8" style={{ color: step.color }} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
              className="space-y-8"
            >
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Watch your predicted grades improve in <span style={{ color: '#3B82F6' }}>real time.</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Visualise your growth with every question, quiz, and topic — Mentiora tracks your performance across all subjects.
              </p>
              <div className="bg-white p-8 rounded-2xl inline-block shadow-lg" style={{ border: `2px solid #3B82F6` }}>
                <p className="text-5xl font-bold mb-3" style={{ color: '#3B82F6' }}>82%</p>
                <p className="text-gray-700 text-lg">of students improved by at least one grade within a month</p>
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="text-lg px-10 py-7 rounded-full shadow-lg font-medium"
                style={{ backgroundColor: '#3B82F6' }}
              >
                See My Plan <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
              className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
            >
              <div className="aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #EEF2FF, #F3E8FF)' }}>
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, #3B82F6, #A78BFA)' }} />
                  <div className="absolute bottom-0 left-0 w-1/3 h-1" style={{ backgroundColor: '#4338CA' }} />
                  <svg className="absolute inset-0 w-full h-full p-12" viewBox="0 0 200 200">
                    <polyline
                      points="20,150 60,120 100,80 140,40 180,20"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="text-center space-y-4 relative z-10">
                  <div className="space-y-2">
                    <p className="text-6xl font-bold text-gray-900">5 → 9</p>
                    <p className="text-gray-600 text-lg font-medium">Real grade improvement</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #F9FAFB, white)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              All your revision tools, <span style={{ color: '#3B82F6' }}>unified.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need — in one calm, organised dashboard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Smart Notebook",
                description: "Personalised notes that match your progress.",
                color: "#3B82F6"
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "See live updates for every subject.",
                color: "#A78BFA"
              },
              {
                icon: Target,
                title: "Weekly Plan",
                description: "Adaptive schedule that fits your routine.",
                color: "#4338CA"
              },
              {
                icon: Award,
                title: "Motivation System",
                description: "Streaks & XP to keep you on track.",
                color: "#3B82F6"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: index * 0.1 } 
                  }
                }}
              >
                <Card className="bg-white hover:shadow-xl transition-all duration-300 p-10 h-full border border-gray-200 rounded-2xl">
                  <div className="space-y-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Smarter than tutoring — <span style={{ color: '#3B82F6' }}>95% cheaper.</span>
            </h2>
            <p className="text-xl text-gray-600">
              Trained to be more effective than personal tutoring, at just 5% of the cost of private tuition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional Tutoring */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
            >
              <Card className="p-10 bg-gray-50 border-2 border-gray-200 h-full rounded-2xl">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-400">Traditional Tutoring</h3>
                  <p className="text-5xl font-bold text-gray-400">£500<span className="text-2xl">/month</span></p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-gray-500 text-lg">
                      <span className="text-red-400 text-xl mt-1">✗</span>
                      <span>Generic lesson plans</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-500 text-lg">
                      <span className="text-red-400 text-xl mt-1">✗</span>
                      <span>1 hour a week</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-500 text-lg">
                      <span className="text-red-400 text-xl mt-1">✗</span>
                      <span>Limited availability</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Mentiora */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
            >
              <Card className="p-10 bg-white shadow-2xl h-full relative overflow-hidden rounded-2xl" style={{ border: `2px solid #3B82F6` }}>
                <div className="absolute top-0 right-0 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl" style={{ backgroundColor: '#3B82F6' }}>
                  95% CHEAPER
                </div>
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl font-bold text-gray-900">Mentiora</h3>
                  <p className="text-5xl font-bold" style={{ color: '#3B82F6' }}>£14.99<span className="text-2xl">/month</span></p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-gray-900 text-lg">
                      <CheckCircle2 className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span>Personalised revision coach</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-900 text-lg">
                      <CheckCircle2 className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span>Available 24/7</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-900 text-lg">
                      <CheckCircle2 className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span>Adaptive learning technology</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }
            }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 text-lg mb-8">Get the same level of guidance — without the cost.</p>
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="text-lg px-10 py-7 rounded-full shadow-lg font-medium"
              style={{ backgroundColor: '#3B82F6' }}
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #F9FAFB, white)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Loved by <span style={{ color: '#3B82F6' }}>30,000+ students</span>
            </h2>
            <p className="text-xl text-gray-600">from the UK's top schools</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "It feels like a tutor who actually knows me.",
                author: "Maya",
                role: "GCSE Student"
              },
              {
                quote: "I finally know what to study and when.",
                author: "Josh",
                role: "A-Level Student"
              },
              {
                quote: "Mentiora helped me go from a 4 to an 8 in Physics.",
                author: "Sana",
                role: "Year 11"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: index * 0.15 } 
                  }
                }}
              >
                <Card className="bg-white p-8 h-full border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <div className="space-y-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5" fill="#3B82F6" style={{ color: '#3B82F6' }} />
                      ))}
                    </div>
                    <p className="text-xl text-gray-900 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="font-bold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center space-y-8"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              See Mentiora in <span style={{ color: '#3B82F6' }}>action.</span>
            </h2>
            <p className="text-xl text-gray-600">Your learning, visualised.</p>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl p-1" style={{ background: 'linear-gradient(to bottom right, #3B82F6, #A78BFA, #FCD34D)', border: `4px solid #3B82F6` }}>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="aspect-video flex items-center justify-center relative" style={{ background: 'linear-gradient(to bottom right, #EEF2FF, #F3E8FF)' }}>
                  <video 
                    className="w-full h-full object-cover"
                    poster="/placeholder.svg"
                    controls
                  >
                    <source src="/demo-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Play className="w-10 h-10 ml-1" style={{ color: '#3B82F6' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #3B82F6, #A78BFA, #4338CA)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="text-center space-y-8"
          >
            <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Start your personalised revision journey today.
            </h2>
            <p className="text-2xl text-white/90 max-w-2xl mx-auto">
              Smarter learning. Better grades. Complete confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-white hover:bg-gray-50 text-xl px-14 py-8 rounded-full shadow-2xl font-bold transform hover:scale-105 transition-all"
                style={{ color: '#3B82F6' }}
              >
                Get Started <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
            
            <p className="text-white/90 text-base pt-6">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-7 h-7" style={{ color: '#3B82F6' }} />
                <span className="text-xl font-bold text-gray-900">Mentiora</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your personalised GCSE & A-Level revision platform
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/practice')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Practice</button></li>
                <li><button onClick={() => navigate('/flashcards')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Flashcards</button></li>
                <li><button onClick={() => navigate('/predicted-results')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Predicted Results</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/pricing')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Mentiora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
