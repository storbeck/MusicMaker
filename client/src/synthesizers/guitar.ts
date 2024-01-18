import * as Tone from 'tone';

export function create() {
  return new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.01,
    modulationIndex: 14,
    oscillator: { type: 'sine' }, // Change oscillator type to 'sine'
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
    volume: -10 // Decrease volume to make it sound softer,
  }).toDestination();
}