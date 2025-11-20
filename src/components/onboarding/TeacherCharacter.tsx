import { useEffect, useState } from 'react';

interface TeacherCharacterProps {
  type: 'bear' | 'fox' | 'penguin' | 'raccoon';
  animation?: 'idle' | 'greeting' | 'listening' | 'teaching' | 'encouraging' | 'celebrating' | 'thinking' | 'cheering';
  size?: number;
  message?: string;
  onAnimationComplete?: () => void;
}

export const TeacherCharacter = ({ 
  type, 
  animation = 'idle',
  size = 150,
  message,
  onAnimationComplete
}: TeacherCharacterProps) => {
  const [animationClass, setAnimationClass] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setAnimationClass('');
    
    const timer = setTimeout(() => {
      setAnimationClass('animate');
    }, 50);

    // Handle animation completion
    if (animation !== 'idle' && onAnimationComplete) {
      const duration = animation === 'celebrating' ? 2500 : 1800;
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [animation, onAnimationComplete]);

  // Random blinking for idle state
  useEffect(() => {
    if (animation === 'idle') {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, Math.random() * 3000 + 2000);

      return () => clearInterval(blinkInterval);
    }
  }, [animation]);

  // Get animation speed multiplier based on character personality
  const getSpeedClass = () => {
    switch (type) {
      case 'bear': return 'speed-slow'; // Gentle, patient
      case 'fox': return 'speed-fast'; // Quick, precise
      case 'penguin': return 'speed-medium'; // Measured, deliberate
      case 'raccoon': return 'speed-fastest'; // Energetic, bouncy
      default: return 'speed-medium';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Speech bubble */}
      {message && (
        <div className="relative mb-2">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-800 text-base font-medium">{message}</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-white"></div>
        </div>
      )}

      {/* Character SVG */}
      <div 
        className={`teacher-character ${animationClass} ${getSpeedClass()}`}
        data-type={type}
        data-animation={animation}
        style={{ width: size, height: size * 1.15 }}
      >
        {type === 'bear' && <BearSVG isBlinking={isBlinking} animation={animation} />}
        {type === 'fox' && <FoxSVG isBlinking={isBlinking} animation={animation} />}
        {type === 'penguin' && <PenguinSVG isBlinking={isBlinking} animation={animation} />}
        {type === 'raccoon' && <RaccoonSVG isBlinking={isBlinking} animation={animation} />}
      </div>

      <style>{`
        .teacher-character {
          display: inline-block;
          position: relative;
        }

        /* Speed multipliers for personality */
        .speed-slow { animation-duration: 2.2s !important; }
        .speed-medium { animation-duration: 1.8s !important; }
        .speed-fast { animation-duration: 1.4s !important; }
        .speed-fastest { animation-duration: 1.2s !important; }

        /* IDLE ANIMATION - Subtle breathing and bounce */
        .teacher-character[data-animation="idle"].animate {
          animation: idleBounce 2s ease-in-out infinite;
        }

        @keyframes idleBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.01); }
        }

        /* GREETING ANIMATION - Big wave */
        .teacher-character[data-animation="greeting"].animate {
          animation: greetingBody 2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .teacher-character[data-animation="greeting"].animate .arm-right {
          animation: wave 2s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center bottom;
        }

        @keyframes greetingBody {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(0deg) scale(0.98); }
          20% { transform: rotate(-2deg) scale(1.02); }
          40% { transform: rotate(2deg) scale(1.02); }
          60% { transform: rotate(-2deg) scale(1.02); }
          80% { transform: rotate(2deg) scale(1.02); }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          15%, 45%, 75% { transform: rotate(-45deg); }
          30%, 60%, 90% { transform: rotate(-15deg); }
        }

        /* LISTENING ANIMATION - Head tilt */
        .teacher-character[data-animation="listening"].animate .head {
          animation: headTilt 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center center;
        }

        @keyframes headTilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }

        /* TEACHING ANIMATION - Point and nod */
        .teacher-character[data-animation="teaching"].animate {
          animation: teachingBody 1.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .teacher-character[data-animation="teaching"].animate .arm-right {
          animation: point 1.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center bottom;
        }

        .teacher-character[data-animation="teaching"].animate .head {
          animation: teachingNod 1.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center bottom;
        }

        @keyframes teachingBody {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-3px) scale(1.02); }
        }

        @keyframes point {
          0%, 100% { transform: rotate(0deg); }
          20%, 80% { transform: rotate(-60deg); }
        }

        @keyframes teachingNod {
          0%, 100% { transform: translateY(0); }
          25%, 75% { transform: translateY(-8px); }
          50% { transform: translateY(-3px); }
        }

        /* ENCOURAGING ANIMATION - Jump with fist pump */
        .teacher-character[data-animation="encouraging"].animate {
          animation: encouragingJump 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .teacher-character[data-animation="encouraging"].animate .arm-right {
          animation: fistPump 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes encouragingJump {
          0% { transform: translateY(0) scale(1); }
          15% { transform: translateY(5px) scale(0.98, 1.02); }
          40% { transform: translateY(-35px) scale(1.05); }
          60% { transform: translateY(-15px) scale(1.02); }
          75% { transform: translateY(-5px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes fistPump {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(-20px) rotate(-25deg); }
        }

        /* CELEBRATING ANIMATION - Dance and spin */
        .teacher-character[data-animation="celebrating"].animate {
          animation: celebrateDance 2.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .teacher-character[data-animation="celebrating"].animate .arm-left,
        .teacher-character[data-animation="celebrating"].animate .arm-right {
          animation: armsCelebrate 0.6s ease-in-out infinite;
        }

        @keyframes celebrateDance {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10%, 30%, 50%, 70% { transform: rotate(-12deg) scale(1.08); }
          20%, 40%, 60%, 80% { transform: rotate(12deg) scale(1.08); }
        }

        @keyframes armsCelebrate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }

        /* THINKING ANIMATION - Hand on chin */
        .teacher-character[data-animation="thinking"].animate {
          animation: thinkingSway 1.5s ease-in-out;
        }

        .teacher-character[data-animation="thinking"].animate .arm-right {
          animation: chinRub 1.5s ease-in-out;
        }

        .teacher-character[data-animation="thinking"].animate .head {
          animation: thinkingTilt 1.5s ease-in-out;
        }

        @keyframes thinkingSway {
          0%, 100% { transform: translateX(0); }
          25%, 75% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
        }

        @keyframes chinRub {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30%, 70% { transform: translateY(-15px) rotate(20deg); }
        }

        @keyframes thinkingTilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }

        /* CHEERING ANIMATION - Clap and bounce */
        .teacher-character[data-animation="cheering"].animate {
          animation: cheeringBounce 1.5s ease-in-out;
        }

        .teacher-character[data-animation="cheering"].animate .arm-left,
        .teacher-character[data-animation="cheering"].animate .arm-right {
          animation: clap 0.3s ease-in-out 3;
        }

        @keyframes cheeringBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25%, 75% { transform: translateY(-10px) scale(1.03); }
          50% { transform: translateY(-5px) scale(1.01); }
        }

        @keyframes clap {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-8px); }
        }

        /* SPARKLES for celebrating */
        .sparkle {
          animation: sparkleFloat 1.5s ease-out forwards;
        }

        @keyframes sparkleFloat {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          20% {
            opacity: 1;
            transform: translate(0, -5px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(0, -40px) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

// PROFESSOR BEAR SVG
const BearSVG = ({ isBlinking, animation }: { isBlinking: boolean; animation: string }) => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <g className="body">
      <ellipse cx="100" cy="140" rx="60" ry="70" fill="#8B4513"/>
      <ellipse cx="100" cy="150" rx="40" ry="50" fill="#D2B48C"/>
    </g>
    
    {/* Head */}
    <g className="head">
      <circle cx="100" cy="70" r="45" fill="#8B4513"/>
      <ellipse cx="100" cy="80" rx="35" ry="30" fill="#D2B48C"/>
      
      {/* Ears */}
      <circle cx="65" cy="45" r="18" fill="#8B4513"/>
      <circle cx="135" cy="45" r="18" fill="#8B4513"/>
      <circle cx="65" cy="45" r="10" fill="#D2B48C"/>
      <circle cx="135" cy="45" r="10" fill="#D2B48C"/>
      
      {/* Eyes */}
      <ellipse cx="85" cy="65" rx="8" ry={isBlinking ? 2 : 10} fill="#2C2C2C"/>
      <ellipse cx="115" cy="65" rx="8" ry={isBlinking ? 2 : 10} fill="#2C2C2C"/>
      {!isBlinking && <circle cx="87" cy="63" r="2" fill="#FFFFFF"/>}
      {!isBlinking && <circle cx="117" cy="63" r="2" fill="#FFFFFF"/>}
      
      {/* Gold-rimmed glasses */}
      <circle cx="85" cy="65" r="14" fill="none" stroke="#DAA520" strokeWidth="2.5"/>
      <circle cx="115" cy="65" r="14" fill="none" stroke="#DAA520" strokeWidth="2.5"/>
      <line x1="99" y1="65" x2="101" y2="65" stroke="#DAA520" strokeWidth="2.5"/>
      
      {/* Nose */}
      <ellipse cx="100" cy="80" rx="8" ry="6" fill="#2C2C2C"/>
      
      {/* Smile */}
      {(animation === 'greeting' || animation === 'celebrating' || animation === 'encouraging') && (
        <path d="M 90 88 Q 100 94 110 88" stroke="#8B4513" strokeWidth="2" fill="none"/>
      )}
    </g>
    
    {/* Sweater vest */}
    <g>
      <path d="M 70 110 L 60 140 L 60 180 L 140 180 L 140 140 L 130 110 Z" fill="#800020"/>
      <path d="M 95 110 L 95 180" stroke="#D2B48C" strokeWidth="8"/>
      <path d="M 105 110 L 105 180" stroke="#D2B48C" strokeWidth="8"/>
    </g>
    
    {/* Arms */}
    <g className="arm-left">
      <ellipse cx="55" cy="145" rx="15" ry="35" fill="#8B4513" transform="rotate(-15 55 145)"/>
      <circle cx="50" cy="175" r="12" fill="#D2B48C"/>
    </g>
    <g className="arm-right">
      <ellipse cx="145" cy="145" rx="15" ry="35" fill="#8B4513" transform="rotate(15 145 145)"/>
      <circle cx="150" cy="175" r="12" fill="#D2B48C"/>
    </g>
    
    {/* Book in hand (sometimes) */}
    {animation === 'teaching' && (
      <g>
        <rect x="140" y="100" width="25" height="35" rx="2" fill="#8B4513" transform="rotate(-30 152 117)"/>
        <line x1="145" y1="105" x2="145" y2="130" stroke="#FFFFFF" strokeWidth="1" transform="rotate(-30 152 117)"/>
      </g>
    )}
    
    {/* Legs */}
    <ellipse cx="85" cy="205" rx="18" ry="12" fill="#8B4513"/>
    <ellipse cx="115" cy="205" rx="18" ry="12" fill="#8B4513"/>
    
    {/* Celebration sparkles */}
    {animation === 'celebrating' && (
      <>
        <circle className="sparkle" cx="40" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="160" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="100" cy="20" r="5" fill="#FFD700"/>
      </>
    )}
  </svg>
);

// MS. FOX SVG
const FoxSVG = ({ isBlinking, animation }: { isBlinking: boolean; animation: string }) => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <g className="body">
      <ellipse cx="100" cy="140" rx="50" ry="65" fill="#FF8C42"/>
      <ellipse cx="100" cy="150" rx="30" ry="45" fill="#FFFFFF"/>
    </g>
    
    {/* Head */}
    <g className="head">
      <path d="M 100 40 L 70 75 Q 70 85 100 85 Q 130 85 130 75 Z" fill="#FF8C42"/>
      <path d="M 85 70 Q 85 80 100 80 Q 115 80 115 70 Z" fill="#FFFFFF"/>
      
      {/* Ears */}
      <path d="M 75 45 L 65 20 L 85 50 Z" fill="#FF8C42"/>
      <path d="M 125 45 L 135 20 L 115 50 Z" fill="#FF8C42"/>
      <path d="M 77 48 L 72 32 L 82 52 Z" fill="#FFFFFF"/>
      <path d="M 123 48 L 128 32 L 118 52 Z" fill="#FFFFFF"/>
      
      {/* Eyes */}
      <ellipse cx="88" cy="62" rx="7" ry={isBlinking ? 2 : 10} fill="#0F4C45"/>
      <ellipse cx="112" cy="62" rx="7" ry={isBlinking ? 2 : 10} fill="#0F4C45"/>
      {!isBlinking && <circle cx="90" cy="60" r="2" fill="#FFFFFF"/>}
      {!isBlinking && <circle cx="114" cy="60" r="2" fill="#FFFFFF"/>}
      
      {/* Nose */}
      <circle cx="100" cy="75" r="4" fill="#2C2C2C"/>
      
      {/* Smile */}
      {(animation === 'greeting' || animation === 'celebrating' || animation === 'encouraging') && (
        <path d="M 92 78 Q 100 82 108 78" stroke="#FF8C42" strokeWidth="1.5" fill="none"/>
      )}
    </g>
    
    {/* Teal blazer */}
    <g>
      <path d="M 75 105 L 65 140 L 65 180 L 135 180 L 135 140 L 125 105 Z" fill="#0F4C45"/>
      <path d="M 95 105 L 95 180" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M 105 105 L 105 180" stroke="#FFFFFF" strokeWidth="6"/>
      <circle cx="100" cy="115" r="4" fill="#FFFFFF" opacity="0.8"/>
    </g>
    
    {/* Pearl necklace */}
    <g>
      <circle cx="95" cy="102" r="2.5" fill="#F5F5DC"/>
      <circle cx="100" cy="102" r="2.5" fill="#F5F5DC"/>
      <circle cx="105" cy="102" r="2.5" fill="#F5F5DC"/>
    </g>
    
    {/* Arms */}
    <g className="arm-left">
      <ellipse cx="60" cy="145" rx="12" ry="30" fill="#FF8C42" transform="rotate(-10 60 145)"/>
      <circle cx="58" cy="172" r="10" fill="#FFB380"/>
    </g>
    <g className="arm-right">
      <ellipse cx="140" cy="145" rx="12" ry="30" fill="#FF8C42" transform="rotate(10 140 145)"/>
      <circle cx="142" cy="172" r="10" fill="#FFB380"/>
    </g>
    
    {/* Clipboard (sometimes) */}
    {animation === 'teaching' && (
      <g>
        <rect x="135" y="110" width="22" height="32" rx="2" fill="#8B4513"/>
        <rect x="138" y="115" width="16" height="20" fill="#FFFFFF"/>
        <line x1="140" y1="120" x2="150" y2="120" stroke="#0F4C45" strokeWidth="1"/>
        <line x1="140" y1="125" x2="150" y2="125" stroke="#0F4C45" strokeWidth="1"/>
      </g>
    )}
    
    {/* Tail */}
    <g className="tail">
      <ellipse cx="145" cy="165" rx="20" ry="35" fill="#FF8C42" transform="rotate(25 145 165)"/>
      <ellipse cx="150" cy="175" rx="8" ry="15" fill="#FFFFFF" transform="rotate(25 150 175)"/>
    </g>
    
    {/* Legs */}
    <ellipse cx="85" cy="205" rx="15" ry="10" fill="#FF8C42"/>
    <ellipse cx="115" cy="205" rx="15" ry="10" fill="#FF8C42"/>
    
    {/* Celebration sparkles */}
    {animation === 'celebrating' && (
      <>
        <circle className="sparkle" cx="40" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="160" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="100" cy="20" r="5" fill="#FFD700"/>
      </>
    )}
  </svg>
);

// MR. PENGUIN SVG
const PenguinSVG = ({ isBlinking, animation }: { isBlinking: boolean; animation: string }) => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body - naturally tuxedo-like */}
    <g className="body">
      <ellipse cx="100" cy="140" rx="55" ry="70" fill="#2C2C2C"/>
      <ellipse cx="100" cy="150" rx="40" ry="55" fill="#FFFFFF"/>
    </g>
    
    {/* Head */}
    <g className="head">
      <ellipse cx="100" cy="65" rx="42" ry="45" fill="#2C2C2C"/>
      <ellipse cx="100" cy="72" rx="32" ry="35" fill="#FFFFFF"/>
      
      {/* Eye patches */}
      <ellipse cx="85" cy="62" rx="15" ry="18" fill="#FFFFFF"/>
      <ellipse cx="115" cy="62" rx="15" ry="18" fill="#FFFFFF"/>
      
      {/* Eyes */}
      <ellipse cx="85" cy="62" rx="7" ry={isBlinking ? 2 : 10} fill="#2C2C2C"/>
      <ellipse cx="115" cy="62" rx="7" ry={isBlinking ? 2 : 10} fill="#2C2C2C"/>
      {!isBlinking && <circle cx="87" cy="60" r="2" fill="#FFFFFF"/>}
      {!isBlinking && <circle cx="117" cy="60" r="2" fill="#FFFFFF"/>}
      
      {/* Round glasses */}
      <circle cx="85" cy="62" r="16" fill="none" stroke="#2C2C2C" strokeWidth="2.5"/>
      <circle cx="115" cy="62" r="16" fill="none" stroke="#2C2C2C" strokeWidth="2.5"/>
      <line x1="99" y1="62" x2="101" y2="62" stroke="#2C2C2C" strokeWidth="2.5"/>
      
      {/* Beak */}
      <path d="M 100 75 L 95 82 L 105 82 Z" fill="#FF8C42"/>
    </g>
    
    {/* Yellow bow tie */}
    <g>
      <path d="M 88 105 L 78 110 L 88 115 Z" fill="#D4F663"/>
      <path d="M 112 105 L 122 110 L 112 115 Z" fill="#D4F663"/>
      <rect x="98" y="108" width="4" height="4" rx="1" fill="#D4F663"/>
    </g>
    
    {/* Wings/flippers */}
    <g className="arm-left">
      <ellipse cx="58" cy="150" rx="15" ry="40" fill="#2C2C2C" transform="rotate(-15 58 150)"/>
    </g>
    <g className="arm-right">
      <ellipse cx="142" cy="150" rx="15" ry="40" fill="#2C2C2C" transform="rotate(15 142 150)"/>
    </g>
    
    {/* Notepad (sometimes) */}
    {animation === 'teaching' && (
      <g>
        <rect x="135" y="115" width="20" height="28" rx="1" fill="#FFFACD"/>
        <line x1="138" y1="120" x2="150" y2="120" stroke="#2C2C2C" strokeWidth="0.8"/>
        <line x1="138" y1="125" x2="150" y2="125" stroke="#2C2C2C" strokeWidth="0.8"/>
        <line x1="138" y1="130" x2="145" y2="130" stroke="#2C2C2C" strokeWidth="0.8"/>
      </g>
    )}
    
    {/* Feet */}
    <ellipse cx="85" cy="208" rx="18" ry="10" fill="#FF8C42"/>
    <ellipse cx="115" cy="208" rx="18" ry="10" fill="#FF8C42"/>
    <line x1="78" y1="208" x2="72" y2="212" stroke="#FF8C42" strokeWidth="3" strokeLinecap="round"/>
    <line x1="85" y1="208" x2="85" y2="214" stroke="#FF8C42" strokeWidth="3" strokeLinecap="round"/>
    <line x1="92" y1="208" x2="98" y2="212" stroke="#FF8C42" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Celebration sparkles */}
    {animation === 'celebrating' && (
      <>
        <circle className="sparkle" cx="40" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="160" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="100" cy="20" r="5" fill="#FFD700"/>
      </>
    )}
  </svg>
);

// COACH RACCOON SVG
const RaccoonSVG = ({ isBlinking, animation }: { isBlinking: boolean; animation: string }) => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <g className="body">
      <ellipse cx="100" cy="145" rx="52" ry="65" fill="#7C7C7C"/>
      <ellipse cx="100" cy="155" rx="35" ry="45" fill="#D3D3D3"/>
    </g>
    
    {/* Head */}
    <g className="head">
      <ellipse cx="100" cy="70" rx="40" ry="42" fill="#7C7C7C"/>
      
      {/* Iconic raccoon mask */}
      <ellipse cx="85" cy="65" rx="18" ry="16" fill="#2C2C2C"/>
      <ellipse cx="115" cy="65" rx="18" ry="16" fill="#2C2C2C"/>
      <path d="M 70 58 Q 100 52 130 58" stroke="#2C2C2C" strokeWidth="12" fill="none"/>
      
      {/* Ears */}
      <ellipse cx="70" cy="45" rx="12" ry="16" fill="#7C7C7C"/>
      <ellipse cx="130" cy="45" rx="12" ry="16" fill="#7C7C7C"/>
      <ellipse cx="70" cy="47" rx="7" ry="10" fill="#FFB380"/>
      <ellipse cx="130" cy="47" rx="7" ry="10" fill="#FFB380"/>
      
      {/* Eyes */}
      <ellipse cx="85" cy="65" rx="8" ry={isBlinking ? 2 : 12} fill="#FFFFFF"/>
      <ellipse cx="115" cy="65" rx="8" ry={isBlinking ? 2 : 12} fill="#FFFFFF"/>
      <ellipse cx="85" cy="67" rx="5" ry={isBlinking ? 2 : 8} fill="#2C2C2C"/>
      <ellipse cx="115" cy="67" rx="5" ry={isBlinking ? 2 : 8} fill="#2C2C2C"/>
      {!isBlinking && <circle cx="87" cy="64" r="2" fill="#FFFFFF"/>}
      {!isBlinking && <circle cx="117" cy="64" r="2" fill="#FFFFFF"/>}
      
      {/* Nose */}
      <circle cx="100" cy="80" r="5" fill="#2C2C2C"/>
      
      {/* Smile */}
      {(animation === 'greeting' || animation === 'celebrating' || animation === 'encouraging' || animation === 'cheering') && (
        <path d="M 90 85 Q 100 90 110 85" stroke="#7C7C7C" strokeWidth="2" fill="none"/>
      )}
    </g>
    
    {/* Teal polo shirt */}
    <g>
      <path d="M 75 110 L 68 142 L 68 180 L 132 180 L 132 142 L 125 110 Z" fill="#0F4C45"/>
      <path d="M 95 110 Q 100 115 105 110" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
    </g>
    
    {/* Yellow cap/visor */}
    <g>
      <ellipse cx="100" cy="40" rx="35" ry="8" fill="#D4F663"/>
      <path d="M 65 40 Q 60 35 55 35 L 55 42 L 65 42 Z" fill="#D4F663"/>
    </g>
    
    {/* Whistle on neck */}
    <g>
      <line x1="100" y1="100" x2="100" y2="108" stroke="#FFD700" strokeWidth="2"/>
      <circle cx="100" cy="110" r="4" fill="#FFD700"/>
    </g>
    
    {/* Arms */}
    <g className="arm-left">
      <ellipse cx="62" cy="148" rx="13" ry="32" fill="#7C7C7C" transform="rotate(-12 62 148)"/>
      <circle cx="60" cy="176" r="11" fill="#A0826D"/>
    </g>
    <g className="arm-right">
      <ellipse cx="138" cy="148" rx="13" ry="32" fill="#7C7C7C" transform="rotate(12 138 148)"/>
      <circle cx="140" cy="176" r="11" fill="#A0826D"/>
    </g>
    
    {/* Stopwatch or trophy (sometimes) */}
    {animation === 'teaching' && (
      <g>
        <circle cx="145" cy="125" r="10" fill="#FFD700"/>
        <circle cx="145" cy="125" r="7" fill="#FFFFFF"/>
        <line x1="145" y1="115" x2="145" y2="110" stroke="#FFD700" strokeWidth="2"/>
      </g>
    )}
    
    {/* Striped tail */}
    <g className="tail">
      <ellipse cx="142" cy="170" rx="18" ry="38" fill="#7C7C7C" transform="rotate(30 142 170)"/>
      <rect x="135" y="160" width="14" height="8" fill="#2C2C2C" transform="rotate(30 142 164)"/>
      <rect x="135" y="175" width="14" height="8" fill="#2C2C2C" transform="rotate(30 142 179)"/>
    </g>
    
    {/* Legs */}
    <ellipse cx="85" cy="207" rx="16" ry="11" fill="#7C7C7C"/>
    <ellipse cx="115" cy="207" rx="16" ry="11" fill="#7C7C7C"/>
    
    {/* Celebration sparkles */}
    {animation === 'celebrating' && (
      <>
        <circle className="sparkle" cx="40" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="160" cy="50" r="5" fill="#D4F663"/>
        <circle className="sparkle" cx="100" cy="20" r="5" fill="#FFD700"/>
      </>
    )}
  </svg>
);
