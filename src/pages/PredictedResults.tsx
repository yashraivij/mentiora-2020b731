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
import { useSubscription } from "@/hooks/useSubscription";

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
  const { isPremium } = useSubscription();
  
  const { questions, answers, timeElapsed, isReview, completion, totalMarks } = location.state || {};
  
  // If no state is provided, show a message instead of redirecting
  if (!questions || !answers) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/10 ${isPremium ? '' : 'pt-12'}`}>
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
      <div className={`min-h-screen bg-background flex items-center justify-center ${isPremium ? '' : 'pt-12'}`}>
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
    <div className={`min-h-screen bg-background ${isPremium ? '' : 'pt-12'}`}>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {subject?.name} - Predicted Exam Results
                </h1>
                <p className="text-sm text-muted-foreground">
                  
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {achievedMarks}/{examTotalMarks}
                </div>
                <div className="text-sm text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Grade Display Banner */}
          <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold drop-shadow-lg">
                  Grade {grade}
                </div>
                <div className="text-xl drop-shadow-md">
                  {achievedMarks}/{examTotalMarks} marks ({percentage}%)
                </div>
                <div className="text-lg opacity-90 drop-shadow-md">
                  {subject?.name} Predicted 2026 Exam
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Detailed Results Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{achievedMarks}</div>
                  <div className="text-sm text-muted-foreground">Marks Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{examTotalMarks}</div>
                  <div className="text-sm text-muted-foreground">Total Marks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Percentage</div>
                </div>
              </div>
              <Progress value={percentage} className="mt-4" />
            </CardContent>
          </Card>

          {/* Question by Question Feedback */}
          {attempts.map((attempt, index) => (
            <Card key={attempt.questionId} className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    Question {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {attempt.score}/{questions[index]?.marks || 5} marks
                    </Badge>
                    <Badge 
                      variant={attempt.score >= (questions[index]?.marks || 5) * 0.85 ? "default" : 
                             attempt.score >= (questions[index]?.marks || 5) * 0.6 ? "secondary" : "destructive"}
                    >
                      {attempt.score >= (questions[index]?.marks || 5) * 0.85 ? "Excellent" : 
                       attempt.score >= (questions[index]?.marks || 5) * 0.6 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 mr-2">
                      <HelpCircle className="h-4 w-4 text-white" />
                    </div>
                    Question
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <p className="text-foreground">{questions[index]?.text || questions[index]?.question}</p>
                  </div>
                </div>

                {/* Student Answer */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 mr-2">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    Your Answer
                  </h4>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-foreground">{attempt.userAnswer}</p>
                  </div>
                </div>

                {/* Model Answer */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Book className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                    ✅ Model Answer
                  </h4>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border-l-4 border-emerald-500">
                    <div className="text-foreground space-y-2">
                      {attempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                        <p key={index} className="leading-relaxed">{sentence.trim()}{index < attempt.feedback.modelAnswer.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(sentence => sentence.trim()).length - 1 ? '.' : ''}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Why This Gets Marks */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 mr-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    🎯 Why This Gets Full Marks
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <pre className="text-foreground whitespace-pre-wrap font-sans">
                      {attempt.feedback.whyThisGetsMark}
                    </pre>
                  </div>
                </div>

                {/* Smart Feedback - Conditional based on performance */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    {attempt.feedback.fullMarks ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                        ✅ Teacher Feedback - Well Done!
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                        ❌ Why Your Answer Didn't Get Full Marks
                      </>
                    )}
                  </h4>
                  <div className={`p-4 rounded-lg border-l-4 ${
                    attempt.feedback.fullMarks 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500' 
                      : 'bg-amber-50 dark:bg-amber-950/20 border-amber-500'
                  }`}>
                    <p className="text-foreground">{attempt.feedback.whyYoursDidnt}</p>
                  </div>
                </div>

                {/* Spec Reference */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Book className="h-4 w-4 mr-2 text-indigo-600" />
                    🔗 Specification Reference
                  </h4>
                  <Badge variant="outline" className="text-sm">
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
            <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-green-950/30 dark:via-blue-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-700/50 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-3 text-green-800 dark:text-green-200 text-xl">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                    <Brain className="h-6 w-6" />
                  </div>
                  Smart Revision Notes Generated
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300 text-base">
                  Smart system has automatically created revision notes for topics where you lost marks
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-green-800 dark:text-green-200 text-lg font-medium">
                  Review personalized notes to strengthen weak areas and improve your Grade 9 performance
                </div>
                <Button 
                  onClick={() => navigate('/dashboard?tab=notes')}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  size="lg"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  View Smart Notebook
                </Button>
              </CardContent>
            </Card>
          )}

            {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mt-12">
            <Button 
              onClick={() => {
                console.log('Retake button clicked for subject:', subjectId);
                // Handle geography-paper-2 case specifically
                const examSubjectId = subjectId === 'geography' ? 'geography-paper-2' : subjectId;
                navigate(`/predicted-exam/${examSubjectId}`);
              }}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake This Exam
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Try Another Subject
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline"
            >
              <Target className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;