import { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { readingWritingQuestions, mathQuestions } from "@/data/diagnosticQuestions";
import confetti from "canvas-confetti";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, ComposedChart } from "recharts";
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

  const firstName = localStorage.getItem('onboarding_first_name') || 'Yash';
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
          particleCount: 30,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#00D9FF', '#B4FF39'],
          gravity: 0.8,
          scalar: 0.8,
          drift: 0,
          ticks: 200,
          disableForReducedMotion: true,
        });
      }, 1500);

      return controls.stop;
    }, 300);

    // Save to localStorage
    localStorage.setItem('diagnostic_completed', 'true');
    localStorage.setItem('diagnostic_score', totalScore.toString());
  }, [scoreDisplay]);

  // Comparison data (with vs without)
  const projectedWithout = Math.round(score + 80);
  const comparisonData = [
    { week: 0, with: score, without: score },
    { week: 2, with: score + Math.round(gap * 0.25), without: score + 20 },
    { week: 4, with: score + Math.round(gap * 0.5), without: score + 40 },
    { week: 6, with: score + Math.round(gap * 0.75), without: score + 60 },
    { week: 8, with: targetScore, without: projectedWithout }
  ];

  const getWeakAreaEmoji = (priority: number) => {
    if (priority === 1) return '🔴';
    if (priority === 2) return '🟠';
    return '🟡';
  };

  const getWeakAreaBorderColor = (priority: number) => {
    if (priority === 1) return '#EF4444';
    return '#FBB836';
  };

  const getWeakAreaBg = (priority: number) => {
    if (priority === 1) return 'rgba(239, 68, 68, 0.15)';
    return 'rgba(251, 184, 54, 0.12)';
  };

  const getWeakAreaHeight = (priority: number) => {
    if (priority === 1) return '90px';
    if (priority === 2) return '80px';
    return '70px';
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)' }}>
      
      {/* SECTION 1: SCORE REVEAL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[800px] mx-auto text-center"
        style={{ padding: '80px 40px 60px 40px' }}
      >
        {/* Label */}
        <p className="text-[13px] font-bold uppercase tracking-[2px] mb-10" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          YOUR DIAGNOSTIC RESULTS
        </p>

        {/* Score Number */}
        <motion.div 
          className="text-[120px] font-bold text-center"
          style={{ 
            color: '#00D9FF',
            textShadow: '0 0 60px rgba(0, 217, 255, 0.5)',
            lineHeight: 1
          }}
        >
          {displayScore}
        </motion.div>

        {/* Subscores */}
        <p className="text-[22px] font-medium mt-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Math: {mathScore}  |  Reading & Writing: {rwScore}
        </p>

        {/* Divider */}
        <div 
          className="mx-auto mt-12"
          style={{ 
            width: '60%', 
            height: '1px', 
            background: 'rgba(255, 255, 255, 0.15)' 
          }}
        />
      </motion.div>

      {/* SECTION 2: THE GAP (Comparison Graph) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-[700px] mx-auto"
        style={{ padding: '0 40px 60px 40px' }}
      >
        {/* Heading */}
        <h2 className="text-[28px] font-bold text-white text-center mb-8">
          Here's what we need to do, {firstName}
        </h2>

        {/* Comparison Graph */}
        <div 
          className="w-full rounded-2xl p-8"
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            height: '300px'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={comparisonData}>
              <defs>
                <linearGradient id="withGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00D9FF" />
                  <stop offset="100%" stopColor="#B4FF39" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="week" 
                stroke="rgba(255, 255, 255, 0.3)"
                tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
                label={{ value: 'Week', position: 'insideBottom', offset: -5, fill: 'rgba(255, 255, 255, 0.6)' }}
              />
              <YAxis 
                domain={[Math.max(400, score - 100), targetScore + 100]}
                stroke="rgba(255, 255, 255, 0.3)"
                tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
              />
              <Area
                type="monotone"
                dataKey="with"
                stroke="none"
                fill="url(#areaGradient)"
              />
              <Line 
                type="monotone"
                dataKey="without"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'rgba(255, 255, 255, 0.5)', r: 4 }}
              />
              <Line 
                type="monotone"
                dataKey="with"
                stroke="url(#withGradient)"
                strokeWidth={3}
                dot={{ fill: '#00D9FF', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Caption */}
        <p className="text-center text-[16px] font-medium mt-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {gap} points in 8 weeks = {Math.round(gap / 8)} points/week = just 20 minutes/day
        </p>

        {/* Call-out Box */}
        <div 
          className="rounded-xl mt-6"
          style={{ 
            background: 'rgba(0, 217, 255, 0.12)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            padding: '20px 24px'
          }}
        >
          <p className="text-[16px] text-white leading-[1.7]">
            💡 {gap} points sounds like a lot. But here's the reality: that's just {questionsNeeded} more correct answers across the entire test. Totally doable.
          </p>
        </div>

        {/* Divider */}
        <div className="my-[60px]" />
      </motion.div>

      {/* SECTION 3: THE PROOF (Why It Works) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-[700px] mx-auto"
        style={{ padding: '0 40px 60px 40px' }}
      >
        {/* Heading */}
        <h2 className="text-[24px] font-bold text-white text-center mb-8">
          Why this works
        </h2>

        {/* Weak Areas Cards */}
        {weakAreas.map((area, index) => (
          <div
            key={index}
            className="rounded-[10px] mb-4 flex items-center justify-between"
            style={{
              height: getWeakAreaHeight(area.priority),
              background: getWeakAreaBg(area.priority),
              borderLeft: `5px solid ${getWeakAreaBorderColor(area.priority)}`,
              padding: '20px 24px'
            }}
          >
            <div>
              <p className="text-[18px] font-bold text-white mb-1">
                {getWeakAreaEmoji(area.priority)} {area.topic}
              </p>
              <p className="text-[14px]" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Priority #{area.priority} - {area.priority === 1 ? 'Starting today' : 'Coming soon'}
              </p>
            </div>
            <div className="text-[24px] font-bold" style={{ color: getWeakAreaBorderColor(area.priority) }}>
              {area.accuracy}%
            </div>
          </div>
        ))}

        {/* Bottom Text */}
        <p className="text-center text-[16px] mt-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          We'll tackle these one by one, starting with your biggest opportunity.
        </p>

        {/* Divider */}
        <div className="my-[60px]" />
      </motion.div>

      {/* SECTION 4: TODAY'S PLAN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-[600px] mx-auto text-center"
        style={{ padding: '0 40px 40px 40px' }}
      >
        {/* Badge */}
        <div className="inline-block mb-5" style={{
          background: 'rgba(180, 255, 57, 0.15)',
          padding: '6px 16px',
          borderRadius: '20px'
        }}>
          <span className="text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: '#B4FF39' }}>
            YOUR NEXT STEP
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-[32px] font-bold text-white mb-4">
          Day 1 Plan: Ready Now
        </h2>

        {/* Urgency */}
        <p className="text-[18px] font-medium mb-8" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          We need to jump {gap} points. Here's how:
        </p>

        {/* Plan Preview Box */}
        <div 
          className="rounded-2xl text-left"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            padding: '28px 32px'
          }}
        >
          {/* Today's Focus */}
          <h3 className="text-[22px] font-bold mb-3" style={{ color: '#00D9FF' }}>
            Today: Tackling {weakAreas[0]?.topic || 'Your Focus Area'}
          </h3>

          {/* Subtitle */}
          <p className="text-[16px] mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Your biggest opportunity for improvement
          </p>

          {/* Bullets */}
          <div className="text-[16px] text-white leading-[2] mb-5">
            <p>• 5-min lesson on {weakAreas[0]?.topic || 'problem solving'} strategies</p>
            <p>• 10 mins focused practice</p>
            <p>• 5-min review</p>
          </div>

          {/* Bottom Line */}
          <div 
            className="rounded-lg text-center"
            style={{
              background: 'rgba(180, 255, 57, 0.1)',
              padding: '12px'
            }}
          >
            <p className="text-[17px] font-bold text-white">
              Total: 20 minutes. That's all it takes.
            </p>
          </div>
        </div>
      </motion.div>

      {/* SECTION 5: THE CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-[500px] mx-auto text-center"
        style={{ padding: '40px 40px 80px 40px' }}
      >
        {/* Primary Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full h-[64px] text-[19px] font-bold rounded-xl border-none transition-all duration-150 hover:translate-y-[-3px]"
          style={{
            background: 'linear-gradient(135deg, #B4FF39, #9FE01F)',
            color: '#0A1628',
            boxShadow: '0 10px 30px rgba(180, 255, 57, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 14px 40px rgba(180, 255, 57, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(180, 255, 57, 0.4)';
          }}
        >
          Start Today's Plan →
        </Button>

        {/* Secondary Link */}
        <button 
          className="text-[14px] mt-4 hover:underline"
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          onClick={() => {
            const choice = window.confirm("When would you like to start?\n\nClick OK for Later today\nClick Cancel to see other options");
            if (choice) {
              alert("Great! We'll remind you later today.");
            } else {
              alert("Choose:\n• Tomorrow morning\n• This weekend");
            }
          }}
        >
          I'll start later
        </button>
      </motion.div>

    </div>
  );
};
