"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const room_1 = require("./functions/room");
const lobby_1 = require("./functions/lobby");
const game_1 = require("./functions/game");
const chat_1 = require("./functions/chat");
const messages_1 = require("./types/messages");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app);
server.listen(port);
const webSocketServer = new ws_1.WebSocketServer({ server }, () => {
    console.log(`=== Web socket server started on port ${port} ===`);
});
webSocketServer.on("connection", (socket) => {
    const userId = (0, uuid_1.v4)();
    const connectedMessage = {
        type: "connected",
        params: {
            id: userId,
        },
    };
    socket.send(JSON.stringify(connectedMessage));
    socket.on("message", (data) => {
        try {
            const message = JSON.parse(data);
            const { type, params } = message;
            switch (type) {
                case messages_1.MESSAGE_TYPES.PING:
                    break;
                case messages_1.MESSAGE_TYPES.LOBBY:
                    (0, lobby_1.joinLobby)(userId, socket, params);
                    break;
                case messages_1.MESSAGE_TYPES.CREATE:
                    (0, room_1.createRoom)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.JOIN:
                    (0, room_1.joinRoom)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.LEAVE:
                    (0, room_1.leaveRoom)(userId);
                    break;
                case messages_1.MESSAGE_TYPES.CHAT:
                    (0, chat_1.sendChatMessage)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.STATUS:
                    (0, room_1.updateStatus)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.START:
                    (0, game_1.start)(userId);
                    break;
                case messages_1.MESSAGE_TYPES.PLAY:
                    (0, game_1.play)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.MOVE:
                    (0, game_1.move)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.TAP:
                    (0, game_1.tap)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.TARGET:
                    (0, game_1.target)(userId, params);
                    break;
                case messages_1.MESSAGE_TYPES.END_TURN:
                    (0, game_1.endTurn)(userId);
                    break;
                case messages_1.MESSAGE_TYPES.LEAVE_GAME:
                    (0, game_1.leaveGame)(userId);
                    break;
                default:
                    console.warn(`Type: ${type} unknown`);
                    break;
            }
        }
        catch (error) {
            console.error("Something went wrong ===", error);
        }
    });
    socket.on("close", () => {
        console.log("=== DISCONNECTED ===", userId);
        (0, game_1.leaveGame)(userId);
        (0, room_1.leaveRoom)(userId);
        (0, lobby_1.leaveLobby)(userId);
    });
});
//# sourceMappingURL=index.js.map