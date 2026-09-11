import React, { useState } from 'react';
import { GeneSlider } from './GeneSlider';
import { PresetRow } from './PresetRow';
import { useGenomeStore } from '../store/genomeStore';
import { useSimulationStore } from '../store/simulationStore';
import { useUIStore } from '../store/uiStore';
import { encodeGenomeSeed } from '../utils/genome';

export const ControlPanel: React.FC = () => {
  const params = useGenomeStore((state) => state.params);
  const randomize = useGenomeStore((state) => state.randomize);
  const resetToDefault = useGenomeStore((state) => state.resetToDefault);

  const { temperature, viscosity, radiation, setEnvironmentParam } = useSimulationStore();
  const morphLock = useUIStore((state) => state.morphLock);

  const [genomeOpen, setGenomeOpen] = useState<boolean>(true);
  const [envOpen, setEnvOpen] = useState<boolean>(true);
  const [simOpen, setSimOpen] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const seed = encodeGenomeSeed(params);

  const handleCopySeed = () => {
    navigator.clipboard?.writeText(seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <aside
      aria-label="Genome Control Panel"
      className="w-80 h-full border-r border-border-subtle bg-bg-panel/90 backdrop-blur flex flex-col z-10 select-none overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-border-subtle flex items-center justify-between font-mono text-xs">
        <span className="tracking-wider uppercase text-text-primary font-bold">
          PARAMETRIC CONTROLS
        </span>
        <span className="px-1.5 py-0.5 rounded bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-[10px]">
          8 ACTIVE GENES
        </span>
      </div>

      {/* Scrollable controls list */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Section 1: Genome Controls */}
        <section className="rounded border border-border-subtle bg-bg-elevated/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setGenomeOpen(!genomeOpen)}
            className="w-full p-2.5 bg-bg-elevated flex items-center justify-between font-mono text-xs text-text-primary hover:text-accent-teal transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-accent-teal">{genomeOpen ? '▼' : '▶'}</span>
              <span className="font-bold tracking-wide uppercase">GENOME PARAMS</span>
            </div>
            <span className="text-[10px] text-text-muted">8 LOCI</span>
          </button>

          {genomeOpen && (
            <div className="p-3 space-y-3.5 border-t border-border-subtle">
              <GeneSlider param="growth" />
              <GeneSlider param="mutagen" />
              <GeneSlider param="pulseRate" />
              <GeneSlider param="bioluminescence" />
              <GeneSlider param="hue" />
              <GeneSlider param="saturation" />
              <GeneSlider param="symmetry" />
              <GeneSlider param="branchCount" />
            </div>
          )}
        </section>

        {/* Section 2: Environment Controls */}
        <section className="rounded border border-border-subtle bg-bg-elevated/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setEnvOpen(!envOpen)}
            className="w-full p-2.5 bg-bg-elevated flex items-center justify-between font-mono text-xs text-text-primary hover:text-accent-amber transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-accent-amber">{envOpen ? '▼' : '▶'}</span>
              <span className="font-bold tracking-wide uppercase">ENVIRONMENT</span>
            </div>
            <span className="text-[10px] text-text-muted">3 FIELDS</span>
          </button>

          {envOpen && (
            <div className="p-3 space-y-3 border-t border-border-subtle font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-primary">TEMPERATURE</span>
                  <span className="text-accent-amber">{temperature.toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setEnvironmentParam('temperature', parseFloat(e.target.value))}
                  className="w-full h-2 bg-bg-elevated rounded appearance-none cursor-pointer accent-accent-amber"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-primary">VISCOSITY</span>
                  <span className="text-accent-teal">{viscosity.toFixed(2)} cP</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.05"
                  value={viscosity}
                  onChange={(e) => setEnvironmentParam('viscosity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-bg-elevated rounded appearance-none cursor-pointer accent-accent-teal"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-primary">RADIATION FLUX</span>
                  <span className="text-accent-alert">{radiation.toFixed(2)} Gy</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={radiation}
                  onChange={(e) => setEnvironmentParam('radiation', parseFloat(e.target.value))}
                  className="w-full h-2 bg-bg-elevated rounded appearance-none cursor-pointer accent-accent-alert"
                />
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Simulation & Presets */}
        <section className="rounded border border-border-subtle bg-bg-elevated/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setSimOpen(!simOpen)}
            className="w-full p-2.5 bg-bg-elevated flex items-center justify-between font-mono text-xs text-text-primary hover:text-accent-lime transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-accent-lime">{simOpen ? '▼' : '▶'}</span>
              <span className="font-bold tracking-wide uppercase">PRESETS & MUTATION</span>
            </div>
            <span className="text-[10px] text-text-muted">4 SPECIES</span>
          </button>

          {simOpen && (
            <div className="p-3 space-y-2 border-t border-border-subtle">
              <PresetRow />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={morphLock}
                  onClick={randomize}
                  className="py-1.5 rounded border border-accent-amber/40 bg-accent-amber/10 text-accent-amber font-mono text-xs tracking-wider uppercase font-bold hover:bg-accent-amber/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-1"
                >
                  <span>⚡ RANDOMIZE</span>
                </button>

                <button
                  type="button"
                  disabled={morphLock}
                  onClick={resetToDefault}
                  className="py-1.5 rounded border border-border-subtle bg-bg-elevated text-text-muted font-mono text-xs tracking-wider uppercase font-medium hover:text-text-primary active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-1"
                >
                  <span>↺ RESET</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer / Seed Code Readout */}
      <div className="p-3 border-t border-border-subtle bg-bg-elevated/40 font-mono text-[11px] text-text-muted flex justify-between items-center">
        <span>GENOME SEED:</span>
        <button
          type="button"
          onClick={handleCopySeed}
          title="Click to copy full genome seed"
          className="text-accent-teal select-all bg-bg-base px-2 py-0.5 rounded border border-border-subtle hover:border-accent-teal/60 cursor-pointer flex items-center space-x-1.5"
        >
          <span className="truncate max-w-[120px]">{seed.slice(0, 14)}...</span>
          <span className="text-[9px] text-text-faint">{copied ? '✓ COPIED' : 'COPY'}</span>
        </button>
      </div>
    </aside>
  );
};
