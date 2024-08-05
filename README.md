# Cerebellum SDK Documentation

## Introduction

The Cerebellum SDK is a powerful library that simplifies real-time communication in web applications. Built as an abstraction over socket.io, it provides enhanced capabilities for message handling, presence management, and channel-based communication. Key features include:

- Easy WebSocket connection management
- Secure authentication flows
- Channel-based messaging
- Presence management for user status tracking
- Historical message retrieval
- Full TypeScript support
- Ready-to-use React hooks for streamlined development

This SDK is designed to help developers quickly implement robust real-time features in their applications without dealing with the complexities of WebSocket management and real-time data synchronization. Built to integrate seamlessly with popular JavaScript frameworks like React, it provides a simple and intuitive API for building real-time applications.

Once you have built your application, and ready to deploy it in production, check out the Cerebellum CLI to easily deploy the infrastructure needed to horisontally scale your application. All without having to worry about the underlying infrastructure.

## Table of Contents

[Cerebellum SDK Documentation](#cerebellum-sdk-documentation)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Local Development Setup](#local-development-setup)
  - [Getting Started](#getting-started)
  - [React](#react)
    - [Step 1: Create a Configuration File](#step-1-create-a-configuration-file)
    - [Step 2. Setup the Cerebellum Provider](#step-2-setup-the-cerebellum-provider)
  - [React Hooks](#react-hooks)
    - [`useChannel`](#usechannel)
    - [`usePresence`](#usepresence)
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

## Installation

To install the Cerebellum SDK, use the following command:

```bash
npm install @cerebellum/sdk
```

## Local Development Setup

Cerebellum has a Docker image for local development, allowing you to test your application easily.
If you have Docker installed, you can start the local development environment by running the following command:

```bash
npx cerebellum-start
```

This command will start the Cerebellum local development environment with the following components:

- The main Cerebellum WebSocket server on port 8001 for real-time communication.
- Example authentication route on port 3000.
- Local DynamoDB server on port 8000.
- Redis server on port 6379.

The DynamoDB is used for message persistence, while Redis servers as a pub/sub system and a cache for presence information.

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

The Cerebellum SDK provides ready-to-use React hooks to simplify the integration and usage of the SDK in your React applications. It was built from the ground up with React integration in mind and is the preferred way to integrate the Cerebellum SDK into your React applications.

### Step 1: Create a Configuration File

Create a `CerebellumConfig.ts` file in your project's root directory. This file will contain the configuration settings for your Cerebellum instance. An example of the directory structure and configuration file for a react app can be found below:

**Directory Structure**

```css
your-project/
├── src/
│   ├── CerebellumConfig.ts
│   ├── Main.tsx
│   └── App.tsx
|   └── ...
└── ...
```

An example of the `CerebellumConfig.ts` file:

```typescript
export const endpoint = "http://localhost:8001";
export const CerebellumOptions = {
  autoConnect: true,
  API_KEY: "SAMPLE_API_KEY",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};
```

**Explanation**

- In this example, the `CerebellumConfig.ts` file is created in the `src` directory of the project. It contains the configuration settings for the Cerebellum instance, including the endpoint URL, API key, and other options.
- You can use the above Cerbellum configuration when using the cerebellum development server/image, as it is already preconfigured. If you would like to learn more about the options available, please refer to the [Cerebellum Options](#cerebellum-options) section.

### Step 2. Setup the Cerebellum Provider

In your `Main.tsx` file, import the CerebellumProvider and CerebellumConfig components. Then, wrap your application with the CerebellumProvider component and pass it in the configuration file as a prop. The CerebellumProvider component will provide the necessary context and state for your application.

```typescript
import ReactDOM from "react-dom/client";
import App from "./App";
import { CerebellumProvider } from "@cerebellum/sdk";
import { endpoint, CerebellumOptions } from "./CerebellumOptions";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CerebellumProvider endpoint={endpoint} options={CerebellumOptions}>
    <App />
  </CerebellumProvider>
);
```

In this step, you have successfully set up the CerebellumProvider component and passed in the configuration file as a prop. This will provide the necessary context and state to your application, to access the Cerebellum instance and its methods. Furthermore, it also provides access to the custom hooks that you can use to interact with the Cerebellum instance.

## React Hooks

Cerebellum provides a set of custom hooks that simplify interaction with the Cerebellum instance. These hooks handle connections to channels and presence management. The hooks available are:

- `useChannel`
- `usePresence`

For most users, the hooks mentioned above will be sufficient for their needs. However, if you require more advanced control over the Cerebellum instance, you can use the `useCerebellum` hook to access the Cerebellum instance directly. Allowing access to all of the methods and properties listed in the [Methods](#methods) section and properties listed in the [Properties](#properties) section.

### `useChannel`

```typescript
const {publish, channelName} = useChannel(channelName: string, callback?: (message: Message) => any): Channel
```

**Description**

Subscribes to a specific channel and returns a `publish` function that can be used to publish messages to the channel, and a `channelName` that represents the name of the channel. If a callback function is provided, it will be invoked when a new message is received in the channel.

Note, that all messages including those sent by the current sender will be received by the callback function.

**Arguments**

- `channelName`: string
    - **Description**: The name of the channel to subscribe to and publish messages on.
    - `callback?: (message: Message) => any`
      - **Description**: An optional callback function that will be executed when a new message is received. The function receives a `Message` object.
    - **Callback Argument**: `message: Message` - **Description**: The callback function receives a `Message` object containing details of the new message. - **Description**: The `Message` interface is defined as follows:
  `typescript
 interface Message {
 content: any;
 createdAt: string;
 socketId: string;
 } 
`
      **Return Type**
    - `channelName`: string
    - `publish`: (message: any) => void
      - **Description**: The `publish` takes an argument and sends it to the current channel.

**Example**

```typescript
import { useChannel } from "@cerebellum/sdk";

const MyComponent = () => {
  const [messages, setMessages] = useState([]);
  const [messageField, setMessageField] = useState("");
  const { channelName, publish } = useChannel("general", (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });
};

const sendMessage = () => {
  publish(messageField);
  setMessageField("");
};

return (
  <div>
    <h1>Messages</h1>
    <ul>
      {messages.map((message) => (
        <li key={message.createdAt}>{message.content}</li>
      ))}
    </ul>
    <input
      type="text"
      placeholder="Enter a message"
      onChange={(event) => {
        setMessageField(event.target.value);
      }}
    />
    <button onClick={sendMessage}>Publish Message</button>
  </div>
);
```

**Explanation**

In this example, the `useChannel` hook is imported from the Cerebellum SDK. It is used to subscribe to the "general" channel and publish messages to it. Every time a message is received by the channel, the `onMessage` callback function is executed with the received message as an argument. Lastly, the `sendMessage` function is invoked, a new message is sent to the cerebellum servers to be published to the channel.

### `usePresence`

**Arguments**

- **`channelName: string`**
    - **Description**: The name of the channel to subscribe to presence events for.
    - **`initialUserInfo: NewState`**
      - **Description**: An object representing the initial presence information for the user. This is the information that the user will send to be entered into the presence set.
      - Note that the `NewState` interface is defined as follows. That the values of a state object are always strings.

  ```typescript
  interface NewState {
    [key: string]: string;
  }
  ```

  - **Return Type**

- **`presenceData: []State`**
    - **Description**: This will be an array of `State` objects representing the state of the current users in the presenece set.
    - An example of the `State` interface is defined as follows:
  ```typescript
  interface State {
    [key: string]: string;
    socketId: string;
  }
  ```
  - Note that a unique `socketId` for each user will be included for each user in the presence set.
- **`updateStatus: (state: State) => void`**
    - **Description**: A function that can be used to update the presence information for the user. This function takes a `NewState` object as an argument and updates the presence information for the user. Note that the `NewState` interface is defined as follows. The `socketId` of the user does not need to be included in the `NewState` object. It will be automatically taken care of by the Cerebellum SDK. You just need to include the inormation that you want to update.
    - The `NewState` interface is defined as follows. That the values of a state object are always strings.
  ```typescript
  interface NewState {
    [key: string]: string;
  }
  ```

**Example**

```typescript
import { usePresence } from "@cerebellum/sdk";

const MyComponent = () => {
  const [username, setUsername] = useState("alice");
  const { presenceData, updateStatus } = usePresence("status", {
    username,
    status: "online",
  });

  return (
    <div>
      <h1>Presence Data</h1>
      <ul>
        {presenceData.map((data) => (
          <li key={data.socketId}>
            {data.username}: {data.status}
          </li>
        ))}
      </ul>
      <p>Status: {presenceData.status}</p>
      <button onClick={() => updateStatus({ status: "offline" })}>
        Update Status
```

**Explanation**

- In this example, `usePresence` is imported from the Cerebellum SDK. It is used to subscribe to the "status" channel. When the `usePresence` hooks is called, the intial state for the user `Alice` is passed as an argument, with the status set to `online`.
- The returned object contains the `presenceData` and `updateStatus` properties.
- The `presenceData` property is an Array of `State` objects representing the current presence information for the users in the channel. It will be automatically updated when a user joins, leaves or updates their presence information.
- The `updateStatus` property is a function that can be used to update the presence information for a user in the channel. You will pass in a `NewState` object as an argument, and the function will update the presence information for the user, also letting everyone else know in the presence set that the user has updated their status.
- When the component unmounts, or if the user is disconnected, the `usePresence` hook will automatically unsubscribe from the presence set, and let everyone know that the user has left the presence set.

---

### `useCerebellum`

The `useCerebellum` hook is used to access the Cerebellum instance directly. This hook can be used to access the Cerebellum instance and its methods directly. It is useful if you need to perform additional operations with the Cerebellum instance, that are not provided by the react hooks. The most comonon use case for this hook is to access the `cerebellum` instance to retrieve the past mesasges for a channel that is using the `useChannel` hook.

```typescript
import { useCerebellum } from "@cerebellum/sdk";

const MyComponent = () => {
  const cerebellum = useCerebellum();
  const [pastMessages, setPastMessages] = useState([]);
  const getPastMessages = async () => {
    const messages = await cerebellum.getPastMessages("general", {
      limit: 10,
      sortDirection: "descending",
    });
    setPastMessages(messages.contents);
  };

  return (
    <div>
      <h1>Past Messages</h1>
      <ul>
        {pastMessages.map((message) => (
          <li key={message.createdAt}>{message.content}</li>
        ))}
      </ul>
      <button onClick={getPastMessages}>Get Past Messages</button>);
    </div>
  );
};
```

**Explanation**

- In this example, `useCerebellum` is imported from the Cerebellum SDK. It is used to access the Cerebellum instance directly. When the `useCerebellum` hooks is called, the Cerebellum instance is returned.
- The `getPastMessages` function is used to retrieve the past messages from the "general" channel. It is called when the button is clicked. Once the messages are retrieved, they are displayed in the interface for the user.

---

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

The API key for authentication. This key is used to create a token on the front end, which is then sent to the Cerebellum servers for authentication.

If the `API_KEY` is provided, then a token using the provided `API_KEY` will be created automatically.

For local development and testing, you can use the following, when using the cerebellum development server/image

```TypeScript
API_KEY: "SAMPLE_API_KEY";
```

In production environments, ensure that this key is kept secure and not exposed in client-side code. We strongly recommend using the `authRoute` if the `autoConnect` is set to `true`, or using the provided authentication methods discussed in the [Authentication](#authentication) section.

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

When autoconnect is `true`, and `API_KEY` is not provided, cerebellum will attempt to make an HTTP request to the `endpoint` using the `method` provided and include the `payload` in the request.

It expects to receive a response with a JSON web token in the following format. You can use the `createToken` from the `@cerebellum/sdk` to create a token on your authentication server.

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

**DO NOT USE THIS METHOD IN THE FRONT-END CODE IN PRODUCTION**

If this method is used in the front-end code in production, your API key will be exposed to the client-side code. This is a security risk.

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

This method is used to have a cerebellum instance retrieve a signed Token from an authentication endpoint. The returned token is saved to the cerebellum instance and can be used to authenticate with the Cerebellum server. When `cerebellum.connect()` is called, the saved token will be used to authenticate with the Cerebellum server.

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

- In this example, the `authErrorCallback` method is called when authentication fails with the cerebellum server.

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
