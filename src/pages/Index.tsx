import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
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
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  const features = [
    {
      title: "Smart Practice",
      description: "Personalized questions that adapt to you",
      cta: "Start Practice"
    },
    {
      title: "Instant Feedback",
      description: "Know exactly what to improve",
      cta: "Get Feedback"
    },
    {
      title: "Track Progress",
      description: "See your improvement in real-time",
      cta: "View Analytics"
    },
    {
      title: "Exam Prep",
      description: "Practice with real exam-style papers",
      cta: "Take Mock Exam"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-20"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Mentiora</h1>
          </div>
          
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          className="text-center mb-32 max-w-4xl mx-auto"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-foreground"
          >
            GCSE Revision, Simplified
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Personalized practice that adapts to your learning style
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Simple Stats */}
          <motion.div 
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 pt-8 border-t border-border"
          >
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">2.3</div>
                <div className="text-sm text-muted-foreground">Grades Higher</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">67%</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Demo Video Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-32 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              See How It Works
            </h3>
            <p className="text-lg text-muted-foreground">
              Watch how Mentiora transforms GCSE revision
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <video 
              controls
              className="w-full h-auto"
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          ref={featuresRef}
          className="mb-32"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h3>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Simple steps to better grades
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full text-center border-0 bg-card hover:shadow-lg transition-all duration-300 rounded-xl">
                  <CardContent className="p-0 space-y-4">
                    <h4 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/register')}
                      className="mt-4"
                    >
                      {feature.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold text-foreground">
              Ready to improve your grades?
            </h3>
            <p className="text-lg text-muted-foreground">
              Join thousands of students already using Mentiora
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;