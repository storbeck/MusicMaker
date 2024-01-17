# README for Music Maker Application

## Overview

Music Maker is a Node.js and WebSocket-based application that generates and plays a modern hip-hop beat using OpenAI's GPT-3.5 model. The server generates music in JSON format, which can either be saved to a file or sent to a WebSocket client for playback. The client uses Tone.js to synthesize and play the music in real-time.

## Server (`server.js`)

### Dependencies

- Node.js
- `ws`: WebSocket library
- `openai`: OpenAI SDK
- `dotenv`: To manage environment variables

### Setup

1. Install dependencies: `npm install ws openai dotenv`.
2. Set your OpenAI API key in a `.env` file: `OPENAI_API_KEY=your_api_key_here`.

### Usage

- Generate music and save to a file: `ts-node server.js --generate --save sample/musicfile.json`.
- Generate music and output to stdout: `ts-node server.js --generate`.
- Play a music file: `ts-node server.js --file path/to/musicfile.json`.

### Functionality

- `generateMusic`: Uses OpenAI's GPT-3.5 model to generate a hip-hop beat in JSON format.
- `readMusicFile`: Reads a music file and parses it as JSON.
- `playSong`: Sends the generated music to connected WebSocket clients and plays it in a loop.

## Client (`client.html`)

### Dependencies

- Web browser with JavaScript support
- Tone.js (loaded via CDN in the HTML)

### Setup

1. Open `client.html` in a web browser.
2. Click the "Play" button to start the audio context.

### Usage

- Connects to the WebSocket server at `ws://localhost:8080`.
- Receives music data from the server and plays it using Tone.js synthesizers.

### Functionality

- Synthesizer functions (`createKick`, `createSnare`, etc.) to create instruments.
- `initializeAudio`: Sets up WebSocket connection and handles incoming music data.
- `playInstrument`: Plays the received note on the corresponding instrument.

### UI Elements

- "Play" button: Starts the audio context.
- "Pause" button: Pauses the music playback.

## Notes

- The application requires a WebSocket connection between the server and client.
- Music generation is based on OpenAI's GPT-3.5 model and may vary in musicality.
- The client-side script uses Tone.js to synthesize and play music in real-time.
