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
    const { 
      questionText, 
      userAnswer, 
      modelAnswer, 
      markingCriteria, 
      subject, 
      topic, 
      subtopic, 
      marksLost 
    } = await req.json();

    console.log('Generating notebook notes for:', { subject, topic, subtopic, marksLost });

    const prompt = `You are an expert GCSE tutor creating concise revision notes for a Grade 9 student who lost marks on a question.

QUESTION: ${questionText}
STUDENT ANSWER: ${userAnswer}
MODEL ANSWER: ${modelAnswer}
MARKING CRITERIA: ${markingCriteria}
MARKS LOST: ${marksLost}
SUBJECT: ${subject}
TOPIC: ${topic}
SUBTOPIC: ${subtopic}

Create ultra-clear, Grade 9-level revision notes in this EXACT format:

1. WHAT TRIPPED ME UP (1 line): [Ultra-short diagnosis of the main mistake]

2. FIX IN ONE SENTENCE: [The one rule that would have saved me marks]

3. BULLETPROOF NOTES (3-5 short bullets):
• [Key fact/definition with bold terms]
• [Essential equation in symbols and words]
• [Common mistake to avoid]
• [Memory aid or comparison]

4. MINI WORKED EXAMPLE (2-4 lines max):
[Brief example showing correct method]

5. KEYWORDS: [5-8 key terms separated by commas]

6. NEXT STEP: [1 sentence suggesting what to practice next]

Style guide:
- Grade 9 explaining to Grade 9 tone
- Zero fluff, maximum clarity
- Bold key definitions
- Include units in equations
- Use "Don't do this → ... / Do this → ..." for pitfalls
- Keep it exam-focused and practical

Generate the notes now:`;

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
            content: 'You are an expert GCSE tutor who creates the most effective, concise revision notes for students who lost marks. Your notes are famous for being Grade 9 level but incredibly clear and practical.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
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
        keywords: keywords.length > 0 ? keywords : [topic, subtopic],
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