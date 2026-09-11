import React from 'react';
import { RadialGeneChart } from './RadialGeneChart';
import { PopulationGraph } from './PopulationGraph';
import { useSimulationStore } from '../store/simulationStore';

export const VizPanel: React.FC = () => {
  const tick = useSimulationStore((state) => state.tick);

  return (
    <div className="flex-1 p-3 flex flex-col font-mono text-xs overflow-y-auto">
      {/* 1. Radial Morphology Radar Chart */}
      <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5 flex items-center justify-between">
        <span className="font-bold text-text-primary">MORPHOLOGY RADAR</span>
        <span className="text-accent-teal text-[9px] px-1 rounded bg-bg-elevated border border-border-subtle">
          D3.JS / 8-AXIS
        </span>
      </div>
      <div className="rounded border border-border-subtle bg-bg-elevated/40 p-2 flex items-center justify-center">
        <RadialGeneChart />
      </div>

      {/* 2. Population Dynamics Growth Curve */}
      <div className="text-[10px] uppercase tracking-wider text-text-muted mt-3 mb-1.5 flex items-center justify-between">
        <span className="font-bold text-text-primary">POPULATION BIOMASS</span>
        <span className="text-text-faint text-[9px]">TICK-{String(tick).padStart(5, '0')}</span>
      </div>
      <div className="rounded border border-border-subtle bg-bg-elevated/40 p-2 flex items-center justify-center">
        <PopulationGraph />
      </div>
    </div>
  );
};
