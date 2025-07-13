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
    // Generate specific model answers based on question content
    const questionLower = question.text.toLowerCase();
    
    if (questionLower.includes('photosynthesis')) {
      return "Photosynthesis is the process by which green plants make glucose from carbon dioxide and water using light energy. The word equation is: carbon dioxide + water → glucose + oxygen. This occurs in the chloroplasts, specifically in the chlorophyll. Light energy is absorbed by chlorophyll and converted to chemical energy. The glucose produced is used for respiration and to make other substances like cellulose and starch. Oxygen is released as a waste product, which is essential for other living organisms.";
    } else if (questionLower.includes('respiration')) {
      return "Respiration is the process that releases energy from glucose in all living cells. The word equation is: glucose + oxygen → carbon dioxide + water (+ energy). This occurs in the mitochondria of cells. The energy released is used for movement, keeping warm, and building larger molecules from smaller ones. Respiration happens continuously in all living organisms, both plants and animals.";
    } else if (questionLower.includes('energy transfer') || questionLower.includes('energy transformation')) {
      return "Energy cannot be created or destroyed, only transferred from one form to another (conservation of energy). Examples include: chemical energy in food → kinetic energy in muscles → heat energy; electrical energy → light energy + heat energy in a bulb; gravitational potential energy → kinetic energy when falling. Energy transfers are often inefficient, with some energy always being transferred to the surroundings as heat.";
    } else if (questionLower.includes('atomic structure') || questionLower.includes('atom')) {
      return "An atom consists of a nucleus containing protons (positive charge) and neutrons (no charge), surrounded by electrons (negative charge) in shells. The atomic number equals the number of protons, which determines the element. In a neutral atom, the number of electrons equals the number of protons. The mass number equals protons + neutrons. Electrons are arranged in shells around the nucleus, with the innermost shell holding up to 2 electrons and the next shells holding up to 8.";
    } else if (questionLower.includes('forces') || questionLower.includes('newton')) {
      return "Forces are pushes or pulls that can change an object's motion, shape, or direction. Forces are measured in Newtons (N). Balanced forces result in no change in motion, while unbalanced forces cause acceleration. Examples include gravitational force (weight), friction, air resistance, and applied forces. Newton's First Law states that objects continue in their state of motion unless acted upon by an unbalanced force.";
    } else if (questionLower.includes('calculate') || questionLower.includes('work out')) {
      return "To solve this calculation: 1) Identify the known values and what needs to be found. 2) Write down the relevant formula/equation. 3) Substitute the known values. 4) Perform the calculation step by step. 5) Include the correct unit in the final answer. 6) Check if the answer is reasonable. Show all working clearly for full marks.";
    } else if (questionLower.includes('experiment') || questionLower.includes('investigation')) {
      return "A well-designed experiment should: identify the independent variable (what you change), dependent variable (what you measure), and control variables (what you keep the same). Use appropriate equipment and methods to ensure accuracy. Take repeat readings to identify anomalies and calculate means. Consider safety precautions. Draw valid conclusions based on results and evaluate the method's reliability and validity.";
    } else if (questionLower.includes('cell') && questionLower.includes('biology')) {
      return "Plant and animal cells have similarities and differences. Both contain: nucleus (controls cell activities), cytoplasm (where chemical reactions occur), cell membrane (controls what enters/exits), and mitochondria (for respiration). Plant cells additionally have: cell wall (provides support), chloroplasts (for photosynthesis), and a large vacuole (maintains structure). Specialized cells are adapted for specific functions.";
    } else if (questionLower.includes('chemical reaction') || questionLower.includes('reaction')) {
      return "In a chemical reaction, reactants are converted into products. Word equations show: reactants → products. Chemical reactions involve breaking bonds in reactants and forming new bonds in products. Evidence includes: temperature change, color change, gas production, or precipitate formation. The law of conservation of mass states that mass is neither created nor destroyed in chemical reactions.";
    } else if (questionLower.includes('climate change') || questionLower.includes('global warming')) {
      return "Climate change refers to long-term changes in global temperatures and weather patterns. Human activities, particularly burning fossil fuels, increase greenhouse gas concentrations in the atmosphere. This enhances the greenhouse effect, trapping more heat energy. Consequences include rising sea levels, extreme weather events, and ecosystem disruption. Mitigation strategies include renewable energy, carbon capture, and international cooperation through agreements like the Paris Climate Accord.";
    } else if (questionLower.includes('ecosystem') || questionLower.includes('food chain')) {
      return "An ecosystem consists of all living organisms (biotic factors) and non-living components (abiotic factors) in an area, interacting as a system. Food chains show energy transfer: producer → primary consumer → secondary consumer → tertiary consumer. Energy is lost at each level (only 10% passes on), limiting chain length. Decomposers recycle nutrients. Biodiversity ensures ecosystem stability and provides services like pollination, water purification, and climate regulation.";
    } else {
      return `For this ${question.marks}-mark question, a complete answer should include: relevant scientific terminology, clear explanations of key concepts, specific examples to support points, and logical structure. Address all parts of the question systematically, using appropriate command words (describe/explain/evaluate). Include quantitative data where relevant and ensure scientific accuracy throughout.`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fixed Premium Header */}
      <header className="bg-slate-800/95 backdrop-blur-xl border-b border-white/10 sticky top-0 shadow-2xl z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/predicted-questions')} 
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Predicted Questions
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl border border-yellow-400/30">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Exam Results & Analysis</h1>
                  <p className="text-sm text-white/80">Premium AI marking & feedback</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Premium Results Header */}
        <Card className="mb-8 border-0 bg-slate-800/90 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden">
          {/* Fixed Card Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-blue-600/20 to-purple-600/20" />
          
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-white">
                  {subject.name} Exam Results
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 text-lg text-white/80">
                  <span className="font-semibold">AQA GCSE Predicted Paper</span>
                  {isReview && (
                    <>
                      <span>•</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
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
              <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">Final Score</p>
                    <p className="text-2xl font-bold text-white">{achievedMarks}/{totalMarks}</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-3 bg-slate-600/50">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"></div>
                </Progress>
              </div>

              <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{grade.grade}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">Predicted Grade</p>
                    <p className="text-lg font-bold text-white">{percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">Time Taken</p>
                    <p className="text-lg font-bold text-white">{timeFormatted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">Questions</p>
                    <p className="text-lg font-bold text-white">{questions.length} Total</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Question by Question Results */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 hover:from-yellow-300 hover:to-orange-300">
                <Crown className="h-3 w-3 mr-1" />
                PREMIUM ANALYSIS
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Target className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">
              Detailed Marking & Expert Feedback
            </h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Premium AI analysis for every question with personalized feedback and improvement suggestions
            </p>
          </div>
          
          {results.map((result, index) => (
            <Card key={result.question.id} className="overflow-hidden bg-slate-800/90 backdrop-blur-sm border border-white/10 hover:bg-slate-800/95 transition-all duration-300 shadow-2xl relative">
              {/* Fixed Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                result.marksAwarded === result.question.marks 
                  ? 'from-emerald-600/20 to-teal-700/20' 
                  : result.marksAwarded > 0 
                    ? 'from-amber-600/20 to-orange-700/20' 
                    : 'from-red-600/20 to-pink-700/20'
              }`} />
              
              <CardHeader className="relative bg-slate-700/50 backdrop-blur-sm border-b border-white/10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      result.marksAwarded === result.question.marks 
                        ? 'from-emerald-500 to-teal-600' 
                        : result.marksAwarded > 0 
                          ? 'from-amber-500 to-orange-600' 
                          : 'from-red-500 to-pink-600'
                    } flex items-center justify-center shadow-2xl border border-white/20`}>
                      <span className="text-white font-bold text-lg">{result.question.questionNumber}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">
                        Question {result.question.questionNumber}
                      </CardTitle>
                      {result.question.section && (
                        <Badge className="mt-2 bg-slate-600/50 text-white border-white/20 backdrop-blur-sm text-xs">
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
                <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="font-bold text-white mb-3 flex items-center">
                    <div className="p-1.5 bg-blue-500/30 rounded-lg mr-3">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    Question
                  </h4>
                  <div className="bg-slate-600/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <p className="whitespace-pre-wrap text-white/90 leading-relaxed">{result.question.text}</p>
                  </div>
                </div>
                
                {result.answer && (
                  <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <div className="p-1.5 bg-purple-500/30 rounded-lg mr-3">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      Your Answer
                    </h4>
                    <div className="bg-slate-600/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <p className="text-sm whitespace-pre-wrap text-white/90 leading-relaxed">{result.answer.answer}</p>
                    </div>
                  </div>
                )}

                {/* Fixed Premium AI Teacher Feedback */}

                {/* Premium AI Teacher Feedback */}
                <div className="bg-slate-700/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Fixed Premium background */}
                  <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">AI Teacher Feedback</h3>
                          <p className="text-sm text-white/70">Premium Analysis & Marking</p>
                        </div>
                      </div>
                      <div className="text-right bg-slate-600/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                        <div className="text-3xl font-bold text-white">
                          {result.marksAwarded}/{result.question.marks}
                        </div>
                        <div className="text-xs text-white/70 font-medium">marks awarded</div>
                        <div className={`text-sm font-bold mt-2 px-3 py-1 rounded-full ${
                          result.grade === 'Excellent' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50' :
                          result.grade === 'Very Good' ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50' :
                          result.grade === 'Good' ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50' :
                          result.grade === 'Satisfactory' ? 'bg-orange-500/30 text-orange-200 border border-orange-500/50' :
                          'bg-red-500/30 text-red-200 border border-red-500/50'
                        }`}>
                          {result.grade}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-600/50 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                      <h4 className="font-bold text-white mb-3 flex items-center">
                        <div className="p-1.5 bg-emerald-500/30 rounded-lg mr-3">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        Model Answer
                      </h4>
                      <div className="bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <p className="text-sm leading-relaxed text-white/90">{result.modelAnswer}</p>
                      </div>
                    </div>

                    <div className="bg-slate-600/50 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                      <h4 className="font-bold text-white mb-3 flex items-center">
                        <div className="p-1.5 bg-blue-500/30 rounded-lg mr-3">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        Why This Gets Full Marks
                      </h4>
                      <div className="space-y-3">
                        {result.markingPoints?.map((point, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-slate-500/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-sm text-white/90 font-medium">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-600/50 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                      <h4 className="font-bold text-white mb-3 flex items-center">
                        <div className="p-1.5 bg-purple-500/30 rounded-lg mr-3">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        AI Teacher Feedback
                      </h4>
                      <div className="bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <p className="text-sm leading-relaxed text-white/90 font-medium">{result.teacherFeedback}</p>
                      </div>
                    </div>

                    <div className="bg-slate-600/50 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                      <h4 className="font-bold text-white mb-3 flex items-center">
                        <div className="p-1.5 bg-amber-500/30 rounded-lg mr-3">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        Specification Reference
                      </h4>
                      <div className="bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <p className="text-sm font-bold text-white/90">
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

        {/* Fixed Premium Action Buttons */}
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