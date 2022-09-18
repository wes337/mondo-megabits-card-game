import {
  Buff,
  Challenge,
  Creature,
  Group,
  Information,
  Item,
  Location,
  PlotTwist,
  Skill,
  Tactic,
} from "../classes/cards";
import { CardType, Deck } from "../classes/cards/Card";
import { allCards } from "../data";

export const getRandomCards = (amount: number) => {
  const shuffledCards = [...allCards].sort(() => {
    return 0.5 - Math.random();
  });

  return shuffledCards.slice(0, amount);
};

export const getRandomCardsByType = (amount: number, type: CardType) => {
  const cards = allCards.filter((card) => card.type === type);

  const shuffledCards = [...cards].sort(() => {
    return 0.5 - Math.random();
  });

  return shuffledCards.slice(0, amount);
};

export const createRandomDeck = (deckSize = 40): Deck => {
  const randomCards = getRandomCards(deckSize);
  const deck: Deck = [];
  randomCards.forEach((card) => {
    switch (card.type as CardType) {
      case "Creature": {
        deck.push(
          new Creature(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            2 + Math.floor(card.rarity / 2),
            card.subtype,
            card.stats
          )
        );
        break;
      }
      case "Challenge": {
        deck.push(
          new Challenge(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            0,
            card.subtype
          )
        );
        break;
      }
      case "Buff": {
        deck.push(
          new Buff(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            2,
            card.subtype
          )
        );
        break;
      }
      case "Group": {
        deck.push(
          new Group(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            3,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case "Information": {
        deck.push(
          new Information(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            0,
            card.subtype
          )
        );
        break;
      }
      case "Item": {
        deck.push(
          new Item(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            2,
            card.subtype
          )
        );
        break;
      }
      case "Location": {
        deck.push(
          new Location(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            0,
            card.subtype
          )
        );
        break;
      }
      case "Plot Twist": {
        deck.push(
          new PlotTwist(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            0,
            card.subtype
          )
        );
        break;
      }
      case "Skill": {
        deck.push(
          new Skill(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            1,
            card.subtype
          )
        );
        break;
      }
      case "Tactic": {
        deck.push(
          new Tactic(
            card.id,
            card.name,
            card.bodyText,
            card.faction,
            card.rarity,
            2,
            card.subtype
          )
        );
        break;
      }
      default: {
        break;
      }
    }
  });

  return deck;
};
