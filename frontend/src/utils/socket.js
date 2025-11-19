// src/utils/socket.js
import { io } from "socket.io-client";

// Works in Vite → no process.env
const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
