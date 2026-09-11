import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * usePerformanceMonitor
 *
 * Tracks FPS and frame times inside the R3F render loop.
 * Updates state once per second to avoid triggering re-renders every frame.
 */
export function usePerformanceMonitor() {
  const [fps, setFps] = useState<number>(60);
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();
    const delta = now - lastTime.current;

    if (delta >= 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / delta);
      setFps(currentFps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return { fps };
}
