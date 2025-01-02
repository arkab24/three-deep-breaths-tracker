import React from 'react';
import { BreathingAnimation } from './breathing/BreathingAnimation';
import { SessionCounter } from './breathing/SessionCounter';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { useBreathingState } from '@/hooks/useBreathingState';

export const BreathingCircle = () => {
  const { todaySessions, handleSessionComplete } = useSessionManagement();
  const { breathingState, currentBreath, isAnimating, startBreathing } = useBreathingState({
    onSessionComplete: handleSessionComplete
  });

  return (
    <div className="min-h-[70vh] md:min-h-[80vh] bg-breath-background flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-4 md:py-6 rounded-lg">
      <h1 className="text-2xl md:text-3xl font-semibold text-breath-text mb-2 md:mb-4">Three Deep Breaths</h1>
      
      <div className="flex flex-col items-center">
        <div className="space-y-1 md:space-y-2 mb-8 md:mb-12 text-center">
          <SessionCounter 
            currentBreath={currentBreath}
            sessionCount={todaySessions?.length || 0}
            breathingState={breathingState}
            isAnimating={isAnimating}
          />
        </div>

        <BreathingAnimation 
          breathingState={breathingState}
          isAnimating={isAnimating}
          currentBreath={currentBreath}
          onCircleClick={startBreathing}
        />
      </div>
    </div>
  );
};