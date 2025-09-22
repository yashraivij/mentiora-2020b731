import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw, Book, Lightbulb, HelpCircle, User, StickyNote, Brain } from "lucide-react";
import { curriculum } from "@/data/curriculum";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";

interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  marks: number;
  section?: string;
  question?: string;
  modelAnswer?: string;
  markingCriteria?: any;
  specReference?: string;
}

interface ExamAnswer {
  questionId: string;
  answer: string;
}

interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  score: number;
  feedback: {
    modelAnswer: string;
    whyThisGetsMark: string;
    whyYoursDidnt: string;
    specLink: string;
    fullMarks?: boolean;
  };
}

const PredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isMarking, setIsMarking] = useState(true);
  
  const { questions, answers, timeElapsed, isReview, completion, totalMarks } = location.state || {};
  
  // If no state is provided, show a message instead of redirecting
  if (!questions || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">No Exam Results Found</CardTitle>
                <CardDescription className="text-center">
                  It looks like you haven't completed an exam yet or the session expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button 
                  onClick={() => navigate('/predicted-questions')}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  Take a Predicted Exam
                </Button>
                <Button 
                  onClick={() => navigate(-1)} 
                  variant="outline"
                >
                  Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }

  // Use exact same Smart marking system as Practice.tsx - OPTIMIZED
  const markAnswerWithSmart = async (question: ExamQuestion, answer: string, modelAnswer: string) => {
    try {
      console.log('Calling Smart marking function with:', { 
        question: question.text || question.question, 
        answer: answer.substring(0, 100) + '...' 
      });

      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.text || question.question,
          userAnswer: answer,
          modelAnswer: modelAnswer,
          markingCriteria: question.markingCriteria || generateMarkingCriteria(question.text || question.question || '', question.marks),
          totalMarks: question.marks,
          subjectId: subjectId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Smart marking result:', data);

      return {
        marksAwarded: data.marksAwarded || 0,
        feedback: data.feedback || "No feedback available",
        assessment: data.assessment || "Needs Review"
      };

    } catch (error) {
      console.error('Error calling Smart marking function:', error);
      
      // Fallback to basic marking
      return {
        marksAwarded: answer.trim() ? Math.round(question.marks * 0.5) : 0,
        feedback: "Smart marking temporarily unavailable. Answer has been given partial credit.",
        assessment: "Needs Review"
      };
    }
  };

  const generateMarkingCriteria = (questionText: string, marks: number): string => {
    const question = questionText.toLowerCase();
    
    // Generate marking criteria based on actual question marks
    if (marks === 1) {
      return "AO1 (Knowledge): Demonstrate understanding of key concept (1 mark)";
    }
    
    if (marks === 2) {
      return "AO1 (Knowledge): Demonstrate understanding of key concept (1 mark)\nAO2 (Application): Apply knowledge correctly to context (1 mark)";
    }
    
    if (marks === 3) {
      return "AO1 (Knowledge): Demonstrate understanding of key concepts (1 mark)\nAO2 (Application): Apply knowledge correctly to context (1 mark)\nAO3 (Analysis): Use appropriate terminology and show clear reasoning (1 mark)";
    }
    
    if (marks === 4) {
      return "AO1 (Knowledge): Demonstrate comprehensive understanding (1 mark)\nAO2 (Application): Apply knowledge correctly to specific context (1 mark)\nAO2 (Application): Provide relevant examples or evidence (1 mark)\nAO3 (Analysis): Use appropriate terminology and clear reasoning (1 mark)";
    }
    
    if (marks === 5) {
      return "AO1 (Knowledge): Demonstrate comprehensive understanding (2 marks)\nAO2 (Application): Apply knowledge correctly to specific context (2 marks)\nAO3 (Analysis): Use appropriate terminology and show clear reasoning (1 mark)";
    }
    
    if (marks === 6) {
      return "AO1 (Knowledge): Demonstrate comprehensive understanding (2 marks)\nAO2 (Application): Apply knowledge correctly to specific context (2 marks)\nAO3 (Analysis): Use appropriate terminology and detailed reasoning (1 mark)\nAO3 (Evaluation): Show clear analysis and evaluation of information (1 mark)";
    }
    
    // Default for other marks
    const aoMarks = Math.ceil(marks / 3);
    return `AO1 (Knowledge): Demonstrate understanding of key concepts (${aoMarks} marks)\nAO2 (Application): Apply knowledge correctly to context (${aoMarks} marks)\nAO3 (Analysis): Use appropriate terminology and reasoning (${marks - (aoMarks * 2)} marks)`;
  };

  const generateSpecReference = (questionText: string, subject: string): string => {
    const question = questionText.toLowerCase();
    
    if (subject === 'chemistry') {
      if (question.includes('atomic structure')) return "4.1.1 - Atomic Structure";
      if (question.includes('periodic')) return "4.1.2 - Periodic Table";
      if (question.includes('bond') || question.includes('ionic') || question.includes('covalent')) return "4.2 - Bonding and Structure";
      if (question.includes('mole') || question.includes('calculate')) return "4.3 - Quantitative Chemistry";
      if (question.includes('energy') || question.includes('enthalpy')) return "4.5 - Energy Changes";
      if (question.includes('rate') || question.includes('catalyst')) return "4.6 - Rate and Extent of Chemical Change";
      if (question.includes('acid') || question.includes('ph')) return "4.4 - Chemical Changes";
      return "4.1 - Atomic Structure and Periodic Table";
    }
    
    if (subject === 'physics') {
      if (question.includes('force') || question.includes('motion')) return "4.1 - Forces";
      if (question.includes('energy') || question.includes('power')) return "4.2 - Energy";
      if (question.includes('wave') || question.includes('frequency')) return "4.3 - Waves";
      if (question.includes('electric') || question.includes('current')) return "4.4 - Electricity";
      if (question.includes('magnetic') || question.includes('field')) return "4.5 - Magnetism and Electromagnetism";
      if (question.includes('particle') || question.includes('atom')) return "4.6 - Particle Model of Matter";
      return "4.1 - Energy";
    }
    
    if (subject === 'biology') {
      if (question.includes('cell') || question.includes('organelle')) return "4.1 - Cell Biology";
      if (question.includes('enzyme') || question.includes('protein')) return "4.1.1 - Cell Structure and Transport";
      if (question.includes('photosynthesis')) return "4.4.1 - Photosynthesis";
      if (question.includes('respiration')) return "4.4.2 - Respiration";
      if (question.includes('inheritance') || question.includes('gene')) return "4.6 - Inheritance and Variation";
      if (question.includes('evolution') || question.includes('selection')) return "4.6.2 - Evolution";
      return "4.1 - Cell Biology";
    }
    
    return `${subject.charAt(0).toUpperCase() + subject.slice(1)} Specification`;
  };

  const generateModelAnswer = async (questionText: string, marks: number): Promise<string> => {
    try {
      console.log('Generating Smart model answer for question:', questionText.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('generate-model-answer', {
        body: {
          question: questionText,
          subjectId: subjectId,
          marks: marks
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Smart model answer generated successfully');
      return data.modelAnswer || generateFallbackModelAnswer(questionText);

    } catch (error) {
      console.error('Error generating Smart model answer:', error);
      // Fallback to improved static model answer
      return generateFallbackModelAnswer(questionText);
    }
  };

  const generateFallbackModelAnswer = (questionText: string): string => {
    const question = questionText.toLowerCase();
    
    // Generate specific model answers based on question content for English Language AQA
    if (question.includes('list four things about the library') && question.includes('lines 1 to 3')) {
      return "The library is described as a 'cathedral of knowledge,' suggesting it is a grand and sacred place dedicated to learning. It has 'vaulted ceilings' that create an impressive and lofty atmosphere, emphasizing its size and grandeur. There are 'towering shelves that stretched impossibly high' indicating the vast scale of the building. 'Dust motes danced in golden shafts of sunlight streaming through tall, arched windows' shows the presence of natural light and architectural features from the specified lines.";
    }
    
    if (question.includes('language here to describe the atmosphere') && question.includes('lines 5 to 9')) {
      return "The writer uses personification when describing the silence as 'alive', suggesting the library has a living, breathing quality that makes it feel dynamic rather than empty. The metaphor of tables as 'altars' and learning as a 'shrine' creates religious imagery that emphasizes the sacred, reverent atmosphere. The alliteration in 'soft footfalls' and 'whispered turning' emphasizes the gentle, respectful sounds that maintain the peaceful atmosphere. The verb 'moving reverently' suggests people treat the space with deep respect and awe, reinforcing the spiritual quality of the environment.";
    }
    
    if (question.includes('evaluate how the writer creates a sense of awe and reverence') && question.includes('20 marks')) {
      return "The writer creates a powerful sense of awe and reverence through the use of religious imagery and metaphor. The library is described as a 'cathedral of knowledge', immediately establishing it as a sacred space deserving of respect. This religious metaphor is extended through the description of tables as 'altars' where minds come to 'worship at the shrine of learning', suggesting that education itself is a form of spiritual devotion. The writer's use of personification makes the silence 'alive', creating an almost mystical atmosphere where the very air seems to hold knowledge and wisdom. The physical description contributes to this sense of awe through the 'vaulted ceilings' that 'disappear into shadows above', creating a sense of infinite height and grandeur that mirrors the limitless nature of knowledge itself. The alliteration in 'soft footfalls' and 'whispered turning' emphasizes the reverent behaviour of the library users, while the adverb 'reverently' directly states their respectful attitude. The writer's imagery of 'dust motes dancing in golden shafts of sunlight' creates an almost ethereal quality, as if knowledge itself is illuminated and made visible. Through these combined techniques, the writer successfully transforms a simple library into a temple of learning that inspires both awe and deep respect.";
    }
    
    // Generate specific model answers based on question content
    if (question.includes('photosynthesis')) {
      return "Carbon dioxide + Water → Glucose + Oxygen (in the presence of light energy and chlorophyll). This process occurs in chloroplasts and converts light energy into chemical energy stored in glucose.";
    }
    
    if (question.includes('respiration')) {
      return "Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP). This process occurs in mitochondria and releases energy from glucose for life processes.";
    }
    
    if (question.includes('calculate') && question.includes('mole')) {
      return "Use the formula: moles = mass ÷ Mr. For example, if 24g of carbon (Mr = 12): moles = 24 ÷ 12 = 2 moles.";
    }
    
    if (question.includes('force') && question.includes('calculate')) {
      return "Use Newton's second law: Force = Mass × Acceleration (F = ma). Substitute the given values and calculate in Newtons (N).";
    }
    
    return "This answer should demonstrate clear understanding of the key concepts, apply relevant knowledge to the specific context, and use appropriate scientific terminology.";
  };
  
  // Calculate GCSE grade based on percentage
  const getGCSEGrade = (percentage: number): string => {
    if (percentage >= 90) return "9";
    if (percentage >= 80) return "8";
    if (percentage >= 70) return "7";
    if (percentage >= 60) return "6";
    if (percentage >= 50) return "5";
    if (percentage >= 40) return "4";
    if (percentage >= 30) return "3";
    if (percentage >= 20) return "2";
    if (percentage >= 10) return "1";
    return "U";
  };

  // Save exam completion to database
  const saveExamCompletion = async (markedAttempts: QuestionAttempt[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, skipping database save');
        return;
      }

      // Calculate results - use passed totalMarks for English Literature (60) or calculate for other subjects
      const examTotalMarks = totalMarks || questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
      const achievedMarks = markedAttempts.reduce((sum: number, attempt: QuestionAttempt) => sum + attempt.score, 0);
      const percentage = examTotalMarks > 0 ? Math.round((achievedMarks / examTotalMarks) * 100) : 0;
      const grade = getGCSEGrade(percentage);

      const examCompletion = {
        user_id: user.id,
        subject_id: subjectId === 'geography-paper-2' ? 'geography' : subjectId?.replace('-paper-2', '') || subjectId,
        exam_date: new Date().toISOString().split('T')[0],
        total_marks: examTotalMarks,
        achieved_marks: achievedMarks,
        percentage: percentage,
        grade: grade,
        time_taken_seconds: timeElapsed || 0,
        questions: questions as any,
        answers: answers as any,
        results: markedAttempts as any
      };

      console.log('Saving exam completion to database:', examCompletion);

      const { error } = await supabase
        .from('predicted_exam_completions')
        .insert(examCompletion);

      if (error) {
        console.error('Database error saving exam completion:', error);
        toast.error("Failed to save exam results to database");
      } else {
        console.log('Exam completion saved successfully');
        toast.success("Exam results saved successfully!");
      }
    } catch (error) {
      console.error('Error saving exam completion:', error);
      toast.error("Failed to save exam results");
    }
  };

  // Mark all answers using same system as Practice.tsx - OPTIMIZED for speed
  const markAllAnswers = async () => {
    console.log('Starting to mark all answers in parallel...');
    setIsMarking(true);
    
    try {
      // Process all questions in parallel for much faster marking
      const markingPromises = questions.map(async (question: ExamQuestion, index: number) => {
        const answer = answers.find((a: ExamAnswer) => a.questionId === question.id);
        
        console.log(`Processing question ${index + 1}/${questions.length}:`, question.text?.substring(0, 50) + '...');
        
        if (answer) {
          try {
            // Generate model answer first, then use it for marking in parallel
            const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
            const markingResult = await markAnswerWithSmart(question, answer.answer, aiModelAnswer);
            
            // Determine if full marks were achieved
            const fullMarks = markingResult.marksAwarded === question.marks;
            
            const feedback = {
              modelAnswer: aiModelAnswer,
              whyThisGetsMark: generateMarkingCriteria(question.text || question.question || '', question.marks),
              whyYoursDidnt: fullMarks 
                ? `Excellent work! Your answer demonstrates strong understanding and addresses all key points effectively. You've shown good use of subject terminology and clear reasoning.`
                : markingResult.feedback,
              specLink: question.specReference || generateSpecReference(question.text || question.question || '', subjectId || ''),
              fullMarks: fullMarks
            };

            const attempt: QuestionAttempt = {
              questionId: question.id,
              userAnswer: answer.answer,
              score: markingResult.marksAwarded,
              feedback
            };
            
            console.log(`Question ${index + 1} marked with score: ${markingResult.marksAwarded}/${question.marks}`);
            return attempt;
            
          } catch (error) {
            console.error('Error marking question:', error);
            
            // Fallback attempt with Smart model answer
            const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
            
            const attempt: QuestionAttempt = {
              questionId: question.id,
              userAnswer: answer.answer,
              score: 0,
              feedback: {
                modelAnswer: aiModelAnswer,
                whyThisGetsMark: generateMarkingCriteria(question.text || question.question || '', question.marks),
                whyYoursDidnt: "Unable to mark this answer automatically. Please review with your teacher.",
                specLink: generateSpecReference(question.text || question.question || '', subjectId || '')
              }
            };
            
            return attempt;
          }
        } else {
          console.log(`No answer found for question ${index + 1}`);
          // Create empty attempt for unanswered questions
          const aiModelAnswer = await generateModelAnswer(question.text || question.question || '', question.marks);
          
          const attempt: QuestionAttempt = {
            questionId: question.id,
            userAnswer: '',
            score: 0,
            feedback: {
              modelAnswer: aiModelAnswer,
              whyThisGetsMark: generateMarkingCriteria(question.text || question.question || '', question.marks),
              whyYoursDidnt: "No answer provided.",
              specLink: generateSpecReference(question.text || question.question || '', subjectId || '')
            }
          };
          
          return attempt;
        }
      });
      
      // Wait for all questions to be marked in parallel
      const markedAttempts = await Promise.all(markingPromises);
      
      console.log('All answers marked in parallel, setting results...', markedAttempts);
      setAttempts(markedAttempts);
      
      // Save to database (only if not reviewing existing completion)
      if (!isReview) {
        await saveExamCompletion(markedAttempts);
      }
      
      // Generate notebook entries for questions where marks were lost
      if (!isReview) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          let notesGenerated = 0;
          for (const attempt of markedAttempts) {
            const question = questions.find((q: ExamQuestion) => q.id === attempt.questionId);
            if (question && attempt.score < question.marks) {
              const marksLost = question.marks - attempt.score;
              const questionObj = {
                id: question.id,
                question: question.text || question.question || '',
                marks: question.marks,
                difficulty: 'medium' as const,
                modelAnswer: attempt.feedback.modelAnswer,
                markingCriteria: { breakdown: attempt.feedback.whyThisGetsMark.split('\n') },
                specReference: attempt.feedback.specLink
              };
              
              const success = await NotebookGenerator.generateAndSaveNotes(
                user.id,
                questionObj,
                attempt.userAnswer,
                marksLost,
                subjectId === 'geography-paper-2' ? 'geography' : subjectId || '',
                'predicted-exam'
              );
              
              if (success) {
                notesGenerated++;
              }
            }
          }
          
          if (notesGenerated > 0) {
            toast.success(`Exam marked successfully! ${notesGenerated} revision notes added to your Smart Notebook.`, {
              action: {
                label: "View Notes",
                onClick: () => navigate('/notebook')
              }
            });
          } else {
            toast.success("Exam marked successfully!");
          }
        }
      } else {
        toast.success("Exam marked successfully!");
      }
      
    } catch (error) {
      console.error('Error in markAllAnswers:', error);
      toast.error("Failed to mark exam. Please try refreshing the page.");
    } finally {
      setIsMarking(false);
      console.log('Marking completed, isMarking set to false');
    }
  };
  
  useEffect(() => {
    if (questions && answers) {
      markAllAnswers();
    }
  }, [questions, answers]);

  if (isMarking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Clock className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <CardTitle className="text-foreground">Marking Your Predicted 2026 Exam</CardTitle>
            <CardDescription className="text-muted-foreground">
              Analyzing your answers with premium marking intelligence...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-medium text-foreground">
                Applying AQA mark schemes with advanced analysis
              </div>
              <Progress value={100} className="w-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total marks and grade - use passed totalMarks for English Literature (60) or calculate for other subjects
  const examTotalMarks = totalMarks || questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = attempts.reduce((sum: number, attempt: QuestionAttempt) => sum + attempt.score, 0);
  const percentage = examTotalMarks > 0 ? Math.round((achievedMarks / examTotalMarks) * 100) : 0;


  const grade = getGCSEGrade(percentage);

  return (
    <div className="min-h-screen" style={{background: 'var(--gradient-background)'}}>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl shadow-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/predicted-questions')}
                className="bg-background/60 backdrop-blur-sm hover:bg-background/80 border-primary/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {subject?.name} - Predicted Exam Results
                </h1>
                <p className="text-sm text-muted-foreground">
                  Smart AI Marking • Premium Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right p-4 rounded-lg" style={{background: 'var(--gradient-secondary)'}}>
                <div className="text-3xl font-bold text-primary">
                  {achievedMarks}/{examTotalMarks}
                </div>
                <div className="text-sm text-primary/80">
                  {percentage}% Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Grade Display Banner */}
          <Card className="border-0 shadow-2xl overflow-hidden relative">
            <div 
              className="absolute inset-0 opacity-90" 
              style={{background: 'var(--gradient-primary)'}}
            />
            <CardContent className="py-12 relative z-10">
              <div className="text-center space-y-6">
                <div className="text-8xl font-bold text-white drop-shadow-lg">
                  Grade {grade}
                </div>
                <div className="text-2xl text-white/90 font-medium">
                  {achievedMarks}/{examTotalMarks} marks ({percentage}%)
                </div>
                <div className="text-xl text-white/80">
                  {subject?.name} Predicted 2026 Exam
                </div>
                <div className="flex justify-center">
                  <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                    🎯 {percentage >= 70 ? 'Excellent Performance!' : percentage >= 50 ? 'Good Work!' : 'Keep Improving!'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card className="border border-primary/20 shadow-lg">
            <CardHeader className="pb-4" style={{background: 'var(--gradient-secondary)'}}>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Crown className="h-6 w-6 text-yellow-500" />
                Detailed Results Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{achievedMarks}</div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Marks Achieved</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{examTotalMarks}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Marks</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{percentage}%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Percentage</div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg" style={{background: 'var(--gradient-accent)'}}>
                <Progress value={percentage} className="h-3 bg-white/20" />
                <div className="flex justify-between mt-2 text-white/90 text-sm font-medium">
                  <span>0%</span>
                  <span className="bg-white/20 px-2 py-1 rounded">{percentage}%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question by Question Feedback */}
          {attempts.map((attempt, index) => (
            <Card key={attempt.questionId} className="mb-6 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10" 
                  style={{background: 'var(--gradient-secondary)'}}
                />
                <div className="relative z-10 flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold shadow-lg"
                      style={{background: 'var(--gradient-primary)'}}
                    >
                      {index + 1}
                    </div>
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Question {index + 1}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                    >
                      {attempt.score}/{questions[index]?.marks || 5} marks
                    </Badge>
                    <Badge 
                      variant={attempt.score >= (questions[index]?.marks || 5) * 0.85 ? "default" : 
                             attempt.score >= (questions[index]?.marks || 5) * 0.6 ? "secondary" : "destructive"}
                      className={
                        attempt.score >= (questions[index]?.marks || 5) * 0.85 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                          : attempt.score >= (questions[index]?.marks || 5) * 0.6 
                          ? "bg-amber-500 hover:bg-amber-600 text-white" 
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }
                    >
                      {attempt.score >= (questions[index]?.marks || 5) * 0.85 ? "🎯 Excellent" : 
                       attempt.score >= (questions[index]?.marks || 5) * 0.6 ? "⭐ Good" : "📚 Needs Work"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Question */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                      <HelpCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-blue-700 dark:text-blue-300">Question</span>
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                    <p className="text-foreground font-medium leading-relaxed">{questions[index]?.text || questions[index]?.question}</p>
                  </div>
                </div>

                {/* Student Answer */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-3">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-purple-700 dark:text-purple-300">Your Answer</span>
                  </h4>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                    <p className="text-foreground leading-relaxed">{attempt.userAnswer}</p>
                  </div>
                </div>

                {/* Model Answer */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mr-3">
                      <Book className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-300">✅ Model Answer</span>
                  </h4>
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    <div className="text-foreground space-y-3">
                      {attempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                        <p key={index} className="leading-relaxed">{sentence.trim()}{index < attempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).length - 1 ? '.' : ''}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Why This Gets Marks */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-orange-700 dark:text-orange-300">🎯 Why This Gets Full Marks</span>
                  </h4>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-xl border border-orange-200 dark:border-orange-800 shadow-sm">
                    <pre className="text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                      {attempt.feedback.whyThisGetsMark}
                    </pre>
                  </div>
                </div>

                {/* Smart Feedback - Conditional based on performance */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    {attempt.feedback.fullMarks ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mr-3">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-emerald-700 dark:text-emerald-300">✅ Teacher Feedback - Well Done!</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mr-3">
                          <Lightbulb className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-amber-700 dark:text-amber-300">💡 Why Your Answer Didn't Get Full Marks</span>
                      </>
                    )}
                  </h4>
                  <div className={`p-6 rounded-xl shadow-sm ${
                    attempt.feedback.fullMarks 
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800'
                  }`}>
                    <p className="text-foreground leading-relaxed">{attempt.feedback.whyYoursDidnt}</p>
                  </div>
                </div>

                {/* Spec Reference */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                      <Book className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-indigo-700 dark:text-indigo-300">🔗 Specification Reference</span>
                  </h4>
                  <Badge 
                    variant="outline" 
                    className="text-sm bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-4 py-2"
                  >
                    {attempt.feedback.specLink}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Weak Topics Summary */}
          {!isReview && attempts.some(attempt => {
            const question = questions.find((q: ExamQuestion) => q.id === attempt.questionId);
            return question && attempt.score < question.marks;
          }) && (
            <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 border-violet-200 dark:border-violet-700/50 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-3 text-violet-800 dark:text-violet-200 text-xl">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-full">
                    <Brain className="h-6 w-6" />
                  </div>
                  Smart Revision Notes Generated
                </CardTitle>
                <CardDescription className="text-violet-700 dark:text-violet-300 text-base">
                  Smart system has automatically created revision notes for topics where you lost marks
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-violet-800 dark:text-violet-200 text-lg font-medium">
                  Review personalized notes to strengthen weak areas and improve your Grade 9 performance
                </div>
                <Button 
                  onClick={() => navigate('/notebook')}
                  className="bg-gradient-to-r from-accent via-accent/80 to-accent/60 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  size="lg"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  View Smart Notebook
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 p-8 rounded-2xl" style={{background: 'var(--gradient-secondary)'}}>
            <h3 className="text-lg font-semibold text-primary mb-4 sm:mb-0 sm:mr-6">
              What's Next?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => {
                  console.log('Retake button clicked for subject:', subjectId);
                  // Handle geography-paper-2 case specifically
                  const examSubjectId = subjectId === 'geography' ? 'geography-paper-2' : subjectId;
                  navigate(`/predicted-exam/${examSubjectId}`);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-3"
                size="lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                🔄 Retake This Exam
              </Button>
              <Button 
                onClick={() => navigate('/predicted-questions')}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-3"
                size="lg"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                📚 Try Another Subject
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-3"
                size="lg"
              >
                <Target className="h-5 w-5 mr-2" />
                🏠 Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;