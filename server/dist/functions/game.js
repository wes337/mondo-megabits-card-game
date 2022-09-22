"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCardNotes = exports.start = exports.createAndStartGame = exports.createGame = exports.startGame = exports.leaveGame = exports.attack = exports.play = exports.tap = exports.target = exports.move = exports.endTurn = exports.getGameAndRoomUserIsIn = exports.updateGame = void 0;
const card_1 = require("../utils/card");
const room_1 = require("./room");
const lobby_1 = require("../ws/lobby");
const room_2 = require("../ws/room");
const Game_1 = __importStar(require("../classes/Game"));
const PuppetMaster_1 = __importDefault(require("../classes/PuppetMaster"));
const user_1 = require("../types/user");
const messages_1 = require("../types/messages");
const room_3 = require("../types/room");
const data_1 = require("../data");
const updateGame = (game) => {
    const games = (0, data_1.getGames)();
    games[game.id] = game;
    (0, room_2.messageRoom)(game.id, { type: messages_1.MESSAGE_TYPES.GAME, params: { game } });
};
exports.updateGame = updateGame;
const getGameAndRoomUserIsIn = (userId) => {
    const room = (0, room_1.getRoomUserIsIn)(userId);
    const games = (0, data_1.getGames)();
    const game = room && games[room.code];
    return { room, game };
};
exports.getGameAndRoomUserIsIn = getGameAndRoomUserIsIn;
const endTurn = (userId) => {
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const puppetMaster = game.getPlayer(userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const canEndTurn = game.isPlayersTurn(userId);
    if (!canEndTurn) {
        return;
    }
    game.endTurn();
    (0, room_2.messageRoom)(room.code, {
        type: messages_1.MESSAGE_TYPES.TARGET,
        params: { target: { from: null, to: null } },
    });
    game.addLog({
        event: "end-turn",
    });
    (0, exports.updateGame)(game);
};
exports.endTurn = endTurn;
const move = (userId, params) => {
    var _a;
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const { cardUuid, destination } = params;
    const puppetMaster = game.getPlayer(userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    const canMoveCard = game.isPlayersTurn(userId) || destination === Game_1.GAME_ZONE.DISCARD_PILE;
    if (!canMoveCard) {
        return;
    }
    if (((_a = game.location) === null || _a === void 0 ? void 0 : _a.uuid) === cardUuid &&
        destination === Game_1.GAME_ZONE.DISCARD_PILE) {
        game.location = undefined;
    }
    puppetMaster.moveCard(cardUuid, destination);
    game.addLog({
        event: "move-card",
        card: cardUuid,
        sourceUserId: puppetMaster.id,
    });
    (0, exports.updateGame)(game);
};
exports.move = move;
const target = (userId, params) => {
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const { target } = params;
    const puppetMaster = game.getPlayer(userId);
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
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const { cardUuid } = params;
    const puppetMaster = game.getPlayer(userId);
    const userIsInRoom = room.users[userId];
    if (!puppetMaster || !userIsInRoom) {
        return;
    }
    puppetMaster.tapOrUntapCard(cardUuid);
    (0, exports.updateGame)(game);
};
exports.tap = tap;
const play = (userId, params) => {
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const userIsInRoom = room.users[userId];
    if (!userIsInRoom) {
        return;
    }
    const { cardUuid, destination } = params;
    game.play(userId, cardUuid, destination);
    (0, exports.updateGame)(game);
};
exports.play = play;
const attack = (userId, params) => {
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const userIsInRoom = room.users[userId];
    if (!userIsInRoom) {
        return;
    }
    const { attackerUuid, defenderUuid } = params;
    game.attack(userId, attackerUuid, defenderUuid);
    (0, exports.updateGame)(game);
};
exports.attack = attack;
const leaveGame = (userId) => {
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    Object.entries(room.users).forEach(([_, user]) => {
        user.status = user_1.USER_STATUS.WAITING;
    });
    const games = (0, data_1.getGames)();
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
    game.addLog({
        event: "game-start",
    });
    (0, exports.updateGame)(game);
};
exports.startGame = startGame;
const createGame = (userId) => {
    const { room, game: existingGame } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !!existingGame) {
        return;
    }
    const gameId = room.code;
    const games = (0, data_1.getGames)();
    if (games[gameId]) {
        (0, exports.createGame)(userId);
        return;
    }
    const puppetMasters = Object.keys(room.users).map((userId) => {
        const puppetMaster = new PuppetMaster_1.default(userId);
        const userDeck = room.users[userId].deck;
        const deck = userDeck || (0, card_1.getRandomCardIds)(40);
        puppetMaster.setDeck(deck);
        return puppetMaster;
    });
    const game = new Game_1.default(gameId, [...puppetMasters]);
    return game;
};
exports.createGame = createGame;
const createAndStartGame = (userId) => {
    const game = (0, exports.createGame)(userId);
    (0, exports.startGame)(game);
};
exports.createAndStartGame = createAndStartGame;
const start = (userId) => {
    const { room, game: existingGame } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !!existingGame) {
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
const editCardNotes = (userId, params) => {
    const { room, game } = (0, exports.getGameAndRoomUserIsIn)(userId);
    if (!room || !game) {
        return;
    }
    const userIsInRoom = room.users[userId];
    if (!userIsInRoom) {
        return;
    }
    const { cardUuid, notes } = params;
    const card = game.findCard(cardUuid);
    if (!card) {
        return;
    }
    card.notes = notes;
    game.addLog({
        event: "edit-card-notes",
        sourceUserId: userId,
        card: cardUuid,
    });
    (0, exports.updateGame)(game);
};
exports.editCardNotes = editCardNotes;
//# sourceMappingURL=game.js.map