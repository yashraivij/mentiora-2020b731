import { createClient } from "jsr:@supabase/supabase-js@2";

// This edge function migrates curriculum data from the static file structure
// to the Supabase database tables

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Question {
  id: string;
  question: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  modelAnswer: string;
  markingCriteria: {
    breakdown: string[];
  };
  specReference: string;
  calculatorGuidance?: 'calc-recommended' | 'non-calc-friendly';
}

interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get curriculum data from request body
    const { curriculum } = await req.json() as { curriculum: Subject[] };

    if (!curriculum || !Array.isArray(curriculum)) {
      throw new Error("Invalid curriculum data provided");
    }

    console.log(`Starting migration of ${curriculum.length} subjects...`);

    let subjectsInserted = 0;
    let topicsInserted = 0;
    let questionsInserted = 0;

    // Process each subject
    for (const subject of curriculum) {
      console.log(`Processing subject: ${subject.name}`);

      // Insert subject
      const { error: subjectError } = await supabase
        .from("curriculum_subjects")
        .upsert({
          id: subject.id,
          name: subject.name,
          exam_board: null, // Can be extracted from subject.name if needed
        });

      if (subjectError) {
        console.error(`Error inserting subject ${subject.id}:`, subjectError);
        continue;
      }
      subjectsInserted++;

      // Process topics for this subject
      for (let topicIndex = 0; topicIndex < subject.topics.length; topicIndex++) {
        const topic = subject.topics[topicIndex];
        console.log(`  Processing topic: ${topic.name}`);

        // Insert topic
        const { error: topicError } = await supabase
          .from("curriculum_topics")
          .upsert({
            id: topic.id,
            subject_id: subject.id,
            name: topic.name,
            order_index: topicIndex,
          });

        if (topicError) {
          console.error(`Error inserting topic ${topic.id}:`, topicError);
          continue;
        }
        topicsInserted++;

        // Process questions in batches of 50
        const batchSize = 50;
        for (let i = 0; i < topic.questions.length; i += batchSize) {
          const batch = topic.questions.slice(i, i + batchSize);
          
          const questionsToInsert = batch.map((q, qIndex) => ({
            id: q.id,
            topic_id: topic.id,
            question: q.question,
            marks: q.marks,
            difficulty: q.difficulty,
            model_answer: q.modelAnswer,
            marking_criteria: q.markingCriteria,
            spec_reference: q.specReference,
            calculator_guidance: q.calculatorGuidance || null,
            order_index: i + qIndex,
          }));

          const { error: questionsError } = await supabase
            .from("curriculum_questions")
            .upsert(questionsToInsert);

          if (questionsError) {
            console.error(`Error inserting questions batch for topic ${topic.id}:`, questionsError);
          } else {
            questionsInserted += batch.length;
            console.log(`    Inserted ${batch.length} questions (total: ${questionsInserted})`);
          }
        }
      }
    }

    const summary = {
      success: true,
      subjects_inserted: subjectsInserted,
      topics_inserted: topicsInserted,
      questions_inserted: questionsInserted,
      message: `Migration completed successfully! Inserted ${subjectsInserted} subjects, ${topicsInserted} topics, and ${questionsInserted} questions.`,
    };

    console.log("Migration summary:", summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
