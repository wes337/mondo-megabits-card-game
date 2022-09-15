import Card, { CardType } from "./Card";

export type ChallengeSubType = "Tutorial Mission" | "";

class Challenge extends Card {
  type: CardType;
  subType: ChallengeSubType;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Challenge";
    this.subType = subType;
    this.cost = cost;
  }
}

export default Challenge;
