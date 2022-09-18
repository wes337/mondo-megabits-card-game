"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../functions/card");
const string_1 = require("../utils/string");
const cards_1 = require("./cards");
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
        this.location = undefined;
    }
    getCardCount(key = "id") {
        const cardCounts = this.deck.reduce((counts, card) => {
            const cardKey = card[key];
            counts[cardKey] = ++counts[cardKey] || 1;
            return counts;
        }, {});
        return cardCounts;
    }
    setDeck(cardIds) {
        cardIds.forEach((cardId) => {
            this.addCard(cardId);
        });
    }
    getZone(zoneName) {
        if (zoneName === "look-hand") {
            return this.hand.look;
        }
        if (zoneName === "stowed-hand") {
            return this.hand.stowed;
        }
        if (["deck", "discard-pile", "location"].includes(zoneName)) {
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
            return false;
        }
        const { card, location } = cardAndLocation;
        const cardIsOnBoard = [
            "battle-zone",
            "the-think-tank",
            "buffer-zone",
        ].includes(location);
        if (!cardIsOnBoard) {
            return false;
        }
        card.tapped = !card.tapped;
        return true;
    }
    moveCard(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return false;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return false;
        }
        if (destination === "location") {
            this.location = card;
        }
        else {
            const newZone = this.getZone(destination);
            newZone.push(card);
        }
        if (location === "location") {
            this.location = undefined;
        }
        else {
            const oldZone = this.getZone(location);
            const cardIndex = oldZone.findIndex((card) => card.uuid === cardUuid);
            oldZone.splice(cardIndex, 1);
        }
        return true;
    }
    discardHand() {
        this.discardPile.push(...this.hand.look);
        this.hand.look = [];
    }
    playCard(cardUuid, destination) {
        const cardAndLocation = this.findCardByUuid(cardUuid);
        if (!cardAndLocation) {
            return false;
        }
        const { card, location } = cardAndLocation;
        if (location === destination) {
            return false;
        }
        const cost = destination === "stowed-hand" ? constants_1.STOW_CARD_FUNDING_COST : card.cost;
        const cantAfford = this.funding - cost < 0;
        if (cantAfford) {
            return false;
        }
        if (destination === "location" && card.type !== "Location") {
            return false;
        }
        this.funding = this.funding - cost;
        const cardMoved = this.moveCard(cardUuid, destination);
        return cardMoved;
    }
    findCardByUuid(cardUuid) {
        var _a;
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
        const cardInLocation = ((_a = this.location) === null || _a === void 0 ? void 0 : _a.uuid) === cardUuid ? this.location : null;
        if (cardInLocation) {
            return {
                card: cardInLocation,
                location: "location",
            };
        }
        return null;
    }
    addCard(cardId) {
        const cardCounts = this.getCardCount();
        if (cardCounts[cardId] > constants_1.MAX_COPIES_OF_CARD_PER_DECK) {
            return false;
        }
        const card = (0, card_1.getCardById)(cardId);
        if (!card) {
            return false;
        }
        switch (card.type) {
            case "Creature": {
                this.deck.push(new cards_1.Creature(card.id, card.name, card.bodyText, card.faction, card.rarity, 2 + Math.floor(card.rarity / 2), card.subtype, card.stats));
                break;
            }
            case "Challenge": {
                this.deck.push(new cards_1.Challenge(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Buff": {
                this.deck.push(new cards_1.Buff(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            case "Group": {
                this.deck.push(new cards_1.Group(card.id, card.name, card.bodyText, card.faction, 3, card.rarity, card.subtype));
                break;
            }
            case "Information": {
                this.deck.push(new cards_1.Information(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Item": {
                this.deck.push(new cards_1.Item(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            case "Location": {
                this.deck.push(new cards_1.Location(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Plot Twist": {
                this.deck.push(new cards_1.PlotTwist(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Skill": {
                this.deck.push(new cards_1.Skill(card.id, card.name, card.bodyText, card.faction, card.rarity, 1, card.subtype));
                break;
            }
            case "Tactic": {
                this.deck.push(new cards_1.Tactic(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            default: {
                break;
            }
        }
        return true;
    }
}
exports.default = PuppetMaster;
//# sourceMappingURL=PuppetMaster.js.map