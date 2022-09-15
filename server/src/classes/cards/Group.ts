import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type GroupSubType = "Zaibatsu" | "Faction";

class Group extends Card {
  type: CardType;
  subType: GroupSubType;
  attachedTo?: Creature;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Group";
    this.subType = subType;
    this.cost = 3;
  }
}

export default Group;
