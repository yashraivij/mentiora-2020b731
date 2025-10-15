import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, BarChart3, Clock, Target, CheckCircle2, Zap, TrendingUp, Check } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-[Inter,SF_Pro_Display,-apple-system,sans-serif]">
      
      {/* 1️⃣ HERO SECTION */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-32"
        style={{
          background: "radial-gradient(circle at 80% 20%, #E6EDFF 0%, #FFFFFF 80%)"
        }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute w-2 h-2 bg-[#3B82F6]/30 rounded-full blur-sm"
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: "20%", left: "10%" }}
          />
          <motion.div 
            className="absolute w-3 h-3 bg-[#A78BFA]/20 rounded-full blur-sm"
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 60, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: "60%", right: "15%" }}
          />
          <motion.div 
            className="absolute w-2 h-2 bg-[#3B82F6]/25 rounded-full blur-sm"
            animate={{ 
              x: [0, 60, 0], 
              y: [0, -80, 0],
              opacity: [0.25, 0.5, 0.25]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: "30%", left: "80%" }}
          />
        </div>

        <div className="max-w-[1100px] mx-auto text-center space-y-8 relative z-10">
          <motion.div {...fadeInUp}>
            <h1 
              className="text-[56px] leading-[1.1] font-semibold tracking-[-0.02em] mb-6 text-[#0F172A]"
              style={{ lineHeight: "110%" }}
            >
              The GCSE & A-Level tutor built around{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                you
              </span>
            </h1>
            <p 
              className="text-[24px] font-medium text-[#475569] max-w-2xl mx-auto mb-4"
              style={{ lineHeight: "150%" }}
            >
              Your personalised revision coach — built to understand how you learn.
            </p>
            <p 
              className="text-[18px] font-normal text-[#475569] max-w-xl mx-auto"
              style={{ lineHeight: "150%" }}
            >
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/register")} 
              className="group px-8 h-12 text-[16px] font-medium rounded-xl text-white border-0 transition-all duration-400 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3)"
              }}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")} 
              className="px-8 h-12 text-[16px] font-medium rounded-xl bg-white border text-[#0F172A] hover:bg-[#F9FAFB] transition-all duration-300"
              style={{
                border: "1px solid rgba(59, 130, 246, 0.2)"
              }}
            >
              Explore Dashboard
            </Button>
          </motion.div>

          <motion.p 
            className="text-[14px] text-[#475569]/60 mt-8 pt-4" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Trusted by GCSE & A-Level students preparing for 2026 exams
          </motion.p>
        </div>
      </section>

      {/* 2️⃣ FEATURE STRIP */}
      <section 
        className="py-32 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)"
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <motion.div className="text-center mb-20 space-y-4" {...fadeInUp}>
            <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[#0F172A]" style={{ lineHeight: "110%" }}>
              Designed to make revision{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                personal
              </span>
            </h2>
            <p className="text-[18px] text-[#475569] max-w-xl mx-auto" style={{ lineHeight: "150%" }}>
              Every student learns differently — Mentiora adapts to you.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
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
                variants={fadeInUp}
                className="group"
              >
                <Card 
                  className="p-8 h-full bg-white rounded-[20px] border border-[#E2E8F0] transition-all duration-300 hover:-translate-y-1"
                  style={{
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(59, 130, 246, 0.08), 0 12px 40px rgba(59, 130, 246, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300"
                    style={{
                      background: "linear-gradient(120deg, rgba(59, 130, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)"
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-[#3B82F6]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[22px] font-semibold mb-3 text-[#0F172A]" style={{ lineHeight: "110%" }}>
                    {feature.title}
                  </h3>
                  <p className="text-[16px] text-[#475569] mb-6" style={{ lineHeight: "150%" }}>
                    {feature.description}
                  </p>
                  
                  {/* Mini visual */}
                  {feature.visual === "notebook" && (
                    <div className="space-y-2 mt-4">
                      <motion.div 
                        className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div 
                          className="h-full rounded-full"
                          style={{
                            background: "linear-gradient(90deg, #3B82F6 0%, #A78BFA 100%)"
                          }}
                          initial={{ width: "0%" }}
                          whileInView={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.6 }}
                        />
                      </motion.div>
                      <motion.div 
                        className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.div 
                          className="h-full bg-[#3B82F6]/60 rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "50%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </motion.div>
                    </div>
                  )}
                  {feature.visual === "grades" && (
                    <div className="mt-4 flex items-end gap-1.5 h-16">
                      {[40, 55, 70, 85].map((height, i) => (
                        <motion.div 
                          key={i} 
                          className="flex-1 rounded-t"
                          style={{
                            background: "linear-gradient(180deg, #3B82F6 0%, #A78BFA 100%)"
                          }}
                          initial={{ height: "0%" }}
                          whileInView={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                  {feature.visual === "insights" && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-[#475569]">Retention</span>
                        <span className="font-medium text-[#10B981]">87%</span>
                      </div>
                      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#10B981] rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "87%" }}
                          transition={{ duration: 1, delay: 0.6 }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3️⃣ DASHBOARD SECTION */}
      <section 
        className="py-32 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(120deg, #EFF6FF 0%, #E0EAFF 100%)"
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div className="space-y-6" {...fadeInUp}>
              <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[#0F172A]" style={{ lineHeight: "110%" }}>
                Built around how you learn
              </h2>
              <p className="text-[18px] text-[#475569]" style={{ lineHeight: "150%" }}>
                Your dashboard shows exactly where you stand — and what to focus on next.
              </p>
              <p className="text-[16px] text-[#475569]/80" style={{ lineHeight: "150%" }}>
                Track your progress across every subject, see predicted grades update in real-time, and get personalized recommendations based on your learning patterns.
              </p>
              <Button 
                onClick={() => navigate("/login")} 
                className="group mt-6 text-white font-medium rounded-xl h-11 border-0 transition-all duration-400"
                style={{
                  background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)"
                }}
              >
                See How It Works
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative">
                {/* Blur glow behind */}
                <div 
                  className="absolute -inset-6 rounded-[30px] blur-3xl opacity-50"
                  style={{
                    background: "linear-gradient(120deg, rgba(59, 130, 246, 0.3) 0%, rgba(167, 139, 250, 0.2) 100%)"
                  }}
                />
                
                {/* Dashboard preview card - glassmorphism */}
                <Card 
                  className="relative p-8 rounded-[20px] border"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05), 0 0 40px rgba(59, 130, 246, 0.08)"
                  }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-semibold text-[#0F172A]">Your Progress</h3>
                      <span className="text-[14px] text-[#475569]/60">Last 7 days</span>
                    </div>
                    <div className="space-y-5">
                      {[
                        { subject: "Mathematics", progress: 78, color: "#3B82F6" },
                        { subject: "Biology", progress: 65, color: "#A78BFA" },
                        { subject: "Chemistry", progress: 82, color: "#10B981" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[14px]">
                            <span className="font-medium text-[#0F172A]">{item.subject}</span>
                            <span className="text-[#475569]">{item.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color }}
                              initial={{ width: "0%" }}
                              whileInView={{ width: `${item.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
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

      {/* 4️⃣ LEARNING FLOW */}
      <section 
        className="py-32 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(180deg, #F7F5FF 0%, #FFFFFF 100%)"
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <motion.div className="text-center mb-20 space-y-4" {...fadeInUp}>
            <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[#0F172A]" style={{ lineHeight: "110%" }}>
              Learning that gets{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                smarter every week
              </span>
            </h2>
            <p className="text-[18px] text-[#475569] max-w-xl mx-auto" style={{ lineHeight: "150%" }}>
              Mentiora evolves with you — adapting to your strengths and weaknesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Animated connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[16.6%] right-[16.6%] h-[2px] z-0 rounded-full overflow-hidden bg-[#E2E8F0]">
              <motion.div 
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #3B82F6 0%, #A78BFA 50%, #3B82F6 100%)"
                }}
                initial={{ width: "0%", opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            {[
              { icon: Target, title: "Identify Gaps", description: "Every quiz reveals what you know — and what needs work." },
              { icon: Zap, title: "Adapt Your Plan", description: "Your revision notebook updates automatically to focus on weak areas." },
              { icon: TrendingUp, title: "Track Growth", description: "Watch your predicted grades improve as you master each topic." }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }} 
                className="relative z-10"
              >
                <Card 
                  className="p-8 h-full bg-white border border-[#E2E8F0] transition-all duration-300 rounded-[20px]"
                  style={{
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto"
                    style={{
                      background: "linear-gradient(120deg, rgba(59, 130, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)"
                    }}
                  >
                    <step.icon className="w-6 h-6 text-[#3B82F6]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[20px] font-semibold mb-3 text-[#0F172A] text-center" style={{ lineHeight: "110%" }}>
                    {step.title}
                  </h3>
                  <p className="text-[16px] text-[#475569] text-center" style={{ lineHeight: "150%" }}>
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ VALUE COMPARISON */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <motion.div className="text-center mb-20 space-y-4" {...fadeInUp}>
            <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[#0F172A]" style={{ lineHeight: "110%" }}>
              Smarter than tutoring — 95% cheaper
            </h2>
            <p className="text-[18px] text-[#475569] max-w-xl mx-auto" style={{ lineHeight: "150%" }}>
              Get personalized support without the premium price tag.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-stretch">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card 
                className="p-8 h-full bg-white border border-[#E2E8F0] rounded-[20px]"
                style={{
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)"
                }}
              >
                <h3 className="text-[20px] font-semibold mb-6 text-[#0F172A]">Traditional Tutoring</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[16px] text-[#475569]">Average monthly cost</span>
                    <span className="text-[36px] font-semibold text-[#475569]/60">£500</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#475569]/20 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-[14px] text-[#475569]/70" style={{ lineHeight: "150%" }}>
                    Fixed schedule • Limited availability • One-size-fits-all approach
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card 
                className="p-8 h-full border-2 rounded-[20px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)",
                  border: "2px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 0 40px rgba(59, 130, 246, 0.08)"
                }}
              >
                <h3 className="text-[20px] font-semibold mb-6 text-[#0F172A]">Mentiora</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[16px] text-[#475569]">Monthly subscription</span>
                    <span className="text-[36px] font-semibold text-[#3B82F6]">£14.99</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #3B82F6 0%, #A78BFA 100%)"
                      }}
                      initial={{ width: "0%" }}
                      whileInView={{ width: "3%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-[14px] text-[#475569]/70" style={{ lineHeight: "150%" }}>
                    24/7 access • Personalized learning • Adapts to your pace
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.p 
            className="text-center text-[14px] text-[#475569]/70 mt-12" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ lineHeight: "150%" }}
          >
            Students achieve measurable progress in under 4 weeks — for less than 5% of the cost.
          </motion.p>
        </div>
      </section>

      {/* 6️⃣ TESTIMONIALS */}
      <section 
        className="py-32 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(180deg, #F9FBFF 0%, #FFFFFF 100%)"
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <motion.div className="text-center mb-20 space-y-4" {...fadeInUp}>
            <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[#0F172A]" style={{ lineHeight: "110%" }}>
              Loved by students & parents across the UK
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              { initials: "SJ", name: "Sarah J.", role: "A-Level Student", quote: "My predicted grade went from a C to an A* in just 8 weeks. Mentiora showed me exactly what I needed to focus on." },
              { initials: "MK", name: "Michael K.", role: "Parent", quote: "Finally, a tool that actually helps my son study independently. His confidence has grown so much." },
              { initials: "EP", name: "Emma P.", role: "GCSE Student", quote: "I love how it breaks down topics I struggle with. It's like having a tutor available 24/7." }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
              >
                <Card 
                  className="p-8 h-full bg-white border-x border-b border-[#E2E8F0] transition-all duration-300 hover:shadow-md rounded-[20px]"
                  style={{
                    borderTop: "2px solid rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(120deg, rgba(59, 130, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)"
                      }}
                    >
                      <span className="text-[#3B82F6] font-semibold text-[14px]">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A] text-[14px]">{testimonial.name}</p>
                      <p className="text-[12px] text-[#475569]/70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-[18px] text-[#0F172A] italic" style={{ lineHeight: "150%" }}>
                    "{testimonial.quote}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7️⃣ PRICING */}
      <section 
        className="py-32 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(120deg, #EEF2FF 0%, #F9FAFF 100%)"
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <motion.div className="text-center mb-20 space-y-4" {...fadeInUp}>
            <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[#0F172A]" style={{ lineHeight: "110%" }}>
              Choose your plan
            </h2>
            <p className="text-[18px] text-[#475569]" style={{ lineHeight: "150%" }}>
              All-in-one personalized revision
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Monthly",
                price: "£14.99",
                period: "/month",
                features: [
                  "Smart Revision Notebook",
                  "Predicted Grades Dashboard",
                  "Weekly Progress Insights",
                  "AI-Powered Practice Questions",
                  "Unlimited Topic Coverage",
                  "24/7 Access"
                ]
              },
              {
                name: "Annual",
                price: "£129.99",
                period: "/year",
                savings: "Save £50",
                features: [
                  "Everything in Monthly",
                  "Priority Support",
                  "Advanced Analytics",
                  "Custom Study Plans",
                  "Exam Board Resources",
                  "Progress Reports for Parents"
                ]
              }
            ].map((plan, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card 
                  className="p-8 h-full border rounded-[20px] transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(59, 130, 246, 0.08), 0 12px 40px rgba(59, 130, 246, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-[24px] font-semibold text-[#0F172A] mb-2">{plan.name}</h3>
                    {plan.savings && (
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-[12px] font-medium text-white mb-4"
                        style={{
                          background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)"
                        }}
                      >
                        {plan.savings}
                      </span>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-[48px] font-semibold text-[#0F172A]">{plan.price}</span>
                      <span className="text-[18px] text-[#475569]">{plan.period}</span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-[16px] text-[#0F172A]" style={{ lineHeight: "150%" }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => navigate("/register")} 
                    className="w-full h-12 text-[16px] font-medium rounded-xl text-white border-0"
                    style={{
                      background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)"
                    }}
                  >
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.p 
            className="text-center text-[14px] text-[#475569]/70 mt-12" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ lineHeight: "150%" }}
          >
            No card required • Cancel anytime • 7-day refund guarantee
          </motion.p>
        </div>
      </section>

      {/* 8️⃣ FINAL CTA */}
      <section 
        className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #3B82F6 0%, #A78BFA 100%)"
        }}
      >
        {/* Upward drifting particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute w-2 h-2 bg-white/30 rounded-full blur-sm"
            animate={{ 
              y: [0, -100],
              opacity: [0.3, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            style={{ bottom: "10%", left: "20%" }}
          />
          <motion.div 
            className="absolute w-3 h-3 bg-white/20 rounded-full blur-sm"
            animate={{ 
              y: [0, -120],
              opacity: [0.2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1 }}
            style={{ bottom: "20%", right: "30%" }}
          />
          <motion.div 
            className="absolute w-2 h-2 bg-white/25 rounded-full blur-sm"
            animate={{ 
              y: [0, -90],
              opacity: [0.25, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 2 }}
            style={{ bottom: "15%", left: "70%" }}
          />
        </div>

        <div className="max-w-[1100px] mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[48px] font-semibold tracking-[-0.02em] text-white mb-4" style={{ lineHeight: "110%" }}>
              Ready to see your grades grow?
            </h2>
            <p className="text-[18px] text-white/90 mb-8" style={{ lineHeight: "150%" }}>
              Join thousands of students who've transformed their revision with Mentiora
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/register")} 
              className="group px-10 h-14 text-[18px] font-medium rounded-xl bg-white text-[#3B82F6] hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.p 
            className="text-[14px] text-white/80 mt-8" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            9 out of 10 students improved within 4 weeks
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default Index;
