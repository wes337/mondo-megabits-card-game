export const USER_STATUS = {
  WAITING: "waiting",
  READY: "ready",
  START: "start",
} as const;

type Keys = keyof typeof USER_STATUS;
export type UserStatus = typeof USER_STATUS[Keys];

export interface User {
  socket: WebSocket;
  id: string;
  name: string;
  status?: UserStatus;
  deck?: string[];
}
