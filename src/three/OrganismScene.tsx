import React, { useState, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { Lighting } from './Lighting';
import { CameraRig } from './CameraRig';
import { Organism } from './Organism';
import { DnaHelix } from './DnaHelix';
import { NutrientParticles } from './NutrientParticles';
import { QualityManager } from './QualityManager';
import { PostEffects } from './PostEffects';
import { ContextLostOverlay } from './ContextLostOverlay';
import { useUIStore } from '../store/uiStore';

interface OrganismSceneProps {
  onFpsUpdate?: (fps: number) => void;
}

export const OrganismScene: React.FC<OrganismSceneProps> = () => {
  const [contextLost, setContextLost] = useState<boolean>(false);
  const qualityTier = useUIStore((state) => state.qualityTier);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
      console.warn('BioSynth Lab: WebGL context lost.');
    };

    const onContextRestored = () => {
      setContextLost(false);
      console.info('BioSynth Lab: WebGL context restored.');
    };

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);
  }, []);

  return (
    <div className="relative w-full h-full bg-bg-base overflow-hidden">
      <Canvas
        dpr={qualityTier === 'low' ? 1 : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0, 5],
        }}
        onCreated={handleCreated}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#0E1114']} />
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <Lighting />
          <CameraRig />
          <Organism />
          <DnaHelix />
          <NutrientParticles />
          <QualityManager />
          <PostEffects />
        </Suspense>
      </Canvas>

      {/* WebGL Context Loss Recovery Overlay */}
      <ContextLostOverlay lost={contextLost} />
    </div>
  );
};
