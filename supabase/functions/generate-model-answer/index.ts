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
    const { question, subjectId, marks } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a detailed prompt for generating a full-mark model answer
    const systemPrompt = `You are an expert GCSE examiner and teacher. Your task is to write a perfect model answer that would achieve full marks for the given question.

CRITICAL REQUIREMENTS:
1. Write a DIRECT ANSWER to the specific question asked - not instructions or guidance
2. The answer should be exactly what a student would write to get full marks
3. Use appropriate scientific/subject terminology
4. Structure the answer clearly and logically
5. Include specific facts, figures, equations, or examples as needed
6. Match the mark allocation (${marks} marks total)
7. Write in PLAIN TEXT only - NO LaTeX formatting, NO mathematical symbols like \\( \\), \\[ \\], or \\frac{}{}
8. Use simple fractions like 9/20 instead of complex formatting
9. Write equations and mathematical expressions in simple text format

SUBJECT CONTEXT: ${subjectId}

Write as if you are the student giving the perfect answer. Do not explain what to include - just give the actual answer content. Keep all mathematical notation simple and readable.`;

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