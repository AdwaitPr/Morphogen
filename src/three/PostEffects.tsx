import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useUIStore } from '../store/uiStore';

export const PostEffects: React.FC = () => {
  const qualityTier = useUIStore((state) => state.qualityTier);

  // Skip post-processing in Low quality tier to ensure 60fps on low-end hardware
  if (qualityTier === 'low') {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {
        [
          <Bloom
            key="bloom"
            luminanceThreshold={0.55}
            luminanceSmoothing={0.7}
            intensity={0.65}
            mipmapBlur
          />,
          <Vignette
            key="vignette"
            offset={0.3}
            darkness={0.6}
            eskil={false}
          />,
        ] as any
      }
    </EffectComposer>
  );
};
