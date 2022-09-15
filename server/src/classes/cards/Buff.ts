import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type BuffSubType =
  | "Enhancement"
  | "Feather-in-Cap"
  | "Power-Up"
  | "X-Factor";

class Buff extends Card {
  type: CardType;
  subType: BuffSubType;
  attachedTo?: Creature;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Buff";
    this.subType = subType;
    this.cost = cost;
    this.attachedTo = undefined;
  }
}

export default Buff;
