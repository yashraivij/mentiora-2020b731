import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const OnboardingWelcome = () => {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved name if exists
    const saved = localStorage.getItem('onboarding_name');
    if (saved) setFirstName(saved);
  }, []);

  const handleContinue = () => {
    if (firstName.length >= 2) {
      localStorage.setItem('onboarding_name', firstName);
      navigate('/onboarding/grade');
    }
  };

  const handleSkip = () => {
    if (confirm('Skip the personalized setup? You can complete it later from settings.')) {
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
      <div className="w-full pt-8 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: i === 0 ? '#00D9FF' : 'transparent',
                border: i === 0 ? 'none' : '2px solid rgba(255,255,255,0.3)',
              }}
            />
          ))}
          <span className="text-[14px] ml-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            20%
          </span>
        </div>
        <button
          onClick={handleSkip}
          className="text-[14px] transition-opacity hover:opacity-100"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Skip Tour
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px]"
        >
          {/* Wave Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-[64px] mb-6"
          >
            👋
          </motion.div>

          {/* Heading */}
          <h1 className="text-[48px] font-bold text-white mb-6">
            Hey there!
          </h1>

          {/* Subheading */}
          <div className="space-y-2 mb-16">
            <p className="text-[20px]" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
              I'm your SAT prep assistant.
            </p>
            <p className="text-[20px]" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
              Let's build your perfect study plan.
            </p>
          </div>

          {/* Question */}
          <p className="text-[24px] font-medium text-white mb-6">
            What should I call you?
          </p>

          {/* Input */}
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
            autoFocus
            className="w-full max-w-[400px] h-[56px] px-6 rounded-xl text-white text-[16px] placeholder:text-white/50 focus:outline-none transition-all mb-8"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #00D9FF';
              e.target.style.boxShadow = '0 0 0 4px rgba(0, 217, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.border = '2px solid rgba(255,255,255,0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* Button */}
          <button
            onClick={handleContinue}
            disabled={firstName.length < 2}
            className="w-[280px] h-[64px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: firstName.length >= 2 
                ? 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)' 
                : '#8899A6',
              boxShadow: firstName.length >= 2 
                ? '0 4px 16px rgba(180, 255, 57, 0.4)' 
                : 'none',
            }}
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </div>
  );
};
