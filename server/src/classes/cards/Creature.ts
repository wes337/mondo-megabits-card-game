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
  stats: {
    HP: number;
    STR: number;
    INT: number;
    FYT: number;
    NRG: number;
    SWG: number;
    PSI: number;
  };

  constructor(id, name, bodyText, faction, rarity, cost, subType, stats) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Creature";
    this.subType = subType;
    this.stats = stats;
    this.cost = cost;
  }
}

export default Creature;
