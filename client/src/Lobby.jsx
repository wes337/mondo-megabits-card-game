import { createSignal, For } from "solid-js";
import useStore from "./store";
import "./Lobby.scss";

function Lobby() {
  const { state, sendMessage } = useStore();
  const [showInput, setShowInput] = createSignal(false);
  const [input, setInput] = createSignal("");

  const createRoom = () => {
    sendMessage({ type: "create" });
  };

  const joinRoom = (event) => {
    event.preventDefault();
    const roomCode = input();

    if (!roomCode) {
      return;
    }

    sendMessage({ type: "join", params: { roomCode } });
  };

  return (
    <div class="lobby">
      <div class="rooms">
        <ul>
          <For each={state.rooms}>
            {(room) => (
              <li class="room">
                <div class="room-code">{room.code}</div>
                <div class="room-users">
                  {room.users} / {room.maxUsers}
                </div>
                <div class="room-status">{room.status}</div>
                <div class="room-join">
                  <button
                    disabled={room.status !== "open"}
                    onClick={() => {
                      sendMessage({
                        type: "join",
                        params: { roomCode: room.code },
                      });
                    }}
                  >
                    Join
                  </button>
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="users">
        <ul>
          <For each={state.lobby}>{(user) => <li>{user.name}</li>}</For>
        </ul>
      </div>
      <div class="footer">
        <button onClick={createRoom}>Create</button>
        <button
          onClick={() => {
            setShowInput(true);
            setInput("");
          }}
        >
          Join
        </button>
      </div>
      <Show when={showInput()}>
        <div class="modal">
          <div class="join-room">
            <form onSubmit={joinRoom}>
              <label>Room code:</label>
              <input
                type="text"
                value={input()}
                onChange={(event) => setInput(event.target.value)}
              />
              <div class="modal-footer">
                <button type="submit" disabled={input().length === 0}>
                  OK
                </button>
                <button type="button" onClick={() => setShowInput(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default Lobby;
