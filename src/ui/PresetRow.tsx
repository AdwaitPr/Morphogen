import React from 'react';
import gsap from 'gsap';
import { PresetName, PRESETS, GenomeParamKey } from '../types/genome';
import { genomeRefs } from '../store/genomeRefs';
import { useGenomeStore } from '../store/genomeStore';
import { useUIStore } from '../store/uiStore';

export const PresetRow: React.FC = () => {
  const morphLock = useUIStore((state) => state.morphLock);
  const setMorphLock = useUIStore((state) => state.setMorphLock);
  const setParam = useGenomeStore((state) => state.setParam);

  const handleApplyPresetWithTween = (presetName: PresetName) => {
    if (morphLock) return;

    const target = PRESETS[presetName];
    if (!target) return;

    setMorphLock(true);

    // Collect starting values from genomeRefs
    const startValues: Record<string, number> = {};
    const endValues: Record<string, number> = {};
    const keys = Object.keys(target) as GenomeParamKey[];

    keys.forEach((k) => {
      startValues[k] = genomeRefs[k].current;
      endValues[k] = target[k];
    });

    gsap.to(startValues, {
      ...endValues,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        keys.forEach((k) => {
          const val = parseFloat(startValues[k].toFixed(2));
          genomeRefs[k].current = val;
        });
      },
      onComplete: () => {
        // Final store commit
        keys.forEach((k) => {
          setParam(k, target[k]);
        });
        setMorphLock(false);
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
      {(['SPORE', 'FERN', 'POLYP', 'ABERRATION'] as PresetName[]).map((name) => (
        <button
          key={name}
          type="button"
          disabled={morphLock}
          onClick={() => handleApplyPresetWithTween(name)}
          className="px-2 py-1.5 rounded border border-border-subtle bg-bg-elevated text-text-primary text-left font-medium hover:border-accent-teal hover:text-accent-teal active:scale-95 transition-all disabled:opacity-50"
        >
          ► {name}
        </button>
      ))}
    </div>
  );
};
