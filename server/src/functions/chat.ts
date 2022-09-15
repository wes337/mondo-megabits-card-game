import { messageRoom } from "../ws/room";
import { MESSAGE_TYPES } from "../types/messages";
import { getRoomUserIsIn } from "./room";

export const sendChatMessage = (userId, params) => {
  const room = getRoomUserIsIn(userId);

  if (!room) {
    return;
  }

  const { chatMessage } = params;

  const user = room.users[userId];
  if (!user) {
    return;
  }

  const _chatMessage = {
    ...chatMessage,
    user: {
      id: user.id,
      name: user.name,
    },
  };

  messageRoom(room.code, {
    type: MESSAGE_TYPES.CHAT,
    params: { chatMessage: _chatMessage },
  });
};
