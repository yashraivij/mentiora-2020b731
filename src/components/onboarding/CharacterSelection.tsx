import { motion } from "framer-motion";
import { TeacherCharacter } from "./TeacherCharacter";

interface CharacterSelectionProps {
  selectedTeacher: string;
  onSelect: (type: 'bear' | 'fox' | 'penguin' | 'raccoon', name: string) => void;
}

const CHARACTERS = [
  {
    id: 'bear' as const,
    name: 'Professor Bear',
    description: 'Patient and encouraging. Makes complex topics feel simple.',
    specialty: 'Building confidence',
    personality: 'Warm & Patient'
  },
  {
    id: 'fox' as const,
    name: 'Ms. Fox',
    description: 'Sharp and strategic. Keeps you focused and motivated.',
    specialty: 'Staying on track',
    personality: 'Sharp & Motivating'
  },
  {
    id: 'penguin' as const,
    name: 'Mr. Penguin',
    description: 'Detail-oriented and thorough. Ensures you master every concept.',
    specialty: 'Perfectionists',
    personality: 'Precise & Thorough'
  },
  {
    id: 'raccoon' as const,
    name: 'Coach Raccoon',
    description: 'High-energy and results-focused. Makes studying feel like a game.',
    specialty: 'Competitive mindset',
    personality: 'Energetic & Results-Driven'
  }
];

export const CharacterSelection = ({ selectedTeacher, onSelect }: CharacterSelectionProps) => {
  return (
    <div className="text-center">
      <h2 className="text-[36px] font-bold text-white mb-3">Choose Your Teacher</h2>
      <p className="text-[18px] text-white/80 mb-10">Pick a mentor who'll guide you through your SAT journey!</p>
      
      {/* Character Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10 max-w-[600px] mx-auto">
        {CHARACTERS.map((char) => (
          <motion.button
            key={char.id}
            onClick={() => onSelect(char.id, char.name)}
            className={`
              relative p-6 rounded-2xl border-2 transition-all text-left
              ${selectedTeacher === char.id 
                ? 'border-[#D4F663] bg-[rgba(212,246,99,0.15)]' 
                : 'border-white/20 bg-white/10 hover:border-[#D4F663] hover:bg-white/15'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Character illustration */}
            <div className="flex justify-center mb-4">
              <TeacherCharacter 
                type={char.id}
                animation={selectedTeacher === char.id ? 'greeting' : 'idle'}
                size={120}
              />
            </div>
            
            {/* Character info */}
            <div className="text-center">
              <h3 className="text-[20px] font-bold text-white mb-1">{char.name}</h3>
              <p className="text-[14px] text-[#D4F663] font-semibold mb-2">{char.personality}</p>
              <p className="text-[13px] text-white/80 leading-snug mb-3">{char.description}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[11px] text-white/70">
                Best for: {char.specialty}
              </span>
            </div>

            {/* Selection indicator */}
            {selectedTeacher === char.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#D4F663] flex items-center justify-center"
              >
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5L5 9.5L13 1.5" stroke="#0F4C45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
