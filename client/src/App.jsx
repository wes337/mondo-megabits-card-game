import { createMemo, Show } from "solid-js";
import useStore from "./store";
import Connect from "./Connect";
import Lobby from "./Lobby";
import "./App.scss";
import Room from "./Room";

function App() {
  const { state } = useStore();

  const userIsInLobbyOrRoom = createMemo(
    () =>
      !!state.room || !!state.lobby.find((user) => user.id === state.user.id)
  );

  return (
    <Show when={userIsInLobbyOrRoom()} fallback={<Connect />}>
      <Show when={state.room} fallback={<Lobby />}>
        <Room />
      </Show>
    </Show>
  );
}

export default App;
