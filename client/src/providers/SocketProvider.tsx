import { useEffect, useState, createContext } from "react";

const SOCKET_URL = "ws://localhost:8080";
const SOCKET_RECONNECTION_TIMEOUT = 5000; // Adjust this value as needed

const webSocket = new WebSocket(SOCKET_URL);

export const SocketContext = createContext(webSocket);

interface ISocketProvider {
  children: React.ReactChild;
}

export const SocketProvider = ({ children }: ISocketProvider) => {
  const [ws, setWs] = useState(webSocket);

  useEffect(() => {
    const onClose = () => {
      setTimeout(() => {
        setWs(new WebSocket(SOCKET_URL));
      }, SOCKET_RECONNECTION_TIMEOUT);
    };

    ws.addEventListener("close", onClose);

    return () => {
      ws.removeEventListener("close", onClose);
    };
  }, [ws]);

  return (
    <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>
  );
};