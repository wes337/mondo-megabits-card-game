import Card, { CardType } from "./Card";

export type InformationSubType = "Actually Useful" | "Cosmology";

class Information extends Card {
  type: CardType;
  subType: InformationSubType;
  cost: number;

  constructor(id, name, faction, rarity, subType) {
    super(id, name, faction, rarity);
    this.type = "Information";
    this.subType = subType;
    this.cost = 0;
  }
}

export default Information;
