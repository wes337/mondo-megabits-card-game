import { createSignal } from "solid-js";
import useStore from "./store";
import "./Connect.scss";

function Connect() {
  const { sendMessage, setState } = useStore();
  const [userName, setUserName] = createSignal("");

  const connect = (event) => {
    event.preventDefault();

    sendMessage({
      type: "lobby",
      params: {
        userName: userName(),
      },
    });

    setState((state) => ({
      user: { ...state.user, name: userName() },
    }));
  };

  return (
    <div class="connect">
      <form class="puppet-master-handle-input" onSubmit={connect}>
        <label>Puppet Master Handle</label>
        <input
          type="text"
          onChange={(event) => setUserName(event.target.value)}
          value={userName()}
        />
        <button type="submit">Connect</button>
      </form>
    </div>
  );
}

export default Connect;
