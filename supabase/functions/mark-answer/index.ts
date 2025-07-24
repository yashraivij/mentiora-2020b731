
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

    // Check if this is a math question that might need the formula sheet
    const isMath = subjectId.toLowerCase().includes('math') || subjectId.toLowerCase().includes('m1') || subjectId.toLowerCase().includes('m2') || subjectId.toLowerCase().includes('m3') || subjectId.toLowerCase().includes('m4') || subjectId.toLowerCase().includes('m5') || subjectId.toLowerCase().includes('m6');
    const formulaKeywords = ['trapezium', 'trapezoid', 'prism', 'volume', 'circle', 'circumference', 'radius', 'diameter', 'π', 'pi', 'quadratic', 'ax²', 'ax2', 'pythagoras', 'hypotenuse', 'right triangle', 'sin', 'cos', 'tan', 'sine rule', 'cosine rule', 'trigonometry', 'compound interest', 'probability', 'P(A', 'P(B'];
    
    const questionText = `${question} ${modelAnswer}`.toLowerCase();
    const needsFormulaSheet = isMath && formulaKeywords.some(keyword => questionText.includes(keyword.toLowerCase()));
    
    const formulaSheetNote = needsFormulaSheet ? 
      '\n\nIMPORTANT: If this question involves formulas, make sure to mention in your feedback that students can find help using the AQA GCSE Maths formula sheet. Include this as a helpful tip in your feedback.' : '';

    const prompt = `You are a friendly teacher helping a student learn ${subjectId}. Your job is to give helpful, encouraging feedback that's easy to understand.

QUESTION: ${question}

STUDENT'S ANSWER: ${userAnswer}

CORRECT ANSWER: ${modelAnswer}

WHAT TO LOOK FOR:
${typeof markingCriteria === 'string' ? markingCriteria : markingCriteria.breakdown ? markingCriteria.breakdown.join('\n') : markingCriteria}

TOTAL MARKS: ${totalMarks}${formulaSheetNote}

CRITICAL MARKING INSTRUCTIONS:
- ACCEPT EQUIVALENT ANSWERS: If the student's answer is mathematically correct but uses different units (e.g., N/cm vs N/m, cm vs m, kg vs g), calculate if the values are equivalent and award full marks if correct
- UNIT CONVERSIONS: Automatically check for common unit conversions (1 m = 100 cm, 1 kg = 1000 g, etc.) and accept correct answers in any reasonable unit
- MATHEMATICAL PRECISION: If the student gives a more precise answer (e.g., 3.14159) than the model answer (e.g., 3.14), award full marks as long as it's mathematically correct. More precision should NEVER be penalized unless the question specifically asks for rounding.
- DECIMAL VS ROUNDED: Accept both rounded and unrounded versions of the same numerical answer. For example, if the model answer is 2.5 and the student writes 2.53846..., this should receive full marks unless rounding was specifically requested in the question.
- ALTERNATIVE FORMS: Accept answers in different but equivalent forms (fractions vs decimals, scientific notation, rearranged equations)
- ONLY comment on what the student actually wrote - do not assume working that isn't shown
- If the student gives just a final answer with no working, only assess the accuracy of that answer
- Do NOT mention "calculation mistakes" or "working out" unless the student actually showed calculations
- Be consistent: if working is required for full marks, deduct appropriately but explain this clearly
- If a correct final answer deserves full marks without working, award full marks
- Always check your feedback against what the student ACTUALLY wrote, not what you think they might have done

IMPORTANT: Always check your feedback against the CORRECT ANSWER above. Make sure you don't contradict what's shown in the correct answer.

Give feedback that:
1. MARKS_AWARDED: A number from 0 to ${totalMarks}
2. FEEDBACK: Use simple, friendly language. Only comment on what the student actually showed. If they got the right answer but showed no working, say so clearly. If working was required and missing, explain this. Be specific about what you can see in their response.
3. ASSESSMENT: A simple comment like "Great job!", "Good effort!", "Keep trying!", or "Almost there!"

Be encouraging and helpful. If a student shows understanding but uses different words, give them credit. Focus on the main ideas rather than exact wording. Make sure your feedback matches the correct answer provided and what the student actually wrote.

Respond in this exact JSON format:
{
  "marksAwarded": [number],
  "feedback": "[friendly, conversational feedback based only on what was actually written]",
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
