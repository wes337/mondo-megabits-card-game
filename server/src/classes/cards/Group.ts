import Card, { CARD_TYPE } from "./Card";
import Creature from "./Creature";

export const GROUP_SUBTYPE = {
  ZAIBATSU: "Zaibatsu",
  FACTION: "Faction",
};

const groupSubtypes = Object.values(GROUP_SUBTYPE);
export type GroupSubtype = typeof groupSubtypes[number];

class Group extends Card {
  subtype: GroupSubtype;
  attachedTo?: Creature;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.GROUP;
    this.subtype = subtype;
    this.cost = 3;
  }
}

export default Group;
