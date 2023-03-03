"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ioredis_1 = __importDefault(require("ioredis"));
const socket_io_1 = require("socket.io");
const socket_io_redis_1 = require("socket.io-redis");
const uuid_1 = require("uuid");
const room_1 = require("./functions/room");
const lobby_1 = require("./functions/lobby");
const game_1 = require("./functions/game");
const chat_1 = require("./functions/chat");
const messages_1 = require("./types/messages");
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const isDev = process.env.DEV || false;
const redisURL = process.env.REDIS_URL;
const pubClient = new ioredis_1.default(redisURL);
const subClient = pubClient.duplicate();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: isDev ? "http://localhost:3000" : "https://wesley.codes",
    },
});
io.adapter((0, socket_io_redis_1.createAdapter)({ pubClient, subClient }));
subClient.subscribe("mondomegabits");
subClient.on("message", (_, data) => {
    const { message, userId } = JSON.parse(data);
    const { type, params } = message;
    switch (type) {
        case messages_1.MESSAGE_TYPES.PING:
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
        case messages_1.MESSAGE_TYPES.DRAW_CARDS:
            (0, game_1.drawCards)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.PLAY:
            (0, game_1.play)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.ATTACK:
            (0, game_1.attack)(userId, params);
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
        case messages_1.MESSAGE_TYPES.MOVE_CARD:
            (0, game_1.moveCard)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.TAP_CARD:
            (0, game_1.tapCard)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.FLIP_CARD:
            (0, game_1.flipCard)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.END_TURN:
            (0, game_1.endTurn)(userId);
            break;
        case messages_1.MESSAGE_TYPES.LEAVE_GAME:
            (0, game_1.leaveGame)(userId);
            break;
        case messages_1.MESSAGE_TYPES.EDIT_CARD_NOTES:
            (0, game_1.editCardNotes)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.SHUFFLE_DECK:
            (0, game_1.shuffleDeck)(userId);
            break;
        case messages_1.MESSAGE_TYPES.SET_NARRATIVE:
            (0, game_1.setNarrative)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.SET_FUNDING:
            (0, game_1.setFunding)(userId, params);
            break;
        case messages_1.MESSAGE_TYPES.UNTAP_ALL_CARDS:
            (0, game_1.untapAllCards)(userId);
            break;
        default:
            console.warn(`Type: ${type} unknown`);
            break;
    }
});
io.on("connection", (socket) => {
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
            if (type === messages_1.MESSAGE_TYPES.LOBBY) {
                (0, lobby_1.joinLobby)(userId, socket, params);
            }
            else {
                pubClient.publish("mondomegabits", JSON.stringify({ message, userId }));
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
        pubClient.del(userId);
    });
});
httpServer.listen(port);
//# sourceMappingURL=index.js.map