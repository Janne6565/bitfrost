import StatCard from "@/components/ProjectDashboard/StatCard/StatCard.tsx";
import { Grid } from "@mui/material";
import PieChartCard from "./PieChartCard/PieChartCard";
import { Box } from "@mui/joy";
import CustomizedDataGrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import {
  type Job,
  JobState,
  type Project,
  SubscriptionState,
} from "@/@types/backendTypes.ts";

function countOccurrences(array: any[]) {
  return array.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function formatDateToGerman(date: Date) {
  const pad = (num: number) => String(num).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const ProjectDashboard = (props: { project: Project }) => {
  const allMessages = useTypedSelector((state) => state.messageSlice.messages);
  const messages = useMemo(
    () =>
      Object.values(allMessages).filter(
        (message) => message.projectTag == props.project.projectTag,
      ),
    [allMessages],
  );
  const allTopics = useTypedSelector((state) => state.topicSlice.topics);
  const topics = useMemo(
    () =>
      Object.values(allTopics).filter(
        (topic) => topic.project == props.project.projectTag,
      ),
    [allTopics],
  );
  const allJobs = useTypedSelector((state) => state.jobSlice.jobs);
  const jobs = useMemo(
    () =>
      Object.values(allJobs).filter((jobs) =>
        topics.map((topic) => topic.uuid).includes(jobs.topicId),
      ),
    [allJobs],
  );
  const messageJobs = useMemo(() => {
    const result: { [key: string]: Job[] } = {};
    const messageIds = messages.map((message) => message.uuid);
    jobs.forEach((job) => {
      if (messageIds.includes(job.messageId)) {
        if (!(job.messageId in result)) {
          result[job.messageId] = [];
        }
        result[job.messageId].push(job);
      }
    });
    return result;
  }, [jobs, messages]);
  const allSubscriptions = useTypedSelector(
    (state) => state.subscriptionSlice.subscriptions,
  );
  const subscriptions = useMemo(
    () =>
      Object.values(allSubscriptions).filter(
        (subscription) =>
          subscription.requestedProjectTag == props.project.projectTag &&
          subscription.state == SubscriptionState.APPROVED,
      ),
    [allSubscriptions],
  );
  console.log(Object.values(allSubscriptions));
  const subscriptionCounts = useMemo(
    () =>
      Object.entries(
        countOccurrences(
          subscriptions.map((subscription) => subscription.topic),
        ),
      ).map((value) => ({ label: value[0], value: value[1] })),
    [subscriptions],
  );

  console.log(subscriptionCounts);

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
          <StatCard
            title={"Messages Published"}
            value={messages.length}
            interval={"Last 30 days"}
            id={"messages-send"}
            graphColor={"success"}
            data={[
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <StatCard
            title={"Jobs Executed"}
            value={
              jobs.filter(
                (job) =>
                  job.status == JobState.DONE || job.status == JobState.FAILED,
              ).length
            }
            interval={"Last 30 days"}
            id={"jobs-executed"}
            graphColor={"primary"}
            data={[
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <StatCard
            title={"Jobs Failed"}
            id={"errors-received"}
            value={jobs.filter((job) => job.status == JobState.FAILED).length}
            interval={"Last 30 days"}
            graphColor={"warning"}
            data={[
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ height: "400px" }}>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }} sx={{ height: "400px" }}>
          <CustomizedDataGrid
            columns={[
              {
                field: "messageContent",
                headerName: "Message",
                flex: 0.5,
              },
              {
                field: "publishedOn",
                headerName: "Published on",
                flex: 0.5,
                renderCell(value) {
                  return formatDateToGerman(
                    new Date(Date.parse(value.row.publishedOn)),
                  );
                },
              },
              {
                field: "successfulJobs",
                headerName: "Succeeded Jobs",
                flex: 0.5,
              },
              {
                field: "failedJobs",
                headerName: "Failed Jobs",
                flex: 0.5,
              },
              {
                field: "pendingJobs",
                headerName: "Pending Jobs",
                flex: 0.5,
              },
            ]}
            rows={messages.map((message) => ({
              id: message.uuid,
              messageContent: message.message,
              publishedOn: message.date,
              successfulJobs: (messageJobs[message.uuid] ?? []).filter(
                (job) => job.status == JobState.DONE,
              ).length,
              failedJobs: (messageJobs[message.uuid] ?? []).filter(
                (job) => job.status == JobState.FAILED,
              ).length,
              pendingJobs: (messageJobs[message.uuid] ?? []).filter(
                (job) => job.status == JobState.WAITING,
              ).length,
            }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ height: "400px" }}>
          <PieChartCard
            title={"Subscribers per Topic"}
            data={subscriptionCounts}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export { formatDateToGerman };
export default ProjectDashboard;
