import { BreathingState } from '@/hooks/useBreathingState';

export const getParticleColor = (breathingState: BreathingState): string => {
  switch (breathingState) {
    case 'inhale':
      return '#008489';
    case 'exhale':
      return '#00A699';
    default:
      return '#484848';
  }
};