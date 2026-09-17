/**
 * Precision audio feedback using Web Audio API.
 * Provides a crisp, high-end tactile click sound without any external audio asset latency.
 */

let sharedAudioCtx: AudioContext | null = null;

export function playTactileClickSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const now = sharedAudioCtx.currentTime;
    const osc = sharedAudioCtx.createOscillator();
    const gainNode = sharedAudioCtx.createGain();

    // Clean, high-end tactile mechanical click sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gainNode);
    gainNode.connect(sharedAudioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Gracefully handle browser autoplay / audio restrictions
  }
}
