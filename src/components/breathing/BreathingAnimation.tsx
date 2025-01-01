import React from 'react';

type BreathingState = 'idle' | 'inhale' | 'exhale';

interface BreathingAnimationProps {
  breathingState: BreathingState;
  isAnimating: boolean;
  currentBreath: number;
  onCircleClick: () => void;
}

export const BreathingAnimation = ({ 
  breathingState, 
  isAnimating, 
  currentBreath,
  onCircleClick 
}: BreathingAnimationProps) => {
  const getCircleStyles = () => {
    const baseStyles = "w-64 h-64 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 relative";
    
    if (breathingState === 'inhale') {
      return `${baseStyles} text-breath-inhale animate-fill border-2 border-transparent`;
    } else if (breathingState === 'exhale') {
      return `${baseStyles} text-breath-exhale animate-shrink border-2 border-transparent`;
    }
    return `${baseStyles} bg-transparent border-2 border-breath-text`;
  };

  return (
    <div className="relative">
      <div
        onClick={onCircleClick}
        className={getCircleStyles()}
      >
        <span className="text-xl text-breath-text z-10 absolute">
          {breathingState === 'idle' 
            ? (isAnimating ? '' : 'Click to begin') 
            : breathingState === 'inhale' 
              ? 'Inhale...' 
              : 'Exhale...'}
        </span>
      </div>
    </div>
  );
};