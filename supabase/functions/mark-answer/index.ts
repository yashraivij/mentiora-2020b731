
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

    // Check if answer is clearly inadequate (single letters, numbers, or very short responses)
    const trimmedAnswer = userAnswer.trim();
    const isInadequateAnswer = trimmedAnswer.length <= 2 || /^[a-zA-Z0-9]$/.test(trimmedAnswer);
    
    let prompt;
    
    if (isInadequateAnswer) {
      // Special handling for clearly inadequate answers
      prompt = `You are marking a GCSE ${subject || 'subject'} question. 

QUESTION: ${question}

STUDENT'S ACTUAL ANSWER: "${userAnswer}"

MODEL ANSWER: ${modelAnswer}

TOTAL MARKS: ${totalMarks}

CRITICAL INSTRUCTION: The student has provided an extremely brief answer ("${userAnswer}"). You must:

1. Award 0 marks (this type of answer cannot meet GCSE standards)
2. Be accurate in your feedback - mention exactly what they wrote: "${userAnswer}"
3. Do NOT discuss content they didn't provide
4. Do NOT make assumptions about what they might have meant
5. Explain what type of answer was expected for the marks available

Respond in this exact JSON format:
{
  "marksAwarded": 0,
  "feedback": "Your answer '${userAnswer}' does not provide sufficient detail to meet GCSE marking criteria. For ${totalMarks} marks, you need to provide a detailed response that addresses the question requirements. Please ensure you write complete sentences and include relevant subject-specific terminology.",
  "assessment": "Insufficient detail provided"
}`;
    } else {
      // Normal detailed marking for substantial answers
      prompt = `You are an expert GCSE examiner marking a ${subject || 'GCSE subject'} question with absolute precision.

QUESTION: ${question}

STUDENT'S ACTUAL ANSWER: ${userAnswer}

MODEL ANSWER: ${modelAnswer}

MARKING CRITERIA: ${typeof markingCriteria === 'string' ? markingCriteria : markingCriteria.breakdown ? markingCriteria.breakdown.join('\n') : markingCriteria}

TOTAL MARKS: ${totalMarks}${formulaSheetNote}

🚨 CRITICAL MARKING RULES:
1. ONLY evaluate what the student actually wrote - quote their exact words when giving feedback
2. Do NOT assume working, steps, or explanations they didn't provide  
3. Do NOT discuss concepts they never mentioned
4. Be precise about what they included vs what was missing
5. For mathematical questions: verify the correct answer yourself before marking

GCSE MARKING STANDARDS:
- Award marks only for GCSE-level content that directly answers the question
- Use proper GCSE terminology requirements for each subject
- Apply official mark scheme logic based on the marks available
- Be fair but rigorous - this is a real GCSE standard examination

Your feedback must be completely accurate about their actual submission.

Respond in this exact JSON format:
{
  "marksAwarded": [number from 0 to ${totalMarks}],
  "feedback": "[Based ONLY on what they actually wrote - quote their exact words]",
  "assessment": "[Brief professional judgment]"
}`;
    }

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

    // Parse the JSON response with enhanced validation
    let markingResult;
    try {
      markingResult = JSON.parse(aiResponse);
      
      // Validate the response structure
      if (!markingResult.hasOwnProperty('marksAwarded') || 
          !markingResult.hasOwnProperty('feedback') || 
          !markingResult.hasOwnProperty('assessment')) {
        throw new Error('Invalid response structure from AI');
      }
      
      // Additional validation for inadequate answers
      if (isInadequateAnswer && markingResult.marksAwarded > 0) {
        console.warn('AI awarded marks for inadequate answer, correcting to 0');
        markingResult.marksAwarded = 0;
        markingResult.feedback = `Your answer "${userAnswer}" does not provide sufficient detail to meet GCSE marking criteria. For ${totalMarks} marks, you need to provide a detailed response that addresses the question requirements. Please ensure you write complete sentences and include relevant subject-specific terminology.`;
        markingResult.assessment = "Insufficient detail provided";
      }
      
      // Validate that feedback doesn't discuss content not in the user's answer
      const userContent = userAnswer.toLowerCase();
      const feedback = markingResult.feedback.toLowerCase();
      
      // Check for common signs the AI is hallucinating content
      const suspiciousPatterns = [
        'you mentioned',
        'you discussed', 
        'you explained',
        'your explanation of',
        'you correctly identified',
        'you stated that',
        'your answer shows understanding of',
        'you demonstrated knowledge'
      ];
      
      const containsSuspiciousContent = suspiciousPatterns.some(pattern => 
        feedback.includes(pattern) && !userContent.includes(pattern.split(' ')[1])
      );
      
      if (containsSuspiciousContent && userContent.length < 50) {
        console.warn('AI feedback appears to reference content not in user answer, providing corrected feedback');
        markingResult.marksAwarded = Math.min(markingResult.marksAwarded, 1); // Cap at 1 mark for suspicious cases
        markingResult.feedback = `Based on your answer "${userAnswer}", more detail is needed to meet the GCSE marking criteria for this ${totalMarks}-mark question. Please provide a more comprehensive response that addresses all parts of the question with relevant subject-specific terminology.`;
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Improved fallback response for inadequate answers
      if (isInadequateAnswer) {
        markingResult = {
          marksAwarded: 0,
          feedback: `Your answer "${userAnswer}" does not provide sufficient detail to meet GCSE marking criteria. For ${totalMarks} marks, you need to provide a detailed response that addresses the question requirements.`,
          assessment: "Insufficient detail provided"
        };
      } else {
        markingResult = {
          marksAwarded: 0, // More conservative fallback
          feedback: "There was an error processing your answer. Please ensure your response is detailed and addresses all parts of the question.",
          assessment: "Processing Error"
        };
      }
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
