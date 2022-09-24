export const MESSAGE_TYPES = {
  LOBBY: "lobby",
  CREATE: "create",
  JOIN: "join",
  LEAVE: "leave",
  CHAT: "chat",
  MESSAGE: "message",
  STATUS: "status",
  START: "start",
  PLAY: "play",
  ATTACK: "attack",
  MOVE: "move",
  TAP: "tap",
  TARGET: "target",
  END_TURN: "end-turn",
  LEAVE_GAME: "leave-game",
  GAME: "game",
  PING: "ping",
  EDIT_CARD_NOTES: "edit-card-notes",
  // Sandbox game stuff
  START_TUTORIAL: "start-tutorial",
  DRAW_CARDS: "draw-cards",
  SHUFFLE_DECK: "shuffle-deck",
  MOVE_CARD: "move-card",
  TAP_CARD: "tap-card",
  FLIP_CARD: "flip-card",
  SET_FUNDING: "set-funding",
  SET_NARRATIVE: "set-narrative",
  UNTAP_ALL_CARDS: "untap-all-cards",
} as const;

type Keys = keyof typeof MESSAGE_TYPES;
export type MessageType = typeof MESSAGE_TYPES[Keys];

export type WebSocketMessage = {
  type: MessageType;
  params: any;
};
