import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePremium } from '@/hooks/usePremium';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const subjects = [
  {
    id: 'english-language-1',
    title: 'English Language Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 45min',
    topics: '5 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-pink-400 to-pink-600',
    route: '/exam/english-language-1'
  },
  {
    id: 'religious-studies-1',
    title: 'Religious Studies Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 30min',
    topics: '7 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-slate-400 to-slate-600',
    route: '/exam/religious-studies-1'
  },
  {
    id: 'history-1',
    title: 'History Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 15min',
    topics: '4 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-orange-400 to-orange-600',
    route: '/exam/history-1'
  },
  {
    id: 'english-literature-1',
    title: 'English Literature Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 45min',
    topics: '13 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-pink-300 to-pink-500',
    route: '/exam/english-literature-1'
  },
  {
    id: 'physics-1',
    title: 'Physics Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 45min',
    topics: '8 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-blue-400 to-blue-600',
    route: '/exam/physics-1'
  },
  {
    id: 'geography-1',
    title: 'Geography Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 30min',
    topics: '14 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-teal-400 to-teal-600',
    route: '/exam/geography-1'
  },
  {
    id: 'geography-2',
    title: 'Geography Paper 2',
    subtitle: 'Full predicted paper practice',
    duration: '1h 30min',
    topics: '3 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-purple-400 to-purple-600',
    route: '/exam/geography-2'
  },
  {
    id: 'mathematics-1',
    title: 'Mathematics Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 30min',
    topics: '6 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-indigo-400 to-indigo-600',
    route: '/exam/mathematics-1'
  },
  {
    id: 'biology-1',
    title: 'Biology Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 45min',
    topics: '8 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-green-400 to-green-600',
    route: '/exam/biology-1'
  },
  {
    id: 'chemistry-1',
    title: 'Chemistry Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 45min',
    topics: '11 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-emerald-400 to-emerald-600',
    route: '/exam/chemistry-1'
  },
  {
    id: 'business-1',
    title: 'Business Paper 1',
    subtitle: 'Full predicted paper practice',
    duration: '1h 30min',
    topics: '4 topics covered',
    examBoard: 'AQA GCSE',
    color: 'from-purple-300 to-purple-500',
    route: '/exam/business-1'
  },
  {
    id: 'combined-science-biology-1',
    title: 'Combined Science Biology Paper 1',
    subtitle: 'Biology Topics 1-4: Cell Biology Organisation, Infection and response and Bioenergetics',
    duration: '1h 15min',
    topics: '70 marks • 16.7% of GCSE',
    examBoard: 'AQA GCSE',
    color: 'from-slate-300 to-slate-500',
    route: '/exam/combined-science-biology-1'
  }
];

const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const { user } = useAuth();

  const handleStartPremiumExam = async (subject: typeof subjects[0]) => {
    if (isPremium) {
      // Navigate directly to exam interface
      navigate(subject.route);
      return;
    }

    if (!user) {
      toast.error('Please log in to access premium features');
      navigate('/login');
      return;
    }

    try {
      // Create Stripe subscription
      const { data, error } = await supabase.functions.invoke('create-subscription');
      
      if (error) {
        toast.error('Failed to create subscription. Please try again.');
        console.error('Subscription error:', error);
        return;
      }

      if (data?.url) {
        // Store the intended route to redirect after payment
        sessionStorage.setItem('post-payment-route', subject.route);
        // Open Stripe checkout in same tab
        window.location.href = data.url;
      } else {
        toast.error('Invalid response from subscription service');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-bold text-white">Predicted 2026 Questions</span>
          </div>
          <p className="text-lg text-white/90">Premium exam simulation</p>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="bg-amber-400 text-black px-4 py-2 rounded-full font-semibold text-sm">
            😎 PREMIUM EXCLUSIVE
          </div>
          <div className="bg-white/20 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Weekly Updates</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Select Your Subject
        </h1>
        <p className="text-white/80 text-center max-w-2xl mx-auto">
          Choose a subject to start your full-length predicted exam practice. Each paper 
          follows the official exam board format with real exam timing.
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center mt-8 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex space-x-1">
            <button className="px-6 py-2 rounded-full bg-white text-purple-900 font-semibold text-sm">
              AQA
            </button>
            <button className="px-6 py-2 rounded-full text-white/70 hover:text-white font-semibold text-sm">
              Edexcel
            </button>
            <button className="px-6 py-2 rounded-full text-white/70 hover:text-white font-semibold text-sm">
              CCEA
            </button>
            <button className="px-6 py-2 rounded-full text-white/70 hover:text-white font-semibold text-sm">
              OCR
            </button>
            <button className="px-6 py-2 rounded-full text-white/70 hover:text-white font-semibold text-sm">
              WJEC
            </button>
          </div>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div
              key={subject.id}
              className={`bg-gradient-to-br ${subject.color} rounded-3xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-xl`}
            >
              {/* Background Pattern */}
              <div className="absolute top-4 right-4 opacity-20">
                <BookOpen className="h-12 w-12" />
              </div>
              
              {/* Exam Board Badge */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-semibold">
                {subject.examBoard}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4">
                  <BookOpen className="h-8 w-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">{subject.title}</h3>
                  <p className="text-white/80 text-sm">{subject.subtitle}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {subject.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span>{subject.topics}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartPremiumExam(subject)}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold py-3 rounded-xl transition-all duration-300 group-hover:scale-105"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Start Premium Exam
                  <Star className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;