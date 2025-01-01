import React from 'react';

interface SessionCounterProps {
  currentBreath: number;
  sessionCount: number;
  breathingState: 'idle' | 'inhale' | 'exhale';
  isAnimating: boolean;
}

export const SessionCounter = ({ 
  currentBreath, 
  sessionCount,
  breathingState,
  isAnimating
}: SessionCounterProps) => {
  return (
    <>
      <div className="text-breath-text text-lg md:text-xl mb-2 md:mb-4">
        Breath: {currentBreath}/3
      </div>

      <div className="text-breath-text text-lg md:text-xl mt-2 md:mt-4">
        Sessions completed today: {sessionCount}
      </div>

      {breathingState === 'idle' && !isAnimating && currentBreath > 0 && (
        <div className="text-sm text-breath-text animate-pulse">
          Click to continue your session
        </div>
      )}
    </>
  );
};