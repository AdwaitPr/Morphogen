/**
 * BioSynth Lab — Simulation State Types
 */

export interface SimulationState {
  /** Whether the simulation is paused */
  paused: boolean;
  /** Current simulation tick count */
  tick: number;
  /** Elapsed simulation time in seconds */
  elapsed: number;
}
