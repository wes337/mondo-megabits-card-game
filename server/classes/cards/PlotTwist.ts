import Card, { CardType } from "./Card";

export type PlotTwistSubType = "Paradigm Shift" | "";

class PlotTwist extends Card {
  type: CardType;
  subType: PlotTwistSubType;
  cost: number;

  constructor(id, name, bodyText, faction, rarity, subType) {
    super(id, name, bodyText, faction, rarity);
    this.type = "Plot Twist";
    this.subType = subType;
    this.cost = 0;
  }
}

export default PlotTwist;
