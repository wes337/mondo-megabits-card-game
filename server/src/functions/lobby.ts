import { getLobby } from "../data";
import { sendLobbyInfo } from "../ws/lobby";

export const getUsersInLobby = () => {
  const lobby = getLobby();

  const users = Object.entries(lobby).map(([id, user]) => {
    return { id, name: (user as any).name };
  });

  return users;
};

export const joinLobby = (userId, socket, params) => {
  const { userName } = params;

  const lobby = getLobby();

  lobby[userId] = { socket, id: userId, name: userName.slice(0, 30) };

  sendLobbyInfo();
};

export const leaveLobby = (userId) => {
  const lobby = getLobby();

  if (lobby[userId]) {
    delete lobby[userId];
  }

  sendLobbyInfo();
};
