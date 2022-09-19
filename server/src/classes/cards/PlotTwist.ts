import Card, { CARD_TYPE } from "./Card";

export const PLOT_TWIST_SUBTYPE = {
  PARADIGM_SHIFT: "Paradigm Shift",
} as const;

const plotTwistSubtypes = Object.values(PLOT_TWIST_SUBTYPE);
export type PlotTwistSubtype = typeof plotTwistSubtypes[number];

class PlotTwist extends Card {
  subtype: PlotTwistSubtype;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.PLOT_TWIST;
    this.subtype = subtype;
    this.cost = 0;
  }
}

export default PlotTwist;
