import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, UserCheck, ArrowRight, Target, Brain, GraduationCap, Sparkles, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  const features = [
    {
      icon: "📚",
      title: "Your Personal Tutor",
      description: "Mentiora teaches you based on your weakest topics so you feel confident with every topic on your Exam Syllabus."
    },
    {
      icon: "✍️",
      title: "Your Exam Guide",
      description: "Mentiora takes you through each topic in your syllabus so that you learn how to answer every exam question to get full marks."
    },
    {
      icon: "🎯",
      title: "Your Examiner",
      description: "Mentiora marks your work immediately based on your exam syllabus and provides feedback to help you improve your answer."
    }
  ];

  const testimonials = [
    {
      name: "Sarah",
      role: "Year 11 student",
      content: "FANTASTIC! Easy to use and navigate and really good for understanding in more depth as if you get something wrong it will help you understand why! I love it so far :)",
      highlight: "if you get something wrong it will help you understand why!"
    },
    {
      name: "James",
      role: "Year 10 student", 
      content: "OMG it's like a real life science tutor that's teaching me, but available at any time!",
      highlight: "available at any time!"
    },
    {
      name: "Lisa K.",
      role: "Parent of Year 11 student",
      content: "My daughter is quite shy and never liked asking questions in class, now she just asks the AI tutor anything. She's becoming more confident in class too. It's been transformative for her learning.",
      highlight: "she just asks the AI tutor anything"
    }
  ];

  const faqs = [
    {
      question: "Is Mentiora specific to my exam board?",
      answer: "Yes! Mentiora is tailored to AQA, Edexcel, and OCR GCSE specifications. We cover all the topics in your exam syllabus and mark your work according to your specific exam board's marking criteria."
    },
    {
      question: "How are answers marked on Mentiora?",
      answer: "Mentiora uses advanced AI to mark your answers according to your exam board's official marking schemes. You'll get instant, detailed feedback showing exactly where you gained or lost marks, and what examiners are looking for."
    },
    {
      question: "How does Mentiora help students prepare for exams?",
      answer: "Mentiora provides personalized study plans, practice questions from real past papers, instant AI marking and feedback, and tracks your progress to predict your exam grade. It's like having a personal tutor available 24/7."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes! You can cancel your subscription at any time from your account settings. There are no long-term commitments or cancellation fees."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">mentiora</h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')} 
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')} 
                    className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-lg"
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
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Unlike any other app
            </motion.h2>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              style={{ color: '#00A8FF' }}
            >
              A personalised AI tutor.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Mentiora AI teaches you how to answer every question in your exams to get full marks.
            </motion.p>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-gray-50 border-none shadow-none h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              The only AI tutor that's
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#00A8FF' }}>
              specific to your exam curriculum
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Other AI tutoring platforms are not based on Exam Board Curriculums.
            </p>
            <p className="text-lg text-gray-600">
              Don't see your subject? <span className="underline cursor-pointer" style={{ color: '#00A8FF' }}>Request it here.</span>
            </p>
          </div>

          {/* Exam Boards Grid */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">GCSE</h3>
                <div className="bg-white rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-4">AQA</h4>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#10B981' }} />
                      <span className="text-gray-700">Biology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                      <span className="text-gray-700">Chemistry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#10B981' }} />
                      <span className="text-gray-700">Combined Biology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                      <span className="text-gray-700">Combined Physics</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">A-Level</h3>
                <div className="bg-white rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-4">AQA</h4>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#10B981' }} />
                      <span className="text-gray-700">Biology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                      <span className="text-gray-700">Chemistry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                      <span className="text-gray-700">Physics</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 opacity-0">Placeholder</h3>
                <div className="bg-white rounded-lg p-6">
                  <p className="text-gray-500 italic">More exam boards and subjects coming soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Personalised tutoring
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#00A8FF' }}>
              at a fraction of the cost
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Trained to be more effective than personal tutoring, at just 5% of the cost of private tuition.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-center">
              <Card className="bg-gray-50 border-none p-8 text-center">
                <div className="text-5xl font-bold text-gray-400 mb-2">£500</div>
                <div className="text-sm text-gray-500">/month</div>
                <div className="mt-6 text-gray-600">Personal tutoring</div>
              </Card>
              
              <Card className="border-2" style={{ borderColor: '#00A8FF', backgroundColor: '#E6F7FF' }}>
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold mb-2" style={{ color: '#00A8FF' }}>£9.99</div>
                  <div className="text-sm" style={{ color: '#00A8FF' }}>/month</div>
                  <div className="mt-6 font-semibold" style={{ color: '#00A8FF' }}>
                    95% cheaper than private tutoring
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#00A8FF' }} />
                    <span className="font-bold" style={{ color: '#00A8FF' }}>mentiora</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              Loved by <span style={{ color: '#00A8FF' }}>30,000+ students</span>
            </h2>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              from the UK's top schools
            </h2>
            <p className="text-lg text-gray-600">
              Exam resources, from revision notes to predicted papers, written specifically for your Exam Board.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {testimonial.content.split(testimonial.highlight)[0]}
                    <span style={{ color: '#00A8FF' }} className="underline">{testimonial.highlight}</span>
                    {testimonial.content.split(testimonial.highlight)[1]}
                  </p>
                  <div className="font-semibold text-gray-900">{testimonial.name}, {testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All-in-one Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              All-in-one revision
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#00A8FF' }}>
              for just one subscription
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Try for free first. Then choose the plan that aligns with your exams. Everything you need to revise, all in one spot.
            </p>

            <div className="flex justify-center">
              <Card className="max-w-sm border-2 border-gray-200 bg-white">
                <CardContent className="p-8">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-3 py-1 mb-4">
                    <Sparkles className="h-3 w-3 text-yellow-600" />
                    <span className="text-yellow-700 font-medium text-xs">Limited Time</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Free Trial
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">First 7 days free</p>
                    <div className="text-5xl font-bold text-gray-900">
                      £9.99<span className="text-lg font-medium text-gray-500">/month</span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-green-100 rounded-full px-2 py-1 mt-2">
                      <span className="text-green-700 font-medium text-xs">After trial ends</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">Cancel any time.</p>
                  
                  <Button 
                    onClick={() => navigate('/pricing')}
                    className="w-full font-semibold py-6 text-lg rounded-xl"
                    style={{ backgroundColor: '#00A8FF' }}
                  >
                    Get Free Trial
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-12">FAQs</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ready to achieve your best grades?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students using Mentiora to ace their exams.
            </p>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="font-semibold px-12 py-6 text-lg rounded-xl"
              style={{ backgroundColor: '#00A8FF' }}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-6 h-6"
              />
              <span className="text-sm text-gray-600">© 2025 Mentiora. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <button className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
