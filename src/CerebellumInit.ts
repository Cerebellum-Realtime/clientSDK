/* The `CerebellumInit` class in TypeScript provides methods for initializing a socket connection,
handling authentication, subscribing to channels, managing presence sets, and interacting with
messages. */
import {
  CerebellumOptions,
  Message,
  Acknowledgement,
  getPastMessagesOptions,
  PastMessages,
  Payload,
  State,
  NewState,
} from "./types.js";
import { io, Socket } from "socket.io-client";
import { fetchSignedToken } from "./utils/fetchSignedToken.js";
import { JWTPayload, SignJWT } from "jose";

export class CerebellumInit {
  socket: Socket;
  socketId: String | undefined;

  constructor(endpoint: string, options: CerebellumOptions) {
    this.socket = io(endpoint, options);
    this.socketId = "socketId is not set yet";
    this.init();
  }

  /**
   * The function `createToken` generates a JWT token with a 1-minute expiration time using an API key
   * and payload.
   * @param {string} apiKey - The `apiKey` parameter is a string that represents the API key used for
   * authentication and authorization purposes in the `createToken` function.
   * @param {JWTPayload} payload - The `payload` parameter typically contains the data that you want to
   * include in the JWT (JSON Web Token). This data is usually information about the user or client
   * making the request. It could include things like user ID, roles, permissions, or any other relevant
   * information that needs to be securely transmitted and
   * It is recommended to not use this in production environments.
   */
  async createToken(apiKey: string, payload: JWTPayload) {
    const textEncode = new TextEncoder().encode(apiKey);
    if (apiKey) {
      if (typeof this.socket.auth === "object" && this.socket.auth !== null) {
        this.socket.auth.token = await new SignJWT(payload)
          .setExpirationTime("1m")
          .sign(textEncode);
      }
    }
  }

  /**
   * The function `setToken` asynchronously sets a token for authentication in a TypeScript class if the
   * socket's authentication object is not null.
   * @param {string} token - The `token` parameter in the `setToken` function is a string that represents
   * the authentication token that will be set for the socket connection.
   */
  async setToken(token: string) {
    if (typeof this.socket.auth === "object" && this.socket.auth !== null) {
      this.socket.auth.token = token;
    }
  }

  init() {
    this.addAuthErrorListener();
    this.socket.on("connect", () => {
      this.socketId = this.socket.id;
    });
  }

  /**
   * The `on` function in TypeScript sets up an event listener with a specified event and callback
   * function.
   * @param {string} event - The `event` parameter is a string that represents the event name for which
   * the callback function should be triggered.
   * @param callback - The `callback` parameter is a function that can accept any number of arguments of
   * any type and return a value of any type. It is used to handle events in the `on` method by passing
   * it as a callback function to be executed when the specified event occurs.
   */
  on(event: string, callback: (...args: any) => any) {
    this.socket.on(event, callback);
  }

  /**
   * The function `authErrorCallback` listens for a connection error event and calls a callback function
   * if the error message is "Authentication error".
   * @param callback - The `callback` parameter in the `authErrorCallback` function is a function that
   * takes any number of arguments of any type and returns a value of any type. It is used to handle the
   * authentication error scenario when a connection error event occurs on the socket.
   */
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

  /* The `connect()` method in the `CerebellumInit` class is used to establish a connection with the
cerebellum server. It is called when the `connect` method is called on the cerebellum instance. */
  connect() {
    this.socket.connect();
  }

  /**
   * The `disconnect` function disconnects the cerebellum instance from the server.
   * @return {void} - This function does not return a value.
   */
  disconnect() {
    this.socket.disconnect();
  }

  /**
   * The `off` function in TypeScript is used to remove a callback function for a specific event from a
   * cerebellum instance.
   * @param {string} event - The `event` parameter is a string that represents the event name for which
   * the callback function should be removed.
   * @param callback - The `callback` parameter is a function that takes any number of arguments and
   * returns a value. In the `off` method, it is used to remove the specified callback function from
   * the event listeners.
   * @return {void} - This function does not return a value.
   */
  off(event: string, callback: (...args: any) => any) {
    this.socket.off(event, callback);
  }

  /**
   * The `auth` function in TypeScript asynchronously fetches a signed token from an authentication
   * endpoint and updates the token in the cerebellum instance. It is used to authenticate with the cerebellum
   * server and establish a connection.
   * @param {string} authEndpoint - The `authEndpoint` parameter is a string that represents the endpoint
   * URL where the authentication request will be sent. This endpoint is typically a server route that
   * handles authentication requests and issues tokens for authorization.
   * @param {"GET" | "POST"} [method=POST] - The `method` parameter in the `auth` function specifies the
   * HTTP method to be used for the authentication request. It can be either "GET" or "POST", with a
   * default value of "POST" if not provided.
   * @param {Payload} payload - The `payload` parameter in the `auth` function represents the data that
   * will be sent along with the request to the authentication endpoint. It is optional. It contains information required
   * for authentication, such as user credentials or any other necessary data. The `Payload` type is not
   * explicitly defined in the code snippet you provided,
   */
  async auth(
    authEndpoint: string,
    method: "GET" | "POST" = "POST",
    payload?: Payload
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

  /**
   * This TypeScript function retrieves past messages from a specified channel using provided options and
   * returns a Promise with the past messages and last evaluated key.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel for which you want to retrieve past messages.
   * @param {getPastMessagesOptions} options - The `options` parameter is an object that contains
   * optional parameters for retrieving past messages. It has properties such as `limit`, `sortDirection`, and
   * `lastEvaluatedKey``. These properties are used to control the number of messages
   * returned, their sort order, and pagination.
   * @param {number} [options.limit=50] - The `limit` property in the `options` parameter is a number
   * that represents the maximum number of messages to retrieve. It is optional and has a default value of 50.
   * @param {"ascending" | "descending"} [options.sortDirection="ascending"] - The `sortDirection` property
   * in the `options` parameter is a string that represents the sort order of the messages. It can be either
   * "ascending" or "descending". It is optional and has a default value of "ascending".
   * @param {LastEvaluatedKey} [options.lastEvaluatedKey] - The `lastEvaluatedKey` property in the `options`
   * parameter is an object that represents the last evaluated key used for pagination. It is optional and
   * can be used to retrieve messages from a specific point in the channel's history.
   * @param {getPastMessagesOptions}  - The `getPastMessages` function takes in the following parameters:
   * @returns A Promise that resolves to an object containing past messages and the last evaluated key,
   * or rejects with an error message if there was a failure to retrieve messages from the specified
   * channel.
   */
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
          console.log(ack);
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

  /**
   * The `subscribeChannel` function subscribes to a channel and executes a callback function when
   * messages are received.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel to which you want to subscribe for receiving messages.
   * @param [callback] - The `callback` parameter in the `subscribeChannel` function is a function that
   * takes `pastMessages` of type `Message` as a parameter and returns any value. This callback function
   * is optional and will be called when a new message is received on the specified channel after
   * subscribing.
   * The object passed to the callback function contains the following properties:
   * @param {Message} messages - The `messages` property in the `pastMessages` object is an
   * array of `Message` objects, each representing a message received on the channel.
   * @param {LastEvaluatedKey} lastEvaluatedKey - The `lastEvaluatedKey` property in the
   * `pastMessages` object is an object that represents the last evaluated key used for pagination.
   * @param {socketId} socketId - The `socketId` property in the `pastMessages` object is a string that
   * represents the socket ID of the user who sent the message.
   * @return {void} - This function does not return a value.
   */
  subscribeChannel(
    channelName: string,
    callback?: (pastMessages: Message) => any
  ) {
    this.socket.emit(
      "channel:subscribe",
      channelName,
      (ack: Acknowledgement) => {
        if (ack.success) {
          if (callback) {
            this.socket.on(`message:receive:${channelName}`, callback);
          }
        } else {
          console.error(`Failed to subscribe to channel ${channelName}`);
        }
      }
    );
  }

  /**
   * The function `unsubscribeChannel` unsubscribes from a specific channel and removes the provided
   * callback for message reception.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel from which you want to unsubscribe.
   * @param callback - The `callback` parameter in the `unsubscribeChannel` function that was passed to the `subscribeChannel` function
   * is used to remove the callback function for message reception
   * @return {void} - This function does not return a value.
   */
  unsubscribeChannel(
    channelName: string,
    callback: (messages: Message) => any
  ) {
    this.socket.emit(
      `channel:unsubscribe`,
      channelName,
      (ack: Acknowledgement) => {
        if (ack.success) {
          this.socket.off(`message:receive:${channelName}`, callback);
        } else {
          console.error(`Failed to unsubscribe from channel ${channelName}`);
        }
      }
    );
  }

  /**
   * The `publish` function emits a message to a specific channel using a socket connection.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel where the message will be published.
   * @param {any} message - The 'message' parameter can be any type of data that you want to send to the
   * channel. It can be a string, number, object, or any other type of data.
   * @return {void} - This function does not return a value.
   */
  publish(channelName: string, message: any) {
    this.socket.emit("message:queue", channelName, message);
  }

  /**
   * The function `enterPresenceSet` emits a socket event "presenceSet:enter" with the provided
   * channelName and state.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel where the presence set action is being performed.
   * @param {State} state - The `state` parameter in the `enterPresenceSet` function represents
   * the current state of the user or client entering the specified channel. This state could include
   * information such as the user's status, activity, or any other relevant data that needs to be
   * communicated when entering the channel.
   * @return {void} - This function does not return a value.
   */
  enterPresenceSet(channelName: string, state: NewState) {
    this.socket.emit("presenceSet:enter", channelName, state);
  }

  /**
   * The function `leavePresenceSet` emits a message to leave a presence channel. Users subscribed to presence
   * leave events will be notified when a user leaves the channel.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel from which the user wants to leave the presence set.
   * @return {void} - This function does not return a value.
   */
  leavePresenceSet(channelName: string) {
    this.socket.emit("presenceSet:leave", channelName);
  }

  /**
   * This function retrieves the members of a presence set for a given channel name using a Promise in
   * TypeScript.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel for which you want to retrieve the presence set members.
   * @returns The `getPresenceSetMembers` function returns a Promise that resolves with an array of
   * `State` objects representing the members of the presence set in the specified `channelName`. If the
   * operation is successful, the Promise resolves with the array of users. If there is an error or the
   * operation fails, the Promise rejects with an error message indicating the failure to subscribe to
   * the presence set in the specified channel
   */
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

  /**
   * The function `subscribeToPresenceJoins` subscribes to presence join events on a specific channel and
   * executes a callback function when such events occur.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel to subscribe to for presence joins.
   * @param callback - The `callback` parameter is a function that takes a `State` object as an argument
   * and returns any value. This function will be executed when a user joins the presence channel
   * specified by the `channelName`.
   */
  /**
   * The function `subscribeToPresenceJoins` subscribes to presence join events on a specific channel and
   * executes a callback function when such events occur.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel to which you want to subscribe for presence join events.
   * @param callback - The `callback` parameter is a function that takes a `State` object as its argument
   * and returns any value. This function will be executed when a presence join event is received on the
   * specified channel.
   */
  subscribeToPresenceJoins(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.on(`presence:${channelName}:join`, callback);
  }

  /**
   * The function `subscribeToPresenceUpdates` listens for updates on a specific channel and triggers a
   * callback function when an update occurs.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel for which you want to subscribe to presence updates.
   * @param callback - The `callback` parameter is a function that takes a `State` object as an argument
   * and returns any value. This function is used to handle updates to the presence state of a channel
   * with the specified name.
   */
  subscribeToPresenceUpdates(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.on(`presence:${channelName}:update`, callback);
  }

  /**
   * The function `subscribeToPresenceLeaves` subscribes to presence leave events on a specific channel
   * and executes a callback function when such events occur.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel to subscribe to for presence leave events.
   * @param callback - The `callback` parameter is a function that takes a `State` object as an argument
   * and returns any value. This function will be executed when a user leaves the presence channel
   * specified by `channelName`.
   */
  subscribeToPresenceLeaves(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.on(`presence:${channelName}:leave`, callback);
  }

  /**
   * This function unsubscribes a callback from receiving leave events on a presence channel in
   * TypeScript.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel from which you want to unsubscribe from presence leave events.
   * @param callback - The `callback` parameter is a function that was passed to the `subscribeToPresenceLeaves`
   * function and is used to remove the callback function for presence leave events.
   * @return {void} - This function does not return a value.
   */
  unsubscribeFromPresenceLeaves(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.off(`presence:${channelName}:leave`, callback);
  }

  /**
   * This function unsubscribes a callback function from receiving presence join events on a specific
   * channel.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel from which you want to unsubscribe from presence joins.
   * @param callback - The `callback` parameter is a function that was passed to the `subscribeToPresenceJoins`
   * function and is used to remove the callback function for presence join events.
   * @return {void} - This function does not return a value.
   */
  unsubscribeFromPresenceJoins(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.off(`presence:${channelName}:join`, callback);
  }

  /**
   * The function `unsubscribeFromPresenceUpdates` removes a callback function from listening to presence
   * update events on a specific channel.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel from which you want to unsubscribe from presence updates.
   * @param callback - The `callback` parameter is a function that was passed to the `subscribeToPresenceUpdates`
   * function and is used to remove the callback function for presence updates.
   * @return {void} - This function does not return a value.
   */
  unsubscribeFromPresenceUpdates(
    channelName: string,
    callback: (state: State) => any
  ) {
    this.socket.off(`presence:${channelName}:update`, callback);
  }

  /**
   * The function `updatePresenceInfo` emits a socket event to update the presence information for a
   * specific channel.
   * @param {string} channelName - The `channelName` parameter is a string that represents the name of
   * the channel for which you want to update the presence information.
   * @param {State} state - The `state` parameter in the `updatePresenceInfo` function likely represents
   * the current state or status information that you want to update for a specific channel. This could
   * include details such as online/offline status, activity status, or any other relevant information
   * related to the presence of a user or entity in
   */
  updatePresenceInfo(channelName: string, state: NewState) {
    this.socket.emit("presence:update", channelName, state);
  }

  /**
   * The `getSocket` function returns the socket object.
   * @returns The `socket` property of the current object is being returned.
   */
  getSocket() {
    return this.socket;
  }
}
