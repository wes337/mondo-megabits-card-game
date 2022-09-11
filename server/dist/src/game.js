"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.createAndStartGame = exports.createGame = exports.startGame = exports.leaveGame = exports.play = exports.tap = exports.move = exports.endTurn = exports.draw = void 0;
const rooms_1 = require("./rooms");
const cards_1 = require("./cards");
const Game_1 = __importDefault(require("./classes/Game"));
const PupperMaster_1 = __importDefault(require("./classes/PupperMaster"));
const utils_1 = require("./utils");
const draw = (room, uuid, params) => {
    const cards = (0, cards_1.getRandomCards)(params.number);
    (0, rooms_1.messageOne)(uuid, room, {
        type: "draw",
        params: { cards },
    });
};
exports.draw = draw;
const endTurn = (userId, rooms, games, params) => {
    const { gameCode, roomCode } = params;
    const game = games[gameCode];
    const room = rooms[roomCode];
    const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const isUsersTurn = game.turn.player === userId;
    if (!isUsersTurn) {
        return;
    }
    game.nextTurn();
    games[gameCode] = game;
    (0, rooms_1.messageRoom)(room, { type: "game", params: { game } });
};
exports.endTurn = endTurn;
const move = (userId, rooms, games, params) => {
    const { gameCode, roomCode, cardUuid, destination } = params;
    const game = games[gameCode];
    const room = rooms[roomCode];
    const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const isUsersTurn = game.turn.player === userId;
    if (!isUsersTurn) {
        return;
    }
    const cardAndLocation = puppetMaster.findCardByUuid(cardUuid);
    if (!cardAndLocation) {
        return;
    }
    const { card, location } = cardAndLocation;
    if (location === destination) {
        return;
    }
    puppetMaster.move(card.uuid, destination);
    games[gameCode] = game;
    (0, rooms_1.messageRoom)(room, { type: "game", params: { game } });
};
exports.move = move;
const tap = (userId, rooms, games, params) => {
    const { gameCode, roomCode, cardUuid } = params;
    const game = games[gameCode];
    const room = rooms[roomCode];
    const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const isUsersTurn = game.turn.player === userId;
    if (!isUsersTurn) {
        return;
    }
    const cardAndLocation = puppetMaster.findCardByUuid(cardUuid);
    if (!cardAndLocation) {
        return;
    }
    const { card, location } = cardAndLocation;
    const cardIsOnBoard = [
        "battle-zone",
        "the-think-tank",
        "buffer-zone",
    ].includes(location);
    if (!cardIsOnBoard) {
        return;
    }
    puppetMaster.tap(card.uuid);
    games[gameCode] = game;
    (0, rooms_1.messageRoom)(room, { type: "game", params: { game } });
};
exports.tap = tap;
const play = (userId, rooms, games, params) => {
    const { gameCode, roomCode, cardUuid, destination } = params;
    const game = games[gameCode];
    const room = rooms[roomCode];
    const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const isUsersTurn = game.turn.player === userId;
    if (!isUsersTurn) {
        return;
    }
    const cardAndLocation = puppetMaster.findCardByUuid(cardUuid);
    if (!cardAndLocation || (cardAndLocation === null || cardAndLocation === void 0 ? void 0 : cardAndLocation.location) !== "hand") {
        return;
    }
    const { card } = cardAndLocation;
    const cantAfford = puppetMaster.funding - card.cost < 0;
    if (cantAfford) {
        return;
    }
    puppetMaster.play(card.uuid, destination);
    games[gameCode] = game;
    (0, rooms_1.messageRoom)(room, { type: "game", params: { game } });
};
exports.play = play;
const leaveGame = (userId, rooms, games) => {
    const roomCode = Object.keys(rooms).find((roomCode) => {
        return rooms[roomCode].users[userId];
    });
    if (!roomCode) {
        return;
    }
    const gameCode = Object.keys(games).find((gameCode) => {
        return games[gameCode].puppetMasters.find(({ id }) => id === userId);
    });
    if (!gameCode) {
        return;
    }
    delete games[gameCode];
    const room = rooms[roomCode];
    Object.entries(room.users).forEach(([_, user]) => {
        user.status = "waiting";
    });
    (0, rooms_1.updateRoomStatus)(room);
    const users = (0, rooms_1.getUsersInRoom)(room);
    (0, rooms_1.messageRoom)(room, {
        type: "leave-game",
        params: { roomCode, users },
    });
};
exports.leaveGame = leaveGame;
const startGame = (room, games, game) => {
    game.start();
    game.puppetMasters.forEach((puppetMaster) => {
        const randomDeck = (0, cards_1.createRandomDeck)(40);
        puppetMaster.setDeck(randomDeck);
        puppetMaster.shuffleDeck();
        puppetMaster.drawCards(12);
    });
    games[game.id] = game;
    console.log("=== STARTED GAME ===");
    (0, rooms_1.messageRoom)(room, { type: "game", params: { game } });
};
exports.startGame = startGame;
const createGame = (userId, room, games) => {
    const gameCode = (0, utils_1.generateKey)(5);
    if (games[gameCode]) {
        (0, exports.createGame)(userId, games, room);
        return;
    }
    const puppetMasters = Object.keys(room.users).map((userId) => new PupperMaster_1.default(userId));
    const game = new Game_1.default(gameCode, [...puppetMasters]);
    games[gameCode] = game;
    return game;
};
exports.createGame = createGame;
const createAndStartGame = (userId, room, games) => {
    const game = (0, exports.createGame)(userId, room, games);
    (0, exports.startGame)(room, games, game);
};
exports.createAndStartGame = createAndStartGame;
const start = (userId, lobby, rooms, games) => {
    const roomCode = Object.keys(rooms).find((roomCode) => {
        return rooms[roomCode].users[userId];
    });
    if (!roomCode) {
        return;
    }
    const room = rooms[roomCode];
    room.users[userId].status = "start";
    const waitingForOtherUsers = room.users.find((user) => user.status !== "start");
    if (waitingForOtherUsers) {
        return;
    }
    const userIsHost = userId === Object.keys(room.users)[0];
    if (userIsHost) {
        (0, exports.createAndStartGame)(userId, room, games);
        room.status = "in-progress";
        (0, rooms_1.sendLobbyInfo)(lobby, rooms);
    }
};
exports.start = start;
//# sourceMappingURL=game.js.map