import React from 'react';

interface ContextLostOverlayProps {
  lost: boolean;
}

export const ContextLostOverlay: React.FC<ContextLostOverlayProps> = ({ lost }) => {
  if (!lost) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-base/90 backdrop-blur p-6 font-mono text-center">
      <div className="max-w-md p-6 rounded-lg border border-accent-alert/50 bg-bg-panel shadow-panel flex flex-col items-center">
        <div className="flex items-center space-x-2 px-3 py-1 mb-4 rounded-full border border-accent-alert/40 bg-accent-alert/10 text-accent-alert text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-accent-alert animate-ping" />
          <span>GPU Context Lost</span>
        </div>

        <h3 className="text-base font-bold text-text-primary mb-2">
          WEBGL CONTEXT LOSS DETECTED
        </h3>

        <p className="text-xs text-text-muted leading-relaxed mb-6">
          The graphics hardware encountered a timeout or memory reset. Simulation state has been halted to prevent corruption.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded bg-accent-teal text-bg-base font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-glow-teal transition-all"
        >
          Reload Simulation
        </button>
      </div>
    </div>
  );
};
