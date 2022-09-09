import Card, { CardType } from "./Card";

export type TacticSubType = "Ability" | "Bailout" | "Scam" | "Security Measure";

class Tactic extends Card {
  type: CardType;
  subType: TacticSubType;
  cost: number;

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Tactic";
    this.subType = subType;
    this.cost = 2;
    this.tapped = tapped;
    this.faceDown = faceDown;
  }
}

export default Tactic;
