import { hyphenToCamelCase } from "../utils/string";
import Card from "./cards/Card";
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
  }

  isDeckValid(cards: Card[]): boolean {
    const cardCounts = cards.reduce((counts, card) => {
      counts[card.id] = ++counts[card.id] || 1;
      return counts;
    }, {}) as {
      [cardId: string]: number;
    };

    const cardsExceedingLimit = Object.values(cardCounts).filter(
      (count) => count > MAX_COPIES_OF_CARD_PER_DECK
    );

    return cardsExceedingLimit.length === 0;
  }

  setDeck(cards: Card[]) {
    const isValidDeck = this.isDeckValid(cards);
    if (!isValidDeck) {
      console.log("=== INVALID DECK !!! ===");
      return;
    }

    this.deck = cards;
  }

  getZone(zoneName: GameZone): Card[] {
    if (zoneName === "look-hand") {
      return this.hand.look;
    }

    if (zoneName === "stowed-hand") {
      return this.hand.stowed;
    }

    if (["deck", "discard-pile"].includes(zoneName)) {
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

  tapCard(cardUuid: string) {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return;
    }

    const { card, location } = cardAndLocation;

    const cardIsOnBoard = [
      "battle-zone",
      "the-think-tank",
      "buffer-zone",
    ].includes(location);
    if (!cardIsOnBoard) {
      return;
    }

    card.tapped = !card.tapped;
  }

  moveCard(cardUuid: string, destination: GameZone) {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return;
    }

    const { card, location } = cardAndLocation;

    // Card is already in requested destination
    if (location === destination) {
      return;
    }

    // Move card to new location
    const newZone = this.getZone(destination);
    newZone.push(card);

    // Remove card from old location
    const oldZone = this.getZone(location);
    const cardIndex = oldZone.findIndex((card) => card.uuid === cardUuid);
    oldZone.splice(cardIndex, 1);
  }

  discardHand() {
    this.discardPile.push(...this.hand.look);
    this.hand.look = [];
  }

  playCard(cardUuid: string, destination: GameZone): void {
    const cardAndLocation = this.findCardByUuid(cardUuid);

    // Card does not exist, or player
    // does not have this card
    if (!cardAndLocation) {
      return;
    }

    const { card, location } = cardAndLocation;

    // Card is already in requested destination
    if (location === destination) {
      return;
    }

    // Check if user can pay for card
    const cost =
      destination === "stowed-hand" ? STOW_CARD_FUNDING_COST : card.cost;
    const cantAfford = this.funding - cost < 0;

    if (cantAfford) {
      return;
    }

    this.funding = this.funding - cost;
    this.moveCard(cardUuid, destination);
  }

  findCardByUuid(cardUuid: string): {
    card: Card;
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

    return null;
  }
}

export default PuppetMaster;
