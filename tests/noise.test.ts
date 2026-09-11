import { describe, it, expect } from 'vitest';
import { simplex3D, fbm3D, getDisplacedSurfacePoint } from '../src/utils/noise';

describe('CPU Simplex 3D & FBM Noise Suite', () => {
  it('produces bounded output in [-1, 1] for 100 random 3D points', () => {
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;

      const val = simplex3D(x, y, z);
      expect(val).toBeGreaterThanOrEqual(-1.05);
      expect(val).toBeLessThanOrEqual(1.05);
      expect(Number.isFinite(val)).toBe(true);
    }
  });

  it('is strictly deterministic for identical coordinates', () => {
    const p1 = simplex3D(1.234, -5.678, 9.012);
    const p2 = simplex3D(1.234, -5.678, 9.012);
    expect(p1).toBe(p2);

    const f1 = fbm3D(2.5, 3.1, -4.2);
    const f2 = fbm3D(2.5, 3.1, -4.2);
    expect(f1).toBe(f2);
  });

  it('fbm3D accumulates 3 octaves smoothly', () => {
    for (let i = 0; i < 50; i++) {
      const x = Math.sin(i * 0.1);
      const y = Math.cos(i * 0.1);
      const z = Math.sin(i * 0.2);

      const fbm = fbm3D(x, y, z);
      expect(Number.isFinite(fbm)).toBe(true);
      expect(fbm).toBeGreaterThanOrEqual(-1.5);
      expect(fbm).toBeLessThanOrEqual(1.5);
    }
  });

  it('computes surface displacement proportionally to growth parameter', () => {
    const basePoint = { x: 1.2, y: 0, z: 0 };
    const normal = { x: 1, y: 0, z: 0 };

    // At growth = 0, displacement should be 0
    const displacedZero = getDisplacedSurfacePoint(basePoint, normal, 0.0, 0.0, 0.0, 1.0);
    expect(displacedZero.x).toBeCloseTo(basePoint.x, 5);
    expect(displacedZero.y).toBeCloseTo(basePoint.y, 5);
    expect(displacedZero.z).toBeCloseTo(basePoint.z, 5);
    expect(displacedZero.displacement).toBe(0);

    // At growth = 1.0, displacement should be non-zero and finite
    const displacedFull = getDisplacedSurfacePoint(basePoint, normal, 1.5, 1.0, 0.5, 1.2);
    expect(Number.isFinite(displacedFull.x)).toBe(true);
    expect(Number.isFinite(displacedFull.displacement)).toBe(true);
    expect(displacedFull.x).not.toBe(basePoint.x);
  });
});
