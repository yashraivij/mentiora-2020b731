import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  TrendingUp,
  Award,
  Users,
  Play,
  Sparkles,
  Check,
  Calendar,
  X,
  Menu
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-foreground">
              Mentiora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/pricing")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </button>
            <Button onClick={() => navigate("/login")} variant="ghost" size="sm">
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")} 
              size="sm" 
              className="premium-button shadow-lg"
            >
              Start Free Trial
            </Button>
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container relative z-10 px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-tight">
                Your revision, finally made{" "}
                <span className="text-gradient-primary">
                  personal
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                We guide you every step of the way — building a study plan that adapts to your goals, strengths, and progress.
              </p>

              <p className="text-lg text-muted-foreground">
                Mentiora helps you revise smarter, improve faster, and feel confident before every exam.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="premium-button shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="hover:bg-muted/50"
                >
                  Watch Demo <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                Trusted by thousands of GCSE & A-Level students preparing for 2026 exams
              </p>
            </motion.div>

            {/* Right: Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative glass-effect rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-lg font-semibold text-foreground">Your Dashboard</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted"></div>
                      <div className="w-3 h-3 rounded-full bg-muted"></div>
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Mathematics</span>
                        <span className="text-sm font-semibold text-primary">Grade 8</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Biology</span>
                        <span className="text-sm font-semibold text-primary">Grade 7</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>

                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Chemistry</span>
                        <span className="text-sm font-semibold text-primary">Grade 6</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/15 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Mentiora Guides You */}
      <section className="py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Your personal learning journey
            </h2>
            <p className="text-xl text-muted-foreground">
              From identifying weak topics to mastering your plan — Mentiora keeps you focused, structured, and improving.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  title: "Discover your strengths & gaps",
                  description: "Mentiora analyses your performance to identify exactly where you need help.",
                  icon: Target,
                },
                {
                  title: "Get your personalised weekly plan",
                  description: "Receive a structured study plan tailored to your goals and progress.",
                  icon: Calendar,
                },
                {
                  title: "See your grades rise with every session",
                  description: "Track your improvement in real-time as your predicted grades climb.",
                  icon: TrendingUp,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="relative premium-card hover-lift h-full">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* See Real Progress */}
      <section className="py-32 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
                  Watch your predicted grades improve in real time
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Track your progress with live performance data and see exactly how close you are to your target grades.
                </p>
                <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    82% of students improved by at least one grade
                  </p>
                  <p className="text-muted-foreground">in their first month with Mentiora</p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="premium-button shadow-lg"
                >
                  Try Mentiora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative glass-effect rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Grade Progress</h3>
                    
                    {/* Simple animated chart */}
                    <div className="space-y-4">
                      {[
                        { subject: "Mathematics", from: 5, to: 8 },
                        { subject: "English", from: 6, to: 8 },
                        { subject: "Science", from: 5, to: 7 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground font-medium">{item.subject}</span>
                            <span className="text-muted-foreground">
                              Grade {item.from} → <span className="text-primary font-semibold">Grade {item.to}</span>
                            </span>
                          </div>
                          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: `${(item.from / 9) * 100}%` }}
                              whileInView={{ width: `${(item.to / 9) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className="h-full bg-primary rounded-full flex items-center justify-end pr-3"
                            >
                              <TrendingUp className="h-4 w-4 text-primary-foreground" />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Pulse animation */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              All your revision tools, unified
            </h2>
            <p className="text-xl text-muted-foreground">
              From personalised notes to adaptive plans — everything is designed to make learning feel effortless.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "Smart Notebook",
                description: "Your personal notes, perfectly organised.",
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "Track your live performance for each subject.",
              },
              {
                icon: Calendar,
                title: "Weekly Plan",
                description: "Adaptive routines that change with your progress.",
              },
              {
                icon: Award,
                title: "Motivation System",
                description: "Earn streaks and rewards for consistency.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="premium-card hover-lift h-full group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smarter Than Tutoring Section */}
      <section className="py-32 bg-background">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Smarter than tutoring — 95% cheaper
            </h2>
            <p className="text-xl text-muted-foreground">
              Get the same guidance, without the cost.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Tutoring */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-muted border-muted opacity-60 h-full">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold text-muted-foreground">Traditional Tutoring</h3>
                    <div className="text-5xl font-bold text-muted-foreground">£500<span className="text-xl font-normal">/month</span></div>
                    <ul className="space-y-3 text-left text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>Limited to tutor availability</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>Generic study plans</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>No real-time progress tracking</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mentiora */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="relative glass-effect shadow-xl h-full">
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Best Value
                </div>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">Mentiora</h3>
                    <div className="text-5xl font-bold text-gradient-primary">
                      £14.99<span className="text-xl font-normal">/month</span>
                    </div>
                    <ul className="space-y-3 text-left text-foreground">
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Available 24/7, whenever you need it</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Fully personalised to your learning style</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Live performance tracking & predictions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Adaptive weekly study plans</span>
                      </li>
                    </ul>
                    <Button 
                      size="lg"
                      onClick={() => navigate('/register')}
                      className="w-full premium-button shadow-lg"
                    >
                      Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Students Say */}
      <section className="py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Students love learning with Mentiora
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "I finally understand what to revise and when. My grades have gone up by two levels.",
                author: "Maya",
                role: "GCSE Student",
                avatar: "M",
              },
              {
                quote: "It's like a tutor who actually knows me. The weekly plans keep me on track without overwhelming me.",
                author: "James",
                role: "A-Level Student",
                avatar: "J",
              },
              {
                quote: "Mentiora helped me identify my weakest topics and turn them into my strengths. Best decision I made for my exams.",
                author: "Sophie",
                role: "GCSE Student",
                avatar: "S",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="premium-card h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* See Mentiora in Action */}
      <section className="py-32 bg-background">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              See Mentiora in action
            </h2>
            <p className="text-xl text-muted-foreground">
              Your learning, visualised.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl border">
              <div className="aspect-video bg-accent/10 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="premium-button"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-primary-foreground/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-foreground/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-semibold text-primary-foreground leading-tight">
              Start your personalised revision journey today
            </h2>
            <p className="text-2xl text-primary-foreground/90 font-light">
              Your plan. Your progress. Your results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-background text-primary hover:bg-background/90 shadow-2xl hover:scale-105 transition-all text-lg px-8 py-6 h-auto"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="link"
                className="text-primary-foreground hover:text-primary-foreground/80 text-lg"
              >
                See How It Works
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center gap-3 text-primary-foreground">
              <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-xl border border-primary-foreground/20 px-6 py-3 rounded-full shadow-lg">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">9/10 students improved within 4 weeks</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-16">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                  alt="Mentiora" 
                  className="h-8 w-8"
                />
                <span className="text-lg font-semibold text-foreground">Mentiora</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your personalised revision coach for GCSE & A-Level success.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-foreground transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button className="hover:text-foreground transition-colors">Features</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">About</button></li>
                <li><button className="hover:text-foreground transition-colors">Blog</button></li>
                <li><button className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Privacy</button></li>
                <li><button className="hover:text-foreground transition-colors">Terms</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Mentiora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;