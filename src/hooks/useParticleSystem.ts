import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { getParticleColor } from '../utils/particleUtils';
import { BreathingState } from './useBreathingState';

export const useParticleSystem = (breathingState: BreathingState) => {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  useEffect(() => {
    const newGeometry = new THREE.BufferGeometry();
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

    return () => {
      geometry.current?.dispose();
      material.current?.dispose();
    };
  }, [breathingState]);

  return {
    geometry,
    material,
  };
};