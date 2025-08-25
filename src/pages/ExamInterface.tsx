import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Clock, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const examData: Record<string, any> = {
  'geography-2': {
    title: 'Geography Paper 2 Predicted Exam',
    examBoard: 'AQA GCSE',
    duration: '90 minutes',
    questions: 9,
    instructions: [
      'Answer all questions in the spaces provided',
      'You have 90 minutes to complete this paper',
      'Read each question carefully before answering',
      'Check your work before submitting'
    ]
  },
  'english-language-1': {
    title: 'English Language Paper 1 Predicted Exam',
    examBoard: 'AQA GCSE',
    duration: '105 minutes',
    questions: 5,
    instructions: [
      'Answer all questions in the spaces provided',
      'You have 1 hour 45 minutes to complete this paper',
      'Read each question carefully before answering',
      'Check your work before submitting'
    ]
  }
  // Add more exam configurations as needed
};

const ExamInterface: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);

  const exam = examData[examId || ''] || examData['geography-2']; // Default fallback

  useEffect(() => {
    if (isExamStarted && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isExamStarted, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setIsExamStarted(true);
    // Convert duration to seconds (assuming 90 minutes for now)
    const durationInMinutes = parseInt(exam.duration.split(' ')[0]);
    setTimeLeft(durationInMinutes * 60);
  };

  const handleBackToSubjects = () => {
    navigate('/subject-selection');
  };

  if (isExamStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Exam Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    {timeLeft !== null ? formatTime(timeLeft) : exam.duration}
                  </span>
                </div>
                <Button variant="outline" onClick={handleBackToSubjects}>
                  End Exam
                </Button>
              </div>
            </div>
          </div>

          {/* Exam Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="mb-8">
                <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam in Progress</h2>
                <p className="text-gray-600">
                  This is where the actual exam questions would appear. 
                  The exam system would load the specific questions for {exam.title}.
                </p>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
                  <div className="text-left">
                    <p className="text-amber-800 font-semibold">Demo Mode</p>
                    <p className="text-amber-700 text-sm">
                      In the full version, this would display the actual exam questions with proper formatting, 
                      answer fields, and submission functionality.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
                >
                  Return to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleBackToSubjects}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  Take Another Exam
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToSubjects}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Exam Overview Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-amber-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
            </div>
            <p className="text-gray-600 text-lg">{exam.examBoard} • {exam.duration}</p>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{exam.questions}</div>
              <div className="text-gray-600 font-medium">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{exam.duration.split(' ')[0]}min</div>
              <div className="text-gray-600 font-medium">Time Limit</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8">
            <div className="flex items-start mb-4">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <h3 className="font-semibold text-amber-900">Exam Instructions</h3>
            </div>
            <ul className="space-y-2 text-amber-800">
              {exam.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartExam}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-4 text-lg font-semibold rounded-xl"
          >
            <Clock className="h-5 w-5 mr-2" />
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;