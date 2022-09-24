import PuppetMaster from "./PuppetMaster";
import { Card, Challenge, Location } from "./cards";

export const GAME_ZONE = {
  LOOK_HAND: "look-hand",
  STOWED_HAND: "stowed-hand",
  DECK: "deck",
  DISCARD_PILE: "discard-pile",
  THE_THINK_TANK: "the-think-tank",
  ACTIVE_ZONE: "active-zone",
  LOCATION: "location",
} as const;

const gameZones = Object.values(GAME_ZONE);
export type GameZone = typeof gameZones[number];

export type GameLog = {
  turn: number;
  card?: Card;
  event: string;
  sourceUserId?: string;
  targetUserId?: string;
  movedFrom?: string;
  movedTo?: string;
  date?: string;
  amount?: number;
};

class SandboxGame {
  id: string;
  turn: {
    number: number;
    player: string;
  };
  puppetMasters: PuppetMaster[];
  location?: Location;
  challenges: Challenge[];
  log: GameLog[];

  constructor(id, puppetMasters) {
    this.id = id;
    this.puppetMasters = puppetMasters;
    this.location = undefined;
    this.challenges = [];
    this.turn = {
      number: 0,
      player: puppetMasters[0].id,
    };
    this.log = [];
  }

  addLog(log): void {
    this.log.push({
      turn: this.turn.number,
      date: new Date().toLocaleTimeString("en-US"),
      event: log.event,
      sourceUserId: log.sourceUserId,
      targetUserId: log.targetUserId,
      card: log.card,
      movedFrom: log.movedFrom,
      movedTo: log.movedTo,
      amount: log.amount,
    });
  }

  findCardAndLocation(
    cardUuid
  ): { card: Card; location: GameZone; owner: PuppetMaster } | null {
    let cardAndLocation;
    this.puppetMasters.forEach((puppetMaster) => {
      const foundCardAndLocation = puppetMaster.findCardByUuid(cardUuid);
      if (foundCardAndLocation) {
        cardAndLocation = { ...foundCardAndLocation, owner: puppetMaster };
        return cardAndLocation;
      }
    });

    return cardAndLocation;
  }

  moveCard(userId: string, cardUuid: string, destination: GameZone) {
    const puppetMaster = this.getPlayer(userId);
    if (!puppetMaster) {
      return;
    }

    const cardAndLocation = this.findCardAndLocation(cardUuid);
    if (!cardAndLocation) {
      return;
    }

    const cardMoved = cardAndLocation.owner?.moveCard(cardUuid, destination);
    if (!cardMoved) {
      return;
    }

    if (destination === GAME_ZONE.LOCATION) {
      if (this.location) {
        // Discard existing location
        this.moveCard(userId, this.location.uuid, GAME_ZONE.DISCARD_PILE);
      }
      this.location = cardAndLocation.card as Location;
    }

    this.addLog({
      event: "move-card",
      sourceUserId: userId,
      card: cardAndLocation?.card,
      movedFrom: cardAndLocation?.location,
      movedTo: destination,
    });
  }

  tapCard(userId: string, cardUuid) {
    const cardAndLocation = this.findCardAndLocation(cardUuid);
    if (!cardAndLocation) {
      return;
    }

    cardAndLocation.card.tapped = !cardAndLocation.card.tapped;

    this.addLog({
      event: "tap-card",
      sourceUserId: userId,
      card: cardAndLocation?.card,
    });
  }

  flipCard(userId: string, cardUuid) {
    const cardAndLocation = this.findCardAndLocation(cardUuid);
    if (!cardAndLocation) {
      return;
    }

    cardAndLocation.card.faceDown = !cardAndLocation.card.faceDown;

    this.addLog({
      event: "flip-card",
      sourceUserId: userId,
      card: cardAndLocation?.card,
    });
  }

  shuffleDeck(userId: string): void {
    const puppetMaster = this.getPlayer(userId);
    if (!puppetMaster) {
      return;
    }

    puppetMaster.shuffleDeck();

    this.addLog({
      event: "shuffle-deck",
      sourceUserId: userId,
    });
  }

  drawCards(userId: string, amount: number): void {
    const puppetMaster = this.getPlayer(userId);
    if (!puppetMaster) {
      return;
    }

    const draw = Math.min(puppetMaster.deck.length, amount);
    const cards = puppetMaster.deck.splice(0, draw);

    if (cards.length === 0) {
      return;
    }

    puppetMaster.lookHand.push(...cards);

    this.addLog({
      event: "draw-cards",
      sourceUserId: userId,
      amount: cards.length,
    });
  }

  setNarrative(userId: string, targetUserId: string, narrative: number): void {
    const puppetMaster = this.getPlayer(userId);
    const targetPuppetMaster = this.getPlayer(targetUserId);
    if (!puppetMaster || !targetPuppetMaster) {
      return;
    }

    targetPuppetMaster.narrative = narrative;

    this.addLog({
      event: "set-narrative",
      sourceUserId: userId,
      targetUserId,
      amount: narrative,
    });
  }

  setFunding(userId: string, targetUserId: string, funding: number): void {
    const puppetMaster = this.getPlayer(userId);
    const targetPuppetMaster = this.getPlayer(targetUserId);
    if (!puppetMaster || !targetPuppetMaster) {
      return;
    }

    targetPuppetMaster.funding = funding;

    this.addLog({
      event: "set-funding",
      sourceUserId: userId,
      targetUserId,
      amount: funding,
    });
  }

  nextTurn(): void {
    const number = this.turn.number + 1;

    const nextPlayerId = (
      this.puppetMasters[number % 2 !== 0 ? 0 : 1] || this.puppetMasters[0]
    ).id;

    this.addLog({
      event: "end-turn",
      sourceUserId: this.turn.player,
      targetUserId: nextPlayerId,
    });

    this.turn = {
      number,
      player: nextPlayerId,
    };
  }

  start(): void {
    const gameHasAlreadyStarted = this.turn.number > 0;
    if (gameHasAlreadyStarted) {
      return;
    }

    // Random player will play first
    this.puppetMasters.sort(() => {
      return 0.5 - Math.random();
    });

    this.nextTurn();
  }

  getPlayer(userId: string): PuppetMaster | undefined {
    const puppetMaster = this.puppetMasters.find(({ id }) => id === userId);
    return puppetMaster;
  }

  untapAllCards(userId: string): void {
    const puppetMaster = this.getPlayer(userId);

    if (!puppetMaster) {
      return;
    }

    puppetMaster.untapAllCards();

    this.addLog({
      event: "untap-all-cards",
      sourceUserId: userId,
    });
  }
}

export default SandboxGame;
