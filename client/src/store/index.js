import { createStore } from "solid-js/store";
import initialState from "./initialState";

const ws = new WebSocket("ws://localhost:8080");

function useStore() {
  const [state, setState] = createStore(initialState);

  ws.onopen = () => {
    setState({
      connected: true,
    });
  };

  ws.onclose = () => {
    setState({
      connected: false,
    });
  };

  ws.onmessage = (event) => {
    const { type, params } = JSON.parse(event.data);

    switch (type) {
      case "connected": {
        setState({
          user: {
            name: "",
            id: params.id,
          },
        });
        break;
      }
      case "lobby": {
        setState({
          lobby: params.users,
          rooms: params.otherRooms || [],
        });
        break;
      }
      case "join": {
        const { roomCode, users } = params;
        setState((state) => ({
          lobby: state.lobby.filter((user) => user.id !== state.user.id),
          room: {
            code: roomCode,
            users,
          },
        }));
        break;
      }
      case "leave": {
        const { uuid, rooms } = params;
        if (uuid === state.uuid) {
          setState({
            room: null,
            rooms,
          });
        }
        break;
      }
      case "chat": {
        if (params.chatMessage.user !== state.uuid) {
          setState((state) => ({
            chatMessages: [...state.chatMessages, params.chatMessage],
          }));
        }
        break;
      }
      case "draw": {
        setState((state) => ({
          hand: [...state.hand, ...params.cards],
        }));
        break;
      }
      default: {
        console.log("Got unknown message type: ", type);
        break;
      }
    }
  };

  const sendMessage = (message) => {
    ws.send(JSON.stringify(message));
  };

  return { state, setState, sendMessage };
}

export default useStore;
