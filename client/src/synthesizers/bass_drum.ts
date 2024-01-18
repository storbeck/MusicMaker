import * as Tone from 'tone';

export function create() {
  const noiseSynth = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.01, sustain: 0, release: 0.01 },
    
  }).toDestination();

  const membraneSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' },
    
  }).toDestination();

  return {
    triggerAttack: (time: number) => {
      noiseSynth.triggerAttackRelease('16n', time);
      membraneSynth.triggerAttackRelease('C1', '8n', time);
    },
    triggerRelease: (time: number) => {
      noiseSynth.triggerRelease(time);
      membraneSynth.triggerRelease('C1');
    }
  };
}