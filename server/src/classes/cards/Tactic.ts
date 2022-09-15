import Card, { CardType } from "./Card";

export type TacticSubType = "Ability" | "Bailout" | "Scam" | "Security Measure";

class Tactic extends Card {
  type: CardType;
  subType: TacticSubType;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Tactic";
    this.subType = subType;
    this.cost = cost;
  }
}

export default Tactic;
