import { createSignal, onCleanup, createEffect, For } from "solid-js";
import useStore from "./store";
import "./Chat.scss";

function Chat() {
  let messagesRef;
  const { state, setState, sendMessage } = useStore();
  const [input, setInput] = createSignal("");

  createEffect(() => {
    // Scroll to new messages when they arrive
    if (!messagesRef || state.chatMessages.length === 0) {
      return;
    }

    messagesRef.scrollTop = messagesRef.scrollHeight;
  });

  onCleanup(() => {
    setState({ chatMessages: [] });
  });

  const sendChatMessage = (event) => {
    event.preventDefault();

    const message = input();

    if (message.length === 0) {
      return;
    }

    const chatMessage = {
      message,
      date: new Date().toISOString(),
    };

    setState((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...chatMessage,
          user: state.user,
        },
      ],
    }));

    sendMessage({
      type: "chat",
      params: {
        roomCode: state.room.code,
        chatMessage,
      },
    });

    setInput("");
  };

  return (
    <div class="chat">
      <div class="messages" ref={messagesRef}>
        <For each={state.chatMessages}>
          {(message) => (
            <div class="message">
              <p>{message.message}</p>
              <div class="message-user">{message.user.name}</div>
              <div class="message-date">{message.date}</div>
            </div>
          )}
        </For>
      </div>
      <form onSubmit={sendChatMessage}>
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
