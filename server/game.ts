import { messageOne } from "./rooms";
import { getRandomCards } from "./cards";

export const draw = (room, uuid, params) => {
  const cards = getRandomCards(params.number);

  messageOne(uuid, room, {
    type: "draw",
    params: { cards },
  });
};

export const start = (rooms, params) => {
  const { roomCode } = params;

  const room = rooms[roomCode];

  const uuids = Object.keys(room);

  uuids.forEach((uuid) => {
    draw(room, uuid, { number: 5 });
  });
};
