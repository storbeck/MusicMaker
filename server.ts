import WebSocket, { WebSocketServer } from 'ws';
import OpenAI from 'openai';
import fs from 'fs';
import { config } from 'dotenv';

config();
const BEATS_PER_MINUTE = 120;

const wss = new WebSocketServer({ port: 8080 });
const openai = new OpenAI();

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface SongData {
  hihat: string[];
  kick: string[];
  snare: string[];
  bass_drum: string[];
  guitar: string[];
  bass_guitar: string[];
  piano: string[];
}

async function generateMusic(): Promise<string> {
  
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are an AI musician specialized in hip hop music. Create a detailed 30-second loopable hip hop beat. The beat should have a structured musical arrangement suitable for a full song, with varying elements and a clear rhythm. Use the following JSON format for the beat, and provide specific notes for each instrument in a sequence that is musically coherent and rich:
    
          {
            "hihat": ["Note1", "Note2", "..."], // Replace Note1, Note2, etc., with actual notes and include silences as empty strings
            "kick": ["Note1", "", "Note3", "..."],
            "snare": ["", "Note2", "", "..."],
            "bass_drum": ["Note1", "", "", "..."],
            "guitar": ["Note3", "Note4", "", "..."],
            "bass_guitar": ["", "Note2", "Note4", "..."],
            "piano": ["Note5", "Note6", "", "..."]
          }
    
          Ensure each array represents the notes played by that instrument in sequence for the entire 60 seconds, with empty strings indicating pauses. The beat should be diverse, rhythmic, suitable for a modern hip hop track, and easy to loop seamlessly`
        }
      ],
      model: 'gpt-3.5-turbo',
    });

  const song = chatCompletion.choices[0].message.content;
  process.stdout.write(`Generated song: ${song}\n`);
  return song as string;
}

function readMusicFile(filePath: string): SongData {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as SongData;
}

function playSong(ws: WebSocket, songData: SongData) {
  (async () => {
    while (true) {
      const maxLength = Math.max(...Object.values(songData).map(notes => notes.length));

      for (let i = 0; i < maxLength; i++) {
        let bundle: { [key: string]: string } = {};  // Updated line

        for (const instrument in songData) {
          const notes = songData[instrument as keyof SongData];
          const note = notes[i] || '';
          bundle[instrument] = note;
        }

        ws.send(JSON.stringify(bundle));
        const delayMs = Math.floor((60 / BEATS_PER_MINUTE) * 1000);
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