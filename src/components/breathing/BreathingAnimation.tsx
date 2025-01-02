import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ParticleCloud } from './ParticleCloud';
import { ErrorBoundary } from 'react-error-boundary';

type BreathingState = 'idle' | 'inhale' | 'exhale';

interface BreathingAnimationProps {
  breathingState: BreathingState;
  isAnimating: boolean;
  currentBreath: number;
  onCircleClick: () => void;
}

const FallbackComponent = () => (
  <div className="w-full h-full flex items-center justify-center text-breath-text">
    Loading animation...
  </div>
);

export const BreathingAnimation = ({ 
  breathingState, 
  isAnimating, 
  onCircleClick 
}: BreathingAnimationProps) => {
  return (
    <div 
      className="w-48 h-48 md:w-64 md:h-64 relative cursor-pointer"
      onClick={onCircleClick}
    >
      <ErrorBoundary
        fallback={<FallbackComponent />}
        onError={(error) => {
          console.error('Error in breathing animation:', error);
        }}
      >
        <Suspense fallback={<FallbackComponent />}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <ParticleCloud 
              breathingState={breathingState}
              isAnimating={isAnimating}
            />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              enableRotate={false} 
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-lg md:text-xl text-breath-text z-10">
          {breathingState === 'idle' 
            ? (isAnimating ? '' : 'Click to begin') 
            : breathingState === 'inhale' 
              ? 'Inhale...' 
              : 'Exhale...'}
        </span>
      </div>
    </div>
  );
};