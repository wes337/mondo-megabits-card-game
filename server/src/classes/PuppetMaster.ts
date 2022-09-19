import { getCardById } from "../functions/card";
import { hyphenToCamelCase } from "../utils/string";
import {
  Creature,
  Challenge,
  Buff,
  Group,
  Information,
  Item,
  PlotTwist,
  Skill,
  Tactic,
  Location,
} from "./cards";
import Card, { CardType, CARD_TYPE } from "./cards/Card";
import {
  MAX_COPIES_OF_CARD_PER_DECK,
  MAX_FUNDING,
  STOW_CARD_FUNDING_COST,
} from "./constants";
import { GameZone, GAME_ZONE } from "./Game";

class PuppetMaster {
  id: string;
  narrative: number;
  deck: Card[];
  discardPile: Card[];
  lookHand: Card[];
  stowedHand: Card[];
  activeZone: Card[];
  theThinkTank?: Creature;
  location?: Location;
  funding: number; // max of 20, restored at 4 per turn (after first turn)

  constructor(userId: string) {
    this.id = userId;
    this.narrative = 0; // -5 loses, 5 wins. Cost 10 funding for +1
    this.funding = MAX_FUNDING; // Max 20
    this.lookHand = [];
    this.stowedHand = [];
    this.deck = [];
    this.discardPile = [];
    this.theThinkTank = undefined;
    this.activeZone = [];
    this.location = undefined;
  }

  getCardCount(key = "id"): {
    [value: string]: number;
  } {
    const cardCounts = this.deck.reduce((counts, card) => {
      const cardKey = card[key];
      counts[cardKey] = ++counts[cardKey] || 1;
      return counts;
    }, {});

    return cardCounts;
  }

  setDeck(cardIds: string[]) {
    cardIds.forEach((cardId) => {
      this.addCard(cardId);
    });
  }

  shuffleDeck() {
    this.deck.sort(() => {
      return 0.5 - Math.random();
    });
  }

  drawCards(amount: number) {
    // Draw as many as we can from amount until deck is empty
    const draw = Math.min(this.deck.length, amount);
    const cards = this.deck.splice(0, draw);

    // If deck is empty after drawing,
    // shuffle discard pile back into deck
    if (this.deck.length === 0) {
      this.deck.push(...this.discardPile);
      this.shuffleDeck();
      this.discardPile = [];
    }

    // Draw any remaining cards
    const remaining = amount - cards.length;
    if (remaining > 0) {
      cards.push(...this.deck.splice(0, remaining));
    }

    this.lookHand.push(...cards);
  }

  tapCard(cardUuid: string): boolean {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return false;
    }

    const { card, location } = cardAndLocation;

    const cardIsOnBoard =
      location === GAME_ZONE.ACTIVE_ZONE ||
      location === GAME_ZONE.THE_THINK_TANK;

    if (!cardIsOnBoard) {
      return false;
    }

    card.tapped = !card.tapped;
    return true;
  }

  moveCard(cardUuid: string, destination: GameZone): boolean {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return false;
    }

    const { card, location } = cardAndLocation;

    // Card is already in requested destination
    if (location === destination) {
      return false;
    }

    // Add card to new location
    const newZone = hyphenToCamelCase(destination);
    if (Array.isArray(this[newZone])) {
      this[newZone].push(card);
    } else {
      this[newZone] = card;
    }

    // Remove card from old location
    const oldZone = hyphenToCamelCase(location);
    if (Array.isArray(this[oldZone])) {
      const cardIndex = this[oldZone].findIndex(
        (card) => card.uuid === cardUuid
      );
      this[oldZone].splice(cardIndex, 1);
    } else {
      this[oldZone] = undefined;
    }

    return true;
  }

  discardHand() {
    this.discardPile.push(...this.lookHand);
    this.lookHand = [];
  }

  playCard(cardUuid: string, destination: GameZone): boolean {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return false;
    }

    const { card, location } = cardAndLocation;

    // Card is already in requested destination
    if (location === destination) {
      return false;
    }

    // Check if user can pay for card
    const cost =
      destination === GAME_ZONE.STOWED_HAND
        ? STOW_CARD_FUNDING_COST
        : card.cost;
    const cantAfford = this.funding - cost < 0;

    if (cantAfford) {
      return false;
    }

    // Check if card type can be played to zone
    if (
      destination === GAME_ZONE.LOCATION &&
      card.type !== CARD_TYPE.LOCATION
    ) {
      return false;
    }

    this.funding = this.funding - cost;
    const cardMoved = this.moveCard(cardUuid, destination);
    return cardMoved;
  }

  findCardByUuid(cardUuid: string): {
    card: Card;
    location: GameZone;
  } | null {
    const cardInLookHand = this.lookHand.find(({ uuid }) => uuid === cardUuid);
    if (cardInLookHand) {
      return {
        card: cardInLookHand,
        location: GAME_ZONE.LOOK_HAND,
      };
    }

    const cardInStowedHand = this.stowedHand.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInStowedHand) {
      return {
        card: cardInStowedHand,
        location: GAME_ZONE.STOWED_HAND,
      };
    }

    const cardInDiscardPile = this.discardPile.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInDiscardPile) {
      return {
        card: cardInDiscardPile,
        location: GAME_ZONE.DISCARD_PILE,
      };
    }

    const cardInDeck = this.deck.find(({ uuid }) => uuid === cardUuid);
    if (cardInDeck) {
      return {
        card: cardInDeck,
        location: GAME_ZONE.DECK,
      };
    }

    const cardInActiveZone = this.activeZone.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInActiveZone) {
      return {
        card: cardInActiveZone,
        location: GAME_ZONE.ACTIVE_ZONE,
      };
    }

    const cardInTheThinkTank =
      this.theThinkTank?.uuid === cardUuid ? this.theThinkTank : null;

    if (cardInTheThinkTank) {
      return {
        card: cardInTheThinkTank,
        location: GAME_ZONE.THE_THINK_TANK,
      };
    }

    const cardInLocation =
      this.location?.uuid === cardUuid ? this.location : null;
    if (cardInLocation) {
      return {
        card: cardInLocation,
        location: GAME_ZONE.LOCATION,
      };
    }

    return null;
  }

  addCard(cardId: string | number): boolean {
    const cardCounts = this.getCardCount();
    if (cardCounts[cardId] > MAX_COPIES_OF_CARD_PER_DECK) {
      return false;
    }

    const card = getCardById(cardId);

    if (!card) {
      return false;
    }

    switch (card.type as CardType) {
      case CARD_TYPE.CREATURE: {
        this.deck.push(
          new Creature(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype,
            card.stats
          )
        );
        break;
      }
      case CARD_TYPE.CHALLENGE: {
        this.deck.push(
          new Challenge(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.BUFF: {
        this.deck.push(
          new Buff(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.GROUP: {
        this.deck.push(
          new Group(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.INFORMATION: {
        this.deck.push(
          new Information(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.ITEM: {
        this.deck.push(
          new Item(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.LOCATION: {
        this.deck.push(
          new Location(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.PLOT_TWIST: {
        this.deck.push(
          new PlotTwist(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.SKILL: {
        this.deck.push(
          new Skill(
            card.id,
            card.name,
            this.id,
            card.bodyText,
            card.faction,
            card.rarity,
            card.subtype
          )
        );
        break;
      }
      case CARD_TYPE.TACTIC: {
        this.deck.push(
          new Tactic(
            card.id,
            card.name,
            this.id,
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

    return true;
  }
}

export default PuppetMaster;
