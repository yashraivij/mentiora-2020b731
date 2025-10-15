import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowRight,
  Menu,
  Brain,
  BarChart3,
  Clock,
  Target,
  CheckCircle2,
  Sparkles,
  Star
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Very subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-7 w-7"
            />
            <span className="text-lg font-semibold text-gray-900">
              Mentiora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/pricing")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </button>
            <Button onClick={() => navigate("/login")} variant="ghost" size="sm" className="text-gray-600 font-medium">
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")} 
              size="sm" 
              className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white shadow-sm hover:shadow-md transition-all"
            >
              Start Free Trial
            </Button>
          </div>

          <button className="md:hidden">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white">
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-[44px] md:text-5xl font-semibold mb-6 leading-tight text-[#0F172A] tracking-tight">
              The GCSE & A-Level tutor built around{" "}
              <span className="text-[#3B82F6]">you</span>.
            </h1>
            
            <p className="text-lg text-[#475569] mb-4 max-w-3xl mx-auto leading-relaxed">
              Your personalised revision coach — built to understand how you learn.
            </p>
            
            <p className="text-base text-[#64748B] mb-10 max-w-2xl mx-auto leading-relaxed">
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white px-8 shadow-sm hover:shadow-md transition-all"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => navigate("/dashboard")}
                size="lg"
                variant="outline"
                className="px-8 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Explore Dashboard
              </Button>
            </div>

            <p className="text-sm text-[#94A3B8]">
              Trusted by GCSE & A-Level students preparing for 2026 exams
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4 text-[#0F172A]">
              Designed to make revision personal
            </h2>
            <p className="text-base text-[#64748B] max-w-2xl mx-auto">
              Every student learns differently — Mentiora adapts to you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Smart Revision Notebook",
                description: "Build a study plan that adapts to your weakest topics. Updates automatically after every quiz or practice session.",
                mockup: (
                  <div className="space-y-2">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-medium text-red-700">Weak Topic</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Quadratic Equations</div>
                      <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "30%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          className="h-full bg-red-500"
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-3 w-3 text-blue-500" />
                        <span className="text-xs font-medium text-blue-700">Improving</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Trigonometry</div>
                      <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-blue-500" />
                      </div>
                    </div>
                  </div>
                )
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "Watch your grade rise in real time as you improve. Each session refines your predicted mark — motivating you to hit your targets.",
                mockup: (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Current Grade</span>
                      <span className="text-4xl font-bold text-[#3B82F6]">8</span>
                    </div>
                    <div className="text-xs text-center text-green-600 font-medium flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ↑ from Grade 7
                    </div>
                    <div className="h-24 flex items-end gap-1.5">
                      {[6, 7, 7.5, 7.8, 8].map((grade, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(grade / 9) * 100}%` }}
                          transition={{ delay: i * 0.15, duration: 0.6 }}
                          className="flex-1 bg-[#3B82F6] rounded-t"
                        />
                      ))}
                    </div>
                  </div>
                )
              },
              {
                icon: BarChart3,
                title: "Weekly Insights",
                description: "Track your retention, focus, and best study hours. Mentiora analyses your learning data to help you study smarter, not longer.",
                mockup: (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="text-xs text-gray-600">Retention Rate</span>
                      <span className="text-sm font-bold text-[#3B82F6]">74%</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                      <span className="text-xs flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        Study Peak
                      </span>
                      <span className="text-sm font-bold text-[#A78BFA]">7-9 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-xs text-gray-600">This Week</span>
                      <span className="text-sm font-bold text-green-600">5h 20m</span>
                    </div>
                    <div className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      +2h from last week
                    </div>
                  </div>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="border border-gray-200 bg-white hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex p-3 rounded-lg bg-[#3B82F6]/10 mb-4">
                      <feature.icon className="h-5 w-5 text-[#3B82F6]" strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#64748B] mb-4 leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-4">
                      {feature.mockup}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-semibold mb-4 text-[#0F172A]">
                Built around how you learn
              </h2>
              <p className="text-base text-[#475569] mb-4 leading-relaxed">
                Your Mentiora dashboard tracks every subject, grade, and goal — adapting automatically to your performance.
              </p>
              <p className="text-base text-[#64748B] mb-8 leading-relaxed">
                See your predicted grades rise, your study patterns evolve, and your retention grow.
              </p>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white shadow-sm hover:shadow-md transition-all"
              >
                See How It Works
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Card className="border border-gray-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#0F172A]">Your Dashboard</h3>
                    <div className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium flex items-center gap-1.5 border border-green-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Live
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Predicted Grade */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Predicted Grade</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-5xl font-bold text-[#3B82F6]">8</div>
                      <div className="text-sm text-green-600 font-medium mt-2">
                        ↑ from Grade 7
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <div className="text-xs text-gray-600 mb-1">Study Time</div>
                        <div className="text-xl font-bold text-[#3B82F6]">5h 20m</div>
                        <div className="text-xs text-green-600 font-medium mt-1">+2h this week</div>
                      </div>

                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                        <div className="text-xs text-gray-600 mb-1">Retention</div>
                        <div className="text-xl font-bold text-[#A78BFA]">74%</div>
                        <div className="text-xs text-gray-500 mt-1">↑ improving</div>
                      </div>
                    </div>

                    {/* Study Peak */}
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700">Study Peak</span>
                        </div>
                        <span className="text-base font-bold text-orange-600">7-9 PM</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Personalisation Flow */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4 text-[#0F172A]">
              Learning that gets smarter every week
            </h2>
            <p className="text-base text-[#64748B] max-w-2xl mx-auto">
              Mentiora uses your performance to refine what you learn next — building a personalised path to your target grade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Assess",
                description: "Mentiora analyses your quiz results and answers",
                color: "bg-blue-500"
              },
              {
                icon: Brain,
                title: "Adapt",
                description: "Weak topics are updated in your Smart Notebook",
                color: "bg-purple-500"
              },
              {
                icon: TrendingUp,
                title: "Accelerate",
                description: "Your plan evolves weekly to maximise improvement",
                color: "bg-green-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="border border-gray-200 bg-white hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-full ${step.color} text-white mb-4`}>
                      <step.icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-[#0F172A]">{step.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4 text-[#0F172A]">
              Smarter than tutoring — 95% cheaper
            </h2>
            <p className="text-base text-[#64748B] max-w-2xl mx-auto">
              Personalised, data-driven learning designed to outperform private tuition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Grade Improvement */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-[#0F172A]">Grade Improvement</h3>
                <div className="h-48 flex items-end justify-center gap-8">
                  <div className="text-center">
                    <div className="h-32 w-20 bg-gray-200 rounded-t-lg mb-2" />
                    <span className="text-xs text-gray-600">Traditional</span>
                  </div>
                  <div className="text-center">
                    <div className="h-44 w-20 bg-[#3B82F6] rounded-t-lg mb-2" />
                    <span className="text-xs font-medium text-[#3B82F6]">Mentiora</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  68% average grade improvement
                </p>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-[#0F172A]">Cost Comparison</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Private Tutoring</span>
                      <span className="text-xl font-bold text-gray-900">£500</span>
                    </div>
                    <div className="h-12 bg-gray-200 rounded-lg relative overflow-hidden">
                      <div className="h-full w-full bg-gray-300" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per month</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Mentiora</span>
                      <span className="text-xl font-bold text-[#3B82F6]">£14.99</span>
                    </div>
                    <div className="h-12 bg-blue-50 rounded-lg relative overflow-hidden border border-blue-100">
                      <div className="h-full w-[3%] bg-[#3B82F6]" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per month</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mt-6">
                  <p className="text-sm text-center text-gray-700">
                    Students see measurable progress in under <span className="font-semibold text-[#3B82F6]">4 weeks</span> — for less than <span className="font-semibold text-green-600">5% of the cost</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-[#F9FBFF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4 text-[#0F172A]">
              Loved by students across the UK
            </h2>
            <p className="text-base text-[#64748B] max-w-2xl mx-auto">
              Real stories from learners who turned revision into results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "It feels like a tutor that actually understands me.",
                author: "Maya, Year 11"
              },
              {
                quote: "My grades jumped from 6 to 8 in three weeks.",
                author: "Ethan, GCSE Student"
              },
              {
                quote: "Finally, a study app that feels personal.",
                author: "Sophie, Year 10 Parent"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="border border-gray-200 bg-white h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-base mb-4 text-gray-700 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="text-sm font-medium text-gray-900">{testimonial.author}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4 text-[#0F172A]">
              All-in-one personalised revision
            </h2>
            <p className="text-base text-[#64748B] max-w-2xl mx-auto">
              Unlimited access to GCSE & A-Level subjects — one simple plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="border-2 border-gray-200 hover:border-[#3B82F6]/50 transition-all bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-3 text-[#0F172A]">Monthly</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#3B82F6]">£14.99</span>
                  <span className="text-gray-500 ml-2">/ month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Smart Revision Notebook",
                    "Personalised Grade Tracking",
                    "Weekly Insights & Analytics",
                    "Unlimited Practice Sessions",
                    "All GCSE & A-Level Subjects"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#3B82F6] shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate("/register")}
                  className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white shadow-sm hover:shadow-md transition-all"
                >
                  Start Free Trial
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-3">
                  Cancel anytime
                </p>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="border-2 border-[#3B82F6] shadow-lg bg-white relative">
              <div className="absolute top-4 right-4">
                <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-xs font-semibold text-white flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Save 33%
                </div>
              </div>
              
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-3 text-[#0F172A]">Annual</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#3B82F6]">£120</span>
                  <span className="text-gray-500 ml-2">/ year</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Monthly",
                    "Priority Support",
                    "Early Access to New Features",
                    "Downloadable Progress Reports",
                    "7-Day Money-Back Guarantee"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#3B82F6] shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate("/register")}
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-lg transition-all text-white"
                >
                  Start Free Trial
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-3">
                  No card required • 7-day guarantee
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            No card required • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-blue-50/40 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-semibold mb-6 text-[#0F172A]">
            Ready to see your grades grow?
          </h2>
          
          <p className="text-lg text-[#475569] mb-10 max-w-2xl mx-auto">
            Join thousands of GCSE & A-Level students learning smarter with Mentiora.
          </p>

          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-xl text-white px-12 py-6 text-lg font-semibold"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="mt-10 p-6 rounded-xl bg-white border border-gray-200 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">
              9 out of 10 students improved by 1 or more grades
            </p>
            <p className="text-sm text-gray-500">within 4 weeks</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Mentiora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;