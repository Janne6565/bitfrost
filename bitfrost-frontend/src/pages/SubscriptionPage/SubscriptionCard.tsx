import { useState } from "react";
import { Typography, Button, Tooltip, Divider, IconButton } from "@mui/joy";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { Subscription } from "@/@types/backendTypes";
import { SubscriptionState } from "@/@types/backendTypes";
import SubscriptionDetailModal from "./SubscriptionDetailModal";
import SubscriptionApproveModal from "./SubscriptionApproveModal";
import SubscriptionDeleteModal from "./SubscriptionDeleteModal";
import StatusChip from "./StatusChip";

type SubscriptionCardProps = {
    subscription: Subscription;
    onDelete?: (uuid: string) => void;
    onApprove?: (uuid: string) => void;
};

const SubscriptionCard = ({
                              subscription,
                              onDelete,
                              onApprove,
                          }: SubscriptionCardProps) => {
    const isRequested = subscription.state === SubscriptionState.REQUESTED;
    const [openDetails, setOpenDetails] = useState(false);
    const [openApprove, setOpenApprove] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const titleText = `${subscription.requestingProjectTag} → ${subscription.requestedProjectTag}`;

    return (
        <>
            <Card
                variant="outlined"
                size="lg"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 180,
                    p: 2,
                    gap: 1,
                    "&:hover": {
                        boxShadow: "md",
                        borderColor: "neutral.outlinedHoverBorder",
                        transform: "scale(1.01)",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Tooltip title={titleText}>
                        <Typography
                            level="h4"
                            noWrap
                            sx={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                            {titleText}
                        </Typography>
                    </Tooltip>

                    <Tooltip title="Show Details" placement="top">
                        <IconButton
                            variant="plain"
                            size="sm"
                            aria-label="Show Details"
                            onClick={() => setOpenDetails(true)}
                            sx={{ borderRadius: "50%", minWidth: 28, minHeight: 28, fontWeight: 600, flexShrink: 0 }}
                        >
                            i
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                    <Typography level="body-sm">State:</Typography>
                    <StatusChip state={subscription.state} />
                </Box>

                <Tooltip title={subscription.requestedProjectTag}>
                    <Typography
                        level="body-sm"
                        noWrap
                        sx={{
                            mt: 0.25,
                            display: "block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Requested Tag:{" "}
                        <Typography component="span" level="body-sm" noWrap sx={{ fontFamily: "monospace" }}>
                            {subscription.requestedProjectTag}
                        </Typography>
                    </Typography>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }} />
                <Divider />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1 }}>
                    {isRequested && (
                        <Tooltip title="Approve subscription" placement="top">
                            <Button
                                size="sm"
                                variant="soft"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenApprove(true);
                                }}
                            >
                                Approve
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip title="Delete subscription" placement="top">
                        <Button
                            size="sm"
                            variant="soft"
                            color="danger"
                            sx={{ minWidth: 32, px: 1.5, fontSize: "0.75rem", borderRadius: "md" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDelete(true);
                            }}
                        >
                            ✕
                        </Button>
                    </Tooltip>
                </Box>
            </Card>

            {/* Modals */}
            <SubscriptionDetailModal
                open={openDetails}
                onClose={() => setOpenDetails(false)}
                subscription={subscription}
            />

            <SubscriptionApproveModal
                open={openApprove}
                onClose={() => setOpenApprove(false)}
                onConfirm={() => {
                    onApprove && onApprove(subscription.uuid);
                    setOpenApprove(false);
                }}
                subscription={subscription}
            />

            <SubscriptionDeleteModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => {
                    onDelete && onDelete(subscription.uuid);
                    setOpenDelete(false);
                }}
                subscription={subscription}
            />
        </>
    );
};

export default SubscriptionCard;
