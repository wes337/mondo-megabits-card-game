import useStore from "./store";
import { getCardImageById } from "./utils";
import "./Hand.scss";

function Hand() {
  const { state } = useStore();

  return (
    <div class="hand">
      <For each={state.hand}>
        {(card) => {
          return (
            <div class="card">
              <img src={getCardImageById(card.id)} width={168} height={284} />
            </div>
          );
        }}
      </For>
    </div>
  );
}

export default Hand;
