import { useEffect, useState } from 'react';

interface TeacherOwlProps {
  pose?: 'greeting' | 'listening' | 'explaining' | 'encouraging' | 'celebrating';
  size?: number;
}

export const TeacherOwl = ({ 
  pose = 'greeting', 
  size = 140,
}: TeacherOwlProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Reset animation
    setAnimationClass('');
    
    // Trigger animation after small delay
    const timer = setTimeout(() => {
      setAnimationClass('animate');
    }, 50);

    return () => clearTimeout(timer);
  }, [pose]);

  return (
    <div 
      className={`owl-container ${animationClass}`}
      data-pose={pose}
      style={{ width: size, height: size * 1.3 }}
    >
      <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <g className="owl-body">
          <ellipse cx="100" cy="150" rx="55" ry="75" fill="#8B6F47"/>
          <ellipse cx="100" cy="160" rx="35" ry="50" fill="#F5E6D3"/>
        </g>
        
        {/* Head - this will tilt for listening */}
        <g className="owl-head">
          <ellipse cx="100" cy="75" rx="50" ry="48" fill="#8B6F47"/>
          
          {/* Ear tufts */}
          <path d="M 60 40 L 55 15 L 70 35 Z" fill="#8B6F47"/>
          <path d="M 140 40 L 145 15 L 130 35 Z" fill="#8B6F47"/>
          
          {/* Eye patches */}
          <circle cx="80" cy="70" r="22" fill="#A0826D"/>
          <circle cx="120" cy="70" r="22" fill="#A0826D"/>
          
          {/* Eyes */}
          <ellipse cx="80" cy="70" rx="12" ry="16" fill="#FFFFFF"/>
          <ellipse cx="120" cy="70" rx="12" ry="16" fill="#FFFFFF"/>
          
          {/* Pupils */}
          <circle cx="80" cy="72" r="8" fill="#2C2C2C"/>
          <circle cx="120" cy="72" r="8" fill="#2C2C2C"/>
          
          {/* Eye shine */}
          <circle cx="78" cy="68" r="3" fill="#FFFFFF"/>
          <circle cx="118" cy="68" r="3" fill="#FFFFFF"/>
          
          {/* GLASSES */}
          <g>
            <circle cx="80" cy="70" r="18" fill="none" stroke="#2C2C2C" strokeWidth="3"/>
            <circle cx="120" cy="70" r="18" fill="none" stroke="#2C2C2C" strokeWidth="3"/>
            <line x1="98" y1="70" x2="102" y2="70" stroke="#2C2C2C" strokeWidth="3"/>
            <path d="M 62 70 L 50 68" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 138 70 L 150 68" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round"/>
          </g>
          
          {/* Beak */}
          <path d="M 100 85 L 95 92 L 105 92 Z" fill="#FFB84D"/>
          
          {/* Smile - appears during greeting/celebrating */}
          {(pose === 'greeting' || pose === 'celebrating') && (
            <path d="M 90 95 Q 100 100 110 95" stroke="#8B6F47" strokeWidth="2" fill="none" className="owl-smile"/>
          )}
        </g>
        
        {/* Bow tie */}
        <g>
          <path d="M 85 115 L 75 120 L 85 125 Z" fill="#0F4C45"/>
          <path d="M 115 115 L 125 120 L 115 125 Z" fill="#0F4C45"/>
          <rect x="97" y="118" width="6" height="4" rx="1" fill="#0F4C45"/>
        </g>
        
        {/* LEFT WING - will wave for greeting */}
        <g className="left-wing">
          <ellipse cx="50" cy="155" rx="18" ry="35" fill="#8B6F47" transform="rotate(-10 50 155)"/>
        </g>
        
        {/* RIGHT WING */}
        <g className="right-wing">
          <ellipse cx="150" cy="155" rx="18" ry="35" fill="#8B6F47" transform="rotate(10 150 155)"/>
        </g>
        
        {/* Feet */}
        <ellipse cx="85" cy="225" rx="12" ry="8" fill="#FFB84D"/>
        <ellipse cx="115" cy="225" rx="12" ry="8" fill="#FFB84D"/>
        
        {/* Celebration sparkles */}
        {pose === 'celebrating' && animationClass === 'animate' && (
          <>
            <circle className="sparkle" cx="40" cy="50" r="5" fill="#D4F663"/>
            <circle className="sparkle" cx="160" cy="50" r="5" fill="#D4F663"/>
            <circle className="sparkle" cx="100" cy="20" r="5" fill="#D4F663"/>
            <circle className="sparkle" cx="50" cy="100" r="4" fill="#FFD700"/>
            <circle className="sparkle" cx="150" cy="100" r="4" fill="#FFD700"/>
          </>
        )}
      </svg>

      <style>{`
        .owl-container {
          display: inline-block;
          position: relative;
        }

        /* GREETING ANIMATION - BIG WAVE */
        .owl-container[data-pose="greeting"].animate {
          animation: bodyWiggle 2s ease-in-out;
        }

        .owl-container[data-pose="greeting"].animate .left-wing {
          animation: bigWave 2s ease-in-out;
          transform-origin: 50px 155px;
        }

        .owl-container[data-pose="greeting"].animate .owl-smile {
          animation: smileAppear 0.5s ease-out 0.3s both;
        }

        @keyframes bigWave {
          0%, 100% { transform: rotate(-10deg); }
          15%, 45%, 75% { transform: rotate(-70deg); }
          30%, 60%, 90% { transform: rotate(-30deg); }
        }

        @keyframes bodyWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }

        @keyframes smileAppear {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* LISTENING ANIMATION - HEAD TILT */
        .owl-container[data-pose="listening"].animate .owl-head {
          animation: headTilt 1.5s ease-in-out;
          transform-origin: 100px 90px;
        }

        @keyframes headTilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }

        /* EXPLAINING ANIMATION - NOD UP AND DOWN */
        .owl-container[data-pose="explaining"].animate .owl-head {
          animation: nod 1.8s ease-in-out;
          transform-origin: 100px 90px;
        }

        @keyframes nod {
          0%, 100% { transform: translateY(0); }
          20%, 60% { transform: translateY(-15px); }
          40%, 80% { transform: translateY(0); }
        }

        /* ENCOURAGING ANIMATION - BIG JUMP */
        .owl-container[data-pose="encouraging"].animate {
          animation: encouragingJump 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .owl-container[data-pose="encouraging"].animate .left-wing,
        .owl-container[data-pose="encouraging"].animate .right-wing {
          animation: wingsFlap 1.2s ease-in-out;
        }

        @keyframes encouragingJump {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-30px) scale(1.05); }
          60% { transform: translateY(-10px) scale(1.02); }
        }

        @keyframes wingsFlap {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-30deg); }
          60% { transform: rotate(0deg); }
        }

        /* CELEBRATING ANIMATION - DANCE + SPIN */
        .owl-container[data-pose="celebrating"].animate {
          animation: celebrationDance 3s ease-in-out;
        }

        .owl-container[data-pose="celebrating"].animate .left-wing {
          animation: wingCelebrate 0.6s ease-in-out infinite;
          transform-origin: 50px 155px;
        }

        .owl-container[data-pose="celebrating"].animate .right-wing {
          animation: wingCelebrate 0.6s ease-in-out infinite;
          transform-origin: 150px 155px;
        }

        .owl-container[data-pose="celebrating"].animate .owl-smile {
          opacity: 1;
        }

        @keyframes celebrationDance {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(-15deg) scale(1.08); }
          20% { transform: rotate(15deg) scale(1.08); }
          30% { transform: rotate(-15deg) scale(1.08); }
          40% { transform: rotate(15deg) scale(1.08); }
          50% { transform: rotate(-10deg) scale(1.05); }
          60% { transform: rotate(10deg) scale(1.05); }
          70% { transform: rotate(-10deg) scale(1.05); }
          80% { transform: rotate(10deg) scale(1.05); }
        }

        @keyframes wingCelebrate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-50deg); }
        }

        /* SPARKLES */
        .sparkle {
          animation: sparkleFloat 1.5s ease-out;
          animation-fill-mode: forwards;
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

        /* Idle breathing (subtle) */
        .owl-container:not(.animate) {
          animation: subtleBreath 4s ease-in-out infinite;
        }

        @keyframes subtleBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
      `}</style>
    </div>
  );
};
