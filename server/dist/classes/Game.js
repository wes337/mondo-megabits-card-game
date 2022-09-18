"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
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
            player: (this.puppetMasters[number % 2 === 0 ? 0 : 1] || this.puppetMasters[0]).id,
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
        this.nextTurn();
        const isInitialDeployment = !((this.puppetMasters.length === 1 && this.turn.number >= 2) ||
            this.turn.number > 2);
        if (isInitialDeployment) {
            return;
        }
        const nextPuppetMaster = this.getPlayer(this.turn.player);
        if (nextPuppetMaster) {
            nextPuppetMaster.drawCards(constants_1.CARDS_DRAWN_PER_TURN);
            nextPuppetMaster.funding = Math.min(nextPuppetMaster.funding + constants_1.FUNDING_GAINED_PER_TURN, constants_1.MAX_FUNDING);
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
}
exports.default = Game;
//# sourceMappingURL=Game.js.map