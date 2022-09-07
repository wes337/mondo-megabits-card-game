import { createSignal } from "solid-js";
import useStore from "./store";
import "./Connect.scss";

function Connect() {
  const { sendMessage, setState } = useStore();
  const [puppetMasterHandle, setPuppetMasterHandle] = createSignal("");

  const connect = (event) => {
    event.preventDefault();

    const userName = puppetMasterHandle();

    sendMessage({
      type: "lobby",
      params: {
        userName,
      },
    });

    setState((state) => ({
      user: { ...state.user, name: userName },
    }));
  };

  return (
    <div class="connect">
      <form class="puppet-master-handle-input" onSubmit={connect}>
        <label>Puppet Master Handle</label>
        <input
          type="text"
          onChange={(event) => setPuppetMasterHandle(event.target.value)}
          value={puppetMasterHandle()}
        />
        <button type="submit">Connect</button>
      </form>
    </div>
  );
}

export default Connect;
