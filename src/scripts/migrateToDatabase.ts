/**
 * Script to migrate curriculum data from static file to Supabase database
 * 
 * ⚠️ DEPRECATED: This migration has already been completed.
 * The curriculum data is now stored in and loaded from the Supabase database.
 * 
 * This file is kept for historical reference only.
 */

import { supabase } from "@/integrations/supabase/client";

async function migrateCurriculum() {
  console.warn("⚠️  This migration script is deprecated.");
  console.warn("⚠️  The curriculum has already been migrated to the database.");
  console.warn("⚠️  Data is now loaded via CurriculumService from Supabase.");
  
  throw new Error("Migration already completed. Use CurriculumService to access curriculum data.");
}

export { migrateCurriculum };
