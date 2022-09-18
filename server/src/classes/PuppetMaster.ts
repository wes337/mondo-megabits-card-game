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
import Card, { AnyCard, CardType } from "./cards/Card";
import {
  MAX_COPIES_OF_CARD_PER_DECK,
  MAX_FUNDING,
  STOW_CARD_FUNDING_COST,
} from "./constants";
import { GameZone } from "./Game";

class PuppetMaster {
  id: string;
  narrative: number;
  deck: Card[];
  discardPile: Card[];
  hand: {
    look: Card[];
    stowed: Card[];
  };
  board: {
    // closest to the puppet master, cards can be played at any time
    // do not untap, unless funded
    theThinkTank: Card[];
    bufferZone: Card[]; // facedown 1 tactic, 1 creature (patsy double|agent|bad actor), 1 challenge. played all at once when front lines breached, all discarded after played
    battleZone: Card[]; // all active cards go here
  };
  location?: Location;
  funding: number; // max of 20, restored at 4 per turn (after first turn)

  constructor(userId: string) {
    this.id = userId;
    this.narrative = 0; // -5 loses, 5 wins. Cost 10 funding for +1
    this.funding = MAX_FUNDING; // Max 20
    this.hand = {
      look: [],
      stowed: [],
    };
    this.deck = [];
    this.discardPile = [];
    this.board = {
      theThinkTank: [], // Agenda, figurehead, and incantation only
      bufferZone: [], // Tactic, creature, challenge only
      battleZone: [],
    };
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

  getZone(zoneName: GameZone): Card[] {
    if (zoneName === "look-hand") {
      return this.hand.look;
    }

    if (zoneName === "stowed-hand") {
      return this.hand.stowed;
    }

    if (["deck", "discard-pile", "location"].includes(zoneName)) {
      return this[hyphenToCamelCase(zoneName)];
    }

    return this.board[hyphenToCamelCase(zoneName)];
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

    this.hand.look.push(...cards);
  }

  tapCard(cardUuid: string): boolean {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return false;
    }

    const { card, location } = cardAndLocation;

    const cardIsOnBoard = [
      "battle-zone",
      "the-think-tank",
      "buffer-zone",
    ].includes(location);
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

    // Move card to new location
    if (destination === "location") {
      this.location = card as Location;
    } else {
      const newZone = this.getZone(destination);
      newZone.push(card);
    }

    // Remove card from old location
    if (location === "location") {
      this.location = undefined;
    } else {
      const oldZone = this.getZone(location);
      const cardIndex = oldZone.findIndex((card) => card.uuid === cardUuid);
      oldZone.splice(cardIndex, 1);
    }
    return true;
  }

  discardHand() {
    this.discardPile.push(...this.hand.look);
    this.hand.look = [];
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
      destination === "stowed-hand" ? STOW_CARD_FUNDING_COST : card.cost;
    const cantAfford = this.funding - cost < 0;

    if (cantAfford) {
      return false;
    }

    if (destination === "location" && (card as Location).type !== "Location") {
      return false;
    }

    this.funding = this.funding - cost;
    const cardMoved = this.moveCard(cardUuid, destination);
    return cardMoved;
  }

  findCardByUuid(cardUuid: string): {
    card: AnyCard;
    location: GameZone;
  } | null {
    const cardInLookHand = this.hand.look.find(({ uuid }) => uuid === cardUuid);
    if (cardInLookHand) {
      return {
        card: cardInLookHand,
        location: "look-hand",
      };
    }

    const cardInStowedHand = this.hand.stowed.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInStowedHand) {
      return {
        card: cardInStowedHand,
        location: "stowed-hand",
      };
    }

    const cardInDiscardPile = this.discardPile.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInDiscardPile) {
      return {
        card: cardInDiscardPile,
        location: "discard-pile",
      };
    }

    const cardInDeck = this.deck.find(({ uuid }) => uuid === cardUuid);
    if (cardInDeck) {
      return {
        card: cardInDeck,
        location: "deck",
      };
    }

    const cardInBattleZone = this.board.battleZone.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInBattleZone) {
      return {
        card: cardInBattleZone,
        location: "battle-zone",
      };
    }

    const cardInBufferZone = this.board.bufferZone.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInBufferZone) {
      return {
        card: cardInBufferZone,
        location: "buffer-zone",
      };
    }

    const cardInTheThinkTank = this.board.theThinkTank.find(
      ({ uuid }) => uuid === cardUuid
    );
    if (cardInTheThinkTank) {
      return {
        card: cardInTheThinkTank,
        location: "the-think-tank",
      };
    }

    const cardInLocation =
      this.location?.uuid === cardUuid ? this.location : null;
    if (cardInLocation) {
      return {
        card: cardInLocation,
        location: "location",
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
      case "Creature": {
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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
        this.deck.push(
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

    return true;
  }
}

export default PuppetMaster;
