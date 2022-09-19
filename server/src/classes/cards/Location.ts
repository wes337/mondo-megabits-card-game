import Card, { CARD_TYPE } from "./Card";

export const LOCATION_SUBTYPE = {
  REAL_ESTATE: "Real Estate",
  REALM: "Realm",
  ZONE: "Zone",
} as const;

const locationSubtypes = Object.values(LOCATION_SUBTYPE);
export type LocationSubtype = typeof locationSubtypes[number];

class Location extends Card {
  subtype: LocationSubtype;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.LOCATION;
    this.subtype = subtype;
    this.cost = 0;
  }
}

export default Location;
