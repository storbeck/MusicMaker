import WebSocket, { WebSocketServer } from 'ws';
import OpenAI from 'openai';
import fs from 'fs';
import { config } from 'dotenv';

config();
const BEATS_PER_MINUTE = 60;

const wss = new WebSocketServer({ port: 8080 });
const openai = new OpenAI();

/**
 * Delays the execution for the specified number of milliseconds.
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Represents the data structure for a song.
 */
interface SongData {
  hihat: string[];
  kick: string[];
  snare: string[];
  bass_drum: string[];
  guitar: string[];
  bass_guitar: string[];
  piano: string[];
}

/**
 * Generates a detailed 30-second loopable hip hop beat using AI.
 * The beat has a structured musical arrangement suitable for a full song,
 * with varying elements and a clear rhythm.
 * 
 * @returns A Promise that resolves to a string representing the generated beat.
 */
async function generateMusic(): Promise<string> {
   // AI code for generating music
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are an AI musician specialized in hip hop music. Create a detailed 30-second loopable hip hop beat with chords. The beat should have a structured musical arrangement suitable for a full song, with varying elements and a clear rhythm. Use the following JSON format for the beat, providing specific chords for each instrument in a sequence that is musically coherent and rich:
    
          {
            "guitar": ["Cmaj", "Gmaj", "Am", "Fmaj"], // Example chord progression
            "piano": ["Dmin", "Amin", "Emin", "Gmaj"],
            "hihat": ["Chord1", "Chord2", "..."], // Replace Chrod1, Chord2, etc., with actual chords as collection of notes and include silences as empty strings
            "kick": ["Chord1", "", "Chord3", "..."],
            "snare": ["", "Chord2", "", "..."],
            "bass_drum": ["Chord1", "", "", "..."],
            "bass_guitar": ["", "Chord2", "Chord4", "..."],
          }
    
          Each array represents the chords played by that instrument in sequence for the entire 30 seconds, with empty strings indicating pauses. The beat should be diverse, rhythmic, suitable for a modern hip hop track, and easy to loop seamlessly.`
        }
      ],
      model: 'gpt-3.5-turbo',
    });

  const song = chatCompletion.choices[0].message.content;
  process.stdout.write(`Generated song: ${song}\n`);
  return song as string;
}

/**
 * Reads a music file from the specified file path and returns the parsed song data.
 * @param filePath - The path to the music file.
 * @returns The parsed song data.
 */
function readMusicFile(filePath: string): SongData {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as SongData;
}

/**
 * Plays a song by sending instrument notes to a WebSocket connection.
 * @param ws The WebSocket connection to send the notes to.
 * @param songData The data representing the song and its instruments.
 */
function playSong(ws: WebSocket, songData: SongData) {
  (async () => {
    while (true) {
      const maxLength = Math.max(...Object.values(songData).map(notes => notes.length));

      for (let i = 0; i < maxLength; i++) {
        let bundle: { [key: string]: string } = {};

        for (const instrument in songData) {
          const chords = songData[instrument as keyof SongData];
          const chord = chords[i] || '';
          bundle[instrument] = chord;
        }

        process.stdout.write(`Sending bundle: ${JSON.stringify(bundle)}\n`);
        ws.send(JSON.stringify(bundle));
        const delayMs = Math.floor((60 / BEATS_PER_MINUTE) * 1000); // Removed * 2
        await delay(delayMs);
      }
    }
  })();
}

// Command-line argument processing
const args = process.argv.slice(2);
const generateIndex = args.indexOf('--generate');
const saveIndex = args.indexOf('--save');

if (generateIndex !== -1) {
  generateMusic().then(songData => {
    if (saveIndex !== -1 && args[saveIndex + 1]) {
      const filename = args[saveIndex + 1];
      fs.writeFileSync(filename, songData);
      process.stdout.write(`Song saved to ${filename}\n`);
      process.exit(0);
    }
  });
} else if (args.includes('--file')) {
  const fileIndex = args.indexOf('--file') + 1;
  const filePath = args[fileIndex];
  const fileSong = readMusicFile(filePath);
  wss.on('connection', (ws) => {
    playSong(ws, fileSong);
  });
}