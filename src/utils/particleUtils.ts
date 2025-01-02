import * as THREE from 'three';

export const createParticlePositions = (particleCount: number): Float32Array => {
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * 1.5;
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  
  return positions;
};

export const getParticleColor = (breathingState: 'idle' | 'inhale' | 'exhale'): string => {
  switch (breathingState) {
    case 'inhale':
      return '#008489';
    case 'exhale':
      return '#00A699';
    default:
      return '#484848';
  }
};

export const calculateParticleScale = (
  breathingState: 'idle' | 'inhale' | 'exhale',
  time: number
): number => {
  if (breathingState === 'inhale') {
    return 1.5 + Math.sin(time * 0.5) * 0.5;
  } else if (breathingState === 'exhale') {
    return 2 - Math.sin(time * 0.5) * 0.5;
  }
  return 1;
};

export const updateParticlePositions = (
  positions: Float32Array,
  initialPositions: Float32Array,
  scale: number,
  time: number
): void => {
  for (let i = 0; i < positions.length; i += 3) {
    const initialX = initialPositions[i];
    const initialY = initialPositions[i + 1];
    const initialZ = initialPositions[i + 2];
    
    positions[i] = initialX * scale + Math.sin(time + i) * 0.02;
    positions[i + 1] = initialY * scale + Math.cos(time + i) * 0.02;
    positions[i + 2] = initialZ * scale + Math.sin(time + i) * 0.02;
  }
};