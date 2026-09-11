import { create } from 'zustand';
import { GenomeParamKey } from '../types/genome';

export type QualityTier = 'high' | 'medium' | 'low';
export type ColorPalette = 'default' | 'deuteranopia';

export interface UIState {
  dragLock: GenomeParamKey | null;
  morphLock: boolean;
  shaderReady: boolean;
  panelCollapsed: Record<string, boolean>;
  qualityTier: QualityTier;
  palette: ColorPalette;
  reducedMotion: boolean;
  showTour: boolean;

  setDragLock: (key: GenomeParamKey | null) => void;
  setMorphLock: (locked: boolean) => void;
  setShaderReady: (ready: boolean) => void;
  togglePanel: (panelId: string) => void;
  setQualityTier: (tier: QualityTier) => void;
  setPalette: (palette: ColorPalette) => void;
  setReducedMotion: (reduced: boolean) => void;
  setShowTour: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  dragLock: null,
  morphLock: false,
  shaderReady: true,
  panelCollapsed: {
    genome: false,
    environment: false,
    presets: false,
    telemetry: false,
  },
  qualityTier: 'high',
  palette: 'default',
  reducedMotion: false,
  showTour: false,

  setDragLock: (dragLock) => set({ dragLock }),
  setMorphLock: (morphLock) => set({ morphLock }),
  setShaderReady: (shaderReady) => set({ shaderReady }),
  togglePanel: (panelId) =>
    set((state) => ({
      panelCollapsed: {
        ...state.panelCollapsed,
        [panelId]: !state.panelCollapsed[panelId],
      },
    })),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setPalette: (palette) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.palette = palette;
    }
    set({ palette });
  },
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setShowTour: (showTour) => set({ showTour }),
}));
