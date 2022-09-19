import { generateKey } from "../utils/string";
import { getCardById } from "../functions/card";
import {
  Buff,
  Card,
  Challenge,
  Creature,
  Group,
  Information,
  Item,
  PlotTwist,
  Skill,
  Tactic,
  Location,
} from "./cards";
import { CardType } from "./cards/Card";
import { MAX_COPIES_OF_CARD_PER_DECK } from "./constants";

class Deck {
  id: string;
  name: string;
  cards: Card[];

  constructor(name, cards = []) {
    this.id = generateKey();
    this.name = name;
    this.cards = cards;
  }

  getCardCount(key = "id"): {
    [value: string]: number;
  } {
    const cardCounts = this.cards.reduce((counts, card) => {
      const cardKey = card[key];
      counts[cardKey] = ++counts[cardKey] || 1;
      return counts;
    }, {});

    return cardCounts;
  }

  get valid(): boolean {
    if (this.cards.length < 40) {
      return false;
    }

    const cardCounts = this.getCardCount();

    const cardsExceedingLimit = Object.values(cardCounts).filter(
      (count) => count > MAX_COPIES_OF_CARD_PER_DECK
    );

    return cardsExceedingLimit.length === 0;
  }

  shuffle(): void {
    this.cards.sort(() => {
      return 0.5 - Math.random();
    });
  }

  addCard(cardId: string | number): void {
    const cardCounts = this.getCardCount();
    if (cardCounts[cardId] > MAX_COPIES_OF_CARD_PER_DECK) {
      return;
    }

    const card = getCardById(cardId);

    if (!card) {
      return;
    }

    switch (card.type as CardType) {
      case "Creature": {
        this.cards.push(
          new Creature(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype,
            card.stats
          )
        );
        break;
      }
      case "Challenge": {
        this.cards.push(
          new Challenge(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Buff": {
        this.cards.push(
          new Buff(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Group": {
        this.cards.push(
          new Group(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Information": {
        this.cards.push(
          new Information(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Item": {
        this.cards.push(
          new Item(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Location": {
        this.cards.push(
          new Location(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Plot Twist": {
        this.cards.push(
          new PlotTwist(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Skill": {
        this.cards.push(
          new Skill(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Tactic": {
        this.cards.push(
          new Tactic(
            card.id,
            card.name,
            undefined,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  removeCard(cardUuid: string): void {
    const cardIndex = this.cards.findIndex(({ uuid }) => cardUuid === uuid);

    if (!cardIndex) {
      return;
    }

    this.cards.splice(cardIndex, 1);
  }
}

export default Deck;
