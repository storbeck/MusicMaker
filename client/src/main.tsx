import React from 'react'
import ReactDOM from 'react-dom/client'
import MusicPlayer from './MusicPlayer.tsx'
import { SocketProvider } from './providers/SocketProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <MusicPlayer />
    </SocketProvider>
  </React.StrictMode>,
)
