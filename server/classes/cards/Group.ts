import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type GroupSubType = "Zaibatsu" | "Faction";

class Group extends Card {
  type: CardType;
  subType: GroupSubType;
  cost: number;
  attachedTo?: Creature;

  constructor(id, name, faction, rarity, subType) {
    super(id, name, faction, rarity);
    this.type = "Group";
    this.subType = subType;
    this.cost = 3;
  }
}

export default Group;
