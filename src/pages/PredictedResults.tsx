import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  marks: number;
  section?: string;
}

interface ExamAnswer {
  questionId: string;
  answer: string;
}

const PredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { questions, answers, timeElapsed, isReview, completion } = location.state || {};
  
  if (!questions || !answers) {
    navigate('/predicted-questions');
    return null;
  }

  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }

  // Generate marking and feedback for each question - practice questions format
  const generateMarking = (question: ExamQuestion, answer: ExamAnswer) => {
    const studentAnswer = answer.answer.toLowerCase().trim();
    
    if (!studentAnswer) {
      return { 
        marksAwarded: 0, 
        feedback: "No answer provided", 
        modelAnswer: generateModelAnswer(question),
        markingPoints: [],
        teacherFeedback: "No answer was provided for this question. Make sure to attempt all questions in the exam.",
        specificationPoint: getSpecificationPoint(question),
        grade: "Needs Improvement"
      };
    }
    
    // Simple marking based on content quality and question marks
    const wordCount = studentAnswer.split(/\s+/).length;
    const hasScientificTerms = /\b(energy|force|momentum|reaction|element|cell|gene|equation|graph|data|temperature|pressure|volume|density|mass|weight|velocity|acceleration|current|voltage|resistance|atom|molecule|compound|mixture|solution|acid|base|alkali|salt|oxidation|reduction|catalyst|enzyme|mitosis|meiosis|photosynthesis|respiration|ecosystem|biodiversity|evolution|inheritance|variation|homeostasis|reflex|hormone|nervous|circulatory|digestive|respiratory|excretory|reproductive|skeletal|muscular|hypothesis|theory|experiment|variable|control|method|conclusion|analysis|evaluation|calculate|explain|describe|compare|discuss)\b/gi.test(studentAnswer);
    const hasDetailedExplanation = wordCount >= 15;
    const hasExamples = /\b(example|such as|for instance|like|including)\b/gi.test(studentAnswer);
    const hasStructure = /\b(firstly|secondly|finally|because|therefore|however|furthermore|in conclusion)\b/gi.test(studentAnswer);
    
    // Generate marking points based on question marks
    const markingPoints = generateMarkingPoints(question, hasScientificTerms, hasDetailedExplanation, hasExamples, hasStructure);
    
    // Calculate marks awarded based on content quality
    let marksAwarded = 0;
    if (hasScientificTerms) marksAwarded += 1;
    if (hasDetailedExplanation) marksAwarded += Math.ceil(question.marks * 0.6);
    if (hasExamples || hasStructure) marksAwarded += Math.floor(question.marks * 0.3);
    
    // Cap at maximum marks
    marksAwarded = Math.min(marksAwarded, question.marks);
    
    const grade = getPerformanceGrade(marksAwarded, question.marks);
    const teacherFeedback = generateConversationalFeedback(question, marksAwarded, hasScientificTerms, hasDetailedExplanation, hasExamples);
    const modelAnswer = generateModelAnswer(question);
    const specificationPoint = getSpecificationPoint(question);
    
    return { marksAwarded, feedback: teacherFeedback, modelAnswer, markingPoints, teacherFeedback, specificationPoint, grade };
  };

  const generateMarkingPoints = (question: ExamQuestion, hasTerms: boolean, hasExplanation: boolean, hasExamples: boolean, hasStructure: boolean) => {
    const points = [];
    const marks = question.marks;
    
    if (marks === 1) {
      points.push("Correct identification of key concept (1 mark)");
    } else if (marks === 2) {
      points.push("Key terminology and concept understanding (1 mark)");
      points.push("Clear explanation or example (1 mark)");
    } else if (marks === 3) {
      points.push("Identification of key concepts (1 mark)");
      points.push("Detailed explanation with examples (1 mark)");
      points.push("Application or evaluation (1 mark)");
    } else if (marks === 4) {
      points.push("Comprehensive knowledge of topic (1 mark)");
      points.push("Clear explanations with examples (1 mark)");
      points.push("Application to context (1 mark)");
      points.push("Evaluation or comparison (1 mark)");
    } else if (marks >= 5) {
      points.push("Comprehensive knowledge and understanding (2 marks)");
      points.push("Detailed explanations with relevant examples (2 marks)");
      points.push("Application and evaluation (1 mark)");
    }
    
    return points;
  };

  const getPerformanceGrade = (achieved: number, total: number) => {
    const percentage = (achieved / total) * 100;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 70) return "Very Good";
    if (percentage >= 50) return "Good";
    if (percentage >= 30) return "Satisfactory";
    return "Needs Improvement";
  };

  const generateConversationalFeedback = (question: ExamQuestion, marksAwarded: number, hasTerms: boolean, hasExplanation: boolean, hasExamples: boolean) => {
    const percentage = (marksAwarded / question.marks) * 100;
    
    if (percentage >= 90) {
      return `Excellent work! You clearly understood the question and provided a comprehensive answer with good use of scientific terminology. Your explanation was detailed and well-structured. Keep up the fantastic work!`;
    } else if (percentage >= 70) {
      return `Good job! You demonstrated solid understanding of the topic and included relevant details. ${hasTerms ? 'Your use of scientific terminology was appropriate.' : 'Try to include more specific scientific terms next time.'} ${hasExplanation ? 'Your explanation was clear.' : 'Consider expanding your explanation with more detail.'} Well done overall!`;
    } else if (percentage >= 50) {
      return `You're on the right track! You showed some understanding of the topic. ${hasTerms ? 'Good use of some key terms.' : 'Include more specific scientific vocabulary to strengthen your answer.'} ${hasExplanation ? 'Your explanation had some good points.' : 'Try to develop your explanations more fully.'} Keep practicing and you'll improve!`;
    } else if (percentage >= 30) {
      return `You've made a start, but there's room for improvement. Focus on using the correct scientific terminology and developing your explanations more fully. ${hasExamples ? 'Including examples was good.' : 'Try adding specific examples to support your points.'} Don't give up - keep working at it!`;
    } else {
      return `This answer needs more development. Make sure you understand the key concepts and can explain them clearly using appropriate scientific terminology. Practice writing longer, more detailed responses and don't be afraid to include examples. You can do better with more practice!`;
    }
  };

  const generateModelAnswer = (question: ExamQuestion) => {
    // Generate specific model answers based on actual question content
    const questionText = question.text;
    const questionLower = questionText.toLowerCase();
    
    // Math/Calculation Questions
    if (questionLower.includes('calculate') || questionLower.includes('work out') || questionLower.includes('%') || questionLower.includes('percent')) {
      // Handle percentage calculations
      const percentMatch = questionText.match(/(\d+)%\s*of\s*(\d+)/i);
      if (percentMatch) {
        const percentage = parseInt(percentMatch[1]);
        const number = parseInt(percentMatch[2]);
        const result = (percentage / 100) * number;
        return `To calculate ${percentage}% of ${number}:\n\nStep 1: Convert percentage to decimal: ${percentage}% = ${percentage}/100 = ${percentage/100}\n\nStep 2: Multiply by the number: ${percentage/100} × ${number} = ${result}\n\nTherefore, ${percentage}% of ${number} = ${result}`;
      }
      
      // Handle other calculations
      const addMatch = questionText.match(/(\d+)\s*\+\s*(\d+)/);
      if (addMatch) {
        const num1 = parseInt(addMatch[1]);
        const num2 = parseInt(addMatch[2]);
        return `${num1} + ${num2} = ${num1 + num2}`;
      }
      
      const subtractMatch = questionText.match(/(\d+)\s*-\s*(\d+)/);
      if (subtractMatch) {
        const num1 = parseInt(subtractMatch[1]);
        const num2 = parseInt(subtractMatch[2]);
        return `${num1} - ${num2} = ${num1 - num2}`;
      }
      
      const multiplyMatch = questionText.match(/(\d+)\s*×\s*(\d+)|(\d+)\s*\*\s*(\d+)/);
      if (multiplyMatch) {
        const num1 = parseInt(multiplyMatch[1] || multiplyMatch[3]);
        const num2 = parseInt(multiplyMatch[2] || multiplyMatch[4]);
        return `${num1} × ${num2} = ${num1 * num2}`;
      }
      
      const divideMatch = questionText.match(/(\d+)\s*÷\s*(\d+)|(\d+)\s*\/\s*(\d+)/);
      if (divideMatch) {
        const num1 = parseInt(divideMatch[1] || divideMatch[3]);
        const num2 = parseInt(divideMatch[2] || divideMatch[4]);
        return `${num1} ÷ ${num2} = ${num1 / num2}`;
      }
    }
    
    // Science Questions - Specific topic-based answers
    if (questionLower.includes('photosynthesis')) {
      if (questionLower.includes('equation') || questionLower.includes('word equation')) {
        return "Carbon dioxide + Water → Glucose + Oxygen\n\n(In the presence of light energy and chlorophyll)\n\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂";
      } else if (questionLower.includes('where') || questionLower.includes('location')) {
        return "Photosynthesis occurs in the chloroplasts of plant cells, specifically in the chlorophyll molecules within the chloroplasts.";
      } else {
        return "Photosynthesis is the process by which green plants make glucose from carbon dioxide and water using light energy. The word equation is: carbon dioxide + water → glucose + oxygen. This occurs in the chloroplasts, specifically in the chlorophyll. Light energy is absorbed by chlorophyll and converted to chemical energy. The glucose produced is used for respiration and to make other substances like cellulose and starch. Oxygen is released as a waste product, which is essential for other living organisms.";
      }
    }
    
    if (questionLower.includes('respiration')) {
      if (questionLower.includes('equation') || questionLower.includes('word equation')) {
        return "Glucose + Oxygen → Carbon dioxide + Water + Energy\n\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP";
      } else if (questionLower.includes('where') || questionLower.includes('location')) {
        return "Respiration occurs in the mitochondria of all living cells.";
      } else {
        return "Respiration is the process that releases energy from glucose in all living cells. The word equation is: glucose + oxygen → carbon dioxide + water (+ energy). This occurs in the mitochondria of cells. The energy released is used for movement, keeping warm, and building larger molecules from smaller ones. Respiration happens continuously in all living organisms, both plants and animals.";
      }
    }
    
    if (questionLower.includes('cell membrane') || questionLower.includes('cell wall')) {
      if (questionLower.includes('function')) {
        return "Cell membrane: Controls what enters and exits the cell (selectively permeable).\nCell wall: Provides structural support and protection (found only in plant cells, made of cellulose).";
      }
    }
    
    if (questionLower.includes('mitochondria')) {
      return "Mitochondria are the site of respiration in cells. They release energy from glucose through aerobic respiration. Often called the 'powerhouse of the cell' because they produce ATP (energy currency).";
    }
    
    if (questionLower.includes('chloroplast')) {
      return "Chloroplasts are found only in plant cells and contain chlorophyll. They are the site of photosynthesis, where light energy is captured and used to make glucose from carbon dioxide and water.";
    }
    
    // Geography Questions
    if (questionLower.includes('erosion')) {
      return "Erosion is the wearing away and transport of rock, soil, or sediment by natural agents such as water, wind, ice, or gravity. For example, river erosion creates V-shaped valleys through hydraulic action and abrasion. Coastal erosion forms cliffs and wave-cut platforms through wave action.";
    }
    
    if (questionLower.includes('weathering')) {
      return "Weathering is the breakdown of rocks in situ (in place) without transportation. Physical weathering includes freeze-thaw action where water freezes in cracks, expands, and breaks the rock. Chemical weathering includes acid rain dissolving limestone through carbonation.";
    }
    
    if (questionLower.includes('river')) {
      if (questionLower.includes('meander')) {
        return "Rivers form meanders through erosion on the outer bend (where water flows fastest) and deposition on the inner bend (where water flows slowest). Over time, this creates the characteristic curved shape of meandering rivers.";
      } else if (questionLower.includes('waterfall')) {
        return "Waterfalls form when rivers flow over bands of hard and soft rock. The soft rock erodes faster, creating a step. Continued erosion by hydraulic action and abrasion deepens the plunge pool and causes the waterfall to retreat upstream.";
      }
    }
    
    // History Questions
    if (questionLower.includes('world war') || questionLower.includes('ww1') || questionLower.includes('ww2')) {
      if (questionLower.includes('cause')) {
        return "World War 1 causes: Long-term tensions from imperialism, alliance system (Triple Alliance vs Triple Entente), arms race, and nationalism. Immediate trigger was assassination of Archduke Franz Ferdinand in Sarajevo, June 1914.";
      }
    }
    
    // English Literature
    if (questionLower.includes('metaphor')) {
      return "A metaphor is a figure of speech that directly compares two unlike things without using 'like' or 'as'. For example: 'Life is a journey' - life is being compared to a journey to suggest it has stages, challenges, and destinations.";
    }
    
    if (questionLower.includes('simile')) {
      return "A simile is a figure of speech that compares two unlike things using 'like' or 'as'. For example: 'She was as brave as a lion' - comparing someone's bravery to that of a lion.";
    }
    
    // Physics
    if (questionLower.includes('speed') && (questionLower.includes('calculate') || questionLower.includes('formula'))) {
      return "Speed = Distance ÷ Time\n\nFor example, if a car travels 100 meters in 20 seconds:\nSpeed = 100m ÷ 20s = 5 m/s";
    }
    
    if (questionLower.includes('force') && questionLower.includes('calculate')) {
      return "Force = Mass × Acceleration (F = ma)\n\nForce is measured in Newtons (N), mass in kilograms (kg), acceleration in meters per second squared (m/s²).";
    }
    
    // Generic fallback that still tries to be specific
    if (questionLower.includes('explain')) {
      return `A complete explanation for this ${question.marks}-mark question should include: clear definitions of key terms, step-by-step reasoning, specific examples or evidence, and a logical conclusion that directly answers what was asked.`;
    } else if (questionLower.includes('describe')) {
      return `A thorough description should include: accurate observations, specific details, appropriate scientific/subject terminology, and clear communication of the main features or characteristics being asked about.`;
    } else if (questionLower.includes('evaluate') || questionLower.includes('assess')) {
      return `An evaluation should include: balanced arguments showing both strengths and weaknesses, specific evidence and examples, consideration of different perspectives, and a reasoned judgment or conclusion.`;
    } else {
      return `For this ${question.marks}-mark question, ensure your answer: directly addresses what is being asked, uses appropriate subject terminology, provides specific examples or evidence, shows clear understanding of key concepts, and is well-structured with logical flow.`;
    }
  };

  const getSpecificationPoint = (question: ExamQuestion) => {
    const questionLower = question.text.toLowerCase();
    
    if (questionLower.includes('photosynthesis')) {
      return "Topic 4.4: Photosynthesis (AO1 & AO2) - Understanding the process and word equation for photosynthesis";
    } else if (questionLower.includes('respiration')) {
      return "Topic 4.5: Respiration (AO1 & AO2) - Understanding aerobic respiration and energy release";
    } else if (questionLower.includes('energy')) {
      return "Topic 1: Energy (AO1 & AO2) - Energy stores, transfers, and conservation principles";
    } else if (questionLower.includes('atom') || questionLower.includes('atomic')) {
      return "Topic 1: Atomic Structure (AO1) - Structure of atoms, electrons, protons, and neutrons";
    } else if (questionLower.includes('forces')) {
      return "Topic 2: Forces (AO1 & AO2) - Understanding forces, motion, and Newton's laws";
    } else if (questionLower.includes('cell')) {
      return "Topic 1: Cell Biology (AO1 & AO2) - Plant and animal cell structures and functions";
    } else if (questionLower.includes('reaction')) {
      return "Topic 2: Chemical Changes (AO1 & AO2) - Understanding chemical reactions and equations";
    } else {
      return "Multiple specification points assessed with AO1 (knowledge) and AO2 (application)";
    }
  };

  const results = questions.map((q: ExamQuestion) => {
    const answer = answers.find((a: ExamAnswer) => a.questionId === q.id);
    const marking = answer ? generateMarking(q, answer) : { 
      marksAwarded: 0, 
      feedback: "No answer provided", 
      modelAnswer: generateModelAnswer(q),
      markingPoints: [],
      teacherFeedback: "No answer was provided for this question.",
      specificationPoint: getSpecificationPoint(q),
      grade: "Needs Improvement"
    };
    return { question: q, answer, ...marking };
  });

  const totalMarks = questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const percentage = Math.round((achievedMarks / totalMarks) * 100);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "9", color: "text-purple-600" };
    if (percentage >= 80) return { grade: "8", color: "text-indigo-600" };
    if (percentage >= 70) return { grade: "7", color: "text-blue-600" };
    if (percentage >= 60) return { grade: "6", color: "text-green-600" };
    if (percentage >= 50) return { grade: "5", color: "text-yellow-600" };
    if (percentage >= 40) return { grade: "4", color: "text-orange-600" };
    if (percentage >= 30) return { grade: "3", color: "text-red-600" };
    if (percentage >= 20) return { grade: "2", color: "text-red-700" };
    return { grade: "1", color: "text-red-800" };
  };

  const grade = getGrade(percentage);
  const timeFormatted = Math.floor(timeElapsed / 60) + ":" + (timeElapsed % 60).toString().padStart(2, '0');

  // Save exam completion to database (only for new completions)
  useEffect(() => {
    if (isReview) return; // Don't save if this is a review

    const saveExamCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const examData = {
          user_id: user.id,
          subject_id: subjectId,
          total_marks: totalMarks,
          achieved_marks: achievedMarks,
          percentage: percentage,
          grade: grade.grade,
          time_taken_seconds: timeElapsed,
          questions: questions,
          answers: answers,
          results: results
        };

        const { error } = await supabase
          .from('predicted_exam_completions')
          .insert(examData);

        if (error) throw error;

        toast({
          title: "Exam Results Saved",
          description: `Your ${subject?.name} exam has been completed and saved.`
        });

      } catch (error) {
        console.error('Error saving exam completion:', error);
        toast({
          title: "Error",
          description: "Failed to save exam results. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (questions && answers && subject) {
      saveExamCompletion();
    }
  }, [questions, answers, subject, subjectId, totalMarks, achievedMarks, percentage, grade.grade, timeElapsed, results, toast, isReview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-blue-100 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Premium Header - Theme Responsive */}
      <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-border sticky top-0 shadow-2xl z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/predicted-questions')} 
                className="text-muted-foreground hover:text-foreground hover:bg-muted/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Predicted Questions
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl border border-yellow-400/30">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Exam Results & Analysis</h1>
                  <p className="text-sm text-muted-foreground">Premium AI marking & feedback</p>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 backdrop-blur-sm rounded-full p-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Premium Results Header - Theme Responsive */}
        <Card className="mb-8 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-border shadow-2xl overflow-hidden">
          {/* Theme Responsive Card Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-600/20 dark:via-blue-600/20 dark:to-purple-600/20" />
          
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl border border-border">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {subject.name} Exam Results
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 text-lg text-muted-foreground">
                  <span className="font-semibold">AQA GCSE Predicted Paper</span>
                  {isReview && (
                    <>
                      <span>•</span>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30">
                        Completed: {new Date(completion?.completed_at).toLocaleDateString()}
                      </Badge>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 pt-0">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Final Score</p>
                    <p className="text-2xl font-bold text-foreground">{achievedMarks}/{totalMarks}</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-3 bg-muted dark:bg-slate-600/50">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"></div>
                </Progress>
              </div>

              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{grade.grade}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Predicted Grade</p>
                    <p className="text-lg font-bold text-foreground">{percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time Taken</p>
                    <p className="text-lg font-bold text-foreground">{timeFormatted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Questions</p>
                    <p className="text-lg font-bold text-foreground">{questions.length} Total</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Question by Question Results - Theme Responsive */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 hover:from-yellow-300 hover:to-orange-300">
                <Crown className="h-3 w-3 mr-1" />
                PREMIUM ANALYSIS
              </Badge>
              <Badge className="bg-muted/80 text-foreground border-border backdrop-blur-sm">
                <Target className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">
              Detailed Marking & Expert Feedback
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Premium AI analysis for every question with personalized feedback and improvement suggestions
            </p>
          </div>
          
          
          {results.map((result, index) => (
            <Card key={result.question.id} className="overflow-hidden bg-card/90 backdrop-blur-sm border border-border hover:bg-card/95 transition-all duration-300 shadow-2xl relative">
              {/* Theme Responsive Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                result.marksAwarded === result.question.marks 
                  ? 'from-emerald-500/10 to-teal-600/10 dark:from-emerald-600/20 dark:to-teal-700/20' 
                  : result.marksAwarded > 0 
                    ? 'from-amber-500/10 to-orange-600/10 dark:from-amber-600/20 dark:to-orange-700/20' 
                    : 'from-red-500/10 to-pink-600/10 dark:from-red-600/20 dark:to-pink-700/20'
              }`} />
              
              <CardHeader className="relative bg-muted/30 dark:bg-slate-700/50 backdrop-blur-sm border-b border-border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      result.marksAwarded === result.question.marks 
                        ? 'from-emerald-500 to-teal-600' 
                        : result.marksAwarded > 0 
                          ? 'from-amber-500 to-orange-600' 
                          : 'from-red-500 to-pink-600'
                    } flex items-center justify-center shadow-2xl border border-border`}>
                      <span className="text-white font-bold text-lg">{result.question.questionNumber}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        Question {result.question.questionNumber}
                      </CardTitle>
                      {result.question.section && (
                        <Badge className="mt-2 bg-muted/50 text-foreground border-border backdrop-blur-sm text-xs">
                          Section {result.question.section}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={`text-lg font-bold px-4 py-2 ${
                        result.marksAwarded === result.question.marks 
                          ? 'bg-emerald-500/80 text-white shadow-lg' 
                          : result.marksAwarded > 0 
                            ? 'bg-amber-500/80 text-white shadow-lg' 
                            : 'bg-red-500/80 text-white shadow-lg'
                      }`}
                    >
                      {result.marksAwarded}/{result.question.marks} marks
                    </Badge>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      result.marksAwarded === result.question.marks 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : result.marksAwarded > 0 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                          : 'bg-gradient-to-br from-red-500 to-pink-600'
                    }`}>
                      {result.marksAwarded === result.question.marks ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : result.marksAwarded > 0 ? (
                        <Target className="h-6 w-6 text-white" />
                      ) : (
                        <XCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-6 p-8">
                <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-xl p-5">
                    <h4 className="font-bold text-foreground mb-3 flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                      Question
                    </h4>
                  <div className="bg-muted/80 dark:bg-slate-600/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                    <p className="whitespace-pre-wrap text-foreground leading-relaxed">{result.question.text}</p>
                  </div>
                </div>
                
                {result.answer && (
                  <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-xl p-5">
                      <h4 className="font-bold text-foreground mb-3 flex items-center">
                        <Target className="h-5 w-5 text-purple-500 mr-3" />
                        Your Answer
                      </h4>
                    <div className="bg-muted/80 dark:bg-slate-600/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                      <p className="text-sm whitespace-pre-wrap text-foreground leading-relaxed">{result.answer.answer}</p>
                    </div>
                  </div>
                )}

                {/* Theme Responsive Premium AI Teacher Feedback */}

                {/* Premium AI Teacher Feedback */}
                <div className="bg-card/80 dark:bg-slate-700/80 backdrop-blur-sm border border-border rounded-2xl shadow-2xl overflow-hidden">
                  {/* Theme Responsive Premium background */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-600/20 dark:to-orange-600/20 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">AI Teacher Feedback</h3>
                          <p className="text-sm text-muted-foreground">Premium Analysis & Marking</p>
                        </div>
                      </div>
                      <div className="text-right bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                        <div className="text-3xl font-bold text-foreground">
                          {result.marksAwarded}/{result.question.marks}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">marks awarded</div>
                        <div className={`text-sm font-bold mt-2 px-3 py-1 rounded-full ${
                          result.grade === 'Excellent' ? 'bg-emerald-500/30 text-emerald-600 dark:text-emerald-200 border border-emerald-500/50' :
                          result.grade === 'Very Good' ? 'bg-blue-500/30 text-blue-600 dark:text-blue-200 border border-blue-500/50' :
                          result.grade === 'Good' ? 'bg-amber-500/30 text-amber-600 dark:text-amber-200 border border-amber-500/50' :
                          result.grade === 'Satisfactory' ? 'bg-orange-500/30 text-orange-600 dark:text-orange-200 border border-orange-500/50' :
                          'bg-red-500/30 text-red-600 dark:text-red-200 border border-red-500/50'
                        }`}>
                          {result.grade}
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                          Model Answer
                        </h4>
                      <div className="bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                        <p className="text-sm leading-relaxed text-foreground">{result.modelAnswer}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-3 flex items-center">
                          <Target className="h-5 w-5 text-blue-500 mr-3" />
                          Why This Gets Full Marks
                        </h4>
                      <div className="space-y-3">
                        {result.markingPoints?.map((point, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-3 border border-border">
                            <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-sm text-foreground font-medium">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-3 flex items-center">
                          <Crown className="h-5 w-5 text-yellow-500 mr-3" />
                          AI Teacher Feedback
                        </h4>
                      <div className="bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                        <p className="text-sm leading-relaxed text-foreground font-medium">{result.teacherFeedback}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                      <h4 className="font-bold text-foreground mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 text-amber-500 mr-3" />
                        Specification Reference
                      </h4>
                      <div className="bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                        <p className="text-sm font-bold text-foreground">
                          {result.specificationPoint}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Theme Responsive Premium Action Buttons */}
        <div className="flex justify-center space-x-6 mt-12">
          <Button 
            onClick={() => navigate(`/predicted-exam/${subjectId}`)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake This Exam
          </Button>
          <Button 
            onClick={() => navigate('/predicted-questions')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Try Another Subject
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300"
          >
            <Target className="h-5 w-5 mr-2" />
            Back to Dashboard
            <Crown className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;