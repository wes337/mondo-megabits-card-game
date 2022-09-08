import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import {
  chat,
  ready,
  joinLobby,
  createRoom,
  joinRoom,
  leaveRoom,
  cleanUp,
} from "./rooms";
import { play, start, endTurn } from "./game";
import { Rooms } from "./types";

const port = 8080;
const webSocketServer = new WebSocketServer({ port }, () => {
  console.log(`=== Web socket server started on port ${port} ===`);
});

const rooms: Rooms = {};
const lobby = {};
const games = {};

webSocketServer.on("connection", (socket) => {
  // UUID for this connection
  const userId = uuidv4();
  const connectedMessage = {
    type: "connected",
    params: {
      id: userId,
    },
  };
  socket.send(JSON.stringify(connectedMessage));

  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data as any);
      const { type, params } = message;

      switch (type) {
        case "lobby":
          joinLobby(socket, userId, rooms, lobby, params);
          break;
        case "create":
          createRoom(socket, userId, rooms, lobby);
          break;
        case "join":
          joinRoom(socket, userId, rooms, lobby, params.roomCode);
          break;
        case "leave":
          leaveRoom(userId, lobby, rooms);
          break;
        case "chat":
          chat(userId, rooms, params);
          break;
        case "ready":
          ready(userId, rooms, params);
          break;
        case "start":
          start(userId, rooms, games);
          break;
        case "play":
          play(userId, rooms, games, params);
          break;
        case "end-turn":
          endTurn(userId, rooms, games, params);
          break;
        default:
          console.warn(`Type: ${type} unknown`);
          break;
      }
    } catch (error) {
      console.error("Something went wrong ===", error);
    }
  });

  socket.on("close", () => {
    console.log("=== DISCONNECTED ===", userId);
    cleanUp(userId, lobby, rooms);
  });
});
