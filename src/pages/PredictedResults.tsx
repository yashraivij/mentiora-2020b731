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

  // Generate marking and feedback for each question - improved marking system with AO breakdown
  const generateMarking = (question: ExamQuestion, answer: ExamAnswer) => {
    const studentAnswer = answer.answer.toLowerCase().trim();
    
    if (!studentAnswer) {
      return { 
        marksAwarded: 0, 
        feedback: "No answer provided", 
        modelAnswer: generateModelAnswer(question),
        aoBreakdown: [],
        missedPoints: ["No response given"],
        specificationPoint: getSpecificationPoint(question)
      };
    }
    
    // Analyze student answer quality
    const wordCount = studentAnswer.split(/\s+/).length;
    const hasScientificTerms = /\b(energy|force|momentum|reaction|element|cell|gene|equation|graph|data|temperature|pressure|volume|density|mass|weight|velocity|acceleration|current|voltage|resistance|atom|molecule|compound|mixture|solution|acid|base|alkali|salt|oxidation|reduction|catalyst|enzyme|mitosis|meiosis|photosynthesis|respiration|ecosystem|biodiversity|evolution|inheritance|variation|homeostasis|reflex|hormone|nervous|circulatory|digestive|respiratory|excretory|reproductive|skeletal|muscular|hypothesis|theory|experiment|variable|control|method|conclusion|analysis|evaluation|calculate|explain|describe|compare|discuss)\b/gi.test(studentAnswer);
    const hasDetailedExplanation = wordCount >= 20;
    const hasExamples = /\b(example|such as|for instance|like|including)\b/gi.test(studentAnswer);
    const hasStructure = /\b(firstly|secondly|finally|because|therefore|however|furthermore|in conclusion)\b/gi.test(studentAnswer);
    const hasCalculations = /\b(\d+|\+|\-|\*|\/|=|formula|equation)\b/gi.test(studentAnswer);
    
    // Assessment Objectives breakdown
    const aoBreakdown = [];
    let marksAwarded = 0;
    const missedPoints = [];
    
    // AO1: Knowledge and Understanding (40% of marks)
    const ao1Marks = Math.ceil(question.marks * 0.4);
    let ao1Awarded = 0;
    if (hasScientificTerms) {
      ao1Awarded = Math.min(ao1Marks, Math.ceil(ao1Marks * 0.8));
      aoBreakdown.push(`AO1: ${ao1Awarded}/${ao1Marks} marks - Key terminology identified`);
    } else {
      aoBreakdown.push(`AO1: 0/${ao1Marks} marks - Missing key scientific terminology`);
      missedPoints.push("Key scientific terms not used");
    }
    marksAwarded += ao1Awarded;
    
    // AO2: Application and Analysis (40% of marks)
    const ao2Marks = Math.ceil(question.marks * 0.4);
    let ao2Awarded = 0;
    if (hasDetailedExplanation && (hasExamples || hasCalculations)) {
      ao2Awarded = Math.min(ao2Marks, Math.ceil(ao2Marks * 0.9));
      aoBreakdown.push(`AO2: ${ao2Awarded}/${ao2Marks} marks - Good application and explanation`);
    } else if (hasDetailedExplanation) {
      ao2Awarded = Math.ceil(ao2Marks * 0.6);
      aoBreakdown.push(`AO2: ${ao2Awarded}/${ao2Marks} marks - Explanation present but lacks examples/calculations`);
      missedPoints.push("Missing specific examples or calculations");
    } else {
      aoBreakdown.push(`AO2: 0/${ao2Marks} marks - Insufficient explanation and application`);
      missedPoints.push("Lacks detailed explanation", "No application of knowledge shown");
    }
    marksAwarded += ao2Awarded;
    
    // AO3: Analysis and Evaluation (20% of marks)
    const ao3Marks = Math.floor(question.marks * 0.2) || 1;
    let ao3Awarded = 0;
    if (hasStructure && wordCount >= 30) {
      ao3Awarded = ao3Marks;
      aoBreakdown.push(`AO3: ${ao3Awarded}/${ao3Marks} marks - Well-structured response with evaluation`);
    } else if (hasStructure) {
      ao3Awarded = Math.ceil(ao3Marks * 0.5);
      aoBreakdown.push(`AO3: ${ao3Awarded}/${ao3Marks} marks - Some structure but limited evaluation`);
      missedPoints.push("Limited analysis and evaluation");
    } else {
      aoBreakdown.push(`AO3: 0/${ao3Marks} marks - Poor structure and no evaluation`);
      missedPoints.push("No logical structure or connectives used", "No evaluation or analysis");
    }
    marksAwarded += ao3Awarded;
    
    // Cap at maximum marks
    marksAwarded = Math.min(marksAwarded, question.marks);
    
    const feedback = generateTeacherFeedback(question, studentAnswer, marksAwarded, aoBreakdown, missedPoints);
    const modelAnswer = generateModelAnswer(question);
    const specificationPoint = getSpecificationPoint(question);
    
    return { marksAwarded, feedback, modelAnswer, aoBreakdown, missedPoints, specificationPoint };
  };

  const generateTeacherFeedback = (question: ExamQuestion, answer: string, marks: number, aoBreakdown: string[], missedPoints: string[]) => {
    const percentage = (marks / question.marks) * 100;
    
    let feedbackLevel = "";
    if (percentage >= 90) feedbackLevel = "Excellent work!";
    else if (percentage >= 70) feedbackLevel = "Good answer with room for improvement.";
    else if (percentage >= 50) feedbackLevel = "Satisfactory but needs development.";
    else feedbackLevel = "Significant improvement needed.";
    
    return {
      summary: feedbackLevel,
      strengths: aoBreakdown.filter(ao => !ao.includes("0/")).map(ao => ao.split(" - ")[1]).filter(Boolean),
      improvements: missedPoints,
      nextSteps: percentage >= 70 ? 
        ["Add more specific examples", "Include numerical data where relevant", "Use more precise scientific terminology"] :
        ["Focus on key terminology", "Develop explanations with examples", "Structure answers clearly with connectives"]
    };
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
      feedback: { summary: "No answer provided", strengths: [], improvements: ["No response given"], nextSteps: [] }, 
      modelAnswer: generateModelAnswer(q),
      aoBreakdown: [],
      missedPoints: ["No answer provided"],
      specificationPoint: getSpecificationPoint(q)
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/predicted-questions')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Predicted Questions
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Results Header */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-amber-500" />
              <div>
                <CardTitle className="text-2xl font-bold">{subject.name} Exam Results</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <span>AQA GCSE Predicted Paper</span>
                  {isReview && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        Completed: {new Date(completion?.completed_at).toLocaleDateString()}
                      </Badge>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${grade.color} mb-2`}>
                  Grade {grade.grade}
                </div>
                <p className="text-sm text-muted-foreground">Predicted Grade</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {percentage}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {achievedMarks}/{totalMarks}
                </div>
                <p className="text-sm text-muted-foreground">Marks Achieved</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {timeFormatted}
                </div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{achievedMarks}/{totalMarks} marks</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Question by Question Results */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">Detailed Marking & Feedback</h3>
          
          {results.map((result, index) => (
            <Card key={result.question.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Question {result.question.questionNumber}
                    </CardTitle>
                    {result.question.section && (
                      <Badge variant="outline" className="mt-2">
                        Section {result.question.section}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Question:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{result.question.text}</p>
                </div>
                
                {result.answer && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Your Answer:</h4>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm whitespace-pre-wrap">{result.answer.answer}</p>
                    </div>
                  </div>
                )}
                
                {/* AI Teacher Feedback Section - Match Practice Questions Format */}
                <div className="bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-lg p-6">
                  <div className="space-y-4">
                    {/* Header with marks */}
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-lg font-semibold text-primary">AI Teacher Feedback</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {result.marksAwarded}/{result.question.marks}
                        </div>
                        <div className="text-sm text-muted-foreground">marks</div>
                      </div>
                    </div>
                    
                    {/* Grade */}
                    <div className="text-lg font-semibold text-foreground">
                      {result.marksAwarded === result.question.marks ? "Excellent" :
                       result.marksAwarded >= result.question.marks * 0.8 ? "Very Good" :
                       result.marksAwarded >= result.question.marks * 0.6 ? "Good" :
                       result.marksAwarded >= result.question.marks * 0.4 ? "Satisfactory" : "Needs Improvement"}
                    </div>
                    
                    {/* Model Answer */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Model Answer</h4>
                      <div className="bg-background/50 p-4 rounded-lg border">
                        <p className="text-sm text-foreground leading-relaxed">{result.modelAnswer}</p>
                      </div>
                    </div>
                    
                    {/* Why This Gets Full Marks */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Why This Gets Full Marks</h4>
                      <div className="bg-background/50 p-4 rounded-lg border">
                        <div className="space-y-1 text-sm text-foreground">
                          {result.aoBreakdown?.map((ao, index) => {
                            // Parse the AO breakdown to show in the practice questions format
                            const parts = ao.split(" - ");
                            const marks = parts[0]?.split(":")[1]?.trim() || "1 mark";
                            const description = parts[1] || parts[0]?.split(":")[1]?.trim() || ao;
                            return (
                              <div key={index}>{description} ({marks})</div>
                            );
                          }) || <div>Complete answer addressing all key points (1 mark)</div>}
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Teacher Feedback */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">AI Teacher Feedback</h4>
                      <div className="bg-background/50 p-4 rounded-lg border">
                        <p className="text-sm text-foreground leading-relaxed">
                          {result.marksAwarded === result.question.marks 
                            ? `Excellent job! You clearly explained all the key concepts and your answer demonstrates strong understanding of the topic. Each point you made aligns well with the correct answer. Keep up the great work!`
                            : result.marksAwarded >= result.question.marks * 0.7
                            ? `Good work! You've shown solid understanding and included most key points. To improve further, focus on ${result.missedPoints?.slice(0, 2).join(" and ").toLowerCase() || "adding more detail"}.`
                            : result.marksAwarded > 0
                            ? `You're on the right track and have shown some understanding. To improve, focus on ${result.missedPoints?.slice(0, 2).join(" and ").toLowerCase() || "using more scientific terminology"}. Try to include more detailed explanations and specific examples.`
                            : `This question needs more work. Make sure you ${result.missedPoints?.slice(0, 2).join(" and ").toLowerCase() || "provide a detailed answer"}. Focus on using scientific terminology and explaining your reasoning clearly.`
                          }
                        </p>
                      </div>
                    </div>
                    
                    {/* Specification Reference */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Specification Reference</h4>
                      <div className="bg-background/50 p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground">{result.specificationPoint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => navigate(`/predicted-exam/${subjectId}`)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake This Exam
          </Button>
          <Button variant="outline" onClick={() => navigate('/predicted-questions')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Try Another Subject
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-primary to-primary/90">
            <Target className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;