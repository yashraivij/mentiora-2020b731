# Curriculum Database Migration Guide

## ✅ Phase 1: COMPLETED

The database foundation has been set up:

- ✅ **Database tables created**: `curriculum_subjects`, `curriculum_topics`, `curriculum_questions`
- ✅ **RLS policies configured**: Authenticated users can read, service role can manage
- ✅ **Indexes added**: Performance optimized for queries
- ✅ **Curriculum service created**: `src/services/curriculumService.ts` with caching & fallback
- ✅ **Migration edge function**: `supabase/functions/migrate-curriculum/index.ts`
- ✅ **Migration script**: `src/scripts/migrateToDatabase.ts`

---

## 🚀 Next Steps: Run the Data Migration

### Step 1: Deploy the Edge Function

The edge function will auto-deploy. Wait for deployment to complete, then proceed.

### Step 2: Run the Migration

Open your browser console on the app and run:

```javascript
// Import and run the migration
import { migrateCurriculum } from './src/scripts/migrateToDatabase';
await migrateCurriculum();
```

Or create a temporary admin page with a "Migrate Data" button that calls this function.

**Expected output:**
```
🚀 Starting curriculum migration...
📊 Found 33 subjects to migrate
📚 Total topics: ~400
❓ Total questions: ~4000

✅ Migration completed successfully!

📊 Summary:
   Subjects inserted: 33
   Topics inserted: ~400
   Questions inserted: ~4000
```

**Time estimate:** 2-5 minutes depending on data size

### Step 3: Verify Migration

Test that data was migrated correctly:

```javascript
import { CurriculumService } from './src/services/curriculumService';

// Fetch all subjects
const subjects = await CurriculumService.getSubjects();
console.log(`✅ Loaded ${subjects.length} subjects from database`);

// Test a specific subject
const geography = await CurriculumService.getSubject('geography-aqa-alevel');
console.log('Geography topics:', geography?.topics.length);
```

---

## 📋 Phase 2: Component Migration Plan

Now that the database is populated, we'll gradually migrate components to use the new service.

### Migration Strategy

**IMPORTANT:** The static `curriculum.ts` file will remain as a fallback during migration. No breaking changes!

### Components to Migrate (14 files)

#### Batch 1: Simple Components (Start Here)
1. ✅ `src/components/dashboard/WeakTopicsSection.tsx`
2. ✅ `src/components/dashboard/GoalsSection.tsx`
3. ✅ `src/components/ui/onboarding-popup.tsx`

#### Batch 2: Dashboard Components
4. `src/components/dashboard/DashboardStressMonitor.tsx`
5. `src/components/dashboard/PredictedGradesGraph.tsx`
6. `src/components/dashboard/PredictivePerformanceCard.tsx`
7. `src/components/dashboard/TopicMasteryDisplay.tsx`

#### Batch 3: Page Components
8. `src/pages/Dashboard.tsx`
9. `src/pages/Analytics.tsx`
10. `src/pages/SubjectTopics.tsx`
11. `src/pages/Practice.tsx`
12. `src/pages/PredictedQuestions.tsx`
13. `src/pages/PredictedExam.tsx`
14. `src/pages/PredictedResults.tsx`

### Migration Pattern for Each Component

**Before:**
```typescript
import { curriculum } from "@/data/curriculum";

export function MyComponent() {
  const subjects = curriculum; // Static data
  
  return (
    <div>
      {subjects.map(subject => ...)}
    </div>
  );
}
```

**After:**
```typescript
import { CurriculumService } from "@/services/curriculumService";
import { useState, useEffect } from "react";

export function MyComponent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await CurriculumService.getSubjects();
        setSubjects(data);
      } catch (err) {
        setError("Failed to load curriculum");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {subjects.map(subject => ...)}
    </div>
  );
}
```

---

## 🎯 Benefits After Migration

✅ **No file size limits** - Add unlimited subjects/questions  
✅ **Dynamic updates** - Update curriculum without redeploying  
✅ **Better performance** - Fetch only needed data (not entire 40k file)  
✅ **Caching** - 5-minute cache reduces database calls  
✅ **Fallback safety** - Falls back to static file if DB fails  
✅ **Version control** - Track curriculum changes in DB  
✅ **Future-proof** - Scalable architecture for growth

---

## 📊 Progress Tracking

- [x] Phase 1: Database setup (COMPLETED)
- [ ] Phase 2: Data migration (PENDING - Run migration script)
- [ ] Phase 3: Migrate Batch 1 components
- [ ] Phase 4: Migrate Batch 2 components
- [ ] Phase 5: Migrate Batch 3 components
- [ ] Phase 6: Remove static file

---

## 🔄 Rollback Plan

If anything goes wrong:

1. **No code changes needed** - Components still use static file as fallback
2. **Clear cache**: `CurriculumService.clearCache()`
3. **Revert database**: Run the down migration (if needed)
4. **Keep static file**: Don't delete `curriculum.ts` until all components are migrated and tested

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs for the edge function
3. Verify RLS policies are enabled
4. Ensure user is authenticated when testing
