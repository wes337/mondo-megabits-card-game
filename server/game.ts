import { messageOne, messageRoom } from "./rooms";
import { createRandomDeck, getRandomCards } from "./cards";
import Game from "./classes/Game";
import PuppetMaster from "./classes/PupperMaster";
import { generateKey } from "./utils";

export const draw = (room, uuid, params) => {
  const cards = getRandomCards(params.number);

  messageOne(uuid, room, {
    type: "draw",
    params: { cards },
  });
};

export const endTurn = (userId, rooms, games, params) => {
  const { gameCode, roomCode } = params;
  const game = games[gameCode];
  const room = rooms[roomCode];

  const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }
  // Check if it is users turn
  const isUsersTurn = game.turn.player === userId;
  if (!isUsersTurn) {
    return;
  }

  game.nextTurn();

  games[gameCode] = game;
  messageRoom(room, { type: "game", params: { game } });
};

export const play = (userId, rooms, games, params) => {
  const { gameCode, roomCode, cardUuid, destination } = params;
  const game = games[gameCode];
  const room = rooms[roomCode];

  const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
  const userIsInRoom = room.users[userId];
  if (!puppetMaster || !userIsInRoom) {
    return;
  }
  // Check if it is users turn
  const isUsersTurn = game.turn.player === userId;
  if (!isUsersTurn) {
    return;
  }
  const { card, location } = puppetMaster.findCardByUuid(cardUuid);

  // Check if user has card in hand
  if (!card || location !== "hand") {
    return;
  }
  // Check if user can pay for card
  const cantAfford = puppetMaster.funding - card.cost < 0;

  if (cantAfford) {
    return;
  }

  puppetMaster.play(card.uuid, destination);
  games[gameCode] = game;
  messageRoom(room, { type: "game", params: { game } });
  // Move card to destination
  // Remove card from hand
  // Send message to room with updated game
};

export const startGame = (room, games, game) => {
  game.start();

  game.puppetMasters.forEach((puppetMaster) => {
    // Give random 40 cards
    const randomDeck = createRandomDeck(40);
    puppetMaster.setDeck(randomDeck);
    // Draw 12 cards on first turn
    puppetMaster.drawCards(12);
  });

  games[game.id] = game;

  console.log("=== STARTED GAME ===");
  messageRoom(room, { type: "game", params: { game } });
};

export const createGame = (userId, room, games) => {
  const gameCode = generateKey(5);

  if (games[gameCode]) {
    // Duplicate ID
    createGame(userId, games, room);
    return;
  }

  const puppetMasters = Object.keys(room.users).map(
    (userId) => new PuppetMaster(userId)
  );

  const game = new Game(gameCode, [...puppetMasters]);
  games[gameCode] = game;

  return game;
};

export const createAndStartGame = (userId, room, games) => {
  const game = createGame(userId, room, games);
  startGame(room, games, game);
};

export const start = (userId, rooms, games) => {
  const roomCode = Object.keys(rooms).find((roomCode) => {
    return rooms[roomCode].users[userId];
  });

  if (!roomCode) {
    return;
  }

  const room = rooms[roomCode];

  room.users[userId].status = "start";

  const waitingForOtherUsers = room.users.find(
    (user) => user.status !== "start"
  );
  if (waitingForOtherUsers) {
    return;
  }

  const userIsHost = userId === Object.keys(room.users)[0];
  if (userIsHost) {
    createAndStartGame(userId, room, games);
  }
};
