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

export type CardLocation =
  | "hand"
  | "deck"
  | "discard-pile"
  | "the-think-tank"
  | "buffer-zone"
  | "battle-zone";

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

  constructor(id, name, tapped, faceDown, bodyText, faction, rarity) {
    this.uuid = generateKey();
    this.id = id;
    this.name = name;
    this.faction = faction;
    this.rarity = rarity;
    this.tapped = tapped;
    this.bodyText = bodyText;
    this.faceDown = faceDown;
  }
}

export default Card;
