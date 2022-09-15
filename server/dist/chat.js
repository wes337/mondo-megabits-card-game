"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChatMessage = void 0;
const room_1 = require("./room");
const messages_1 = require("./types/messages");
const room_2 = require("./ws/room");
const sendChatMessage = (userId, params) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const { chatMessage } = params;
    const user = room.users[userId];
    if (!user) {
        return;
    }
    const _chatMessage = Object.assign(Object.assign({}, chatMessage), { user: {
            id: user.id,
            name: user.name,
        } });
    (0, room_2.messageRoom)(room.code, {
        type: messages_1.MESSAGE_TYPES.CHAT,
        params: { chatMessage: _chatMessage },
    });
};
exports.sendChatMessage = sendChatMessage;
//# sourceMappingURL=chat.js.map