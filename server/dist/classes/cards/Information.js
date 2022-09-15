"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Information extends Card_1.default {
    constructor(id, name, bodyText, faction, rarity, cost, subType) {
        super(id, name, bodyText, faction, rarity, cost);
        this.type = "Information";
        this.subType = subType;
        this.cost = cost;
    }
}
exports.default = Information;
//# sourceMappingURL=Information.js.map