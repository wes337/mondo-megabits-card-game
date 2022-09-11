"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Tactic extends Card_1.default {
    constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
        super(id, name, tapped, faceDown, bodyText, faction, rarity);
        this.type = "Tactic";
        this.subType = subType;
        this.cost = 2;
        this.tapped = tapped;
        this.faceDown = faceDown;
    }
}
exports.default = Tactic;
//# sourceMappingURL=Tactic.js.map