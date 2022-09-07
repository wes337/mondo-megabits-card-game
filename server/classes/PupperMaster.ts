import Card from "./cards/Card";
import { Challenge, Creature, Tactic } from "./cards";

class PuppetMaster {
  userId: string;
  narrative: number; // 1 point costs 10 funding
  // At beginning of game, player looks at first 12 cards and play whatever they have funding for, discard rest
  hand: Card[]; // after first turn, each turn player looks at top 3 cards, can play, discard, or put back
  deck: Card[]; // about 40, when runs out, shuffle discarded pile becomes new deck. No more than 3 copies of a single card
  discardPile: Card[];
  board: {
    // closest to the puppet master, cards can be played at any time
    // do not untap, unless funded
    theThinkTank: {
      agenda?: Card;
      figurehead?: Creature;
      incantation?: Card;
    };
    bufferZone: {
      tactic?: Tactic;
      creature?: Creature;
      challenge?: Challenge;
    }; // facedown 1 tactic, 1 creature (patsy double|agent|bad actor), 1 challenge. played all at once when front lines breached, all discarded after played
    battleZone: Card[]; // all active cards go here
  };
  funding: number; // max of 20, restored at 4 per turn (after first turn)

  constructor(userId: string) {
    this.userId = userId;
    this.narrative = 0; // -5 loses, 5 wins. Cost 10 funding for +1
    this.funding = 20; // Max 20
    this.hand = [];
    this.deck = [];
    this.discardPile = [];
    this.board = {
      theThinkTank: {
        agenda: undefined,
        figurehead: undefined,
        incantation: undefined,
      },
      bufferZone: {
        tactic: undefined,
        creature: undefined,
        challenge: undefined,
      },
      battleZone: [],
    };
  }

  setDeck(cards: Card[]) {
    this.deck = cards;
  }

  drawCards(amount: number) {
    const cards = this.deck.splice(0, amount);
    this.hand.push(...cards);
  }
}

export default PuppetMaster;
