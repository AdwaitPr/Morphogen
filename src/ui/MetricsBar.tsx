import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGenomeStore } from '../store/genomeStore';
import { useSimulationStore } from '../store/simulationStore';

export const MetricsBar: React.FC = () => {
  const { growth, mutagen, pulseRate } = useGenomeStore((state) => state.params);
  const { temperature, viscosity } = useSimulationStore();

  // Target values derived from biological simulation formulas
  const targetViability = Math.max(10, Math.min(99.9, 92 + (1 - mutagen) * 6 - Math.abs(temperature - 37.5) * 0.3));
  const targetAtp = Math.max(100, Math.min(500, Math.round(280 + growth * 100 - (viscosity - 1.45) * 20)));
  const targetStability = Math.max(0.001, mutagen * 0.01 + pulseRate * 0.0015);

  const [dispViability, setDispViability] = useState<number>(targetViability);
  const [dispAtp, setDispAtp] = useState<number>(targetAtp);
  const [dispStability, setDispStability] = useState<number>(targetStability);

  const tweenValues = useRef({
    viability: targetViability,
    atp: targetAtp,
    stability: targetStability,
  });

  useEffect(() => {
    const tween = gsap.to(tweenValues.current, {
      viability: targetViability,
      atp: targetAtp,
      stability: targetStability,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        setDispViability(parseFloat(tweenValues.current.viability.toFixed(1)));
        setDispAtp(Math.round(tweenValues.current.atp));
        setDispStability(parseFloat(tweenValues.current.stability.toFixed(3)));
      },
    });

    return () => {
      tween.kill();
    };
  }, [targetViability, targetAtp, targetStability]);

  return (
    <div className="p-3 space-y-3 border-b border-border-subtle font-mono text-xs">
      {/* Metric 1: Cell Viability */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">CELL VIABILITY</span>
          <span className="text-accent-lime font-bold tabular-nums">
            {dispViability.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-bg-elevated h-1.5 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="bg-accent-lime h-full transition-all duration-300 shadow-glow-teal"
            style={{ width: `${Math.min(100, dispViability)}%` }}
          />
        </div>
      </div>

      {/* Metric 2: ATP Synthesis */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">ATP SYNTHESIS</span>
          <span className="text-accent-teal font-bold tabular-nums">
            {dispAtp} kJ/mol
          </span>
        </div>
        <div className="w-full bg-bg-elevated h-1.5 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="bg-accent-teal h-full transition-all duration-300"
            style={{ width: `${Math.min(100, (dispAtp / 450) * 100)}%` }}
          />
        </div>
      </div>

      {/* Metric 3: Mutation Stability */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">MUTATION STABILITY</span>
          <span className="text-accent-amber font-bold tabular-nums">
            {dispStability.toFixed(3)} Δ/s
          </span>
        </div>
        <div className="w-full bg-bg-elevated h-1.5 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="bg-accent-amber h-full transition-all duration-300"
            style={{ width: `${Math.min(100, (dispStability / 0.015) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
