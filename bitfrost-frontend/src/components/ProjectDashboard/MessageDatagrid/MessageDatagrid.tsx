import {
  type Job,
  JobState,
  type Message,
  type Project,
} from "@/@types/backendTypes.ts";
import { formatDateToGerman } from "@/components/ProjectDashboard/FrequencyGraphCard/FrequencyGraphCard.tsx";
import CustomizedDataGrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import { filterPastXDays } from "@/components/ProjectDashboard/ProjectDashboard.tsx";

const MessageDatagrid = (props: {
  project: Project;
  dateRange: number;
  onMessageClick?: (message: Message) => void;
}) => {
  const allMessages = useTypedSelector((state) => state.messageSlice.messages);
  const messages = useMemo(
    () =>
      filterPastXDays(
        Object.values(allMessages).filter(
          (message) => message.projectTag == props.project.projectTag,
        ),
        (message: Message) => new Date(Date.parse(message.date)),
        props.dateRange,
      ).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
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
        props.dateRange,
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

  return (
    <CustomizedDataGrid
      onRowClick={(e) =>
        props.onMessageClick
          ? props.onMessageClick(allMessages[e.row.id])
          : undefined
      }
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
        pendingJobs: (messageJobs[message.uuid] ?? []).filter(
          (job) => job.status == JobState.WAITING,
        ).length,
      }))}
    />
  );
};

export default MessageDatagrid;
