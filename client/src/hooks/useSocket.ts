import { SocketContext } from "../providers/SocketProvider";
import { useContext } from "react";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  return socket;
};