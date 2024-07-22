import { Cerebellum } from "../../Cerebellum/cerebellum.js";

let URL;
if (process.env.NODE_ENV === "development") {
  URL = "localhost:8001";
} else {
  URL = import.meta.env.VITE_LOAD_BALANCER_ENDPOINT; // does this need the protocol in front of it?
}

// const cerebellum = await Cerebellum(URL, {
//   autoConnect: true,
//   authEndpoint: "http://localhost:3000/login",
//   authMethod: "POST",
//   reconnection: true, // Enable reconnection attempts
//   reconnectionAttempts: 5, // Number of attempts before giving up
//   reconnectionDelay: 5000, // Delay between reconnection
//   reconnectionDelayMax: 5000, // Maximum delay between reconnection
//   timeout: 20000, // Before a connection attempt is considered failed
// });

export const cerebellum = await Cerebellum(URL, {
  autoConnect: false,
  authRoute: {
    endpoint: "http://localhost:3000/login",
    method: "POST",
    payload: {},
  },
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});
