-- Fix 6 broken SAT questions by embedding complete passages

-- 1. Friendship between characters
UPDATE curriculum_questions
SET 
  question = $$Read the following passage:

"Sarah and Elena sat on the porch swing, their laughter echoing through the summer evening just as it had thirty years ago when they first met in Mrs. Henderson's third-grade classroom. Between them lay an old photo album, its pages filled with decades of shared memories—birthday parties, high school graduations, weddings, and everything in between. 'Remember when we thought we'd never survive algebra?' Sarah said, nudging Elena gently. Elena smiled, finishing Sarah's thought the way she always could: 'And now we're helping our own kids through it.' The comfortable silence that followed spoke volumes about years of understanding that needed no words."

What can be inferred about the relationship between the two characters?$$,
  marking_criteria = jsonb_build_object(
    'answer', 'They have a long history of friendship',
    'explanation', 'The passage explicitly mentions "thirty years ago when they first met" and describes "decades of shared memories," along with comfortable familiarity and the ability to finish each other''s thoughts, all indicating a long-term friendship.'
  )
WHERE id = 'sat-28dfc046-db23-4f34-aea2-accf0a922e6c';

-- 2. Economic growth paradox
UPDATE curriculum_questions
SET 
  question = $$Read the following passage:

"The rapid industrialization of Southeast Asia presents a troubling contradiction. While economic development has lifted millions out of poverty and created a burgeoning middle class, it has simultaneously devastated the region's natural ecosystems. Factories that provide jobs for thousands dump untreated waste into rivers that once supplied clean drinking water. Palm oil plantations—a major source of export revenue—replace rainforests that protected against flooding and provided habitat for endangered species. The very prosperity that improves living standards depends on exploiting the environmental resources that sustain life itself. As nations race to match Western standards of living, they undermine the ecological foundations that made such development possible in the first place."

Which statement best captures the central paradox discussed in the passage?$$,
  marking_criteria = jsonb_build_object(
    'answer', 'Economic growth can harm the environment that sustains it',
    'explanation', 'The passage explicitly describes how "prosperity that improves living standards depends on exploiting the environmental resources that sustain life itself," presenting the paradox of development undermining its own ecological foundation.'
  )
WHERE id = 'sat-434c6733-b0c3-4a0b-a760-0f89b6e404ee';

-- 3. Darkness symbolizing mystery
UPDATE curriculum_questions
SET 
  question = $$Read the following passage:

"Dr. Chen descended into the cave system, her headlamp cutting through the absolute darkness that pressed in from all sides. Each step took her deeper into shadows that had never known sunlight, into chambers where no human eye had ever looked. The darkness here wasn't frightening—it was full of possibility. Behind every shadow could be an undiscovered species, a new mineral formation, or geological evidence that would rewrite textbooks. As she squeezed through a narrow passage into an unexplored cavern, the darkness ahead seemed to whisper of secrets waiting to be revealed. This is what drove her: not fear of the dark, but excitement for what mysteries it concealed."

The repeated mention of darkness and shadows in the passage most likely symbolizes:$$,
  marking_criteria = jsonb_build_object(
    'answer', 'Mystery and the unknown',
    'explanation', 'The passage explicitly connects darkness with "possibility," "undiscovered" things, and "secrets waiting to be revealed," while stating the character feels "excitement" rather than fear, clearly establishing darkness as a symbol of mystery and the unknown rather than danger.'
  )
WHERE id = 'sat-4fe0141a-d1e5-4de0-b092-b7abce37ef77';

-- 4. Author's attitude toward policy
UPDATE curriculum_questions
SET 
  question = $$Read the following passage:

"The proposed universal basic income policy represents a bold step toward addressing economic inequality. Pilot programs in Finland and Kenya have shown promising results, with recipients reporting reduced stress and increased ability to pursue education or entrepreneurship. However, questions remain about long-term sustainability and potential impacts on workforce participation. While the concept offers hope for those struggling in an increasingly automated economy, policymakers must carefully consider funding mechanisms and potential unintended consequences. The policy deserves serious consideration and thorough analysis before full-scale implementation."

What can be inferred about the author's attitude toward the policy change?$$,
  marking_criteria = jsonb_build_object(
    'answer', 'Cautiously optimistic',
    'explanation', 'The author acknowledges "promising results" and "hope," but also raises "questions" and emphasizes the need for "careful consideration" and "thorough analysis," indicating guarded optimism rather than full support or opposition.'
  )
WHERE id = 'sat-55fdc708-b478-4d74-bbdd-92a981780abd';

-- 5. Locked doors symbolism
UPDATE curriculum_questions
SET 
  question = $$Read the following passage:

"Throughout the mansion, doors stood closed and locked. The study where Father worked remained sealed during dinner. Mother's private sitting room was always secured when guests visited. Even among family members, bedroom doors clicked shut at night, deadbolts sliding into place. At breakfast, conversation flowed easily about weather and schedules, but when Thomas tried to discuss his college plans, Father retreated behind the locked door of his study. When Sarah wanted to share her engagement news, Mother ushered her into the sitting room but locked the door before allowing her to speak. Every meaningful conversation, every vulnerable moment, happened behind barriers that could not be easily crossed. The family lived together in a house full of locked doors, each one a reminder that some things were meant to be kept private, protected, sealed away from view."

The recurring motif of locked doors throughout the passage most likely symbolizes:$$,
  marking_criteria = jsonb_build_object(
    'answer', 'Barriers to communication and understanding',
    'explanation', 'The passage explicitly connects locked doors with blocked communication, showing how family members retreat behind closed doors when meaningful topics arise, and describing the doors as "barriers that could not be easily crossed," clearly establishing them as symbols of obstacles to openness and connection.'
  )
WHERE id = 'sat-7982ae0b-a4a5-432c-b5e4-c926c63c930a';

-- 6. Broken clock and time
UPDATE curriculum_questions
SET 
  question = $$Read the following passage:

"The grandfather clock in the hallway had stopped working three years ago, its hands frozen at 3:47—the exact time Margaret's husband had passed away. She'd never bothered to fix it. Why should she? Time felt meaningless now anyway. Her children urged her to wind it again, to let it tick forward into the future, but Margaret preferred it this way. The stopped clock was honest. It acknowledged what she felt every day: that time had fractured that afternoon, that part of her remained trapped in that moment while the world moved on without her. When she looked at those frozen hands, she saw the weight of every day since—six years that felt both like an eternity and like yesterday. The broken clock told a truth that working clocks could not: that time doesn't heal all wounds, it simply marches on, indifferent to our grief."

The author's reference to a broken clock most likely serves to emphasize:$$,
  marking_criteria = jsonb_build_object(
    'answer', 'The passage of time',
    'explanation', 'The broken clock, frozen at the moment of her husband''s death, symbolizes how the character perceives time differently after loss. The passage explicitly discusses time being "fractured," "trapped in that moment," and how "six years felt both like an eternity and like yesterday," emphasizing themes about time''s passage and its psychological impact.'
  )
WHERE id = 'sat-d7ed5d87-5a95-4444-b79e-9112ed3bb8d6';