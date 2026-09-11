/**
 * BioSynth Lab — Genome Type Definitions
 *
 * Central type definitions for the genome parameter system.
 * Any change to GenomeParams requires updates to:
 * - Seed encode/decode version prefix
 * - Default genome
 * - All presets
 * - genomeRefs initialization
 */

/**
 * Metadata for a single genome parameter.
 * Defines the valid range, step size, default, and UI labels.
 */
export interface GenomeParamMeta {
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Default value for reset */
  default: number;
  /** Step increment for keyboard/scroll adjustment */
  step: number;
  /** Human-readable label for UI display */
  label: string;
  /** Accessible description for screen readers */
  ariaLabel: string;
  /** Optional unit suffix (e.g., "Hz", "deg") */
  unit?: string;
}

/**
 * The genome parameters that drive the organism's appearance.
 * Each parameter maps to a shader uniform or instancing parameter.
 */
export interface GenomeParams {
  /** Number of branching limbs/tentacles [0, 12] */
  branchCount: number;
  /** Radial symmetry: 0 = chaotic, 1 = perfect mirror [0, 1] */
  symmetry: number;
  /** Emissive glow intensity [0, 1] */
  bioluminescence: number;
  /** Base hue in degrees [0, 360] */
  hue: number;
  /** Color saturation [0, 1] */
  saturation: number;
  /** Breathing animation speed [0.1, 3.0] */
  pulseRate: number;
  /** Noise distortion intensity [0, 1] */
  mutagen: number;
  /** Fractal growth amplitude [0, 1] */
  growth: number;
}

/** Keys of GenomeParams for iteration */
export type GenomeParamKey = keyof GenomeParams;

/** Names of the built-in presets */
export type PresetName = 'SPORE' | 'FERN' | 'POLYP' | 'ABERRATION';

/**
 * Complete metadata for all genome parameters.
 * Used by GeneSlider for range/step, URL encoder for validation,
 * and reset/randomize actions for defaults/bounds.
 */
export const GENOME_META: Record<GenomeParamKey, GenomeParamMeta> = {
  branchCount: {
    min: 0,
    max: 12,
    default: 4,
    step: 1,
    label: 'BRANCHES',
    ariaLabel: 'Number of branching limbs',
  },
  symmetry: {
    min: 0,
    max: 1,
    default: 0.7,
    step: 0.01,
    label: 'SYMMETRY',
    ariaLabel: 'Radial symmetry from chaotic to perfect',
  },
  bioluminescence: {
    min: 0,
    max: 1,
    default: 0.3,
    step: 0.01,
    label: 'BIOLUM',
    ariaLabel: 'Bioluminescence emissive glow intensity',
  },
  hue: {
    min: 0,
    max: 360,
    default: 170,
    step: 1,
    label: 'HUE',
    ariaLabel: 'Base color hue in degrees',
    unit: 'deg',
  },
  saturation: {
    min: 0,
    max: 1,
    default: 0.6,
    step: 0.01,
    label: 'SATURATION',
    ariaLabel: 'Color saturation level',
  },
  pulseRate: {
    min: 0.1,
    max: 3.0,
    default: 0.8,
    step: 0.1,
    label: 'PULSE',
    ariaLabel: 'Breathing animation speed in Hertz',
    unit: 'Hz',
  },
  mutagen: {
    min: 0,
    max: 1,
    default: 0.1,
    step: 0.01,
    label: 'MUTAGEN',
    ariaLabel: 'Noise distortion intensity',
  },
  growth: {
    min: 0,
    max: 1,
    default: 0.5,
    step: 0.01,
    label: 'GROWTH',
    ariaLabel: 'Fractal growth displacement amplitude',
  },
};

/**
 * Derive the default genome from metadata.
 * Single source of truth — never hardcode defaults elsewhere.
 */
export function getDefaultGenome(): GenomeParams {
  const params = {} as GenomeParams;
  for (const key of Object.keys(GENOME_META) as GenomeParamKey[]) {
    params[key] = GENOME_META[key].default;
  }
  return params;
}

/**
 * Clamp a genome parameter to its valid range.
 */
export function clampParam(key: GenomeParamKey, value: number): number {
  const meta = GENOME_META[key];
  return Math.min(meta.max, Math.max(meta.min, value));
}

/**
 * Preset definitions — each overrides ALL 8 params atomically.
 */
export const PRESETS: Record<PresetName, GenomeParams> = {
  SPORE: {
    branchCount: 0,
    symmetry: 0.9,
    bioluminescence: 0.2,
    hue: 90,
    saturation: 0.3,
    pulseRate: 2.5,
    mutagen: 0.05,
    growth: 0.3,
  },
  FERN: {
    branchCount: 8,
    symmetry: 0.95,
    bioluminescence: 0.1,
    hue: 140,
    saturation: 0.7,
    pulseRate: 0.4,
    mutagen: 0.0,
    growth: 0.9,
  },
  POLYP: {
    branchCount: 5,
    symmetry: 0.6,
    bioluminescence: 0.8,
    hue: 200,
    saturation: 0.5,
    pulseRate: 1.2,
    mutagen: 0.15,
    growth: 0.6,
  },
  ABERRATION: {
    branchCount: 12,
    symmetry: 0.1,
    bioluminescence: 0.6,
    hue: 320,
    saturation: 0.9,
    pulseRate: 0.2,
    mutagen: 0.9,
    growth: 1.0,
  },
};
