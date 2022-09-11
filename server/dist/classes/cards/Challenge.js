"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Challenge extends Card_1.default {
    constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
        super(id, name, tapped, faceDown, bodyText, faction, rarity);
        this.type = "Challenge";
        this.subType = subType;
        this.cost = 0;
        this.tapped = tapped;
        this.faceDown = faceDown;
    }
}
exports.default = Challenge;
//# sourceMappingURL=Challenge.js.map