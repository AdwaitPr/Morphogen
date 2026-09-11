import { describe, it, expect, beforeEach } from 'vitest';
import { encodeGenomeSeed, decodeGenomeSeed } from '../src/utils/genome';
import { getDefaultGenome, PRESETS } from '../src/types/genome';
import { useGenomeStore } from '../src/store/genomeStore';
import { useUIStore } from '../src/store/uiStore';
import { genomeRefs } from '../src/store/genomeRefs';

describe('Genome Seed & Encoding Suite', () => {
  it('roundtrips default genome with exact numerical precision', () => {
    const defaults = getDefaultGenome();
    const seed = encodeGenomeSeed(defaults);

    expect(seed.startsWith('v1:')).toBe(true);

    const decoded = decodeGenomeSeed(seed);
    expect(decoded).not.toBeNull();
    if (decoded) {
      expect(decoded.branchCount).toBe(defaults.branchCount);
      expect(decoded.symmetry).toBeCloseTo(defaults.symmetry, 2);
      expect(decoded.bioluminescence).toBeCloseTo(defaults.bioluminescence, 2);
      expect(decoded.hue).toBe(defaults.hue);
      expect(decoded.saturation).toBeCloseTo(defaults.saturation, 2);
      expect(decoded.pulseRate).toBeCloseTo(defaults.pulseRate, 1);
      expect(decoded.mutagen).toBeCloseTo(defaults.mutagen, 2);
      expect(decoded.growth).toBeCloseTo(defaults.growth, 2);
    }
  });

  it('rejects tampered seed with invalid CRC32 checksum', () => {
    const seed = encodeGenomeSeed(getDefaultGenome());
    const tampered = seed.replace(/:[0-9a-f]{4}:/, ':ffff:'); // Invalidate CRC
    const result = decodeGenomeSeed(tampered);
    expect(result).toBeNull();
  });

  it('rejects seeds with wrong version prefix', () => {
    const seed = encodeGenomeSeed(getDefaultGenome());
    const wrongVersion = seed.replace(/^v1:/, 'v2:');
    const result = decodeGenomeSeed(wrongVersion);
    expect(result).toBeNull();
  });

  it('correctly clamps out-of-range decoded parameters', () => {
    const seed = encodeGenomeSeed({
      ...getDefaultGenome(),
      growth: 999.0, // Exceeds max 1.0
      hue: -50,      // Below min 0
    });

    const decoded = decodeGenomeSeed(seed);
    expect(decoded).not.toBeNull();
    if (decoded) {
      expect(decoded.growth).toBe(1.0);
      expect(decoded.hue).toBe(0);
    }
  });
});

describe('Genome Store & DragLock Architecture', () => {
  beforeEach(() => {
    useUIStore.getState().setDragLock(null);
    useGenomeStore.getState().resetToDefault();
  });

  it('external preset apply during simulated drag does not clobber dragged ref', () => {
    // 1. Simulate pointerdown on growth slider -> dragLock = 'growth'
    useUIStore.getState().setDragLock('growth');

    // 2. User drags growth slider to 0.95 (updating Tier 1 ref)
    genomeRefs.growth.current = 0.95;

    // 3. Simultaneously, an external preset or event occurs (e.g. applyPreset('SPORE'))
    useGenomeStore.getState().applyPreset('SPORE');

    // 4. Growth ref MUST remain at 0.95 (protected by dragLock)
    expect(genomeRefs.growth.current).toBe(0.95);

    // 5. Other parameters MUST update to preset values
    expect(genomeRefs.branchCount.current).toBe(PRESETS.SPORE.branchCount);
    expect(genomeRefs.hue.current).toBe(PRESETS.SPORE.hue);

    // 6. On pointerup, dragLock is released
    useUIStore.getState().setDragLock(null);
  });
});
