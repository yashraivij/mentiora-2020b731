-- Aggressive SAT Questions Cleanup
-- Delete all SAT questions that reference content that doesn't exist in the database

DELETE FROM curriculum_questions
WHERE id LIKE 'sat-%'
AND passage_text IS NULL
AND (
  -- Questions referencing specific line numbers
  question ~* 'line \d+'
  -- Questions referencing "the author"
  OR question ILIKE '%the author%'
  -- Questions referencing "the passage"
  OR question ILIKE '%the passage%'
  -- Questions referencing "the text"
  OR question ILIKE '%the text%'
  -- Questions referencing paragraphs
  OR question ILIKE '%paragraph%'
  -- Questions referencing sentences from a passage
  OR (question ILIKE '%sentence%' AND question ILIKE '%which%')
  -- "Most nearly means" questions (vocabulary in context)
  OR question ILIKE '%most nearly means%'
);