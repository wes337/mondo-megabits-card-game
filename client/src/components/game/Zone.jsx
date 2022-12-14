import { createMemo, For } from "solid-js";
import { hyphenToCamelCase } from "../../utils";
import useGameControls from "../../hooks/useGameControls";
import useStore from "../../store";
import Card from "../card/Card";
import "./Zone.scss";

function Zone(props) {
  let zoneRef;
  const { state } = useStore();
  const gameControls = useGameControls();

  const cardsInZone = createMemo(() => {
    const puppetMaster = state.game.puppetMasters.find((puppetMaster) =>
      props.opponent
        ? puppetMaster.id !== state.user.id
        : puppetMaster.id === state.user.id
    );
    const zoneKey = hyphenToCamelCase(props.name);
    const cards = puppetMaster?.[zoneKey];

    if (!cards) {
      return [];
    }

    if (Array.isArray(cards)) {
      return cards || [];
    }

    return puppetMaster[zoneKey] ? [puppetMaster[zoneKey]] : [];
  });

  const onDragOver = (event) => {
    if (props.opponent) {
      return;
    }

    event.preventDefault();
    zoneRef.classList.add("drag-over");
  };

  const onDragLeave = () => {
    if (props.opponent) {
      return;
    }

    zoneRef.classList.remove("drag-over");
  };

  const onDrop = (event) => {
    if (props.opponent) {
      return;
    }

    event.preventDefault();

    zoneRef.classList.remove("drag-over");
    const cardUuid = event.dataTransfer.getData("text");

    gameControls.moveCard(cardUuid, props.name);
  };

  return (
    <div
      ref={zoneRef}
      class={`zone panel grunge ${props.name}${
        props.opponent ? " opponent" : ""
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <For each={cardsInZone()}>
        {(card) => (
          <Card card={card} opponent={props.opponent} location={props.name} />
        )}
      </For>
    </div>
  );
}

export default Zone;
