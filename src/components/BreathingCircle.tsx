import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type BreathingState = 'idle' | 'inhale' | 'exhale';

export const BreathingCircle = () => {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [currentBreath, setCurrentBreath] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (breathingState === 'inhale') {
      console.log('Starting inhale phase');
      timer = setTimeout(() => {
        console.log('Inhale complete, starting exhale');
        setBreathingState('exhale');
      }, 5000); // 5 seconds for inhale
    } else if (breathingState === 'exhale') {
      console.log('Processing exhale phase');
      timer = setTimeout(() => {
        const newBreathCount = currentBreath + 1;
        console.log(`Breath ${newBreathCount}/3 completed`);
        
        if (newBreathCount === 3) {
          setSessionCount(prev => prev + 1);
          setCurrentBreath(0);
          setBreathingState('idle');
          setIsAnimating(false);
          toast({
            title: "Session Complete!",
            description: "You've completed 3 deep breaths. Great job!",
          });
          console.log('Session completed, count increased');
        } else {
          setCurrentBreath(newBreathCount);
          // Automatically start the next breath
          setBreathingState('inhale');
        }
      }, 5000); // 5 seconds for exhale
    }

    return () => clearTimeout(timer);
  }, [breathingState, currentBreath]);

  const handleCircleClick = () => {
    if (breathingState === 'idle' && !isAnimating) {
      console.log('Starting new breath');
      setIsAnimating(true);
      setBreathingState('inhale');
    }
  };

  const getCircleStyles = () => {
    const baseStyles = "w-48 h-48 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 relative"; // Reduced from w-64 h-64
    
    if (breathingState === 'inhale') {
      return `${baseStyles} bg-breath-inhale animate-fill`;
    } else if (breathingState === 'exhale') {
      return `${baseStyles} bg-breath-exhale animate-shrink`;
    }
    return `${baseStyles} bg-white border-2 border-breath-text`;
  };

  return (
    <div className="min-h-screen bg-breath-background flex flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-3xl font-semibold text-breath-text">Three Deep Breaths</h1>
      
      <div className="flex flex-col items-center gap-8">
        <div className="text-breath-text text-xl mb-4">
          Breath: {currentBreath}/3
        </div>

        <div
          onClick={handleCircleClick}
          className={getCircleStyles()}
        >
          <span className="text-xl text-breath-text"> {/* Reduced from text-2xl */}
            {breathingState === 'idle' 
              ? (isAnimating ? '' : 'Click to begin') 
              : breathingState === 'inhale' 
                ? 'Inhale...' 
                : 'Exhale...'}
          </span>
        </div>

        <div className="text-breath-text text-xl mt-4">
          Sessions completed today: {sessionCount}
        </div>
      </div>

      {breathingState === 'idle' && !isAnimating && currentBreath > 0 && (
        <div className="text-sm text-breath-text animate-pulse">
          Click to continue your session
        </div>
      )}
    </div>
  );
};