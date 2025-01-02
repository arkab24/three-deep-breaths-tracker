import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { createParticlePositions, getParticleColor } from '../utils/particleUtils';
import { BreathingState } from './useBreathingState';

export const useParticleSystem = (breathingState: BreathingState) => {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const points = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => createParticlePositions(5000), []);

  useEffect(() => {
    const newGeometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(particles, 3);
    newGeometry.setAttribute('position', positionAttribute);
    geometry.current = newGeometry;

    const newMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: getParticleColor(breathingState),
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
    });
    material.current = newMaterial;

    const newPoints = new THREE.Points(newGeometry, newMaterial);
    points.current = newPoints;

    return () => {
      geometry.current?.dispose();
      material.current?.dispose();
      geometry.current = null;
      material.current = null;
      points.current = null;
    };
  }, [particles, breathingState]);

  return {
    points,
    geometry,
    particles,
  };
};