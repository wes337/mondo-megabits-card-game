"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Creature extends Card_1.default {
    constructor(id, name, bodyText, faction, rarity, cost, subType, stats) {
        super(id, name, bodyText, faction, rarity, cost);
        this.type = "Creature";
        this.subType = subType;
        this.stats = stats;
        this.cost = cost;
    }
}
exports.default = Creature;
//# sourceMappingURL=Creature.js.map