import { Grid } from "@mui/material";
import PieChartCard from "./PieChartCard/PieChartCard";
import { Box } from "@mui/joy";
import CustomizedDataGrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import {
  type Job,
  JobState,
  type Message,
  type Project,
  SubscriptionState,
} from "@/@types/backendTypes.ts";
import FrequencyGraphCard, {
  formatDateToGerman,
} from "@/components/ProjectDashboard/FrequencyGraphCard/FrequencyGraphCard.tsx";

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
  const allMessages = useTypedSelector((state) => state.messageSlice.messages);
  const messages = useMemo(
    () =>
      filterPastXDays(
        Object.values(allMessages).filter(
          (message) => message.projectTag == props.project.projectTag,
        ),
        (message: Message) => new Date(Date.parse(message.date)),
        dateRange,
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
      filterPastXDays(
        Object.values(allJobs).filter((jobs) =>
          topics.map((topic) => topic.uuid).includes(jobs.topicId),
        ),
        (job: Job) => new Date(job.earliestExecution),
        dateRange,
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
  const subscriptionCounts = useMemo(
    () =>
      Object.entries(
        countOccurrences(
          subscriptions.map((subscription) => subscription.topicLabel),
        ),
      ).map((value) => ({ label: value[0], value: value[1] as number })),
    [subscriptions],
  );

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
          <FrequencyGraphCard
            values={messages.map((message) => Date.parse(message.date))}
            title={"Messages published"}
            dateRange={dateRange}
            graphId={"messages-published"}
            color={"success"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <FrequencyGraphCard
            values={jobs.map((job) => job.earliestExecution)}
            title={"Message Proxies"}
            dateRange={dateRange}
            graphId={"message-proxied"}
            color={"primary"}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ height: "100%" }}>
          <FrequencyGraphCard
            values={jobs.map((job) => job.retryTimestamps).flat()}
            title={"Retry count"}
            dateRange={dateRange}
            graphId={"retry-count"}
            color={"error"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ height: "400px" }}>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }} sx={{ height: "400px" }}>
          <CustomizedDataGrid
            columns={[
              {
                field: "publishedOn",
                headerName: "Published on",
                flex: 0.5,
                renderCell(value) {
                  return formatDateToGerman(
                    new Date(Date.parse(value.row.publishedOn)),
                    false,
                  );
                },
              },
              {
                field: "topic",
                headerName: "Topic",
                flex: 0.5,
              },
              {
                field: "messageContent",
                headerName: "Message",
                flex: 0.7,
              },

              {
                field: "successfulJobs",
                headerName: "Succeeded Jobs",
                flex: 0.3,
              },
              {
                field: "failedJobs",
                headerName: "Failed Jobs",
                flex: 0.3,
              },
              {
                field: "pendingJobs",
                headerName: "Pending Jobs",
                flex: 0.3,
              },
            ]}
            rows={messages.map((message) => ({
              id: message.uuid,
              topic: allTopics[message.topicId].label,
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

export default ProjectDashboard;
