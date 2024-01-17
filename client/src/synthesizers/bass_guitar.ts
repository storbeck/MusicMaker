import * as Tone from 'tone';

export function create() {
  return new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.6, sustain: 0.5, release: 2 }
  }).toDestination();
}