import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Check, BookOpen, Brain, Target, Sparkles, TrendingUp, Calendar, Award, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check for password reset tokens in URL hash and redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);

  const platformFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Marking',
      description: 'Get instant, detailed feedback on every answer with exam board-specific marking criteria.',
      visual: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: Target,
      title: 'Personalized Study Plans',
      description: 'AI identifies your weak areas and creates a custom revision schedule just for you.',
      visual: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Calendar,
      title: 'Predicted Exam Papers',
      description: 'Practice with AI-generated papers that predict likely exam questions.',
      visual: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Smart Revision Notes',
      description: 'Automatically generated notes tailored to your learning style and exam board.',
      visual: 'bg-gradient-to-br from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Grade Predictions',
      description: 'Track your progress with accurate grade predictions based on your performance.',
      visual: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Award,
      title: 'Topic Mastery',
      description: 'Visual breakdown of your understanding across all topics in your syllabus.',
      visual: 'bg-gradient-to-br from-rose-50 to-pink-50',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600'
    }
  ];

  const subjects = [
    { emoji: '🧬', name: 'Biology', color: 'bg-emerald-100 hover:bg-emerald-200' },
    { emoji: '⚗️', name: 'Chemistry', color: 'bg-purple-100 hover:bg-purple-200' },
    { emoji: '⚛️', name: 'Physics', color: 'bg-blue-100 hover:bg-blue-200' },
    { emoji: '📐', name: 'Maths', color: 'bg-cyan-100 hover:bg-cyan-200' },
    { emoji: '💻', name: 'Computer Science', color: 'bg-indigo-100 hover:bg-indigo-200' },
    { emoji: '🧠', name: 'Psychology', color: 'bg-pink-100 hover:bg-pink-200' },
    { emoji: '📚', name: 'History', color: 'bg-amber-100 hover:bg-amber-200' },
    { emoji: '🌍', name: 'Geography', color: 'bg-teal-100 hover:bg-teal-200' },
  ];

  const stats = [
    { value: '2.3', label: 'Average Grade Improvement', suffix: ' grades' },
    { value: '67%', label: 'Time Saved vs Traditional Study', suffix: '' },
    { value: '94%', label: 'Students Achieve Target Grade', suffix: '' },
    { value: '30k+', label: 'Students Using Mentiora', suffix: '' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold text-gray-900">Mentiora</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-gray-900 hidden sm:block"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
                  >
                    Try Mentiora
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your personal GCSE and<br />A-Level tutor.
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Mentiora adapts to how you learn — identifying what to revise next and helping you make every study session count.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg w-full sm:w-auto"
            >
              Start Learning Free
            </Button>
            <Button 
              onClick={() => navigate('/pricing')}
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg w-full sm:w-auto border-2"
            >
              View Pricing
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">No credit card required • 30,000+ students</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features - Hero Grid */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to ace your exams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you study smarter, not harder
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 ${feature.visual} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`${feature.iconBg} ${feature.iconColor} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              All your subjects in <span className="text-primary">one place</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive coverage across GCSE and A-Level subjects
            </p>
          </div>

          {/* Exam Boards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['AQA', 'Edexcel', 'OCR', 'Eduqas'].map((board) => (
              <div key={board} className="bg-white border-2 border-gray-200 rounded-xl px-6 py-3 font-bold text-gray-900 hover:border-primary hover:text-primary transition-all">
                {board}
              </div>
            ))}
          </div>

          {/* Subject Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {subjects.map((subject, index) => (
              <div 
                key={index} 
                className={`${subject.color} rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg`}
              >
                <div className="text-4xl mb-2">{subject.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm">{subject.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase - Large Cards */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Feature 1: AI Marking */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Instant Feedback</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Get marked like you're in an actual exam
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our AI examiner marks your answers using real exam board marking criteria, showing you exactly where you gained and lost marks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Detailed mark breakdowns with examiner comments</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Learn exactly what examiners look for</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Get model answers to learn from</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-cyan-50 rounded-3xl p-8 h-96 flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <Award className="w-20 h-20 text-primary mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900">AI Marking Demo</p>
                <p className="text-gray-600">Visual placeholder for marking interface</p>
              </div>
            </div>
          </div>

          {/* Feature 2: Personalized Learning */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 h-96 flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <Brain className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-900">Adaptive Study Plan</p>
                  <p className="text-gray-600">Visual placeholder for personalized dashboard</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Smart AI</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Study plan that adapts to you
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Mentiora analyzes your performance and creates a personalized revision schedule, focusing on your weakest topics first.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">AI identifies your knowledge gaps automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Recommended study topics updated daily</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Track mastery across all syllabus topics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Predicted Papers */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600">Exam Ready</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Practice with predicted exam papers
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get access to AI-generated predicted exam papers that mirror the format and style of real exams, updated weekly.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Papers based on past exam patterns and trends</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Full marking schemes and model answers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Timed exam mode for realistic practice</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 h-96 flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <Calendar className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900">Predicted Papers</p>
                <p className="text-gray-600">Visual placeholder for exam interface</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-primary">30,000+ students</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            From top UK schools including Harris Academy, Forest School, and more
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-5xl mb-4">📈</div>
              <p className="text-gray-700 italic mb-4">
                "My daughter is quite shy and never liked asking questions in class, now she asks the AI tutor anything. It's been transformative for her learning."
              </p>
              <p className="font-semibold text-gray-900">Lisa K.</p>
              <p className="text-sm text-gray-500">Parent of Year 11 student</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-5xl mb-4">⭐</div>
              <p className="text-gray-700 italic mb-4">
                "FANTASTIC! Easy to use and really good for understanding in more depth as if you get something wrong it will help you understand why!"
              </p>
              <p className="font-semibold text-gray-900">Sarah</p>
              <p className="text-sm text-gray-500">Year 11 student</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-gray-700 italic mb-4">
                "OMG it's like a real life science tutor that's teaching me, but available at any time!"
              </p>
              <p className="font-semibold text-gray-900">James</p>
              <p className="text-sm text-gray-500">Year 10 student</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Start your journey to top grades
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join 30,000+ students already achieving their target grades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-50 rounded-full px-8 py-6 text-lg"
              >
                Start Free Trial
              </Button>
              <Button 
                onClick={() => navigate('/pricing')}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold text-white">Mentiora</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Mentiora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
