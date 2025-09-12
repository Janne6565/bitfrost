import { Chip } from "@mui/joy";
import { SubscriptionState } from "@/@types/backendTypes";

export default function StatusChip({ state }: { state: SubscriptionState | string }) {
    const isRequested = state === SubscriptionState.REQUESTED || state === "REQUESTED";
    return (
        <Chip size="sm" variant="soft" color={isRequested ? "warning" : "primary"}>
            {state}
        </Chip>
    );
}
