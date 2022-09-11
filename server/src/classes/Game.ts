import PuppetMaster from "./PupperMaster";
import { Challenge, Location } from "./cards";

class Game {
  id: string;
  turn: {
    number: number;
    player?: string;
  };
  puppetMasters: PuppetMaster[];
  location?: Location;
  challenges: Challenge[];

  constructor(id, puppetMasters) {
    this.id = id;
    this.puppetMasters = puppetMasters;
    this.location = undefined;
    this.challenges = [];
    this.turn = {
      number: 0,
      player: undefined,
    };
  }

  nextTurn() {
    const number = this.turn.number + 1;
    this.turn = {
      number,
      player: (
        this.puppetMasters[number % 2 === 0 ? 0 : 1] || this.puppetMasters[0]
      ).id,
    };
  }

  allowMove(puppetMasterId) {
    return this.turn.player === puppetMasterId;
  }

  start() {
    // Randomize player order
    this.puppetMasters.sort(() => {
      return 0.5 - Math.random();
    });

    this.nextTurn();
  }

  addPlayer(puppetMaster: PuppetMaster) {
    this.puppetMasters.push(puppetMaster);
  }
}

export default Game;
