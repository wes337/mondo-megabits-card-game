import Card, { CardType } from "./Card";

export type ChallengeSubType = "Tutorial Mission" | "";

class Challenge extends Card {
  type: CardType;
  cost: number;
  subType: ChallengeSubType;

  constructor(id, name, faction, rarity, subType) {
    super(id, name, faction, rarity);
    this.type = "Challenge";
    this.subType = subType;
    this.cost = 0;
  }
}

export default Challenge;
