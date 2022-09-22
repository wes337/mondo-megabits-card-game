import PuppetMaster from "./PuppetMaster";
import { Card, Challenge, Creature, Location } from "./cards";
import {
  CARDS_DRAWN_PER_TURN,
  FUNDING_GAINED_PER_TURN,
  INITIAL_HAND_SIZE,
  MAX_FUNDING,
} from "./constants";
import { CARD_TYPE } from "./cards/Card";

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
  date?: string;
};

class Game {
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
    });
  }

  findCard(cardUuid): Card | null {
    let card;

    this.puppetMasters.forEach((puppetMaster) => {
      const cardAndLocation = puppetMaster.findCardByUuid(cardUuid);
      if (cardAndLocation) {
        card = cardAndLocation.card;
        return card;
      }
    });

    return card;
  }

  nextTurn(): void {
    const number = this.turn.number + 1;
    this.turn = {
      number,
      player: (
        this.puppetMasters[number % 2 !== 0 ? 0 : 1] || this.puppetMasters[0]
      ).id,
    };
  }

  endTurn(): void {
    const puppetMaster = this.turn.player
      ? this.getPlayer(this.turn.player)
      : null;

    if (!puppetMaster) {
      return;
    }

    puppetMaster.discardHand();
    puppetMaster.funding = Math.min(
      puppetMaster.funding + FUNDING_GAINED_PER_TURN,
      MAX_FUNDING
    );
    this.nextTurn();

    const isInitialDeployment = !(
      (this.puppetMasters.length === 1 && this.turn.number >= 2) ||
      this.turn.number > 2
    );

    if (isInitialDeployment) {
      // No cards are drawn, initial deployment
      // hand has already been dealt
      return;
    }

    const nextPuppetMaster = this.getPlayer(this.turn.player);
    if (nextPuppetMaster) {
      nextPuppetMaster.drawCards(CARDS_DRAWN_PER_TURN);
      nextPuppetMaster.untapAllCards();
    }
  }

  isPlayersTurn(userId): boolean {
    return this.turn.player === userId;
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

    this.puppetMasters.forEach((puppetMaster, index) => {
      puppetMaster.shuffleDeck();

      // Player 1 draws 7, Player 2 draws 10
      const numberOfCardsToDraw =
        index === 0
          ? INITIAL_HAND_SIZE.PLAYER_ONE
          : INITIAL_HAND_SIZE.PLAYER_TWO;

      puppetMaster.drawCards(numberOfCardsToDraw);
    });
  }

  addPlayer(puppetMaster: PuppetMaster): void {
    this.puppetMasters.push(puppetMaster);
  }

  getPlayer(userId: string): PuppetMaster | undefined {
    const puppetMaster = this.puppetMasters.find(({ id }) => id === userId);
    return puppetMaster;
  }

  play(userId: string, cardUuid: string, destination: GameZone) {
    const puppetMaster = this.getPlayer(userId);
    if (!puppetMaster) {
      return;
    }

    // Check if user is allowed to play this card
    const isAllowedToPlayCard = this.isPlayersTurn(userId);
    if (!isAllowedToPlayCard) {
      puppetMaster.sendMessage("You can only play this card during your turn.");
      return;
    }

    const cardWasPlayed = puppetMaster.playCard(cardUuid, destination);

    if (!cardWasPlayed) {
      return;
    }

    if (destination === GAME_ZONE.LOCATION) {
      if (this.location) {
        // if another location in play, it is discarded
        const otherPuppetMaster = this.puppetMasters.find(
          ({ id }) => id !== userId
        );
        otherPuppetMaster?.moveCard(this.location.uuid, GAME_ZONE.DISCARD_PILE);
      }

      this.location = puppetMaster.location;
    }

    this.addLog({
      event: "play-card",
      sourceUserId: puppetMaster.id,
      card: cardUuid,
    });
  }

  attack(userId: string, attackerUuid: string, defenderUuid: string) {
    const puppetMaster = this.getPlayer(userId);
    const defendingPuppetMaster = this.puppetMasters.find(
      ({ id }) => id !== userId
    );
    if (!puppetMaster || !defendingPuppetMaster) {
      return;
    }

    // Check if user is allowed to play this card
    const isAllowedToPlayCard = this.isPlayersTurn(userId);
    if (!isAllowedToPlayCard) {
      return;
    }

    const attackingCardAndLocation = puppetMaster.findCardByUuid(attackerUuid);
    const defendingCardAndLocation =
      defendingPuppetMaster.findCardByUuid(defenderUuid);

    if (!attackingCardAndLocation || !defendingCardAndLocation) {
      return;
    }

    const attacker = attackingCardAndLocation.card as Creature;
    const attackerLocation = attackingCardAndLocation.location;

    if (
      attackerLocation !== GAME_ZONE.ACTIVE_ZONE &&
      attackerLocation !== GAME_ZONE.THE_THINK_TANK
    ) {
      return;
    }

    const defender = defendingCardAndLocation.card as Creature;
    const defenderLocation = defendingCardAndLocation.location;

    if (!attacker.canAttack()) {
      puppetMaster.sendMessage(
        "This creature cannot attack anymore this turn."
      );
      return;
    }

    const defendingPlayerHasCreaturesInActiveZone =
      defendingPuppetMaster.activeZone &&
      defendingPuppetMaster.activeZone.filter(
        (card) => card.type === CARD_TYPE.CREATURE
      ).length > 0;

    if (
      defenderLocation === GAME_ZONE.THE_THINK_TANK &&
      defendingPlayerHasCreaturesInActiveZone
    ) {
      puppetMaster.sendMessage(
        "You cannot attack the Figurehead while there are still creatures in the defending player's active zone."
      );
      return;
    }

    const damage = attacker.attackDamage;
    defender.stats.HP -= damage;
    attacker.attacks++;

    if (defender.stats.HP <= 0) {
      defendingPuppetMaster.moveCard(defenderUuid, GAME_ZONE.DISCARD_PILE);
    }

    this.addLog({
      event: "attack-card",
      sourceUserId: puppetMaster.id,
      targetUserId: defendingPuppetMaster.id,
    });
  }
}

export default Game;
