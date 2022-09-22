import Card, { CARD_TYPE } from "./Card";

export const CREATURE_SUBTYPE = {
  FIGUREHEAD: "Figurehead",
  FOOTSOLDIER: "Footsoldier",
  LACKEY: "Lackey",
  NEMESIS: "Nemesis",
  PISSANT: "Pissant",
  DOUBLE_AGENT: "Double Agent",
  BAD_ACTOR: "Bad Actor",
  PATSY: "Patsy",
  REVOLUTIONARY: "Revolutionary",
} as const;

const creatureSubtypes = Object.values(CREATURE_SUBTYPE);
export type CreatureSubtype = typeof creatureSubtypes[number];

export class Creature extends Card {
  subtype: CreatureSubtype;
  stats: {
    HP: number;
    STR: number;
    INT: number;
    FYT: number;
    NRG: number;
    SWG: number;
    PSI: number;
  };
  attacks: 0;
  abilities: 0;

  constructor(id, name, owner, bodyText, faction, rarity, subtype, stats) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.CREATURE;
    this.subtype = subtype;
    this.stats = stats;
    this.cost = 2 + Math.floor(this.rarity / 2);
    this.attacks = 0;
    this.abilities = 0;
  }

  get attackDamage(): number {
    return this.stats.STR * 100;
  }

  get maxAttacks(): number {
    return 1 + Math.floor(this.stats.FYT / 5);
  }

  get maxAbilities(): number {
    return 1 + Math.floor(this.stats.NRG / 5);
  }

  attack(): void {
    this.attacks++;
  }

  useAbility(): void {
    this.abilities++;
  }

  canAttack(): boolean {
    if (this.abilities === 0 || this.stats.SWG >= 5) {
      return this.attacks < this.maxAttacks;
    }
    return false;
  }

  resetAttacksAndAbilities(): void {
    this.attacks = 0;
    this.abilities = 0;
  }
}

export default Creature;
