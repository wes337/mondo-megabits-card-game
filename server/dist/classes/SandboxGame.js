"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_ZONE = void 0;
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
class SandboxGame {
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
            movedFrom: log.movedFrom,
            movedTo: log.movedTo,
            amount: log.amount,
        });
    }
    findCardAndLocation(cardUuid) {
        let cardAndLocation;
        this.puppetMasters.forEach((puppetMaster) => {
            const foundCardAndLocation = puppetMaster.findCardByUuid(cardUuid);
            if (foundCardAndLocation) {
                cardAndLocation = Object.assign(Object.assign({}, foundCardAndLocation), { owner: puppetMaster });
                return cardAndLocation;
            }
        });
        return cardAndLocation;
    }
    moveCard(userId, cardUuid, destination) {
        var _a;
        const puppetMaster = this.getPlayer(userId);
        if (!puppetMaster) {
            return;
        }
        const cardAndLocation = this.findCardAndLocation(cardUuid);
        if (!cardAndLocation) {
            return;
        }
        const cardMoved = (_a = cardAndLocation.owner) === null || _a === void 0 ? void 0 : _a.moveCard(cardUuid, destination);
        if (!cardMoved) {
            return;
        }
        if (destination === exports.GAME_ZONE.LOCATION) {
            if (this.location) {
                this.moveCard(userId, this.location.uuid, exports.GAME_ZONE.DISCARD_PILE);
            }
            this.location = cardAndLocation.card;
        }
        this.addLog({
            event: "move-card",
            sourceUserId: userId,
            card: cardAndLocation === null || cardAndLocation === void 0 ? void 0 : cardAndLocation.card,
            movedFrom: cardAndLocation === null || cardAndLocation === void 0 ? void 0 : cardAndLocation.location,
            movedTo: destination,
        });
    }
    tapCard(userId, cardUuid) {
        const cardAndLocation = this.findCardAndLocation(cardUuid);
        if (!cardAndLocation) {
            return;
        }
        cardAndLocation.card.tapped = !cardAndLocation.card.tapped;
        this.addLog({
            event: "tap-card",
            sourceUserId: userId,
            card: cardAndLocation === null || cardAndLocation === void 0 ? void 0 : cardAndLocation.card,
        });
    }
    flipCard(userId, cardUuid) {
        const cardAndLocation = this.findCardAndLocation(cardUuid);
        if (!cardAndLocation) {
            return;
        }
        cardAndLocation.card.faceDown = !cardAndLocation.card.faceDown;
        this.addLog({
            event: "flip-card",
            sourceUserId: userId,
            card: cardAndLocation === null || cardAndLocation === void 0 ? void 0 : cardAndLocation.card,
        });
    }
    shuffleDeck(userId) {
        const puppetMaster = this.getPlayer(userId);
        if (!puppetMaster) {
            return;
        }
        puppetMaster.shuffleDeck();
        this.addLog({
            event: "shuffle-deck",
            sourceUserId: userId,
        });
    }
    drawCards(userId, amount) {
        const puppetMaster = this.getPlayer(userId);
        if (!puppetMaster) {
            return;
        }
        const draw = Math.min(puppetMaster.deck.length, amount);
        const cards = puppetMaster.deck.splice(0, draw);
        if (cards.length === 0) {
            return;
        }
        puppetMaster.lookHand.push(...cards);
        this.addLog({
            event: "draw-cards",
            sourceUserId: userId,
            amount: cards.length,
        });
    }
    setNarrative(userId, targetUserId, narrative) {
        const puppetMaster = this.getPlayer(userId);
        const targetPuppetMaster = this.getPlayer(targetUserId);
        if (!puppetMaster || !targetPuppetMaster) {
            return;
        }
        targetPuppetMaster.narrative = narrative;
        this.addLog({
            event: "set-narrative",
            sourceUserId: userId,
            targetUserId,
            amount: narrative,
        });
    }
    setFunding(userId, targetUserId, funding) {
        const puppetMaster = this.getPlayer(userId);
        const targetPuppetMaster = this.getPlayer(targetUserId);
        if (!puppetMaster || !targetPuppetMaster) {
            return;
        }
        targetPuppetMaster.funding = funding;
        this.addLog({
            event: "set-funding",
            sourceUserId: userId,
            targetUserId,
            amount: funding,
        });
    }
    nextTurn() {
        const number = this.turn.number + 1;
        const nextPlayerId = (this.puppetMasters[number % 2 !== 0 ? 0 : 1] || this.puppetMasters[0]).id;
        this.addLog({
            event: "end-turn",
            sourceUserId: this.turn.player,
            targetUserId: nextPlayerId,
        });
        this.turn = {
            number,
            player: nextPlayerId,
        };
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
    }
    getPlayer(userId) {
        const puppetMaster = this.puppetMasters.find(({ id }) => id === userId);
        return puppetMaster;
    }
    untapAllCards(userId) {
        const puppetMaster = this.getPlayer(userId);
        if (!puppetMaster) {
            return;
        }
        puppetMaster.untapAllCards();
        this.addLog({
            event: "untap-all-cards",
            sourceUserId: userId,
        });
    }
}
exports.default = SandboxGame;
//# sourceMappingURL=SandboxGame.js.map