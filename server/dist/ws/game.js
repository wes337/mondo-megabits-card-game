"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagePlayer = void 0;
const room_1 = require("../functions/room");
const messages_1 = require("../types/messages");
const messagePlayer = (userId, message) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const { socket } = room.users[userId];
    socket.send(JSON.stringify({
        type: messages_1.MESSAGE_TYPES.MESSAGE,
        params: { message },
    }));
};
exports.messagePlayer = messagePlayer;
//# sourceMappingURL=game.js.map