"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLobbyInfo = exports.messageLobby = void 0;
const messages_1 = require("../types/messages");
const lobby_1 = require("../functions/lobby");
const room_1 = require("../functions/room");
const data_1 = require("../data");
const messageLobby = (message) => {
    const lobby = (0, data_1.getLobby)();
    Object.keys(lobby).forEach((userId) => {
        const { socket } = lobby[userId];
        socket.send(JSON.stringify(message));
    });
};
exports.messageLobby = messageLobby;
const sendLobbyInfo = () => {
    const users = (0, lobby_1.getUsersInLobby)();
    const otherRooms = (0, room_1.getRoomsInfo)();
    (0, exports.messageLobby)({
        type: messages_1.MESSAGE_TYPES.LOBBY,
        params: { users, otherRooms },
    });
};
exports.sendLobbyInfo = sendLobbyInfo;
//# sourceMappingURL=lobby.js.map