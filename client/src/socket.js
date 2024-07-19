import { io } from "socket.io-client";


let URL;
if (process.env.NODE_ENV === "development") {
  URL = "localhost:8000";
} else {
  URL = import.meta.env.VITE_LOAD_BALANCER_ENDPOINT; // does this need the protocol in front of it?
}

export const socket = io(URL, {
  autoConnect: false,
  auth: {}, // Token gets added in Username component
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});
