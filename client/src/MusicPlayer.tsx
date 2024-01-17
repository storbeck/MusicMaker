import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { createSnare, createHiHat, createBassDrum, createBassGuitar, createGuitar, createPiano, createKick } from './synthesizers';
import { useSocket } from './hooks/useSocket';

// Define Synths type
interface Synths {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  bass_drum: Tone.MembraneSynth;
  hihat: Tone.MetalSynth;
  bass_guitar: Tone.Synth;
  guitar: Tone.PolySynth<Tone.FMSynth>;
  piano: Tone.PolySynth<Tone.Synth>;
}

const timeTable = {
  'snare': '16n',
  'kick': '4n',
  'bass_drum': '4n',
  'hihat': '16n',
  'bass_guitar': '4n',
  'guitar': '4n',
  'piano': '4n',
}


function MusicPlayer() {
  const audioContextRef = useRef<Tone.Context>(new Tone.Context({ latencyHint: 'playback' }));
  const socket = useSocket();

  const [synths] = useState<Synths>({
    kick: createKick(0.001, 0.5, 6, 'sine'),
    snare: createSnare(),
    bass_drum: createBassDrum(0.001, 0.5, 'sine'),
    hihat: createHiHat(),
    bass_guitar: createBassGuitar(),
    guitar: createGuitar(),
    piano: createPiano(),
  });

  const onMessage = useCallback((event: MessageEvent) => {
    const bundle = JSON.parse(event.data);

    for (const instrument in bundle) {
      const note = bundle[instrument];
      if (note) {
        playInstrument(instrument, note);
      }
    }
  }, [])

  useEffect(() => {
    socket.addEventListener('message', onMessage);
    return () => {
      socket.removeEventListener('message', onMessage);
    }
  }, [socket, onMessage]);
  

  const handleStartAudio = async () => {
    if (!audioContextRef.current) {
      // Create the audio context if it doesn't exist
      audioContextRef.current = new Tone.Context({ latencyHint: 'playback' });
    }

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
      for (const instrumentKey in synths) {
        const instrument = instrumentKey as keyof Synths;
        const synth = synths[instrument];

        if (synth) {
          synth.triggerRelease(0);
        }
      }

      audioContextRef.current.close().then(() => {
        console.log('Audio context stopped');
      }).catch((error) => {
        console.error(error);
      });
    }
  }


  function playInstrument(instrument: string, note: string) {
    const synth = synths[instrument as keyof Synths];

    try {
      if (synth) {
        console.log(`Playing ${instrument} note ${note}`)

        // Snare does not produce pitched notes
        if (instrument === 'snare') {
          synths.snare.triggerAttackRelease(timeTable['snare']);
        } else {
          synth.triggerAttackRelease(note, timeTable[instrument as keyof typeof timeTable]);
        }
      }
    } catch (error) {
      console.error(`Error in playInstrument for ${instrument}: ${error}`);
    }
  }

  return (
    <div>
      <h1>WebSocket Music Player</h1>
      <p>Connecting to the server and playing music...</p>
      {/* UI elements for volume control, play, and pause */}
      <input type="range" min="0" max="100" defaultValue="50" />
      <button id="playButton" onClick={handleStartAudio}>Play</button>
      <button id="pauseButton" onClick={handleStopAudio}>Pause</button>
    </div>
  );
}

export default MusicPlayer;
