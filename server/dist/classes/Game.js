"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_ZONE = void 0;
const constants_1 = require("./constants");
exports.GAME_ZONE = {
    LOOK_HAND: "look-hand",
    STOWED_HAND: "stowed-hand",
    DECK: "deck",
    DISCARD_PILE: "discard-pile",
    THE_THINK_TANK: "the-think-tank",
    ACTIVE_ZONE: "active-zone",
    LOCATION: "location",
};
const gameZones = Object.values(exports.GAME_ZONE);
class Game {
    constructor(id, puppetMasters) {
        this.id = id;
        this.puppetMasters = puppetMasters;
        this.location = undefined;
        this.challenges = [];
        this.turn = {
            number: 0,
            player: puppetMasters[0].id,
        };
        this.log = [];
    }
    addLog(log) {
        this.log.push({
            turn: this.turn.number,
            date: new Date().toLocaleTimeString("en-US"),
            event: log.event,
            sourceUserId: log.sourceUserId,
            targetUserId: log.targetUserId,
            card: log.card,
        });
    }
    nextTurn() {
        const number = this.turn.number + 1;
        this.turn = {
            number,
            player: (this.puppetMasters[number % 2 !== 0 ? 0 : 1] || this.puppetMasters[0]).id,
        };
    }
    endTurn() {
        const puppetMaster = this.turn.player
            ? this.getPlayer(this.turn.player)
            : null;
        if (!puppetMaster) {
            return;
        }
        puppetMaster.discardHand();
        puppetMaster.funding = Math.min(puppetMaster.funding + constants_1.FUNDING_GAINED_PER_TURN, constants_1.MAX_FUNDING);
        this.nextTurn();
        const isInitialDeployment = !((this.puppetMasters.length === 1 && this.turn.number >= 2) ||
            this.turn.number > 2);
        if (isInitialDeployment) {
            return;
        }
        const nextPuppetMaster = this.getPlayer(this.turn.player);
        if (nextPuppetMaster) {
            nextPuppetMaster.drawCards(constants_1.CARDS_DRAWN_PER_TURN);
        }
    }
    isPlayersTurn(userId) {
        return this.turn.player === userId;
    }
    start() {
        const gameHasAlreadyStarted = this.turn.number > 0;
        if (gameHasAlreadyStarted) {
            return;
        }
        this.puppetMasters.sort(() => {
            return 0.5 - Math.random();
        });
        this.nextTurn();
        this.puppetMasters.forEach((puppetMaster, index) => {
            puppetMaster.shuffleDeck();
            const numberOfCardsToDraw = index === 0
                ? constants_1.INITIAL_HAND_SIZE.PLAYER_ONE
                : constants_1.INITIAL_HAND_SIZE.PLAYER_TWO;
            puppetMaster.drawCards(numberOfCardsToDraw);
        });
    }
    addPlayer(puppetMaster) {
        this.puppetMasters.push(puppetMaster);
    }
    getPlayer(userId) {
        const puppetMaster = this.puppetMasters.find(({ id }) => id === userId);
        return puppetMaster;
    }
    play(userId, cardUuid, destination) {
        const isAllowedToPlayCard = this.isPlayersTurn(userId);
        if (!isAllowedToPlayCard) {
            return;
        }
        const puppetMaster = this.getPlayer(userId);
        if (!puppetMaster) {
            return;
        }
        const cardWasPlayed = puppetMaster.playCard(cardUuid, destination);
        if (!cardWasPlayed) {
            return;
        }
        if (destination === exports.GAME_ZONE.LOCATION) {
            if (this.location) {
                const otherPuppetMaster = this.puppetMasters.find(({ id }) => id !== userId);
                otherPuppetMaster === null || otherPuppetMaster === void 0 ? void 0 : otherPuppetMaster.moveCard(this.location.uuid, exports.GAME_ZONE.DISCARD_PILE);
            }
            this.location = puppetMaster.location;
        }
        this.addLog({
            event: "play-card",
            sourceUserId: puppetMaster.id,
            card: cardUuid,
        });
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map