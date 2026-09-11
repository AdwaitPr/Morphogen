import React, { useEffect, useState } from 'react';

/**
 * MobileGate
 *
 * BioSynth Lab requires desktop-class precision controls, complex 3D GLSL shaders,
 * and high-density telemetry readouts designed for >= 1280px width screens.
 * Displays a sleek, styled sci-fi terminal screen when accessed below 1280px.
 */
export const MobileGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTooNarrow, setIsTooNarrow] = useState<boolean>(false);
  const [currentWidth, setCurrentWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      setCurrentWidth(width);
      setIsTooNarrow(width < 1280);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (isTooNarrow) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-base p-6 text-center select-none">
        <div className="relative max-w-md w-full p-8 rounded-lg border border-border-subtle bg-bg-panel shadow-panel flex flex-col items-center">
          {/* Biolab status badge */}
          <div className="flex items-center space-x-2 px-3 py-1 mb-6 rounded-full border border-accent-alert/30 bg-accent-alert/10 text-accent-alert text-xs font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-accent-alert animate-pulse" />
            <span>Resolution Warning // Bio-001</span>
          </div>

          <h2 className="text-lg font-bold text-text-primary tracking-wide mb-2">
            DESKTOP WORKSTATION REQUIRED
          </h2>
          
          <p className="text-xs text-text-muted leading-relaxed mb-6">
            BioSynth Lab delivers a real-time GLSL procedural evolution simulation with dense multi-channel telemetry. Please access this terminal from a desktop display (minimum 1280px width).
          </p>

          <div className="w-full bg-bg-elevated p-3 rounded border border-border-subtle font-mono text-xs text-text-muted flex justify-between items-center">
            <span>DETECTED VIEWPORT:</span>
            <span className="text-accent-amber font-bold">{currentWidth}px / 1280px</span>
          </div>

          <div className="mt-6 text-[11px] font-mono text-text-faint tracking-widest uppercase">
            [BIOSYNTH CORE v2.4.0 — SYNTHETIC BIOLOGY ENGINE]
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
