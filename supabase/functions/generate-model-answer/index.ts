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

    const { question, subjectId, marks } = await req.json();

    if (!question || !subjectId || !marks) {
      return new Response(JSON.stringify({ error: 'Missing required fields: question, subjectId, marks' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input lengths to prevent abuse
    if (question.length > 5000 || subjectId.length > 100) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a GCSE-specific prompt for generating an accurate model answer
    const systemPrompt = `You are an expert GCSE examiner with extensive knowledge of official GCSE specifications for ${subjectId}. Create a model answer that would achieve full marks according to real GCSE marking criteria.

GCSE MODEL ANSWER REQUIREMENTS:
1. SPECIFICATION ACCURACY: Only include content that is explicitly in the GCSE ${subjectId} specification
2. APPROPRIATE LEVEL: Write at exactly the right level for GCSE students (ages 14-16) - not undergraduate level
3. CORRECT TERMINOLOGY: Use only the specific terminology required by GCSE mark schemes
4. PROPER STRUCTURE: Follow the answer structure that GCSE examiners expect for ${marks} mark questions
5. REALISTIC LENGTH: Match the length that would realistically earn ${marks} marks in a GCSE exam
6. COMMAND WORD COMPLIANCE: Respond exactly as the command word requires (explain/describe/evaluate etc.)
7. NO IRRELEVANT CONTENT: Exclude university-level details or concepts not taught at GCSE
8. MARK DISTRIBUTION: Ensure the answer addresses all markable points for a ${marks} mark question
9. PLAIN TEXT ONLY: No LaTeX, complex formatting, or symbols not available to GCSE students
10. AUTHENTIC STYLE: Write exactly as a well-prepared GCSE student would write
11. LINE RESTRICTION COMPLIANCE: For English Language questions, only refer to content from the specific lines mentioned in the question
12. PARAGRAPH FORMAT: For English Language analysis questions, write in flowing paragraph format, NOT numbered points

CRITICAL ACCURACY REQUIREMENTS:
- MATHEMATICAL PRECISION: For Mathematics questions, ensure all calculations are 100% correct with proper notation
- NO CALCULATION ERRORS: Double-check all arithmetic, algebra, and numerical operations
- PROPER MATHEMATICAL NOTATION: Use correct symbols, avoid notation errors like "10^7 - -3" (should be "10^(7+3)" or "10^10")
- SCIENTIFIC ACCURACY: For Science questions, ensure all facts, formulas, and processes are scientifically correct
- VERIFICATION: Always verify calculations and facts before including them in the answer

CRITICAL FOR ENGLISH LANGUAGE:
- If the question asks about "lines 1 to 3" or "lines 4 to 6", ONLY use content from those specific lines
- Do NOT include content from other parts of the text
- For language analysis questions, write in paragraph format with flowing analysis
- Avoid numbered points or bullet lists for English Language answers

SUBJECT: ${subjectId} GCSE
MARK ALLOCATION: ${marks} marks

Generate the perfect GCSE-level answer that would appear in official mark schemes. Ensure complete accuracy in all calculations, facts, and content.`;

    const userPrompt = `Question: ${question}

Marks available: ${marks}

Write the perfect model answer that would achieve full marks:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent, accurate answers
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const modelAnswer = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ modelAnswer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-model-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});