import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notes, subject, examBoard, enhance } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating flashcards for:', { subject, examBoard, enhance, notesLength: notes?.length });

    // Create system prompt based on enhance toggle
    let systemPrompt = `You are an expert GCSE study assistant specializing in creating effective flashcards for revision.

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 10-15 flashcards from the provided notes
2. Each flashcard must have a short, clear QUESTION and a concise ANSWER
3. Questions should be exam-style and test key knowledge
4. Answers must be brief but complete (1-3 sentences max)
5. Focus on facts, definitions, processes, and key concepts
6. Make questions varied: definitions, examples, processes, applications
7. Ensure questions are specific and testable

ANSWER FORMATTING RULES:
8. Format answers naturally for readability and comprehension
9. Use bullet points (•) ONLY when they genuinely help organize multiple distinct points or examples
10. For single concepts, definitions, or explanations, use well-structured paragraphs with clear spacing
11. Break up longer explanations into short, digestible sentences with line breaks for readability
12. Choose the format that best suits the content: bullet points for lists/steps, paragraphs for explanations/definitions

MULTIPLE CHOICE OPTIONS - CRITICAL REQUIREMENTS:
13. ALL incorrect options MUST be about the EXACT SAME TOPIC as the question - NO exceptions
14. FORBIDDEN: Using content from notes about different topics/concepts as incorrect options
15. Example: If question is about "prokaryotic vs eukaryotic cells", ALL options must be about cell structure/types
   - CORRECT: Options about cell walls, organelles, DNA location, cell membrane differences
   - WRONG: Options about digestive system, photosynthesis, mitosis - these are DIFFERENT TOPICS
16. Incorrect options should be:
   - Common student misconceptions about the SAME concept
   - Similar/confusing terms from the SAME topic area
   - Partially correct statements about the SAME subject matter
17. Every option must be plausible to someone studying THIS SPECIFIC TOPIC
18. Test: Read the question, then each option - does the option make sense as a potential answer? If not, it's wrong

Response format must be valid JSON:
{
  "flashcards": [
    {
      "front": "Clear, specific question",
      "back": "Naturally formatted answer that's easy to read and understand"
    }
  ]
}`;

    if (enhance) {
      systemPrompt += `\n\nENHANCED MODE - EXAM BOARD SPECIFIC:
CRITICAL: Stay 100% faithful to the user's notes content. Do NOT add unrelated information.

Enhancement Rules:
- Transform questions into exam-style command words (explain, describe, evaluate, state, etc.)
- Add mark allocations where appropriate (e.g., "(2 marks)")
- Use ${examBoard} ${subject} specification terminology for the SAME concepts in the notes
- Expand abbreviated points from notes into clearer, mark-earning detail
- Structure answers as examiners expect, but only using content from the provided notes
- Add precision using mark scheme language for the topics actually covered in the notes

FORBIDDEN: Adding new topics, case studies, or examples not mentioned in the user's notes`;
    }

    const userPrompt = `Subject: ${subject} (${examBoard})
Enhancement: ${enhance ? 'ENABLED - Make exam-board specific' : 'DISABLED - Keep general'}

Student Notes:
"""
${notes}
"""

Generate flashcards that test the key knowledge from these notes. Make them effective for active recall and exam preparation.`;

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
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('OpenAI response content:', content);

    // Parse the JSON response
    let flashcards;
    try {
      const parsed = JSON.parse(content);
      flashcards = parsed.flashcards;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.log('Raw content:', content);
      
      // Fallback: try to extract flashcards from text
      const lines = content.split('\n').filter(line => line.trim());
      flashcards = [];
      
      for (let i = 0; i < lines.length - 1; i += 2) {
        if (lines[i] && lines[i + 1]) {
          flashcards.push({
            front: lines[i].replace(/^\d+\.\s*/, '').replace(/^Q:\s*/, ''),
            back: lines[i + 1].replace(/^A:\s*/, '')
          });
        }
      }
    }

    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('No valid flashcards generated');
    }

    console.log(`Generated ${flashcards.length} flashcards`);

    return new Response(JSON.stringify({ flashcards }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate flashcards' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});