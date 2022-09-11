import Game from "./classes/Game";

export interface User {
  socket: WebSocket;
  id: string;
  name: string;
  status?: "waiting" | "ready" | "start";
}

export interface Room {
  users: {
    [userId: string]: User;
  };
  game?: Game;
  status: "open" | "full" | "in-progress";
}

export interface Rooms {
  [roomCode: string]: Room;
}
