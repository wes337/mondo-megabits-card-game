import Card, { CardType } from "./Card";

export type LocationSubType = "Real Estate" | "Realm" | "Zone";

class Location extends Card {
  type: CardType;
  subType: LocationSubType;
  cost: number;

  constructor(id, name, faction, rarity, subType) {
    super(id, name, faction, rarity);
    this.type = "Location";
    this.subType = subType;
    this.cost = 0;
  }
}

export default Location;
