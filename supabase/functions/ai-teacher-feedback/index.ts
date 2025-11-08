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
    const { score, totalQuestions, predictedGrade, subjectName, gradeImprovement, isFirstPractice } = await req.json();

    if (!score === undefined || !totalQuestions || !predictedGrade || !subjectName) {
      throw new Error('Missing required fields');
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Generate personalized feedback text
    let feedbackText = '';
    
    if (isFirstPractice) {
      feedbackText = `Hello! Great job completing your first ${subjectName} practice session. `;
      feedbackText += `You scored ${score} out of ${totalQuestions} questions, that's ${percentage} percent. `;
      feedbackText += `Your predicted grade is now ${predictedGrade}. `;
      
      if (percentage >= 80) {
        feedbackText += `Excellent work! You're showing strong understanding of the material. Keep up this momentum!`;
      } else if (percentage >= 60) {
        feedbackText += `Good effort! With consistent practice, you'll see great improvement. Focus on reviewing the questions you found challenging.`;
      } else {
        feedbackText += `Don't worry, everyone starts somewhere! Review the feedback carefully and practice regularly. You'll see improvement soon!`;
      }
    } else {
      feedbackText = `Welcome back! You've just completed another ${subjectName} practice session. `;
      feedbackText += `You scored ${score} out of ${totalQuestions}, that's ${percentage} percent. `;
      feedbackText += `Your predicted grade has ${gradeImprovement >= 0 ? 'improved to' : 'changed to'} ${predictedGrade}`;
      
      if (gradeImprovement > 0) {
        feedbackText += `, showing an improvement of ${gradeImprovement.toFixed(1)} points. Fantastic progress!`;
      } else if (gradeImprovement < 0) {
        feedbackText += `. Don't be discouraged by this result. Focus on your weak areas and keep practicing consistently.`;
      } else {
        feedbackText += `. You're maintaining your level. Keep pushing to reach the next grade!`;
      }
      
      if (percentage >= 80) {
        feedbackText += ` You're performing excellently. This consistent high performance will translate to exam success!`;
      } else if (percentage >= 60) {
        feedbackText += ` You're making good progress. Focus on the areas where you lost marks to reach the next level.`;
      } else {
        feedbackText += ` Remember, improvement takes time and consistent effort. Review your mistakes and try again!`;
      }
    }

    console.log('Generating speech for text:', feedbackText);

    // Generate speech from text using OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: feedbackText,
        voice: 'nova', // Professional, warm female voice suitable for a teacher
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate speech');
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('Speech generated successfully, audio length:', base64Audio.length);

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        feedbackText: feedbackText 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-teacher-feedback function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
