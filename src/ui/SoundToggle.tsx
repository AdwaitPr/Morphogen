import React, { useState } from 'react';
import { initAudio, stopAudio, getAudioActive, playBlip } from '../audio/AudioEngine';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(getAudioActive());

  const handleToggle = async () => {
    if (enabled) {
      stopAudio();
      setEnabled(false);
    } else {
      const ok = await initAudio();
      if (ok) {
        setEnabled(true);
        playBlip(520);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? 'Mute BioSynth audio engine' : 'Unmute BioSynth audio engine'}
      title={enabled ? 'Audio active (click to mute)' : 'Audio muted (click to activate)'}
      className={`px-2 py-1 rounded border font-mono text-xs flex items-center space-x-1.5 transition-colors ${
        enabled
          ? 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal'
          : 'border-border-subtle bg-bg-elevated text-text-muted hover:text-text-primary'
      }`}
    >
      <span>{enabled ? '🔊' : '🔇'}</span>
      <span className="text-[10px] tracking-wider uppercase font-medium">
        {enabled ? 'SND ON' : 'MUTED'}
      </span>
    </button>
  );
};
