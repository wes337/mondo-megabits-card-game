import { createSignal, createMemo, For } from "solid-js";
import useStore from "./store";
import "./Hand.scss";
import Card from "./Card";

const CARD_OFFSET = 40;

function Hand() {
  const { state, setState } = useStore();

  const me = createMemo(() =>
    state.game.puppetMasters.find(({ id }) => id === state.user.id)
  );

  const handOffset = createMemo(
    () => (me().hand.length - 1) * (CARD_OFFSET / 2)
  );

  return (
    <div
      class="hand"
      style={`transform: translate(${me().hand.length}%, 25%);`}
    >
      <For each={me().hand}>
        {(card, index) => {
          const cardOffset = Math.floor(index() * CARD_OFFSET);

          return (
            <div
              class="hand-card"
              style={`transform: translateX(-${cardOffset}px);`}
            >
              <Card card={card} />
            </div>
          );
        }}
      </For>
    </div>
  );
}

export default Hand;
