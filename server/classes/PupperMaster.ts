import Card from "./cards/Card";

class PuppetMaster {
  id: string;
  narrative: number; // 1 point costs 10 funding
  // At beginning of game, player looks at first 12 cards and play whatever they have funding for, discard rest
  hand: Card[]; // after first turn, each turn player looks at top 3 cards, can play, discard, or put back
  deck: Card[]; // about 40, when runs out, shuffle discarded pile becomes new deck. No more than 3 copies of a single card
  discardPile: Card[];
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
    this.funding = 20; // Max 20
    this.hand = [];
    this.deck = [];
    this.discardPile = [];
    this.board = {
      theThinkTank: [], // Agenda, figurehead, and incantation only
      bufferZone: [], // Tactic, creature, challenge only
      battleZone: [],
    };
  }

  setDeck(cards: Card[]) {
    this.deck = cards;
  }

  shuffleDeck() {
    this.deck.sort(() => {
      return 0.5 - Math.random();
    });
  }

  drawCards(amount: number) {
    const cards = this.deck.splice(0, amount);
    this.hand.push(...cards);
  }

  play(cardUuid: string, destination: string) {
    const cardIndex = this.hand.findIndex((card) => card.uuid === cardUuid);
    const card = this.hand[cardIndex];

    this.funding = this.funding - (card as any).cost;
    this.hand.splice(cardIndex, 1);

    switch (destination) {
      case "the-think-tank":
        this.board.theThinkTank.push(card);
        break;
      case "buffer-zone":
        this.board.bufferZone.push(card);
        break;
      case "battle-zone":
        this.board.battleZone.push(card);
        break;
      default:
        break;
    }
  }

  findCardByUuid(cardUuid: string): {
    card: Card;
    location:
      | "hand"
      | "deck"
      | "discard-pile"
      | "the-think-tank"
      | "buffer-zone"
      | "battle-zone";
  } | null {
    const cardInHand = this.hand.find(({ uuid }) => uuid === cardUuid);
    if (cardInHand) {
      return {
        card: cardInHand,
        location: "hand",
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
