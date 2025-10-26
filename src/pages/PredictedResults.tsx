import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw, Book, Lightbulb, HelpCircle, User, StickyNote, Brain, Trophy, Home, CheckCircle2, FileText } from "lucide-react";
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
      <div className={`min-h-screen bg-white ${isPremium ? '' : 'pt-12'}`}>
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-black mb-2">No Exam Results Found</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  It looks like you haven't completed an exam yet or the session expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4 pb-8">
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => navigate('/predicted-questions')}
                    className="h-12 text-base font-semibold"
                    style={{ backgroundColor: '#0BA5E9', color: 'white' }}
                  >
                    Take a Predicted Exam
                  </Button>
                  <Button 
                    onClick={() => navigate(-1)} 
                    variant="outline"
                    className="h-12 text-base font-semibold border-2 border-gray-200"
                  >
                    Go Back
                  </Button>
                </div>
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
  
  // Helper to check if subject is A-Level - simple string check
  const isALevel = (subjectId?: string): boolean => {
    if (!subjectId) return false;
    return subjectId.toLowerCase().includes('alevel');
  };

  const getGrade = (percentage: number, subjectId?: string): string => {
    if (isALevel(subjectId)) {
      // A-Level letter grades
      if (percentage >= 90) return "A*";
      if (percentage >= 80) return "A";
      if (percentage >= 70) return "B";
      if (percentage >= 60) return "C";
      if (percentage >= 50) return "D";
      if (percentage >= 40) return "E";
      return "U";
    } else {
      // GCSE number grades
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
    }
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
      const grade = getGrade(percentage, subjectId);

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
      } else {
        console.log('✓ Exam completion saved successfully to database');
        
        // Mark daily task complete - FIXED approach
        const today = new Date().toISOString().split('T')[0];
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('DAILY TASK MARKING STARTED');
        console.log('Subject ID:', subjectId);
        console.log('User ID:', user.id);
        console.log('Date:', today);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Check if task already exists
        const { data: existingTask } = await supabase
          .from('subject_daily_tasks')
          .select('id')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .eq('task_id', 'predicted_exam')
          .eq('date', today)
          .maybeSingle();
        
        if (existingTask) {
          // Update existing task
          console.log(`🔄 UPDATING EXISTING TASK with subject_id: "${subjectId}" | task_id: "predicted_exam"`);
          const { data: updatedTask, error: taskError } = await supabase
            .from('subject_daily_tasks')
            .update({
              completed: true,
              mp_awarded: 30,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingTask.id)
            .select();
          
          console.log('📊 UPDATE RESPONSE - Data:', updatedTask, 'Error:', taskError);
          
          if (taskError) {
            console.error('✗ ERROR updating task:', taskError);
          } else if (!updatedTask || updatedTask.length === 0) {
            console.error('⚠️ Update returned success but no data');
          } else {
            console.log('✓ Task updated in database:', updatedTask);
          }
        } else {
          // Insert new task
          console.log(`📝 INSERTING TASK with subject_id: "${subjectId}" | task_id: "predicted_exam"`);
          const { data: insertedTask, error: taskError } = await supabase
            .from('subject_daily_tasks')
            .insert({
              user_id: user.id,
              subject_id: subjectId,
              task_id: 'predicted_exam',
              date: today,
              completed: true,
              mp_awarded: 30
            })
            .select();
          
          console.log('📊 INSERT RESPONSE - Data:', insertedTask, 'Error:', taskError);
          
          if (taskError) {
            console.error('❌ Error inserting task:', taskError);
          } else if (!insertedTask || insertedTask.length === 0) {
            console.error('⚠️ Insert returned success but no data - likely RLS issue');
          } else {
            console.log('✅ Task inserted successfully:', insertedTask);
          }
        }
        
        // Award 30 MP - Check if user exists first
        const { data: existingPoints } = await supabase
          .from('user_points')
          .select('total_points')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (existingPoints) {
          // Update existing points
          const newTotal = existingPoints.total_points + 30;
          const { error: pointsError } = await supabase
            .from('user_points')
            .update({
              total_points: newTotal,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
          
          if (pointsError) {
            console.error('✗ ERROR updating MP:', pointsError);
          } else {
            console.log('✓ Updated MP | New total:', newTotal);
          }
        } else {
          // Insert new points record
          const { error: pointsError } = await supabase
            .from('user_points')
            .insert({
              user_id: user.id,
              total_points: 30,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (pointsError) {
            console.error('✗ ERROR inserting MP:', pointsError);
          } else {
            console.log('✓ Created MP record | Total: 30');
          }
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('DAILY TASK MARKING COMPLETE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    } catch (error) {
      console.error('Error saving exam completion:', error);
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
          
          // Notebook notes generation completed
        }
      } else {
        // No notebook notes needed
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
      <div className={`min-h-screen bg-white flex items-center justify-center ${isPremium ? '' : 'pt-12'}`}>
        <Card className="max-w-lg w-full border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                <Clock className="h-8 w-8 animate-pulse" style={{ color: '#0BA5E9' }} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-black mb-2">
              Marking Your Exam
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Analyzing your answers with advanced marking intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6 pb-8">
            <div className="space-y-3">
              <div className="text-base font-medium text-gray-900">
                Applying AQA mark schemes
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full animate-pulse"
                  style={{ 
                    width: '100%',
                    backgroundColor: '#0BA5E9'
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                This usually takes 10-30 seconds
              </p>
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


  const grade = getGrade(percentage, subjectId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold text-foreground">
                Predicted Results
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(195,69%,54%)]/20 to-[hsl(195,69%,54%)]/10 flex items-center justify-center animate-scale-in shadow-lg">
              <Trophy className="w-14 h-14 text-[hsl(195,69%,54%)]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
              Predicted Exam Complete!
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Great work on completing the {subject?.name} predicted exam. Review your detailed results below.
            </p>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Card className="bg-card rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(195,69%,54%)]/10 to-[hsl(195,69%,54%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative">
              <div className="text-center space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Overall Score
                  </p>
                  <p className="text-5xl font-bold text-[hsl(195,69%,54%)]">
                    {percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {achievedMarks} out of {examTotalMarks} marks
                  </p>
                </div>
                
                {/* Grade Badge */}
                <div className="flex justify-center pt-2">
                  <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-[hsl(195,69%,54%)] to-[hsl(195,60%,60%)] shadow-lg">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Predicted Grade
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Card className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(195,69%,54%)]/20 to-[hsl(195,69%,54%)]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[hsl(195,69%,54%)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{achievedMarks}/{examTotalMarks}</p>
                  <p className="text-xs text-muted-foreground">Marks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(195,69%,54%)]/20 to-[hsl(195,69%,54%)]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[hsl(195,69%,54%)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(195,69%,54%)]/20 to-[hsl(195,69%,54%)]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[hsl(195,69%,54%)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{timeElapsed ? Math.round(timeElapsed / 60) : '-'}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h2 className="text-2xl font-bold text-foreground">Question Breakdown</h2>
          
          <div className="space-y-6">
            {attempts.map((attempt, index) => {
              const question = questions[index];
              const marksPercentage = (attempt.score / question.marks) * 100;
              
              return (
                <Card key={attempt.questionId} className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardHeader className="border-b bg-muted/20 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            {(index + 1).toString().padStart(2, '0').split('').map((digit, idx) => (
                              <span key={idx} className="inline-block border-2 border-foreground px-3 py-1 text-base font-mono font-semibold text-foreground dark:border-foreground/80">
                                {digit}
                              </span>
                            ))}
                          </div>
                          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                            marksPercentage >= 70
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                              : marksPercentage >= 40
                              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                              : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
                          }`}>
                            <span className={`font-bold text-sm ${
                              marksPercentage >= 70
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : marksPercentage >= 40
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>{attempt.score}/{question.marks}</span>
                            <span className={`text-xs font-medium ${
                              marksPercentage >= 70
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : marksPercentage >= 40
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>marks</span>
                          </div>
                        </div>
                        <p className="text-base text-foreground leading-relaxed">
                          {question.text || question.question}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-foreground whitespace-nowrap">
                        [{question.marks} marks]
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-4">
                    {/* Your Answer Bubble */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-xs font-semibold text-muted-foreground">Your Answer</span>
                        </div>
                        <div className={`rounded-3xl rounded-tl-md px-5 py-4 shadow-sm backdrop-blur-sm border ${
                          marksPercentage >= 70
                            ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200/50 dark:border-emerald-800/50'
                            : marksPercentage >= 40
                            ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200/50 dark:border-amber-800/50'
                            : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30 border-red-200/50 dark:border-red-800/50'
                        }`}>
                          <p className="text-foreground leading-relaxed">
                            {attempt.userAnswer || <span className="text-muted-foreground italic">No answer provided</span>}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Model Answer Bubble */}
                    {attempt.feedback.modelAnswer && !attempt.feedback.fullMarks && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] space-y-2">
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Model Answer</span>
                          </div>
                          <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 px-5 py-4 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
                            <p className="text-foreground leading-relaxed">{attempt.feedback.modelAnswer}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Teacher Feedback Bubble */}
                    {attempt.feedback.whyYoursDidnt && !attempt.feedback.fullMarks && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] space-y-2">
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">How to Improve</span>
                          </div>
                          <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 px-5 py-4 shadow-sm border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                            <p className="text-foreground leading-relaxed">{attempt.feedback.whyYoursDidnt}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Full Marks Bubble */}
                    {attempt.feedback.fullMarks && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] space-y-2">
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Perfect Answer!</span>
                          </div>
                          <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 px-5 py-4 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
                            <p className="text-foreground leading-relaxed">{attempt.feedback.whyYoursDidnt}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mark Scheme Bubble */}
                    {attempt.feedback.whyThisGetsMark && !attempt.feedback.fullMarks && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] space-y-2">
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Mark Scheme</span>
                          </div>
                          <div className="rounded-3xl rounded-tl-md bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 px-5 py-4 shadow-sm border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                            <p className="text-foreground leading-relaxed whitespace-pre-line">{attempt.feedback.whyThisGetsMark}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 pb-8 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 rounded-full px-8 py-6 font-semibold"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/predicted-questions')}
            size="lg"
            className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Target className="w-4 h-4" />
            Try Another Exam
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PredictedResults;