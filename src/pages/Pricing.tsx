import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Sparkles, Lock, Shield, Zap, Brain, TrendingUp, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpgrade = () => {
    openPaymentLink();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <div className="border-b border-border/40">
        <div className="flex items-center justify-between px-8 py-4 max-w-[1400px] mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <img src="/src/assets/mentiora-logo.png" alt="Mentiora" className="h-6 w-6" />
            <span className="text-sm font-medium text-foreground">Mentiora</span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Button>
        </div>
      </div>

      {/* Hero - Clean and Minimal */}
      <section className="px-8 pt-24 pb-16 max-w-[900px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Premium</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
            Get the grades<br />you're capable of
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-[600px] mx-auto">
            AI-powered revision that adapts to you. Predict your exam results. Master your weak spots.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={handleUpgrade}
              className="bg-foreground hover:bg-foreground/90 text-background font-medium px-8 h-12 text-sm rounded-lg"
            >
              Start 7-day free trial
            </Button>
            <p className="text-xs text-muted-foreground">
              Then £14.99/month • Cancel anytime
            </p>
          </div>
        </motion.div>
      </section>

      {/* Visual Proof Section */}
      <section className="px-8 py-20 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Know your predicted grades
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Advanced AI analyzes your performance to predict your final exam grades with accuracy. See exactly where you stand and what you need to improve.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time grade predictions across all subjects",
                  "See exactly how far from your target grade",
                  "Updated after every practice session"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Grade Predictions Visual */}
            <Card className="border border-border/50 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-background to-muted/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold">Your Predictions</h3>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { subject: "Mathematics", current: 5, predicted: 8, target: 9, progress: 75 },
                      { subject: "Physics", current: 4, predicted: 6, target: 7, progress: 57 },
                      { subject: "Chemistry", current: 6, predicted: 8, target: 9, progress: 67 }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.subject}</span>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-muted-foreground">Current {item.current}</span>
                            <span className="text-primary font-semibold">Predicted {item.predicted}</span>
                            <span className="text-muted-foreground">Target {item.target}</span>
                          </div>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2026 Exam Papers */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div className="md:order-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Practice with 2026 predicted papers
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Get early access to AI-predicted exam questions based on curriculum changes and past patterns. Practice exactly what you'll see in your exams.
              </p>
              <ul className="space-y-3">
                {[
                  "Full exam papers predicted for 2026",
                  "Questions match your exam board exactly",
                  "Instant AI marking with detailed feedback"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="md:order-1 border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-0.5">2026 Predicted Exam</h3>
                    <p className="text-xs text-muted-foreground">Mathematics Paper 1 • Foundation</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    90 min
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  {[
                    { q: 1, text: "Solve the equation 3x + 7 = 22", marks: 2 },
                    { q: 2, text: "Find the area of a circle with radius 5cm", marks: 3 },
                    { q: 3, text: "Expand and simplify (x + 3)(x - 2)", marks: 3 }
                  ].map((item) => (
                    <div key={item.q} className="border-l-2 border-primary/40 pl-4 py-2">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs font-semibold">Question {item.q}</span>
                        <span className="text-xs text-primary">[{item.marks} marks]</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Notes */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Your revision notes, automatically
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                AI generates personalized notes from every practice session. Never lose track of what you need to revise.
              </p>
              <ul className="space-y-3">
                {[
                  "Notes generated from your answers",
                  "Organized by topic and weakness",
                  "Export to PDF for offline revision"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold mb-4">Recent Notes</h3>
                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", topic: "Quadratic Equations", color: "border-blue-500" },
                    { subject: "Physics", topic: "Newton's Laws", color: "border-purple-500" },
                    { subject: "Chemistry", topic: "Periodic Table", color: "border-green-500" }
                  ].map((note, i) => (
                    <div key={i} className={`border-l-2 ${note.color} pl-3 py-2 bg-muted/20 rounded-r`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{note.subject}</span>
                        <span className="text-xs text-muted-foreground">• {note.topic}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Key concepts and formulas from your last practice session...
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Pricing - Simple and Clear */}
      <section className="px-8 py-24 bg-muted/20">
        <div className="max-w-[600px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 tracking-tight">
              Start your free trial
            </h2>

            <Card className="border border-border/50 shadow-sm mb-8">
              <CardContent className="p-10">
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold tracking-tight">£14.99</span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">7 days free, then £14.99/month</p>
                </div>

                <div className="space-y-3 mb-8 text-left">
                  {[
                    "Unlimited practice questions",
                    "AI-powered grade predictions",
                    "2026 predicted exam papers",
                    "Automatic revision notes",
                    "Personalized weak spot analysis",
                    "Progress tracking & insights"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleUpgrade}
                  size="lg"
                  className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium h-12 text-sm rounded-lg mb-4"
                >
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3 w-3" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Join 10,000+ students achieving their target grades with Premium
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - Minimal */}
      <section className="px-8 py-16 max-w-[1000px] mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            { stat: "95%", label: "See grade improvements" },
            { stat: "3.7x", label: "More likely to hit targets" },
            { stat: "15hrs", label: "Saved per month" }
          ].map((item, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-2">{item.stat}</div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-6 px-8 py-4 max-w-[1400px] mx-auto">
          <div>
            <p className="text-sm font-medium">Ready to achieve your target grades?</p>
            <p className="text-xs text-muted-foreground">Start your 7-day free trial today</p>
          </div>
          <Button
            onClick={handleUpgrade}
            className="bg-foreground hover:bg-foreground/90 text-background font-medium px-6 h-10 text-sm rounded-lg flex-shrink-0"
          >
            Start free trial
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
