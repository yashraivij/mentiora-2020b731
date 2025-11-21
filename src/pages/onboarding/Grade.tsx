import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

const GRADES = [
  { id: "9th", label: "9th grade" },
  { id: "10th", label: "10th grade" },
  { id: "11th", label: "11th grade" },
  { id: "12th", label: "12th grade" },
  { id: "other", label: "Other" },
];

export const OnboardingGrade = () => {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('onboarding_name') || 'there';
    setFirstName(name);
    
    const saved = localStorage.getItem('onboarding_grade');
    if (saved) setSelectedGrade(saved);
  }, []);

  const handleContinue = () => {
    if (selectedGrade) {
      localStorage.setItem('onboarding_grade', selectedGrade);
      navigate('/onboarding/target-score');
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
                background: i <= 1 ? '#00D9FF' : 'transparent',
                border: i <= 1 ? 'none' : '2px solid rgba(255,255,255,0.3)',
              }}
            />
          ))}
          <span className="text-[14px] ml-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            40%
          </span>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/onboarding/welcome')}
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
            What grade are you in, {firstName}?
          </h1>

          {/* Subheading */}
          <p className="text-[18px] mb-12" style={{ color: 'rgba(255,255,255,0.8)' }}>
            The more we know, the better we can guide you
          </p>

          {/* Grade Options Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-[600px] mx-auto">
            {GRADES.map((grade) => (
              <motion.button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                whileHover={{ y: -2 }}
                className="relative h-[80px] rounded-xl font-medium text-white text-[16px] transition-all"
                style={{
                  background: selectedGrade === grade.id 
                    ? 'rgba(0, 217, 255, 0.15)' 
                    : 'rgba(255,255,255,0.08)',
                  border: selectedGrade === grade.id 
                    ? '2px solid #00D9FF' 
                    : '2px solid rgba(255,255,255,0.15)',
                }}
              >
                {grade.label}
                {selectedGrade === grade.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-[#00D9FF] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-[#0A1628]" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedGrade}
            className="w-[280px] h-[64px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: selectedGrade 
                ? 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)' 
                : '#8899A6',
              boxShadow: selectedGrade 
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
