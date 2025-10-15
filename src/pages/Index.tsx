import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, BarChart3, Clock, Target, CheckCircle2, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div {...fadeIn}>
            <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.1] mb-5 text-[hsl(var(--landing-navy))]">
              The GCSE & A-Level tutor built around{" "}
              <span className="bg-gradient-to-r from-primary to-[hsl(var(--landing-lavender))] bg-clip-text text-transparent font-semibold">
                you
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[hsl(var(--landing-slate))] max-w-2xl mx-auto mb-3 leading-relaxed font-normal">
              Your personalised revision coach — built to understand how you learn.
            </p>
            <p className="text-sm sm:text-base text-[hsl(var(--landing-slate))]/75 max-w-xl mx-auto mb-8 leading-relaxed font-light">
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </p>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center items-center" {...fadeIn} transition={{ delay: 0.1, duration: 0.5 }}>
            <Button size="lg" onClick={() => navigate("/register")} className="group px-7 h-12 text-base rounded-lg bg-gradient-to-r from-primary to-[hsl(var(--landing-lavender))] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] font-medium">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="px-7 h-12 text-base rounded-lg border border-border/60 hover:bg-[hsl(var(--landing-mist))] hover:border-border transition-all duration-300 font-medium text-[hsl(var(--landing-navy))]">
              Explore Dashboard
            </Button>
          </motion.div>

          <motion.p className="text-xs text-[hsl(var(--landing-slate))]/60 mt-6 font-light tracking-wide" {...fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
            Trusted by GCSE & A-Level students preparing for 2026 exams
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--landing-mist))]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14 space-y-3" {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[hsl(var(--landing-navy))]">
              Designed to make revision personal
            </h2>
            <p className="text-base text-[hsl(var(--landing-slate))] max-w-xl mx-auto font-light">
              Every student learns differently — Mentiora adapts to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Brain, title: "Smart Revision Notebook", description: "Build a study plan that adapts to your weakest topics.", detail: "Updates automatically after every quiz or practice session." },
              { icon: BarChart3, title: "Predicted Grades", description: "Watch your grade rise in real time as you improve.", detail: "Each session refines your predicted mark — motivating you to hit your targets." },
              { icon: Clock, title: "Weekly Insights", description: "Track your retention, focus, and best study hours.", detail: "Mentiora analyses your learning data to help you study smarter, not longer." }
            ].map((feature, index) => (
              <motion.div key={index} {...fadeIn} transition={{ delay: index * 0.1, duration: 0.5 }}>
                <Card className="p-6 h-full bg-white border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary/10 to-[hsl(var(--landing-lavender))]/10 rounded-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(var(--landing-navy))]">{feature.title}</h3>
                  <p className="text-sm text-[hsl(var(--landing-slate))] mb-2 leading-relaxed font-normal">{feature.description}</p>
                  <p className="text-xs text-[hsl(var(--landing-slate))]/70 leading-relaxed font-light">{feature.detail}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-5" {...fadeIn}>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[hsl(var(--landing-navy))]">
                Built around how you learn
              </h2>
              <p className="text-base text-[hsl(var(--landing-slate))] leading-relaxed font-normal">
                Your dashboard shows exactly where you stand — and what to focus on next.
              </p>
              <p className="text-sm text-[hsl(var(--landing-slate))]/75 leading-relaxed font-light">
                Track your progress across every subject, see predicted grades update in real-time, and get personalized recommendations based on your learning patterns.
              </p>
              <Button onClick={() => navigate("/login")} className="group mt-4 bg-gradient-to-r from-primary to-[hsl(var(--landing-lavender))] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-medium">
                See How It Works
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
              <Card className="p-6 bg-gradient-to-br from-white to-[hsl(var(--landing-mist-blue))] border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[hsl(var(--landing-navy))]">Your Progress</h3>
                    <span className="text-xs text-[hsl(var(--landing-slate))]/60 font-light">Last 7 days</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { subject: "Mathematics", progress: 78, color: "bg-primary" },
                      { subject: "Biology", progress: 65, color: "bg-[hsl(var(--landing-lavender))]" },
                      { subject: "Chemistry", progress: 82, color: "bg-primary/80" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-[hsl(var(--landing-navy))]">{item.subject}</span>
                          <span className="text-[hsl(var(--landing-slate))] font-light">{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-[hsl(var(--landing-mist))] rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Personalisation Flow Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--landing-mist-blue))]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14 space-y-3" {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[hsl(var(--landing-navy))]">
              Learning that gets smarter every week
            </h2>
            <p className="text-base text-[hsl(var(--landing-slate))] max-w-xl mx-auto font-light">
              Mentiora evolves with you — adapting to your strengths and weaknesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-[hsl(var(--landing-lavender))] to-primary -translate-y-1/2 z-0" />
            {[
              { icon: Target, title: "Identify Gaps", description: "Every quiz reveals what you know — and what needs work." },
              { icon: Zap, title: "Adapt Your Plan", description: "Your revision notebook updates automatically to focus on weak areas." },
              { icon: TrendingUp, title: "Track Growth", description: "Watch your predicted grades improve as you master each topic." }
            ].map((step, index) => (
              <motion.div key={index} {...fadeIn} transition={{ delay: index * 0.15, duration: 0.5 }} className="relative z-10">
                <Card className="p-6 h-full bg-white border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary/10 to-[hsl(var(--landing-lavender))]/10 rounded-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(var(--landing-navy))]">{step.title}</h3>
                  <p className="text-sm text-[hsl(var(--landing-slate))] leading-relaxed font-normal">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14 space-y-3" {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[hsl(var(--landing-navy))]">
              Smarter than tutoring — 95% cheaper
            </h2>
            <p className="text-base text-[hsl(var(--landing-slate))] max-w-xl mx-auto font-light">
              Get personalized support without the premium price tag.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div {...fadeIn} transition={{ delay: 0.1, duration: 0.5 }}>
              <Card className="p-8 h-full bg-gradient-to-br from-white to-[hsl(var(--landing-mist))] border border-border/40 shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-[hsl(var(--landing-navy))]">Traditional Tutoring</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(var(--landing-slate))] font-normal">Average monthly cost</span>
                    <span className="text-2xl font-semibold text-[hsl(var(--landing-navy))]">£500</span>
                  </div>
                  <div className="h-3 bg-[hsl(var(--landing-mist))] rounded-full overflow-hidden">
                    <div className="h-full bg-[hsl(var(--landing-slate))]/30 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-xs text-[hsl(var(--landing-slate))]/70 font-light">Fixed schedule • Limited availability • One-size-fits-all approach</p>
                </div>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
              <Card className="p-8 h-full bg-gradient-to-br from-primary/5 to-[hsl(var(--landing-lavender))]/5 border-2 border-primary/20 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-[hsl(var(--landing-navy))]">Mentiora</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(var(--landing-slate))] font-normal">Monthly subscription</span>
                    <span className="text-2xl font-semibold text-primary">£14.99</span>
                  </div>
                  <div className="h-3 bg-[hsl(var(--landing-mist))] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-[hsl(var(--landing-lavender))] rounded-full" style={{ width: "3%" }} />
                  </div>
                  <p className="text-xs text-[hsl(var(--landing-slate))]/70 font-light">24/7 access • Personalized learning • Adapts to your pace</p>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.p className="text-center text-xs text-[hsl(var(--landing-slate))]/60 mt-8 font-light" {...fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            68% average grade improvement with Mentiora
          </motion.p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--landing-mist-blue))]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14 space-y-3" {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[hsl(var(--landing-navy))]">
              Loved by students & parents across the UK
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { initials: "SJ", name: "Sarah J.", role: "A-Level Student", quote: "My predicted grade went from a C to an A* in just 8 weeks. Mentiora showed me exactly what I needed to focus on." },
              { initials: "MK", name: "Michael K.", role: "Parent", quote: "Finally, a tool that actually helps my son study independently. His confidence has grown so much." },
              { initials: "EP", name: "Emma P.", role: "GCSE Student", quote: "I love how it breaks down topics I struggle with. It's like having a tutor available 24/7." }
            ].map((testimonial, index) => (
              <motion.div key={index} {...fadeIn} transition={{ delay: index * 0.1, duration: 0.5 }}>
                <Card className="p-6 h-full bg-white border-t-2 border-t-primary/20 border-x border-b border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-primary/10 to-[hsl(var(--landing-lavender))]/10">
                      <AvatarFallback className="text-primary font-semibold text-sm">{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-[hsl(var(--landing-navy))]">{testimonial.name}</p>
                      <p className="text-xs text-[hsl(var(--landing-slate))]/70 font-light">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[hsl(var(--landing-slate))] italic leading-relaxed font-normal">"{testimonial.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[hsl(var(--landing-mist))]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14 space-y-3" {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[hsl(var(--landing-navy))]">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-[hsl(var(--landing-slate))] max-w-xl mx-auto font-light">
              Start free, upgrade anytime. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div {...fadeIn} transition={{ delay: 0.1, duration: 0.5 }}>
              <Card className="p-8 h-full bg-white/80 backdrop-blur-sm border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-[hsl(var(--landing-lavender))] text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-[hsl(var(--landing-navy))]">Monthly</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[hsl(var(--landing-navy))]">£14.99</span>
                  <span className="text-[hsl(var(--landing-slate))] font-light">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited practice questions",
                    "Real-time grade predictions",
                    "Personalized revision plans",
                    "Weekly progress insights",
                    "All subjects included"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--landing-slate))]">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => navigate("/register")} className="w-full bg-gradient-to-r from-primary to-[hsl(var(--landing-lavender))] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-medium">
                  Start Free Trial
                </Button>
              </Card>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
              <Card className="p-8 h-full bg-white/60 backdrop-blur-sm border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-2 text-[hsl(var(--landing-navy))]">Annual</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[hsl(var(--landing-navy))]">£149.99</span>
                  <span className="text-[hsl(var(--landing-slate))] font-light">/year</span>
                  <p className="text-xs text-primary font-medium mt-1">Save £30 per year</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Monthly",
                    "Priority support",
                    "Early access to new features",
                    "Downloadable progress reports",
                    "Cancel anytime"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--landing-slate))]">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => navigate("/register")} variant="outline" className="w-full border-primary/30 hover:bg-primary/5 transition-all duration-300 font-medium text-[hsl(var(--landing-navy))]">
                  Get Started
                </Button>
              </Card>
            </motion.div>
          </div>

          <motion.p className="text-center text-xs text-[hsl(var(--landing-slate))]/60 mt-8 font-light" {...fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            No card required • Cancel anytime • 7-day refund guarantee
          </motion.p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-[hsl(var(--landing-lavender))]/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5 text-[hsl(var(--landing-navy))]">
              Ready to see your grades grow?
            </h2>
            <p className="text-base text-[hsl(var(--landing-slate))] mb-8 font-light max-w-xl mx-auto">
              Join thousands of students who are already improving their results with Mentiora.
            </p>
            <Button size="lg" onClick={() => navigate("/register")} className="group px-8 h-14 text-lg rounded-lg bg-gradient-to-r from-primary to-[hsl(var(--landing-lavender))] hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] font-medium">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <p className="text-xs text-[hsl(var(--landing-slate))]/60 mt-6 font-light">
              9/10 students improved within 4 weeks
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
