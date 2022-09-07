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
  cost: number;
  attachedTo?: Creature;

  constructor(id, name, faction, rarity, subType) {
    super(id, name, faction, rarity);
    this.type = "Skill";
    this.subType = subType;
    this.cost = 1;
    this.attachedTo = undefined;
  }
}

export default Skill;
