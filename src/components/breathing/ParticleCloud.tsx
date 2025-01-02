import { useFrame } from '@react-three/fiber';
import { useParticleSystem } from '@/hooks/useParticleSystem';
import { calculateParticleScale, updateParticlePositions } from '@/utils/particleUtils';
import { BreathingState } from '@/hooks/useBreathingState';

interface ParticleCloudProps {
  breathingState: BreathingState;
  isAnimating: boolean;
}

export const ParticleCloud = ({ breathingState, isAnimating }: ParticleCloudProps) => {
  const { points, geometry, particles } = useParticleSystem(breathingState);

  useFrame((state) => {
    if (!points.current || !geometry.current || !geometry.current.attributes.position) return;

    const time = state.clock.getElapsedTime();
    const positions = geometry.current.attributes.position.array as Float32Array;
    const scale = calculateParticleScale(breathingState, time);
    
    updateParticlePositions(positions, particles, scale, time);
    geometry.current.attributes.position.needsUpdate = true;
  });

  return <primitive object={points.current} />;
};