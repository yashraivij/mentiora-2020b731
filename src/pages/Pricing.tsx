import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, X, Mail, GraduationCap } from "lucide-react";
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

  const features = [
    { name: "Predicted Grades", free: true, pro: true, schools: true },
    { name: "Smart Revision Notebook", free: false, pro: true, schools: true },
    { name: "Time Saved Tracking", free: false, pro: true, schools: true },
    { name: "Retention Insights", free: false, pro: true, schools: true },
    { name: "Subject Notes", free: "1 subject", pro: "Unlimited", schools: "Unlimited" },
    { name: "Flashcards", free: true, pro: true, schools: true },
    { name: "Mock Papers", free: "Limited", pro: "Exclusive", schools: "Exclusive" },
    { name: "Teacher Analytics", free: false, pro: false, schools: true },
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
      <section className="px-8 pt-20 pb-16 max-w-[800px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Start for free
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-[650px] mx-auto leading-relaxed">
            Your all-in-one GCSE & A-Level revision coach — personalised plans, predicted grades, and everything you need to succeed.
          </p>

          {/* Toggle Monthly/Annually */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                !isAnnual 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                isAnnual 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Annually
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            Cancel anytime. No hidden fees.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards - 3 Columns */}
      <section className="px-8 py-16 max-w-[1300px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter (Free) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 rounded-3xl shadow-sm hover:shadow-md transition-all h-full">
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
            className="relative"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-xs font-bold shadow-lg">
                MOST POPULAR
              </div>
            </div>
            
            <Card className="border-2 border-primary rounded-3xl shadow-xl hover:shadow-2xl transition-all h-full bg-gradient-to-br from-card to-accent/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-2">Pro</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-primary">
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
                  className="w-full mb-8 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
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
            <Card className="border-2 rounded-3xl shadow-sm hover:shadow-md transition-all h-full">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Compare features
          </h2>

          <div className="bg-card rounded-3xl border-2 shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-muted/50 border-b-2 border-border">
              <div className="font-bold text-sm text-foreground">Feature</div>
              <div className="text-center font-bold text-sm text-foreground">Starter</div>
              <div className="text-center font-bold text-sm bg-primary/10 rounded-lg py-2 text-primary">Pro</div>
              <div className="text-center font-bold text-sm text-foreground">Schools</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  className="grid grid-cols-4 gap-4 p-6 hover:bg-muted/20 transition-colors"
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
                  <div className="text-center bg-primary/5 rounded-lg">
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
          </div>
        </motion.div>
      </section>

      {/* Feature Summary Section */}
      <section className="px-8 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[900px] mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Everything you need to study smarter.
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Boost your grades with dynamic predicted tracking.",
              "Practice questions focused on your weakest areas.",
              "24/7 smart revision notebook that evolves with you.",
              "Instant insights and time saved analytics.",
              "Access 40+ GCSE & A-Level subjects across all major exam boards.",
              "Start immediately — change or cancel anytime."
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
                <p className="text-sm md:text-base text-foreground leading-relaxed">{feature}</p>
              </div>
            ))}
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
          <Card className="rounded-3xl border-2 shadow-xl overflow-hidden">
            <CardContent className="p-10 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Want help asking your parents?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Most students have their subscription covered by their parents. We'll help explain what Mentiora is and why it matters.
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
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Send Email →
              </Button>

              <div className="mt-8 p-6 bg-muted/50 rounded-2xl border-2 border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">Email Preview</p>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "Help Your Child Revise Smarter with Mentiora — personalized AI tutoring that predicts grades and builds study plans."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Trusted by Schools Section */}
      <section className="px-8 py-20 bg-muted/20">
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
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px] mx-auto">
            Ask your teacher for your school's discount code — teachers can offer students 20% off any Mentiora plan.
          </p>

          {/* School logos placeholder */}
          <div className="flex items-center justify-center gap-12 mb-12 flex-wrap opacity-40 grayscale">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">School {i}</span>
              </div>
            ))}
          </div>

          <Card className="max-w-[600px] mx-auto rounded-2xl border-2 shadow-md">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-3xl">
                  👩‍🏫
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground text-lg">Teachers</p>
                  <p className="text-sm text-muted-foreground">Get your school discount code</p>
                </div>
              </div>
              <p className="text-foreground mb-4">
                Email <a href="mailto:contact@mentiora.com" className="text-primary font-semibold hover:underline">contact@mentiora.com</a> to get your school code.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-24 bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[700px] mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Start your personalised<br />revision journey today.
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-10">
            Join 50,000+ students achieving their target grades with Mentiora.
          </p>
          <Button 
            onClick={handleUpgrade}
            size="lg"
            className="h-14 px-10 rounded-full bg-background text-primary hover:bg-background/90 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          >
            Get Started →
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;
