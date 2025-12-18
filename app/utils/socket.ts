import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
    console.log("token", token);
  if (!socket) {
    socket = io("http://localhost:5000", {
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
};
