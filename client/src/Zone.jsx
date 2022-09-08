import { createSignal, createMemo, For } from "solid-js";
import useStore from "./store";
import Chat from "./Chat";
import OpponentHand from "./OpponentHand";
import Hand from "./Hand";
import { hyphenToCamelCase } from "./utils";
import "./Zone.scss";
import Card from "./Card";

function Zone({ name, opponent }) {
  const { state, sendMessage } = useStore();

  const cardsInZone = createMemo(() => {
    const puppetMaster = state.game.puppetMasters.find((puppetMaster) =>
      opponent
        ? puppetMaster.id !== state.user.id
        : puppetMaster.id === state.user.id
    );
    const zoneKey = hyphenToCamelCase(name);
    const cards = puppetMaster.board[zoneKey];

    return cards || [];
  });

  const onDragOver = (event) => {
    event.preventDefault();
    event.target.classList.add("drag-over");
  };

  const onDragLeave = (event) => {
    event.target.classList.remove("drag-over");
  };

  const onDrop = (event) => {
    event.preventDefault();

    event.target.classList.remove("drag-over");
    const cardUuid = event.dataTransfer.getData("text");

    sendMessage({
      type: "play",
      params: {
        cardUuid,
        destination: name,
        gameCode: state.game.id,
        roomCode: state.room.code,
      },
    });
  };

  return (
    <div
      class={`zone ${name}${opponent ? " opponent" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {cardsInZone().map((card) => (
        <Card card={card} />
      ))}
    </div>
  );
}

export default Zone;
