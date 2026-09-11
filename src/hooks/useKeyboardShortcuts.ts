import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { useGenomeStore } from '../store/genomeStore';
import { useUIStore } from '../store/uiStore';
import { PresetName } from '../types/genome';
import { playBlip } from '../audio/AudioEngine';

const PRESET_KEYS: Record<string, PresetName> = {
  '1': 'SPORE',
  '2': 'FERN',
  '3': 'POLYP',
  '4': 'ABERRATION',
};

export function useKeyboardShortcuts() {
  const togglePause = useSimulationStore((state) => state.togglePause);
  const resetToDefault = useGenomeStore((state) => state.resetToDefault);
  const randomize = useGenomeStore((state) => state.randomize);
  const applyPreset = useGenomeStore((state) => state.applyPreset);
  const showTour = useUIStore((state) => state.showTour);
  const setShowTour = useUIStore((state) => state.setShowTour);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
        playBlip(440);
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetToDefault();
        playBlip(320);
        return;
      }

      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        randomize();
        playBlip(640);
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowTour(!showTour);
        playBlip(580);
        return;
      }

      if (e.key === 'Escape') {
        if (showTour) {
          e.preventDefault();
          setShowTour(false);
          return;
        }
      }

      if (PRESET_KEYS[e.key]) {
        e.preventDefault();
        applyPreset(PRESET_KEYS[e.key]);
        playBlip(480);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, resetToDefault, randomize, applyPreset, showTour, setShowTour]);
}
