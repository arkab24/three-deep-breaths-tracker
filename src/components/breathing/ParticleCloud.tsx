import { useFrame } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { BreathingState } from '@/hooks/useBreathingState';
import { getParticleColor } from '@/utils/particleUtils';

interface ParticleCloudProps {
  breathingState: BreathingState;
  isAnimating: boolean;
}

export const ParticleCloud = ({ breathingState, isAnimating }: ParticleCloudProps) => {
  const pointsRef = useRef<THREE.Points>(null);

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

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.getAttribute('position').array as Float32Array;
    
    // Update particle positions
    for (let i = 0; i < positions.length; i += 3) {
      const scale = isAnimating ? (breathingState === 'inhale' ? 1.2 : 0.8) : 1;
      
      positions[i] *= scale + Math.sin(time + i) * 0.02;
      positions[i + 1] *= scale + Math.cos(time + i) * 0.02;
      positions[i + 2] *= scale + Math.sin(time + i) * 0.02;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef}>
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
        color={getParticleColor(breathingState)}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
};