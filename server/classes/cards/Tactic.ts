import Card, { CardType } from "./Card";

export type TacticSubType = "Ability" | "Bailout" | "Scam" | "Security Measure";

class Tactic extends Card {
  type: CardType;
  subType: TacticSubType;
  cost: number;

  constructor(id, name, bodyText, faction, rarity, subType) {
    super(id, name, bodyText, faction, rarity);
    this.type = "Tactic";
    this.subType = subType;
    this.cost = 2;
  }
}

export default Tactic;
