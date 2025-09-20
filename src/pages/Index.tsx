import { Button } from "@/components/ui/button";
import { BookOpen, Target, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check for password reset tokens in URL hash and redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      // Use navigate to properly redirect to reset password page
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);
  
  // Animation refs
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const impactRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const impactInView = useInView(impactRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <motion.img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora Logo" 
              className="w-10 h-10 object-contain"
              whileHover={{ rotate: 12 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mentiora</h1>
        </motion.div>
        <div className="flex gap-3 mt-6 sm:mt-0">
          {user ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-8 py-3 rounded-2xl transition-all duration-300"
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Try Mentiora
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          ref={heroRef}
          className="flex flex-col lg:flex-row items-center justify-between py-20 lg:py-32 gap-16"
        >
          {/* Left side - Text content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-bold mb-8 leading-tight"
            >
              Unlike any other app<br/>
              <span className="text-primary">
                A personalised AI tutor.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed"
            >
              Mentiora AI teaches you exactly how to answer every question 
              in your exams to get full marks.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/register')} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg font-bold shadow-lg transition-all duration-300 rounded-2xl"
              >
                GET STARTED
              </Button>
            </motion.div>
          </div>

          {/* Right side - Visual placeholder */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-12 aspect-square flex items-center justify-center">
                <div className="text-6xl">🎯</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Three Features Section */}
        <motion.div 
          ref={featuresRef}
          initial={{ opacity: 0, y: 40 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="py-20"
        >
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Personal Tutor</h3>
              <p className="text-gray-600 leading-relaxed">
                Mentiora teaches you based on your weakest topics so you feel confident with every topic on your Exam Syllabus.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Exam Guide</h3>
              <p className="text-gray-600 leading-relaxed">
                Mentiora takes you through each topic in your syllabus so that you learn how to answer every exam question to get full marks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Examiner</h3>
              <p className="text-gray-600 leading-relaxed">
                Mentiora marks your work immediately based on your exam markscheme and provides feedback to help you improve your answer.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Curriculum Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            The only AI tutor that's<br/>
            <span className="text-primary">specific to your exam curriculum</span>
          </h2>
          <p className="text-gray-600 mb-4 max-w-3xl mx-auto">
            Other AI tutoring platforms are not based on Exam Board Curriculums.
          </p>
          <p className="text-gray-600 mb-16">
            Don't see your subject? <a href="#" className="text-primary underline">Request it here.</a>
          </p>
          
          {/* Subject Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">B</span>
                </div>
                <p className="text-sm text-gray-700">Biology</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">C</span>
                </div>
                <p className="text-sm text-gray-700">Chemistry</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">P</span>
                </div>
                <p className="text-sm text-gray-700">Physics</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold">M</span>
                </div>
                <p className="text-sm text-gray-700">Mathematics</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Value Proposition Section */}
        <motion.div 
          ref={impactRef}
          initial={{ opacity: 0, y: 40 }}
          animate={impactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="py-20 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            World-class tutoring<br/>
            <span className="text-primary">at a fraction of the cost</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Trained to be more effective than personal tutoring,<br/>
            at just 5% of the cost of private tuition.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-16">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-300 mb-2">£500</div>
              <div className="text-sm text-gray-500">/month</div>
              <div className="text-lg font-semibold text-gray-700 mt-2">Personal tutoring</div>
            </div>
            
            <div className="text-4xl text-primary">vs</div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">£24.99</div>
              <div className="text-sm text-primary">/month</div>
              <div className="text-lg font-semibold text-gray-700 mt-2">Mentiora</div>
              <div className="text-sm text-primary font-medium">95% cheaper than private tutoring</div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="py-20"
        >
          <div className="bg-gray-50 rounded-3xl p-16 text-center max-w-4xl mx-auto">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Ready to ace your GCSEs?
            </h3>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of students achieving their target grades with personalised AI tutoring.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/register')} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg font-bold shadow-lg transition-all duration-300 rounded-2xl"
              >
                GET STARTED
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;