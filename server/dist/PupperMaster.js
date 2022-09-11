"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class PuppetMaster {
    constructor(userId) {
        this.id = userId;
        this.narrative = 0;
        this.funding = 20;
        this.hand = [];
        this.deck = [];
        this.discardPile = [];
        this.board = {
            theThinkTank: [],
            bufferZone: [],
            battleZone: [],
        };
    }
    setDeck(cards) {
        this.deck = cards;
    }
    shuffleDeck() {
        this.deck.sort(() => {
            return 0.5 - Math.random();
        });
    }
    drawCards(amount) {
        const cards = this.deck.splice(0, amount);
        this.hand.push(...cards);
    }
    tap(cardUuid) {
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
    move(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return;
        }
        if (["deck", "discard-pile", "hand"].includes(destination)) {
            const newCardPile = (0, utils_1.hyphenToCamelCase)(destination);
            this[newCardPile].push(card);
        }
        const oldCardPile = (0, utils_1.hyphenToCamelCase)(location);
        const cardIsInHandOrDeck = ["deck", "discard-pile", "hand"].includes(location);
        if (cardIsInHandOrDeck) {
            const cardIndex = this[oldCardPile].findIndex((card) => card.uuid === cardUuid);
            this[oldCardPile].splice(cardIndex, 1);
        }
        else {
            const cardIndex = this.board[oldCardPile].findIndex((card) => card.uuid === cardUuid);
            this.board[oldCardPile].splice(cardIndex, 1);
        }
    }
    play(cardUuid, destination) {
        const cardIndex = this.hand.findIndex((card) => card.uuid === cardUuid);
        const card = this.hand[cardIndex];
        this.funding = this.funding - card.cost;
        this.hand.splice(cardIndex, 1);
        switch (destination) {
            case "the-think-tank":
                this.board.theThinkTank.push(card);
                break;
            case "buffer-zone":
                card.faceDown = true;
                this.board.bufferZone.push(card);
                break;
            case "battle-zone":
                this.board.battleZone.push(card);
                break;
            default:
                break;
        }
    }
    findCardByUuid(cardUuid) {
        const cardInHand = this.hand.find(({ uuid }) => uuid === cardUuid);
        if (cardInHand) {
            return {
                card: cardInHand,
                location: "hand",
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
//# sourceMappingURL=PupperMaster.js.map