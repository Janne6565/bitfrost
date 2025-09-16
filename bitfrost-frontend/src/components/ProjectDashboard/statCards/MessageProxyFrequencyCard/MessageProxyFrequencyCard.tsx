import FrequencyGraphCard from "@/components/ProjectDashboard/FrequencyGraphCard/FrequencyGraphCard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import type { Job, Project } from "@/@types/backendTypes.ts";
import { filterPastXDays } from "@/components/ProjectDashboard/ProjectDashboard.tsx";

const MessageProxyFrequencyCard = (props: {
  dateRange: number;
  project: Project;
}) => {
  const allTopics = useTypedSelector((state) => state.topicSlice.topics);
  const allJobs = useTypedSelector((state) => state.jobSlice.jobs);
  const jobs = useMemo(
    () =>
      filterPastXDays(
        Object.values(allJobs).filter(
          (jobs) =>
            allTopics[jobs.topicId]?.project == props.project.projectTag,
        ),
        (job: Job) => new Date(job.earliestExecution),
        props.dateRange,
      ),
    [allJobs, allTopics, props.dateRange, props.project.projectTag],
  );

  return (
    <FrequencyGraphCard
      values={jobs.map((job) =>
        job.retryTimestamps.length > 0
          ? job.retryTimestamps[0]
          : job.earliestExecution,
      )}
      title={"Message Proxies"}
      dateRange={props.dateRange}
      graphId={"message-proxied"}
      color={"primary"}
    />
  );
};

export default MessageProxyFrequencyCard;
