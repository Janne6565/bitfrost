import { Typography, Sheet } from "@mui/joy";
import Box from "@mui/joy/Box";
import CustomCircularProgress from "@/components/CustomCircularProgress/CustomCircularProgress";
import SubscriptionCard from "./SubscriptionCard";
import useSubscriptionsList from "./UseSubscriptionList.tsx";

export default function SubscriptionsPage() {
    const { subs, loading, approve, remove } = useSubscriptionsList();

    return (
        <Sheet>
            <Typography level="h2" sx={{ mt: 2, mb: 2 }}>
                Subscriptions
            </Typography>

            {loading ? (
                <CustomCircularProgress size="lg" />
            ) : subs.length === 0 ? (
                <Typography>No subscriptions found.</Typography>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 2,
                    }}
                >
                    {subs.map((sub) => (
                        <SubscriptionCard
                            key={sub.uuid}
                            subscription={sub}
                            onDelete={remove}
                            onApprove={approve}
                        />
                    ))}
                </Box>
            )}
        </Sheet>
    );
}
