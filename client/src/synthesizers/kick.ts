import * as Tone from 'tone';

export function create(attack: number, decay: number, octaves: number, oscillatorType: "sine" | "square" | "triangle" | "sawtooth") {
    return new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: octaves,
      oscillator: { type: oscillatorType },
      envelope: { attack: attack, decay: decay, sustain: 0, release: 1 },
    }).toDestination();
  }