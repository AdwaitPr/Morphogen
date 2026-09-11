import React, { useState } from 'react';
import { useUIStore, QualityTier } from '../store/uiStore';

export const A11yToggle: React.FC = () => {
  const [open, setOpen] = useState(false);
  const palette = useUIStore((state) => state.palette);
  const setPalette = useUIStore((state) => state.setPalette);
  const reducedMotion = useUIStore((state) => state.reducedMotion);
  const setReducedMotion = useUIStore((state) => state.setReducedMotion);
  const qualityTier = useUIStore((state) => state.qualityTier);
  const setQualityTier = useUIStore((state) => state.setQualityTier);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Accessibility and visual settings"
        title="Accessibility & Rendering Settings"
        className="px-2 py-1 rounded border border-border-subtle bg-bg-elevated text-text-muted hover:text-text-primary hover:border-accent-teal/50 font-mono text-xs flex items-center space-x-1.5 transition-colors"
      >
        <span>⚙</span>
        <span className="text-[10px] tracking-wider uppercase font-medium">A11Y / OPT</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-bg-panel border border-border-subtle rounded-lg shadow-panel z-50 font-mono text-xs space-y-3">
          <div className="text-[10px] uppercase font-bold text-text-primary border-b border-border-subtle pb-1">
            ACCESSIBILITY & GRAPHICS
          </div>

          {/* Colorblind deuteranopia palette */}
          <div className="flex items-center justify-between">
            <span className="text-text-muted">COLORBLIND:</span>
            <button
              type="button"
              onClick={() => setPalette(palette === 'default' ? 'deuteranopia' : 'default')}
              className={`px-2 py-0.5 rounded border text-[10px] ${
                palette === 'deuteranopia'
                  ? 'border-accent-teal bg-accent-teal/10 text-accent-teal'
                  : 'border-border-subtle text-text-faint'
              }`}
            >
              {palette === 'deuteranopia' ? 'DEUTERANOPIA' : 'DEFAULT'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <span className="text-text-muted">MOTION:</span>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-2 py-0.5 rounded border text-[10px] ${
                reducedMotion
                  ? 'border-accent-amber bg-accent-amber/10 text-accent-amber'
                  : 'border-border-subtle text-text-faint'
              }`}
            >
              {reducedMotion ? 'REDUCED' : 'FULL'}
            </button>
          </div>

          {/* Quality Tier Selector */}
          <div className="flex items-center justify-between">
            <span className="text-text-muted">QUALITY:</span>
            <div className="flex space-x-1">
              {(['high', 'medium', 'low'] as QualityTier[]).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setQualityTier(tier)}
                  className={`px-1.5 py-0.5 rounded border text-[9px] uppercase ${
                    qualityTier === tier
                      ? 'border-accent-teal bg-accent-teal/20 text-accent-teal'
                      : 'border-border-subtle text-text-faint'
                  }`}
                >
                  {tier.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
