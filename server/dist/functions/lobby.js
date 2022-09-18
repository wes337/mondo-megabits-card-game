"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveLobby = exports.joinLobby = exports.getUsersInLobby = void 0;
const data_1 = require("../data");
const lobby_1 = require("../ws/lobby");
const getUsersInLobby = () => {
    const lobby = (0, data_1.getLobby)();
    const users = Object.entries(lobby).map(([id, user]) => {
        return { id, name: user.name };
    });
    return users;
};
exports.getUsersInLobby = getUsersInLobby;
const joinLobby = (userId, socket, params) => {
    const { userName } = params;
    const lobby = (0, data_1.getLobby)();
    lobby[userId] = { socket, id: userId, name: userName.slice(0, 30) };
    (0, lobby_1.sendLobbyInfo)();
};
exports.joinLobby = joinLobby;
const leaveLobby = (userId) => {
    const lobby = (0, data_1.getLobby)();
    if (lobby[userId]) {
        delete lobby[userId];
    }
    (0, lobby_1.sendLobbyInfo)();
};
exports.leaveLobby = leaveLobby;
//# sourceMappingURL=lobby.js.map