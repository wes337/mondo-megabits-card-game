import { generateKey } from "../utils/string";
import { MAX_CLIENTS } from "../constants";
import { User, USER_STATUS } from "../types/user";
import { joinLobby, leaveLobby } from "./lobby";
import { getLobby, getRooms } from "../data";
import { messageRoom, messageRoomAsSystem } from "../ws/room";
import { MESSAGE_TYPES } from "../types/messages";
import { ROOM_STATUS } from "../types/room";

export const getRoomsInfo = () => {
  const rooms = getRooms();
  return Object.keys(rooms).map((roomCode) => {
    return {
      code: roomCode,
      users: Object.keys(rooms[roomCode].users).length || 0,
      maxUsers: MAX_CLIENTS,
      status: rooms[roomCode].status,
    };
  });
};

export const getRoomUserIsIn = (userId) => {
  const rooms = getRooms();

  const roomCode = Object.keys(rooms).find((roomCode) => {
    return rooms[roomCode].users[userId];
  });

  if (!roomCode) {
    return null;
  }

  const room = rooms[roomCode];
  return room;
};

export const updateStatus = (userId, params) => {
  const room = getRoomUserIsIn(userId);

  if (!room) {
    return;
  }

  const user = room.users?.[userId];
  if (!user) {
    return;
  }

  const { status } = params;

  user.status = status;

  messageRoom(room.code, {
    type: MESSAGE_TYPES.STATUS,
    params: { userId, status },
  });

  if (status === USER_STATUS.READY) {
    messageRoomAsSystem(room.code, `${user.name} is ready!`);
  } else if (status === USER_STATUS.WAITING) {
    messageRoomAsSystem(room.code, `${user.name} isn't ready...`);
  }

  const allUsersAreReady = !Object.entries(room.users).find(
    ([_, user]) => (user as User).status !== USER_STATUS.READY
  );

  if (allUsersAreReady) {
    messageRoomAsSystem(room.code, "Everybody is ready! Starting game...");
  }
};

export const getRoomByCode = (roomCode) => {
  const rooms = getRooms();
  const room = rooms[roomCode];

  if (!room) {
    return null;
  }

  return room;
};

export const getUsersInRoom = (roomCode) => {
  const room = getRoomByCode(roomCode);

  if (!room) {
    return [];
  }

  const users = Object.entries(room.users).map(
    ([id, { name, status, deck }]) => {
      return { id, name, status, deck };
    }
  );

  return users;
};

export const getRoomStatus = (room) => {
  return Object.keys(room.users).length < MAX_CLIENTS
    ? ROOM_STATUS.OPEN
    : ROOM_STATUS.FULL;
};

export const joinRoom = (userId, params) => {
  const { roomCode, deck } = params;
  const room = getRoomByCode(roomCode);

  if (!room) {
    console.warn(`Room ${roomCode} does not exist!`);
    return;
  }

  if (
    Object.keys(room.users).length >= MAX_CLIENTS ||
    room.status === ROOM_STATUS.FULL
  ) {
    console.warn(`Room ${roomCode} is full!`);
    return;
  }

  const lobby = getLobby();

  const socket = lobby[userId].socket;

  const user = {
    id: userId,
    socket,
    name: lobby[userId].name,
    status: USER_STATUS.WAITING,
    deck: deck || lobby[userId].deck,
  } as User;

  room.users = {
    ...room.users,
    [userId]: user,
  };
  room.status = getRoomStatus(room);

  leaveLobby(userId);

  const users = getUsersInRoom(roomCode);

  messageRoom(roomCode, {
    type: MESSAGE_TYPES.JOIN,
    params: { roomCode, users },
  });
  messageRoomAsSystem(roomCode, `${user.name} joined the room`);
};

export const createRoom = (userId, params) => {
  const roomCode = generateKey(5);

  const rooms = getRooms();

  if (rooms[roomCode]) {
    // Duplicate ID
    createRoom(userId, params);
    return;
  }

  rooms[roomCode] = {
    users: {},
    status: ROOM_STATUS.OPEN,
    code: roomCode,
  };

  console.log("=== CREATED ROOM ===");
  joinRoom(userId, { ...params, roomCode });
};

export const leaveRoom = (userId) => {
  const room = getRoomUserIsIn(userId);

  if (!room) {
    return;
  }

  const { name, socket } = room.users[userId];

  const rooms = getRooms();
  const userIsLastInRoom = Object.keys(room.users).length === 1;
  if (userIsLastInRoom) {
    delete rooms[room.code];
  } else {
    delete room.users[userId];
    room.status = getRoomStatus(room);
  }

  // Tell the room the user left
  messageRoom(room.code, {
    type: MESSAGE_TYPES.LEAVE,
    params: { userId },
  });
  messageRoomAsSystem(room.code, `${name} left the room`);

  // Then user that left joins lobby
  joinLobby(userId, socket, { userName: name });
};
