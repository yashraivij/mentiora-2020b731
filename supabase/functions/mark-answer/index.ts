
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

    const prompt = `You are an experienced teacher marking ${subjectId} exam answers. Mark this student's answer fairly and accurately.

QUESTION: ${question}

STUDENT'S ANSWER: ${userAnswer}

MODEL ANSWER: ${modelAnswer}

MARKING CRITERIA:
${markingCriteria.breakdown.join('\n')}

TOTAL MARKS AVAILABLE: ${totalMarks}

CRITICAL: When providing feedback, you MUST carefully reference the MODEL ANSWER above. Do NOT contradict what is stated in the model answer. If the model answer contains specific terms, concepts, or examples, acknowledge them accurately in your feedback.

Please provide:
1. MARKS_AWARDED: A number from 0 to ${totalMarks}
2. FEEDBACK: Detailed feedback explaining what the student got right, what they missed, and how to improve. ALWAYS cross-reference your feedback with the model answer to ensure accuracy.
3. ASSESSMENT: Brief overall assessment (e.g., "Excellent", "Good", "Needs Work", "Poor")

Be fair and accurate. Give credit for correct understanding even if wording differs from the model answer. Look for key concepts and scientific accuracy rather than exact word matches. ENSURE your feedback is consistent with the provided model answer.

Respond in this exact JSON format:
{
  "marksAwarded": [number],
  "feedback": "[detailed feedback]",
  "assessment": "[brief assessment]"
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
