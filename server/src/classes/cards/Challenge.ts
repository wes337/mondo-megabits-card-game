import Card, { CARD_TYPE } from "./Card";

export const CHALLENGE_SUBTYPE = {
  TUTORIAL_MISSION: "Tutorial Mission",
} as const;

const challengeSubtypes = Object.values(CHALLENGE_SUBTYPE);
export type ChallengeSubtype = typeof challengeSubtypes[number];

class Challenge extends Card {
  subtype: ChallengeSubtype;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.CHALLENGE;
    this.subtype = subtype;
    this.cost = 0;
  }
}

export default Challenge;
