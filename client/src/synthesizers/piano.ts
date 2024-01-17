import * as Tone from 'tone';

export function create() {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.6, release: 1 }
  }).toDestination();
}
