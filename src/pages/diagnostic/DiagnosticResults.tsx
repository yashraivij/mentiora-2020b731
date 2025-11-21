import { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { readingWritingQuestions, mathQuestions } from "@/data/diagnosticQuestions";
import confetti from "canvas-confetti";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";

interface WeakArea {
  topic: string;
  accuracy: number;
  priority: number;
}

export const DiagnosticResults = () => {
  const [score, setScore] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [rwScore, setRwScore] = useState(0);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [strongestArea, setStrongestArea] = useState<{ topic: string; accuracy: number } | null>(null);
  const navigate = useNavigate();

  const scoreDisplay = useMotionValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  const firstName = localStorage.getItem('onboarding_first_name') || 'there';
  const targetScore = parseInt(localStorage.getItem('onboarding_target_score') || '1300');
  const gap = Math.max(0, targetScore - score);
  const questionsNeeded = Math.ceil(gap / 4);

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

    // Find weak areas and strongest area
    const areas = Object.entries(topicScores).map(([topic, data]) => ({
      topic: topic.charAt(0).toUpperCase() + topic.slice(1),
      accuracy: Math.round((data.correct / data.total) * 100),
    }));

    const weak = areas
      .filter(a => a.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .map((area, index) => ({
        ...area,
        priority: index + 1,
      }));

    const strong = areas
      .filter(a => a.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy);

    setWeakAreas(weak);
    if (strong.length > 0) {
      setStrongestArea(strong[0]);
    }

    // Animate score count-up
    setTimeout(() => {
      const controls = animate(scoreDisplay, totalScore, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayScore(Math.round(latest))
      });

      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#00D9FF', '#B4FF39'],
          disableForReducedMotion: true,
        });
      }, 100);

      return controls.stop;
    }, 300);

    // Save to localStorage
    localStorage.setItem('diagnostic_completed', 'true');
    localStorage.setItem('diagnostic_score', totalScore.toString());
  }, [scoreDisplay]);

  // Data for projection graph
  const projectionData = [
    { week: 0, score: score, label: 'Now' },
    { week: 2, score: score + (gap * 0.25) },
    { week: 4, score: score + (gap * 0.5) },
    { week: 6, score: score + (gap * 0.75) },
    { week: 8, score: targetScore, label: 'Target' },
  ];

  const getWeakAreaEmoji = (priority: number) => {
    if (priority === 1) return '🔴';
    if (priority === 2) return '🟠';
    return '🟡';
  };

  const getWeakAreaBorderColor = (priority: number) => {
    if (priority === 1) return '#EF4444';
    if (priority === 2) return '#F59E0B';
    return '#FBB836';
  };

  const getWeakAreaHeight = (priority: number) => {
    if (priority === 1) return '80px';
    if (priority === 2) return '70px';
    return '60px';
  };

  const handleStartPlan = () => {
    navigate('/dashboard');
  };

  const currentPercentage = (score / 1600) * 100;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT COLUMN - Score Section */}
      <div 
        className="w-full lg:w-1/2 px-6 lg:px-10 py-12 lg:py-16 flex flex-col justify-center"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)',
        }}
      >
        <div className="max-w-[600px] mx-auto w-full">
          {/* Score Reveal */}
          <div className="text-center mb-8">
            <p className="text-[20px] font-medium text-white/70 mb-2">
              Your SAT Breakdown
            </p>
            <p className="text-[16px] text-white/60 mb-8">
              Your Current Estimated Score:
            </p>
            
            <motion.div
              className="text-[96px] font-bold mb-4"
              style={{
                color: '#00D9FF',
                textShadow: '0 0 40px rgba(0, 217, 255, 0.6)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {displayScore}
            </motion.div>

            <p className="text-[24px] font-medium text-white/80">
              Math: {mathScore}  |  Reading & Writing: {rwScore}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 w-4/5 mx-auto my-8" />

          {/* Gap to Target */}
          <div className="mb-8">
            <p className="text-[18px] text-white/70 text-center mb-3">
              Target: {targetScore}
            </p>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-white/15 rounded-full mb-3 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF 0%, #B4FF39 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${currentPercentage}%` }}
                transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[12px] text-white/50 mb-4">
              <span>400</span>
              <span>1600</span>
            </div>

            <p className="text-[20px] font-bold text-center" style={{ color: '#00D9FF' }}>
              {gap} points to reach your goal
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 w-4/5 mx-auto my-8" />

          {/* Confidence Builder */}
          <div 
            className="rounded-xl p-5 mb-8"
            style={{
              background: 'rgba(0, 217, 255, 0.12)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
            }}
          >
            <div className="flex gap-3 items-start">
              <span className="text-[24px]">💪</span>
              <p className="text-[16px] text-white/90 leading-relaxed">
                {strongestArea && strongestArea.accuracy >= 70 ? (
                  <>Good news, {firstName}: Your {strongestArea.topic.toLowerCase()} is strong ({strongestArea.accuracy}%). This means you grasp new concepts quickly - perfect for improving {weakAreas[0]?.topic || 'other areas'}.</>
                ) : (
                  <>{gap} points sounds like a lot. But here's the reality: that's just {questionsNeeded} more correct answers across the entire test. Totally doable.</>
                )}
              </p>
            </div>
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[18px] font-bold text-white mb-5">
                We're focusing on:
              </h3>

              <div className="space-y-3">
                {weakAreas.map((area) => (
                  <div
                    key={area.topic}
                    className="rounded-lg p-4 flex justify-between items-center"
                    style={{
                      height: getWeakAreaHeight(area.priority),
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderLeft: `4px solid ${getWeakAreaBorderColor(area.priority)}`,
                    }}
                  >
                    <div>
                      <p className="text-[18px] font-bold text-white mb-1">
                        {getWeakAreaEmoji(area.priority)} {area.topic}
                      </p>
                      <p className="text-[14px] text-white/70">
                        Priority #{area.priority}{area.priority === 1 ? ' - Starting Day 1' : ''}
                      </p>
                    </div>
                    <p className="text-[18px] font-bold text-white">
                      {area.accuracy}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-white/20 w-4/5 mx-auto my-8" />

          {/* Proof Visualization */}
          <div>
            <h3 className="text-[16px] font-medium text-white/80 mb-4">
              Your projected improvement
            </h3>

            <div 
              className="rounded-lg p-4"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="week" 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[Math.floor(score / 100) * 100 - 100, Math.ceil(targetScore / 100) * 100 + 100]}
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#00D9FF" 
                    strokeWidth={2}
                    fill="url(#scoreGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>

              <p className="text-[13px] italic text-white/50 text-center mt-2">
                Based on 20 mins/day practice
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Today's Plan Preview */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 lg:px-10 py-12">
        <div className="max-w-[540px] w-full">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider"
              style={{
                color: '#00D9FF',
                background: 'rgba(0, 217, 255, 0.1)',
              }}
            >
              READY TO START?
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[32px] font-bold text-center mb-4" style={{ color: '#0A1628' }}>
            Your Day 1 Plan is Ready 🎯
          </h1>

          {/* Urgency message */}
          <p className="text-[18px] text-center mb-2" style={{ color: '#2C3E50' }}>
            {firstName}, we need to jump {gap} points.
          </p>

          <p className="text-[18px] text-center mb-8" style={{ color: '#2C3E50' }}>
            Here's exactly how we'll do it:
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-2 h-2 rounded-full" style={{ background: '#E1E8ED' }} />
          </div>

          {/* Today's Plan Details */}
          <div 
            className="rounded-xl p-6 mb-8"
            style={{
              border: '2px solid #E1E8ED',
              background: '#F9FAFB',
            }}
          >
            <h2 className="text-[20px] font-bold mb-4" style={{ color: '#0A1628' }}>
              Today: Tackling {weakAreas[0]?.topic || 'Your Weakest Area'}
            </h2>

            <p className="text-[16px] mb-6" style={{ color: '#6B7280' }}>
              Your biggest opportunity for improvement
            </p>

            <ul className="space-y-3 mb-6 text-[15px]" style={{ color: '#2C3E50', lineHeight: 1.8 }}>
              <li>• 5-min lesson on {weakAreas[0]?.topic || 'fundamentals'}</li>
              <li>• 10 mins practice</li>
              <li>• 5-min review</li>
            </ul>

            <p className="text-[16px] font-medium" style={{ color: '#0A1628' }}>
              Total: 20 minutes. That's all it takes.
            </p>
          </div>

          {/* Primary CTA */}
          <Button
            onClick={handleStartPlan}
            className="w-full h-[60px] rounded-xl text-[18px] font-bold transition-all duration-150"
            style={{
              background: 'linear-gradient(135deg, #B4FF39, #9FE01F)',
              color: '#0A1628',
              boxShadow: '0 8px 24px rgba(180, 255, 57, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(180, 255, 57, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(180, 255, 57, 0.4)';
            }}
          >
            Start Today's Plan →
          </Button>

          {/* Secondary Option */}
          <button
            onClick={() => {
              if (window.confirm("When would you like to start? We recommend starting today to build momentum!")) {
                navigate('/dashboard');
              }
            }}
            className="w-full text-center text-[14px] mt-4 text-[#8899A6] hover:underline transition-all"
          >
            I'll start later
          </button>
        </div>
      </div>
    </div>
  );
};
