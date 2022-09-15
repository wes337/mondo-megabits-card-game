"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../utils/string");
const constants_1 = require("./constants");
class PuppetMaster {
    constructor(userId) {
        this.id = userId;
        this.narrative = 0;
        this.funding = constants_1.MAX_FUNDING;
        this.hand = {
            look: [],
            stowed: [],
        };
        this.deck = [];
        this.discardPile = [];
        this.board = {
            theThinkTank: [],
            bufferZone: [],
            battleZone: [],
        };
    }
    isDeckValid(cards) {
        const cardCounts = cards.reduce((counts, card) => {
            counts[card.id] = ++counts[card.id] || 1;
            return counts;
        }, {});
        const cardsExceedingLimit = Object.values(cardCounts).filter((count) => count > constants_1.MAX_COPIES_OF_CARD_PER_DECK);
        return cardsExceedingLimit.length === 0;
    }
    setDeck(cards) {
        const isValidDeck = this.isDeckValid(cards);
        if (!isValidDeck) {
            console.log("=== INVALID DECK !!! ===");
            return;
        }
        this.deck = cards;
    }
    getZone(zoneName) {
        if (zoneName === "look-hand") {
            return this.hand.look;
        }
        if (zoneName === "stowed-hand") {
            return this.hand.stowed;
        }
        if (["deck", "discard-pile"].includes(zoneName)) {
            return this[(0, string_1.hyphenToCamelCase)(zoneName)];
        }
        return this.board[(0, string_1.hyphenToCamelCase)(zoneName)];
    }
    shuffleDeck() {
        this.deck.sort(() => {
            return 0.5 - Math.random();
        });
    }
    drawCards(amount) {
        const draw = Math.min(this.deck.length, amount);
        const cards = this.deck.splice(0, draw);
        if (this.deck.length === 0) {
            this.deck.push(...this.discardPile);
            this.shuffleDeck();
            this.discardPile = [];
        }
        const remaining = amount - cards.length;
        if (remaining > 0) {
            cards.push(...this.deck.splice(0, remaining));
        }
        this.hand.look.push(...cards);
    }
    tapCard(cardUuid) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
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
        card.tapped = !card.tapped;
    }
    moveCard(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return;
        }
        const newZone = this.getZone(destination);
        newZone.push(card);
        const oldZone = this.getZone(location);
        const cardIndex = oldZone.findIndex((card) => card.uuid === cardUuid);
        oldZone.splice(cardIndex, 1);
    }
    discardHand() {
        this.discardPile.push(...this.hand.look);
        this.hand.look = [];
    }
    playCard(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return;
        }
        const cost = destination === "stowed-hand" ? constants_1.STOW_CARD_FUNDING_COST : card.cost;
        const cantAfford = this.funding - cost < 0;
        if (cantAfford) {
            return;
        }
        this.funding = this.funding - cost;
        this.moveCard(cardUuid, destination);
    }
    findCardByUuid(cardUuid) {
        const cardInLookHand = this.hand.look.find(({ uuid }) => uuid === cardUuid);
        if (cardInLookHand) {
            return {
                card: cardInLookHand,
                location: "look-hand",
            };
        }
        const cardInStowedHand = this.hand.stowed.find(({ uuid }) => uuid === cardUuid);
        if (cardInStowedHand) {
            return {
                card: cardInStowedHand,
                location: "stowed-hand",
            };
        }
        const cardInDiscardPile = this.discardPile.find(({ uuid }) => uuid === cardUuid);
        if (cardInDiscardPile) {
            return {
                card: cardInDiscardPile,
                location: "discard-pile",
            };
        }
        const cardInDeck = this.deck.find(({ uuid }) => uuid === cardUuid);
        if (cardInDeck) {
            return {
                card: cardInDeck,
                location: "deck",
            };
        }
        const cardInBattleZone = this.board.battleZone.find(({ uuid }) => uuid === cardUuid);
        if (cardInBattleZone) {
            return {
                card: cardInBattleZone,
                location: "battle-zone",
            };
        }
        const cardInBufferZone = this.board.bufferZone.find(({ uuid }) => uuid === cardUuid);
        if (cardInBufferZone) {
            return {
                card: cardInBufferZone,
                location: "buffer-zone",
            };
        }
        const cardInTheThinkTank = this.board.theThinkTank.find(({ uuid }) => uuid === cardUuid);
        if (cardInTheThinkTank) {
            return {
                card: cardInTheThinkTank,
                location: "the-think-tank",
            };
        }
        return null;
    }
}
exports.default = PuppetMaster;
//# sourceMappingURL=PuppetMaster.js.map