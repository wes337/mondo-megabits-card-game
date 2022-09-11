"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
class Item extends Card_1.default {
    constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
        super(id, name, tapped, faceDown, bodyText, faction, rarity);
        this.type = "Item";
        this.subType = subType;
        this.cost = 2;
        this.attachedTo = undefined;
        this.tapped = tapped;
        this.faceDown = faceDown;
    }
}
exports.default = Item;
//# sourceMappingURL=Item.js.map