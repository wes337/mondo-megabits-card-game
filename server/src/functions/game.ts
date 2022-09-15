import { getUsersInRoom, getRoomStatus, getRoomUserIsIn } from "./room";
import { sendLobbyInfo } from "../ws/lobby";
import { messageRoom } from "../ws/room";
import Game from "../classes/Game";
import PuppetMaster from "../classes/PuppetMaster";
import { USER_STATUS } from "../types/user";
import { MESSAGE_TYPES } from "../types/messages";
import { ROOM_STATUS } from "../types/room";
import { getGames } from "../data";

export const updateGame = (game) => {
  const games = getGames();
  games[game.id] = game;
  messageRoom(game.id, { type: MESSAGE_TYPES.GAME, params: { game } });
};

export const getGameAndRoomUserIsIn = (userId) => {
  const room = getRoomUserIsIn(userId);
  const games = getGames();
  const game = room && games[room.code];

  return { room, game };
};

export const endTurn = (userId) => {
  const { room, game } = getGameAndRoomUserIsIn(userId);

  if (!room || !game) {
    return;
  }

  const puppetMaster = game.getPlayer(userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }

  // Check if it is users turn
  const canEndTurn = game.isPlayersTurn(userId);
  if (!canEndTurn) {
    return;
  }

  game.endTurn();

  // Clear all targeting after each turn
  messageRoom(room.code, {
    type: MESSAGE_TYPES.TARGET,
    params: { target: { from: null, to: null } },
  });

  game.addLog({
    event: "end-turn",
  });

  updateGame(game);
};

export const move = (userId, params) => {
  const { room, game } = getGameAndRoomUserIsIn(userId);

  if (!room || !game) {
    return;
  }

  const { cardUuid, destination } = params;

  const puppetMaster = game.getPlayer(userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }

  // Check if user can move card
  const canMoveCard = game.isPlayersTurn(userId);
  if (!canMoveCard) {
    return;
  }

  puppetMaster.moveCard(cardUuid, destination);
  game.addLog({
    event: "move-card",
    card: cardUuid,
    sourceUserId: puppetMaster.id,
  });
  updateGame(game);
};

export const target = (userId, params) => {
  const { room, game } = getGameAndRoomUserIsIn(userId);

  if (!room || !game) {
    return;
  }

  const { target } = params;

  const puppetMaster = game.getPlayer(userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }

  messageRoom(room.code, { type: MESSAGE_TYPES.TARGET, params: { target } }, [
    userId,
  ]);
};

export const tap = (userId, params) => {
  const { room, game } = getGameAndRoomUserIsIn(userId);

  if (!room || !game) {
    return;
  }

  const { cardUuid } = params;

  const puppetMaster = game.getPlayer(userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }

  puppetMaster.tapCard(cardUuid);
  updateGame(game);
};

export const play = (userId, params) => {
  const { room, game } = getGameAndRoomUserIsIn(userId);

  if (!room || !game) {
    return;
  }

  const { cardUuid, destination } = params;

  const puppetMaster = game.getPlayer(userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }

  // Check if user is allowed to play this card
  const isAllowedToPlayCard = game.isPlayersTurn(userId);
  if (!isAllowedToPlayCard) {
    return;
  }

  puppetMaster.playCard(cardUuid, destination);
  game.addLog({
    event: "play-card",
    sourceUserId: puppetMaster.id,
    card: cardUuid,
  });
  updateGame(game);
};

export const leaveGame = (userId) => {
  const { room, game } = getGameAndRoomUserIsIn(userId);

  if (!room || !game) {
    return;
  }

  Object.entries(room.users).forEach(([_, user]) => {
    user.status = USER_STATUS.WAITING;
  });

  const games = getGames();
  // Game ends if even one user leaves
  delete games[room.code];

  room.status = getRoomStatus(room);
  const users = getUsersInRoom(room.code);

  messageRoom(room.code, {
    type: MESSAGE_TYPES.LEAVE_GAME,
    params: { roomCode: room.code, users },
  });

  sendLobbyInfo();
};

export const startGame = (game) => {
  game.start();
  game.addLog({
    event: "game-start",
  });
  updateGame(game);
};

export const createGame = (userId) => {
  const { room, game: existingGame } = getGameAndRoomUserIsIn(userId);

  if (!room || !!existingGame) {
    return;
  }

  // Game ID is same as room code
  const gameId = room.code;

  const games = getGames();
  if (games[gameId]) {
    // Duplicate ID, try again
    createGame(userId);
    return;
  }

  const puppetMasters = Object.keys(room.users).map(
    (userId) => new PuppetMaster(userId)
  );

  const game = new Game(gameId, [...puppetMasters]);

  return game;
};

export const createAndStartGame = (userId) => {
  const game = createGame(userId);
  startGame(game);
};

export const start = (userId) => {
  const { room, game: existingGame } = getGameAndRoomUserIsIn(userId);

  if (!room || !!existingGame) {
    return;
  }

  room.users[userId].status = USER_STATUS.START;

  const waitingForOtherUsers = Object.entries(room.users).find(
    ([_, user]) =>
      user.status !== USER_STATUS.START && user.status !== USER_STATUS.READY
  );

  if (waitingForOtherUsers) {
    return;
  }

  const userIsHost = userId === Object.keys(room.users)[0];
  if (userIsHost) {
    createAndStartGame(userId);
    room.status = ROOM_STATUS.IN_PROGRESS;
    sendLobbyInfo();
  }
};
