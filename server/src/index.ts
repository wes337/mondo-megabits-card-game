import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  updateStatus,
} from "./functions/room";
import { joinLobby, leaveLobby } from "./functions/lobby";
import {
  play,
  attack,
  move,
  tap,
  target,
  start,
  endTurn,
  leaveGame,
  editCardNotes,
  drawCards,
  shuffleDeck,
  moveCard,
  tapCard,
  flipCard,
  setNarrative,
  setFunding,
  untapAllCards,
} from "./functions/game";
import { sendChatMessage } from "./functions/chat";
import { MESSAGE_TYPES, WebSocketMessage } from "./types/messages";

const app = express();
const port = process.env.PORT || 8080;

const server = http.createServer(app);
server.listen(port);

const webSocketServer = new WebSocketServer({ server }, () => {
  console.log(`=== Web socket server started on port ${port} ===`);
});

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
      const message = JSON.parse(data as any) as WebSocketMessage;
      const { type, params } = message;

      switch (type) {
        case MESSAGE_TYPES.PING:
          break;
        case MESSAGE_TYPES.LOBBY:
          joinLobby(userId, socket, params);
          break;
        case MESSAGE_TYPES.CREATE:
          createRoom(userId, params);
          break;
        case MESSAGE_TYPES.JOIN:
          joinRoom(userId, params);
          break;
        case MESSAGE_TYPES.LEAVE:
          leaveRoom(userId);
          break;
        case MESSAGE_TYPES.CHAT:
          sendChatMessage(userId, params);
          break;
        case MESSAGE_TYPES.STATUS:
          updateStatus(userId, params);
          break;
        case MESSAGE_TYPES.START:
          start(userId);
          break;
        case MESSAGE_TYPES.DRAW_CARDS:
          drawCards(userId, params);
          break;
        case MESSAGE_TYPES.PLAY:
          play(userId, params);
          break;
        case MESSAGE_TYPES.ATTACK:
          attack(userId, params);
          break;
        case MESSAGE_TYPES.MOVE:
          move(userId, params);
          break;
        case MESSAGE_TYPES.TAP:
          tap(userId, params);
          break;

        case MESSAGE_TYPES.TARGET:
          target(userId, params);
          break;

        // Sandbox stuff
        case MESSAGE_TYPES.MOVE_CARD:
          moveCard(userId, params);
          break;
        case MESSAGE_TYPES.TAP_CARD:
          tapCard(userId, params);
          break;
        case MESSAGE_TYPES.FLIP_CARD:
          flipCard(userId, params);
          break;
        case MESSAGE_TYPES.END_TURN:
          endTurn(userId);
          break;
        case MESSAGE_TYPES.LEAVE_GAME:
          leaveGame(userId);
          break;
        case MESSAGE_TYPES.EDIT_CARD_NOTES:
          editCardNotes(userId, params);
          break;
        case MESSAGE_TYPES.SHUFFLE_DECK:
          shuffleDeck(userId);
          break;
        case MESSAGE_TYPES.SET_NARRATIVE:
          setNarrative(userId, params);
          break;
        case MESSAGE_TYPES.SET_FUNDING:
          setFunding(userId, params);
          break;
        case MESSAGE_TYPES.UNTAP_ALL_CARDS:
          untapAllCards(userId);
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
    // Clean up, leave game/room/lobby user is in
    leaveGame(userId);
    leaveRoom(userId);
    leaveLobby(userId);
  });
});
