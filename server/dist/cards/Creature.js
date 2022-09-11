"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Creature extends Card_1.default {
    constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType, stats) {
        super(id, name, tapped, faceDown, bodyText, faction, rarity);
        this.type = "Creature";
        this.subType = subType;
        this.stats = stats;
        this.cost = 2 + Math.floor(rarity / 2);
        this.tapped = false;
        this.faceDown = false;
    }
}
exports.default = Creature;
//# sourceMappingURL=Creature.js.map