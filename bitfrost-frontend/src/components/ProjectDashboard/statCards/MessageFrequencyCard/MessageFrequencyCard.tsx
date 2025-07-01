import FrequencyGraphCard from "@/components/ProjectDashboard/FrequencyGraphCard/FrequencyGraphCard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import type { Message, Project } from "@/@types/backendTypes.ts";
import { filterPastXDays } from "@/components/ProjectDashboard/ProjectDashboard.tsx";

const MessageFrequencyCard = (props: {
  dateRange: number;
  project: Project;
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
      ),
    [allMessages],
  );

  return (
    <FrequencyGraphCard
      values={messages.map((message) => Date.parse(message.date))}
      title={"Messages published"}
      dateRange={props.dateRange}
      graphId={"messages-published"}
      color={"success"}
    />
  );
};

export default MessageFrequencyCard;
