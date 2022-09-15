import { MESSAGE_TYPES, WebSocketMessage } from "../types/messages";
import { getRooms } from "../data";

export const messageRoom = (
  roomCode,
  message: WebSocketMessage,
  exclude?: string[]
) => {
  const rooms = getRooms();
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

export const messageRoomAsSystem = (roomCode, message: string) => {
  const _chatMessage = {
    date: new Date().toLocaleTimeString("en-US"),
    message,
    user: {
      id: "SYSTEM",
      name: "SYSTEM",
    },
  };

  messageRoom(roomCode, {
    type: MESSAGE_TYPES.CHAT,
    params: { chatMessage: _chatMessage },
  });
};
