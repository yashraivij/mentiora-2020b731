import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface TopicProgress {
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const SubjectTopics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);

  const subject = curriculum.find(s => s.id === subjectId);

  useEffect(() => {
    if (user?.id) {
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const allProgress = JSON.parse(savedProgress);
        const subjectProgress = allProgress.filter((p: any) => p.subjectId === subjectId);
        setTopicProgress(subjectProgress);
      }
    }
  }, [user?.id, subjectId]);

  const getSubjectIcon = (subjectId: string | undefined) => {
    if (!subjectId) return '📚';
    const icons: Record<string, string> = {
      biology: '🧬',
      chemistry: '⚗️',
      physics: '⚛️',
      maths: '📐',
      english: '📖',
      geography: '🌍',
      history: '🏛️',
      'computer-science': '💻'
    };
    return icons[subjectId] || '📚';
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string) => {
    const progress = topicProgress.find(p => p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="border-b border-[#E7ECF5] bg-background sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="hover:bg-[#F7F9FC] rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            {subject?.name}
          </h1>
        </div>
      </header>

      {/* Main Content - Centered, Clean */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Vertical Topic List */}
        <div className="space-y-4">
          {subject?.topics.map((topic, index) => {
            const progress = getTopicProgress(topic.id);
            const isCompleted = progress.averageScore >= 75;
            const isInProgress = progress.attempts > 0 && !isCompleted;
            
            return (
              <Card
                key={topic.id}
                onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                className="group cursor-pointer rounded-2xl border-[#E7ECF5] hover:border-[#2E5BFF] hover:shadow-[0_8px_32px_rgba(46,91,255,0.12)] transition-all duration-300"
              >
                <div className="p-6 flex items-center gap-6">
                  {/* Topic Icon/Number */}
                  <div className={`
                    flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-[#17B26A] to-[#15A862] text-white' 
                      : isInProgress
                        ? 'bg-gradient-to-br from-[#2E5BFF] to-[#60A5FA] text-white'
                        : 'bg-[#F7F9FC] text-[#0F172A] group-hover:bg-gradient-to-br group-hover:from-[#2E5BFF] group-hover:to-[#60A5FA] group-hover:text-white'
                    }
                  `}>
                    {getSubjectIcon(subjectId)}
                  </div>
                  
                  {/* Topic Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-1 group-hover:text-[#2E5BFF] transition-colors">
                      {topic.name}
                    </h3>
                    
                    {/* Progress Bar */}
                    {progress.attempts > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}</span>
                          <span>·</span>
                          <span className={`font-medium ${
                            progress.averageScore >= 75 ? 'text-[#17B26A]' : 
                            progress.averageScore >= 50 ? 'text-[#2E5BFF]' : 
                            'text-[#FDB022]'
                          }`}>
                            {progress.averageScore}% avg
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#E7ECF5] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress.averageScore >= 75 
                                ? 'bg-gradient-to-r from-[#17B26A] to-[#15A862]' 
                                : 'bg-gradient-to-r from-[#2E5BFF] to-[#60A5FA]'
                            }`}
                            style={{ width: `${Math.min(progress.averageScore, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    {progress.attempts === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Ready to start
                      </p>
                    )}
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-[#17B26A]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#17B26A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <svg className="w-6 h-6 text-muted-foreground group-hover:text-[#2E5BFF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
