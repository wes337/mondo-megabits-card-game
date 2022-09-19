import Card, { CARD_TYPE } from "./Card";

export const TACTIC_SUBTYPE = {
  ABILITY: "Ability",
  BAILOUT: "Bailout",
  SCAM: "Scam",
  SECURITY_MEASURE: "Security Measure",
} as const;

const tacticSubtypes = Object.values(TACTIC_SUBTYPE);
export type TacticSubtype = typeof tacticSubtypes[number];

class Tactic extends Card {
  subtype: TacticSubtype;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.TACTIC;
    this.subtype = subtype;
    this.cost = 2;
  }
}

export default Tactic;
