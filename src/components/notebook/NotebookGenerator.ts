import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/data/curriculum";

interface NotebookEntry {
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  questionId: string;
  questionLabel: string;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  whatTrippedUp: string;
  fixSentence: string;
  bulletproofNotes: string[];
  miniExample?: string;
  keywords: string[];
  specLink: string;
  nextStepSuggestion: string;
  skillType: string;
  bloomLevel: string;
  markLoss: number;
}

export class NotebookGenerator {
  static async generateAndSaveNotes(
    userId: string,
    question: Question,
    userAnswer: string,
    marksLost: number,
    subjectId: string,
    topicId: string
  ): Promise<boolean> {
    try {
      console.log('Generating notebook notes for question:', question.id);

      // Find the actual subject and topic names from curriculum
      const { curriculum } = await import('@/data/curriculum');
      const subject = curriculum.find(s => s.id === subjectId);
      const subjectName = subject?.name || subjectId;
      
      // Handle special cases for topic names
      let topicName = topicId;
      if (topicId === 'predicted-exam') {
        topicName = 'Predicted Exam';
      } else {
        const topic = subject?.topics.find(t => t.id === topicId);
        topicName = topic?.name || topicId;
      }

      // Generate notes using OpenAI
      const { data: notesData, error: notesError } = await supabase.functions.invoke('generate-notebook-notes', {
        body: {
          questionText: question.question,
          userAnswer,
          modelAnswer: question.modelAnswer,
          markingCriteria: question.markingCriteria?.breakdown?.join('; ') || 'Standard marking criteria',
          subject: subjectId,
          topic: topicName,
          subtopic: topicName,
          marksLost
        }
      });

      if (notesError) {
        console.error('Error generating notes:', notesError);
        return false;
      }

      if (!notesData.success) {
        console.error('Failed to generate notes:', notesData.error);
        return false;
      }

      const notes = notesData.notes;

      // Check if similar note already exists for this topic and question
      const { data: existingNotes, error: fetchError } = await supabase
        .from('notebook_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subjectName)
        .eq('topic', topicName)
        .eq('question_id', question.id);

      if (fetchError) {
        console.error('Error checking existing notes:', fetchError);
      }

      // Check if note already exists for this specific question
      if (existingNotes && existingNotes.length > 0) {
        console.log('Note already exists for this question, skipping...');
        return true; // Still return true as this is not an error
      }

      // Also check for very similar content across all notes to prevent conceptual duplicates
      const { data: allUserNotes, error: allNotesError } = await supabase
        .from('notebook_entries')
        .select('what_tripped_up, fix_sentence, bulletproof_notes')
        .eq('user_id', userId)
        .eq('subject', subjectName)
        .eq('topic', topicName);

      if (!allNotesError && allUserNotes) {
        const isSimilarContent = allUserNotes.some(entry => {
          // Check if the core learning points are too similar
          const existingKeywords = entry.bulletproof_notes?.join(' ').toLowerCase() || '';
          const newKeywords = notes.bulletproofNotes?.join(' ').toLowerCase() || '';
          
          // Simple similarity check - if more than 50% of key concepts overlap
          const existingWords = existingKeywords.split(' ').filter(w => w.length > 4);
          const newWords = newKeywords.split(' ').filter(w => w.length > 4);
          const commonWords = existingWords.filter(word => newWords.includes(word));
          
          return commonWords.length > Math.min(existingWords.length, newWords.length) * 0.5;
        });

        if (isSimilarContent) {
          console.log('Similar content already exists, skipping...');
          return true;
        }
      }

      // Determine confidence level based on marks lost
      const totalMarks = question.marks || 1;
      const lossPercentage = (marksLost / totalMarks) * 100;
      let confidenceLevel: 'Low' | 'Medium' | 'High';
      
      if (lossPercentage >= 70) confidenceLevel = 'Low';
      else if (lossPercentage >= 40) confidenceLevel = 'Medium';
      else confidenceLevel = 'High';

      // Determine skill type based on question content
      const questionText = question.question.toLowerCase();
      let skillType = 'explain';
      if (questionText.includes('calculate') || questionText.includes('work out')) skillType = 'calc';
      else if (questionText.includes('define') || questionText.includes('what is')) skillType = 'define';
      else if (questionText.includes('graph') || questionText.includes('plot')) skillType = 'graph';
      else if (questionText.includes('evaluate') || questionText.includes('assess')) skillType = 'evaluate';

      // Determine Bloom level
      let bloomLevel = 'recall';
      if (questionText.includes('explain') || questionText.includes('describe')) bloomLevel = 'understand';
      else if (questionText.includes('calculate') || questionText.includes('apply')) bloomLevel = 'apply';
      else if (questionText.includes('compare') || questionText.includes('analyse')) bloomLevel = 'analyse';
      else if (questionText.includes('evaluate') || questionText.includes('assess')) bloomLevel = 'evaluate';

      // Save to database
      const { error: insertError } = await supabase
        .from('notebook_entries')
        .insert({
          user_id: userId,
          subject: subjectName,
          paper: `${subjectName} Paper 1`, // Default paper name
          topic: topicName,
          subtopic: topicName,
          question_id: question.id,
          question_label: question.question,
          confidence_level: confidenceLevel,
          what_tripped_up: notes.whatTrippedUp,
          fix_sentence: notes.fixSentence,
          bulletproof_notes: notes.bulletproofNotes,
          mini_example: notes.miniExample || null,
          keywords: notes.keywords,
          spec_link: question.specReference || `${subjectId.toUpperCase()} specification`,
          next_step_suggestion: notes.nextStep,
          skill_type: skillType,
          bloom_level: bloomLevel,
          mark_loss: marksLost
        });

      if (insertError) {
        console.error('Error saving notebook entry:', insertError);
        return false;
      }

      console.log('Notebook entry saved successfully');
      return true;

    } catch (error) {
      console.error('Error in notebook generation:', error);
      return false;
    }
  }

  static async generateNotesForExam(
    userId: string,
    examResults: any[],
    subjectId: string
  ): Promise<number> {
    let notesGenerated = 0;

    for (const result of examResults) {
      if (result.marks_awarded < result.total_marks) {
        const marksLost = result.total_marks - result.marks_awarded;
        
        // Resolve topic from question data or try to determine from content
        let topicId = 'general';
        
        if (result.question_data?.topic) {
          topicId = result.question_data.topic;
        } else if (result.topic) {
          topicId = result.topic;
        } else {
          // Try to determine topic from question content for specific subjects
          const questionText = (result.question_text || '').toLowerCase();
          
          if (subjectId === 'english-language') {
            // Check for Children's Language Development keywords
            if (questionText.includes('child') || questionText.includes('transcript') || 
                questionText.includes('language development') || questionText.includes('phonological') ||
                questionText.includes('vocabulary') || questionText.includes('grammar development')) {
              topicId = 'childrens-language-development';
            }
            // Check for Textual Variations and Representations keywords
            else if (questionText.includes('text') || questionText.includes('language techniques') ||
                     questionText.includes('representation') || questionText.includes('analyse') ||
                     questionText.includes('compare') || questionText.includes('language choice')) {
              topicId = 'textual-variations-representations';
            }
            // Default to the first topic if we can't determine
            else {
              topicId = 'textual-variations-representations';
            }
          }
        }
        
        // Create a simplified question object
        const question = {
          id: result.question_id || `exam_q_${Date.now()}`,
          question: result.question_text || 'Exam question',
          marks: result.total_marks,
          difficulty: 'medium' as const,
          modelAnswer: result.model_answer || 'Model answer not available',
          markingCriteria: { breakdown: result.marking_criteria?.split('; ') || [] },
          specReference: result.spec_reference || `${subjectId.toUpperCase()} specification`
        };

        const success = await this.generateAndSaveNotes(
          userId,
          question,
          result.user_answer || '',
          marksLost,
          subjectId,
          topicId
        );

        if (success) {
          notesGenerated++;
        }
      }
    }

    return notesGenerated;
  }
}