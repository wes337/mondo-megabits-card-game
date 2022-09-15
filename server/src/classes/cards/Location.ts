import Card, { CardType } from "./Card";

export type LocationSubType = "Real Estate" | "Realm" | "Zone";

class Location extends Card {
  type: CardType;
  subType: LocationSubType;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Location";
    this.subType = subType;
    this.cost = cost;
  }
}

export default Location;
