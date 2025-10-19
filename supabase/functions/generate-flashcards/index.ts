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

🚨 CRITICAL RULE #1 - READ THIS FIRST 🚨
NEVER EVER use facts from different topics in your notes as multiple choice options.
ONLY create incorrect options by CHANGING DETAILS in the correct answer.

Example of CORRECT approach:
Question: "Compare mitosis and meiosis in terms of their outcomes. (2 marks)"
Correct: "Mitosis produces 2 identical cells for growth and repair, while meiosis produces 4 non-identical gametes for sexual reproduction."
✅ Option 1: "Mitosis produces 4 identical cells, while meiosis produces 2 non-identical gametes."
✅ Option 2: "Mitosis produces 2 non-identical gametes, while meiosis produces 4 identical cells for growth."
✅ Option 3: "Both mitosis and meiosis produce 2 identical cells for growth and sexual reproduction."
❌ NEVER: "Arteries have thick walls..." (different topic!)
❌ NEVER: "Diffusion is the movement..." (different topic!)
❌ NEVER: "Osmosis is the movement..." (different topic!)

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

⚠️ MULTIPLE CHOICE OPTIONS - MANDATORY PROCESS ⚠️

YOU MUST FOLLOW THIS EXACT PROCESS FOR EACH FLASHCARD:

STEP 1: Write the question
STEP 2: Write the correct answer
STEP 3: Create incorrect option 1 by taking the correct answer and changing ONE specific detail:
   - Change a number (2 → 4, four → two)
   - Swap a direction (up → down, left → right)
   - Switch a type (identical → non-identical, oxygenated → deoxygenated)
   - Reverse a process (growth → reproduction, transport water → transport sugar)
STEP 4: Create incorrect option 2 by changing A DIFFERENT detail in the correct answer
STEP 5: Create incorrect option 3 by changing ANOTHER detail in the correct answer
STEP 6: Put all 4 options in the "options" array (3 incorrect + 1 correct)

🚫 WHAT YOU MUST NEVER DO:
- NEVER copy sentences from other parts of the notes as options
- NEVER use facts about different topics as options
- NEVER use unrelated information as distractors
- EVERY incorrect option MUST be a modified version of the correct answer

MORE CORRECT EXAMPLES:

Question: "Define prokaryotic cells and provide an example. (1 mark)"
Correct answer: "Prokaryotic cells do not have a nucleus, and their DNA is free in the cytoplasm. An example is bacteria."
✅ Incorrect option 1: "Prokaryotic cells have a nucleus, and their DNA is inside it. An example is bacteria." (changed: added nucleus)
✅ Incorrect option 2: "Prokaryotic cells do not have a nucleus, and their DNA is in a membrane. An example is yeast." (changed: membrane + yeast)
✅ Incorrect option 3: "Prokaryotic cells have multiple nuclei with DNA inside them. An example is fungi." (changed: multiple nuclei + fungi)
❌ NEVER: "Arteries have thick walls to withstand pressure..." (WRONG - different topic!)
❌ NEVER: "Xylem transports water from roots to leaves..." (WRONG - different topic!)

Question: "Compare mitosis and meiosis in terms of their outcomes. (2 marks)"
Correct answer: "Mitosis produces 2 identical cells for growth and repair, while meiosis produces 4 non-identical gametes for sexual reproduction."
✅ Incorrect option 1: "Mitosis produces 4 identical cells for reproduction, while meiosis produces 2 non-identical cells for growth." (swapped numbers + purposes)
✅ Incorrect option 2: "Mitosis produces 2 non-identical gametes for reproduction, while meiosis produces 4 identical cells for repair." (swapped identical/non-identical + purposes)
✅ Incorrect option 3: "Both mitosis and meiosis produce 2 identical cells for growth and sexual reproduction." (made them the same)
❌ NEVER: "Arteries have thick walls..." (WRONG - different topic!)
❌ NEVER: "Diffusion is the movement of particles..." (WRONG - different topic!)
❌ NEVER: "Osmosis is the movement of water..." (WRONG - different topic!)

Question: "Describe the functions of xylem and phloem in plants. (2 marks)"
Correct answer: "Xylem transports water and minerals upwards from roots to leaves, while phloem transports sugars downwards from leaves to other parts."
✅ Incorrect option 1: "Xylem transports sugars upwards from leaves, while phloem transports water downwards to roots." (swapped what they transport)
✅ Incorrect option 2: "Both xylem and phloem transport water and minerals in the same upward direction." (made them the same)
✅ Incorrect option 3: "Xylem transports minerals downwards to roots, while phloem transports water upwards to leaves." (reversed directions + swapped substances)
❌ NEVER: "The heart consists of four chambers..." (WRONG - different topic!)
❌ NEVER: "Mitosis produces 2 identical cells..." (WRONG - different topic!)

REMEMBER: Every incorrect option is just the correct answer with specific details changed!

Response format must be valid JSON with options array:
{
  "flashcards": [
    {
      "front": "Clear, specific question",
      "back": "The correct answer",
      "options": [
        "Incorrect variation 1 with changed details",
        "Incorrect variation 2 with changed details",
        "Incorrect variation 3 with changed details",
        "The correct answer (must match 'back' field exactly)"
      ]
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
