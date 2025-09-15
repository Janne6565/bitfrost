import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import type { Subscription } from "@/@types/backendTypes";
import DetailRow from "./DetailRow";
import StatusChip from "./StatusChip";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscription: Subscription;
};

export default function SubscriptionDeleteModal({
  open,
  onClose,
  onConfirm,
  subscription,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" size="md" sx={{ gap: 1 }}>
        <ModalClose />
        <DialogTitle>Delete subscription?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography
              level="title-md"
              sx={{ wordBreak: "break-word", py: 1 }}
            >
              {subscription.requestingProjectTag} →{" "}
              {subscription.requestedProjectTag}
            </Typography>

            <Divider />

            <Typography level="body-sm" color={"warning"} sx={{ py: 1 }}>
              This action cannot be undone
            </Typography>

            <DetailRow label="State">
              <StatusChip state={subscription.state} />
            </DetailRow>

            <DetailRow label="Topic">
              <Typography
                component="span"
                level="body-sm"
                sx={{ fontFamily: "monospace" }}
              >
                {subscription.topicLabel}
              </Typography>
            </DetailRow>

            <DetailRow label="Callback URL">
              <Typography
                component="a"
                level="body-sm"
                href={subscription.callbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ wordBreak: "break-all" }}
              >
                {subscription.callbackUrl}
              </Typography>
            </DetailRow>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              pt: 1,
              my: 0.5,
            }}
          >
            <Button variant="soft" size="sm" color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              size="sm"
              color="danger"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
