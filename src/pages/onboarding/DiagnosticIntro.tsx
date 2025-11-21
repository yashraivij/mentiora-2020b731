import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const OnboardingDiagnosticIntro = () => {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('onboarding_name') || 'there';
    setFirstName(name);
  }, []);

  const handleStart = () => {
    navigate('/diagnostic/math');
  };

  const handleSkip = () => {
    if (confirm('Skip the diagnostic tests? You can take them later, but we recommend doing them now for the best personalized experience.')) {
      navigate('/dashboard');
    }
  };

  return (
    <div 
      className="fixed inset-0 min-h-screen w-full flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)'
      }}
    >
      {/* Progress Bar */}
      <div className="w-full pt-8 px-8 flex items-center gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all"
            style={{
              background: i <= 3 ? '#00D9FF' : 'transparent',
              border: i <= 3 ? 'none' : '2px solid rgba(255,255,255,0.3)',
            }}
          />
        ))}
        <span className="text-[14px] ml-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
          80%
        </span>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/onboarding/target-score')}
        className="absolute top-8 left-8 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.1)' }}
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-[15vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-[700px] w-full"
        >
          {/* Heading */}
          <h1 className="text-[40px] font-bold text-white mb-5">
            Almost there, {firstName}!
          </h1>

          {/* Subheading */}
          <p className="text-[20px] mb-14" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Let's figure out where you're starting from
          </p>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-[60px] h-[1px]" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <h2 className="text-[22px] text-white">Quick Diagnostic Tests</h2>
            <div className="w-[60px] h-[1px]" style={{ background: 'rgba(255,255,255,0.3)' }} />
          </div>

          {/* Test Info */}
          <div className="mb-12 space-y-6">
            <p className="text-[18px]" style={{ color: 'rgba(255,255,255,0.9)' }}>
              You'll take two short tests:
            </p>
            
            <div className="space-y-4">
              <p className="text-[18px] text-white">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-[14px] mr-3">1</span>
                Math (8-10 questions, ~8 mins)
              </p>
              <p className="text-[18px] text-white">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-[14px] mr-3">2</span>
                Reading & Writing (8-10 questions, ~8 mins)
              </p>
            </div>

            <p className="text-[16px] pt-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Total time: ~15-18 minutes
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <p className="text-[18px] mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
              This helps us:
            </p>
            <div className="space-y-3" style={{ lineHeight: 2 }}>
              <p className="text-[17px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                • Identify your weak areas
              </p>
              <p className="text-[17px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                • Estimate your current score
              </p>
              <p className="text-[17px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                • Build your perfect study plan
              </p>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={handleStart}
            className="w-[320px] h-[60px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all mb-4"
            style={{
              background: 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)',
              boxShadow: '0 4px 16px rgba(180, 255, 57, 0.4)',
            }}
          >
            Start diagnostic tests →
          </button>

          <button
            onClick={handleSkip}
            className="text-[15px] hover:underline transition-opacity"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            I'll do this later
          </button>
        </motion.div>
      </div>
    </div>
  );
};
