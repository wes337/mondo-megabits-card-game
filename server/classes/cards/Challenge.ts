import Card, { CardType } from "./Card";

export type ChallengeSubType = "Tutorial Mission" | "";

class Challenge extends Card {
  type: CardType;
  cost: number;
  subType: ChallengeSubType;

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity, subType) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Challenge";
    this.subType = subType;
    this.cost = 0;
    this.tapped = tapped;
    this.faceDown = faceDown;
  }
}

export default Challenge;
