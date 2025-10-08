import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen } from "lucide-react";

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

  const getTopicIcon = (topicName: string) => {
    // Return appropriate icon based on topic
    return BookOpen;
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 mb-8 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Subject Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gray-900">
          {subject.name}
        </h1>

        {/* Topics List */}
        <div className="space-y-6">
          {subject.topics.map((topic) => {
            const progress = getTopicProgress(topic.id);
            const TopicIcon = getTopicIcon(topic.name);
            
            return (
              <button
                key={topic.id}
                onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                className="w-full text-left group"
              >
                <div className="flex flex-col items-center">
                  {/* Circular Icon */}
                  <div className="w-24 h-24 rounded-full bg-[#84CC16] flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                    <TopicIcon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  
                  {/* Topic Name */}
                  <h3 className="text-base font-medium text-gray-900 text-center group-hover:text-[#3DB4E8] transition-colors">
                    {topic.name}
                  </h3>
                  
                  {/* Progress Indicator (if any) */}
                  {progress.attempts > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {progress.averageScore >= 85 ? '✓ Mastered' : `${progress.averageScore}% complete`}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
