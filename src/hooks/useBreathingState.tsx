import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type BreathingState = 'idle' | 'inhale' | 'exhale';

interface UseBreathingStateProps {
  onSessionComplete: () => Promise<void>;
}

export const useBreathingState = ({ onSessionComplete }: UseBreathingStateProps) => {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [currentBreath, setCurrentBreath] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (breathingState === 'inhale') {
      console.log('Starting inhale phase');
      timer = setTimeout(() => {
        console.log('Inhale complete, starting exhale');
        setBreathingState('exhale');
      }, 5000);
    } else if (breathingState === 'exhale') {
      console.log('Processing exhale phase');
      timer = setTimeout(() => {
        const newBreathCount = currentBreath + 1;
        console.log(`Breath ${newBreathCount}/3 completed`);
        
        if (newBreathCount === 3) {
          onSessionComplete();
          setCurrentBreath(0);
          setBreathingState('idle');
          setIsAnimating(false);
          toast({
            title: "Session Complete!",
            description: "You've completed 3 deep breaths. Great job!",
            duration: 3000, // 3 seconds
          });
          console.log('Session completed, count increased');
        } else {
          setCurrentBreath(newBreathCount);
          setBreathingState('inhale');
        }
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [breathingState, currentBreath, onSessionComplete]);

  const startBreathing = () => {
    if (breathingState === 'idle' && !isAnimating) {
      console.log('Starting new breath');
      setIsAnimating(true);
      setBreathingState('inhale');
    }
  };

  return {
    breathingState,
    currentBreath,
    isAnimating,
    startBreathing
  };
};