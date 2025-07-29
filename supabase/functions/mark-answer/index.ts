
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token and get user
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Missing or invalid authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    console.log('Received request:', JSON.stringify(requestBody, null, 2));
    
    const { question, userAnswer, modelAnswer, markingCriteria, totalMarks, subject } = requestBody;

    // Validate required fields
    if (!question || !userAnswer || !totalMarks) {
      return new Response(JSON.stringify({ error: 'Missing required fields: question, userAnswer, totalMarks' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input lengths to prevent abuse
    if (question.length > 5000 || userAnswer.length > 5000 || (modelAnswer && modelAnswer.length > 5000)) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate totalMarks is a reasonable number
    if (totalMarks < 1 || totalMarks > 100) {
      return new Response(JSON.stringify({ error: 'Invalid total marks value' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if this is a math question that might need the formula sheet
    const isMath = subject && (subject.toLowerCase().includes('math') || subject.toLowerCase().includes('m1') || subject.toLowerCase().includes('m2') || subject.toLowerCase().includes('m3') || subject.toLowerCase().includes('m4') || subject.toLowerCase().includes('m5') || subject.toLowerCase().includes('m6'));
    const formulaKeywords = ['trapezium', 'trapezoid', 'prism', 'volume', 'circle', 'circumference', 'radius', 'diameter', 'π', 'pi', 'quadratic', 'ax²', 'ax2', 'pythagoras', 'hypotenuse', 'right triangle', 'sin', 'cos', 'tan', 'sine rule', 'cosine rule', 'trigonometry', 'compound interest', 'probability', 'P(A', 'P(B'];
    
    const questionText = `${question} ${modelAnswer}`.toLowerCase();
    const needsFormulaSheet = isMath && formulaKeywords.some(keyword => questionText.includes(keyword.toLowerCase()));
    
    const formulaSheetNote = needsFormulaSheet ? 
      '\n\nIMPORTANT: If this question involves formulas, make sure to mention in your feedback that students can find help using the AQA GCSE Maths formula sheet. Include this as a helpful tip in your feedback.' : '';

    const prompt = `You are an expert GCSE examiner with extensive experience marking official AQA, Edexcel, OCR, and WJEC GCSE papers. You must mark this answer with the same precision and standards as official GCSE marking.

SUBJECT: ${subject || 'GCSE Subject'} - Apply GCSE-specific marking criteria

QUESTION: ${question}

STUDENT'S ANSWER: ${userAnswer}

MODEL ANSWER: ${modelAnswer}

MARKING CRITERIA:
${typeof markingCriteria === 'string' ? markingCriteria : markingCriteria.breakdown ? markingCriteria.breakdown.join('\n') : markingCriteria}

TOTAL MARKS: ${totalMarks}${formulaSheetNote}

GCSE MARKING STANDARDS - CRITICAL REQUIREMENTS:
1. GCSE CONTENT ACCURACY: Only award marks for content that is explicitly required by GCSE specifications. Reject irrelevant details not in the GCSE curriculum.
2. SUBJECT-SPECIFIC TERMINOLOGY: Require proper GCSE terminology. Award marks only when students use the correct scientific/subject-specific vocabulary expected at GCSE level.
3. MARK SCHEME PRECISION: Follow official GCSE mark scheme patterns:
   - 1 mark questions: One correct fact/identification (NO ADDITIONAL EXPLANATION NEEDED - if correct, award full marks without suggesting more detail)
   - 2 mark questions: Two correct points OR one explained point
   - 3-4 mark questions: Detailed explanation with correct use of terminology
   - 5-6 mark questions: Extended answer with multiple linked points
   - 8+ mark questions: Comprehensive answer with evaluation/analysis
4. MATHEMATICAL ACCURACY: 
   - For physics calculations, ALWAYS verify your own calculation before marking
   - Example: KE = 0.5 × mass × velocity² = 0.5 × 1200 × 25² = 0.5 × 1200 × 625 = 375,000 J
   - Accept equivalent mathematical answers but require proper units and significant figures as specified in GCSE mark schemes
   - If the student's numerical answer is correct, award full marks even if working is not shown (unless specifically required)
   - Double-check all formula applications and arithmetic
5. COMMAND WORDS: Strictly apply GCSE command word requirements:
   - "State/Give": Simple facts only (no explanation needed)
   - "Describe": Detailed account without explanation
   - "Explain": Reasons why/how something happens
   - "Evaluate/Assess": Judgment with supporting evidence
   - "Compare": Similarities AND differences
6. ASSESSMENT OBJECTIVES: Mark according to GCSE Assessment Objectives:
   - AO1: Knowledge and understanding
   - AO2: Application of knowledge
   - AO3: Analysis and evaluation
7. LEVEL OF DETAIL: Award marks only for the depth of answer appropriate to the mark allocation
8. REJECT OVER-COMPLICATION: Do not award marks for unnecessarily complex answers when simple GCSE-level responses are required

PREMIUM GCSE MARKING APPROACH:
- Cross-reference the student's answer against official GCSE mark schemes and specification requirements
- Only award marks for content that appears in actual GCSE syllabi and past papers
- Apply the same rigour as real GCSE examiners
- Identify specific curriculum points the student has demonstrated knowledge of
- Note any misconceptions or gaps in GCSE-level understanding

Your response must include:
1. MARKS_AWARDED: Exact number from 0 to ${totalMarks} based on official GCSE standards
2. FEEDBACK: Professional examiner feedback that:
   - Identifies which specific GCSE content points were correctly addressed
   - Explains what was missing for full marks (referencing GCSE requirements)
   - Notes correct use of GCSE terminology and concepts
   - Highlights any content beyond GCSE scope (and explains it's not required)
   - Provides specific guidance for improvement based on GCSE mark schemes
3. ASSESSMENT: Professional judgment like "Excellent GCSE standard", "Good understanding shown", "Needs more GCSE detail", or "Requires GCSE-level terminology"

Apply the highest standards of GCSE examining. Be precise, fair, and educationally valuable in your marking.

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
