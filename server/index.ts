import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { createRandomDeck } from "./cards";
import Game from "./classes/Game";
import {
  chat,
  joinLobby,
  leaveLobby,
  createRoom,
  joinRoom,
  leaveRoom,
} from "./rooms";
import { start } from "./game";

import PuppetMaster from "./classes/PupperMaster";
import { generateKey } from "./utils";
import { Room } from "./types";

const port = 8080;
const webSocketServer = new WebSocketServer({ port }, () => {
  console.log(`=== Web socket server started on port ${port} ===`);
});

const rooms: Room = {};
const lobby: Room = {};

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
          chat(rooms, params);
          break;
        case "start":
          start(rooms, params);
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
    leaveLobby(userId, lobby, rooms);
  });
});

const main = async () => {
  console.log("=== CREATING PLAYERS ===");
  const puppetMasterOneId = uuidv4();
  const puppetMasterOne = new PuppetMaster(puppetMasterOneId);

  const puppetMasterTwoId = uuidv4();
  const puppetMasterTwo = new PuppetMaster(puppetMasterTwoId);

  console.log("=== CREATING RANDOM DECKS ===");
  const randomDeckOne = createRandomDeck();
  const randomDeckTwo = createRandomDeck();

  puppetMasterOne.setDeck(randomDeckOne);
  puppetMasterTwo.setDeck(randomDeckTwo);

  console.log("=== CREATING GAME ===");
  const gameId = generateKey();
  const game = new Game(gameId, [puppetMasterOne, puppetMasterTwo]);

  console.log(game.turn);
  game.start();
  console.log(game.turn);
};

main();
