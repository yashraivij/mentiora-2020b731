import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Target, Sparkles, Rocket, AlertCircle, Crown } from "lucide-react";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { generateCustomExam, saveCustomExamConfig, type CustomExamConfig } from "@/services/customExamService";
import mentioraLogo from "@/assets/mentiora-logo.png";

const CustomExamBuilder = () => {
  const navigate = useNavigate();
  const { curriculum, isLoading: curriculumLoading } = useCurriculum();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<CustomExamConfig>>({
    title: "",
    subjectId: "",
    examBoard: null,
    selectedTopics: [],
    timerMinutes: 60,
    difficultyFilter: "mixed",
    targetMarks: 50,
    questionCount: 20
  });
  const [availableQuestionCount, setAvailableQuestionCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate available questions when topics are selected
  useEffect(() => {
    if (config.subjectId && config.selectedTopics && config.selectedTopics.length > 0) {
      const subject = curriculum.find(s => s.id === config.subjectId);
      if (subject) {
        const count = subject.topics
          .filter(t => config.selectedTopics?.includes(t.id))
          .reduce((sum, topic) => sum + topic.questions.length, 0);
        setAvailableQuestionCount(count);
      }
    } else {
      setAvailableQuestionCount(0);
    }
  }, [config.subjectId, config.selectedTopics, curriculum]);

  const selectedSubject = curriculum.find(s => s.id === config.subjectId);
  const selectedTopics = selectedSubject?.topics.filter(t => 
    config.selectedTopics?.includes(t.id)
  ) || [];

  const handleSubjectSelect = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    setConfig({ 
      ...config, 
      subjectId, 
      selectedTopics: [], 
      examBoard: subject?.examBoard || null 
    });
    setStep(2);
  };

  const handleTopicToggle = (topicId: string) => {
    const current = config.selectedTopics || [];
    const updated = current.includes(topicId)
      ? current.filter(id => id !== topicId)
      : [...current, topicId];
    setConfig({ ...config, selectedTopics: updated });
  };

  const handleGenerateExam = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create custom exams",
        variant: "destructive"
      });
      return;
    }

    if (!config.subjectId || !config.selectedTopics || config.selectedTopics.length === 0) {
      toast({
        title: "Invalid configuration",
        description: "Please select a subject and at least one topic",
        variant: "destructive"
      });
      return;
    }

    let examTitle = config.title;
    if (!examTitle || examTitle.trim() === "") {
      examTitle = `Custom ${selectedSubject?.name || 'Exam'} Paper`;
      setConfig({ ...config, title: examTitle });
    }

    setIsGenerating(true);

    try {
      // Generate the exam questions
      const questions = await generateCustomExam(config as CustomExamConfig, curriculum);
      
      if (questions.length === 0) {
        toast({
          title: "No questions available",
          description: "No questions match your criteria. Try adjusting your selection.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      // Save the configuration
      const configId = await saveCustomExamConfig({
        ...config,
        title: examTitle,
        questionCount: questions.length
      } as CustomExamConfig);

      // Store questions in sessionStorage for the exam page
      sessionStorage.setItem(`custom-exam-${configId}`, JSON.stringify(questions));

      toast({
        title: "✨ Exam generated!",
        description: `Your custom paper with ${questions.length} questions is ready`,
      });

      // Navigate to exam page
      navigate(`/predicted-exam/custom/${configId}`);
    } catch (error) {
      console.error('❌ Error generating exam:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const getSubjectColor = (subjectId: string) => {
    const colors: Record<string, string> = {
      chemistry: "from-primary via-primary/80 to-primary/60",
      biology: "from-secondary via-secondary/80 to-secondary/60",
      physics: "from-accent via-accent/80 to-accent/60",
      mathematics: "from-primary via-primary/80 to-primary/60",
      "english-language": "from-secondary via-secondary/80 to-secondary/60",
      geography: "from-secondary via-secondary/80 to-secondary/60",
    };
    return colors[subjectId] || "from-muted via-muted/80 to-muted/60";
  };

  const estimatedQuestions = Math.floor(config.targetMarks! / 4); // Rough estimate

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => step > 1 ? setStep(step - 1) : navigate('/predicted-questions')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Build My Exam Paper</h1>
                <p className="text-sm text-muted-foreground">
                  Create personalized practice papers tailored to your needs
                </p>
              </div>
            </div>
            <img src={mentioraLogo} alt="Mentiora" className="h-8" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        {/* Step 1: Subject Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Choose Your Subject</h2>
              <p className="text-muted-foreground">
                Select the subject for your custom exam paper
              </p>
              <Badge variant="outline" className="bg-primary/10">
                <Sparkles className="h-3 w-3 mr-1" />
                Stop repeating the same questions!
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {curriculum.map((subject) => (
                <Card
                  key={subject.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => handleSubjectSelect(subject.id)}
                >
                  <CardHeader className={`bg-gradient-to-br ${getSubjectColor(subject.id)} text-white`}>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription className="text-white/90">
                      {subject.topics.length} topics available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total questions:</span>
                      <span className="font-semibold">
                        {subject.topics.reduce((sum, t) => sum + t.questions.length, 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Topic Selection */}
        {step === 2 && selectedSubject && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Select Topics</h2>
              <p className="text-muted-foreground">
                Choose which topics to include in your exam
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig({
                    ...config,
                    selectedTopics: selectedSubject.topics.map(t => t.id)
                  })}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig({ ...config, selectedTopics: [] })}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSubject.topics.map((topic) => {
                const isSelected = config.selectedTopics?.includes(topic.id);
                return (
                  <Card
                    key={topic.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleTopicToggle(topic.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{topic.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {topic.questions.length} questions available
                          </CardDescription>
                        </div>
                        <Checkbox checked={isSelected} />
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                {config.selectedTopics?.length || 0} topics selected
              </p>
              <Button
                onClick={() => setStep(3)}
                disabled={!config.selectedTopics || config.selectedTopics.length === 0}
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Exam Configuration */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Configure Your Exam</h2>
              <p className="text-muted-foreground">
                Customize timer, difficulty, and question types
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timer Length */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timer Length
                  </CardTitle>
                  <CardDescription>Set your exam duration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 45, 60, 90, 120].map((minutes) => (
                      <Button
                        key={minutes}
                        variant={config.timerMinutes === minutes ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConfig({ ...config, timerMinutes: minutes })}
                      >
                        {minutes}min
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Custom duration (minutes)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={300}
                      value={config.timerMinutes}
                      onChange={(e) => setConfig({
                        ...config,
                        timerMinutes: parseInt(e.target.value) || 60
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Difficulty Level
                  </CardTitle>
                  <CardDescription>Choose question difficulty</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={config.difficultyFilter}
                    onValueChange={(value: any) => setConfig({ ...config, difficultyFilter: value })}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2 p-3 rounded-lg hover:bg-accent">
                        <RadioGroupItem value="easy" id="easy" />
                        <div className="flex-1">
                          <Label htmlFor="easy" className="font-medium cursor-pointer">Easy</Label>
                          <p className="text-xs text-muted-foreground">Foundation-level, builds confidence</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-3 rounded-lg hover:bg-accent">
                        <RadioGroupItem value="medium" id="medium" />
                        <div className="flex-1">
                          <Label htmlFor="medium" className="font-medium cursor-pointer">Medium</Label>
                          <p className="text-xs text-muted-foreground">Average exam standards</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-3 rounded-lg hover:bg-accent">
                        <RadioGroupItem value="hard" id="hard" />
                        <div className="flex-1">
                          <Label htmlFor="hard" className="font-medium cursor-pointer">Hard</Label>
                          <p className="text-xs text-muted-foreground">Challenging, top grade prep</p>
                        </div>
                      </div>
                      <div className={`flex items-start space-x-2 p-3 rounded-lg hover:bg-accent ${!isPremium ? 'opacity-50' : ''}`}>
                        <RadioGroupItem value="predicted-2026" id="predicted-2026" disabled={!isPremium} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="predicted-2026" className="font-medium cursor-pointer">
                              Predicted 2026 Difficulty
                            </Label>
                            {!isPremium && <Crown className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground">AI-calibrated to match 2026 standards</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-3 rounded-lg hover:bg-accent">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <div className="flex-1">
                          <Label htmlFor="mixed" className="font-medium cursor-pointer">Mixed</Label>
                          <p className="text-xs text-muted-foreground">Balanced across all levels</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Target Marks */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Target Marks</CardTitle>
                  <CardDescription>
                    Choose how many marks you want your exam to be worth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Total Marks: {config.targetMarks}</Label>
                      <span className="text-sm text-muted-foreground">
                        ~{estimatedQuestions} questions
                      </span>
                    </div>
                    <Slider
                      value={[config.targetMarks!]}
                      onValueChange={([value]) => setConfig({ ...config, targetMarks: value })}
                      min={20}
                      max={120}
                      step={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Review & Generate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Generate */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Review Your Exam</h2>
              <p className="text-muted-foreground">
                Check your configuration before generating
              </p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-primary" />
                  Your Custom Exam Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="examTitle">Exam Title (Optional)</Label>
                  <Input
                    id="examTitle"
                    placeholder={`Custom ${selectedSubject?.name || 'Exam'} Paper`}
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  />
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{selectedTopics.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Topics</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{config.targetMarks}</p>
                    <p className="text-xs text-muted-foreground mt-1">Target Marks</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{config.timerMinutes}min</p>
                    <p className="text-xs text-muted-foreground mt-1">Duration</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary capitalize">{config.difficultyFilter}</p>
                    <p className="text-xs text-muted-foreground mt-1">Difficulty</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subject:</span>
                    <span className="text-sm">{selectedSubject?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Selected Topics:</span>
                    <span className="text-sm">{selectedTopics.map(t => t.name).join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Questions Available:</span>
                    <Badge variant="secondary">{availableQuestionCount} questions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimated Questions:</span>
                    <span className="text-sm">~{estimatedQuestions} questions</span>
                  </div>
                </div>

                {/* Value Message */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Every exam is unique!</p>
                      <p className="text-sm text-muted-foreground">
                        Questions are randomized from {availableQuestionCount} available options.
                        Never see the same paper twice unless you want to.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    Change Subject
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                    Edit Topics
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                    Adjust Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Warning if too few questions */}
            {availableQuestionCount < estimatedQuestions && (
              <Card className="border-amber-500/50 bg-amber-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Limited Question Pool</p>
                      <p className="text-sm text-muted-foreground">
                        Only {availableQuestionCount} questions available for your selection.
                        Your exam may have fewer questions than estimated.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleGenerateExam}
                disabled={isGenerating}
                className="bg-primary hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Generate My Exam Paper
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomExamBuilder;