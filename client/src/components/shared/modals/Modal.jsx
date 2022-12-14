import { Show, Switch, Match } from "solid-js";
import MODAL_NAMES from "../../../constants/modal";
import useModal from "../../../hooks/useModal";
import ModalJoinRoom from "./ModalRoomJoin";
import ModalDeckSave from "./ModalDeckSave";
import ModalDeckImport from "./ModalDeckImport";
import ModalDeckExport from "./ModalDeckExport";
import ModalConfirm from "./ModalConfirm";
import ModalDeckManage from "./ModalDeckManage";
import ModalCardNotes from "./ModalCardNotes";
import "./Modal.scss";
import ModalFindRoom from "./ModalFindRoom";

function Modal() {
  const { current } = useModal();

  return (
    <Show when={current()}>
      <div class="modal">
        <div class="modal-container panel">
          <Switch>
            <Match when={current() === MODAL_NAMES.CONFIRM}>
              <ModalConfirm />
            </Match>
            <Match when={current() === MODAL_NAMES.CARD_NOTES}>
              <ModalCardNotes />
            </Match>
            <Match when={current() === MODAL_NAMES.ROOM_JOIN}>
              <ModalJoinRoom />
            </Match>
            <Match when={current() === MODAL_NAMES.ROOM_FIND}>
              <ModalFindRoom />
            </Match>
            <Match when={current() === MODAL_NAMES.DECK_SAVE}>
              <ModalDeckSave />
            </Match>
            <Match when={current() === MODAL_NAMES.DECK_MANAGE}>
              <ModalDeckManage />
            </Match>
            <Match when={current() === MODAL_NAMES.DECK_IMPORT}>
              <ModalDeckImport />
            </Match>
            <Match when={current() === MODAL_NAMES.DECK_EXPORT}>
              <ModalDeckExport />
            </Match>
          </Switch>
        </div>
      </div>
    </Show>
  );
}

export default Modal;
