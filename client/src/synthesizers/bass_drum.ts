import * as Tone from 'tone';

export function create(attack: number, decay: number, oscillatorType: "sine" | "square" | "triangle" | "sawtooth") {
  return new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2, // Adjust the octaves as needed for a bass drum
    oscillator: { type: oscillatorType },
    envelope: { attack: attack, decay: decay, sustain: 0, release: 0.1 } // You can adjust release time
  }).toDestination();
}