import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  TrendingUp,
  Calendar,
  Brain,
  Home,
  Trophy,
  Flame
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import mentioraLogo from "@/assets/mentiora-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - matches dashboard nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={mentioraLogo} 
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
            {user ? (
              <Button onClick={() => navigate("/dashboard")} className="premium-button shadow-lg">
                Dashboard
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Dashboard Style */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-tight">
                  Your revision, finally made{" "}
                  <span className="text-gradient-primary">
                    personal
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The GCSE & A-Level tutor built around you — Mentiora adapts to your goals, strengths, and progress.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="premium-button shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-muted/50"
                >
                  Explore Dashboard
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                No credit card required
              </p>
            </motion.div>

            {/* Right: Dashboard Preview - Real Card Style */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="premium-card rounded-2xl p-8 shadow-lg space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="text-lg font-semibold text-foreground">Your Subjects</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
                
                {/* Subject Cards - Exactly like dashboard */}
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", grade: "8", retention: "85%", hours: "12.5h" },
                    { subject: "Biology", grade: "7", retention: "78%", hours: "9.2h" },
                    { subject: "Chemistry", grade: "7", retention: "72%", hours: "8.8h" }
                  ].map((item, i) => (
                    <div key={i} className="premium-card p-4 rounded-xl hover-lift cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">{item.subject}</span>
                        <span className="text-sm font-semibold text-primary">Grade {item.grade}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Retention {item.retention}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid - Dashboard Card Style */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Everything you need to excel
            </h2>
            <p className="text-xl text-muted-foreground">
              From personalized plans to real-time tracking — all in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Predicted Grades",
                description: "See your predicted grade for every subject in real-time",
                stats: "Grade 8 →",
              },
              {
                icon: TrendingUp,
                title: "Retention Tracking",
                description: "Monitor how much you're retaining from each topic",
                stats: "85% avg",
              },
              {
                icon: Calendar,
                title: "Study Time",
                description: "Track your focus hours and optimize your schedule",
                stats: "12.5h this week",
              },
              {
                icon: BookOpen,
                title: "Smart Notebook",
                description: "AI-generated notes that adapt to your learning style",
                stats: "24 entries",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="premium-card hover-lift h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-xs font-medium text-primary">{feature.stats}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
                Your progress, visualized
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Track your performance across all subjects with real-time insights and personalized recommendations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground">See predicted grades update as you study</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Identify weak topics automatically</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Get personalized weekly study plans</p>
                </div>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="premium-button shadow-lg"
              >
                See Your Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="premium-card rounded-2xl p-8 shadow-lg">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Performance Overview</h3>
                  
                  {/* Progress bars like dashboard */}
                  <div className="space-y-4">
                    {[
                      { subject: "Mathematics", score: 85, color: "bg-primary" },
                      { subject: "English", score: 78, color: "bg-primary" },
                      { subject: "Science", score: 72, color: "bg-primary" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground font-medium">{item.subject}</span>
                          <span className="text-muted-foreground">{item.score}%</span>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Dashboard Card Style */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Trusted by students nationwide
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of GCSE & A-Level students improving their grades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: "30,000+", label: "Active Students", icon: Trophy },
              { value: "85%", label: "Improved Grades", icon: TrendingUp },
              { value: "500k+", label: "Questions Completed", icon: Brain }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="premium-card text-center">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dashboard Style */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="premium-card rounded-3xl p-12 text-center shadow-xl"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
                Start your revision journey today
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students using Mentiora to achieve their target grades
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="premium-button shadow-lg text-lg px-8 py-6"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">No credit card required</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Dashboard Style */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={mentioraLogo} alt="Mentiora" className="h-6 w-6" />
                <span className="text-lg font-semibold text-foreground">Mentiora</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your personalized GCSE & A-Level revision platform
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/practice')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Practice</button></li>
                <li><button onClick={() => navigate('/flashcards')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Flashcards</button></li>
                <li><button onClick={() => navigate('/notebook')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Notebook</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/pricing')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Mentiora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
