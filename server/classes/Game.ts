import PuppetMaster from "./PupperMaster";
import { Challenge, Location } from "./cards";

class Game {
  uuid: string;
  turn: {
    number: number;
    player?: PuppetMaster;
  };
  puppetMasters: PuppetMaster[];
  location?: Location;
  challenges: Challenge[];

  constructor(uuid, puppetMasters) {
    this.uuid = uuid;
    this.puppetMasters = puppetMasters;
    this.location = undefined;
    this.challenges = [];
    this.turn = {
      number: -1,
      player: undefined,
    };
  }

  nextTurn() {
    const number = this.turn.number + 1;
    this.turn = {
      number,
      player: this.puppetMasters[number % 2 === 0 ? 0 : 1],
    };
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
