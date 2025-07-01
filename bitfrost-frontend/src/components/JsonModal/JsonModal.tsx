import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import JsonSnippetBox from "@/components/JsonSnippetBox/JsonSnippetBox.tsx";

const JsonModal = (props: {
  header: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  content: string;
}) => {
  return (
    <GenericModal
      header={props.header}
      open={props.open}
      setOpen={props.setOpen}
    >
      <JsonSnippetBox content={props.content} />
    </GenericModal>
  );
};

export default JsonModal;
