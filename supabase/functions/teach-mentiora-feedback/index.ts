import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transcription, question, modelAnswer, subject } = await req.json();
    
    if (!transcription || !question) {
      throw new Error('Missing required fields');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('Analyzing student explanation...');

    // Construct analysis prompt
    const systemPrompt = `You are Mentiora, an encouraging GCSE exam tutor who helps students learn by having them teach concepts back to you. 

Your role is to:
1. Analyze what the student explained correctly
2. Identify missing key terms, concepts, or reasoning
3. Point out incorrect statements or misconceptions
4. Compare their explanation to the mark scheme requirements
5. Provide specific, actionable feedback in an encouraging tone

Use this structure:
**What You Understand Well:**
[Highlight correct parts with specific praise]

**What You Missed / Need to Improve:**
[List missing keywords, concepts, or reasoning errors with examples]

**To Reach Grade 7+ Level:**
[Give 2-3 specific improvements they should make]

Keep your tone warm and motivating. Use phrases like "Nice effort", "You've got the basic idea", "Here's what will take this further..."`;

    const userPrompt = `Question: ${question}

Model Answer: ${modelAnswer || 'Not provided'}

Student's Explanation (spoken): ${transcription}

Analyze the student's explanation and provide structured feedback following the format in your system instructions.`;

    // Get text analysis from GPT
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI Analysis API error:', {
        status: analysisResponse.status,
        statusText: analysisResponse.statusText,
        error: errorText
      });
      throw new Error(`Analysis API failed (${analysisResponse.status}): ${errorText}`);
    }

    const analysisData = await analysisResponse.json();
    const feedbackText = analysisData.choices[0].message.content;

    console.log('Feedback generated, creating audio with ElevenLabs...');

    // Generate voice feedback using ElevenLabs TTS
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    const ttsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: feedbackText,
        model_id: 'eleven_turbo_v2_5',
      }),
    });

    console.log('ElevenLabs response status:', ttsResponse.status);
    console.log('ElevenLabs response headers:', Object.fromEntries(ttsResponse.headers.entries()));

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('ElevenLabs TTS API error:', {
        status: ttsResponse.status,
        statusText: ttsResponse.statusText,
        error: errorText
      });
      throw new Error(`ElevenLabs TTS failed (${ttsResponse.status}): ${errorText}`);
    }

    // Convert audio to base64
    const arrayBuffer = await ttsResponse.arrayBuffer();
    console.log('Audio received, size:', arrayBuffer.byteLength, 'bytes');
    
    const base64Audio = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    console.log('Base64 encoded, length:', base64Audio.length);

    console.log('Audio feedback generated successfully');

    return new Response(
      JSON.stringify({ 
        feedbackText,
        audioContent: base64Audio 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Teach Mentiora feedback error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
