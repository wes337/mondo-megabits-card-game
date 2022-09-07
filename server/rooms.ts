import { generateKey } from "./utils";
import { MAX_CLIENTS } from "./constants";
import { Room } from "./types";

export const getRooms = (rooms) => {
  return Object.keys(rooms).map((roomCode) => ({
    code: roomCode,
    users: Object.keys(rooms[roomCode]).length || 0,
    maxUsers: MAX_CLIENTS,
  }));
};

export const messageRoom = (room, message) => {
  Object.keys(room).forEach((userId) => {
    const { socket } = room[userId];
    socket.send(JSON.stringify(message));
  });
};

export const messageOne = (userId, room, message) => {
  const { socket } = room[userId];
  socket.send(JSON.stringify(message));
};

export const chat = (rooms, params) => {
  const { roomCode, chatMessage } = params;

  messageRoom(rooms[roomCode], {
    type: "chat",
    params: { chatMessage },
  });
};

export const getUsersInRoom = (room: Room) => {
  const users = Object.entries(room).map(([id, { name }]) => {
    return { id, name };
  });

  return users;
};

export const sendLobbyInfo = (lobby: Room, rooms: Room[]) => {
  const users = getUsersInRoom(lobby);
  const otherRooms = getRooms(rooms);

  messageRoom(lobby, {
    type: "lobby",
    params: { users, otherRooms },
  });
};

export const joinLobby = (socket, userId, rooms, lobby, params) => {
  const { userName } = params;
  lobby[userId] = { socket, id: userId, name: userName };

  sendLobbyInfo(lobby, rooms);
};

export const leaveLobby = (userId, lobby, rooms) => {
  if (lobby.hasOwnProperty(userId)) {
    delete lobby[userId];
  }

  sendLobbyInfo(lobby, rooms);
};

export const joinRoom = (socket, userId, rooms, lobby, roomCode) => {
  if (!rooms[roomCode]) {
    console.warn(`Room ${roomCode} does not exist!`);
    return;
  }

  if (rooms[roomCode].length >= MAX_CLIENTS) {
    console.warn(`Room ${roomCode} is full!`);
    return;
  }

  const user = {
    socket,
    id: userId,
    name: lobby[userId].name,
  };

  leaveLobby(userId, lobby, rooms);
  const room = rooms[roomCode];
  room[userId] = user;

  const users = getUsersInRoom(room);

  messageRoom(room, {
    type: "join",
    params: { roomCode, users },
  });
};

export const createRoom = (socket, userId, rooms, lobby) => {
  const roomCode = generateKey(5);

  if (rooms[roomCode]) {
    // Duplicate ID
    createRoom(socket, userId, rooms, lobby);
    return;
  }

  rooms[roomCode] = {};
  console.log("=== CREATED ROOM ===");
  joinRoom(socket, userId, rooms, lobby, roomCode);
};

export const leaveRoom = (userId, lobby, rooms) => {
  const roomCode = Object.keys(rooms).find((roomCode) => {
    return rooms[roomCode][userId];
  });

  if (!roomCode) {
    return;
  }

  const room = rooms[roomCode];

  // Tell the room the user left
  // then tell the lobby the user joined
  messageRoom(room, {
    type: "leave",
    params: { uuid: userId, roomCode, rooms },
  });

  const userIsLastInRoom = Object.keys(room).length === 1;
  if (userIsLastInRoom) {
    delete rooms[roomCode];
  } else {
    delete room[userId];
  }
};
