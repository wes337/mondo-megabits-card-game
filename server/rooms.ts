import { generateKey } from "./utils";
import { MAX_CLIENTS } from "./constants";
import { Room } from "./types";

export const getRooms = (rooms) => {
  return Object.keys(rooms).map((roomCode) => {
    return {
      code: roomCode,
      users: Object.keys(rooms[roomCode].users).length || 0,
      maxUsers: MAX_CLIENTS,
    };
  });
};

export const messageLobby = (lobby, message) => {
  Object.keys(lobby).forEach((userId) => {
    const { socket } = lobby[userId];
    socket.send(JSON.stringify(message));
  });
};

export const messageRoom = (room, message) => {
  Object.keys(room.users).forEach((userId) => {
    const { socket } = room.users[userId];
    socket.send(JSON.stringify(message));
  });
};

export const messageOne = (userId, room, message) => {
  const { socket } = room.users[userId];
  socket.send(JSON.stringify(message));
};

export const chat = (userId, rooms, params) => {
  const { roomCode, chatMessage } = params;

  const user = rooms[roomCode].users[userId];
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

  messageRoom(rooms[roomCode], {
    type: "chat",
    params: { chatMessage: _chatMessage },
  });
};

export const ready = (userId, rooms, params) => {
  const { roomCode, status } = params;

  const user = rooms[roomCode].users[userId];
  if (!user) {
    return;
  }

  user.status = status;

  messageRoom(rooms[roomCode], {
    type: "ready",
    params: { userId, status },
  });
};

export const getUsersInRoom = (room: Room) => {
  const users = Object.entries(room.users).map(([id, { name, status }]) => {
    return { id, name, status };
  });

  return users;
};

export const getUsersInLobby = (lobby: Room) => {
  const users = Object.entries(lobby).map(([id, { name }]) => {
    return { id, name };
  });

  return users;
};

export const sendLobbyInfo = (lobby: Room, rooms) => {
  const users = getUsersInLobby(lobby);
  const otherRooms = getRooms(rooms);

  messageLobby(lobby, {
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

  if (rooms[roomCode].users.length >= MAX_CLIENTS) {
    console.warn(`Room ${roomCode} is full!`);
    return;
  }

  const user = {
    socket,
    id: userId,
    name: lobby[userId].name,
    status: "waiting",
  };

  const room = rooms[roomCode];
  room.users[userId] = user;

  leaveLobby(userId, lobby, rooms);

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

  rooms[roomCode] = {
    users: [],
    status: "open",
  };
  console.log("=== CREATED ROOM ===");
  joinRoom(socket, userId, rooms, lobby, roomCode);
};

export const leaveRoom = (userId, lobby, rooms) => {
  const roomCode = Object.keys(rooms).find((roomCode) => {
    return rooms[roomCode].users[userId];
  });

  if (!roomCode) {
    return;
  }

  const { socket, name } = rooms[roomCode].users[userId];
  const room = rooms[roomCode];

  const userIsLastInRoom = Object.keys(room.users).length === 1;
  if (userIsLastInRoom) {
    delete rooms[roomCode];
  } else {
    delete room.users[userId];
  }

  // Tell the room the user left
  messageRoom(room, {
    type: "leave",
    params: { userId },
  });

  // Then user that left joins lobby
  joinLobby(socket, userId, rooms, lobby, { userName: name });
};

export const cleanUp = (userId, lobby, rooms) => {
  const roomCode = Object.keys(rooms).find((roomCode) => {
    return rooms[roomCode].users[userId];
  });

  if (roomCode) {
    const room = rooms[roomCode];

    const userIsLastInRoom = Object.keys(room.users).length === 1;
    if (userIsLastInRoom) {
      delete rooms[roomCode];
    } else {
      delete room.users[userId];
    }

    messageRoom(room, {
      type: "leave",
      params: { userId },
    });
  }

  leaveLobby(userId, lobby, rooms);
};
