"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUp = exports.leaveRoom = exports.createRoom = exports.joinRoom = exports.updateRoomStatus = exports.leaveLobby = exports.joinLobby = exports.sendLobbyInfo = exports.getUsersInLobby = exports.getUsersInRoom = exports.ready = exports.chat = exports.messageOne = exports.messageRoom = exports.messageLobby = exports.getRooms = void 0;
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const getRooms = (rooms) => {
    return Object.keys(rooms).map((roomCode) => {
        return {
            code: roomCode,
            users: Object.keys(rooms[roomCode].users).length || 0,
            maxUsers: constants_1.MAX_CLIENTS,
            status: rooms[roomCode].status,
        };
    });
};
exports.getRooms = getRooms;
const messageLobby = (lobby, message) => {
    Object.keys(lobby).forEach((userId) => {
        const { socket } = lobby[userId];
        socket.send(JSON.stringify(message));
    });
};
exports.messageLobby = messageLobby;
const messageRoom = (room, message) => {
    Object.keys(room.users).forEach((userId) => {
        const { socket } = room.users[userId];
        socket.send(JSON.stringify(message));
    });
};
exports.messageRoom = messageRoom;
const messageOne = (userId, room, message) => {
    const { socket } = room.users[userId];
    socket.send(JSON.stringify(message));
};
exports.messageOne = messageOne;
const chat = (userId, rooms, params) => {
    const { roomCode, chatMessage } = params;
    const user = rooms[roomCode].users[userId];
    if (!user) {
        return;
    }
    const _chatMessage = Object.assign(Object.assign({}, chatMessage), { user: {
            id: user.id,
            name: user.name,
        } });
    (0, exports.messageRoom)(rooms[roomCode], {
        type: "chat",
        params: { chatMessage: _chatMessage },
    });
};
exports.chat = chat;
const ready = (userId, rooms, params) => {
    const { roomCode, status } = params;
    const user = rooms[roomCode].users[userId];
    if (!user) {
        return;
    }
    user.status = status;
    (0, exports.messageRoom)(rooms[roomCode], {
        type: "ready",
        params: { userId, status },
    });
};
exports.ready = ready;
const getUsersInRoom = (room) => {
    const users = Object.entries(room.users).map(([id, { name, status }]) => {
        return { id, name, status };
    });
    return users;
};
exports.getUsersInRoom = getUsersInRoom;
const getUsersInLobby = (lobby) => {
    const users = Object.entries(lobby).map(([id, { name }]) => {
        return { id, name };
    });
    return users;
};
exports.getUsersInLobby = getUsersInLobby;
const sendLobbyInfo = (lobby, rooms) => {
    const users = (0, exports.getUsersInLobby)(lobby);
    const otherRooms = (0, exports.getRooms)(rooms);
    (0, exports.messageLobby)(lobby, {
        type: "lobby",
        params: { users, otherRooms },
    });
};
exports.sendLobbyInfo = sendLobbyInfo;
const joinLobby = (socket, userId, rooms, lobby, params) => {
    const { userName } = params;
    lobby[userId] = { socket, id: userId, name: userName };
    (0, exports.sendLobbyInfo)(lobby, rooms);
};
exports.joinLobby = joinLobby;
const leaveLobby = (userId, lobby, rooms) => {
    if (lobby.hasOwnProperty(userId)) {
        delete lobby[userId];
    }
    (0, exports.sendLobbyInfo)(lobby, rooms);
};
exports.leaveLobby = leaveLobby;
const updateRoomStatus = (room) => {
    room.status = Object.keys(room.users).length < constants_1.MAX_CLIENTS ? "open" : "full";
};
exports.updateRoomStatus = updateRoomStatus;
const joinRoom = (socket, userId, rooms, lobby, roomCode) => {
    if (!rooms[roomCode]) {
        console.warn(`Room ${roomCode} does not exist!`);
        return;
    }
    if (rooms[roomCode].users.length >= constants_1.MAX_CLIENTS ||
        rooms[roomCode].status === "full") {
        console.warn(`Room ${roomCode} is full!`);
        return;
    }
    const user = {
        socket,
        id: userId,
        name: lobby[userId].name,
        status: "waiting",
    };
    const room = rooms[roomCode];
    room.users[userId] = user;
    (0, exports.updateRoomStatus)(room);
    (0, exports.leaveLobby)(userId, lobby, rooms);
    const users = (0, exports.getUsersInRoom)(room);
    (0, exports.messageRoom)(room, {
        type: "join",
        params: { roomCode, users },
    });
};
exports.joinRoom = joinRoom;
const createRoom = (socket, userId, rooms, lobby) => {
    const roomCode = (0, utils_1.generateKey)(5);
    if (rooms[roomCode]) {
        (0, exports.createRoom)(socket, userId, rooms, lobby);
        return;
    }
    rooms[roomCode] = {
        users: [],
        status: "open",
    };
    console.log("=== CREATED ROOM ===");
    (0, exports.joinRoom)(socket, userId, rooms, lobby, roomCode);
};
exports.createRoom = createRoom;
const leaveRoom = (userId, lobby, rooms) => {
    const roomCode = Object.keys(rooms).find((roomCode) => {
        return rooms[roomCode].users[userId];
    });
    if (!roomCode) {
        return;
    }
    const { socket, name } = rooms[roomCode].users[userId];
    const room = rooms[roomCode];
    const userIsLastInRoom = Object.keys(room.users).length === 1;
    if (userIsLastInRoom) {
        delete rooms[roomCode];
    }
    else {
        delete room.users[userId];
        (0, exports.updateRoomStatus)(room);
    }
    (0, exports.messageRoom)(room, {
        type: "leave",
        params: { userId },
    });
    (0, exports.joinLobby)(socket, userId, rooms, lobby, { userName: name });
};
exports.leaveRoom = leaveRoom;
const cleanUp = (userId, lobby, rooms, games) => {
    const roomCode = Object.keys(rooms).find((roomCode) => {
        return rooms[roomCode].users[userId];
    });
    if (roomCode) {
        const room = rooms[roomCode];
        const userIsLastInRoom = Object.keys(room.users).length === 1;
        if (userIsLastInRoom) {
            delete rooms[roomCode];
        }
        else {
            delete room.users[userId];
        }
        (0, exports.messageRoom)(room, {
            type: "leave",
            params: { userId },
        });
    }
    (0, exports.leaveLobby)(userId, lobby, rooms);
    const gameCode = Object.keys(games).find((gameCode) => {
        return games[gameCode].puppetMasters.find(({ id }) => id === userId);
    });
    if (gameCode) {
        delete games[gameCode];
    }
};
exports.cleanUp = cleanUp;
//# sourceMappingURL=rooms.js.map