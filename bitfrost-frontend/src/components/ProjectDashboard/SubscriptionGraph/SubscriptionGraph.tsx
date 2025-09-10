import { type Project, SubscriptionState } from "@/@types/backendTypes.ts";
import PieChartCard from "@/components/ProjectDashboard/PieChartCard/PieChartCard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import { countOccurrences } from "@/components/ProjectDashboard/ProjectDashboard.tsx";

const SubscriptionGraph = (props: { project: Project }) => {
  const allSubscriptions = useTypedSelector(
    (state) => state.subscriptionSlice.subscriptions,
  );
  const topics = useTypedSelector((state) => state.topicSlice.topics);
  const subscriptions = useMemo(
    () =>
      Object.values(allSubscriptions).filter(
        (subscription) =>
          subscription.requestedProjectTag == props.project.projectTag &&
          subscription.state == SubscriptionState.APPROVED,
      ),
    [allSubscriptions, props.project.projectTag],
  );
  const subscriptionCounts = useMemo(() => {
    const result = Object.entries(
      countOccurrences(
        subscriptions.map((subscription) => subscription.topicLabel),
      ),
    ).map((value) => ({ label: value[0], value: value[1] as number }));

    Object.values(topics)
      .filter((topic) => topic.project == props.project.projectTag)
      .forEach((value) => {
        if (result.filter((entry) => entry.label == value.label).length == 0) {
          result.push({ label: value.label, value: 0 });
        }
      });

    return result;
  }, [props.project.projectTag, subscriptions, topics]);

  return (
    <PieChartCard title={"Subscribers per Topic"} data={subscriptionCounts} />
  );
};

export default SubscriptionGraph;
