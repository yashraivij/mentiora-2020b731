import { useEffect, useState } from 'react';

interface TeacherOwlProps {
  pose?: 'greeting' | 'listening' | 'explaining' | 'encouraging' | 'celebrating';
  size?: number;
}

export const TeacherOwl = ({ 
  pose = 'greeting', 
  size = 140,
}: TeacherOwlProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Small delay then trigger animation
    const startDelay = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    // Stop after animation completes
    const stopDelay = setTimeout(() => {
      setIsAnimating(false);
    }, pose === 'celebrating' ? 2500 : 1800);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(stopDelay);
    };
  }, [pose]);

  return (
    <div 
      className={`teacher-owl inline-block ${isAnimating ? 'animating' : ''}`}
      data-pose={pose}
      style={{ width: size, height: size * 1.3 }}
    >
      <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body - taller, more distinguished */}
        <ellipse cx="100" cy="150" rx="55" ry="75" fill="#8B6F47"/>
        
        {/* Cream belly */}
        <ellipse cx="100" cy="160" rx="35" ry="50" fill="#F5E6D3"/>
        
        {/* Head - larger for glasses */}
        <ellipse cx="100" cy="75" rx="50" ry="48" fill="#8B6F47"/>
        
        {/* Ear tufts */}
        <path d="M 60 40 L 55 15 L 70 35 Z" fill="#8B6F47"/>
        <path d="M 140 40 L 145 15 L 130 35 Z" fill="#8B6F47"/>
        
        {/* Eye patches (lighter area for eyes) */}
        <circle cx="80" cy="70" r="22" fill="#A0826D"/>
        <circle cx="120" cy="70" r="22" fill="#A0826D"/>
        
        {/* Eyes - wise and kind */}
        <ellipse cx="80" cy="70" rx="12" ry="16" fill="#FFFFFF"/>
        <ellipse cx="120" cy="70" rx="12" ry="16" fill="#FFFFFF"/>
        
        {/* Pupils */}
        <circle cx="80" cy="72" r="8" fill="#2C2C2C"/>
        <circle cx="120" cy="72" r="8" fill="#2C2C2C"/>
        
        {/* Eye shine - makes it alive */}
        <circle cx="78" cy="68" r="3" fill="#FFFFFF"/>
        <circle cx="118" cy="68" r="3" fill="#FFFFFF"/>
        
        {/* GLASSES - CRITICAL FEATURE */}
        <g className="glasses">
          {/* Left lens */}
          <circle cx="80" cy="70" r="18" fill="none" stroke="#2C2C2C" strokeWidth="3"/>
          {/* Right lens */}
          <circle cx="120" cy="70" r="18" fill="none" stroke="#2C2C2C" strokeWidth="3"/>
          {/* Bridge */}
          <line x1="98" y1="70" x2="102" y2="70" stroke="#2C2C2C" strokeWidth="3"/>
          {/* Left temple */}
          <path d="M 62 70 L 50 68" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round"/>
          {/* Right temple */}
          <path d="M 138 70 L 150 68" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round"/>
          {/* Slight glare on lenses */}
          <circle cx="75" cy="65" r="4" fill="#FFFFFF" opacity="0.4"/>
          <circle cx="115" cy="65" r="4" fill="#FFFFFF" opacity="0.4"/>
        </g>
        
        {/* Beak */}
        <path d="M 100 85 L 95 92 L 105 92 Z" fill="#FFB84D"/>
        
        {/* Bow tie - professional touch */}
        <g className="bow-tie">
          <path d="M 85 115 L 75 120 L 85 125 Z" fill="#0F4C45"/>
          <path d="M 115 115 L 125 120 L 115 125 Z" fill="#0F4C45"/>
          <rect x="97" y="118" width="6" height="4" rx="1" fill="#0F4C45"/>
        </g>
        
        {/* Wings */}
        <g className="wings">
          <ellipse cx="50" cy="155" rx="18" ry="35" fill="#8B6F47" className="left-wing"/>
          <ellipse cx="150" cy="155" rx="18" ry="35" fill="#8B6F47" className="right-wing"/>
        </g>
        
        {/* Feet */}
        <g className="feet">
          <ellipse cx="85" cy="225" rx="12" ry="8" fill="#FFB84D"/>
          <ellipse cx="115" cy="225" rx="12" ry="8" fill="#FFB84D"/>
        </g>
        
        {/* Tail feathers */}
        <path d="M 100 220 L 95 240 L 100 235 L 105 240 Z" fill="#8B6F47"/>
        
        {/* Celebration sparkles */}
        {pose === 'celebrating' && (
          <>
            <circle className="sparkle sparkle-1" cx="40" cy="50" r="4" fill="#D4F663"/>
            <circle className="sparkle sparkle-2" cx="160" cy="50" r="4" fill="#D4F663"/>
            <circle className="sparkle sparkle-3" cx="100" cy="20" r="4" fill="#D4F663"/>
            <path className="sparkle sparkle-4" d="M 30 80 L 32 85 L 37 87 L 32 89 L 30 94 L 28 89 L 23 87 L 28 85 Z" fill="#FFD700"/>
            <path className="sparkle sparkle-5" d="M 170 80 L 172 85 L 177 87 L 172 89 L 170 94 L 168 89 L 163 87 L 168 85 Z" fill="#FFD700"/>
          </>
        )}
      </svg>

      <style>{`
        .teacher-owl {
          display: inline-block;
        }

        /* Greeting - gentle wave with body sway */
        .teacher-owl[data-pose="greeting"].animating {
          animation: gentleSway 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .teacher-owl[data-pose="greeting"].animating .left-wing {
          animation: wingWave 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: 50px 155px;
        }

        @keyframes gentleSway {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-2deg); }
          40% { transform: rotate(2deg); }
          60% { transform: rotate(-2deg); }
          80% { transform: rotate(2deg); }
        }

        @keyframes wingWave {
          0%, 100% { transform: rotate(0deg); }
          15%, 45% { transform: rotate(-25deg); }
          30%, 60% { transform: rotate(-5deg); }
        }

        /* Listening - attentive head tilt */
        .teacher-owl[data-pose="listening"].animating {
          animation: attentiveTilt 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes attentiveTilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }

        /* Explaining - confident nod */
        .teacher-owl[data-pose="explaining"].animating {
          animation: teacherNod 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes teacherNod {
          0%, 100% { transform: translateY(0); }
          15%, 45% { transform: translateY(-12px); }
          30%, 60% { transform: translateY(-2px); }
          75% { transform: translateY(-8px); }
        }

        /* Encouraging - warm bounce */
        .teacher-owl[data-pose="encouraging"].animating {
          animation: encouragingBounce 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes encouragingBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-15px) scale(1.02); }
          60% { transform: translateY(-5px) scale(1); }
        }

        /* Celebrating - excited dance */
        .teacher-owl[data-pose="celebrating"].animating {
          animation: celebrateDance 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .teacher-owl[data-pose="celebrating"].animating .left-wing {
          animation: wingCelebrate 0.8s cubic-bezier(0.4, 0, 0.2, 1) 3;
          transform-origin: 50px 155px;
        }

        .teacher-owl[data-pose="celebrating"].animating .right-wing {
          animation: wingCelebrate 0.8s cubic-bezier(0.4, 0, 0.2, 1) 3;
          transform-origin: 150px 155px;
        }

        @keyframes celebrateDance {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10%, 30%, 50% { transform: rotate(-8deg) scale(1.05); }
          20%, 40%, 60% { transform: rotate(8deg) scale(1.05); }
        }

        @keyframes wingCelebrate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }

        /* Sparkle animations - smooth like Duolingo */
        .sparkle {
          animation: sparkleFloat 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .sparkle-1 { animation-delay: 0s; }
        .sparkle-2 { animation-delay: 0.1s; }
        .sparkle-3 { animation-delay: 0.2s; }
        .sparkle-4 { animation-delay: 0.15s; }
        .sparkle-5 { animation-delay: 0.25s; }

        @keyframes sparkleFloat {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          30% {
            opacity: 1;
            transform: translate(0, -10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(0, -30px) scale(1.5);
          }
        }

        /* Subtle breathing when not animating */
        .teacher-owl:not(.animating) {
          animation: subtleBreath 3s ease-in-out infinite;
        }

        @keyframes subtleBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};
