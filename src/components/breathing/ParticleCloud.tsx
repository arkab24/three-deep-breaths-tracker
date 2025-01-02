import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BreathingState } from '@/hooks/useBreathingState';

interface ParticleCloudProps {
  breathingState: BreathingState;
  isAnimating: boolean;
}

export const ParticleCloud = ({ breathingState, isAnimating }: ParticleCloudProps) => {
  const points = useRef<THREE.Points>(null);
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  
  // Create particles
  const particles = useMemo(() => {
    const particleCount = 5000;
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
  }, []);

  // Initialize geometry and material
  useEffect(() => {
    // Create new geometry
    const newGeometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(particles, 3);
    newGeometry.setAttribute('position', positionAttribute);
    geometry.current = newGeometry;

    // Create new material
    const newMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: breathingState === 'inhale' ? '#008489' : breathingState === 'exhale' ? '#00A699' : '#484848',
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
    });
    material.current = newMaterial;

    // Create points
    const newPoints = new THREE.Points(newGeometry, newMaterial);
    points.current = newPoints;

    // Cleanup function
    return () => {
      if (geometry.current) {
        geometry.current.dispose();
      }
      if (material.current) {
        material.current.dispose();
      }
      geometry.current = null;
      material.current = null;
      points.current = null;
    };
  }, [particles, breathingState]);

  useFrame((state) => {
    if (!points.current || !geometry.current || !geometry.current.attributes.position) return;

    const time = state.clock.getElapsedTime();
    const positions = geometry.current.attributes.position.array as Float32Array;
    
    // Calculate scale based on breathing state
    let scale = 1;
    if (breathingState === 'inhale') {
      scale = 1.5 + Math.sin(time * 0.5) * 0.5;
    } else if (breathingState === 'exhale') {
      scale = 2 - Math.sin(time * 0.5) * 0.5;
    }

    // Update particle positions
    for (let i = 0; i < positions.length; i += 3) {
      const initialX = particles[i];
      const initialY = particles[i + 1];
      const initialZ = particles[i + 2];
      
      positions[i] = initialX * scale + Math.sin(time + i) * 0.02;
      positions[i + 1] = initialY * scale + Math.cos(time + i) * 0.02;
      positions[i + 2] = initialZ * scale + Math.sin(time + i) * 0.02;
    }
    
    geometry.current.attributes.position.needsUpdate = true;
  });

  return (
    <primitive object={points.current} />
  );
};