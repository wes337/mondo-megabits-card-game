"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
class Card {
    constructor(id, name, tapped, faceDown, bodyText, faction, rarity) {
        this.uuid = (0, utils_1.generateKey)();
        this.id = id;
        this.name = name;
        this.faction = faction;
        this.rarity = rarity;
        this.tapped = tapped;
        this.bodyText = bodyText;
        this.faceDown = faceDown;
    }
}
exports.default = Card;
//# sourceMappingURL=Card.js.map