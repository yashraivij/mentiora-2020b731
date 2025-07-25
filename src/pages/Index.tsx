import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Award, Calendar, TrendingUp, Clock, Crown, Timer, Lightbulb, Shield, Rocket, ChevronRight, GraduationCap, TrendingDown, BookOpenCheck, MessageSquare, Activity, Gauge, BrainCircuit, Palette, Eye, Infinity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const benefitStats = [
    { 
      number: "90%", 
      label: "Less Study Time", 
      icon: Timer,
      color: "text-emerald-500", 
      bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
      description: "Save 15+ hours per week"
    },
    { 
      number: "2.3x", 
      label: "Faster Learning", 
      icon: Rocket,
      color: "text-blue-500", 
      bg: "bg-gradient-to-br from-blue-400 to-cyan-500",
      description: "Accelerated progress"
    },
    { 
      number: "99.2%", 
      label: "Grade Accuracy", 
      icon: Target,
      color: "text-purple-500", 
      bg: "bg-gradient-to-br from-purple-400 to-pink-500",
      description: "Precision AI marking"
    },
    { 
      number: "£1000s", 
      label: "Tutor Savings", 
      icon: Trophy,
      color: "text-amber-500", 
      bg: "bg-gradient-to-br from-amber-400 to-orange-500",
      description: "No expensive tutoring"
    }
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: "AI Super-Tutor",
      description: "World's most advanced AI understands your unique learning patterns and adapts in real-time",
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50/80 to-purple-50/80",
      accent: "border-violet-200/50"
    },
    {
      icon: Eye,
      title: "Instant Grade Predictions", 
      description: "See your exact grade trajectory with precision analytics that predict your exam performance",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50/80 to-teal-50/80",
      accent: "border-emerald-200/50"
    },
    {
      icon: Infinity,
      title: "Unlimited Practice",
      description: "Never run out of questions - infinite AI-generated practice papers tailored to your exact level",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50/80 to-cyan-50/80",
      accent: "border-blue-200/50"
    },
    {
      icon: Rocket,
      title: "10x Faster Results",
      description: "Revolutionary spaced repetition algorithms ensure you remember everything for exam day",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50/80 to-red-50/80",
      accent: "border-orange-200/50"
    }
  ];

  const premiumFeatures = [
    {
      icon: Calendar,
      title: "2026 Predicted Exam Papers",
      description: "Exclusive access to AI-generated exam papers using cutting-edge analysis of examiner patterns and trending topics. Updated weekly with new predictions.",
      badge: "EXCLUSIVE",
      color: "from-violet-600 to-purple-700",
      bgColor: "from-violet-50 to-purple-100",
      premium: true,
      timesSaved: "Save 25+ hours of paper hunting"
    },
    {
      icon: TrendingUp,
      title: "Live Grade Predictions",
      description: "Real-time grade forecasting with 95% accuracy. Watch your predicted grades rise as you improve - see exactly where you'll land on exam day.",
      badge: "AI-POWERED",
      color: "from-emerald-600 to-teal-700",
      bgColor: "from-emerald-50 to-teal-100",
      premium: true,
      timesSaved: "Know your grade weeks ahead"
    },
    {
      icon: Clock,
      title: "Smart Study Optimizer",
      description: "AI analyzes your peak learning hours and creates the perfect study schedule. Never waste time studying when your brain isn't ready.",
      badge: "REVOLUTIONARY",
      color: "from-blue-600 to-cyan-700",
      bgColor: "from-blue-50 to-cyan-100",
      premium: true,
      timesSaved: "90% more efficient studying"
    },
    {
      icon: Brain,
      title: "Memory Lock System",
      description: "Advanced spaced repetition ensures you remember everything on exam day. Our algorithm knows exactly when you'll forget and reminds you.",
      badge: "SCIENCE-BACKED",
      color: "from-amber-600 to-orange-700",
      bgColor: "from-amber-50 to-orange-100",
      premium: true,
      timesSaved: "Never forget what you learned"
    },
    {
      icon: Shield,
      title: "Stress-Free Guarantee",
      description: "Confidence tracking and anxiety reduction tools. Feel completely prepared and calm walking into any exam room.",
      badge: "CONFIDENCE",
      color: "from-pink-600 to-rose-700",
      bgColor: "from-pink-50 to-rose-100",
      premium: true,
      timesSaved: "Zero exam anxiety"
    },
    {
      icon: Trophy,
      title: "Grade Unlock System",
      description: "Gamified learning that makes studying addictive. Unlock achievements, level up your grades, and compete with friends.",
      badge: "ADDICTIVE",
      color: "from-indigo-600 to-blue-700",
      bgColor: "from-indigo-50 to-blue-100",
      premium: true,
      timesSaved: "Makes studying fun & addictive"
    }
  ];

  const socialProof = [
    {
      name: "Sophie Chen",
      grade: "Year 11 • Chemistry",
      content: "Went from D to A* in 6 weeks. This AI is literally magic - it knew exactly what I was struggling with before I even realized it myself.",
      rating: 5,
      improvement: "D → A*",
      color: "from-violet-400 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50"
    },
    {
      name: "Marcus Thompson", 
      grade: "Year 10 • Maths",
      content: "My mum was spending £400/month on tutoring. Now I'm getting better results for free and actually enjoying learning again!",
      rating: 5,
      improvement: "Saved £400/month",
      color: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      name: "Zara Ahmed",
      grade: "Year 11 • Biology",
      content: "The grade predictions were spot on - told me I'd get an A two months before exams and I did! My friends think I'm psychic now 😂",
      rating: 5,
      improvement: "Predicted A → Got A",
      color: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    }
  ];

  const timesSaved = [
    { icon: BookOpenCheck, text: "15+ hours/week saved vs traditional studying", color: "text-emerald-600" },
    { icon: Timer, text: "No more wasted time on topics you already know", color: "text-blue-600" },
    { icon: Target, text: "Focus only on your weak areas with laser precision", color: "text-purple-600" },
    { icon: TrendingUp, text: "See results 10x faster than any other method", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="container mx-auto px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20 animate-fade-in">
          <div className="flex items-center space-x-4 hover-scale">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain transition-transform duration-300 hover:rotate-12"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-violet-600 hover:bg-violet-50 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24 max-w-6xl mx-auto">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-bold mb-8 animate-fade-in hover:scale-105 transition-transform duration-300 shadow-lg">
            <Crown className="h-5 w-5 mr-2 text-violet-600 animate-pulse" />
            The World's Most Advanced GCSE AI
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-tight tracking-tight animate-fade-in">
            <span className="text-gray-900">Get the</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              A* You Deserve
            </span>
          </h2>
          
          <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium">
            Revolutionary AI that learns your weaknesses, predicts your exam performance, and 
            <span className="font-bold text-violet-600"> saves you 90% of study time</span>
          </p>

          {/* Time Saved Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto animate-fade-in">
            {timesSaved.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <benefit.icon className={`h-6 w-6 ${benefit.color} flex-shrink-0`} />
                <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 rounded-3xl group hover:scale-110 animate-fade-in mb-8"
          >
            <Rocket className="mr-3 h-6 w-6" />
            Transform My Grades Free
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Button>
          
          {/* Benefit Stats Strip */}
          <div className="mt-16 pt-8 animate-fade-in">
            <p className="text-sm text-gray-500 font-medium mb-8 text-center uppercase tracking-wider">Why Students Choose Mentiora</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {benefitStats.map((stat, index) => (
                <div key={index} className="text-center hover-scale group relative">
                  <div className={`absolute inset-0 rounded-2xl ${stat.bg} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <stat.icon className={`h-8 w-8 ${stat.color} mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`} />
                    <div className={`text-3xl lg:text-4xl font-black ${stat.color} mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revolutionary Features */}
        <div className="mb-24">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-bold mb-8 hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="h-5 w-5 mr-2 text-emerald-600 animate-pulse" />
              Revolutionary Technology
            </div>
            <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Why <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Every Student</span> Loves This
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className={`group relative overflow-hidden border-2 ${feature.accent} shadow-2xl hover:shadow-3xl transition-all duration-700 bg-gradient-to-br ${feature.bgColor} rounded-3xl hover:-translate-y-4 p-0 animate-fade-in hover:border-opacity-100`}>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-violet-700 transition-colors duration-300 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg font-medium">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-bold mb-8 hover:scale-105 transition-transform duration-300">
              <Crown className="h-5 w-5 mr-2 text-violet-600 animate-pulse" />
              Premium Features That Change Everything
            </div>
            <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Get <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Unfair Advantages</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Features so powerful, they're like having a team of expert tutors working for you 24/7</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white rounded-3xl hover:-translate-y-4 p-0 animate-fade-in">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-15 transition-opacity duration-700`} />
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-violet-700 transition-colors duration-300">{feature.title}</h3>
                        <span className={`px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 uppercase tracking-wide`}>
                          {feature.badge}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg mb-3 font-medium">{feature.description}</p>
                      <div className={`text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        💎 {feature.timesSaved}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-24">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Real Students. <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Real Results.</span>
            </h3>
            <p className="text-xl text-gray-600">Join thousands who've transformed their grades</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {socialProof.map((review, index) => (
              <Card key={index} className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.bgGradient} rounded-3xl hover:-translate-y-2 p-0 animate-fade-in`}>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg font-medium mb-6 leading-relaxed italic">"{review.content}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                      <div className="text-gray-600 text-sm">{review.grade}</div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-black bg-gradient-to-r ${review.color} text-white shadow-lg`}>
                      {review.improvement}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden animate-fade-in hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full text-white text-sm font-bold mb-6">
              <Timer className="h-4 w-4 mr-2" />
              Limited Time: Start Free Today
            </div>
            <h3 className="text-5xl lg:text-6xl font-black mb-8 tracking-tight">Ready to Get Those A*s?</h3>
            <p className="text-2xl text-violet-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Join 10,000+ students already transforming their grades with the world's most advanced GCSE AI
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-violet-600 hover:bg-gray-100 hover:text-violet-700 px-16 py-6 text-xl font-black shadow-2xl hover:shadow-white/50 transition-all duration-300 rounded-3xl group hover:scale-110"
            >
              <Rocket className="mr-3 h-6 w-6" />
              Start My Transformation Free
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <p className="text-violet-200 text-sm mt-6 font-medium">No credit card required • Cancel anytime • Results guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
