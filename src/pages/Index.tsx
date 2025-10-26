import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import mentioraLogo from "@/assets/mentiora-logo.png";
import bristolLogo from "@/assets/bristol-logo.png";
import newcastleLogo from "@/assets/newcastle-logo.svg";
import birminghamLogo from "@/assets/birmingham-logo.png";
import oxfordLogo from "@/assets/oxford-logo.png";
import bathLogo from "@/assets/bath-logo.png";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={mentioraLogo} alt="Mentiora" className="h-8 w-8"/>
            <span className="text-xl font-bold text-black">Mentiora</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-sm text-gray-600 hover:text-black transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm text-gray-600 hover:text-black transition-colors">Pricing</button>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-[#0BA5E9] hover:bg-[#0BA5E9]/90 text-white px-6 rounded-lg font-medium">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="ghost" className="hidden md:block text-gray-600 hover:text-black hover:bg-transparent">
                  Login
                </Button>
                <Button onClick={() => navigate("/register")} className="bg-[#0BA5E9] hover:bg-[#0BA5E9]/90 text-white px-6 rounded-lg font-medium">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Your revision, finally made <span className="text-[#0BA5E9]">personal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered GCSE and A-Level revision that adapts to you. Practice exam questions, track your progress, and achieve your target grades.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => navigate("/register")} className="bg-[#0BA5E9] hover:bg-[#0BA5E9]/90 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg shadow-[#0BA5E9]/25">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button onClick={() => scrollToSection('features')} variant="outline" className="px-8 py-6 rounded-xl font-semibold text-lg border-2">
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Trusted by students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by students at</p>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
              <img src={oxfordLogo} alt="Oxford" className="h-8 grayscale"/>
              <img src={bristolLogo} alt="Bristol" className="h-8 grayscale"/>
              <img src={bathLogo} alt="Bath" className="h-8 grayscale"/>
              <img src={birminghamLogo} alt="Birmingham" className="h-8 grayscale"/>
              <img src={newcastleLogo} alt="Newcastle" className="h-8 grayscale"/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600">Powerful tools designed for GCSE and A-Level students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0BA5E9]/10 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-[#0BA5E9]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Smart Practice Questions</h3>
              <p className="text-gray-600">Thousands of exam-style questions that adapt to your level and focus on your weak areas.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0BA5E9]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-[#0BA5E9]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Personalized Study Plans</h3>
              <p className="text-gray-600">AI-generated weekly plans tailored to your subjects, targets, and exam dates.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0BA5E9]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-[#0BA5E9]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Real-Time Analytics</h3>
              <p className="text-gray-600">Track your progress, predicted grades, and strengths across all your subjects.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-black">£0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0BA5E9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">5 practice questions per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0BA5E9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basic progress tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0BA5E9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Access to all subjects</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/register")} variant="outline" className="w-full py-6 rounded-xl font-semibold text-lg border-2">
                Get Started
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-[#0BA5E9] to-[#0BA5E9]/80 rounded-2xl p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-white text-[#0BA5E9] px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">£9.99</span>
                <span className="text-white/80">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Unlimited practice questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">AI study plans & predictions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Priority support</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/register")} className="w-full py-6 rounded-xl font-semibold text-lg bg-white text-[#0BA5E9] hover:bg-white/90">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What subjects do you cover?",
                a: "We cover all major GCSE and A-Level subjects including Maths, English, Sciences, Humanities, and Languages across all major exam boards (AQA, Edexcel, OCR, WJEC)."
              },
              {
                q: "How does the AI personalization work?",
                a: "Our AI analyzes your performance on practice questions to identify your strengths and weaknesses, then generates personalized study plans and recommends topics you should focus on."
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your premium subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Premium comes with a 7-day free trial. No credit card required to start."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-black">{faq.q}</span>
                  <span className="text-2xl text-gray-400">{expandedFaq === i ? '−' : '+'}</span>
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-5 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Ready to ace your exams?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students already improving their grades with Mentiora
            </p>
            <Button onClick={() => navigate("/register")} className="bg-[#0BA5E9] hover:bg-[#0BA5E9]/90 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg shadow-[#0BA5E9]/25">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src={mentioraLogo} alt="Mentiora" className="h-8 w-8"/>
              <span className="text-xl font-bold text-black">Mentiora</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button onClick={() => scrollToSection('features')} className="hover:text-black transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-black transition-colors">Pricing</button>
              <button onClick={() => navigate("/login")} className="hover:text-black transition-colors">Login</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2024 Mentiora. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;