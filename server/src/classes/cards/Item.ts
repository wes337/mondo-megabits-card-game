import Card, { CARD_TYPE } from "./Card";
import Creature from "./Creature";

export const ITEM_SUBTYPE = {
  AMMO: "Ammo",
  ARMOR: "Armor",
  BRIC_A_BRAC: "Bric-à-Brac",
  CHROMEWARE: "ChromeWare",
  CRAFTING_MATERIAL: "Crafting Material",
  DRUG: "Drug",
  FOOD_TRASH: "Food/Trash",
  GIMMICK: "Gimmick",
  PRODUCT: "Product and/or Service We Do Enjoy™",
  RELIC: "Relic",
  TOOL: "Tool",
  WEAPON: "Weapon",
} as const;

const itemSubtypes = Object.values(ITEM_SUBTYPE);
export type ItemSubtype = typeof itemSubtypes[number];

class Item extends Card {
  subtype: ItemSubtype;
  attachedTo?: Creature;

  constructor(id, name, owner, bodyText, faction, rarity, subtype) {
    super(id, name, owner, bodyText, faction, rarity);
    this.type = CARD_TYPE.ITEM;
    this.subtype = subtype;
    this.cost = 2;
    this.attachedTo = undefined;
  }
}

export default Item;
