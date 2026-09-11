import { useState, useEffect } from 'react';

export interface ShaderUniformOverrides {
  growth: number;
  mutagen: number;
  pulseRate: number;
  bioluminescence: number;
  baseColor: string;
}

const DEFAULT_SHADER_PARAMS: ShaderUniformOverrides = {
  growth: 0.65,
  mutagen: 0.15,
  pulseRate: 1.2,
  bioluminescence: 0.85,
  baseColor: '#0f2b26',
};

/**
 * useShaderDebug
 *
 * Dev-only hook providing direct controls for GLSL uniforms.
 * Gated strictly by `?debug=shader` in URL query parameters.
 */
export function useShaderDebug(): ShaderUniformOverrides {
  const [params, setParams] = useState<ShaderUniformOverrides>(DEFAULT_SHADER_PARAMS);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') !== 'shader') return;

    // Check for query param overrides e.g. ?debug=shader&growth=0.9
    const growth = urlParams.get('growth');
    const mutagen = urlParams.get('mutagen');
    const pulseRate = urlParams.get('pulseRate');
    const bioluminescence = urlParams.get('bioluminescence');
    const baseColor = urlParams.get('baseColor');

    setParams((prev) => ({
      growth: growth ? parseFloat(growth) : prev.growth,
      mutagen: mutagen ? parseFloat(mutagen) : prev.mutagen,
      pulseRate: pulseRate ? parseFloat(pulseRate) : prev.pulseRate,
      bioluminescence: bioluminescence ? parseFloat(bioluminescence) : prev.bioluminescence,
      baseColor: baseColor ? `#${baseColor.replace('#', '')}` : prev.baseColor,
    }));
  }, []);

  return params;
}
