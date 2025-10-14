import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Check, Target, Brain, FileCheck, TrendingUp, BookOpen, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold text-foreground">Mentiora</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-6"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Trusted by 30,000+ students
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            AI tutor built for<br />
            <span className="text-primary">GCSE & A-Level success</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Get personalized exam practice, instant marking, and predicted questions tailored to your exam board. All for 95% less than a private tutor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
            >
              Start learning free
            </Button>
            <Button 
              onClick={() => navigate('/pricing')}
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-lg"
            >
              View pricing
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">No credit card required • Free forever</p>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-8 text-sm text-muted-foreground flex-wrap">
          <span>Microsoft for Startups</span>
          <span>UKRI Innovate UK</span>
          <span>Google for Startups</span>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything you need to ace your exams
          </h2>
          <p className="text-xl text-muted-foreground">
            Study smarter with AI-powered tools designed for UK exam boards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <FileCheck className="w-8 h-8 text-primary" />,
              title: "AI Marking & Feedback",
              description: "Get your answers marked instantly with detailed feedback on how to improve, just like a real examiner would."
            },
            {
              icon: <Target className="w-8 h-8 text-primary" />,
              title: "Personalized Study Plans",
              description: "Focus on your weakest topics automatically. The AI identifies gaps and creates a custom revision plan."
            },
            {
              icon: <Brain className="w-8 h-8 text-primary" />,
              title: "Predicted Exam Questions",
              description: "Practice with AI-generated questions that mirror your actual exam format and difficulty level."
            },
            {
              icon: <BookOpen className="w-8 h-8 text-primary" />,
              title: "Smart Revision Notes",
              description: "Access concise, exam-board-specific notes for every topic in your syllabus."
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-primary" />,
              title: "Grade Predictions",
              description: "See your predicted grades in real-time and track your progress as you improve."
            },
            {
              icon: <Sparkles className="w-8 h-8 text-primary" />,
              title: "24/7 AI Chat Tutor",
              description: "Ask questions anytime and get instant, detailed explanations in simple language."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Coverage */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Built for your exam board
            </h2>
            <p className="text-xl text-muted-foreground">
              Content tailored to AQA, Edexcel, OCR, and Eduqas specifications
            </p>
          </div>

          {/* Exam Boards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {['AQA', 'Edexcel', 'OCR', 'Eduqas'].map((board) => (
              <div 
                key={board} 
                className="bg-card border border-border rounded-xl py-6 px-8 text-center font-bold text-2xl text-foreground shadow-sm"
              >
                {board}
              </div>
            ))}
          </div>

          {/* Subjects */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '📐', name: 'Maths', tag: 'GCSE' },
              { icon: '📖', name: 'English', tag: 'GCSE' },
              { icon: '🧬', name: 'Biology', tag: 'GCSE' },
              { icon: '⚗️', name: 'Chemistry', tag: 'GCSE' },
              { icon: '⚛️', name: 'Physics', tag: 'GCSE' },
              { icon: '💻', name: 'Computer Science', tag: 'GCSE' },
              { icon: '🧠', name: 'Psychology', tag: 'GCSE & A-Level' },
              { icon: '🌍', name: 'Geography', tag: 'GCSE' },
              { icon: '📚', name: 'History', tag: 'GCSE' },
              { icon: '💼', name: 'Business', tag: 'GCSE' },
              { icon: '🕊️', name: 'Religious Studies', tag: 'GCSE' },
              { icon: '🎵', name: 'Music', tag: 'GCSE' },
            ].map((subject, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{subject.icon}</div>
                <div className="font-semibold text-card-foreground text-sm">{subject.name}</div>
                <div className="text-xs text-muted-foreground">{subject.tag}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Don't see your subject? <button className="text-primary hover:underline">Request it here</button>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Your path to better grades
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple, effective, and personalized to you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "1",
              title: "Tell us your subjects",
              description: "Select your exam board and the subjects you're studying. We'll customize everything to your curriculum."
            },
            {
              step: "2",
              title: "Practice with AI marking",
              description: "Answer exam-style questions and get instant feedback. The AI identifies your weak areas and adapts."
            },
            {
              step: "3",
              title: "Watch your grades improve",
              description: "Track your progress with predicted grades and personalized insights. Most students see 68% improvement."
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Trusted by students across the UK
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from real students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "My daughter is quite shy and never liked asking questions in class, now she asks the AI tutor anything. She's becoming more confident in class too. It's been transformative for her learning.",
                author: "Lisa K.",
                role: "Parent of Year 11 student"
              },
              {
                quote: "FANTASTIC! Easy to use and navigate and really good for understanding in more depth as if you get something wrong it will help you understand why! I love it so far :)",
                author: "Sarah",
                role: "Year 11 student"
              },
              {
                quote: "OMG it's like a real life science tutor that's teaching me, but available at any time!",
                author: "James",
                role: "Year 10 student"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6"
              >
                <p className="text-card-foreground mb-4 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Better than a tutor,<br />
            <span className="text-primary">95% cheaper</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get personalized support without the premium price tag
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Private Tutor */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="text-sm text-muted-foreground mb-2">Private Tutor</div>
            <div className="text-5xl font-bold text-foreground mb-6">
              £500<span className="text-2xl text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-muted-foreground">
                <div className="mt-1 text-muted">•</div>
                <span>Limited to scheduled sessions</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <div className="mt-1 text-muted">•</div>
                <span>1-2 hours per week</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <div className="mt-1 text-muted">•</div>
                <span>Subject to availability</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <div className="mt-1 text-muted">•</div>
                <span>One subject focus</span>
              </li>
            </ul>
          </div>

          {/* Mentiora */}
          <div className="bg-primary rounded-2xl p-8 text-primary-foreground shadow-xl relative">
            <div className="absolute -top-4 right-8 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
              Best Value
            </div>
            <div className="text-sm opacity-80 mb-2">Mentiora Premium</div>
            <div className="text-5xl font-bold mb-6">
              £24.99<span className="text-2xl opacity-80">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Available 24/7, unlimited practice</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>All subjects included</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Instant AI marking & feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Personalized study plans</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>68% average grade improvement</span>
              </li>
            </ul>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="w-full bg-background text-foreground hover:bg-background/90 rounded-full"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Ready to transform your revision?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join 30,000+ students already achieving better grades with Mentiora.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
          >
            Start learning for free
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold text-foreground">Mentiora</span>
            </div>
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
