"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardTypes = void 0;
const string_1 = require("../../utils/string");
exports.cardTypes = [
    "Creature",
    "Item",
    "Location",
    "Tactic",
    "Agenda",
    "Plot Twist",
    "Buff",
    "Information",
    "Challenge",
    "Skill",
    "Group",
];
class Card {
    constructor(id, name, bodyText, faction, rarity, cost) {
        this.uuid = (0, string_1.generateKey)();
        this.id = id;
        this.name = name;
        this.faction = faction;
        this.rarity = rarity;
        this.bodyText = bodyText;
        this.faceDown = false;
        this.tapped = false;
        this.cost = cost;
    }
}
exports.default = Card;
//# sourceMappingURL=Card.js.map