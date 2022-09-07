import { createSignal, For } from "solid-js";
import useStore from "./store";
import "./Room.scss";

function Room() {
  const { state, setState, sendMessage } = useStore();
  const [input, setInput] = createSignal("");

  return <div class="room">In room {state.room.code}</div>;
}

export default Room;
