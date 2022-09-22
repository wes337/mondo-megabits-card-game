"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_TYPE = void 0;
const string_1 = require("../../utils/string");
exports.CARD_TYPE = {
    CREATURE: "Creature",
    ITEM: "Item",
    LOCATION: "Location",
    TACTIC: "Tactic",
    AGENDA: "Agenda",
    PLOT_TWIST: "Plot Twist",
    BUFF: "Buff",
    INFORMATION: "Information",
    CHALLENGE: "Challenge",
    SKILL: "Skill",
    GROUP: "Group",
};
const cardTypes = Object.values(exports.CARD_TYPE);
class Card {
    constructor(id, name, owner, bodyText, faction, rarity) {
        this.uuid = (0, string_1.generateKey)();
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.bodyText = bodyText;
        this.faction = faction;
        this.rarity = rarity;
        this.faceDown = false;
        this.tapped = false;
        this.notes = "";
    }
}
exports.default = Card;
//# sourceMappingURL=Card.js.map