import { type Project, SubscriptionState } from "@/@types/backendTypes.ts";
import PieChartCard from "@/components/ProjectDashboard/PieChartCard/PieChartCard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo } from "react";
import { countOccurrences } from "@/components/ProjectDashboard/ProjectDashboard.tsx";

const SubscriptionGraph = (props: { project: Project }) => {
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
    <PieChartCard title={"Subscribers per Topic"} data={subscriptionCounts} />
  );
};

export default SubscriptionGraph;
