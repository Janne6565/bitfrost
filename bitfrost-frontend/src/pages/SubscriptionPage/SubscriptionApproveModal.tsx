import {
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    ModalClose,
    Divider,
    Typography,
    Button,
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

export default function SubscriptionApproveModal({ open, onClose, onConfirm, subscription }: Props) {
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog layout="center" size="md" sx={{ gap: 1 }}>
                <ModalClose />
                <DialogTitle>Approve subscription?</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 1 }}>
                        <Typography level="title-md" sx={{ wordBreak: "break-word" }}>
                            {subscription.requestingProjectTag} → {subscription.requestedProjectTag}
                        </Typography>

                        <Divider />

                        <DetailRow label="State">
                            <StatusChip state={subscription.state} />
                        </DetailRow>

                        <DetailRow label="Topic">
                            <Typography component="span" level="body-sm" sx={{ fontFamily: "monospace" }}>
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

                        <Typography level="body-sm" sx={{ mt: 1 }}>
                            By approving, <b>{subscription.requestingProjectTag}</b> will receive events for{" "}
                            <code>{subscription.topicLabel}</code> from <b>{subscription.requestedProjectTag}</b>.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                        <Button variant="soft" size="sm" color="neutral" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="solid" size="sm" color="primary" onClick={onConfirm}>
                            Approve
                        </Button>
                    </Box>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}
