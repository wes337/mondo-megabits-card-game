import PuppetMaster from "./PuppetMaster";
import { Challenge, Location } from "./cards";

class Room {
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
}

export default Room;
