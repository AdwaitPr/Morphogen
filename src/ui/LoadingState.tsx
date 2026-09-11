import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg-base/95 backdrop-blur font-mono select-none">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center p-6 rounded-lg border border-border-subtle bg-bg-panel shadow-panel">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-accent-teal/20 border-t-accent-teal rounded-full animate-spin" />
          <div className="w-6 h-6 border-2 border-accent-lime/30 border-b-accent-lime rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold tracking-wider text-text-primary uppercase">
            COMPILING GLSL SHADERS
          </div>
          <div className="text-[11px] text-text-muted">
            Calibrating procedural FBM displacement & normal pipeline...
          </div>
        </div>
      </div>
    </div>
  );
};
