import { Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import SubscriptionCard from "./SubscriptionCard";
import useSubscriptionsList from "./useSubscriptionList.tsx";

const SubscriptionsPage = () => {
  const { subs, approve, remove } = useSubscriptionsList();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexGrow: 1,
        px: "3rem",
        flexDirection: "column",
      }}
    >
      <Typography level={"h1"} sx={{ mt: 3, mb: 3 }}>
        Subscriptions
      </Typography>

      {subs.length === 0 ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pb: "10rem",
          }}
        >
          <Typography color={"neutral"} level={"h3"}>
            No subscriptions
          </Typography>
        </Box>
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
    </Box>
  );
};

export default SubscriptionsPage;
