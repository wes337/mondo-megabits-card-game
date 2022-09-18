import { generateKey } from "../../utils/string";
import Buff from "./Buff";
import Challenge from "./Challenge";
import Creature from "./Creature";
import Group from "./Group";
import Information from "./Information";
import Item from "./Item";
import Location from "./Location";
import PlotTwist from "./PlotTwist";
import Skill from "./Skill";
import Tactic from "./Tactic";

export const cardTypes = [
  "Creature",
  "Item",
  "Location",
  "Tactic",
  "Agenda",
  "Plot Twist",
  "Buff",
  "Information",
  "Challenge",
  "Skill",
  "Group",
] as const;

export type CardType = typeof cardTypes[number];

export type AnyCard =
  | Card
  | Creature
  | Buff
  | Challenge
  | Group
  | Information
  | Item
  | Location
  | PlotTwist
  | Skill
  | Tactic;

export type Deck = Array<AnyCard>;

class Card {
  uuid: string;
  id: number;
  name: string;
  bodyText: string;
  faction: string;
  rarity: number;
  tapped: boolean;
  faceDown: boolean;
  cost: number;

  constructor(id, name, bodyText, faction, rarity, cost) {
    this.uuid = generateKey();
    this.id = id;
    this.name = name;
    this.faction = faction;
    this.rarity = rarity;
    this.bodyText = bodyText;
    this.faceDown = false;
    this.tapped = false;
    this.cost = cost;
  }
}

export default Card;
