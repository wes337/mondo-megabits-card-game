"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoomAsSystem = exports.messageRoom = void 0;
const messages_1 = require("../types/messages");
const data_1 = require("../data");
const messageRoom = (roomCode, message, exclude) => {
    const rooms = (0, data_1.getRooms)();
    const room = rooms[roomCode];
    if (!room) {
        return;
    }
    Object.keys(room.users).forEach((userId) => {
        if (!exclude || !exclude.includes(userId)) {
            const { socket } = room.users[userId];
            socket.send(JSON.stringify(message));
        }
    });
};
exports.messageRoom = messageRoom;
const messageRoomAsSystem = (roomCode, message) => {
    const _chatMessage = {
        date: new Date().toLocaleTimeString("en-US"),
        message,
        user: {
            id: "SYSTEM",
            name: "SYSTEM",
        },
    };
    (0, exports.messageRoom)(roomCode, {
        type: messages_1.MESSAGE_TYPES.CHAT,
        params: { chatMessage: _chatMessage },
    });
};
exports.messageRoomAsSystem = messageRoomAsSystem;
//# sourceMappingURL=room.js.map