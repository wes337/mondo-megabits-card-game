import Card, { CardType } from "./Card";

export type InformationSubType = "Actually Useful" | "Cosmology";

class Information extends Card {
  type: CardType;
  subType: InformationSubType;
  cost: number;

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Information";
    this.subType = subType;
    this.cost = 0;
    this.tapped = tapped;
    this.faceDown = faceDown;
  }
}

export default Information;
