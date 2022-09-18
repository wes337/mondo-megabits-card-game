import { User } from "../types/user";
import { RoomStatus } from "../types/room";
import Game from "./Game";

class Room {
  code: string;
  users: User[];
  status: RoomStatus;
  game?: Game;

  constructor(code, users) {
    this.code = code;
    this.users = users;
  }
}

export default Room;
