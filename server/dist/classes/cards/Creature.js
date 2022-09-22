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
exports.Creature = exports.CREATURE_SUBTYPE = void 0;
const Card_1 = __importStar(require("./Card"));
exports.CREATURE_SUBTYPE = {
    FIGUREHEAD: "Figurehead",
    FOOTSOLDIER: "Footsoldier",
    LACKEY: "Lackey",
    NEMESIS: "Nemesis",
    PISSANT: "Pissant",
    DOUBLE_AGENT: "Double Agent",
    BAD_ACTOR: "Bad Actor",
    PATSY: "Patsy",
    REVOLUTIONARY: "Revolutionary",
};
const creatureSubtypes = Object.values(exports.CREATURE_SUBTYPE);
class Creature extends Card_1.default {
    constructor(id, name, owner, bodyText, faction, rarity, subtype, stats) {
        super(id, name, owner, bodyText, faction, rarity);
        this.type = Card_1.CARD_TYPE.CREATURE;
        this.subtype = subtype;
        this.stats = stats;
        this.cost = 2 + Math.floor(this.rarity / 2);
        this.attacks = 0;
        this.abilities = 0;
    }
    get attackDamage() {
        return this.stats.STR * 100;
    }
    get maxAttacks() {
        return 1 + Math.floor(this.stats.FYT / 5);
    }
    get maxAbilities() {
        return 1 + Math.floor(this.stats.NRG / 5);
    }
    attack() {
        this.attacks++;
    }
    useAbility() {
        this.abilities++;
    }
    canAttack() {
        if (this.abilities === 0 || this.stats.SWG >= 5) {
            return this.attacks < this.maxAttacks;
        }
        return false;
    }
    resetAttacksAndAbilities() {
        this.attacks = 0;
        this.abilities = 0;
    }
}
exports.Creature = Creature;
exports.default = Creature;
//# sourceMappingURL=Creature.js.map