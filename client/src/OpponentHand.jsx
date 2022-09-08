import { createSignal, createMemo, For } from "solid-js";
import useStore from "./store";
import { getCardImageById } from "./utils";
import CardBack from "./assets/card-back-upside.png";
import "./OpponentHand.scss";

function OpponentHand() {
  const { state, setState } = useStore();

  const opponent = createMemo(() =>
    state.game.puppetMasters.find(({ id }) => id !== state.user.id)
  );

  return (
    <div class="opponent-hand">
      <For each={opponent().hand}>
        {(card) => {
          return (
            <div class="card">
              <img src={CardBack} />
            </div>
          );
        }}
      </For>
    </div>
  );
}

export default OpponentHand;
