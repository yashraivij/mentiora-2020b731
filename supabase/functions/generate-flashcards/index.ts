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

⚠️ MULTIPLE CHOICE OPTIONS - ABSOLUTE REQUIREMENTS ⚠️

13. For EVERY flashcard, you MUST include an "options" array with exactly 4 items:
    - 3 incorrect options (variations of the correct answer with changed details)
    - 1 correct answer (same as the "back" field)

14. PROCESS FOR CREATING INCORRECT OPTIONS:
    STEP 1: Write the correct answer
    STEP 2: Create 3 incorrect options by ONLY changing specific details:
      • Change numbers ("four chambers" → "two chambers" or "three chambers")
      • Swap directions ("upwards" → "downwards", "left" → "right")
      • Switch types ("oxygenated" → "deoxygenated", "has nucleus" → "no nucleus")
      • Reverse processes ("transports water" → "transports sugars")
    STEP 3: All options must be about THE EXACT SAME CONCEPT as the question

15. ❌ ABSOLUTELY FORBIDDEN - NEVER DO THIS:
    • Using facts from different topics as options
    • Using random unrelated information from notes
    • Creating options about completely different concepts
    
    Example of WRONG approach:
    Question: "Define prokaryotic cells"
    ❌ NEVER use: "Arteries have thick walls..." (completely different topic!)
    ❌ NEVER use: "Xylem transports water..." (completely different topic!)
    ❌ NEVER use: "Amylase breaks down starch..." (completely different topic!)

CORRECT EXAMPLES WITH PROPER JSON FORMAT:

Example 1:
Question: "Define prokaryotic cells and provide an example. (1 mark)"
{
  "front": "Define prokaryotic cells and provide an example. (1 mark)",
  "back": "Prokaryotic cells are cells that do not have a nucleus, and their DNA is free in the cytoplasm. An example is bacteria.",
  "options": [
    "Prokaryotic cells have a nucleus containing their DNA. An example is bacteria.",
    "Prokaryotic cells do not have a nucleus, but their DNA is enclosed in a membrane. An example is yeast.",
    "Prokaryotic cells have multiple nuclei with DNA inside them. An example is fungi.",
    "Prokaryotic cells are cells that do not have a nucleus, and their DNA is free in the cytoplasm. An example is bacteria."
  ]
}

Example 2:
Question: "Explain the role of the heart in the circulatory system. (2 marks)"
{
  "front": "Explain the role of the heart in the circulatory system. (2 marks)",
  "back": "The heart consists of four chambers and pumps oxygenated blood from the left side to the body, while the right side pumps deoxygenated blood to the lungs.",
  "options": [
    "The heart consists of two chambers and pumps deoxygenated blood from the left side to the lungs.",
    "The heart consists of four chambers and pumps oxygenated blood from the right side to the body.",
    "The heart consists of three chambers and pumps mixed blood throughout the body.",
    "The heart consists of four chambers and pumps oxygenated blood from the left side to the body, while the right side pumps deoxygenated blood to the lungs."
  ]
}

Example 3:
Question: "Describe the functions of xylem and phloem in plants. (2 marks)"
{
  "front": "Describe the functions of xylem and phloem in plants. (2 marks)",
  "back": "Xylem transports water and minerals upwards from roots to leaves, while phloem transports sugars downwards from leaves to other parts.",
  "options": [
    "Xylem transports sugars upwards from leaves, while phloem transports water downwards to roots.",
    "Both xylem and phloem transport water and minerals in the same upward direction.",
    "Xylem transports minerals downwards to roots, while phloem transports water upwards to leaves.",
    "Xylem transports water and minerals upwards from roots to leaves, while phloem transports sugars downwards from leaves to other parts."
  ]
}

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
