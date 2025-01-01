import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { WeeklySessionsTracker } from './WeeklySessionsTracker';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { BreathingAnimation } from './breathing/BreathingAnimation';
import { SessionCounter } from './breathing/SessionCounter';

type BreathingState = 'idle' | 'inhale' | 'exhale';

export const BreathingCircle = () => {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [currentBreath, setCurrentBreath] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const queryClient = useQueryClient();

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
          handleSessionComplete();
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
          setBreathingState('inhale');
        }
      }, 5000); // 5 seconds for exhale
    }

    return () => clearTimeout(timer);
  }, [breathingState, currentBreath]);

  const handleSessionComplete = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('sessions')
        .insert([{
          user_id: user.id
        }]);

      if (error) throw error;

      // Invalidate the sessions query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      console.log('Session recorded successfully');
    } catch (error) {
      console.error('Error recording session:', error);
      toast({
        title: "Error",
        description: "Failed to record session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCircleClick = () => {
    if (breathingState === 'idle' && !isAnimating) {
      console.log('Starting new breath');
      setIsAnimating(true);
      setBreathingState('inhale');
    }
  };

  return (
    <div className="min-h-[50vh] md:min-h-[60vh] bg-breath-background flex flex-col items-center justify-center gap-6 md:gap-8 px-4 rounded-lg">
      <h1 className="text-2xl md:text-3xl font-semibold text-breath-text">Three Deep Breaths</h1>
      
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <SessionCounter 
          currentBreath={currentBreath}
          sessionCount={sessionCount}
          breathingState={breathingState}
          isAnimating={isAnimating}
        />

        <BreathingAnimation 
          breathingState={breathingState}
          isAnimating={isAnimating}
          currentBreath={currentBreath}
          onCircleClick={handleCircleClick}
        />
      </div>
    </div>
  );
};
