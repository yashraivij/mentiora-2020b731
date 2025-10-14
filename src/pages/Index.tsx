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

  const subjects = [
    { emoji: '📐', name: 'GCSE Maths', description: 'Get step-by-step guidance to solve maths problems.' },
    { emoji: '📝', name: 'GCSE English', description: 'Learn how to structure your answers for each question.' },
    { emoji: '🧪', name: 'GCSE Science', description: 'Apply your knowledge in \'Explain\', and \'Suggest\' questions.' },
  ];

  const features = [
    { icon: '📚', title: 'Your Personal Tutor', description: 'Mentiora teaches you based on your weakest topics so you feel confident with every topic on your Exam Syllabus.' },
    { icon: '📋', title: 'Your Exam Guide', description: 'Mentiora takes you through each topic in your syllabus so that you learn how to answer every exam question to get full marks.' },
    { icon: '✅', title: 'Your Examiner', description: 'Mentiora marks your work immediately based on your exam syllabus and provides feedback to help you improve your answer.' },
  ];

  const testimonials = [
    {
      quote: "My daughter is quite shy and never liked asking questions in class, now she asks the AI tutor anything. She's becoming more confident in class too. It's been transformative for her learning.",
      author: "Lisa K., Parent of Year 11 student"
    },
    {
      quote: "FANTASTIC! Easy to use and navigate and really good for understanding in more depth as if you get something wrong it will help you understand why! I love it so far :)",
      author: "Sarah, Year 11 student"
    },
    {
      quote: "OMG it's like a real life science tutor that's teaching me, but available at any time!",
      author: "James, Year 10 student"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
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
            <div className="flex items-center gap-4">
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
                    className="text-gray-600 hover:text-gray-900"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="mb-8 flex justify-center gap-8 text-sm text-gray-500">
          <span>Microsoft for Startups</span>
          <span>UKRI Innovate UK</span>
          <span>Google for Startups</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Your personal GCSE and A-Level tutor.
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Mentiora adapts to how you learn — identifying what to revise next and helping you make every study session count.
        </p>
        
        <Button 
          onClick={() => navigate('/register')}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg"
        >
          Try now for free
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">No credit card required</p>
      </section>

      {/* Subjects Section */}
      <section className="bg-[#E6F7FF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-4xl mb-4">{subject.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-gray-600 mb-4">{subject.description}</p>
                <button className="text-primary font-medium hover:underline">Try it now →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalization Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Unlike any other app<br />
          <span className="text-primary">A personalised AI tutor.</span>
        </h2>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          Mentiora AI teaches you how to answer every question in your exams to get full marks.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-left">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            The only AI tutor that's<br />
            <span className="text-primary">specific to your exam curriculum</span>
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Other AI tutoring platforms are not based on Exam Board Curriculums.
          </p>
          <p className="text-gray-500 mb-12">Don't see your subject? Request it here.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
            {['AQA', 'Edexcel', 'OCR', 'Eduqas'].map((board) => (
              <div key={board} className="bg-white rounded-xl py-6 px-8 font-bold text-2xl text-gray-900 shadow-sm">
                {board}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-left">
            {[
              { icon: '🧬', name: 'Biology', tag: 'GCSE' },
              { icon: '⚗️', name: 'Chemistry', tag: 'GCSE' },
              { icon: '💻', name: 'Computer Science', tag: 'GCSE' },
              { icon: '💼', name: 'Business', tag: 'GCSE' },
              { icon: '📐', name: 'Maths', tag: 'GCSE' },
              { icon: '⚛️', name: 'Physics', tag: 'GCSE' },
              { icon: '🧠', name: 'Psychology', tag: 'GCSE & A-Level' },
              { icon: '🌍', name: 'Geography', tag: 'GCSE' },
              { icon: '📚', name: 'History', tag: 'GCSE' },
              { icon: '📖', name: 'English', tag: 'GCSE' },
              { icon: '🕊️', name: 'Religious Studies', tag: 'GCSE' },
              { icon: '🎵', name: 'Music', tag: 'GCSE' },
            ].map((subject, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{subject.icon}</div>
                <div className="font-semibold text-gray-900">{subject.name}</div>
                <div className="text-xs text-gray-500">{subject.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Loved by <span className="text-primary">30,000+ students</span><br />
          from the UK's top schools
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          Exam resources, from revision notes to predicted papers,<br />
          written specifically for your Exam Board.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 text-left">
              <p className="text-gray-700 mb-4">{testimonial.quote}</p>
              <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Personalised tutoring<br />
            <span className="text-primary">at a fraction of the cost</span>
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Trained to be more effective than personal tutoring,<br />
            at just 5% of the cost of private tuition.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <div className="text-sm text-gray-500 mb-2">Personal tutoring</div>
              <div className="text-5xl font-bold text-gray-900 mb-6">£500<span className="text-2xl text-gray-500">/month</span></div>
              <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>
              <div className="text-gray-600">95% cheaper than<br />private tutoring</div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-left shadow-lg">
              <div className="text-sm text-white/80 mb-2">Mentiora</div>
              <div className="text-5xl font-bold text-white mb-6">£24.99<span className="text-2xl text-white/80">/month</span></div>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span>68% grade improvement</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span>Personalized to your weaknesses</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span>Available 24/7</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/pricing')}
                variant="secondary"
                size="lg"
                className="w-full bg-white text-primary hover:bg-gray-50 rounded-full"
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
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
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg"
        >
          Try Mentiora for free
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-8">The Mentiora App</h3>
          <p className="text-white/90 mb-8">Ready to ace your exams?</p>
          <Button 
            onClick={() => navigate('/register')}
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-50 rounded-full px-8"
          >
            Get Started
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
