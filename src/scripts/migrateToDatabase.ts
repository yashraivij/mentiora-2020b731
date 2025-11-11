/**
 * Script to migrate curriculum data from static file to Supabase database
 * 
 * Usage:
 * 1. Make sure you're logged in and have access to the Supabase project
 * 2. Run this script to migrate all curriculum data to the database
 * 3. The script will call the edge function which handles the actual migration
 */

import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";

async function migrateCurriculum() {
  console.log("🚀 Starting curriculum migration...");
  console.log(`📊 Found ${curriculum.length} subjects to migrate`);
  
  const totalTopics = curriculum.reduce((sum, s) => sum + s.topics.length, 0);
  const totalQuestions = curriculum.reduce(
    (sum, s) => sum + s.topics.reduce((tSum, t) => tSum + t.questions.length, 0),
    0
  );
  
  console.log(`📚 Total topics: ${totalTopics}`);
  console.log(`❓ Total questions: ${totalQuestions}`);
  console.log("");

  try {
    // Call the edge function to perform the migration
    const { data, error } = await supabase.functions.invoke("migrate-curriculum", {
      body: { curriculum },
    });

    if (error) {
      throw error;
    }

    console.log("✅ Migration completed successfully!");
    console.log("");
    console.log("📊 Summary:");
    console.log(`   Subjects inserted: ${data.subjects_inserted}`);
    console.log(`   Topics inserted: ${data.topics_inserted}`);
    console.log(`   Questions inserted: ${data.questions_inserted}`);
    console.log("");
    console.log("🎉 All curriculum data has been migrated to the database!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Test the curriculum service by fetching subjects");
    console.log("2. Gradually migrate components to use the new service");
    console.log("3. Once all components are migrated, you can remove the static file");
    
    return data;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCurriculum()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateCurriculum };
