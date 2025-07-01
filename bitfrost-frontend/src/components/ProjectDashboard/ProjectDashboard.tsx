import { Grid } from "@mui/material";
import { Box } from "@mui/joy";
import { type Message, type Project } from "@/@types/backendTypes.ts";
import MessageFrequencyCard from "@/components/ProjectDashboard/statCards/MessageFrequencyCard/MessageFrequencyCard.tsx";
import MessageProxyFrequencyCard from "@/components/ProjectDashboard/statCards/MessageProxyFrequencyCard/MessageProxyFrequencyCard.tsx";
import RetryFrequencyCard from "@/components/ProjectDashboard/statCards/RetryFrequencyCard/RetryFrequencyCard.tsx";
import MessageDatagrid from "@/components/ProjectDashboard/MessageDatagrid/MessageDatagrid.tsx";
import SubscriptionGraph from "@/components/ProjectDashboard/SubscriptionGraph/SubscriptionGraph.tsx";
import { useState } from "react";
import MessageModal from "@/components/MessageModal/MessageModal.tsx";

function countOccurrences(array: any[]) {
  return array.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function filterPastXDays<T>(
  data: T[],
  getDate: (item: T) => Date,
  range: number,
) {
  const minDate = new Date(Date.now());
  minDate.setDate(minDate.getDate() - range);
  minDate.setHours(0, 0, 0);
  return data.filter((item) => getDate(item).getTime() > minDate.getTime());
}

const ProjectDashboard = (props: { project: Project }) => {
  const dateRange = 7;
  const [messageOpened, setMessage] = useState<Message | null>(null);
  const [isMessageOpened, setIsMessageOpened] = useState(false);

  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        pb: "2rem",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <MessageFrequencyCard dateRange={dateRange} project={props.project} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <MessageProxyFrequencyCard
            dateRange={dateRange}
            project={props.project}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <RetryFrequencyCard dateRange={dateRange} project={props.project} />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ height: "400px" }}>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }} sx={{ height: "400px" }}>
          <MessageDatagrid
            project={props.project}
            dateRange={dateRange}
            onMessageClick={(message) => {
              setMessage(message);
              setIsMessageOpened(true);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ height: "400px" }}>
          <SubscriptionGraph project={props.project} />
        </Grid>
      </Grid>
      <MessageModal
        open={isMessageOpened}
        message={messageOpened!}
        setOpen={setIsMessageOpened}
      />
    </Box>
  );
};

export { countOccurrences, filterPastXDays };
export default ProjectDashboard;
