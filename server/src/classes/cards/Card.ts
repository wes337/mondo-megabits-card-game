import { generateKey } from "../../utils/string";

export const CARD_TYPE = {
  CREATURE: "Creature",
  ITEM: "Item",
  LOCATION: "Location",
  TACTIC: "Tactic",
  AGENDA: "Agenda",
  PLOT_TWIST: "Plot Twist",
  BUFF: "Buff",
  INFORMATION: "Information",
  CHALLENGE: "Challenge",
  SKILL: "Skill",
  GROUP: "Group",
} as const;

const cardTypes = Object.values(CARD_TYPE);
export type CardType = typeof cardTypes[number];

class Card {
  uuid: string;
  id: number;
  owner: string;
  name: string;
  bodyText: string;
  faction: string;
  rarity: number;
  type?: CardType;
  subtype?: string;
  faceDown: boolean;
  tapped: boolean;
  cost: number;
  attachedTo?: Card;

  constructor(id, name, owner, bodyText, faction, rarity) {
    this.uuid = generateKey();
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.bodyText = bodyText;
    this.faction = faction;
    this.rarity = rarity;
    this.faceDown = false;
    this.tapped = false;
  }
}

export default Card;
