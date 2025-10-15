import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, X, Mail, GraduationCap, Target, Clock, TrendingUp, BookOpen, Zap, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const handleUpgrade = () => {
    openPaymentLink();
  };

  const handleSendParentEmail = () => {
    if (!studentName || !parentEmail) {
      toast({
        title: "Missing information",
        description: "Please enter both your name and parent's email.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Email sent!",
      description: "We've sent an email to your parent explaining Mentiora.",
    });
    setStudentName("");
    setParentEmail("");
  };

  const featureCategories = [
    {
      category: "Core Tools",
      features: [
        { name: "Predicted Grades", free: true, pro: true, schools: true },
        { name: "Flashcards", free: true, pro: true, schools: true },
        { name: "Subject Notes", free: "1 subject", pro: "Unlimited", schools: "Unlimited" },
      ]
    },
    {
      category: "Smart Insights",
      features: [
        { name: "Time Saved Tracking", free: false, pro: true, schools: true },
        { name: "Retention Insights", free: false, pro: true, schools: true },
        { name: "Smart Revision Notebook", free: false, pro: true, schools: true },
      ]
    },
    {
      category: "Advanced Learning",
      features: [
        { name: "Mock Papers", free: "Limited", pro: "Exclusive", schools: "Exclusive" },
        { name: "Teacher Analytics", free: false, pro: false, schools: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40">
        <div className="flex items-center justify-between px-8 py-5 max-w-[1400px] mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <img src="/src/assets/mentiora-logo.png" alt="Mentiora" className="h-7 w-7" />
            <span className="text-base font-semibold text-foreground">Mentiora</span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-8 pt-24 pb-32 max-w-[1400px] mx-auto overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FBFF] via-[#FCFDFF] to-background pointer-events-none" />
        
        {/* Floating Dashboard Mockups */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-20 left-[5%] w-72 h-40 hidden lg:block"
        >
          <div className="bg-gradient-to-br from-card to-primary/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-4 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Predicted Grades</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Mathematics</span>
                <span className="text-sm font-bold text-primary">Grade 8</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-gradient-to-r from-primary to-accent rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 3 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-32 right-[5%] w-64 h-36 hidden lg:block"
        >
          <div className="bg-gradient-to-br from-card to-accent/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-4 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-accent" />
              <p className="text-xs font-semibold text-foreground">Study Peak</p>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 60, 80, 70, 90, 75, 85].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-accent to-primary rounded-t" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Best time: 6-8pm</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute bottom-20 left-[10%] w-56 h-32 hidden lg:block"
        >
          <div className="bg-gradient-to-br from-card to-primary/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-4 transform hover:scale-105 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Retention Rate</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">87%</span>
              <span className="text-xs text-green-500">+12%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. last week</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-[800px] mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Your personal revision coach —<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">built to understand how you learn.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-[700px] mx-auto leading-relaxed">
            AI that adapts to your progress, predicts your grades, and guides you every step of the way.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button 
              onClick={() => navigate("/register")}
              size="lg"
              className="h-14 px-10 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-105 transition-all"
            >
              Start Free →
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="lg"
              className="h-14 px-10 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold text-lg transition-all hover:scale-105"
            >
              Explore Dashboard →
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Trusted by GCSE & A-Level students preparing for 2026 exams.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards - 3 Columns */}
      <section className="px-8 py-20 max-w-[1300px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Starter (Free) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 rounded-3xl shadow-lg shadow-border/20 hover:shadow-xl hover:shadow-border/30 transition-all h-full backdrop-blur-sm bg-card/95 overflow-hidden">
              {/* Mini Visual Preview */}
              <div className="h-24 bg-gradient-to-br from-muted to-primary/5 flex items-center justify-center border-b border-border/50">
                <div className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Grade Preview</p>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-2">Starter</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-foreground">Free</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Get started with basics</p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => navigate("/register")}
                  className="w-full mb-8 h-12 rounded-full font-semibold"
                >
                  Start Free →
                </Button>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">Features</p>
                  {[
                    "1 subject",
                    "Predicted grade preview",
                    "Basic quizzes",
                    "Limited AI guidance"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative md:-mt-4"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/30">
                RECOMMENDED FOR YOU
              </div>
            </div>
            
            <Card className="border-2 border-primary rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_0_60px_rgba(59,130,246,0.3)] transition-all h-full bg-gradient-to-br from-card via-primary/5 to-accent/10 backdrop-blur-sm overflow-hidden relative">
              {/* Gradient halo underneath */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-primary to-accent blur-2xl opacity-50" />
              
              {/* Mini Visual Preview with Dashboard Elements */}
              <div className="h-28 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center gap-4 border-b border-primary/20 px-4">
                <div className="flex-1 text-center">
                  <BarChart3 className="h-6 w-6 text-primary mx-auto mb-1" />
                  <div className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-full w-16 mx-auto" />
                </div>
                <div className="flex-1 text-center">
                  <BookOpen className="h-6 w-6 text-accent mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Smart Notes</p>
                </div>
                <div className="flex-1 text-center">
                  <Zap className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">14h saved</p>
                </div>
              </div>
              
              <CardContent className="p-8 relative z-10">
                <h3 className="text-xl font-bold text-foreground mb-2">Pro</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      £{isAnnual ? "12.99" : "14.99"}
                    </span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isAnnual ? "Billed annually (save 13%)" : "Billed monthly"}
                  </p>
                </div>

                <Button 
                  onClick={handleUpgrade}
                  className="w-full mb-8 h-12 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all"
                >
                  Subscribe →
                </Button>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">Everything in Free, plus</p>
                  {[
                    "Unlimited subjects",
                    "Dynamic predicted grades",
                    "Personalised revision notebook",
                    "Smart topic tracking & insights",
                    "Exclusive predicted papers",
                    "24/7 AI study assistant"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Schools / Tutors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-2 rounded-3xl shadow-lg shadow-border/20 hover:shadow-xl hover:shadow-border/30 transition-all h-full backdrop-blur-sm bg-card/95 overflow-hidden">
              {/* Mini Visual Preview */}
              <div className="h-24 bg-gradient-to-br from-muted to-accent/5 flex items-center justify-center border-b border-border/50">
                <div className="text-center">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Group Analytics</p>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-2">Schools / Tutors</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-foreground">Custom</span>
                  </div>
                  <p className="text-sm text-muted-foreground">For institutions & educators</p>
                </div>

                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "mailto:contact@mentiora.com?subject=School%20Inquiry"}
                  className="w-full mb-8 h-12 rounded-full font-semibold"
                >
                  Contact Team →
                </Button>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">Everything in Pro, plus</p>
                  {[
                    "Central progress dashboard",
                    "Group performance tracking",
                    "Custom onboarding & training",
                    "Priority support",
                    "Volume discounts"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-8 py-20 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Compare features
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-[600px] mx-auto">
            See what's included in each plan to find the perfect fit for your revision needs.
          </p>

          <div className="bg-gradient-to-br from-card/50 to-primary/5 rounded-3xl border-2 shadow-xl overflow-hidden backdrop-blur-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-muted/30 border-b-2 border-border/50">
              <div className="font-bold text-sm text-foreground">Feature</div>
              <div className="text-center font-bold text-sm text-foreground">Starter</div>
              <div className="text-center font-bold text-sm bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg py-2 text-primary">Pro</div>
              <div className="text-center font-bold text-sm text-foreground">Schools</div>
            </div>

            {/* Table Body with Categories */}
            <div className="divide-y divide-border/50">
              {featureCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  {/* Category Header */}
                  <div className="bg-muted/20 px-6 py-3 border-b border-border/30">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">{category.category}</h4>
                  </div>
                  
                  {/* Category Features */}
                  {category.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="grid grid-cols-4 gap-4 p-6 hover:bg-primary/5 transition-all duration-200 bg-[#F9FBFF] even:bg-card"
                    >
                      <div className="font-medium text-sm text-foreground">{feature.name}</div>
                      <div className="text-center">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{feature.free}</span>
                        )}
                      </div>
                      <div className="text-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg py-1">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs font-medium text-primary">{feature.pro}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.schools === "boolean" ? (
                          feature.schools ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{feature.schools}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Section */}
      <section className="px-8 py-20 bg-gradient-to-b from-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1200px] mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Everything you need to study smarter.
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-[600px] mx-auto">
            Your complete revision toolkit, designed to help you achieve your target grades.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: BarChart3, 
                title: "Predicted Grades",
                text: "Dynamic grade tracking that adapts to your progress.",
                visual: (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Mathematics</span>
                      <span className="font-bold text-primary">Grade 8</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[80%] bg-gradient-to-r from-primary to-accent"></div>
                    </div>
                  </div>
                )
              },
              { 
                icon: Clock, 
                title: "Time Saved Tracking",
                text: "See exactly how much time Mentiora saves you.",
                visual: (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">14h</span>
                    <span className="text-xs text-muted-foreground">saved this month</span>
                  </div>
                )
              },
              { 
                icon: BookOpen, 
                title: "Smart Notebook",
                text: "AI-generated notes that evolve with your learning.",
                visual: (
                  <div className="mt-4 bg-muted/50 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-semibold text-foreground">Chemical Bonding</div>
                    <div className="text-muted-foreground">Ionic bonds form when...</div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">Key Topic</span>
                    </div>
                  </div>
                )
              },
              { 
                icon: Target, 
                title: "Weak Topic Detection",
                text: "Practice questions focused on your weakest areas.",
                visual: (
                  <div className="mt-4 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chemical Bonding</span>
                      <span className="text-red-500">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organic Chemistry</span>
                      <span className="text-yellow-500">68%</span>
                    </div>
                  </div>
                )
              },
              { 
                icon: TrendingUp, 
                title: "Retention Insights",
                text: "Track how well you're retaining information over time.",
                visual: (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">87%</span>
                    <span className="text-xs text-green-500 font-semibold">+12%</span>
                  </div>
                )
              },
              { 
                icon: Zap, 
                title: "Instant Access",
                text: "Start immediately — change or cancel anytime.",
                visual: (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Zap className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                )
              }
            ].map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gradient-to-br from-card to-primary/5 rounded-2xl p-6 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.02] backdrop-blur-sm border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{feature.text}</p>
                  {feature.visual}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Ask My Parents Section */}
      <section className="px-8 py-20 max-w-[800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="rounded-3xl border-2 shadow-2xl overflow-hidden bg-gradient-to-br from-[#F0F8FF] via-card to-background backdrop-blur-sm">
            <CardContent className="p-10 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                      <Mail className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        Want help asking your parents?
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Most students have their plan covered by their parents. We'll send a simple email explaining how Mentiora helps you stay confident and on track for your exams.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Input
                      placeholder="Your name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                    <Input
                      type="email"
                      placeholder="Parent or Guardian Email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <Button 
                    onClick={handleSendParentEmail}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all"
                  >
                    Send Email →
                  </Button>
                </div>
                
                {/* Email Preview Card with Illustration */}
                <div className="relative">
                  <div className="absolute -top-8 right-8 text-6xl opacity-20">✉️</div>
                  <div className="p-6 bg-gradient-to-br from-card to-primary/10 rounded-2xl border-2 border-border/50 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground">Email Preview</p>
                    </div>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "Help Your Child Revise Smarter with Mentiora — AI that predicts grades and builds study plans."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Trusted by Schools Section */}
      <section className="relative px-8 py-20 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
        {/* Top Decorative gradient line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1000px] mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by GCSE & A-Level students across the UK.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px] mx-auto leading-relaxed">
            Ask your teacher for your school's discount code — teachers can offer students <span className="font-bold text-primary">20% off</span> any Mentiora plan.
          </p>

          {/* School logos */}
          <div className="flex items-center justify-center gap-12 mb-16 flex-wrap opacity-60 grayscale hover:opacity-80 transition-opacity">
            {["Forest", "QE", "Chiswick", "Saracens"].map((school, i) => (
              <div key={i} className="w-32 h-16 bg-muted/50 rounded-xl flex items-center justify-center border border-border/30 hover:scale-105 transition-transform">
                <span className="text-sm font-semibold text-muted-foreground">{school}</span>
              </div>
            ))}
          </div>

          <Card className="max-w-[600px] mx-auto rounded-2xl border-2 shadow-xl bg-gradient-to-br from-card to-primary/5 backdrop-blur-sm hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-lg shadow-primary/30">
                  👩‍🏫
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground text-xl">Teachers</p>
                  <p className="text-sm text-muted-foreground">Get your school discount code</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">
                Email <a href="mailto:contact@mentiora.com" className="text-primary font-bold hover:underline transition-all">contact@mentiora.com</a> to get your school code.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Bottom Decorative gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      {/* Final CTA */}
      <section className="relative px-8 py-28 bg-gradient-to-br from-primary via-[#5B8EF6] to-accent overflow-hidden">
        {/* Blurred Dashboard Mockup Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-40 bg-card/20 rounded-2xl backdrop-blur-3xl border border-primary-foreground/10" />
          <div className="absolute bottom-10 right-10 w-80 h-48 bg-card/20 rounded-2xl backdrop-blur-3xl border border-primary-foreground/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-56 bg-card/20 rounded-2xl backdrop-blur-3xl border border-primary-foreground/10" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-[700px] mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Start your personalised<br />revision journey today.
          </h2>
          <p className="text-lg text-primary-foreground/95 mb-10 leading-relaxed">
            Join thousands of students achieving their target grades with Mentiora's AI-powered revision coach.
          </p>
          <Button 
            onClick={handleUpgrade}
            size="lg"
            className="h-16 px-12 rounded-full bg-background text-primary hover:bg-background/95 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          >
            Join Mentiora →
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;
