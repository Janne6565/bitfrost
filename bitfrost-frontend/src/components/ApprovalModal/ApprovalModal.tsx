import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import { Button, Typography } from "@mui/joy";
import Stack from "@mui/joy/Stack";

const ApprovalModal = (props: {
  text: string;
  header?: string;
  cancelText?: string;
  submitText?: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  execute: () => void;
}) => {
  return (
    <GenericModal
      header={props.header ?? "Approval required"}
      open={props.isOpen}
      setOpen={props.setOpen}
      modalDialogSX={{ width: "400px" }}
    >
      <Typography sx={{ mb: "10px" }}>
        {props.text ?? "Are you sure you want to do this action?"}
      </Typography>
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Button
          color={"neutral"}
          onClick={() => {
            props.setOpen(false);
          }}
          size={"lg"}
          variant={"outlined"}
        >
          {props.cancelText ?? "Cancel"}
        </Button>
        <Button
          size={"lg"}
          color={"danger"}
          onClick={() => {
            props.execute();
            props.setOpen(false);
          }}
          variant={"outlined"}
        >
          {props.submitText ?? "Submit"}
        </Button>
      </Stack>
    </GenericModal>
  );
};

export default ApprovalModal;
