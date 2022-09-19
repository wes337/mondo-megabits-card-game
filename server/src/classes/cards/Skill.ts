import Card, { CARD_TYPE } from "./Card";
import Creature from "./Creature";

export const SKILL_SUBTYPE = {
  MAGIC_ARTS: "Magic Arts",
  SPY_ARTS: "Spy Arts",
  TECH_STEAMPUNK_ARTS: "Tech/Steampunk Arts",
  TELEPORTATION_TELEPRANKS: "Teleportation/Telepranks",
} as const;

const skillSubtypes = Object.values(SKILL_SUBTYPE);
export type SkillSubtype = typeof skillSubtypes[number];

class Skill extends Card {
  subtype: SkillSubtype;
  attachedTo?: Creature;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.SKILL;
    this.subtype = subtype;
    this.cost = 1;
    this.attachedTo = undefined;
  }
}

export default Skill;
