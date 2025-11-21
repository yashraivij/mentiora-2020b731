import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { readingWritingQuestions, mathQuestions } from "@/data/diagnosticQuestions";

export const DiagnosticResults = () => {
  const [score, setScore] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [rwScore, setRwScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate scores
    const mathAnswers = JSON.parse(localStorage.getItem('diagnostic_math_answers') || '{}');
    const rwAnswers = JSON.parse(localStorage.getItem('diagnostic_rw_answers') || '{}');

    // Calculate math score
    let mathCorrect = 0;
    mathQuestions.forEach((q, i) => {
      if (mathAnswers[i] === q.correctAnswer) mathCorrect++;
    });
    const mathPercentage = (mathCorrect / mathQuestions.length) * 100;
    const mathScoreValue = Math.round(200 + (mathPercentage / 100) * 600);

    // Calculate R&W score
    let rwCorrect = 0;
    readingWritingQuestions.forEach((q, i) => {
      if (rwAnswers[i] === q.correctAnswer) rwCorrect++;
    });
    const rwPercentage = (rwCorrect / readingWritingQuestions.length) * 100;
    const rwScoreValue = Math.round(200 + (rwPercentage / 100) * 600);

    const totalScore = mathScoreValue + rwScoreValue;

    setMathScore(mathScoreValue);
    setRwScore(rwScoreValue);
    setScore(totalScore);

    // Show score with animation
    setTimeout(() => setShowScore(true), 500);

    // Save to localStorage for dashboard
    localStorage.setItem('diagnostic_completed', 'true');
    localStorage.setItem('diagnostic_score', totalScore.toString());
  }, []);

  const targetScore = parseInt(localStorage.getItem('onboarding_target_score') || '1300');
  const gap = Math.max(0, targetScore - score);

  // Determine weak areas (simplified - in production would be more sophisticated)
  const getPerformanceBreakdown = () => {
    const mathAnswers = JSON.parse(localStorage.getItem('diagnostic_math_answers') || '{}');
    const rwAnswers = JSON.parse(localStorage.getItem('diagnostic_rw_answers') || '{}');

    // Track topic performance
    const topicScores: Record<string, { correct: number; total: number }> = {};

    mathQuestions.forEach((q, i) => {
      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { correct: 0, total: 0 };
      }
      topicScores[q.topic].total++;
      if (mathAnswers[i] === q.correctAnswer) {
        topicScores[q.topic].correct++;
      }
    });

    readingWritingQuestions.forEach((q, i) => {
      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { correct: 0, total: 0 };
      }
      topicScores[q.topic].total++;
      if (rwAnswers[i] === q.correctAnswer) {
        topicScores[q.topic].correct++;
      }
    });

    const weak: string[] = [];
    const learning: string[] = [];
    const strong: string[] = [];

    Object.entries(topicScores).forEach(([topic, data]) => {
      const percentage = (data.correct / data.total) * 100;
      const label = `${topic.charAt(0).toUpperCase() + topic.slice(1)} (${Math.round(percentage)}% accuracy)`;
      
      if (percentage < 60) weak.push(label);
      else if (percentage < 80) learning.push(label);
      else strong.push(label);
    });

    return { weak, learning, strong };
  };

  const { weak, learning, strong } = getPerformanceBreakdown();

  const handleStartPlan = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-8 py-16">
        {/* Score Reveal */}
        <div className="text-center mb-16">
          <p className="text-[24px] text-[#8899A6] mb-2">Your SAT Breakdown</p>
          <p className="text-[20px] text-[#8899A6] mb-6">Your Current Estimated Score:</p>
          
          {showScore && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <motion.div
                className="text-[120px] font-bold mb-4"
                style={{
                  color: '#00D9FF',
                  textShadow: '0 0 60px rgba(0, 217, 255, 0.4)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {score}
              </motion.div>
            </motion.div>
          )}

          <div className="text-[32px] text-[#374151] mb-6">
            Math: {mathScore}  |  Reading & Writing: {rwScore}
          </div>

          <div className="space-y-2">
            <p className="text-[20px] text-[#8899A6]">Target: {targetScore}</p>
            <p className="text-[20px] font-bold text-[#00D9FF]">
              {gap > 0 ? `Gap: ${gap} points to go!` : 'You\'ve exceeded your target! 🎉'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E1E8ED] my-16" />

        {/* Performance Breakdown */}
        <div className="mb-16">
          <h2 className="text-[24px] font-bold text-[#0A1628] mb-8 flex items-center gap-2">
            📊 Your Performance:
          </h2>

          {weak.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-[#0A1628] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Focus Areas (Weak - Need work):
              </h3>
              <ul className="space-y-2 ml-6">
                {weak.map((item, i) => (
                  <li key={i} className="text-[18px] text-[#374151]">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {learning.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-[#0A1628] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Learning (Getting there):
              </h3>
              <ul className="space-y-2 ml-6">
                {learning.map((item, i) => (
                  <li key={i} className="text-[18px] text-[#374151]">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {strong.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-[#0A1628] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Strong Areas (Keep it up!):
              </h3>
              <ul className="space-y-2 ml-6">
                {strong.map((item, i) => (
                  <li key={i} className="text-[18px] text-[#374151]">• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E1E8ED] my-16" />

        {/* 8-Week Plan Preview */}
        <div className="mb-16">
          <h2 className="text-[24px] font-bold text-[#0A1628] mb-6 flex items-center gap-2">
            🎯 Your Personalized 8-Week Plan:
          </h2>
          
          <div className="text-[18px] text-[#374151] space-y-3 mb-6" style={{ lineHeight: 1.8 }}>
            <p><strong>Weeks 1-3:</strong> Master {weak[0]?.split(' ')[0] || 'Algebra'} (your weakest area)</p>
            <p><strong>Weeks 4-5:</strong> Improve {learning[0]?.split(' ')[0] || 'Grammar'}</p>
            <p><strong>Weeks 6-7:</strong> Solidify {learning[1]?.split(' ')[0] || 'Geometry'}</p>
            <p><strong>Week 8:</strong> Full practice tests</p>
          </div>

          <p className="text-[20px] font-bold text-[#00D9FF]">
            Study 20 mins/day = Reach {targetScore}+ in 8 weeks
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <motion.button
            onClick={handleStartPlan}
            className="w-[360px] h-[72px] rounded-xl font-bold text-[20px] text-[#0A1628]"
            style={{
              background: 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)',
              boxShadow: '0 8px 24px rgba(180, 255, 57, 0.5)',
            }}
            whileHover={{ scale: 1.02 }}
            animate={{
              boxShadow: [
                '0 8px 24px rgba(180, 255, 57, 0.5)',
                '0 8px 32px rgba(180, 255, 57, 0.7)',
                '0 8px 24px rgba(180, 255, 57, 0.5)',
              ],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
              },
            }}
          >
            Start my Day 1 plan →
          </motion.button>
        </div>
      </div>
    </div>
  );
};
