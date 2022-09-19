import Card, { CARD_TYPE } from "./Card";

export const INFORMATION_SUBTYPE = {
  ACTUALLY_USEFUL: "Actually Useful",
  COSMOLOGY: "Cosmology",
} as const;

const informationSubtypes = Object.values(INFORMATION_SUBTYPE);
export type InformationSubtype = typeof informationSubtypes[number];

class Information extends Card {
  subtype: InformationSubtype;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.INFORMATION;
    this.subtype = subtype;
    this.cost = 0;
  }
}

export default Information;
