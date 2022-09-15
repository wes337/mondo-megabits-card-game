"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardImageById = exports.getCardImage = void 0;
const data_1 = require("../data");
const getCardImage = (card) => {
    return `https://mondomegabits.com/card/img/95/${card.fileStem}.jpg`;
};
exports.getCardImage = getCardImage;
const getCardImageById = (cardId) => {
    const card = data_1.allCards.find((card) => card.id.toString() === cardId.toString());
    return (0, exports.getCardImage)(card);
};
exports.getCardImageById = getCardImageById;
//# sourceMappingURL=card.js.map