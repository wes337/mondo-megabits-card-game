import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type GroupSubType = "Zaibatsu" | "Faction";

class Group extends Card {
  type: CardType;
  subType: GroupSubType;
  cost: number;
  attachedTo?: Creature;

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Group";
    this.subType = subType;
    this.cost = 3;
    this.tapped = tapped;
    this.faceDown = faceDown;
  }
}

export default Group;
