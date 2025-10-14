import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Check } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora" 
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold text-gray-900">Mentiora</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 h-10"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-gray-900 hidden sm:inline-flex"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-10"
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
          The world's first AI tutor for GCSE and A-Levels
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Boost grades with your AI Tutor and Examiner for all major GCSE, IGCSE, A-Level and IB subjects
        </p>
        
        <Button 
          onClick={() => navigate('/register')}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 text-base"
        >
          Try now for free
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">No credit card required</p>
      </section>

      {/* Subject Cards Section */}
      <section className="bg-[#E8F4FD] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">GCSE Maths</h3>
              <p className="text-gray-600 mb-4">Get step-by-step guidance to solve maths problems.</p>
              <button 
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline text-sm"
              >
                Try it now →
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">GCSE English</h3>
              <p className="text-gray-600 mb-4">Learn how to structure your answers for each question.</p>
              <button 
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline text-sm"
              >
                Try it now →
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">GCSE Science</h3>
              <p className="text-gray-600 mb-4">Apply your knowledge in 'Explain', and 'Suggest' questions.</p>
              <button 
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline text-sm"
              >
                Try it now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Unlike any other app
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold text-primary">
            A personalised AI tutor.
          </h3>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Mentiora AI teaches you how to answer every question in your exams to get full marks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="text-5xl mb-4">📚</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Your Personal Tutor</h4>
            <p className="text-gray-600 leading-relaxed">
              Mentiora teaches you based on your weakest topics so you feel confident with every topic on your Exam Syllabus.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">📋</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Your Exam Guide</h4>
            <p className="text-gray-600 leading-relaxed">
              Mentiora takes you through each topic in your syllabus so that you learn how to answer every exam question to get full marks.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Your Examiner</h4>
            <p className="text-gray-600 leading-relaxed">
              Mentiora marks your work immediately based on your exam syllabus and provides feedback to help you improve your answer.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              The only AI tutor that's
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              specific to your exam curriculum
            </h3>
            <p className="text-lg text-gray-600 mb-2">
              Other AI tutoring platforms are not based on Exam Board Curriculums.
            </p>
            <p className="text-gray-500">Don't see your subject? Request it here.</p>
          </div>

          {/* Exam Boards */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['AQA', 'Edexcel', 'OCR', 'Eduqas'].map((board) => (
              <div 
                key={board} 
                className="bg-white border-2 border-gray-200 rounded-xl px-8 py-4 font-bold text-xl text-gray-900"
              >
                {board}
              </div>
            ))}
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { emoji: '🧬', name: 'Biology', tag: 'GCSE' },
              { emoji: '⚗️', name: 'Chemistry', tag: 'GCSE' },
              { emoji: '⚛️', name: 'Physics', tag: 'GCSE' },
              { emoji: '📐', name: 'Maths', tag: 'GCSE' },
              { emoji: '💻', name: 'Computer Science', tag: 'GCSE' },
              { emoji: '🧠', name: 'Psychology', tag: 'A-Level' },
              { emoji: '📚', name: 'History', tag: 'GCSE' },
              { emoji: '🌍', name: 'Geography', tag: 'GCSE' },
              { emoji: '📖', name: 'English', tag: 'GCSE' },
              { emoji: '💼', name: 'Business', tag: 'GCSE' },
              { emoji: '🕊️', name: 'Religious Studies', tag: 'GCSE' },
              { emoji: '🎵', name: 'Music', tag: 'GCSE' },
            ].map((subject, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-2">{subject.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{subject.name}</div>
                <div className="text-xs text-gray-500">{subject.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to ace your exams
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed to help you study smarter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Marking</h4>
              <p className="text-gray-600">
                Get instant, detailed feedback on every answer with exam board-specific marking criteria.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Personalized Study Plans</h4>
              <p className="text-gray-600">
                AI identifies your weak areas and creates a custom revision schedule just for you.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Predicted Exam Papers</h4>
              <p className="text-gray-600">
                Practice with AI-generated papers that predict likely exam questions, updated weekly.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Smart Revision Notes</h4>
              <p className="text-gray-600">
                Automatically generated notes tailored to your learning style and exam board.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Grade Predictions</h4>
              <p className="text-gray-600">
                Track your progress with accurate grade predictions based on your performance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Topic Mastery Tracking</h4>
              <p className="text-gray-600">
                Visual breakdown of your understanding across all topics in your syllabus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved by <span className="text-primary">30,000+ students</span>
            </h2>
            <h3 className="text-xl text-gray-600">
              from the UK's top schools
            </h3>
            <p className="text-gray-600 mt-4">
              Exam resources, from revision notes to predicted papers,<br />
              written specifically for your Exam Board.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                My daughter is quite shy and never liked asking questions in class, now she asks the AI tutor anything. She's becoming more confident in class too. It's been transformative for her learning.
              </p>
              <p className="font-semibold text-gray-900">Lisa K.</p>
              <p className="text-sm text-gray-500">Parent of Year 11 student</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                FANTASTIC! Easy to use and navigate and really good for understanding in more depth as if you get something wrong it will help you understand why! I love it so far :)
              </p>
              <p className="font-semibold text-gray-900">Sarah</p>
              <p className="text-sm text-gray-500">Year 11 student</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                OMG it's like a real life science tutor that's teaching me, but available at any time!
              </p>
              <p className="font-semibold text-gray-900">James</p>
              <p className="text-sm text-gray-500">Year 10 student</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Personalised tutoring
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              at a fraction of the cost
            </h3>
            <p className="text-lg text-gray-600">
              Trained to be more effective than personal tutoring,<br />
              at just 5% of the cost of private tuition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-sm text-gray-500 mb-2">Monthly</div>
              <div className="text-sm text-gray-600 mb-6">Monthly billing, full access, cancel anytime.</div>
              <div className="text-5xl font-bold text-gray-900 mb-8">
                £24.99<span className="text-xl text-gray-500">/month</span>
              </div>
              <Button 
                onClick={() => navigate('/pricing')}
                variant="outline"
                size="lg"
                className="w-full rounded-full h-12 border-2"
              >
                Get Started for Free
              </Button>
              <p className="text-sm text-gray-500 mt-4 text-center">£24.99 billed monthly. Cancel anytime.</p>
            </div>

            <div className="bg-primary rounded-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full">
                Save 33%
              </div>
              <div className="text-sm text-white/80 mb-2">2026 Exams</div>
              <div className="text-sm text-white/90 mb-6">One-time payment. Get unlimited access until 31st July 2026.</div>
              <div className="text-5xl font-bold text-white mb-2">
                £200.00<span className="text-xl text-white/80">once</span>
              </div>
              <div className="text-sm text-white/60 line-through mb-6">300.00</div>
              <Button 
                onClick={() => navigate('/pricing')}
                size="lg"
                className="w-full bg-white text-primary hover:bg-gray-50 rounded-full h-12"
              >
                Get Started for Free
              </Button>
              <p className="text-sm text-white/80 mt-4 text-center">£200 billed once. Offer ends 15/10/25.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Try it now.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The best way to prepare for GCSE English, Maths and Science.<br />
            No credit card required.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 text-base"
          >
            Try Mentiora for free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-xl font-semibold text-white">Mentiora</span>
          </div>
          <p className="text-white/80">© 2025 Mentiora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
