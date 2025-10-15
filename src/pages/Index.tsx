import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, BarChart3, Clock, Target, CheckCircle2, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Subtle radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-gradient-to-tl from-[#3B82F6]/8 via-[#A78BFA]/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div {...fadeInUp}>
            <h1 className="text-[48px] sm:text-[56px] font-semibold tracking-tight leading-[1.1] mb-6 text-[#0F172A]">
              The GCSE & A-Level tutor built around{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                you
              </span>
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-4 leading-relaxed">
              Your personalised revision coach — built to understand how you learn.
            </p>
            <p className="text-base text-[#475569]/80 max-w-xl mx-auto leading-relaxed">
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center" 
            {...fadeInUp} 
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/register")} 
              className="group px-8 h-12 text-base rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-300 hover:scale-[1.02] font-medium"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")} 
              className="px-8 h-12 text-base rounded-xl border border-[#E2E8F0] hover:bg-[#F9FAFB] hover:shadow-sm transition-all duration-300 font-medium text-[#0F172A]"
            >
              Explore Dashboard
            </Button>
          </motion.div>

          <motion.p 
            className="text-sm text-[#475569]/60 mt-8 tracking-wide" 
            {...fadeInUp} 
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Trusted by GCSE & A-Level students preparing for 2026 exams
          </motion.p>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-3" {...fadeInUp}>
            <h2 className="text-[36px] font-semibold tracking-tight text-[#0F172A]">
              Designed to make revision{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                personal
              </span>
            </h2>
            <p className="text-lg text-[#475569] max-w-xl mx-auto">
              Every student learns differently — Mentiora adapts to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                icon: Brain, 
                title: "Smart Revision Notebook", 
                description: "Build a study plan that adapts to your weakest topics.",
                visual: "notebook"
              },
              { 
                icon: BarChart3, 
                title: "Predicted Grades", 
                description: "Watch your grade rise in real time as you improve.",
                visual: "grades"
              },
              { 
                icon: Clock, 
                title: "Weekly Insights", 
                description: "Track your retention, focus, and best study hours.",
                visual: "insights"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                {...fadeInUp} 
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-8 h-full bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/10 to-[#A78BFA]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-[20px] font-semibold mb-3 text-[#0F172A]">{feature.title}</h3>
                  <p className="text-base text-[#475569] mb-4 leading-relaxed">{feature.description}</p>
                  
                  {/* Mini visual */}
                  {feature.visual === "notebook" && (
                    <div className="space-y-2 mt-4">
                      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full" />
                      </div>
                      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-[#3B82F6]/60 rounded-full" />
                      </div>
                    </div>
                  )}
                  {feature.visual === "grades" && (
                    <div className="mt-4 flex items-end gap-1.5 h-16">
                      {[40, 55, 70, 85].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-[#3B82F6] to-[#A78BFA] rounded-t" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  )}
                  {feature.visual === "insights" && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs text-[#475569]">
                        <span>Retention</span>
                        <span className="font-medium text-[#10B981]">87%</span>
                      </div>
                      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full w-[87%] bg-[#10B981] rounded-full" />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-6" {...fadeInUp}>
              <h2 className="text-[40px] font-semibold tracking-tight text-[#0F172A] leading-tight">
                Built around how you learn
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed">
                Your dashboard shows exactly where you stand — and what to focus on next.
              </p>
              <p className="text-base text-[#475569]/75 leading-relaxed">
                Track your progress across every subject, see predicted grades update in real-time, and get personalized recommendations based on your learning patterns.
              </p>
              <Button 
                onClick={() => navigate("/login")} 
                className="group mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-300 font-medium rounded-xl h-11"
              >
                See How It Works
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="relative">
                {/* Blur glow behind */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#3B82F6]/20 to-[#A78BFA]/20 rounded-3xl blur-2xl opacity-60" />
                
                {/* Dashboard preview card */}
                <Card className="relative p-8 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] shadow-2xl rounded-2xl">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#0F172A]">Your Progress</h3>
                      <span className="text-sm text-[#475569]/60">Last 7 days</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { subject: "Mathematics", progress: 78, color: "#3B82F6" },
                        { subject: "Biology", progress: 65, color: "#A78BFA" },
                        { subject: "Chemistry", progress: 82, color: "#10B981" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-[#0F172A]">{item.subject}</span>
                            <span className="text-[#475569]">{item.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${item.progress}%`, backgroundColor: item.color }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Cycle */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5FF]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-3" {...fadeInUp}>
            <h2 className="text-[36px] font-semibold tracking-tight text-[#0F172A]">
              Learning that gets{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                smarter every week
              </span>
            </h2>
            <p className="text-lg text-[#475569] max-w-xl mx-auto">
              Mentiora evolves with you — adapting to your strengths and weaknesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-[#3B82F6] via-[#A78BFA] to-[#3B82F6] z-0" />
            
            {[
              { icon: Target, title: "Identify Gaps", description: "Every quiz reveals what you know — and what needs work." },
              { icon: Zap, title: "Adapt Your Plan", description: "Your revision notebook updates automatically to focus on weak areas." },
              { icon: TrendingUp, title: "Track Growth", description: "Watch your predicted grades improve as you master each topic." }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                {...fadeInUp} 
                transition={{ delay: index * 0.15, duration: 0.6 }} 
                className="relative z-10"
              >
                <Card className="p-8 h-full bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/10 to-[#A78BFA]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <step.icon className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-[20px] font-semibold mb-3 text-[#0F172A] text-center">{step.title}</h3>
                  <p className="text-base text-[#475569] leading-relaxed text-center">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-3" {...fadeInUp}>
            <h2 className="text-[36px] font-semibold tracking-tight text-[#0F172A]">
              Smarter than tutoring — 95% cheaper
            </h2>
            <p className="text-lg text-[#475569] max-w-xl mx-auto">
              Get personalized support without the premium price tag.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">
            <motion.div {...fadeInUp} transition={{ delay: 0.1, duration: 0.6 }}>
              <Card className="p-8 h-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl">
                <h3 className="text-xl font-semibold mb-6 text-[#0F172A]">Traditional Tutoring</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-[#475569]">Average monthly cost</span>
                    <span className="text-3xl font-semibold text-[#0F172A]">£500</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#475569]/30 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-sm text-[#475569]/70">Fixed schedule • Limited availability • One-size-fits-all approach</p>
                </div>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.6 }}>
              <Card className="p-8 h-full bg-gradient-to-br from-[#3B82F6]/5 to-[#A78BFA]/5 border-2 border-[#3B82F6]/20 shadow-lg rounded-2xl">
                <h3 className="text-xl font-semibold mb-6 text-[#0F172A]">Mentiora</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-[#475569]">Monthly subscription</span>
                    <span className="text-3xl font-semibold text-[#3B82F6]">£14.99</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full" style={{ width: "3%" }} />
                  </div>
                  <p className="text-sm text-[#475569]/70">24/7 access • Personalized learning • Adapts to your pace</p>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.p 
            className="text-center text-sm text-[#475569]/70 mt-10" 
            {...fadeInUp} 
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Students achieve measurable progress in under 4 weeks — for less than 5% of the cost.
          </motion.p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[#F9FBFF]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-3" {...fadeInUp}>
            <h2 className="text-[36px] font-semibold tracking-tight text-[#0F172A]">
              Loved by students & parents across the UK
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { initials: "SJ", name: "Sarah J.", role: "A-Level Student", quote: "My predicted grade went from a C to an A* in just 8 weeks. Mentiora showed me exactly what I needed to focus on." },
              { initials: "MK", name: "Michael K.", role: "Parent", quote: "Finally, a tool that actually helps my son study independently. His confidence has grown so much." },
              { initials: "EP", name: "Emma P.", role: "GCSE Student", quote: "I love how it breaks down topics I struggle with. It's like having a tutor available 24/7." }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                {...fadeInUp} 
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-8 h-full bg-white border-t-2 border-t-[#3B82F6]/20 border-x border-b border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6]/10 to-[#A78BFA]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#3B82F6] font-semibold text-sm">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-base text-[#0F172A]">{testimonial.name}</p>
                      <p className="text-sm text-[#475569]/70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-base text-[#475569] italic leading-relaxed">"{testimonial.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#F9FAFB] to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-3" {...fadeInUp}>
            <h2 className="text-[36px] font-semibold tracking-tight text-[#0F172A]">
              All-in-one personalised revision
            </h2>
            <p className="text-lg text-[#475569] max-w-xl mx-auto">
              Start free, upgrade anytime. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div {...fadeInUp} transition={{ delay: 0.1, duration: 0.6 }}>
              <Card className="p-10 h-full bg-white/80 backdrop-blur-sm border-2 border-[#3B82F6]/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden rounded-2xl">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-[#3B82F6] to-[#A78BFA] text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
                  Popular
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-[#0F172A]">Monthly</h3>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-[#0F172A]">£14.99</span>
                  <span className="text-[#475569]">/month</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {[
                    "Unlimited practice questions",
                    "Real-time grade predictions",
                    "Personalized revision plans",
                    "Weekly progress insights",
                    "All subjects included"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-[#475569]">
                      <CheckCircle2 className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => navigate("/register")} 
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-300 font-medium h-12 rounded-xl"
                >
                  Start Free Trial
                </Button>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.6 }}>
              <Card className="p-10 h-full bg-white/60 backdrop-blur-sm border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                <h3 className="text-2xl font-semibold mb-2 text-[#0F172A]">Annual</h3>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-[#0F172A]">£149.99</span>
                  <span className="text-[#475569]">/year</span>
                  <p className="text-sm text-[#10B981] font-medium mt-2">Save £30 per year</p>
                </div>
                <ul className="space-y-4 mb-10">
                  {[
                    "Everything in Monthly",
                    "Priority support",
                    "Early access to new features",
                    "Downloadable progress reports",
                    "Cancel anytime"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-[#475569]">
                      <CheckCircle2 className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => navigate("/register")} 
                  variant="outline" 
                  className="w-full border-[#3B82F6]/30 hover:bg-[#3B82F6]/5 transition-all duration-300 font-medium text-[#0F172A] h-12 rounded-xl"
                >
                  Get Started
                </Button>
              </Card>
            </motion.div>
          </div>

          <motion.p 
            className="text-center text-sm text-[#475569]/60 mt-10" 
            {...fadeInUp} 
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            No card required • Cancel anytime • 7-day refund guarantee
          </motion.p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#3B82F6] to-[#A78BFA] overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-[40px] font-semibold tracking-tight mb-6 text-white">
              Ready to see your grades grow?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto">
              Join thousands of students who are already improving their results with Mentiora.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/register")} 
              className="group px-10 h-14 text-lg rounded-xl bg-white text-[#3B82F6] hover:bg-white/95 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-[1.02] font-semibold"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-white/70 mt-8">
              9 out of 10 students improved within 4 weeks
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
