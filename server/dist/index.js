"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const rooms_1 = require("./rooms");
const game_1 = require("./game");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app);
server.listen(port);
const webSocketServer = new ws_1.WebSocketServer({ server }, () => {
    console.log(`=== Web socket server started on port ${port} ===`);
});
const rooms = {};
const lobby = {};
const games = {};
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
                case "lobby":
                    (0, rooms_1.joinLobby)(socket, userId, rooms, lobby, params);
                    break;
                case "create":
                    (0, rooms_1.createRoom)(socket, userId, rooms, lobby);
                    break;
                case "join":
                    (0, rooms_1.joinRoom)(socket, userId, rooms, lobby, params.roomCode);
                    break;
                case "leave":
                    (0, rooms_1.leaveRoom)(userId, lobby, rooms);
                    break;
                case "chat":
                    (0, rooms_1.chat)(userId, rooms, params);
                    break;
                case "ready":
                    (0, rooms_1.ready)(userId, rooms, params);
                    break;
                case "start":
                    (0, game_1.start)(userId, lobby, rooms, games);
                    break;
                case "play":
                    (0, game_1.play)(userId, rooms, games, params);
                    break;
                case "move":
                    (0, game_1.move)(userId, rooms, games, params);
                    break;
                case "tap":
                    (0, game_1.tap)(userId, rooms, games, params);
                    break;
                case "end-turn":
                    (0, game_1.endTurn)(userId, rooms, games, params);
                    break;
                case "leave-game":
                    (0, game_1.leaveGame)(userId, rooms, games);
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
        (0, rooms_1.cleanUp)(userId, lobby, rooms, games);
    });
});
//# sourceMappingURL=index.js.map