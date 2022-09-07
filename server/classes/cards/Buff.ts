import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type BuffSubType =
  | "Enhancement"
  | "Feather-in-Cap"
  | "Power-Up"
  | "X-Factor";

class Buff extends Card {
  type: CardType;
  cost: number;
  subType: BuffSubType;
  attachedTo?: Creature;

  constructor(id, name, faction, rarity, subType) {
    super(id, name, faction, rarity);
    this.type = "Buff";
    this.subType = subType;
    this.cost = 2;
    this.attachedTo = undefined;
  }
}

export default Buff;
