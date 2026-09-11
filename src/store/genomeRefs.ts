import { GenomeParams, getDefaultGenome, GenomeParamKey } from '../types/genome';

/**
 * BioSynth Lab — Genome Mutable Refs (Tier 1 Hot Path)
 *
 * Dedicated, isolated module for 60fps mutable values.
 * During slider drag or animation ticks, pointer events update these refs directly.
 * The R3F useFrame loop in OrganismMaterial reads directly from here with zero React renders.
 */

const defaultGenome = getDefaultGenome();

export const genomeRefs: Record<GenomeParamKey, { current: number }> = {
  branchCount: { current: defaultGenome.branchCount },
  symmetry: { current: defaultGenome.symmetry },
  bioluminescence: { current: defaultGenome.bioluminescence },
  hue: { current: defaultGenome.hue },
  saturation: { current: defaultGenome.saturation },
  pulseRate: { current: defaultGenome.pulseRate },
  mutagen: { current: defaultGenome.mutagen },
  growth: { current: defaultGenome.growth },
};

/**
 * Updates a ref value directly (Tier 1 hot path).
 */
export function updateGenomeRef(key: GenomeParamKey, value: number) {
  genomeRefs[key].current = value;
}

/**
 * Synchronizes all refs atomically from an external GenomeParams snapshot
 * (used on preset apply, randomization, reset, or URL load).
 * If a parameter is currently locked by active drag (`dragLock`), that parameter is preserved.
 */
export function syncGenomeRefs(
  params: Partial<GenomeParams>,
  dragLock: GenomeParamKey | null = null
) {
  (Object.keys(params) as GenomeParamKey[]).forEach((key) => {
    if (key === dragLock) return; // Skip currently dragged parameter
    const val = params[key];
    if (val !== undefined) {
      genomeRefs[key].current = val;
    }
  });
}
