import { generateKey } from "../../utils";
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

export type CardType =
  | "Creature"
  | "Item"
  | "Location"
  | "Tactic"
  | "Agenda"
  | "Plot Twist"
  | "Buff"
  | "Information"
  | "Challenge"
  | "Skill"
  | "Group";

export type Deck = Array<
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
  | Tactic
>;

class Card {
  uuid: string;
  id: number;
  name: string;
  bodyText: string;
  faction: string;
  rarity: number;
  tapped: boolean;

  constructor(id, name, bodyText, faction, rarity) {
    this.uuid = generateKey();
    this.id = id;
    this.name = name;
    this.faction = faction;
    this.rarity = rarity;
    this.tapped = false;
    this.bodyText = bodyText;
  }
}

export default Card;
