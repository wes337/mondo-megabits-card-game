import Card, { CardType } from "./Card";
import Creature from "./Creature";

export type ItemSubType =
  | "Ammo"
  | "Armor"
  | "Bric-à-Brac"
  | "ChromeWare"
  | "Crafting Material"
  | "Drug"
  | "Food/Trash"
  | "Gimmick"
  | "Product and/or Service We Do Enjoy™"
  | "Relic"
  | "Tool"
  | "Weapon";

class Item extends Card {
  type: CardType;
  subType: ItemSubType;
  attachedTo?: Creature;

  constructor(id, name, bodyText, faction, rarity, cost, subType) {
    super(id, name, bodyText, faction, rarity, cost);
    this.type = "Item";
    this.subType = subType;
    this.cost = cost;
    this.attachedTo = undefined;
  }
}

export default Item;
