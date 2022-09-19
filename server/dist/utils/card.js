"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomCardsByType = exports.getRandomCardIds = exports.getRandomCards = exports.allBasicCards = void 0;
const data_1 = require("../data");
exports.allBasicCards = data_1.allCards.filter((card) => !card.fileStem.includes("a"));
const getRandomCards = (amount) => {
    const shuffledCards = [...exports.allBasicCards].sort(() => {
        return 0.5 - Math.random();
    });
    return shuffledCards.slice(0, amount);
};
exports.getRandomCards = getRandomCards;
const getRandomCardIds = (amount) => {
    const randomCards = (0, exports.getRandomCards)(amount);
    return randomCards.map((card) => card.id.toString());
};
exports.getRandomCardIds = getRandomCardIds;
const getRandomCardsByType = (amount, type) => {
    const cards = exports.allBasicCards.filter((card) => card.type === type);
    const shuffledCards = [...cards].sort(() => {
        return 0.5 - Math.random();
    });
    return shuffledCards.slice(0, amount);
};
exports.getRandomCardsByType = getRandomCardsByType;
//# sourceMappingURL=card.js.map