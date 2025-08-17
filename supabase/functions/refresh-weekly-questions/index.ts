import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting weekly question refresh at:', new Date().toISOString());

    // Get all current predicted questions from database
    const { data: existingQuestions, error: fetchError } = await supabase
      .from('predicted_questions_2026')
      .select('*');

    if (fetchError) {
      console.error('Error fetching existing questions:', fetchError);
      throw fetchError;
    }

    if (!existingQuestions || existingQuestions.length === 0) {
      console.log('No existing questions found to refresh');
      return new Response(JSON.stringify({ message: 'No questions to refresh' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${existingQuestions.length} existing questions to refresh`);

    // Group questions by subject and exam board
    const questionGroups = existingQuestions.reduce((acc, question) => {
      const key = `${question.subject}_${question.exam_board}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(question);
      return acc;
    }, {} as Record<string, any[]>);

    const newQuestions = [];

    // Generate new questions for each subject/exam board group
    for (const [groupKey, questions] of Object.entries(questionGroups)) {
      const [subject, examBoard] = groupKey.split('_');
      
      console.log(`Generating new questions for ${subject} - ${examBoard} (${questions.length} questions)`);

      // Create a prompt to generate similar but different questions
      const existingQuestionsText = questions.map(q => 
        `Question ${q.question_number}: ${q.question_text} (${q.marks} marks)`
      ).join('\n');

      const prompt = `You are an expert ${subject} teacher creating ${examBoard} exam questions for 2026. 

EXISTING QUESTIONS TO REPLACE:
${existingQuestionsText}

Generate ${questions.length} NEW questions that are:
1. Similar in style and difficulty to the existing ones
2. Cover the same topics but with different scenarios/contexts
3. Have the same mark allocations as the originals
4. Are completely different questions (not variations)
5. Follow ${examBoard} specification requirements
6. Are appropriate for 2026 predicted papers

Return ONLY a JSON array with this exact structure:
[
  {
    "question_number": 1,
    "question_text": "Question text here",
    "marks": 6,
    "topic": "Topic name",
    "difficulty": "Medium"
  }
]

Ensure each question is engaging, relevant, and tests understanding rather than just recall.`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              { role: 'system', content: 'You are an expert exam question generator. Always return valid JSON arrays only.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 4000,
            temperature: 0.7
          }),
        });

        if (!response.ok) {
          console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        const generatedContent = data.choices[0].message.content;
        
        // Parse the JSON response
        let generatedQuestions;
        try {
          // Clean the response to extract JSON
          const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            generatedQuestions = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON array found in response');
          }
        } catch (parseError) {
          console.error('Error parsing generated questions:', parseError);
          console.log('Raw response:', generatedContent);
          continue;
        }

        // Process and add to new questions array
        for (let i = 0; i < generatedQuestions.length && i < questions.length; i++) {
          const originalQuestion = questions[i];
          const newQuestion = generatedQuestions[i];
          
          newQuestions.push({
            id: originalQuestion.id, // Keep same ID for update
            subject: subject,
            exam_board: examBoard,
            question_number: newQuestion.question_number,
            question_text: newQuestion.question_text,
            marks: newQuestion.marks,
            topic: newQuestion.topic || originalQuestion.topic,
            difficulty: newQuestion.difficulty || originalQuestion.difficulty,
            updated_at: new Date().toISOString()
          });
        }

        console.log(`Generated ${generatedQuestions.length} new questions for ${subject} - ${examBoard}`);
        
      } catch (apiError) {
        console.error(`Error generating questions for ${subject} - ${examBoard}:`, apiError);
        continue;
      }
    }

    if (newQuestions.length === 0) {
      console.log('No new questions were generated');
      return new Response(JSON.stringify({ message: 'No questions were refreshed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update all questions in database
    console.log(`Updating ${newQuestions.length} questions in database`);
    
    const updatePromises = newQuestions.map(question => 
      supabase
        .from('predicted_questions_2026')
        .update({
          question_text: question.question_text,
          marks: question.marks,
          topic: question.topic,
          difficulty: question.difficulty,
          updated_at: question.updated_at
        })
        .eq('id', question.id)
    );

    const updateResults = await Promise.allSettled(updatePromises);
    
    const successCount = updateResults.filter(result => result.status === 'fulfilled').length;
    const errorCount = updateResults.filter(result => result.status === 'rejected').length;

    console.log(`✅ Weekly refresh completed: ${successCount} questions updated, ${errorCount} errors`);

    return new Response(JSON.stringify({ 
      message: 'Weekly question refresh completed',
      updated: successCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in weekly question refresh:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to refresh weekly questions',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});