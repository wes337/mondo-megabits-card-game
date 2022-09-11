import Card, { CardType } from "./Card";

export type CreatureSubType =
  | "Figurehead"
  | "Footsoldier"
  | "Lackey"
  | "Nemesis"
  | "Pissant"
  | "Double Agent"
  | "Bad Actor"
  | "Patsy"
  | "Revolutionary";

class Creature extends Card {
  type: CardType;
  subType: CreatureSubType;
  cost: number;
  stats: {
    HP: number;
    STR: number;
    INT: number;
    FYT: number;
    NRG: number;
    SWG: number;
    PSI: number;
  };

  constructor(
    id,
    name,
    tapped,
    faceDown,
    bodyText,
    faction,
    rarity,
    subType,
    stats
  ) {
    super(id, name, tapped, faceDown, bodyText, faction, rarity);
    this.type = "Creature";
    this.subType = subType;
    this.stats = stats;
    this.cost = 2 + Math.floor(rarity / 2);
    this.tapped = false;
    this.faceDown = false;
  }
}

export default Creature;
