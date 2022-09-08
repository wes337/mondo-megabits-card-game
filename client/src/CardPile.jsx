import { Show } from "solid-js";
import CardBack from "./assets/card-back.png";
import "./CardPile.scss";

function CardPile({ label, amount }) {
  return (
    <div class="card-pile">
      <Show when={label}>
        <div class="card-pile-label">{label}</div>
      </Show>
      <div class="card-back">
        <div class="card-count">{amount}</div>
        <img class={amount === 0 ? "empty" : ""} src={CardBack} />
      </div>
    </div>
  );
}
export default CardPile;
