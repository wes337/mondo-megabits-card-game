export interface User {
  socket: WebSocket;
  id: string;
  name: string;
}

export interface Room {
  [userId: string]: User;
}
