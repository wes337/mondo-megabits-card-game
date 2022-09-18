"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../utils/string");
const card_1 = require("../functions/card");
const cards_1 = require("./cards");
const constants_1 = require("./constants");
class Deck {
    constructor(name, cards = []) {
        this.id = (0, string_1.generateKey)();
        this.name = name;
        this.cards = cards;
    }
    getCardCount(key = "id") {
        const cardCounts = this.cards.reduce((counts, card) => {
            const cardKey = card[key];
            counts[cardKey] = ++counts[cardKey] || 1;
            return counts;
        }, {});
        return cardCounts;
    }
    get valid() {
        const cardCounts = this.getCardCount();
        const cardsExceedingLimit = Object.values(cardCounts).filter((count) => count > constants_1.MAX_COPIES_OF_CARD_PER_DECK);
        return cardsExceedingLimit.length === 0;
    }
    shuffle() {
        this.cards.sort(() => {
            return 0.5 - Math.random();
        });
    }
    addCard(cardId) {
        const cardCounts = this.getCardCount();
        if (cardCounts[cardId] > constants_1.MAX_COPIES_OF_CARD_PER_DECK) {
            return;
        }
        const card = (0, card_1.getCardById)(cardId);
        if (!card) {
            return;
        }
        switch (card.type) {
            case "Creature": {
                this.cards.push(new cards_1.Creature(card.id, card.name, card.bodyText, card.faction, card.rarity, 2 + Math.floor(card.rarity / 2), card.subtype, card.stats));
                break;
            }
            case "Challenge": {
                this.cards.push(new cards_1.Challenge(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Buff": {
                this.cards.push(new cards_1.Buff(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            case "Group": {
                this.cards.push(new cards_1.Group(card.id, card.name, card.bodyText, card.faction, 3, card.rarity, card.subtype));
                break;
            }
            case "Information": {
                this.cards.push(new cards_1.Information(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Item": {
                this.cards.push(new cards_1.Item(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            case "Location": {
                this.cards.push(new cards_1.Location(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Plot Twist": {
                this.cards.push(new cards_1.PlotTwist(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Skill": {
                this.cards.push(new cards_1.Skill(card.id, card.name, card.bodyText, card.faction, card.rarity, 1, card.subtype));
                break;
            }
            case "Tactic": {
                this.cards.push(new cards_1.Tactic(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            default: {
                break;
            }
        }
    }
    removeCard(cardUuid) {
        const cardIndex = this.cards.findIndex(({ uuid }) => cardUuid === uuid);
        if (!cardIndex) {
            return;
        }
        this.cards.splice(cardIndex, 1);
    }
}
exports.default = Deck;
//# sourceMappingURL=Deck.js.map