
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, userAnswer, modelAnswer, markingCriteria, totalMarks, subjectId } = await req.json();

    console.log('Marking request received:', { question, userAnswer, totalMarks, subjectId });

    if (!question || !userAnswer || !modelAnswer || !markingCriteria) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are a friendly teacher helping a student learn ${subjectId}. Your job is to give helpful, encouraging feedback that's easy to understand.

QUESTION: ${question}

STUDENT'S ANSWER: ${userAnswer}

CORRECT ANSWER: ${modelAnswer}

WHAT TO LOOK FOR:
${markingCriteria.breakdown.join('\n')}

TOTAL MARKS: ${totalMarks}

IMPORTANT: Always check your feedback against the CORRECT ANSWER above. Make sure you don't contradict what's shown in the correct answer.

Give feedback that:
1. MARKS_AWARDED: A number from 0 to ${totalMarks}
2. FEEDBACK: Use simple, friendly language. Start with what they did well, then explain what they missed. Give specific tips on how to improve. Talk like you're having a conversation with the student - use "you" and "your" and be encouraging!
3. ASSESSMENT: A simple comment like "Great job!", "Good effort!", "Keep trying!", or "Almost there!"

Be encouraging and helpful. If a student shows understanding but uses different words, give them credit. Focus on the main ideas rather than exact wording. Make sure your feedback matches the correct answer provided.

Respond in this exact JSON format:
{
  "marksAwarded": [number],
  "feedback": "[friendly, conversational feedback]",
  "assessment": "[encouraging assessment]"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert teacher and examiner. Always respond with valid JSON in the exact format requested. Be fair, accurate, and educational in your marking.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('OpenAI response:', aiResponse);

    // Parse the JSON response
    let markingResult;
    try {
      markingResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback response if JSON parsing fails
      markingResult = {
        marksAwarded: Math.round(totalMarks * 0.5), // Give 50% as fallback
        feedback: "Answer processed. Please review your response against the model answer.",
        assessment: "Needs Review"
      };
    }

    // Ensure marks are within valid range
    markingResult.marksAwarded = Math.max(0, Math.min(markingResult.marksAwarded, totalMarks));

    console.log('Final marking result:', markingResult);

    return new Response(JSON.stringify(markingResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in mark-answer function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to mark answer',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
