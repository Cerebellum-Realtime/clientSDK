## Cerebellum Command

- Dev sets up React
- cd into react folder
- `npm install Cerebellum-Client`
-

## Methods we want to provide

- We do an abstraction
- create a cerebellum.ts file in the src

```javascript
export const socket = io(URL, {
  autoConnect: false,
  auth: {}, // Token gets added in Username component
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});
```

```javascript
const URL = "http://localhost:8000";

// Generic token signed with API key (no user credentials needed)
const cerebellum = new Cerebellum(URL, {
  autoConnect: true,
  authRoute: "localhost:3000",
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});
```

- Before we would inistlize a socket in the Cerebellum constructor
  - we would axios post/get their auth route for the api signed token
  - insert this
- Before we would auto connect, we would hit that auth route for them
- when we get the signed token back, we would put in the auth header for them
- we can call connect for them- or they can

---

// login form
// They submit credentials
// developer checks if credentials are valid
// If true, return a signed token

```javascript
// User credentials required before connection is established
const cerebellum = new Cerebellum(URL, {
  autoConnect: false,
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});

export default cerebellum;
```

- `Cerebellum.auth('developer auth route', {options})`
  - put their auth route here(get/post)
  - this returns a signed token
  - insert the signed token into the header for for them
  - do we have them manually call connect, or do we call it for them?
    - once we get the signed token back

## Include hooks

## Methods we need on cerebellum instance

`Cerebellum.auth('your-auth-route')` - socket.auth.token = data;

`Cerebellum.connect` - connect them manually to socket.io

- `Cerebellum.connect`
  - Create a ws connection
  - Include config options needed for reconnection logic
  - Include config options needed for auth
- `Cerebellum.getSignedToken`
- usePresence
- useChannel
- docker image
  - Do we want to provide a package.json script for them
  - Or do we have a command like cerebellum run dev?
  - Do we provide options
    - running it with the -d flag
    - saving the data to an volume for dynamodb
      - right now it is deleted when the docker compose stops running
- We need documentation on the github and npm package


```javascript
socket.on("connect_error", (reason) => {
  console.log("Connection error:", reason.message);
  if (reason.message === "Authentication error") {
    socket.disconnect();
    setUser(null);
  }
});
```

## Nice to have

- Create component examples for users to use
- hook that only emits and does not save to database or redis cache
