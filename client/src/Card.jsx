import CardBack from "./assets/card-back-upside.png";
import useStore from "./store";
import { getCardImageById } from "./utils";
import "./Card.scss";

function Card({ card, ...props }) {
  const { state, setState, sendMessage } = useStore();
  const faceDown = props.faceDown || card.faceDown;

  const playCard = (destination = "battle-zone") => {
    sendMessage({
      type: "play",
      params: {
        cardUuid: card.uuid,
        destination,
        gameCode: state.game.id,
        roomCode: state.room.code,
      },
    });
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData("text", card.uuid);
  };

  const focusOnCard = () => {
    if (state.focus.current?.uuid === card.uuid) {
      removeFocusOnCard();
    } else {
      setState((state) => ({
        focus: {
          ...state.focus,
          current: card,
        },
      }));
    }
  };

  const removeFocusOnCard = () => {
    setState((state) => ({
      focus: {
        ...state.focus,
        current: null,
      },
    }));
  };

  const onPointerEnter = () => {
    setState((state) => ({
      focus: {
        ...state.focus,
        hover: card,
      },
    }));
  };

  const onPointerLeave = () => {
    setState((state) => ({
      focus: {
        ...state.focus,
        hover: null,
      },
    }));
  };

  const onClick = (event) => {
    const SINGLE_CLICK = 1;
    const DOUBLE_CLICK = 2;

    switch (event.detail) {
      case SINGLE_CLICK:
        focusOnCard();
        break;
      case DOUBLE_CLICK:
        playCard();
        break;
    }
  };

  return (
    <div
      class={`card${state.focus.current?.uuid === card.uuid ? " focus" : ""}`}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onDragStart={onDragStart}
      draggable
    >
      <img
        id={card.uuid}
        src={faceDown ? CardBack : getCardImageById(card.id)}
      />
    </div>
  );
}

export default Card;
