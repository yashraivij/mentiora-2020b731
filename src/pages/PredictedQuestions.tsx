import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Crown, Target } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const PredictedQuestions = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/predicted-exam/${subjectId}`);
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = {
      chemistry: "from-green-500 to-emerald-600",
      biology: "from-emerald-500 to-green-600", 
      physics: "from-blue-500 to-indigo-600",
      mathematics: "from-purple-500 to-indigo-600",
      "english-language": "from-rose-500 to-pink-600",
      "english-literature": "from-pink-500 to-rose-600",
      history: "from-amber-500 to-orange-600",
      geography: "from-teal-500 to-cyan-600",
      "computer-science": "from-slate-500 to-gray-600",
      psychology: "from-violet-500 to-purple-600"
    };
    return colors[subjectId as keyof typeof colors] || "from-gray-500 to-slate-600";
  };

  const getExamDuration = (subjectId: string) => {
    const durations = {
      chemistry: "1h 45min",
      biology: "1h 45min",
      physics: "1h 45min", 
      mathematics: "1h 30min",
      "english-language": "1h 45min",
      "english-literature": "1h 45min",
      history: "1h 15min",
      geography: "1h 30min",
      "computer-science": "1h 30min",
      psychology: "1h 45min"
    };
    return durations[subjectId as keyof typeof durations] || "1h 30min";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-amber-500" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Predicted 2026 Questions</h1>
                  <p className="text-sm text-muted-foreground">Premium exam simulation</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Select Your Subject
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose a subject to start your full-length predicted exam practice. 
            Each paper follows the exact AQA format with real exam timing.
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.map((subject) => (
            <Card 
              key={subject.id} 
              className="group cursor-pointer border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm"
              onClick={() => handleSubjectSelect(subject.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getSubjectColor(subject.id)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    AQA GCSE
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {subject.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  Full predicted paper practice
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration: {getExamDuration(subject.id)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{subject.topics.length} topics covered</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-primary/80 to-primary group-hover:from-primary group-hover:to-primary/90 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubjectSelect(subject.id);
                    }}
                  >
                    Start Predicted Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictedQuestions;