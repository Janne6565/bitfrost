import { useMemo, useState } from "react";
import { Button, Divider, Tooltip, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { Subscription } from "@/@types/backendTypes";
import { SubscriptionState } from "@/@types/backendTypes";
import SubscriptionDetailModal from "./SubscriptionDetailModal";
import SubscriptionApproveModal from "./SubscriptionApproveModal";
import SubscriptionDeleteModal from "./SubscriptionDeleteModal";
import StatusChip from "./StatusChip";
import { useTypedSelector } from "@/stores/rootReducer.ts";

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
  const ownedProjects = useTypedSelector(
    (state) => state.ownedProjectSlice.ownedProjects,
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const ownsRequestedProject = useMemo(() => {
    return ownedProjects.some(
      (project) => project.projectTag === subscription.requestedProjectTag,
    );
  }, [ownedProjects, subscription.requestedProjectTag]);

  const ownsRequestingProject = useMemo(() => {
    return ownedProjects.some(
      (project) => project.projectTag === subscription.requestingProjectTag,
    );
  }, [ownedProjects, subscription.requestingProjectTag]);

  const titleText = (
    <>
      <Tooltip
        title={
          subscription.requestingProjectTag +
          (ownsRequestingProject ? " (Your Project)" : "")
        }
      >
        <Typography color={ownsRequestingProject ? "primary" : undefined}>
          {subscription.requestingProjectTag}
        </Typography>
      </Tooltip>{" "}
      →{" "}
      <Tooltip
        title={
          subscription.requestedProjectTag +
          (ownsRequestedProject ? " (Your Project)" : "")
        }
      >
        <Typography color={ownsRequestedProject ? "primary" : undefined}>
          {subscription.requestedProjectTag}
        </Typography>
      </Tooltip>
    </>
  );

  return (
    <>
      <Card
        variant="outlined"
        size="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 140,
          p: 2,
          transition: "all 0.4s ease-in-out, box-shadow 0.2s",
          cursor: "pointer",
          gap: 1,
          "&:hover": {
            boxShadow: "md",
            borderColor: "neutral.outlinedHoverBorder",
            transform: "scale(1.01)",
          },
          pb: "8px",
        }}
        onClick={() => setOpenDetails(true)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            level="h4"
            noWrap
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {titleText}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
          <Typography level="body-sm">State:</Typography>
          <StatusChip state={subscription.state} />
        </Box>

        <Tooltip title={subscription.topicLabel}>
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
            Requested Topic:{" "}
            <Typography
              component="span"
              level="body-sm"
              noWrap
              sx={{ fontFamily: "monospace" }}
            >
              {subscription.topicLabel}
            </Typography>
          </Typography>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />
        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            alignItems: "center",
          }}
        >
          {ownsRequestedProject ? (
            isRequested && (
              <Tooltip title="Approve subscription" placement="top">
                <Button
                  size="sm"
                  variant="soft"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenApprove(true);
                  }}
                >
                  Approve
                </Button>
              </Tooltip>
            )
          ) : (
            <Typography level={"body-sm"} color={"neutral"} sx={{ pr: 1 }}>
              Waiting for Approval
            </Typography>
          )}
          <Tooltip title="Delete subscription" placement="top">
            <Button
              size="sm"
              variant="soft"
              color="danger"
              sx={{
                minWidth: 32,
                px: 1.5,
                fontSize: "0.75rem",
                borderRadius: "md",
              }}
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
