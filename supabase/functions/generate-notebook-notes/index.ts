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

    const requestData = await req.json();
    const { questionText, userAnswer, modelAnswer, markingCriteria, subject, topic, subtopic, marksLost } = requestData;

    // Validate required fields
    if (!questionText || !userAnswer || !subject) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input lengths to prevent abuse
    if (questionText.length > 5000 || userAnswer.length > 5000 || (modelAnswer && modelAnswer.length > 5000)) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating notebook notes for:', { subject, topic, marksLost });

    const prompt = `You are an elite GCSE examiner and tutor creating comprehensive revision notes for a student who lost marks. Your notes must be crystal-clear, exam-focused, and help students achieve Grade 9.

QUESTION: ${questionText}
STUDENT ANSWER: ${userAnswer}
MODEL ANSWER: ${modelAnswer}
MARKING CRITERIA: ${markingCriteria}
MARKS LOST: ${marksLost}
SUBJECT: ${subject}
TOPIC: ${topic}
SUBTOPIC: ${subtopic}

Create comprehensive, Grade 9-level revision notes in this EXACT format. Start ALL sentences with capital letters:

1. WHAT TRIPPED ME UP (1-2 lines): [Clear diagnosis of the specific mistake - be precise about what concept, calculation, or understanding was wrong]

2. FIX IN ONE SENTENCE: [The single most important rule, principle, or method that would have prevented losing these marks - make it actionable]

3. BULLETPROOF NOTES (6-8 comprehensive bullets):
• **[Key definition or principle]**: [Full explanation with context - why it matters for exams]
• **[Essential equation or formula]**: [In symbols AND words, with units clearly stated and what each symbol represents]
• **[Step-by-step method]**: [The exact approach to use for this type of question - numbered steps if needed]
• **[Common pitfall to avoid]**: [What students typically get wrong → What to do instead]
• **[Mark scheme insight]**: [What examiners specifically look for - keywords, units, significant figures, etc.]
• **[Memory technique]**: [Acronym, analogy, or visual aid to remember this concept]
• **[Link to other topics]**: [How this connects to related GCSE topics - helps with context questions]
• **[Exam technique tip]**: [Command word interpretation or how to structure answers for full marks]

4. MINI WORKED EXAMPLE (3-6 lines):
[A clear, step-by-step example showing the CORRECT method with proper working out]
[Show calculations with units, clearly label steps, highlight the key technique]
[Use realistic GCSE-level numbers and include final answer with correct units]

5. KEYWORDS: [8-12 essential exam keywords and technical terms that appear in mark schemes, separated by commas]

6. NEXT STEP: [Specific actionable advice - which exact type of questions to practice next, which topic to revise, or which skill to develop]

CRITICAL ACCURACY REQUIREMENTS:
- MATHEMATICAL PRECISION: Triple-check all calculations - no arithmetic errors allowed
- PROPER NOTATION: Use correct mathematical symbols (e.g., × not x, proper fraction notation, correct indices)
- SCIENTIFIC ACCURACY: Every fact must be 100% accurate to GCSE specifications
- UNITS: Always include correct units in equations and answers
- SIGNIFICANT FIGURES: Use appropriate significant figures (usually 2-3 for GCSE)
- MARK SCHEME ALIGNMENT: Use exact terminology that appears in actual GCSE mark schemes
- EXAM BOARD STANDARDS: Ensure content matches ${subject} GCSE specification requirements

Style requirements:
- Write as a top-performing GCSE student explaining to their friend
- Be comprehensive but concise - every word must add value
- Use **bold** for all key terms and definitions
- Include specific numbers, values, and examples (not vague statements)
- Format equations clearly: "Force (N) = Mass (kg) × Acceleration (m/s²)"
- For pitfalls use: "❌ Don't: [wrong approach] → ✓ Do: [correct approach]"
- Make it scannable - students should be able to revise this the night before the exam
- ALWAYS start sentences with capital letters
- Focus on WHAT to do, HOW to do it, and WHY it matters for marks

Generate notes that will help this student never lose marks on this topic again:`;

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
            content: 'You are an elite GCSE examiner and tutor with 15+ years of experience. You create the most comprehensive, accurate, and exam-focused revision notes that help students achieve Grade 9. Your notes are known for being thorough yet clear, with perfect accuracy and deep understanding of mark schemes. You never make calculation errors and always verify your work.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedNotes = data.choices[0].message.content;

    console.log('Generated notes:', generatedNotes);

    // Parse the generated notes into structured format
    const parseNotes = (notes: string) => {
      const sections = notes.split(/\d+\.\s+/);
      
      let whatTrippedUp = '';
      let fixSentence = '';
      let bulletproofNotes: string[] = [];
      let miniExample = '';
      let keywords: string[] = [];
      let nextStep = '';

      sections.forEach(section => {
        if (section.includes('WHAT TRIPPED ME UP')) {
          whatTrippedUp = section.split('WHAT TRIPPED ME UP')[1]?.split('\n')[0]?.replace(/[:\(\)]/g, '').trim() || '';
        }
        if (section.includes('FIX IN ONE SENTENCE')) {
          fixSentence = section.split('FIX IN ONE SENTENCE')[1]?.split('\n')[0]?.replace(/[:\(\)]/g, '').trim() || '';
        }
        if (section.includes('BULLETPROOF NOTES')) {
          const notesSection = section.split('BULLETPROOF NOTES')[1];
          if (notesSection) {
            bulletproofNotes = notesSection
              .split('\n')
              .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
              .map(line => line.replace(/^[•\-]\s*/, '').trim())
              .filter(note => note.length > 0);
          }
        }
        if (section.includes('MINI WORKED EXAMPLE')) {
          const exampleSection = section.split('MINI WORKED EXAMPLE')[1];
          if (exampleSection) {
            miniExample = exampleSection.split('\n').slice(0, 5).join('\n').replace(/[:\(\)]/g, '').trim();
          }
        }
        if (section.includes('KEYWORDS')) {
          const keywordsSection = section.split('KEYWORDS')[1];
          if (keywordsSection) {
            keywords = keywordsSection
              .split('\n')[0]
              .replace(/[:\(\)\[\]]/g, '')
              .split(',')
              .map(kw => kw.trim())
              .filter(kw => kw.length > 0);
          }
        }
        if (section.includes('NEXT STEP')) {
          nextStep = section.split('NEXT STEP')[1]?.split('\n')[0]?.replace(/[:\(\)]/g, '').trim() || '';
        }
      });

      return {
        whatTrippedUp: whatTrippedUp || 'Insufficient understanding of key concepts',
        fixSentence: fixSentence || 'Review the fundamental principles and practice similar questions',
        bulletproofNotes: bulletproofNotes.length > 0 ? bulletproofNotes : ['Review core concepts', 'Practice similar questions', 'Focus on key definitions'],
        miniExample: miniExample || 'Practice examples available in textbook',
        keywords: keywords.length > 0 ? keywords : [topic || subject, subtopic || subject],
        nextStep: nextStep || 'Practice more questions on this topic'
      };
    };

    const parsedNotes = parseNotes(generatedNotes);

    return new Response(JSON.stringify({
      success: true,
      notes: parsedNotes,
      rawNotes: generatedNotes
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating notebook notes:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});