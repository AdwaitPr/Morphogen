import React from 'react';
import { ControlPanel } from './ControlPanel';
import { MetricsBar } from './MetricsBar';
import { useSimulationStore } from '../store/simulationStore';
import { useGenomeStore } from '../store/genomeStore';
import { useUIStore } from '../store/uiStore';
import { VizPanel } from '../viz/VizPanel';
import { ConsoleLog } from './ConsoleLog';
import { SoundToggle } from './SoundToggle';
import { A11yToggle } from './A11yToggle';

interface HUDProps {
  children?: React.ReactNode;
}

export const HUD: React.FC<HUDProps> = ({ children }) => {
  const { paused, tick, temperature, viscosity, togglePause } = useSimulationStore();
  const resetToDefault = useGenomeStore((state) => state.resetToDefault);
  const randomize = useGenomeStore((state) => state.randomize);
  const setShowTour = useUIStore((state) => state.setShowTour);

  return (
    <div className="relative w-full h-full overflow-hidden bg-bg-base text-text-primary flex flex-col font-ui select-none">
      {/* ── Top Bar ── */}
      <header className="h-12 border-b border-border-subtle bg-bg-panel/90 backdrop-blur px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-teal shadow-glow-teal animate-pulse" />
          <h1 className="font-mono text-sm tracking-wider uppercase font-bold text-text-primary flex items-center space-x-2">
            <span>BIOSYNTH LAB</span>
            <span className="text-text-faint font-normal">// SYNTHETIC BIOLOGY ENGINE</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-text-muted">SPECIMEN:</span>
            <span className="text-accent-teal font-medium">#SYN-8821-E</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-text-muted">STATUS:</span>
            <span className="text-accent-lime font-medium">HOMEOSTASIS [100%]</span>
          </div>
          <div className="hidden lg:flex items-center space-x-2 border-l border-border-subtle pl-4">
            <span className="text-text-muted">RENDER:</span>
            <span className="text-accent-amber font-medium">WEBGL 2.0 / R3F</span>
          </div>
          <div className="flex items-center space-x-2 border-l border-border-subtle pl-4">
            <SoundToggle />
            <A11yToggle />
          </div>
        </div>
      </header>

      {/* ── Center Stage & Panels ── */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Control Panel */}
        <ControlPanel />

        {/* Center Viewport Area */}
        <main
          aria-label="3D Organism Simulation Viewport"
          className="flex-1 relative bg-bg-base overflow-hidden flex items-center justify-center"
        >
          {/* Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `
                radial-gradient(circle at center, rgba(79, 182, 172, 0.12) 0%, transparent 70%),
                linear-gradient(to right, rgba(46, 50, 56, 0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(46, 50, 56, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            }}
          />

          {/* Crosshair Reticle & Orbit Rings */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[520px] h-[520px] border border-border-subtle/30 rounded-full flex items-center justify-center">
              <div className="w-[360px] h-[360px] border border-dashed border-border-subtle/40 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border border-accent-teal/20 rounded-full" />
              </div>
            </div>
            {/* Corner Bracket Reticles */}
            <div className="absolute w-[560px] h-[560px] pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent-teal/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent-teal/60" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent-teal/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent-teal/60" />
            </div>
          </div>

          {/* Organism Canvas Injection or Placeholder */}
          {children ? (
            <div className="absolute inset-0 z-0">{children}</div>
          ) : (
            <div className="relative z-10 text-center font-mono space-y-2 select-none">
              <div className="inline-block px-3 py-1 rounded border border-accent-teal/40 bg-accent-teal/10 text-accent-teal text-xs tracking-widest uppercase">
                SIMULATION CHAMBER ACTIVE
              </div>
              <p className="text-text-muted text-xs">Organism Canvas awaiting initialization...</p>
            </div>
          )}

          {/* Viewport Floating Info (Bottom-Left of center) */}
          <div className="absolute bottom-4 left-4 font-mono text-[11px] text-text-faint space-y-1 pointer-events-none">
            <div>CAMERA: ORBIT [DIST: 6.50m]</div>
            <div>FIELD OF VIEW: 45° | PIVOT: (0.0, 0.0, 0.0)</div>
          </div>

          {/* Bottom-Left Console Log Overlay */}
          <ConsoleLog />
        </main>

        {/* Right Telemetry & Visualization Sidebar */}
        <aside
          aria-label="Telemetry and Analytics"
          className="w-80 h-full border-l border-border-subtle bg-bg-panel/90 backdrop-blur flex flex-col z-10 select-none overflow-hidden"
        >
          {/* Top-Right Metrics Area */}
          <div className="p-3 border-b border-border-subtle flex items-center justify-between font-mono text-xs">
            <span className="tracking-wider uppercase text-text-primary font-bold">
              REAL-TIME TELEMETRY
            </span>
            <span className="px-1.5 py-0.5 rounded bg-accent-lime/10 border border-accent-lime/30 text-accent-lime text-[10px]">
              60.0 FPS
            </span>
          </div>

          <MetricsBar />

          {/* Bottom-Right Viz Panel Area (Morphology Radar & Population Curve) */}
          <VizPanel />
        </aside>
      </div>

      {/* ── Bottom Simulation Bar ── */}
      <footer className="h-10 border-t border-border-subtle bg-bg-panel/90 backdrop-blur px-4 flex items-center justify-between font-mono text-xs z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-text-muted">SIMULATION:</span>
          <button
            type="button"
            onClick={togglePause}
            className={`font-medium cursor-pointer hover:underline ${
              paused ? 'text-accent-alert' : 'text-accent-lime'
            }`}
          >
            {paused ? 'PAUSED' : 'RUNNING'} (TICK: {String(tick).padStart(5, '0')})
          </button>
          <span className="text-border-subtle">|</span>
          <span className="text-text-muted">TEMPERATURE:</span>
          <span className="text-accent-amber font-medium">{temperature.toFixed(1)} °C</span>
          <span className="text-border-subtle">|</span>
          <span className="text-text-muted">VISCOSITY:</span>
          <span className="text-text-primary font-medium">{viscosity.toFixed(2)} cP</span>
        </div>
        <div className="flex items-center space-x-3 text-text-faint text-[11px]">
          <button
            type="button"
            onClick={togglePause}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            [SPACE] {paused ? 'RESUME' : 'PAUSE'}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={resetToDefault}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            [R] RESET
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={randomize}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            [E] EVOLVE
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowTour(true)}
            className="text-accent-teal hover:underline transition-colors cursor-pointer font-bold"
          >
            [H] HELP / TOUR
          </button>
        </div>
      </footer>
    </div>
  );
};
