
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
    // Create Supabase client - it will automatically handle auth when called via supabase.functions.invoke()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );

    // Optional: Verify user is authenticated (but don't block on it for AI marking)
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('User authenticated:', user?.id || 'No user');
    } else {
      console.log('No auth header found, proceeding with AI marking anyway');
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

    // Normalize mathematical answers for better comparison
    const normalizeMathAnswer = (answer: string): string => {
      if (!answer) return answer;
      const trimmed = answer.trim();
      
      // Check if it's a simple fraction like "1/1", "2/2", "4/4"
      const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
      if (fractionMatch) {
        const numerator = parseInt(fractionMatch[1]);
        const denominator = parseInt(fractionMatch[2]);
        if (denominator !== 0 && numerator === denominator) {
          return '1'; // Simplify fractions like 1/1, 2/2, etc. to just 1
        }
      }
      
      return answer;
    };

    const normalizedUserAnswer = normalizeMathAnswer(userAnswer);

    // Validate required fields
    if (!question || !normalizedUserAnswer || !totalMarks) {
      return new Response(JSON.stringify({ error: 'Missing required fields: question, userAnswer, totalMarks' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if answer is substantial enough to be marked
    const trimmedAnswer = normalizedUserAnswer.trim();
    
    // Check if this is a multiple choice question (has options like a), b), c), d))
    const isMultipleChoice = /[a-d]\)\s/.test(question);
    
    // Check if question requires explanation/description (not just a numerical answer)
    const questionLower = question.toLowerCase();
    const requiresExplanation = /\b(explain|describe|state the equation|distinguish|define|discuss|compare|evaluate|justify|suggest why)\b/.test(questionLower);
    
    // Check if this is a numerical/mathematical answer (contains numbers, decimals, operators, etc.)
    // But if it's just a single digit with no context, it's not valid for explanation questions
    const isPureNumber = /^[\d.]+$/.test(trimmedAnswer);
    const isNumericalAnswer = /[\d.]/.test(trimmedAnswer) && trimmedAnswer.length >= 1 && !requiresExplanation;
    
    // For multiple choice, allow single letter answers
    // For numerical answers (calculations, rounding, etc.), allow pure numerical responses
    // For explanation questions, reject pure numbers as they don't demonstrate understanding
    // For text answers, require at least some alphabetic content
    if (!isMultipleChoice && (requiresExplanation && isPureNumber)) {
      return new Response(JSON.stringify({ 
        marksAwarded: 0,
        feedback: "Your answer is too brief. Please provide a more detailed response that demonstrates your understanding.",
        assessment: "Insufficient Detail"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!isMultipleChoice && !isNumericalAnswer && (trimmedAnswer.length < 2 || !/[a-zA-Z]/.test(trimmedAnswer))) {
      return new Response(JSON.stringify({ 
        marksAwarded: 0,
        feedback: "Your answer is too brief. Please provide a more detailed response that demonstrates your understanding.",
        assessment: "Insufficient Detail"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Basic validation for all answers - check for completely empty/invalid answers
    // Allow purely numerical answers OR answers with alphanumeric characters
    if (trimmedAnswer.length === 0 || (!/[a-zA-Z0-9]/.test(trimmedAnswer) && !/^[\d\s.+\-*/=()×÷^]+$/.test(trimmedAnswer))) {
      return new Response(JSON.stringify({ 
        marksAwarded: 0,
        feedback: "Please provide an answer to the question.",
        assessment: "No Answer Provided"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input lengths to prevent abuse
    if (question.length > 5000 || normalizedUserAnswer.length > 5000 || (modelAnswer && modelAnswer.length > 5000)) {
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

STUDENT'S ANSWER: ${normalizedUserAnswer}

MODEL ANSWER: ${modelAnswer}

MARKING CRITERIA:
${typeof markingCriteria === 'string' ? markingCriteria : markingCriteria.breakdown ? markingCriteria.breakdown.join('\n') : markingCriteria}

TOTAL MARKS: ${totalMarks}${formulaSheetNote}

CRITICAL MARKING REQUIREMENT - BASE FEEDBACK ONLY ON WHAT WAS ACTUALLY WRITTEN:
🚨 ABSOLUTELY CRITICAL: Your feedback must ONLY refer to what the student actually wrote. DO NOT make assumptions about working, steps, or methods they didn't show. DO NOT suggest they showed working when they only provided a final answer. Be completely accurate about what was actually submitted.

EQUIVALENT TERMINOLOGY AND MATHEMATICAL FORMS ACCEPTANCE:
🎯 IMPORTANT: Accept scientifically accurate alternative terminology and mathematically equivalent answers:
- "Shells" = "Energy levels" = "Electron shells" (Chemistry/Physics)
- "Orbits" = "Orbitals" when used in basic GCSE context
- "Speed" = "Velocity" in basic motion contexts  
- "Weight" = "Force due to gravity" = "Gravitational force"
- "Dissolves" = "Goes into solution" = "Forms a solution"
- "Breaks down" = "Decomposes" = "Decomposes into"
- "Increases" = "Goes up" = "Rises" = "Gets bigger/larger"
- Accept equivalent mathematical expressions (e.g., "3x + 2x = 5x" vs "2x + 3x = 5x")
- Accept equivalent units (e.g., "m/s" = "metres per second" = "meters per second")
- CRITICAL: Accept equivalent fraction forms (e.g., "1/1" = "1", "2/2" = "1", "4/4" = "1", "6/3" = "2")
- Accept simplified vs unsimplified fractions if mathematically equivalent (e.g., "2/4" = "1/2")
- Accept decimal equivalents of fractions (e.g., "0.5" = "1/2")
Do NOT penalize students for using correct alternative scientific terminology or mathematically equivalent forms that demonstrate the same understanding.

GCSE MARKING STANDARDS - CRITICAL REQUIREMENTS:
1. ACCURACY OF FEEDBACK: Base all feedback strictly on the actual student submission. If they only wrote a final answer, acknowledge that. If they showed working, comment on the working shown.
2. GCSE CONTENT ACCURACY: Only award marks for content that is explicitly required by GCSE specifications. Reject irrelevant details not in the GCSE curriculum.
3. SUBJECT-SPECIFIC TERMINOLOGY: Require proper GCSE terminology. Award marks only when students use the correct scientific/subject-specific vocabulary expected at GCSE level.
4. MARK SCHEME PRECISION: Follow official GCSE mark scheme patterns:
   - 1 mark questions: One correct fact/identification (NO ADDITIONAL EXPLANATION NEEDED - if correct, award full marks without suggesting more detail)
   - 2 mark questions: Two correct points OR one explained point
   - 3-4 mark questions: Detailed explanation with correct use of terminology
   - 5-6 mark questions: Extended answer with multiple linked points
   - 8+ mark questions: Comprehensive answer with evaluation/analysis
5. MATHEMATICAL ACCURACY: 
   - CRITICAL: For ALL mathematical questions, ALWAYS verify the correct answer yourself BEFORE marking the student's response
   - Work through the mathematical problem step-by-step to confirm the correct answer
   - NEVER declare a student's mathematical answer as incorrect without first verifying what the correct answer actually is
   - For algebraic expressions, check if the student's answer is mathematically equivalent to the correct form
   - Example: if asked to expand (2x + 3)² - (x - 1)(x + 4), work it out: (2x + 3)² = 4x² + 12x + 9, (x - 1)(x + 4) = x² + 3x - 4, so the answer is 4x² + 12x + 9 - (x² + 3x - 4) = 3x² + 9x + 13
   - NOTATION ACCURACY: Reject incorrect mathematical notation like "10^7 - -3" (should be "10^(7+3)" or "10^10")
   - CALCULATION VERIFICATION: Double-check all arithmetic operations for accuracy
   - SCIENTIFIC NOTATION: Ensure proper format for standard form (e.g., 3.2 × 10^7 not 32 × 10^6)
   - Accept equivalent mathematical answers but require proper units and significant figures as specified in GCSE mark schemes
   - 🚨🚨🚨 CHEMISTRY SPECIFIC RULE: For CHEMISTRY questions, students can receive FULL marks for correct answers WITHOUT working out. Chemistry does not require working to be shown for full marks - just the correct answer is sufficient.
   - 🚨🚨🚨 CRITICAL ALTERNATIVE METHODS RULE (MATHS/PHYSICS): Students can solve problems using DIFFERENT valid mathematical methods. If a student uses an alternative approach (e.g., calculating 2^5 as 32, then 2^-2 as 0.25, then applying BODMAS) that is mathematically correct and reaches the right answer, this is COMPLETELY ACCEPTABLE. Award FULL marks.
   - 🚨🚨🚨 CRITICAL WORKING MARKS RULE (MATHS/PHYSICS): If the student's final numerical answer is CORRECT and they have shown ANY valid working (calculations, steps, method), award FULL marks. DO NOT deduct marks for using a different method than the model answer. Alternative valid methods that reach the correct answer demonstrate FULL understanding.
   - ACCEPT ALL VALID MATHEMATICAL APPROACHES: Whether a student uses index laws (2^5-2-4) OR calculates each power separately (2^5=32, 2^-2=0.25, 2^4=16) and then applies BODMAS - BOTH ARE CORRECT. Award full marks for either approach if the final answer is correct.
   - DO NOT penalize students for informal working notation or layout - focus on mathematical correctness and validity of the method
   - If a student shows ANY calculation process (even if different from the model answer) and arrives at the correct answer, this demonstrates full understanding
   - For MATHS/PHYSICS: Only deduct marks if working is COMPLETELY missing when explicitly required by the question, OR if the working contains mathematical errors
   - For CHEMISTRY: Working is NOT required for full marks - correct answer alone is sufficient
   - Double-check all formula applications and arithmetic before making any marking decisions
   - FACTUAL ACCURACY: Verify all scientific facts, formulas, and constants are correct
6. COMMAND WORDS: Strictly apply GCSE command word requirements:
   - "State/Give": Simple facts only (no explanation needed)
   - "Describe": Detailed account without explanation
   - "Explain": Reasons why/how something happens
   - "Evaluate/Assess": Judgment with supporting evidence
   - "Compare": Similarities AND differences
7. ASSESSMENT OBJECTIVES: Mark according to GCSE Assessment Objectives:
   - AO1: Knowledge and understanding
   - AO2: Application of knowledge
   - AO3: Analysis and evaluation
8. LEVEL OF DETAIL: Award marks only for the depth of answer appropriate to the mark allocation
9. REJECT OVER-COMPLICATION: Do not award marks for unnecessarily complex answers when simple GCSE-level responses are required

PREMIUM GCSE MARKING APPROACH:
- Cross-reference the student's answer against official GCSE mark schemes and specification requirements
- Only award marks for content that appears in actual GCSE syllabi and past papers
- Apply the same rigour as real GCSE examiners
- Identify specific curriculum points the student has demonstrated knowledge of
- Note any misconceptions or gaps in GCSE-level understanding
- Be completely honest about what the student actually submitted vs what they should have included

Your response must include:
1. MARKS_AWARDED: Exact number from 0 to ${totalMarks} based on official GCSE standards
2. FEEDBACK: Encouraging, student-friendly feedback that:
   - Uses positive, supportive language that motivates the student
   - Is based ONLY on what the student actually wrote (never assume working that wasn't shown)
   - Celebrates what the student got right first, then gently explains areas for improvement
   - Uses simple, clear language that any GCSE student can understand
   - Avoids jargon and explains technical terms when necessary
   - Provides specific, actionable suggestions for improvement
   - Ends on an encouraging note that builds confidence
   - If only a final answer was given, acknowledge this positively while suggesting showing working
3. ASSESSMENT: Encouraging judgment like "Great work!", "Good effort - almost there!", "You're on the right track!", or "Keep practicing - you've got this!"

Apply the highest standards of GCSE examining. Be precise, fair, and educationally valuable in your marking. Most importantly, be completely accurate about what the student actually submitted.

TONE AND LANGUAGE REQUIREMENTS:
- Use encouraging, positive language throughout
- Start feedback with something the student did well (even if partial) 
- Use phrases like "Great start!", "You're on the right track!", "Well done for..."
- Explain things simply - imagine talking to a friend who's learning
- Avoid harsh criticism - instead use "Let's work on..." or "Next time, try..."
- End with motivation like "Keep it up!", "You've got this!", or "Practice makes perfect!"

Respond in this exact JSON format:
{
  "marksAwarded": [number],
  "feedback": "[warm, encouraging feedback that celebrates successes and gently guides improvement - use simple, friendly language]",
  "assessment": "[positive, motivating assessment that builds confidence]"
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
      // Fallback response if JSON parsing fails - only give marks for substantial answers
      const isSubstantialAnswer = normalizedUserAnswer.trim().length >= 3 && 
        normalizedUserAnswer.trim().split(/\s+/).length >= 1 && 
        /[a-zA-Z]/.test(normalizedUserAnswer.trim());
      
      markingResult = {
        marksAwarded: isSubstantialAnswer ? Math.round(totalMarks * 0.3) : 0,
        feedback: isSubstantialAnswer 
          ? "Great effort writing an answer! While AI marking isn't available right now, you've shown you're thinking about the topic. Keep practicing to build your confidence!"
          : "I can see you're trying, but your answer needs more detail to show your understanding. Try explaining your thoughts in a few more words - you've got this!",
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
