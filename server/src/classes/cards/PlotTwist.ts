import Card, { CardType } from "./Card";

export type PlotTwistSubType = "Paradigm Shift" | "";

class PlotTwist extends Card {
  type: CardType;
  subType: PlotTwistSubType;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Plot Twist";
    this.subType = subType;
    this.cost = cost;
  }
}

export default PlotTwist;
