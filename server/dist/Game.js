"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.createAndStartGame = exports.createGame = exports.startGame = exports.leaveGame = exports.play = exports.tap = exports.target = exports.move = exports.endTurn = exports.getGameAndRoomUserIsIn = void 0;
const room_1 = require("./room");
const lobby_1 = require("./ws/lobby");
const room_2 = require("./ws/room");
const cards_1 = require("./cards");
const Game_1 = __importDefault(require("./classes/Game"));
const PuppetMaster_1 = __importDefault(require("./classes/PuppetMaster"));
const user_1 = require("./types/user");
const messages_1 = require("./types/messages");
const room_3 = require("./types/room");
const data_1 = require("./data");
const getGameAndRoomUserIsIn = (userId) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    const games = (0, data_1.getGames)();
    const game = room && games[room.code];
    return { room, game };
};
exports.getGameAndRoomUserIsIn = getGameAndRoomUserIsIn;
const endTurn = (userId) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const games = (0, data_1.getGames)();
    const game = games[room.code];
    const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const isUsersTurn = game.turn.player === userId;
    if (!isUsersTurn) {
        return;
    }
    puppetMaster.discardHand();
    game.nextTurn();
    const normalDrawPhase = (game.puppetMasters.length === 1 && game.turn.number >= 2) ||
        game.turn.number > 2;
    if (normalDrawPhase) {
        const nextPlayer = game.puppetMasters.find(({ id }) => id === game.turn.player);
        nextPlayer === null || nextPlayer === void 0 ? void 0 : nextPlayer.drawCards(3);
    }
    games[room.code] = game;
    (0, room_2.messageRoom)(room.code, {
        type: messages_1.MESSAGE_TYPES.TARGET,
        params: { target: { from: null, to: null } },
    });
    (0, room_2.messageRoom)(room.code, { type: messages_1.MESSAGE_TYPES.GAME, params: { game } });
};
exports.endTurn = endTurn;
const move = (userId, params) => {
    const { cardUuid, destination } = params;
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const games = (0, data_1.getGames)();
    const game = games[room.code];
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
    games[room.code] = game;
    (0, room_2.messageRoom)(room.code, { type: messages_1.MESSAGE_TYPES.GAME, params: { game } });
};
exports.move = move;
const target = (userId, params) => {
    const { target } = params;
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const games = (0, data_1.getGames)();
    const game = games[room.code];
    const puppetMaster = game.puppetMasters.find(({ id }) => id === userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    (0, room_2.messageRoom)(room.code, { type: messages_1.MESSAGE_TYPES.TARGET, params: { target } }, [
        userId,
    ]);
};
exports.target = target;
const tap = (userId, params) => {
    const { cardUuid } = params;
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const games = (0, data_1.getGames)();
    const game = games[room.code];
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
    games[game.id] = game;
    (0, room_2.messageRoom)(room.code, { type: messages_1.MESSAGE_TYPES.GAME, params: { game } });
};
exports.tap = tap;
const play = (userId, params) => {
    const { cardUuid, destination } = params;
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const games = (0, data_1.getGames)();
    const game = games[room.code];
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
    games[game.id] = game;
    (0, room_2.messageRoom)(room.code, { type: messages_1.MESSAGE_TYPES.GAME, params: { game } });
};
exports.play = play;
const leaveGame = (userId) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const games = (0, data_1.getGames)();
    const game = games[room.code];
    if (!game) {
        return;
    }
    Object.entries(room.users).forEach(([_, user]) => {
        user.status = user_1.USER_STATUS.WAITING;
    });
    delete games[room.code];
    room.status = (0, room_1.getRoomStatus)(room);
    const users = (0, room_1.getUsersInRoom)(room.code);
    (0, room_2.messageRoom)(room.code, {
        type: messages_1.MESSAGE_TYPES.LEAVE_GAME,
        params: { roomCode: room.code, users },
    });
    (0, lobby_1.sendLobbyInfo)();
};
exports.leaveGame = leaveGame;
const startGame = (game) => {
    game.start();
    game.puppetMasters.forEach((puppetMaster) => {
        const randomDeck = (0, cards_1.createRandomDeck)(40);
        puppetMaster.setDeck(randomDeck);
        puppetMaster.shuffleDeck();
        puppetMaster.drawCards(12);
    });
    const games = (0, data_1.getGames)();
    games[game.id] = game;
    console.log("=== STARTED GAME ===");
    (0, room_2.messageRoom)(game.id, { type: messages_1.MESSAGE_TYPES.GAME, params: { game } });
};
exports.startGame = startGame;
const createGame = (userId) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    const gameId = room.code;
    const games = (0, data_1.getGames)();
    if (games[gameId]) {
        (0, exports.createGame)(userId);
        return;
    }
    const puppetMasters = Object.keys(room.users).map((userId) => new PuppetMaster_1.default(userId));
    const game = new Game_1.default(gameId, [...puppetMasters]);
    games[gameId] = game;
    return game;
};
exports.createGame = createGame;
const createAndStartGame = (userId) => {
    const game = (0, exports.createGame)(userId);
    (0, exports.startGame)(game);
};
exports.createAndStartGame = createAndStartGame;
const start = (userId) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    if (!room) {
        return;
    }
    room.users[userId].status = user_1.USER_STATUS.START;
    const waitingForOtherUsers = Object.entries(room.users).find(([_, user]) => user.status !== user_1.USER_STATUS.START && user.status !== user_1.USER_STATUS.READY);
    if (waitingForOtherUsers) {
        return;
    }
    const userIsHost = userId === Object.keys(room.users)[0];
    if (userIsHost) {
        (0, exports.createAndStartGame)(userId);
        room.status = room_3.ROOM_STATUS.IN_PROGRESS;
        (0, lobby_1.sendLobbyInfo)();
    }
};
exports.start = start;
//# sourceMappingURL=game.js.map