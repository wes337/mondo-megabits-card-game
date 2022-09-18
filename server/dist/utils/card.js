"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomDeck = exports.getRandomCardsByType = exports.getRandomCards = void 0;
const cards_1 = require("../classes/cards");
const data_1 = require("../data");
const getRandomCards = (amount) => {
    const shuffledCards = [...data_1.allCards].sort(() => {
        return 0.5 - Math.random();
    });
    return shuffledCards.slice(0, amount);
};
exports.getRandomCards = getRandomCards;
const getRandomCardsByType = (amount, type) => {
    const cards = data_1.allCards.filter((card) => card.type === type);
    const shuffledCards = [...cards].sort(() => {
        return 0.5 - Math.random();
    });
    return shuffledCards.slice(0, amount);
};
exports.getRandomCardsByType = getRandomCardsByType;
const createRandomDeck = (deckSize = 40) => {
    const randomCards = (0, exports.getRandomCards)(deckSize);
    const deck = [];
    randomCards.forEach((card) => {
        switch (card.type) {
            case "Creature": {
                deck.push(new cards_1.Creature(card.id, card.name, card.bodyText, card.faction, card.rarity, 2 + Math.floor(card.rarity / 2), card.subtype, card.stats));
                break;
            }
            case "Challenge": {
                deck.push(new cards_1.Challenge(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Buff": {
                deck.push(new cards_1.Buff(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            case "Group": {
                deck.push(new cards_1.Group(card.id, card.name, card.bodyText, card.faction, 3, card.rarity, card.subtype));
                break;
            }
            case "Information": {
                deck.push(new cards_1.Information(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Item": {
                deck.push(new cards_1.Item(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            case "Location": {
                deck.push(new cards_1.Location(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Plot Twist": {
                deck.push(new cards_1.PlotTwist(card.id, card.name, card.bodyText, card.faction, card.rarity, 0, card.subtype));
                break;
            }
            case "Skill": {
                deck.push(new cards_1.Skill(card.id, card.name, card.bodyText, card.faction, card.rarity, 1, card.subtype));
                break;
            }
            case "Tactic": {
                deck.push(new cards_1.Tactic(card.id, card.name, card.bodyText, card.faction, card.rarity, 2, card.subtype));
                break;
            }
            default: {
                break;
            }
        }
    });
    return deck;
};
exports.createRandomDeck = createRandomDeck;
//# sourceMappingURL=card.js.map