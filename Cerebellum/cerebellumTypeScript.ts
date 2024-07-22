// import { io } from "socket.io-client";
// import axios from "axios";

// // export interface Payload {
// //   username?: string;
// // }

// /*
// {
//   autoConnect: false,
//   reconnection: true, // Enable reconnection attempts
//   reconnectionAttempts: 5, // Number of attempts before giving up
//   reconnectionDelay: 5000, // Delay between reconnection
//   reconnectionDelayMax: 5000, // Maximum delay between reconnection
//   timeout: 20000, // Before a connection attempt is considered failed
// }
// */
// /*javascript
// const URL = "http://localhost:8000";

// // Generic token signed with API key (no user credentials needed)
// const cerebellum = new Cerebellum(URL, {
//   autoConnect: true,
//   authRoute: "localhost:3000",
//   reconnection: true, // Enable reconnection attempts
//   reconnectionAttempts: 5, // Number of attempts before giving up
//   reconnectionDelay: 5000, // Delay between reconnection
//   reconnectionDelayMax: 5000, // Maximum delay between reconnection
//   timeout: 20000, // Before a connection attempt is considered failed
// });
// */

// export default class Cerebellum extends io {
//   // endpoint: string;

//   constructor(endpoint: string, options) {
//     /*
//       - if autoconnect is true, ping the auth route first, before calling super, because we need the auth token
//       - we need to add auth token header to auth
//     */
//     super(URL, { options });
//     this.endpoint = endpoint; // The load balancer endpoint or localhost - can this be automated somehow?
//   }

//   // Developer puts their auth route here
//   // Make a network request to the auth route
//   // Returns a token
//   // Developer should set the authEndpoint up such that it returns a token signed by their API key
//   // Problem: dev has to sign the token with the API key and set the expiration to 1 minute themselves
//   // Maybe provide simple class to create and return signed token with their api key.
//   // async fetchSignedToken(
//   //   authRoute: string,
//   //   authMethod: "GET" | "POST" = "GET",
//   //   payload?: Payload
//   // ): Promise<string | void> {
//   //   const authEndpoint = this.endpoint + authRoute;

//   //   if (authMethod === "GET") {
//   //     try {
//   //       const { data } = await axios.get(authEndpoint);
//   //       return data;
//   //     } catch (error) {
//   //       console.error("Error fetching token: ", error);
//   //       throw error;
//   //     }
//   //   } else if (authMethod === "POST") {
//   //     try {
//   //       const { data } = await axios.post(authEndpoint, payload);
//   //       return data;
//   //     } catch (error) {
//   //       console.error("Error fetching token: ", error);
//   //       throw error;
//   //     }
//   //   } else {
//   //     throw new Error("Use GET or POST");
//   //   }
//   // }

//   async setSocketAuth() {} // Maybe this calls `fetchSignedToken` and sets the header, that way they only call this

//   // Includes all the socket.io headers for reconnection and auth
//   // Give a way to adjust ping and pong intervals? Or hard code these?
//   // connect(signedToken, endpoint) {
//   //   io(endpoint, {
//   //     autoConnect: false,
//   //     auth: {}, // Call `fetchSignedToken` before calling `connect`. It fills this in.
//   //   });
//   // }
// }

// // I use the CLI to spin up AWS infrastructure and get my API key
// // I run the Cerebellum server image for my backend
// // I use the Cerebellum client library to help develop on the frontend

// /*
// 1. Developer creates login route
// 2. Developer uses login route to check creds
// 3. Developer stores API key on login route server
// 4. Developer has login server sign a JWT token with the username as the payload and the API key as the secret



// methods:
// - connect
// - fetchSignedToken
//   - should these be grouped together?
//   - if we don't ever want to connect without fetching the token, yes
//   - if we give users the ability to not use auth, no -> still need to think about what this would look like - need to change backend code
// - 
// */
