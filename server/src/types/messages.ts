export const MESSAGE_TYPES = {
  LOBBY: "lobby",
  CREATE: "create",
  JOIN: "join",
  LEAVE: "leave",
  CHAT: "chat",
  STATUS: "status",
  START: "start",
  PLAY: "play",
  MOVE: "move",
  TAP: "tap",
  TARGET: "target",
  END_TURN: "end-turn",
  LEAVE_GAME: "leave-game",
  GAME: "game",
  PING: "ping",
} as const;

type Keys = keyof typeof MESSAGE_TYPES;
export type MessageType = typeof MESSAGE_TYPES[Keys];

export type WebSocketMessage = {
  type: MessageType;
  params: any;
};
