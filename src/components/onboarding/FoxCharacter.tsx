import { useEffect, useState } from 'react';

interface FoxCharacterProps {
  pose?: 'waving' | 'listening' | 'nodding' | 'excited' | 'celebrating';
  size?: number;
}

export const FoxCharacter = ({ 
  pose = 'waving', 
  size = 150,
}: FoxCharacterProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    
    // Stop animation after it plays once (except celebrating)
    if (pose !== 'celebrating') {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      // Celebrating loops 3 times then stops
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 6000); // 2s * 3 loops
      return () => clearTimeout(timeout);
    }
  }, [pose]);

  return (
    <div 
      className={`fox-character inline-block ${isAnimating ? 'animating' : ''}`}
      data-pose={pose}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="100" cy="120" rx="50" ry="60" fill="#FF8C42"/>
        
        {/* White belly */}
        <ellipse cx="100" cy="130" rx="30" ry="40" fill="#FFFFFF"/>
        
        {/* Head */}
        <circle cx="100" cy="80" r="40" fill="#FF8C42"/>
        
        {/* Ears */}
        <g className="fox-ears">
          <path d="M 70 60 L 65 30 L 80 50 Z" fill="#FF8C42"/>
          <path d="M 130 60 L 135 30 L 120 50 Z" fill="#FF8C42"/>
          <path d="M 72 55 L 70 40 L 78 52 Z" fill="#FFB380"/>
          <path d="M 128 55 L 130 40 L 122 52 Z" fill="#FFB380"/>
        </g>
        
        {/* Eyes */}
        <g className="fox-eyes">
          <ellipse cx="85" cy="75" rx="8" ry="12" fill="#FFFFFF"/>
          <ellipse cx="115" cy="75" rx="8" ry="12" fill="#FFFFFF"/>
          <circle cx="85" cy="77" r="5" fill="#0F4C45"/>
          <circle cx="115" cy="77" r="5" fill="#0F4C45"/>
          <circle cx="87" cy="75" r="2" fill="#FFFFFF"/>
          <circle cx="117" cy="75" r="2" fill="#FFFFFF"/>
        </g>
        
        {/* Nose */}
        <circle cx="100" cy="90" r="4" fill="#333333"/>
        
        {/* Mouth */}
        <path d="M 100 90 Q 95 95 90 93" stroke="#333333" strokeWidth="2" fill="none"/>
        <path d="M 100 90 Q 105 95 110 93" stroke="#333333" strokeWidth="2" fill="none"/>
        
        {/* Tail */}
        <g className="fox-tail">
          <ellipse cx="145" cy="140" rx="25" ry="40" fill="#FF8C42" transform="rotate(25 145 140)"/>
          <ellipse cx="150" cy="150" rx="10" ry="18" fill="#FFFFFF" transform="rotate(25 150 150)"/>
        </g>
        
        {/* Left arm/paw - animated for waving */}
        {pose === 'waving' && (
          <g className="fox-arm" style={{ transformOrigin: '65px 110px' }}>
            <ellipse cx="60" cy="120" rx="12" ry="20" fill="#FF8C42" transform="rotate(-20 60 120)"/>
            <circle cx="55" cy="135" r="8" fill="#FFB380"/>
          </g>
        )}
        
        {/* Arms (normal position for other poses) */}
        {pose !== 'waving' && (
          <>
            <ellipse cx="65" cy="125" rx="12" ry="20" fill="#FF8C42" transform="rotate(-10 65 125)"/>
            <ellipse cx="135" cy="125" rx="12" ry="20" fill="#FF8C42" transform="rotate(10 135 125)"/>
          </>
        )}
        
        {/* Teal scarf (optional accent) */}
        <ellipse cx="100" cy="105" rx="35" ry="8" fill="#0F4C45" opacity="0.8"/>
        
        {/* Celebration sparkles */}
        {pose === 'celebrating' && isAnimating && (
          <>
            <circle className="sparkle sparkle-1" cx="60" cy="60" r="4" fill="#D4F663"/>
            <circle className="sparkle sparkle-2" cx="140" cy="60" r="4" fill="#D4F663"/>
            <circle className="sparkle sparkle-3" cx="100" cy="40" r="4" fill="#D4F663"/>
            <path className="sparkle sparkle-4" d="M 50 50 L 52 55 L 57 57 L 52 59 L 50 64 L 48 59 L 43 57 L 48 55 Z" fill="#FFD700"/>
            <path className="sparkle sparkle-5" d="M 150 50 L 152 55 L 157 57 L 152 59 L 150 64 L 148 59 L 143 57 L 148 55 Z" fill="#FFD700"/>
          </>
        )}
      </svg>

      <style>{`
        .fox-character {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        /* Entry animation - plays once */
        .fox-character.animating {
          animation: fadeInScale 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Waving animation */
        .fox-character[data-pose="waving"].animating .fox-arm {
          animation: wave 1.5s ease-in-out forwards;
          transform-origin: 65px 110px;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(-20deg); }
          25% { transform: rotate(-50deg); }
          50% { transform: rotate(-20deg); }
          75% { transform: rotate(-50deg); }
        }

        /* Listening animation - subtle head tilt */
        .fox-character[data-pose="listening"].animating {
          animation: headTilt 1s ease-in-out forwards;
        }

        @keyframes headTilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }

        /* Nodding animation */
        .fox-character[data-pose="nodding"].animating {
          animation: nod 1s ease-in-out forwards;
        }

        @keyframes nod {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-8px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-8px); }
        }

        /* Excited jump animation */
        .fox-character[data-pose="excited"].animating {
          animation: jump 600ms ease-out forwards;
        }

        @keyframes jump {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Celebrating animation - loops 3 times */
        .fox-character[data-pose="celebrating"].animating {
          animation: celebrate 2s ease-in-out 3;
        }

        @keyframes celebrate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-15deg) scale(1.08); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(15deg) scale(1.08); }
        }

        /* Sparkle particle animations */
        .sparkle-1 {
          animation: sparkle1 1.2s ease-out forwards;
        }
        .sparkle-2 {
          animation: sparkle2 1.2s ease-out forwards;
        }
        .sparkle-3 {
          animation: sparkle3 1.2s ease-out forwards;
        }
        .sparkle-4 {
          animation: sparkle4 1.2s ease-out forwards;
        }
        .sparkle-5 {
          animation: sparkle5 1.2s ease-out forwards;
        }

        @keyframes sparkle1 {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-20px, -30px) scale(1.5);
          }
        }

        @keyframes sparkle2 {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(20px, -30px) scale(1.5);
          }
        }

        @keyframes sparkle3 {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(0px, -40px) scale(1.5);
          }
        }

        @keyframes sparkle4 {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-30px, -20px) scale(1.5);
          }
        }

        @keyframes sparkle5 {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(30px, -20px) scale(1.5);
          }
        }

        /* Tail wag for celebrating */
        .fox-character[data-pose="celebrating"].animating .fox-tail {
          animation: tailWag 0.5s ease-in-out infinite;
          transform-origin: 120px 140px;
        }

        @keyframes tailWag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>
    </div>
  );
};
