import { createSignal, createMemo, For } from "solid-js";
import useStore from "./store";
import Chat from "./Chat";
import "./Room.scss";
import CountDown from "./CountDown";

function Room() {
  const [ready, setReady] = createSignal(false);
  const { state, sendMessage } = useStore();

  const allUsersAreReady = createMemo(
    () => !state.room.users.find((user) => user.status !== "ready")
  );

  const leaveRoom = () => {
    sendMessage({ type: "leave" });
  };

  const startGame = () => {
    sendMessage({ type: "start" });
  };

  const toggleReady = () => {
    const _ready = !ready();

    setReady(_ready);
    sendMessage({
      type: "ready",
      params: {
        roomCode: state.room.code,
        status: _ready ? "ready" : "waiting",
      },
    });
  };

  return (
    <div class="room">
      <div class="main">
        <div className="header">
          <h1>{state.room.code}</h1>
          <Show when={allUsersAreReady()}>
            <CountDown callback={startGame} />
          </Show>
        </div>
        <Chat />
      </div>
      <div class="users">
        <ul>
          <For each={state.room.users}>
            {(user) => (
              <li>
                {user.name} {user.status}
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="footer">
        <button onClick={toggleReady}>{ready() ? "Unready" : "Ready"}</button>
        <button onClick={leaveRoom}>Leave</button>
      </div>
    </div>
  );
}

export default Room;
