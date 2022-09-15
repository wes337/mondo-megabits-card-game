import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type SkillSubType =
  | "Magic Arts"
  | "Spy Arts"
  | "Tech/Steampunk Arts"
  | "Teleportation/Telepranks";

class Skill extends Card {
  type: CardType;
  subType: SkillSubType;
  attachedTo?: Creature;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Skill";
    this.subType = subType;
    this.cost = cost;
    this.attachedTo = undefined;
  }
}

export default Skill;
