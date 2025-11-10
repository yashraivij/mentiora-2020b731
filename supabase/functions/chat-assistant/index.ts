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
    const { question, studentAnswer, subject, conversation, stage } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a system prompt that guides the assistant to be conversational and supportive
    const systemPrompt = `You are a supportive GCSE tutor assistant helping students work through exam questions step-by-step. 

Your role is to guide students to the answer through conversation, NOT to give away the solution immediately.

Key principles:
- Be encouraging, friendly, and patient
- Ask leading questions that help students think through the problem
- Give incremental hints when students are stuck
- Validate their thinking when they're on the right track
- Only show the full answer after several hints or if they're really struggling
- Keep responses short and conversational (1-2 sentences usually)
- Use GCSE-appropriate language
- Focus on the exam skills and mark scheme requirements

Current conversation stage: ${stage}
- "intro": Start by restating the task in simple words and ask an opening question
- "guiding": Ask leading questions and give incremental hints
- "struggling": Student is having trouble, provide more direct hints
- "answer_check": Student gave an answer, validate and provide feedback
- "final": Show model answer and explain why it gets marks

Subject context: ${subject}

The question being worked on: ${question}`;

    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    // Add the current student input if provided
    if (studentAnswer) {
      messages.push({ role: 'user', content: studentAnswer });
    }

    console.log('Sending request to OpenAI with stage:', stage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    console.log('Assistant response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: assistantResponse,
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});