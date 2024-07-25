import {
  CerebellumOptions,
  Message,
  Acknowledgement,
  getPastMessagesOptions,
  PastMessages,
  Payload,
  State,
} from "./types";
import { io, Socket } from "socket.io-client";
import { fetchSignedToken } from "./utils/fetchSignedToken";
import jwt from "jsonwebtoken";

export class CerebellumInit {
  socket: Socket;

  constructor(endpoint: string, options: CerebellumOptions) {
    this.socket = io(endpoint, options);
    this.init();
  }

  // DO NOT USE IN PRODUCTION
  createToken(apiKey: string, payload: object) {
    const token = jwt.sign(payload, apiKey, { expiresIn: "1m" });
    
    if (typeof this.socket.auth === "object" && this.socket.auth !== null) {
      this.socket.auth.token = token;
    }
  }

  init() {
    this.addAuthErrorListener;
  }

  on(event: string, callback: (...args: any) => any) {
    this.socket.on(event, callback);
  }

  authErrorCallback(callback: (...args: any) => any) {
    this.socket.on("connect_error", (reason) => {
      console.log("Connection error:", reason.message);
      if (reason.message === "Authentication error") {
        callback();
      }
    });
  }

  addAuthErrorListener() {
    this.socket.on("connect_error", (reason) => {
      console.log("Connection error:", reason.message);
      if (reason.message === "Authentication error") {
        this.socket.disconnect();
      }
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  off(event: string, callback: (...args: any) => any) {
    this.socket.off(event, callback);
  }

  async auth(
    authEndpoint: string,
    method: "GET" | "POST" = "POST",
    payload: Payload
  ): Promise<void> {
    try {
      const token: string = await fetchSignedToken(
        authEndpoint,
        method,
        payload
      );

      if (typeof this.socket.auth === "object" && this.socket.auth !== null) {
        this.socket.auth.token = token;
      } else {
        console.error("socket.auth is not an object");
      }
    } catch (error) {
      console.error("Error initializing connection: ", error);
    }
  }

  getPastMessages(
    channelName: string,
    {
      limit = 50,
      sortDirection = "ascending",
      lastEvaluatedKey = undefined,
    }: getPastMessagesOptions = {}
  ): Promise<PastMessages> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        "channel:history",
        channelName,
        limit,
        sortDirection,
        lastEvaluatedKey,
        (ack: Acknowledgement) => {
          if (ack.success === true && ack.pastMessages !== undefined) {
            resolve({
              messages: ack.pastMessages,
              lastEvaluatedKey: ack.lastEvaluatedKey,
            });
          } else {
            reject(new Error(`Failed to get messages from ${channelName}`));
          }
        }
      );
    });
  }

  subscribeChannel(
    channelName: string,
    callback: (pastMessages: Message) => any
  ) {
    this.socket.emit(
      "channel:subscribe",
      channelName,
      (ack: Acknowledgement) => {
        if (ack.success) {
          this.socket.on(`message:receive:${channelName}`, callback);
        } else {
          console.error(`Failed to subscribe to channel ${channelName}`);
        }
      }
    );
  }

  unsubscribeChannel(
    channelName: string,
    callback: (messages: Message) => any
  ) {
    this.socket.emit(
      `channel:unsubscribe`,
      channelName,
      (ack: Acknowledgement) => {
        if (ack.success) {
          console.log(`Unsubscribed from channel ${channelName}`);
          this.socket.off(`message:receive:${channelName}`, callback);
        } else {
          console.error(`Failed to unsubscribe from channel ${channelName}`);
        }
      }
    );
  }

  publish(channelName: string, message: any) {
    this.socket.emit("message:queue", channelName, message);
  }

  //enters the user into the presence set, lets everyone know that someone has entered
  enterPresenceSet(channelName: string, state: State) {
    this.socket.emit("presenceSet:enter", channelName, state);
  }

  leavePresenceSet(channelName: string) {
    this.socket.emit("presenceSet:leave", channelName);
  }

  //Get the current members in the presence set
  getPresenceSetMembers(channelName: string): Promise<State[]> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        "presence:members:get",
        channelName,
        (ack: Acknowledgement) => {
          if (ack.success === true && ack.users !== undefined) {
            resolve(ack.users);
          } else {
            reject(
              new Error(`Failed to subscribe to presence set ${channelName}`)
            );
          }
        }
      );
    });
  }

  subscribeToPresenceJoins(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.on(`presence:${channelName}:join`, callback);
  }

  //subscribePresenceUpdate
  subscribeToPresenceUpdates(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.on(`presence:${channelName}:update`, callback);
  }

  //subscribePresenceLeave
  subscribeToPresenceLeaves(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.on(`presence:${channelName}:leave`, callback);
  }

  // Method to unsubscribe from presence leave events
  unsubscribeFromPresenceLeaves(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.off(`presence:${channelName}:leave`, callback);
  }

  // Method to unsubscribe from presence join events
  unsubscribeFromPresenceJoins(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.off(`presence:${channelName}:join`, callback);
  }

  // Method to unsubscribe from presence update events
  unsubscribeFromPresenceUpdates(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.off(`presence:${channelName}:update`, callback);
  }

  updatePresenceInfo(channelName: string, state: State) {
    this.socket.emit("presence:update", channelName, state);
  }

  getSocket() {
    return this.socket;
  }
}
