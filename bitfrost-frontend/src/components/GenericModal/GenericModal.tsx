import { Divider, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import type { SxProps } from "@mui/material";
import type { ReactNode } from "react";

const GenericModal = (props: {
  header: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  disableEscape?: boolean;
  modalSX?: SxProps;
  modalDialogSX?: SxProps;
  children: ReactNode;
}) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      sx={{
        zIndex: 99,
        ...props.modalSX,
      }}
      disableEscapeKeyDown={props.disableEscape ?? false}
    >
      <ModalDialog
        sx={{
          ...props.modalDialogSX,
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
          color="neutral"
        >
          {props.header}
          <ModalClose sx={{ position: "relative", top: 0, right: 0 }} />
        </Typography>
        <Divider inset="none" sx={{ marginBottom: 1 }} />
        {props.children}
      </ModalDialog>
    </Modal>
  );
};

export default GenericModal;
