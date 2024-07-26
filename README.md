# Cerebellum SDK Documentation

## Table of Contents

- [Cerebellum SDK Documentation](#cerebellum-sdk-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Local Development Setup](#local-development-setup)
  - [Getting Started](#getting-started)
  - [React](#react)
  - [Cerebellum Options](#cerebellum-options)
    - [`autoConnect`](#autoconnect)
    - [`API_KEY`](#api_key)
    - [`authRoute`](#authroute)
    - [`reconnection`](#reconnection)
    - [`reconnectionAttempts`](#reconnectionattempts)
    - [`reconnectionDelay`](#reconnectiondelay)
    - [`reconnectionDelayMax`](#reconnectiondelaymax)
    - [`timeout`](#timeout)
  - [Properties](#properties)
    - [`socketId`](#socketid)
  - [Methods](#methods)
    - [General Methods](#general-methods)
      - [`on`](#on)
      - [`off`](#off)
      - [`connect`](#connect)
      - [`disconnect`](#disconnect)
      - [`createToken`](#createtoken)
      - [`auth`](#auth)
      - [`setToken`](#settoken)
      - [`getSocket`](#getsocket)
      - [`authErrorCallback`](#autherrorcallback)
    - [Channel Methods](#channel-methods)
      - [`subscribeChannel`](#subscribechannel)
      - [`unsubscribeChannel`](#unsubscribechannel)
      - [`getPastMessages`](#getpastmessages)
    - [Presence Methods](#presence-methods)
      - [`enterPresenceSet`](#enterpresenceset)
      - [`leavePresenceSet`](#leavepresenceset)
      - [`getPresenceSetMembers`](#getpresencesetmembers)
      - [`subscribeToPresenceJoins`](#subscribetopresencejoins)
      - [`subscribeToPresenceUpdates`](#subscribetopresenceupdates)
      - [`subscribeToPresenceLeaves`](#subscribetopresenceleaves)
      - [`unsubscribeFromPresenceJoins`](#unsubscribefrompresencejoins)
      - [`unsubscribeFromPresenceUpdates`](#unsubscribefrompresenceupdates)
      - [`unsubscribeFromPresenceLeaves`](#unsubscribefrompresenceleaves)

## Introduction

The Cerebellum SDK is a powerful library that simplifies real-time communication in web applications. Built as an abstraction over socket.io, it provides enhanced capabilities for message handling, presence management, and channel-based communication. Key features include:

- Easy WebSocket connection management
- Secure authentication flows
- Channel-based messaging
- Presence management for user status tracking
- Historical message retrieval
- Full TypeScript support
- Ready-to-use React hooks for streamlined development


This SDK is designed to help developers quickly implement robust real-time features in their applications without dealing with the complexities of WebSocket management and real-time data synchronization.

## Installation

To install the Cerebellum SDK, use the following command:

```bash
npm install @cerebellum/sdk
```

## Local Development Setup

Cerebellum comes with a Docker image for local development, allowing you to test your application easily.
If you have Docker installed, you can start the local development environment by running the following command:

```bash
npx cerebellum-start
```

This command will start the Cerebellum local development environment with the following components:

- The main Cerebellum WebSocket server on port 8001 for real-time communication.
- Example authentication route on port 3000.
- Local DynamoDB server on port 8000.
- Redis server on port 6379.

The DynamoDB is used for message persistence, while Redis and the mechanmism for handles real-time presence information and works as a pub/sub system to distribute messages to all connected servers.

To stop the local development server, run:

```bash
npx cerebellum-stop
```

## Getting Started

To use the Cerebellum SDK, create a new instance of Cerebellum by calling the Cerebellum function and passing in the endpoint of the Cerebellum server along with any desired options.
Here's an example of how to create a new instance of Cerebellum:

```javascript
import Cerebellum from "@cerebellum/sdk";

const endpoint = "localhost:8001"; // Use appropriate URL for production

const CerebellumOptions = {
  autoConnect: true, // Enable auto-connect. Requires API key or auth route.
  API_KEY: "SAMPLE_API_KEY", // DO NOT USE IN PRODUCTION.
  reconnection: true, // Enable reconnection attempts.
  reconnectionAttempts: 5, // Number of attempts before giving up.
  reconnectionDelay: 5000, // Delay between reconnection attempts (ms).
  reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts (ms).
  timeout: 20000, // Timeout before a connection attempt is considered failed (ms).
};

const cerebellum = await Cerebellum(endpoint, CerebellumOptions);
```

For development, you can use the options above to connect to the local development server.

In production, replace the URL with your Cerebellum server URL and use a secure API key or auth route.

Once an instance of Cerebellum has been created, you can use the various hooks and components provided by the Cerebellum SDK to interact with the Cerebellum server.

## React



## Cerebellum Options

When creating a new instance of Cerebellum, you can pass in an options object to customize the behavior of the Cerebellum instance. Below is a detailed explanation of the available options and their descriptions.

```TypeScript
const CerebellumOptions = {
  autoConnect: true,
  API_KEY: "SAMPLE_API_KEY",
  authRoute: {
    endpoint: "http://localhost:3000/login",
    method: "POST",
    payload: {},
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};
```

### `autoConnect`

```typescript
autoConnect: boolean;
```

Determines whether the `CerebellumInit` instance should automatically connect to the Cerebellum server.

- If `true`:
  - The instance will first check if an `API_KEY` is provided. If an `API_KEY` is present, it will create a token using this key before establishing the WebSocket connection.
  - If the `API_KEY` is not provided, the `authRoute` information will be used to retrieve a token signed by the `API_KEY`. After obtaining the token from the auth server, `CerebellumInit` will attempt to establish a WebSocket connection.
  - This approach avoids storing the `API_KEY` directly.
- If `false`, the instance will not automatically connect.

Note: If both `API_KEY` and `authRoute` are provided, `API_KEY` takes precedence.

---

### `API_KEY`

```typescript
API_KEY: string;
```

The API key for authentication. This key is used to create a token on the frontend, which is then sent to the Cerebellum servers for authentication.

If the `API_KEY` is provided, then a token using the provided `API_KEY` will be created automatically.

For local development and testing, you can use the following, when using the cerebellum development server/image

```TypeScript
API_KEY: "SAMPLE_API_KEY";
```

In production environments, ensure that this key is kept secure and not exposed in client-side code. We strongly reccommend using the `authRoute` is auto connect is set to `true`, or using the provided authentication methods discussed in the [Authentication](#authentication) section.

---

### `authRoute`

```typescript
authRoute: {
  endpoint: string;
  method: "POST" | "GET";
  payload?: object;
}
```

An object containing details for an authentication route. Used if `autoConnect` is `true` and `API_KEY` is not provided, else it is ignored.

When autoconnect is `true`, and `API_KEY` is not provided, cerebellum will attempt to make a http request to the `endpoint` using the `mehod` provided and include the `payload` in the request.

It expects to receive a response with a jsonwebtoken in the following format. You can use the `createToken` from the `@cerebellum/sdk` to create a token on your authentication server.

- **`endpoint`**:
  - **Type**: `string`
  - **Description**: The endpoint from which to receive the Cerebellum token.
- **`method`**:
  - **Type**: `"POST" | "GET"`
  - **Description**: The HTTP method to use when requesting the Cerebellum token.
- **`payload`**:
  - **Type**: `object`
  - **Description**: An optional payload to send to the endpoint.

---

### `reconnection`

```typescript
reconnection: boolean;
```

---

Enables automatic reconnection attempts if the connection to the server is lost.

### `reconnectionAttempts`

```typescript
reconnectionAttempts: number;
```

The number of reconnection attempts to make before giving up.

---

### `reconnectionDelay`

```typescript
reconnectionDelay: number;
```

The delay (in milliseconds) between reconnection attempts.

---

### `reconnectionDelayMax`

```typescript
reconnectionDelayMax: number;
```

The maximum delay (in milliseconds) between reconnection attempts.

---

### `timeout`

```typescript
timeout: number;
```

The timeout (in milliseconds) before a connection attempt is considered failed.

---

## Properties

### `socketId`

**Type**: `string`

Represents the unique identifier for the current socket connection. This ID is assigned by the server when a connection is established. The `socketId` is not set until the socket is connected.

**Example**:

```TypeScript
cerebellum.on("connection", (socket) => {
  console.log("Connected with socket ID:", cerebellum.socketId);
});
```

---

## Methods

Once an instance of `Cerebellum` has been created, you can interact with it using various methods provided by the. Below is a detailed description of each method, including the types of arguments they take, their return types, and example usage.

### General Methods

The general methods in the Cerebellum SDK provide a way to interact with the Cerebellum server and manage the connection to the server. These methods include methods for connecting to the server, disconnecting from it, and retrieving the socket ID.

#### `on`

```typescript
on(event: string, callback: (...args: any) => any): void
```

**Description**

Subscribes to a specific event emitted by the server. The provided callback function will be executed whenever the event is triggered.

**Arguments**

- **`event: string`**
  - **Description**: The `event` parameter is a string that represents the name of the event to listen for. It is used to specify the type of event to listen for.
- **`callback: (...args: any) => any`**
  - **Description**: The `callback` parameter is a function that takes any number of arguments of any type and returns a value of any type. It is used to handle the event triggered by the `on` method.

**Example**

```typescript
cerebellum.on("connection", (socket) => {
  console.log("Connected with socket ID:", cerebellum.socketId);
});
```

**Explanation**

- In this example, the `on` method is used to listen for the "connection" event on the `cerebellum` instance. When the event is triggered, the provided callback function is executed with the socket object as an argument.

---

#### `off`

```typescript
off(event: string, callback: (...args: any) => any): void
```

**Description**

Removes a callback function from listening to a specific event on the Cerebellum instance. The provided callback function will no longer be executed when the event is triggered.

**Arguments**

- **`event: string`**
  - **Description**: The `event` parameter is a string that represents the name of the event to remove the callback function from. It is used to specify the type of event to remove the callback function from.
- **`callback: (...args: any) => any`**
  - **Description**: The `callback` parameter is a function that takes any number of arguments of any type and returns a value of any type. It is used to remove the callback function from the event listener.

**Example**

```typescript
cerebellum.off("connection", (socket) => {
  console.log("Disconnected with socket ID:", cerebellum.socketId);
});
```

**Explanation**

- In this example, the `off` method is used to remove the callback function for the "connection" event on the `cerebellum` instance. When the event is triggered, the provided callback function will no longer be executed.

---

#### `connect`

```typescript
connect(): void
```

**Description**

Establishes a connection to the Cerebellum server. This method is used to connect to the Cerebellum server and establish a WebSocket connection.

**Example**

```typescript
cerebellum.connect();
```

**Explanation**

- In this example, the `connect` method is called to establish a connection to the Cerebellum server.

---

#### `disconnect`

```typescript
disconnect(): void
```

**Description**

This method is used to disconnect from the Cerebellum server and close the WebSocket connection.

**Example**

```typescript
cerebellum.disconnect();
```

**Explanation**

- In this example, the `disconnect` method is called to disconnect from the Cerebellum server.

---

#### `createToken`

```typescript
createToken(apiKey: string, payload: JWTPayload): Promise<void>
```

**Description**

This method is used to create a JWT token using an API key and a payload. The token is then used to authenticate with the Cerebellum server.

**DO NOT NUSE THIS METHOD IN THE FRONT END CODE IN PRODUCTION**

If this meethod is used in the front end code in production, your API key will be exposed to the client-side code. This is a security risk.

**Arguments**

- **`apiKey: string`**
  - **Description**: The `apiKey` parameter is a string that represents the API key used for authentication. It is used to create the JWT token.
- **`payload: JWTPayload`**
  - **Description**: The `payload` parameter is an object that represents the data to be included in the JWT token. It is used to create the JWT token.

**Return Type**

- **`Promise<void>`**
  - **Description**: The `createToken` method returns a Promise that resolves when the token is created. If the token creation is successful, the Promise resolves. If there is an error, the Promise rejects with an error message.

**Example**

```typescript
const payload = {
  userId: "123",
  roles: ["admin"],
};

cerebellum
  .createToken("API_KEY", payload)
  .then(() => {
    console.log("Token created successfully");
  })
  .catch((error) => {
    console.error("Error creating token:", error);
  });
```

**Explanation**

- In this example, the `createToken` method is called with the API key "API_KEY" and the payload object. The method returns a Promise that resolves when the token is created. If the token creation is successful, the Promise resolves. If there is an error, the Promise rejects with an error message.

---

#### `auth`

```typescript
auth(
  authEndpoint: string,
  method: "GET" | "POST" = "POST",
  payload?: object
): Promise<void>
```

**Description**

This method is used to have cerebellum retrieve a a signed Token from an authentication endpoint. The returned token is saved to the cerebellum instance and can be used to authenticate with the Cerebellum server. When `cerebellum.connect()` is called, the saved token will be used to authenticate with the Cerebellum server.

**Arguments**

- **`authEndpoint: string`**
  - **Description**: The `authEndpoint` parameter is a string that represents the endpoint URL where the authentication request will be sent. It is used to specify the endpoint where the authentication request will be sent.
- **`method: "GET" | "POST" = "POST"`**
  - **Description**: The `method` parameter is a string that represents the HTTP method to be used for the authentication request. It is used to specify the HTTP method to be used for the authentication request. It can be either "GET" or "POST", with a default value of "POST" if not provided.
- **`payload?: object`**
  - **Description**: The `payload` parameter is an optional object that represents the data to be sent along with the authentication request. It is used to specify the data to be sent along with the authentication request.

**Return Type**

- **`Promise<void>`**
  - **Description**: The `auth` method returns a Promise that resolves when the authentication request is successful. If the authentication request is successful, the Promise resolves. If there is an error, the Promise rejects with an error message.

**Example**

```typescript
cerebellum
  .auth("https://example.com/login", "POST", {
    username: "user1",
    password: "password123",
  })
  .then(() => {
    console.log("Authentication successful");
  })
  .catch((error) => {
    console.error("Error authenticating:", error);
  });
```

**Explanation**

- In this example, the `auth` method is called with the endpoint URL "https://example.com/login", the HTTP method "POST", and the payload object. The method returns a Promise that resolves when the authentication request is successful. If the authentication request is successful, the Promise resolves. If there is an error, the Promise rejects with an error message.

---

#### `setToken`

```typescript
setToken(token: string): void
```

**Description**

This method is used to set the token for authentication in the Cerebellum instance. This token will be used to authenticate with the Cerebellum server when `cerebellum.connect()` is called.

This method is used if you would like to manually set the token for authentication in the Cerebellum instance, instead of using the `auth` method.

**Arguments**

- **`token: string`**
  - **Description**: The `token` parameter is a string that represents the authentication token that will be set for the socket connection. It is used to set the token for authentication.

**Example**

```typescript
cerebellum.setToken("TOKEN");
```

**Explanation**

- In this example, the `setToken` method is called with the token "TOKEN". The method sets the token for authentication in the `cerebellum` instance. This token will be used to authenticate with the Cerebellum server when `cerebellum.connect()` is called

---

#### `getSocket`

```typescript
getSocket(): Socket
```

**Description**

This method returns the socket object associated with the Cerebellum instance. This socket object can be used to interact with the Cerebellum server directly. This socket is the same socket used by `socket.io` to communicate with the Cerebellum server. This is useful if you need to perform additional operations with the socket.io library, that are not provided by the Cerebellum SDK.

**Example**

```typescript
const socket = cerebellum.getSocket();
```

**Explanation**

- In this example, the `getSocket` method is called to retrieve the socket object associated with the `cerebellum` instance. The returned socket object can be used to interact with the Cerebellum server directly.

---

#### `authErrorCallback`

```typescript
authErrorCallback(callback: (...args: any) => any): void
```

**Description**

This method is used to handle authentication errors in the Cerebellum instance. If the authentication with the Cerebellum server fails, the provided callback function will be called with the error message.

**Arguments**

- **`callback: (...args: any) => any`**
  - **Description**: The `callback` parameter is a function that takes any number of arguments of any type and returns a value of any type. It is used to handle the authentication error. The function is called when the "connect_error" event is triggered on the socket object.

**Example**

```typescript
cerebellum.authErrorCallback((error) => {
  console.error("Authentication error:", error);
});
```

**Explanation**

- In this example, the `authErrorCallback` method is called when authentication fails with the cerebellum serever.

---

### Channel Methods

Channel methods in the Cerebellum SDK enable you to work with specific communication channels. These methods allow you to subscribe to channels, unsubscribe when needed, and retrieve past messages. Channels provide a way to organize your real-time communication, making it easy to separate concerns and manage different streams of data within your application.

#### `subscribeChannel`

```typescript
subscribeChannel(channelName: string, callback?: (message: Message) => any): void
```

Subscribes to a specified channel. Optionally takes a callback function that will be invoked when a new message is received in the channel.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel to subscribe to.
- **`callback?: (message: Message) => any`**
  - **Description**: An optional callback function that will be executed when a new message is received. The function receives a `Message` object.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Callback Argument**

- **`message: Message`**
  - **Description**: The callback function receives a `Message` object containing details of the new message.
- **`Message` Interface**:
  ```typescript
  interface Message {
    content: any;
    createdAt: string;
    socketId: string;
  }
  ```

**Example**

```javascript
cerebellum.subscribeChannel("general", (message) => {
  console.log("New message received:", message.content);
});
```

**Explanation**

- In this example, the `subscribeChannel` method subscribes to the `"general"` channel and sets up a callback to handle incoming messages. When a new message is received, the callback logs the message content.

---

#### `unsubscribeChannel`

```typescript
unsubscribeChannel(channelName: string, callback?: (message: Message) => any): void
```

**Description**

Unsubscribes from a specified channel. If a callback was provided when subscribing to the channel, it should be passed to this method to deregister it.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel to unsubscribe from.
- **`callback?: (message: Message) => any`**
  - **Description**: An optional callback function that was used when subscribing to the channel. If provided, it will be deregistered from receiving messages.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```TypeScript
const onNewMessage = (message) => {
  console.log("New message received:", message.content);
};

cerebellum.unsubscribeChannel("general", onNewMessage);
```

**Explanation**

- In this example, the `unsubscribeChannel` method is used to unsubscribe from the `"general"` channel and remove the specified callback if it was registered previously.

---

#### `getPastMessages`

```typescript
getPastMessages(
  channelName: string,
  options?: getPastMessagesOptions
): Promise<PastMessages>
```

**Description**

Fetches past messages from a specified channel. This method allows you to retrieve historical messages from the given channel, with options to control the number of messages returned, their sort order, and pagination.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel from which to retrieve past messages.
- **`options?: getPastMessagesOptions`** (optional)
  - **Description**: An object containing options to customize the retrieval of past messages.
  - **`limit?: number`**
    - **Description**: The maximum number of messages to retrieve. Defaults to 50 if not provided.
  - **`sortDirection?: "ascending" | "descending"`**
    - **Description**: The sort order of the messages. Can be either `"ascending"` or `"descending"`. Defaults to `"ascending"`.
  - **`lastEvaluatedKey?: LastEvaluatedKey`**
    - **Description**: Used for pagination. Specifies the last message received in the previous request to continue retrieving messages from where you left off.

**Return Type**

- **`Promise<PastMessages>`**
  - **Description**: Returns a promise that resolves to an object containing past messages and, optionally, a `lastEvaluatedKey` for pagination.
- **`PastMessages` Interface**:
  ```typescript
  interface PastMessages {
    messages: Message[];
    lastEvaluatedKey?: LastEvaluatedKey;
  }
  ```
  - **`messages: Message[]`**
    - **Description**: An array of `Message` objects representing the past messages retrieved from the channel.
  - **`lastEvaluatedKey?: LastEvaluatedKey`** (optional)
    - **Description**: An object representing the last evaluated key used for pagination. This key can be used in subsequent requests to fetch more messages.
- **`Message` Interface**:
  ```typescript
  interface Message {
    content: any;
    createdAt: string;
  }
  ```
  - **`content: any`**
    - **Description**: The content of the message.
  - **`createdAt: string`**
    - **Description**: The timestamp when the message was created.

**Example**

```TypeScript
const pastMessages = await cerebellum.getPastMessages("general", {
  limit: 10,
  sortDirection: "descending",
})
console.log("Retrieved messages:", result.messages);
if (result.lastEvaluatedKey) {
  console.log("More messages available. Use lastEvaluatedKey to fetch them.");
```

**Explanation**

- In this example, `getPastMessages` is called with the channel name `"general"` and options to limit the results to 10 messages and sort them in descending order.
- The returned promise resolves to an object containing the messages and an optional `lastEvaluatedKey`.
- If `lastEvaluatedKey` is present, it indicates that there are more messages available beyond the current result. You can use this key to fetch additional messages if needed.

This method provides a flexible way to retrieve historical messages from a channel, supporting pagination and sorting to handle large datasets efficiently.

---

### Presence Methods

The presence methods in the Cerebellum SDK allow you to manage presence information for a specific channel. Presence information is used to track the online status of users in a channel, enabling features such as presence-based messaging and presence-based notifications.

#### `enterPresenceSet`

```TypeScript
enterPresenceSet(
  channelName: string,
  state: State
): void
```

**Description**

Enters the user into the presence set of the specified channel. This method allows you to notify the server and other clients that a user has joined the channel, along with any associated state information.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel to which the user is entering the presence set.
- **`state: State`**
  - **Description**: An object representing the state information associated with the user. The state can contain any key-value pairs as needed.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```TypeScript
cerebellum.enterPresenceSet("general", { username: "alice", status: "online" });
```

**Explanation**

- In this example, the user is entering the presence set for the channel `"general"`, with state information indicating the username and status. This information will be broadcast to other users in the channel.
- ***

#### `leavePresenceSet`

```TypeScript
leavePresenceSet(channelName: string): void
```

**Description**

Leaves the presence set of the specified channel. This method notifies the server and other clients that a user is no longer in the presence channel.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel from which the user is leaving the presence set.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```TypeScript
cerebellum.leavePresenceSet("general");
```

**Explanation**

- In this example, the user is leaving the presence set for the channel `"general"`. Other users will be informed that the user is no longer present in the channel.

---

#### `getPresenceSetMembers`

```TypeScript
getPresenceSetMembers(channelName: string): Promise<State[]>
```

**Description**

Retrieves the current members in the presence set of the specified channel. This method allows you to get the list of users currently in the channel and their associated state information.

Note this is a promise that will resolve with the current members in the presence set.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel whose presence set members are to be retrieved.

**Return Type**

- **`Promise<State[]>`**
  - **Description**: Returns a promise that resolves to an array of `State` objects representing the members of the presence set.
  - Note that the `State` interface is defined as follows, however it will always contain a `socketId` property, to uniquely identify the users in the presence set:
- **`State` Interface**:
  ```typescript
  interface State {
    [key: string]: string;
    socketId: string;
  }
  ```
  - **Description**: An object where the keys and values are user-defined and can contain any relevant information about the user.

**Example**

```TypeScript
const presenceMembers = await cerebellum.getPresenceSetMembers("general");

console.log("Current members in the presence set:", members);
```

**Explanation**

- In this example, `getPresenceSetMembers` is called with the channel name `"general"`. The returned promise resolves to an array of state objects, each representing a member of the presence set.
- ***

#### `subscribeToPresenceJoins`

```TypeScript
subscribeToPresenceJoins(channelName: string, callback: (state: State) => void): void

```

**Description**

Subscribes to presence join events for a specified channel. This method allows you to receive notifications when a user joins the presence set of the channel.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel for which to subscribe to presence join events.
- **`callback: (state: State) => void`**
  - **Description**: A callback function that will be invoked when a user joins the presence set. The function receives a `State` object representing the state information of the user who joined.

**Callback Argument**

- **`state: State`**
  - **Description**: The callback function receives a `State` object representing the state information of the user who joined. The `State` interface is defined as follows:
  - Note that the `State` interface is defined as follows, however it will always contain a `socketId` property, to uniquely identify the users in the presence set:
- **`State` Interface**:

  ```typescript
  interface State {
    [key: string]: string;
    socketId: string;
  }
  ```

  - **Description**: An object where the keys and values are user-defined and can contain any relevant information about the user.

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```typescript
cerebellum.subscribeToPresenceJoins("general", (state) => {
  console.log("User joined with state:", state);
});
```

**Explanation**

- In this example, `subscribeToPresenceJoins` is used to listen for join events in the channel `"general"`. When a user joins, the provided callback function is executed with the state information of the new user.

---

#### `subscribeToPresenceUpdates`

```typescript
subscribeToPresenceUpdates(channelName: string, callback: (state: State) => void): void

```

**Description**

Subscribes to presence update events for a specified channel. This method allows you to receive notifications when the state information of a user in the presence set is updated.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel for which to subscribe to presence update events.
- **`callback: (state: State) => void`**
  - **Description**: A callback function that will be invoked when a user's state is updated in the presence set. The function receives a `State` object representing the updated state information.
  - Note that the `State` interface is defined as follows, however it will always contain a `socketId` property, to uniquely identify the users in the presence set:
- **`State` Interface**:

  ```typescript
  interface State {
    [key: string]: string;
    socketId: string;
  }
  ```

  - **Description**: An object where the keys and values are user-defined and can contain any relevant information about the user.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```typescript
cerebellum.subscribeToPresenceUpdates("general", (state) => {
  console.log("User state updated:", state);
});
```

**Explanation**

- In this example, `subscribeToPresenceUpdates` is used to listen for updates in the presence set of the channel `"general"`. When a user's state is updated, the provided callback function is executed with the new state information.

---

#### `subscribeToPresenceLeaves`

```typescript
subscribeToPresenceLeaves(channelName: string, callback: (state: State) => void): void
```

**Description**
Subscribes to presence leave events for a specified channel. This method allows you to receive notifications when a user leaves the presence set of the channel.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel for which to subscribe to presence leave events.
- **`callback: (state: State) => void`**
  - **Description**: The callback function that was originally passed to the `subscribeToPresenceLeaves` method. This will deregister the callback from the event listeners.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```typescript
cerebellum.subscribeToPresenceLeaves("general", (state) => {
  console.log("User left with state:", state);
});
```

**Explanation**

- In this example, `subscribeToPresenceLeaves` is used to listen for leave events in the channel `"general"`. When a user leaves, the provided callback function is executed with the state information of the user who left.

---

#### `unsubscribeFromPresenceJoins`

```typescript
unsubscribeFromPresenceJoins(channelName: string, callback: (state: State) => void): vo
id

```

**Description**

Unsubscribes from presence join events for a specified channel. This method removes a previously registered callback that was listening for join events.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel from which to unsubscribe from presence join events.
- **`callback: (state: State) => void`**
  - **Description**: The callback function that was previously registered to listen for join events. This function will be removed from the event listeners.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```typescript
const onJoin = (state) => {
  console.log("User joined with state:", state);
};

cerebellum.unsubscribeFromPresenceJoins("general", onJoin);
```

**Explanation**

- In this example, `unsubscribeFromPresenceJoins` is used to remove the callback `onJoin` from listening for join events in the channel `"general"`.

---

#### `unsubscribeFromPresenceUpdates`

```typescript
unsubscribeFromPresenceUpdates(channelName: string, callback: (state: State) => void): void

```

**Description**

Unsubscribes from presence update events for a specified channel. This method removes a previously registered callback that was listening for presence update events.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel from which to unsubscribe from presence update events.
- **`callback: (state: State) => void`**
  - **Description**: The callback function that was previously registered to listen for update events. This function will be removed from the event listeners.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```typescript
const onUpdate = (state) => {
  console.log("User state updated:", state);
};

cerebellum.unsubscribeFromPresenceUpdates("general", onUpdate);
```

**Explanation**

- In this example, `unsubscribeFromPresenceUpdates` is used to remove the callback `onUpdate` from listening for presence update events in the channel `"general"`.

---

#### `unsubscribeFromPresenceLeaves`

```typescript
unsubscribeFromPresenceLeaves(channelName: string, callback: (state: State) => void): void

```

**Description**
Unsubscribes from presence leave events for a specified channel. This method removes a previously registered callback that was listening for leave events.

**Arguments**

- **`channelName: string`**
  - **Description**: The name of the channel from which to unsubscribe from presence leave events.
- **`callback: (state: State) => void`**
  - **Description**: The callback function that was previously registered to listen for leave events. This function will be removed from the event listeners.

**Return Type**

- **`void`**
  - **Description**: This method does not return a value.

**Example**

```typescript
const onLeave = (state) => {
  console.log("User left with state:", state);
};

cerebellum.unsubscribeFromPresenceLeaves("general", onLeave);
```

**Explanation**

- In this example, `unsubscribeFromPresenceLeaves` is used to remove the callback `onLeave` from listening for leave events in the channel `"general"`.
