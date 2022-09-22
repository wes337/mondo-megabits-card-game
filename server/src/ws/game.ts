import { getRoomUserIsIn } from "../functions/room";
import { MESSAGE_TYPES } from "../types/messages";

export const messagePlayer = (userId: string, message: string) => {
  const room = getRoomUserIsIn(userId);

  if (!room) {
    return;
  }

  const { socket } = room.users[userId];
  socket.send(
    JSON.stringify({
      type: MESSAGE_TYPES.MESSAGE,
      params: { message },
    })
  );
};
