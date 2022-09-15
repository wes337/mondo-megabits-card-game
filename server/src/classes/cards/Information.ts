import Card, { CardType } from "./Card";

export type InformationSubType = "Actually Useful" | "Cosmology";

class Information extends Card {
  type: CardType;
  subType: InformationSubType;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Information";
    this.subType = subType;
    this.cost = cost;
  }
}

export default Information;
