import React, { useState, useEffect, useRef, useMemo } from 'react';

interface XpBarProps {
  currentXp: number;
}

const CONFETTI_COUNT = 40;
const PRAISE_MESSAGES = [
  "You Are Awesome!", 
  "Simply The Best!", 
  "Excellent Work Done!", 
  "Wow, Great Job!",
  "Keep It Up!",
  "Fantastic Progress Made!"
];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const COLORS = ['#FFD700', '#FF6347', '#00CED1', '#9370DB', '#32CD32'];


const XpBar: React.FC<XpBarProps> = ({ currentXp }) => {
  const xpPerLevel = 100;
  const level = Math.floor(currentXp / xpPerLevel) + 1;
  const xpForNextLevel = level * xpPerLevel;
  const xpInCurrentLevel = currentXp % xpPerLevel;
  const progressPercentage = (xpInCurrentLevel / xpPerLevel) * 100;

  const [isCelebrating, setIsCelebrating] = useState(false);
  const [praise, setPraise] = useState<string | null>(null);
  const prevXpRef = useRef(currentXp);

  const confettiPieces = useMemo(() => [...Array(CONFETTI_COUNT).keys()], []);

  useEffect(() => {
    const prevXp = prevXpRef.current;
    
    // Check if XP has actually increased
    if (currentXp > prevXp) {
      // Trigger confetti on any XP gain
      setIsCelebrating(true);
      const celebrationTimer = setTimeout(() => setIsCelebrating(false), 1500);

      // Check for a level up
      const prevLevel = Math.floor(prevXp / xpPerLevel);
      const newLevel = Math.floor(currentXp / xpPerLevel);

      if (newLevel > prevLevel) {
        // Wait for the bar to fill (500ms transition) then show praise
        const praiseTimer = setTimeout(() => {
          setPraise(getRandomItem(PRAISE_MESSAGES));
        }, 500);

        // Hide praise after it has been shown
        const hidePraiseTimer = setTimeout(() => {
          setPraise(null);
        }, 3000);

        // Cleanup timers on unmount or re-render
        return () => {
          clearTimeout(celebrationTimer);
          clearTimeout(praiseTimer);
          clearTimeout(hidePraiseTimer);
        };
      }
      
      // Cleanup for confetti timer if no level up
      return () => clearTimeout(celebrationTimer);
    }
    
    // Update the previous XP ref for the next render
    prevXpRef.current = currentXp;

  }, [currentXp]);

  return (
    <div className="w-full max-w-xs mx-auto">
       <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotateZ(360deg); opacity: 0; }
        }
        .confetti-particle {
          animation: confetti-fall 1s ease-out forwards;
        }
      `}</style>
      <div className="flex justify-between items-center mb-1 text-sm font-semibold">
        <span className="text-yellow-800 dark:text-yellow-300">Level {level}</span>
        <span className="text-gray-600 dark:text-gray-400">
          {currentXp} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner relative">
        <div
          className="bg-yellow-400 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentXp}
          aria-valuemin={ (level - 1) * xpPerLevel }
          aria-valuemax={xpForNextLevel}
          aria-label={`Experience points progress bar, level ${level}.`}
        ></div>
        {praise && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  {praise.split(' ').map((word, i) => (
                      <span key={i} className="inline-block animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                          {word}&nbsp;
                      </span>
                  ))}
              </span>
          </div>
        )}
        {isCelebrating && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
            {confettiPieces.map(i => {
                const style = {
                    left: `${Math.random() * 100}%`,
                    backgroundColor: getRandomItem(COLORS),
                    animationDelay: `${Math.random() * 0.5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                };
                return <div key={i} className="confetti-particle absolute top-0 w-2 h-2 rounded-full" style={style} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default XpBar;