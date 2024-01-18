import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { createSnare, createHiHat, createBassDrum, createBassGuitar, createGuitar, createPiano, createKick } from './synthesizers';
import { useSocket } from './hooks/useSocket';
import { SynthOptions } from 'tone';

// Define Synths type
type BassDrumSynth = { triggerAttack: (time: number) => void, triggerRelease: (time: number) => void };

interface Synths {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  bass_drum: BassDrumSynth;
  hihat: Tone.MetalSynth;
  bass_guitar: Tone.Synth;
  guitar: Tone.PolySynth<Tone.FMSynth>;
  piano: Tone.Sampler;
}

Tone.Transport.bpm.value = 80;

const timeTable = {
  'snare': '8n',
  'kick': '2n',
  'bass_drum': '2n',
  'hihat': '16n',
  'bass_guitar': '2n',
  'guitar': '2n',
  'piano': '2n',
};

function MusicPlayer() {
  const audioContextRef = useRef<Tone.Context>(new Tone.Context({ latencyHint: 'playback' }));
  const socket = useSocket();

  const [synths, setSynths] = useState<Synths | null>(null);

  useEffect(() => {
    const loadSynths = async () => {
      setSynths({
        kick: createKick(0.001, 0.5, 6, 'sine'),
        snare: createSnare(),
        bass_drum: await createBassDrum(),
        hihat: createHiHat(),
        bass_guitar: createBassGuitar(),
        guitar: createGuitar(),
        piano: await createPiano(),
      });
    };

    loadSynths();
  }, []);

  const chordToNotes = (chord: string) => {
    // A simple mapping from chord names to note arrays
    const chordMap = {
      'Amaj': ['A', 'C#', 'E'],
      'Bmaj': ['B', 'D#', 'F#'],
      'Cmaj': ['C', 'E', 'G'],
      'Dmaj': ['D', 'F#', 'A'],
      'Emaj': ['E', 'G#', 'B'],
      'Fmaj': ['F', 'A', 'C'],
      'Gmaj': ['G', 'B', 'D'],
      'Amin': ['A', 'C', 'E'],
      'Bmin': ['B', 'D', 'F#'],
      'Cmin': ['C', 'Eb', 'G'],
      'Dmin': ['D', 'F', 'A'],
      'Emin': ['E', 'G', 'B'],
      'Fmin': ['F', 'Ab', 'C'],
      'Gmin': ['G', 'Bb', 'D'],
      
      // Add more chords as needed
    };
  
    return chordMap[chord as keyof typeof chordMap] || [];
  };

  const playInstrument = useCallback((instrument: string, chordOrNote: string | undefined) => {
    if (!chordOrNote) {
      return;
    }
  
    if (!synths) {
      console.error('Synths not loaded');
      return;
    }
  
    const synth = synths[instrument as keyof Synths];
    if (!synth) {
      console.error(`Instrument ${instrument} not found`);
      return;
    }
  
    try {
      console.log(`Playing ${instrument} notes ${chordOrNote}`);
      const notes = chordToNotes(chordOrNote);
      notes.forEach((note, index) => {
        const noteWithOctave = note.length === 1 ? `${note}4` : note; // Append '4' if octave is missing
        const startTime = Tone.now() + index * 0.2 + 0.1; // Add a small delay
  
        if (synth instanceof Tone.Sampler) {
          synth.triggerAttack(noteWithOctave, startTime);
          synth.triggerRelease(startTime + 0.5); // Release the note after 0.5 seconds
        } else if (synth.triggerAttack) {
          synth.triggerAttack(startTime);
          synth.triggerRelease(startTime + 0.5); // Release the note after 0.5 seconds
        } else {
          (synth as Tone.Synth<SynthOptions>).triggerAttackRelease(noteWithOctave, timeTable[instrument as keyof typeof timeTable], startTime);
        }
      });
    } catch (error) {
      console.error(`Error in playInstrument for ${instrument}: ${error}`);
    }
  }, [synths]);
  
  const onMessage = useCallback(async (event: MessageEvent) => {
    const bundle = JSON.parse(event.data);
    const playPromises = Object.entries(bundle).map(([instrument, chord]) => {
      if (typeof chord === 'string') {
        return playInstrument(instrument, chord);
      }
    }).filter(promise => promise !== undefined);
  
    await Promise.all(playPromises);
  }, [playInstrument]);
  

  useEffect(() => {
    socket.addEventListener('message', onMessage);
    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket, onMessage]);

  const handleStartAudio = async () => {
    if (audioContextRef.current.state !== 'running') {
      try {
        await audioContextRef.current.resume();
        console.log('Audio context started');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStopAudio = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.close().then(() => {
        console.log('Audio context stopped');
      }).catch((error) => {
        console.error(error);
      });
    }
  };

  return (
    <div>
      <h1>WebSocket Music Player</h1>
      <p>Connecting to the server and playing music...</p>
      <input type="range" min="0" max="100" defaultValue="50" />
      <button id="playButton" onClick={handleStartAudio}>Play</button>
      <button id="pauseButton" onClick={handleStopAudio}>Pause</button>
    </div>
  );
}

export default MusicPlayer;
