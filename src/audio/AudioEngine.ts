/**
 * BioSynth Lab — Audio Engine (Tone.js)
 *
 * Implements subtle ambient bioluminescent hum and tactile parameter clicks.
 * Loaded dynamically on demand to minimize bundle size.
 */

let toneModule: typeof import('tone') | null = null;
let synth: import('tone').Synth | null = null;
let isAudioActive = false;

export async function initAudio(): Promise<boolean> {
  if (isAudioActive) return true;

  try {
    if (!toneModule) {
      toneModule = await import('tone');
    }

    await toneModule.start();

    // Soft organic sine synth
    synth = new toneModule.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.1,
        release: 0.5,
      },
    }).toDestination();

    synth.volume.value = -18; // Soft background level

    isAudioActive = true;
    return true;
  } catch (err) {
    console.warn('BioSynth: Audio initiation suppressed:', err);
    return false;
  }
}

export function playBlip(frequency = 440) {
  if (!isAudioActive || !synth || !toneModule) return;
  try {
    synth.triggerAttackRelease(frequency, '32n');
  } catch {
    // Ignored if audio context was suspended
  }
}

export function stopAudio() {
  if (synth) {
    synth.dispose();
    synth = null;
  }
  isAudioActive = false;
}

export function getAudioActive(): boolean {
  return isAudioActive;
}
