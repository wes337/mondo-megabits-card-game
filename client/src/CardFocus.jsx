import { createMemo, createEffect, For, Show } from "solid-js";
import useStore from "./store";
import "./CardFocus.scss";

function CardFocus() {
  const { state } = useStore();
  const card = createMemo(() => state.focus.hover || state.focus.current);

  return (
    <div class="card-focus">
      <Show when={card()}>
        <div class="name">{card().name}</div>
        <div class="cost">Cost: {card().cost}</div>
        <div class="type">Type: {card().type}</div>
        <div class="subtype">Subtype: {card().subType}</div>
        <div class="faction">Faction: {card().faction}</div>
        <div class="body-text">{card().bodyText}</div>
      </Show>
    </div>
  );
}

export default CardFocus;
