import { MESSAGE_TYPES, WebSocketMessage } from "../types/messages";
import { getUsersInLobby } from "../functions/lobby";
import { getRoomsInfo } from "../functions/room";
import { getLobby } from "../data";

export const messageLobby = (message: WebSocketMessage) => {
  const lobby = getLobby();

  Object.keys(lobby).forEach((userId) => {
    const { socket } = lobby[userId];
    socket.send(JSON.stringify(message));
  });
};

export const sendLobbyInfo = () => {
  const users = getUsersInLobby();
  const otherRooms = getRoomsInfo();

  messageLobby({
    type: MESSAGE_TYPES.LOBBY,
    params: { users, otherRooms },
  });
};
