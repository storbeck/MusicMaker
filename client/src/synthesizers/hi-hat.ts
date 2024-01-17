import * as Tone from 'tone';

export function create() {
    return new Tone.MetalSynth({
        envelope: { attack: 0.005, decay: 0.1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 8000,
        octaves: 1
    }).toDestination();
}