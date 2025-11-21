import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { readingWritingQuestions } from "@/data/diagnosticQuestions";

export const ReadingWritingDiagnostic = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();

  const question = readingWritingQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / readingWritingQuestions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion] || "");
  }, [currentQuestion, answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerSelect = (letter: string) => {
    setSelectedAnswer(letter);
    setAnswers({ ...answers, [currentQuestion]: letter });
  };

  const handleNext = () => {
    if (currentQuestion < readingWritingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save results and navigate to results
      localStorage.setItem('diagnostic_rw_answers', JSON.stringify(answers));
      localStorage.setItem('diagnostic_rw_time', timeElapsed.toString());
      navigate('/diagnostic/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < readingWritingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="h-[72px] border-b border-[#E1E8ED] px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[18px] font-bold text-[#0A1628]">
            Reading & Writing Diagnostic | Question {currentQuestion + 1} of {readingWritingQuestions.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Clock className="w-4 h-4 text-[#8899A6]" />
          <span className="text-[16px] text-[#8899A6]">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[#E1E8ED]">
        <motion.div
          className="h-full bg-[#00D9FF]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-[900px] mx-auto px-20 py-12">
        {/* Question Number */}
        <div className="text-[14px] text-[#8899A6] uppercase tracking-wider mb-4">
          Question {currentQuestion + 1}
        </div>

        {/* Passage (if exists) */}
        {question.passage && (
          <div 
            className="max-w-[700px] rounded-lg p-6 mb-8"
            style={{
              background: '#F9FAFB',
              borderLeft: '4px solid #00D9FF',
            }}
          >
            <p className="text-[16px] text-[#374151] leading-relaxed">
              {question.passage}
            </p>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-[24px] font-semibold text-[#0A1628] mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3 mb-12 max-w-[700px]">
          {question.options.map((option) => (
            <motion.button
              key={option.letter}
              onClick={() => handleAnswerSelect(option.letter)}
              whileHover={{ scale: 1.01 }}
              className="w-full min-h-[72px] rounded-xl p-6 flex items-center gap-4 transition-all text-left"
              style={{
                background: selectedAnswer === option.letter ? '#FFF7F5' : 'white',
                border: selectedAnswer === option.letter 
                  ? '2px solid #00D9FF' 
                  : '2px solid #E1E8ED',
              }}
            >
              {/* Letter Badge */}
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-[16px] flex-shrink-0"
                style={{
                  background: selectedAnswer === option.letter ? '#00D9FF' : '#F3F4F6',
                  color: selectedAnswer === option.letter ? 'white' : '#0A1628',
                }}
              >
                {option.letter}
              </div>

              {/* Option Text */}
              <span className="text-[16px] text-[#0A1628] flex-1">
                {option.text}
              </span>

              {/* Radio Circle */}
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  border: selectedAnswer === option.letter 
                    ? '2px solid #00D9FF' 
                    : '2px solid #D1D5DB',
                  background: selectedAnswer === option.letter ? '#00D9FF' : 'transparent',
                }}
              >
                {selectedAnswer === option.letter && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between max-w-[700px]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSkip}
              className="text-[15px] text-[#8899A6] hover:text-[#0A1628] transition-colors"
            >
              Skip
            </button>
            {currentQuestion > 0 && (
              <button
                onClick={handlePrevious}
                className="px-7 py-3.5 rounded-lg border-2 border-[#E1E8ED] text-[#6B7280] font-medium hover:border-[#00D9FF] transition-all"
              >
                ← Previous
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-8 py-3.5 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: selectedAnswer 
                ? 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)' 
                : '#D1D5DB',
              color: selectedAnswer ? '#0A1628' : 'white',
            }}
          >
            {currentQuestion === readingWritingQuestions.length - 1 ? 'Complete Test →' : 'Next Question →'}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center text-[14px] text-[#8899A6]">
          {answeredCount} of {readingWritingQuestions.length} answered
        </div>
      </div>
    </div>
  );
};
