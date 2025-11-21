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
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-[700px] w-full"
        >
          {/* Heading */}
          <h1 className="text-[36px] font-bold text-white mb-4">
            Almost there, {firstName}!
          </h1>

          {/* Subheading */}
          <p className="text-[20px] mb-12" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Let's figure out where you're starting from
          </p>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[600px] mx-auto rounded-2xl p-10 mb-8 text-left"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Icon */}
            <div className="text-[32px] mb-4">📊</div>

            {/* Card Heading */}
            <h2 className="text-[28px] font-bold text-[#0A1628] mb-6">
              Quick Diagnostic Tests
            </h2>

            {/* Body Content */}
            <div className="text-[18px] text-[#8899A6] space-y-4" style={{ lineHeight: 1.7 }}>
              <p className="text-[#0A1628] font-medium">You'll take two short tests:</p>
              
              <p>1️⃣ Math (8-10 questions, ~8 mins)</p>
              <p>2️⃣ Reading & Writing (8-10 questions, ~8 mins)</p>
              
              <div className="py-2" />
              
              <p className="text-[#0A1628] font-medium">Total time: ~15-18 minutes</p>
              
              <div className="py-2" />
              
              <p className="text-[#0A1628] font-medium">This helps us:</p>
              <p className="flex items-start gap-2">
                <span className="text-[#00E676] mt-1">✓</span>
                <span>Identify your weak areas</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#00E676] mt-1">✓</span>
                <span>Estimate your current score</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#00E676] mt-1">✓</span>
                <span>Build your perfect study plan</span>
              </p>
            </div>
          </motion.div>

          {/* Primary Button */}
          <button
            onClick={handleStart}
            className="w-[320px] h-[64px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all mb-4"
            style={{
              background: 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)',
              boxShadow: '0 4px 16px rgba(180, 255, 57, 0.4)',
            }}
          >
            Start diagnostic tests →
          </button>

          {/* Secondary Link */}
          <button
            onClick={handleSkip}
            className="text-[15px] transition-opacity hover:opacity-100 underline"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            I'll do this later
          </button>
        </motion.div>
      </div>
    </div>
  );
};
