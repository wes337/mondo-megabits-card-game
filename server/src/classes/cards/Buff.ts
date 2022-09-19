import Card, { CARD_TYPE } from "./Card";
import Creature from "./Creature";

export const BUFF_SUBTYPE = {
  ENHANCEMENT: "Enhancement",
  FEATHER_IN_CAP: "Feather-in-Cap",
  POWER_UP: "Power-Up",
  X_FACTOR: "X-Factor",
} as const;

const buffSubtypes = Object.values(BUFF_SUBTYPE);
export type BuffSubtype = typeof buffSubtypes[number];

class Buff extends Card {
  subtype: BuffSubtype;
  attachedTo?: Creature;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.BUFF;
    this.subtype = subtype;
    this.attachedTo = undefined;
    this.cost = 2;
  }
}

export default Buff;
