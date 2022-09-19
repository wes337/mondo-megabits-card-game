## Mondo Megabits Game

A multiplayer card game, which is still in the early stages of development. The rules of the game are still being worked out. Created entirely with JavaScript, and using the [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for multiplayer game play.

[Try it](https://wes337.github.io/mondomegabits-game/).

### Running locally

To run this game locally, you need to have both the client and server running.

To start the server:

```bash
cd server
npm install
npm run dev
```

To start the client:

```bash
cd client
npm install
npm start
```

Until I can figure out how to configure environment variables with Vite and GH pages, you need to make sure the WS is connecting to `ws://localhost:5000` in the `client/src/store/index.js` file. Terrible I know. I really should fix this.
