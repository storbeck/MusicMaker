import * as Tone from 'tone';

export function create() {
  return new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 },
    volume: -8,
    
  }).toDestination();
}