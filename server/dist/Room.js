"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.createRoom = exports.joinRoom = exports.getRoomStatus = exports.getUsersInRoom = exports.getRoomByCode = exports.updateStatus = exports.getRoomUserIsIn = exports.getRoomsInfo = void 0;
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const user_1 = require("./types/user");
const lobby_1 = require("./lobby");
const data_1 = require("./data");
const room_1 = require("./ws/room");
const messages_1 = require("./types/messages");
const room_2 = require("./types/room");
const getRoomsInfo = () => {
    const rooms = (0, data_1.getRooms)();
    return Object.keys(rooms).map((roomCode) => {
        return {
            code: roomCode,
            users: Object.keys(rooms[roomCode].users).length || 0,
            maxUsers: constants_1.MAX_CLIENTS,
            status: rooms[roomCode].status,
        };
    });
};
exports.getRoomsInfo = getRoomsInfo;
const getRoomUserIsIn = (userId) => {
    const rooms = (0, data_1.getRooms)();
    const roomCode = Object.keys(rooms).find((roomCode) => {
        return rooms[roomCode].users[userId];
    });
    if (!roomCode) {
        return null;
    }
    const room = rooms[roomCode];
    return room;
};
exports.getRoomUserIsIn = getRoomUserIsIn;
const updateStatus = (userId, params) => {
    var _a;
    const room = (0, exports.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const user = (_a = room.users) === null || _a === void 0 ? void 0 : _a[userId];
    if (!user) {
        return;
    }
    const { status } = params;
    user.status = status;
    (0, room_1.messageRoom)(room.code, {
        type: messages_1.MESSAGE_TYPES.STATUS,
        params: { userId, status },
    });
    if (status === user_1.USER_STATUS.READY) {
        (0, room_1.messageRoomAsSystem)(room.code, `${user.name} is ready!`);
    }
    else if (status === user_1.USER_STATUS.WAITING) {
        (0, room_1.messageRoomAsSystem)(room.code, `${user.name} isn't ready...`);
    }
    const allUsersAreReady = !Object.entries(room.users).find(([_, user]) => user.status !== user_1.USER_STATUS.READY);
    if (allUsersAreReady) {
        (0, room_1.messageRoomAsSystem)(room.code, "Everybody is ready! Starting game...");
    }
};
exports.updateStatus = updateStatus;
const getRoomByCode = (roomCode) => {
    const rooms = (0, data_1.getRooms)();
    const room = rooms[roomCode];
    if (!room) {
        return null;
    }
    return room;
};
exports.getRoomByCode = getRoomByCode;
const getUsersInRoom = (roomCode) => {
    const room = (0, exports.getRoomByCode)(roomCode);
    if (!room) {
        return [];
    }
    const users = Object.entries(room.users).map(([id, { name, status }]) => {
        return { id, name, status };
    });
    return users;
};
exports.getUsersInRoom = getUsersInRoom;
const getRoomStatus = (room) => {
    return Object.keys(room.users).length < constants_1.MAX_CLIENTS
        ? room_2.ROOM_STATUS.OPEN
        : room_2.ROOM_STATUS.FULL;
};
exports.getRoomStatus = getRoomStatus;
const joinRoom = (userId, params) => {
    const { roomCode } = params;
    const room = (0, exports.getRoomByCode)(roomCode);
    if (!room) {
        console.warn(`Room ${roomCode} does not exist!`);
        return;
    }
    if (Object.keys(room.users).length >= constants_1.MAX_CLIENTS ||
        room.status === room_2.ROOM_STATUS.FULL) {
        console.warn(`Room ${roomCode} is full!`);
        return;
    }
    const lobby = (0, data_1.getLobby)();
    const socket = lobby[userId].socket;
    const user = {
        id: userId,
        socket,
        name: lobby[userId].name,
        status: user_1.USER_STATUS.WAITING,
    };
    room.users = Object.assign(Object.assign({}, room.users), { [userId]: user });
    room.status = (0, exports.getRoomStatus)(room);
    (0, lobby_1.leaveLobby)(userId);
    const users = (0, exports.getUsersInRoom)(roomCode);
    (0, room_1.messageRoom)(roomCode, {
        type: messages_1.MESSAGE_TYPES.JOIN,
        params: { roomCode, users },
    });
    (0, room_1.messageRoomAsSystem)(roomCode, `${user.name} joined the room`);
};
exports.joinRoom = joinRoom;
const createRoom = (userId) => {
    const roomCode = (0, utils_1.generateKey)(5);
    const rooms = (0, data_1.getRooms)();
    if (rooms[roomCode]) {
        (0, exports.createRoom)(userId);
        return;
    }
    rooms[roomCode] = {
        users: {},
        status: room_2.ROOM_STATUS.OPEN,
        code: roomCode,
    };
    console.log("=== CREATED ROOM ===");
    (0, exports.joinRoom)(userId, { roomCode });
};
exports.createRoom = createRoom;
const leaveRoom = (userId) => {
    const room = (0, exports.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const { name, socket } = room.users[userId];
    const rooms = (0, data_1.getRooms)();
    const userIsLastInRoom = Object.keys(room.users).length === 1;
    if (userIsLastInRoom) {
        delete rooms[room.code];
    }
    else {
        delete room.users[userId];
        room.status = (0, exports.getRoomStatus)(room);
    }
    (0, room_1.messageRoom)(room.code, {
        type: messages_1.MESSAGE_TYPES.LEAVE,
        params: { userId },
    });
    (0, room_1.messageRoomAsSystem)(room.code, `${name} left the room`);
    (0, lobby_1.joinLobby)(userId, socket, { userName: name });
};
exports.leaveRoom = leaveRoom;
//# sourceMappingURL=room.js.map