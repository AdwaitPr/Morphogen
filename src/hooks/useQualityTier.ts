import { useEffect } from 'react';
import { useUIStore, QualityTier } from '../store/uiStore';

export function useQualityTier() {
  const qualityTier = useUIStore((state) => state.qualityTier);
  const setQualityTier = useUIStore((state) => state.setQualityTier);

  useEffect(() => {
    // Initial GPU detection
    import('detect-gpu')
      .then(({ getGPUTier }) => getGPUTier())
      .then((gpuTier) => {
        let detected: QualityTier = 'high';
        if (gpuTier.tier <= 1 || gpuTier.isMobile) {
          detected = 'low';
        } else if (gpuTier.tier === 2) {
          detected = 'medium';
        }
        setQualityTier(detected);
      })
      .catch(() => {
        // Fallback to high
        setQualityTier('high');
      });
  }, [setQualityTier]);

  return { qualityTier, setQualityTier };
}
