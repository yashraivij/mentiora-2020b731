import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export const DiagnosticTransition = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const mathAnswers = JSON.parse(localStorage.getItem('diagnostic_math_answers') || '{}');
    const answeredCount = Object.keys(mathAnswers).length;
    
    // Auto-continue after 10 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/diagnostic/reading-writing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/diagnostic/reading-writing');
  };

  const handleBreak = () => {
    if (confirm('Take a break? You can continue the diagnostic later from your dashboard.')) {
      navigate('/dashboard');
    }
  };

  const mathAnswers = JSON.parse(localStorage.getItem('diagnostic_math_answers') || '{}');
  const answeredCount = Object.keys(mathAnswers).length;

  return (
    <div 
      className="fixed inset-0 min-h-screen w-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-[600px] px-6"
      >
        {/* Checkmark Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #00E676 0%, #00C853 100%)',
          }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>

        {/* Heading */}
        <h1 className="text-[36px] font-bold text-white mb-3">
          Math test complete!
        </h1>

        {/* Stats */}
        <p className="text-[18px] mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {answeredCount} of 10 answered
        </p>

        {/* Divider */}
        <div className="w-20 h-0.5 bg-white/20 mx-auto my-8" />

        {/* Next Section */}
        <h2 className="text-[24px] font-semibold text-white mb-3">
          Ready for Reading & Writing?
        </h2>

        <p className="text-[16px] mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
          8-10 questions | ~8 minutes
        </p>

        {/* Auto-continue note */}
        <p className="text-[14px] mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Starting automatically in {countdown} seconds...
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-[320px] h-[64px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all mb-4"
          style={{
            background: 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)',
            boxShadow: '0 4px 16px rgba(180, 255, 57, 0.4)',
          }}
        >
          Start Reading & Writing →
        </button>

        {/* Break Link */}
        <button
          onClick={handleBreak}
          className="text-[15px] transition-opacity hover:opacity-100 underline"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Take a break
        </button>
      </motion.div>
    </div>
  );
};
