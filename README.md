# Music Maker Application

The Music Maker Application is a Node.js and WebSocket-based application that generates and plays modern hip-hop beats. It utilizes OpenAI's GPT-3.5 model for music generation and Tone.js for real-time music playback.

## Getting Started

Follow these steps to set up and run the Music Maker Application:

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/storbeck/MusicMaker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd <project_directory>
   ```

3. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

4. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

### Configuration

1. Set your OpenAI API key by creating a `.env` file in the server directory:

   ```plaintext
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

You can run the server and client separately or together.

### Running the Server

To start the server for generating and playing music, run the following commands from the server directory:

- Generate music and save to a file:

  ```bash
  npm run generate-music --save songs/sample5.json
  ```

- Generate music and output to stdout:

  ```bash
  npm run generate-music 
  ```

- Play a music file:

  ```bash
  npm run play-music example_song2.json
  ```

### Running the Client

To start the client for real-time music playback, run the following commands from the client directory:

- Start the local development server

  ```bash
  npm run dev
  ```

### Running Both Server and Client Concurrently

To run both the server and client concurrently, use the following command from the project directory:

```bash
npm run start:both
```

This will start both the server and client, allowing you to generate and play music in real-time.

## Functionality

- The server uses OpenAI's GPT-3.5 model to generate hip-hop beats in JSON format.
- The client connects to the WebSocket server and plays the received music using Tone.js synthesizers.
- You can customize the instruments and music generation by modifying the server code.

## Notes

- The Music Maker Application requires a WebSocket connection between the server and client.
- Music generation is based on OpenAI's GPT-3.5 model and may vary in musicality.
- The client-side script uses Tone.js to synthesize and play music in real-time.