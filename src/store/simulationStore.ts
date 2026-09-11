import { create } from 'zustand';

export interface SimulationState {
  paused: boolean;
  tick: number;
  temperature: number; // in °C [10.0, 60.0]
  viscosity: number;   // in cP [0.5, 5.0]
  radiation: number;   // in Gy [0.0, 1.0]

  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  incrementTick: () => void;
  setEnvironmentParam: (key: 'temperature' | 'viscosity' | 'radiation', value: number) => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  paused: false,
  tick: 142,
  temperature: 37.5,
  viscosity: 1.45,
  radiation: 0.12,

  togglePause: () => set((s) => ({ paused: !s.paused })),
  setPaused: (paused) => set({ paused }),
  incrementTick: () => set((s) => ({ tick: s.tick + 1 })),
  setEnvironmentParam: (key, value) => set({ [key]: value }),
  resetSimulation: () =>
    set({
      paused: false,
      tick: 0,
      temperature: 37.5,
      viscosity: 1.45,
      radiation: 0.12,
    }),
}));
