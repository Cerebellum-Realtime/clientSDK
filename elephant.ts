import { io, Socket } from "socket.io-client";

interface Cerebellum {
  endpoint: string;
  apiKey: string;
  socket: Socket;
}

class Cerebellum {
  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  connect() {
    const socket = io(this.endpoint, {
      auth: { token: this.apiKey }, // this will be an api key that is generated when dev spins up infra
    });

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("connect_error", () => {
      console.log("Connection failed");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    this.socket = socket;
  }
}

// client calls `connect` to create a new web socket connection
// the api key is sent to the server during the handshake
// the server will validate the api key in the auth object
// if valid, server will allow the connection
// if not, server will deny the connection
