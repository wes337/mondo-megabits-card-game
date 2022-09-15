"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Buff extends Card_1.default {
    constructor(id, name, bodyText, faction, rarity, cost, subType) {
        super(id, name, bodyText, faction, rarity, cost);
        this.type = "Buff";
        this.subType = subType;
        this.cost = cost;
        this.attachedTo = undefined;
    }
}
exports.default = Buff;
//# sourceMappingURL=Buff.js.map