import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const OnboardingTargetScore = () => {
  const [targetScore, setTargetScore] = useState(1300);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('onboarding_name') || 'there';
    setFirstName(name);
    
    const saved = localStorage.getItem('onboarding_target_score');
    if (saved) setTargetScore(parseInt(saved));
  }, []);

  const handleContinue = () => {
    localStorage.setItem('onboarding_target_score', targetScore.toString());
    navigate('/onboarding/diagnostic-intro');
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
              background: i <= 2 ? '#00D9FF' : 'transparent',
              border: i <= 2 ? 'none' : '2px solid rgba(255,255,255,0.3)',
            }}
          />
        ))}
        <span className="text-[14px] ml-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
          60%
        </span>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/onboarding/grade')}
        className="absolute top-8 left-8 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.1)' }}
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-[12vh] max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-[700px] w-full pb-12"
        >
          {/* Heading */}
          <h1 className="text-[34px] font-bold text-white mb-3">
            What's your target SAT score, {firstName}?
          </h1>

          {/* Subheading */}
          <p className="text-[17px] mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            We'll help you build a plan to get there
          </p>

          {/* Score Display */}
          <motion.div
            key={targetScore}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mb-8"
          >
            <div 
              className="text-[72px] font-bold mb-2"
              style={{
                color: '#00D9FF',
                textShadow: '0 0 40px rgba(0, 217, 255, 0.5)',
              }}
            >
              {targetScore}
            </div>
            <div className="text-[15px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              out of 1600
            </div>
            <div 
              className="w-[80px] h-[1px] mx-auto my-8"
              style={{ background: '#00D9FF' }}
            />
          </motion.div>

          {/* Slider */}
          <div className="max-w-[600px] mx-auto mb-7">
            <Slider
              value={[targetScore]}
              onValueChange={(value) => setTargetScore(value[0])}
              min={600}
              max={1600}
              step={10}
              className="mb-4"
              style={{
                '--slider-track-height': '6px',
                '--slider-track-bg': 'rgba(255,255,255,0.15)',
                '--slider-range-bg': 'linear-gradient(90deg, #00D9FF 0%, #B4FF39 100%)',
                '--slider-thumb-size': '28px',
                '--slider-thumb-bg': '#FFFFFF',
                '--slider-thumb-border': '4px solid #00D9FF',
                '--slider-thumb-shadow': '0 0 20px rgba(0, 217, 255, 0.5)',
              } as any}
            />
            <div className="flex justify-between text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>600</span>
              <span>1600</span>
            </div>
          </div>

          {/* Info Box */}
          <div 
            className="max-w-[520px] mx-auto rounded-xl p-4 mb-7 text-center"
            style={{
              background: 'rgba(0, 217, 255, 0.1)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="text-[20px]">💡</div>
              <div className="text-[14px]" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                Average: ~1050 | Top schools: 1400+ | Ivy League: 1500+
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-[280px] h-[56px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all"
            style={{
              background: 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)',
              boxShadow: '0 4px 16px rgba(180, 255, 57, 0.4)',
            }}
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </div>
  );
};
