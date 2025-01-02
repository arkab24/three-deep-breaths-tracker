import { useFrame } from '@react-three/fiber';
import { useParticleSystem } from '@/hooks/useParticleSystem';
import { calculateParticleScale, updateParticlePositions } from '@/utils/particleUtils';
import { BreathingState } from '@/hooks/useBreathingState';
import { Points } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

interface ParticleCloudProps {
  breathingState: BreathingState;
  isAnimating: boolean;
}

export const ParticleCloud = ({ breathingState, isAnimating }: ParticleCloudProps) => {
  const { geometry, material } = useParticleSystem(breathingState);

  useFrame((state) => {
    if (!geometry.current?.attributes.position) return;

    const time = state.clock.getElapsedTime();
    const positions = geometry.current.attributes.position.array as Float32Array;
    const scale = calculateParticleScale(breathingState, time);
    
    updateParticlePositions(positions, positions, scale, time);
    geometry.current.attributes.position.needsUpdate = true;
  });

  // Create vertices for particles
  const vertices = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 1.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          array={vertices}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={material.current?.color}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
};