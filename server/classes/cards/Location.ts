import Card, { CardType } from "./Card";

export type LocationSubType = "Real Estate" | "Realm" | "Zone";

class Location extends Card {
  type: CardType;
  subType: LocationSubType;
  cost: number;

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Location";
    this.subType = subType;
    this.cost = 0;
    this.tapped = tapped;
    this.faceDown = faceDown;
  }
}

export default Location;
