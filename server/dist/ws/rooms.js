"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLobbyInfo = exports.messageLobby = void 0;
const data_1 = require("../data");
const lobby_1 = require("../lobby");
const rooms_1 = require("../rooms");
const messageLobby = (message) => {
    const lobby = (0, data_1.getLobby)();
    Object.keys(lobby).forEach((userId) => {
        const { socket } = lobby[userId];
        socket.send(JSON.stringify(message));
    });
};
exports.messageLobby = messageLobby;
const sendLobbyInfo = () => {
    const rooms = (0, data_1.getRooms)();
    const users = (0, lobby_1.getUsersInLobby)();
    const otherRooms = (0, rooms_1.getRoomsInfo)(rooms);
    (0, exports.messageLobby)({
        type: "lobby",
        params: { users, otherRooms },
    });
};
exports.sendLobbyInfo = sendLobbyInfo;
//# sourceMappingURL=rooms.js.map