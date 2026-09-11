import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootLogs = [
      'BIOSYNTH KERNEL v2.4.0 (x86_64-biolab)',
      'INITIALIZING WEBGL 2.0 GRAPHICS PIPELINE...',
      'ALLOCATING ICOSAHEDRON SUBDIVISION LATTICE (5,120 TRIS)... OK',
      'COMPILING SIMPLEX 3D NOISE DISPLACEMENT SHADERS... OK',
      'SYNCHRONIZING 8-LOCUS PARAMETRIC GENOME REFS... OK',
      'CALIBRATING CELLULAR MEMBRANE BIOLUMINESCENCE... OK',
      'CHAMBER HOMEOSTASIS ESTABLISHED. ALL SYSTEMS NOMINAL.',
    ];

    let current = 0;
    const interval = window.setInterval(() => {
      if (current < bootLogs.length) {
        const nextLine = bootLogs[current];
        setLines((prev) => [...prev, nextLine]);
        current++;
      } else {
        window.clearInterval(interval);
        setReady(true);
      }
    }, 180);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base p-6 font-mono select-none">
      <div className="max-w-xl w-full p-6 rounded-lg border border-border-subtle bg-bg-panel shadow-panel flex flex-col space-y-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-2 text-xs text-text-muted">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-accent-teal shadow-glow-teal animate-pulse" />
            <span className="font-bold text-text-primary">BIOSYNTH CORE // BOOT SEQUENCE</span>
          </div>
          <span className="text-[10px] text-text-faint">ESC TO SKIP</span>
        </div>

        {/* Boot Lines */}
        <div className="space-y-1 text-xs text-text-primary h-48 overflow-y-auto font-mono leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex space-x-2">
              <span className="text-accent-teal">&gt;</span>
              <span className={i === lines.length - 1 ? 'text-accent-lime font-bold' : ''}>
                {line}
              </span>
            </div>
          ))}
          {!ready && (
            <div className="flex space-x-2">
              <span className="text-accent-teal">&gt;</span>
              <span className="w-2 h-4 bg-accent-teal animate-pulse" />
            </div>
          )}
        </div>

        {/* Enter Button */}
        <div className="border-t border-border-subtle pt-3 flex justify-between items-center">
          <span className="text-[11px] text-text-muted">CORE BUILD: STABLE</span>
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 rounded bg-accent-teal text-bg-base font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-glow-teal transition-all flex items-center space-x-2"
          >
            <span>INITIALIZE WORKSTATION</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
