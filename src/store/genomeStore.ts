import { create } from 'zustand';
import {
  GenomeParams,
  GenomeParamKey,
  getDefaultGenome,
  clampParam,
  PresetName,
  PRESETS,
  GENOME_META,
} from '../types/genome';
import { updateGenomeRef, syncGenomeRefs } from './genomeRefs';
import { useUIStore } from './uiStore';

export interface GenomeStoreState {
  params: GenomeParams;
  setParam: (key: GenomeParamKey, value: number) => void;
  applyPreset: (name: PresetName) => void;
  randomize: () => void;
  resetToDefault: () => void;
  applyExternal: (newParams: Partial<GenomeParams>) => void;
}

export const useGenomeStore = create<GenomeStoreState>((set) => ({
  params: getDefaultGenome(),

  setParam: (key, value) => {
    const clamped = clampParam(key, value);
    // Tier 1 ref update
    updateGenomeRef(key, clamped);
    // Store commit
    set((state) => ({
      params: {
        ...state.params,
        [key]: clamped,
      },
    }));
  },

  applyPreset: (name) => {
    const preset = PRESETS[name];
    if (!preset) return;

    const dragLock = useUIStore.getState().dragLock;
    syncGenomeRefs(preset, dragLock);

    set((state) => {
      const updated = { ...preset };
      // Preserve currently locked parameter from being clobbered mid-drag
      if (dragLock) {
        updated[dragLock] = state.params[dragLock];
      }
      return { params: updated };
    });
  },

  randomize: () => {
    const dragLock = useUIStore.getState().dragLock;
    const randomized = {} as GenomeParams;

    (Object.keys(GENOME_META) as GenomeParamKey[]).forEach((key) => {
      const meta = GENOME_META[key];
      const steps = Math.floor((meta.max - meta.min) / meta.step);
      const randomStep = Math.floor(Math.random() * (steps + 1));
      randomized[key] = parseFloat((meta.min + randomStep * meta.step).toFixed(2));
    });

    syncGenomeRefs(randomized, dragLock);

    set((state) => {
      if (dragLock) {
        randomized[dragLock] = state.params[dragLock];
      }
      return { params: randomized };
    });
  },

  resetToDefault: () => {
    const dragLock = useUIStore.getState().dragLock;
    const defaults = getDefaultGenome();

    syncGenomeRefs(defaults, dragLock);

    set((state) => {
      if (dragLock) {
        defaults[dragLock] = state.params[dragLock];
      }
      return { params: defaults };
    });
  },

  applyExternal: (newParams) => {
    const dragLock = useUIStore.getState().dragLock;
    syncGenomeRefs(newParams, dragLock);

    set((state) => {
      const updated = { ...state.params, ...newParams };
      if (dragLock) {
        updated[dragLock] = state.params[dragLock];
      }
      return { params: updated };
    });
  },
}));
