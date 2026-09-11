import { describe, it, expect, beforeEach } from 'vitest';
import { useGenomeStore } from '../src/store/genomeStore';
import { useSimulationStore } from '../src/store/simulationStore';
import { useUIStore } from '../src/store/uiStore';
import { getDefaultGenome, PRESETS, GENOME_META } from '../src/types/genome';
import { genomeRefs } from '../src/store/genomeRefs';

describe('GenomeStore Operations Suite', () => {
  beforeEach(() => {
    useUIStore.getState().setDragLock(null);
    useUIStore.getState().setMorphLock(false);
    useGenomeStore.getState().resetToDefault();
  });

  it('initializes with default genome', () => {
    const defaults = getDefaultGenome();
    const current = useGenomeStore.getState().params;
    expect(current).toEqual(defaults);
  });

  it('clamps parameter values when updated via setParam', () => {
    const { setParam } = useGenomeStore.getState();

    // Mutagen has min 0, max 1
    setParam('mutagen', 5.0);
    expect(useGenomeStore.getState().params.mutagen).toBe(1.0);
    expect(genomeRefs.mutagen.current).toBe(1.0);

    setParam('mutagen', -2.0);
    expect(useGenomeStore.getState().params.mutagen).toBe(0.0);
    expect(genomeRefs.mutagen.current).toBe(0.0);

    // Hue has min 0, max 360
    setParam('hue', 720);
    expect(useGenomeStore.getState().params.hue).toBe(360);
    expect(genomeRefs.hue.current).toBe(360);
  });

  it('accurately applies presets (SPORE, FERN, POLYP, ABERRATION)', () => {
    const { applyPreset } = useGenomeStore.getState();

    applyPreset('FERN');
    let params = useGenomeStore.getState().params;
    expect(params.branchCount).toBe(PRESETS.FERN.branchCount);
    expect(params.symmetry).toBe(PRESETS.FERN.symmetry);
    expect(params.hue).toBe(PRESETS.FERN.hue);

    applyPreset('ABERRATION');
    params = useGenomeStore.getState().params;
    expect(params.branchCount).toBe(PRESETS.ABERRATION.branchCount);
    expect(params.mutagen).toBe(PRESETS.ABERRATION.mutagen);
    expect(params.pulseRate).toBe(PRESETS.ABERRATION.pulseRate);
  });

  it('randomize produces valid bounded values for all 8 loci', () => {
    const { randomize } = useGenomeStore.getState();
    randomize();

    const params = useGenomeStore.getState().params;
    (Object.keys(GENOME_META) as (keyof typeof GENOME_META)[]).forEach((key) => {
      const val = params[key];
      const meta = GENOME_META[key];
      expect(val).toBeGreaterThanOrEqual(meta.min);
      expect(val).toBeLessThanOrEqual(meta.max);
    });
  });

  it('resetToDefault restores all loci to default values', () => {
    const { randomize, resetToDefault } = useGenomeStore.getState();
    randomize();
    resetToDefault();

    const current = useGenomeStore.getState().params;
    expect(current).toEqual(getDefaultGenome());
  });
});

describe('SimulationStore State Suite', () => {
  it('toggles pause state correctly', () => {
    const { togglePause } = useSimulationStore.getState();
    const initial = useSimulationStore.getState().paused;

    togglePause();
    expect(useSimulationStore.getState().paused).toBe(!initial);

    togglePause();
    expect(useSimulationStore.getState().paused).toBe(initial);
  });

  it('advances simulation tick and modulates temperature/viscosity', () => {
    const { incrementTick, setEnvironmentParam } = useSimulationStore.getState();
    const initialTick = useSimulationStore.getState().tick;

    incrementTick();
    expect(useSimulationStore.getState().tick).toBe(initialTick + 1);

    setEnvironmentParam('temperature', 42.5);
    expect(useSimulationStore.getState().temperature).toBe(42.5);

    setEnvironmentParam('viscosity', 1.85);
    expect(useSimulationStore.getState().viscosity).toBe(1.85);
  });
});

describe('UIStore Quality & A11y Suite', () => {
  it('updates quality tier correctly', () => {
    const { setQualityTier } = useUIStore.getState();
    setQualityTier('low');
    expect(useUIStore.getState().qualityTier).toBe('low');

    setQualityTier('high');
    expect(useUIStore.getState().qualityTier).toBe('high');
  });

  it('toggles reduced motion and palette mode', () => {
    const { setReducedMotion, setPalette, setShowTour } = useUIStore.getState();

    setReducedMotion(true);
    expect(useUIStore.getState().reducedMotion).toBe(true);

    setPalette('deuteranopia');
    expect(useUIStore.getState().palette).toBe('deuteranopia');

    setShowTour(true);
    expect(useUIStore.getState().showTour).toBe(true);
  });
});
