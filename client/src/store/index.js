import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { io } from "socket.io-client";
import { gameLogToChatMessage } from "./gameLog";
import initialState from "./initialState";

const socket = io("wss://mondomegabits.fly.dev");
//const socket = io("ws://localhost:8080");

const [state, setState] = createStore(initialState);

socket.on("connect", () => {
  setState({
    connected: true,
  });
});

socket.on("disconnect", () => {
  setState({
    connected: false,
  });
});

// eslint-disable-next-line solid/reactivity
socket.on("message", (event) => {
  try {
    const { type, params } = JSON.parse(event);

    switch (type) {
      case "connected": {
        setState((state) => ({
          user: {
            ...state.user,
            name: "",
            id: params.id,
          },
        }));
        break;
      }
      case "lobby": {
        setState({
          lobby: params.users,
          room: null,
          rooms: params.otherRooms || [],
        });
        break;
      }
      case "join": {
        const { roomCode, users, status } = params;
        setState((state) => ({
          lobby: state.lobby.filter((user) => user.id !== state.user.id),
          room: {
            code: roomCode,
            users,
            chatMessages: state.room?.chatMessages || [],
            status,
          },
        }));
        break;
      }
      case "leave": {
        const { userId } = params;
        setState({
          room:
            userId === state.user.id
              ? null
              : {
                  ...state.room,
                  users: state.room.users.filter((user) => user.id !== userId),
                },
        });
        break;
      }
      case "leave-game": {
        const { roomCode, users } = params;
        setState({
          game: null,
          room: {
            code: roomCode,
            users,
            chatMessages: state.room?.chatMessages || [],
          },
        });
        break;
      }
      case "chat": {
        if (params.chatMessage.user.id !== state.user.id) {
          setState((state) => ({
            room: {
              ...state.room,
              chatMessages: [
                ...(state.room?.chatMessages || []),
                params.chatMessage,
              ],
            },
          }));
          break;
        }
        break;
      }
      case "status": {
        const { userId, status } = params;
        setState((state) => ({
          room: {
            ...state.room,
            users: state.room.users.map((user) => {
              if (user.id !== userId) {
                return user;
              }
              return {
                ...user,
                status,
              };
            }),
          },
        }));
        break;
      }
      case "game": {
        const { game } = params;
        setState((state) => ({
          game,
          room: {
            ...state.room,
            chatMessages: [
              ...(state.room?.chatMessages || []),
              gameLogToChatMessage(game.log[game.log.length - 1]),
            ],
          },
        }));

        break;
      }
      case "target": {
        const { target } = params;
        setState({ target });
        break;
      }
      case "message": {
        const { message } = params;
        setState({ snackbar: message });
        break;
      }
      default: {
        console.log("Got unknown message type: ", type);
        break;
      }
    }
  } catch {
    return;
  }
});

function useStore() {
  let pingInterval;

  const sendMessage = (message) => {
    socket.send(JSON.stringify(message));
  };

  onMount(() => {
    pingInterval = setInterval(() => {
      sendMessage({ type: "ping" });
    }, 40000);
  });

  onCleanup(() => {
    clearInterval(pingInterval);
  });

  return { state, setState, sendMessage };
}

export default useStore;
