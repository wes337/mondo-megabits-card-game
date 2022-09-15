import Game from "../classes/Game";
import { User } from "./user";

export const ROOM_STATUS = {
  OPEN: "open",
  FULL: "full",
  IN_PROGRESS: "in-progress",
} as const;

type Keys = keyof typeof ROOM_STATUS;
export type RoomStatus = typeof ROOM_STATUS[Keys];

export type Room = {
  users: {
    [userId: string]: User;
  };
  game?: Game;
  status: RoomStatus;
  code: string;
};

export type Rooms = {
  [roomCode: string]: Room;
};
