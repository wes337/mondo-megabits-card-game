import { createSignal, For } from "solid-js";
import useStore from "./store";
import "./Chat.scss";

function Chat() {
  const { state, setState, sendMessage } = useStore();
  const [input, setInput] = createSignal("");

  const sendChatMessage = (event) => {
    event.preventDefault();

    const chatMessage = {
      message: input(),
      user: state.uuid,
      date: new Date().toISOString(),
    };

    setState((state) => ({
      chatMessages: [...state.chatMessages, chatMessage],
    }));

    sendMessage({
      type: "chat",
      params: {
        roomCode: state.room,
        chatMessage,
      },
    });

    setInput("");
  };

  return (
    <div class="chat">
      <div class="messages">
        <For each={state.chatMessages}>
          {(message) => (
            <div class="message">
              <p>{message.message}</p>
              <div class="message-user">{message.user}</div>
              <div class="message-date">{message.date}</div>
            </div>
          )}
        </For>
      </div>
      <form class="chat-input" onSubmit={sendChatMessage}>
        <input
          type="text"
          onChange={(event) => setInput(event.target.value)}
          value={input()}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
