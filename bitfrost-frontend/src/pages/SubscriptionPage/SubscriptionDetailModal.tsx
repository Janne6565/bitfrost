import {
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    ModalClose,
    Divider,
    Typography,
    Button,
    Tooltip,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import type { Subscription } from "@/@types/backendTypes";
import DetailRow from "./DetailRow";
import StatusChip from "./StatusChip";

type DetailPageProps = {
    open: boolean;
    onClose: () => void;
    subscription: Subscription;
};

export default function SubscriptionDetailModal({ open, onClose, subscription }: DetailPageProps) {
    const titleText = `${subscription.requestingProjectTag} → ${subscription.requestedProjectTag}`;

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog layout="center" size="md" sx={{ gap: 1 }}>
                <ModalClose />
                <DialogTitle>Subscription Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 1 }}>
                        <Tooltip title={titleText}>
                            <Typography
                                level="title-md"
                                noWrap
                                sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
                            >
                                {titleText}
                            </Typography>
                        </Tooltip>

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

                        <DetailRow label="Requested Tag">
                            <Tooltip title={subscription.requestedProjectTag}>
                                <Typography
                                    component="span"
                                    level="body-sm"
                                    noWrap
                                    sx={{
                                        fontFamily: "monospace",
                                        display: "block",
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {subscription.requestedProjectTag}
                                </Typography>
                            </Tooltip>
                        </DetailRow>

                        <DetailRow label="Subscription ID">
                            <Typography component="span" level="body-xs" sx={{ fontFamily: "monospace" }}>
                                {subscription.uuid}
                            </Typography>
                        </DetailRow>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                        <Button variant="soft" size="sm" color="neutral" onClick={onClose}>
                            Close
                        </Button>
                    </Box>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}
