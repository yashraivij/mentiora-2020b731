import { supabase } from "@/integrations/supabase/client";
import { SATActivity, SATProfile } from "@/types/sat";

interface SATQuestion {
  id: string;
  domain: string;
  difficulty: string;
}

export async function generateDailyPlan(userId: string): Promise<void> {
  try {
    // Load user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("Failed to load user profile");
    }

    const satProfile = profile as SATProfile;

    // Check if diagnostic is completed
    if (!satProfile.sat_diagnostic_completed) {
      console.log("Diagnostic not completed, skipping plan generation");
      return;
    }

    // Check if plan already exists for today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingPlan } = await supabase
      .from("sat_daily_plans")
      .select("id")
      .eq("user_id", userId)
      .eq("plan_date", today)
      .single();

    if (existingPlan) {
      console.log("Plan already exists for today");
      return;
    }

    // Fetch available questions
    const { data: allQuestions, error: questionsError } = await supabase
      .from("sat_questions")
      .select("id, domain, difficulty");

    if (questionsError || !allQuestions || allQuestions.length === 0) {
      throw new Error("Failed to load questions");
    }

    const questions = allQuestions as SATQuestion[];

    // Generate activities based on profile
    const activities: SATActivity[] = [];

    // 1. Warm-up: Easy question from strength domain (5 min)
    const strengthDomain = satProfile.sat_strength_domains?.[0] || questions[0].domain;
    const warmupQuestions = questions.filter(
      (q) => q.domain === strengthDomain && q.difficulty === "easy"
    );
    if (warmupQuestions.length > 0) {
      activities.push({
        type: "warmup",
        domain: strengthDomain,
        question_ids: [warmupQuestions[Math.floor(Math.random() * warmupQuestions.length)].id],
        estimated_minutes: 5,
        completed: false,
      });
    }

    // 2-4. Core Focus: 3 questions from weak domains (10 min each)
    const weakDomains = satProfile.sat_weak_domains || [];
    const coreDomains = weakDomains.slice(0, 2);
    
    for (const domain of coreDomains) {
      const mediumQuestions = questions.filter(
        (q) => q.domain === domain && q.difficulty === "medium"
      );
      if (mediumQuestions.length > 0) {
        const selectedQuestions = mediumQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .map((q) => q.id);

        activities.push({
          type: "core_focus",
          domain,
          question_ids: selectedQuestions,
          estimated_minutes: 10,
          completed: false,
        });
      }
    }

    // 5. Review: Mixed difficulty from various domains (5 min)
    const reviewQuestions = questions
      .filter((q) => !activities.some((a) => a.question_ids.includes(q.id)))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    if (reviewQuestions.length > 0) {
      activities.push({
        type: "review",
        domain: "Mixed",
        question_ids: reviewQuestions.map((q) => q.id),
        estimated_minutes: 5,
        completed: false,
      });
    }

    // 6. Boost: Hard question from target domain (5 min)
    if (weakDomains.length > 0) {
      const hardQuestions = questions.filter(
        (q) => weakDomains.includes(q.domain) && q.difficulty === "hard"
      );
      if (hardQuestions.length > 0) {
        activities.push({
          type: "boost",
          domain: hardQuestions[0].domain,
          question_ids: [hardQuestions[Math.floor(Math.random() * hardQuestions.length)].id],
          estimated_minutes: 5,
          completed: false,
        });
      }
    }

    // Ensure we have at least 5 activities
    if (activities.length < 5) {
      // Fill with random questions
      const remainingQuestions = questions
        .filter((q) => !activities.some((a) => a.question_ids.includes(q.id)))
        .sort(() => Math.random() - 0.5)
        .slice(0, 5 - activities.length);

      remainingQuestions.forEach((q) => {
        activities.push({
          type: "core_focus",
          domain: q.domain,
          question_ids: [q.id],
          estimated_minutes: 5,
          completed: false,
        });
      });
    }

    // Save plan to database
    const { error: insertError } = await supabase.from("sat_daily_plans").insert({
      user_id: userId,
      plan_date: today,
      activities: activities as unknown as any,
      completed: false,
    });

    if (insertError) {
      throw insertError;
    }

    console.log("Daily plan generated successfully");
  } catch (error) {
    console.error("Error generating daily plan:", error);
    throw error;
  }
}

export async function markActivityCompleted(
  planId: string,
  activityIndex: number
): Promise<void> {
  try {
    const { data: plan, error: fetchError } = await supabase
      .from("sat_daily_plans")
      .select("activities, completed")
      .eq("id", planId)
      .single();

    if (fetchError || !plan) {
      throw new Error("Failed to load plan");
    }

    const activities = (plan.activities as unknown) as SATActivity[];
    if (activities[activityIndex]) {
      activities[activityIndex].completed = true;
    }

    // Check if all activities are completed
    const allCompleted = activities.every((a) => a.completed);

    const { error: updateError } = await supabase
      .from("sat_daily_plans")
      .update({
        activities: activities as unknown as any,
        completed: allCompleted,
        completed_at: allCompleted ? new Date().toISOString() : null,
      })
      .eq("id", planId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Error marking activity completed:", error);
    throw error;
  }
}
