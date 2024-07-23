import { io } from "socket.io-client";
import axios from "axios";

const fetchSignedToken = async (authRoute, authMethod = "POST", payload) => {
  console.log(authRoute);
  try {
    const { data } =
      authMethod === "GET"
        ? await axios.get(authRoute)
        : await axios.post(authRoute, payload);
    return data;
  } catch (error) {
    console.error("Error fetching token: ", error);
    throw error;
  }
};

const initializeConnection = async (options) => {
  try {
    const { endpoint, method, payload } = options.authRoute;
    const token = await fetchSignedToken(endpoint, method, payload);

    options.auth = {};
    options.auth.token = token;
    options.autoConnect = true;
  } catch (error) {
    console.error("Error initializing connection: ", error);
  }
};

export const Cerebellum = async (endpoint, options) => {
  options.auth = {};

  if (options.autoConnect === true) await initializeConnection(options);

  return new CerebellumInit(endpoint, options);
};

class CerebellumInit {
  constructor(endpoint, options = {}) {
    this.socket = io(endpoint, options);
    this.init();
  }

  init() {
    this.addAuthErrorListener;
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  authErrorCallback(callback) {
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

  off(event, callback) {
    this.socket.off(event, callback);
  }

  async auth(authEndpoint, method, payload) {
    try {
      const token = await fetchSignedToken(authEndpoint, method, payload);

      this.socket.auth.token = token;
    } catch (error) {
      console.error("Error initializing connection: ", error);
    }
  }
  getPastMessages(
    channelName,
    {
      limit = 50,
      sortDirection = "ascending",
      lastEvaluatedKey = undefined,
    } = {}
  ) {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        "channel:history",
        channelName,
        limit,
        sortDirection,
        lastEvaluatedKey,
        (ack) => {
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

  subscribeChannel(channelName, callback) {
    this.socket.emit("channel:subscribe", channelName, (ack) => {
      if (ack.success) {
        this.socket.on(`message:receive:${channelName}`, callback);
      } else {
        console.error(`Failed to subscribe to channel ${channelName}`);
      }
    });
  }

  unsubscribeChannel(channelName, callback) {
    this.socket.emit(`channel:unsubscribe`, channelName, (ack) => {
      if (ack.success) {
        callback();
        console.log(`Unsubscribed from channel ${channelName}`);
      } else {
        console.error(`Failed to unsubscribe from channel ${channelName}`);
      }
    });
    this.socket.off(`message:receive:${channelName}`, callback);
  }

  publish(channelName, message) {
    this.socket.emit("message:queue", channelName, message);
  }

  //enters the user into the presence set, lets everyone know that someone has entered
  enterPresenceSet(channelName, state) {
    this.socket.emit("presenceSet:enter", channelName, state);
  }

  leavePresenceSet(channelName) {
    this.socket.emit("presenceSet:leave", channelName);
  }

  //Get the current members in the presence set
  getPresenceSetMembers(channelName) {
    return new Promise((resolve, reject) => {
      this.socket.emit("presence:members:get", channelName, (ack) => {
        if (ack.success === true) {
          resolve(ack.users);
        } else {
          reject(
            new Error(`Failed to subscribe to presence set ${channelName}`)
          );
        }
      });
    });
  }

  subscribeToPresenceJoins(channelName, callback) {
    this.socket.on(`presence:${channelName}:join`, callback);
  }
  //subscribePresenceUpdate
  subscribeToPresenceUpdates(channelName, callback) {
    this.socket.on(`presence:${channelName}:update`, callback);
  }

  //subscribePresenceLeave
  subscribeToPresenceLeaves(channelName, callback) {
    this.socket.on(`presence:${channelName}:leave`, callback);
  }

  // Method to unsubscribe from presence leave events
  unsubscribeFromPresenceLeaves(channelName, callback) {
    this.socket.off(`presence:${channelName}:leave`, callback);
  }

  // Method to unsubscribe from presence join events
  unsubscribeFromPresenceJoins(channelName, callback) {
    this.socket.off(`presence:${channelName}:join`, callback);
  }

  // Method to unsubscribe from presence update events
  unsubscribeFromPresenceUpdates(channelName, callback) {
    this.socket.off(`presence:${channelName}:update`, callback);
  }

  updatePresenceInfo(channelName, state) {
    this.socket.emit("presence:update", channelName, state);
  }

  getSocket() {
    return this.socket;
  }
}

// Messages are broadcast on channels. The following example code subscribes
// the client to a channel called quickstart and sets a filter so that the client only receives
// messages with the name greeting. When a message is received, its contents will be printed
// after the text Received a greeting message in realtime:.

// Note: The channel is created in the Ably service when the client subscribes to it.

// get the channel to subscribe to
// const channel = ably.channels.get("quickstart");
// // const channe

// /*
//   Subscribe to a channel.
//   The promise resolves when the channel is attached
//   (and resolves synchronously if the channel is already attached).
// */
// await channel.subscribe("greeting", (message) => {
//   console.log("Received a greeting message in realtime: " + message.data);
// });

/* 
  this.presence = {
    room1: [dylan, will],
    room2: [avery, austin]
  }
*/
