import { createSignal, onMount, onCleanup, Show } from "solid-js";
import "./CountDown.scss";

function CountDown({ from = 5, callback = () => {} }) {
  const [timer, setTimer] = createSignal();
  const [count, setCount] = createSignal(from);

  const startTimer = () => {
    if (!timer() && count() > 0) {
      setTimer(setInterval(countDown, 1000));
    }
  };

  const countDown = () => {
    let seconds = count() - 1;

    setCount(seconds);

    if (seconds === 0) {
      clearInterval(timer());
      callback?.();
    }
  };

  onMount(() => {
    startTimer();
  });

  onCleanup(() => {
    clearInterval(timer());
  });

  return (
    <Show when={count() > 0}>
      <div class="countdown">
        <h1>
          Starting in: <span class="count">{count()}</span>
        </h1>
      </div>
    </Show>
  );
}

export default CountDown;
