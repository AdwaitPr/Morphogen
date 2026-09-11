import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useUIStore } from '../store/uiStore';

export const QualityManager: React.FC = () => {
  const qualityTier = useUIStore((state) => state.qualityTier);
  const setQualityTier = useUIStore((state) => state.setQualityTier);

  const frameCount = useRef<number>(0);
  const lowFpsCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Evaluate once every 2 seconds
    if (elapsed >= 2000) {
      const currentFps = (frameCount.current * 1000) / elapsed;

      if (currentFps < 42) {
        lowFpsCount.current += 1;
        // Two consecutive slow windows -> downgrade quality tier
        if (lowFpsCount.current >= 2) {
          if (qualityTier === 'high') {
            console.warn('BioSynth: Degrading to medium quality tier for sustained 60fps.');
            setQualityTier('medium');
          } else if (qualityTier === 'medium') {
            console.warn('BioSynth: Degrading to low quality tier for sustained 60fps.');
            setQualityTier('low');
          }
          lowFpsCount.current = 0;
        }
      } else {
        lowFpsCount.current = 0;
      }

      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
};
