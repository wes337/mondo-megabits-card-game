"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_ZONE = void 0;
const constants_1 = require("./constants");
const Card_1 = require("./cards/Card");
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
    findCard(cardUuid) {
        let card;
        this.puppetMasters.forEach((puppetMaster) => {
            const cardAndLocation = puppetMaster.findCardByUuid(cardUuid);
            if (cardAndLocation) {
                card = cardAndLocation.card;
                return card;
            }
        });
        return card;
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
            nextPuppetMaster.untapAllCards();
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
        const puppetMaster = this.getPlayer(userId);
        if (!puppetMaster) {
            return;
        }
        const isAllowedToPlayCard = this.isPlayersTurn(userId);
        if (!isAllowedToPlayCard) {
            puppetMaster.sendMessage("You can only play this card during your turn.");
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
    attack(userId, attackerUuid, defenderUuid) {
        const puppetMaster = this.getPlayer(userId);
        const defendingPuppetMaster = this.puppetMasters.find(({ id }) => id !== userId);
        if (!puppetMaster || !defendingPuppetMaster) {
            return;
        }
        const isAllowedToPlayCard = this.isPlayersTurn(userId);
        if (!isAllowedToPlayCard) {
            return;
        }
        const attackingCardAndLocation = puppetMaster.findCardByUuid(attackerUuid);
        const defendingCardAndLocation = defendingPuppetMaster.findCardByUuid(defenderUuid);
        if (!attackingCardAndLocation || !defendingCardAndLocation) {
            return;
        }
        const attacker = attackingCardAndLocation.card;
        const attackerLocation = attackingCardAndLocation.location;
        if (attackerLocation !== exports.GAME_ZONE.ACTIVE_ZONE &&
            attackerLocation !== exports.GAME_ZONE.THE_THINK_TANK) {
            return;
        }
        const defender = defendingCardAndLocation.card;
        const defenderLocation = defendingCardAndLocation.location;
        if (!attacker.canAttack()) {
            puppetMaster.sendMessage("This creature cannot attack anymore this turn.");
            return;
        }
        const defendingPlayerHasCreaturesInActiveZone = defendingPuppetMaster.activeZone &&
            defendingPuppetMaster.activeZone.filter((card) => card.type === Card_1.CARD_TYPE.CREATURE).length > 0;
        if (defenderLocation === exports.GAME_ZONE.THE_THINK_TANK &&
            defendingPlayerHasCreaturesInActiveZone) {
            puppetMaster.sendMessage("You cannot attack the Figurehead while there are still creatures in the defending player's active zone.");
            return;
        }
        const damage = attacker.attackDamage;
        defender.stats.HP -= damage;
        attacker.attacks++;
        if (defender.stats.HP <= 0) {
            defendingPuppetMaster.moveCard(defenderUuid, exports.GAME_ZONE.DISCARD_PILE);
        }
        this.addLog({
            event: "attack-card",
            sourceUserId: puppetMaster.id,
            targetUserId: defendingPuppetMaster.id,
        });
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map