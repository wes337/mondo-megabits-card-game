import Card, { CARD_TYPE } from "./Card";

export const CREATURE_SUBTYPE = {
  FIGUREHEAD: "Figurehead",
  FOOTSOLDIER: "Footsoldier",
  LACKEY: "Lackey",
  NEMESIS: "Nemesis",
  PISSANT: "Pissant",
  DOUBLE_AGENT: "Double Agent",
  BAD_ACTOR: "Bad Actor",
  PATSY: "Patsy",
  REVOLUTIONARY: "Revolutionary",
} as const;

const creatureSubtypes = Object.values(CREATURE_SUBTYPE);
export type CreatureSubtype = typeof creatureSubtypes[number];

export class Creature extends Card {
  subtype: CreatureSubtype;
  stats: {
    HP: number;
    STR: number;
    INT: number;
    FYT: number;
    NRG: number;
    SWG: number;
    PSI: number;
  };

  constructor(id, name, owner, bodyText, faction, rarity, subtype, stats) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.CREATURE;
    this.subtype = subtype;
    this.stats = stats;
    this.cost = 2 + Math.floor(this.rarity / 2);
  }
}

export default Creature;
