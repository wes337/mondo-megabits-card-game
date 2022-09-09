import Card, { CardType } from "./Card";

export type PlotTwistSubType = "Paradigm Shift" | "";

class PlotTwist extends Card {
  type: CardType;
  subType: PlotTwistSubType;
  cost: number;

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Plot Twist";
    this.subType = subType;
    this.cost = 0;
    this.tapped = tapped;
    this.faceDown = faceDown;
  }
}

export default PlotTwist;
