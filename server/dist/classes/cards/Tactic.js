"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TACTIC_SUBTYPE = void 0;
const Card_1 = __importStar(require("./Card"));
exports.TACTIC_SUBTYPE = {
    ABILITY: "Ability",
    BAILOUT: "Bailout",
    SCAM: "Scam",
    SECURITY_MEASURE: "Security Measure",
};
const tacticSubtypes = Object.values(exports.TACTIC_SUBTYPE);
class Tactic extends Card_1.default {
    constructor(id, name, owner, bodyText, faction, rarity, subtype) {
        super(id, name, owner, bodyText, faction, rarity);
        this.type = Card_1.CARD_TYPE.TACTIC;
        this.subtype = subtype;
        this.cost = 2;
    }
}
exports.default = Tactic;
//# sourceMappingURL=Tactic.js.map