import type { Message } from "@/@types/backendTypes.ts";
import MessageHeader from "@/components/MessageHeader/MessageHeader.tsx";
import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import MessageJobDatagrid from "@/components/MessageJobDatagrid/MessageJobDatagrid.tsx";

const MessageModal = (props: {
  message: Message;
  open: boolean;
  setOpen: (state: boolean) => void;
}) => {
  return (
    <GenericModal
      setOpen={props.setOpen}
      open={props.open}
      header={"Message Details"}
      modalDialogSX={{
        width: "60vw",
      }}
    >
      <MessageHeader message={props.message} />
      <MessageJobDatagrid message={props.message} />
    </GenericModal>
  );
};

export default MessageModal;
