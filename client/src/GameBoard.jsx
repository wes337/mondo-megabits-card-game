import { createSignal, createMemo, createEffect, For } from "solid-js";
import useStore from "./store";
import Chat from "./Chat";
import OpponentHand from "./OpponentHand";
import Hand from "./Hand";
import CardFocus from "./CardFocus";
import "./GameBoard.scss";
import Zone from "./Zone";

function GameBoard() {
  let mainRef;
  const [chatExpanded, setChatExpanded] = createSignal(false);
  const { state, setState, sendMessage } = useStore();
  const me = createMemo(() =>
    state.game.puppetMasters.find(({ id }) => id === state.user.id)
  );

  const soloPlay = createMemo(() => state.game.puppetMasters.length === 1);

  const isMyTurn = createMemo(() => state.game.turn.player === state.user.id);

  const leaveGame = () => {};

  const endTurn = () => {
    sendMessage({
      type: "end-turn",
      params: {
        gameCode: state.game.id,
        roomCode: state.room.code,
      },
    });
  };

  const getPuppetMasterName = (puppetMasterId) =>
    state.room.users.find((user) => user.id === puppetMasterId)?.name;

  const onClick = (event) => {
    // Remove focus from cards when clicking
    // something else inside the main board
    const clickedAnotherElementInsideMainBoard =
      event.target.id !== state.focus.current?.uuid &&
      mainRef.contains(event.target);

    if (clickedAnotherElementInsideMainBoard) {
      setState((state) => ({
        focus: {
          ...state.focus,
          current: null,
        },
      }));
    }
  };

  return (
    <div class="game-board" onClick={onClick}>
      <div class="header">header</div>
      <Show when={!soloPlay()}>
        <OpponentHand />
      </Show>
      <div ref={mainRef} class={`main${soloPlay() ? " solo-play" : ""}`}>
        <Show when={!soloPlay()}>
          <Zone name="the-think-tank" opponent />
          <Zone name="buffer-zone" opponent />
          <Zone name="battle-zone" opponent />
        </Show>
        <Zone name="battle-zone" />
        <Zone name="buffer-zone" />
        <Zone name="the-think-tank" />
      </div>
      <div class={`game-side-bar${chatExpanded() ? " chat-expanded" : ""}`}>
        <div class="game-chat">
          <button
            class="expand-button"
            onClick={() => setChatExpanded((expanded) => !expanded)}
          >
            {chatExpanded() ? "Collapse" : "Expand"}
          </button>
          <Show when={chatExpanded()}>
            <ul>
              <For each={state.game.puppetMasters}>
                {(puppetMaster) => (
                  <li>{getPuppetMasterName(puppetMaster.id)}</li>
                )}
              </For>
            </ul>
          </Show>
        </div>
        <CardFocus />
      </div>
      <div class="footer">
        <div class="footer-left">
          <div class="name">{state.user.name}</div>
          <div class="stats">
            <div class="stat">
              <div class="stat-label">Narrative</div>
              <div class="stat-number">{me().narrative}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Funding</div>
              <div class="stat-number">{me().funding}</div>
            </div>
          </div>
        </div>
        <div class="footer-center">
          <Hand />
        </div>
        <div class="footer-right">
          <div class="turn">
            <div class="turn-label">
              {isMyTurn()
                ? "Your Turn"
                : `${getPuppetMasterName(state.game.turn.player)}'s Turn`}
            </div>
            <div class="turn-number">{state.game.turn.number}</div>
          </div>
          <div class="options">
            <Show when={isMyTurn()}>
              <button onClick={endTurn}>End My Turn</button>
            </Show>
            <button onClick={leaveGame}>Leave</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
