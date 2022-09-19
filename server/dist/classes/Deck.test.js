"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../utils/card");
const Deck_1 = __importDefault(require("./Deck"));
describe("Deck", () => {
    it("should give count of card types", () => {
        const deck = new Deck_1.default("Test");
        const threeRandomCreatures = (0, card_1.getRandomCardsByType)(3, "Creature");
        const threeRandomItems = (0, card_1.getRandomCardsByType)(3, "Item");
        [...threeRandomCreatures, ...threeRandomItems].forEach((card) => {
            deck.addCard(card.id);
        });
        expect(deck.getCardCount("type")).toMatchObject({
            Creature: 3,
            Item: 3,
        });
    });
    it("should invalidate deck if there is too many of one card", () => {
        const deck = new Deck_1.default("Test");
        const cardId = "1";
        for (let i = 0; i < 3; i++) {
            deck.addCard(cardId);
        }
        expect(deck.valid).toBe(false);
    });
});
//# sourceMappingURL=Deck.test.js.map