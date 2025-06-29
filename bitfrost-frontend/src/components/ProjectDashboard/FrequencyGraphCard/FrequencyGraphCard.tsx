import StatCard from "@/components/ProjectDashboard/StatCard/StatCard.tsx";
import { useMemo } from "react";

function getCountsPerDay(timestamps: number[], range: number) {
  // Create an array to store counts for each day (index 0 = today)
  const counts = Array(range + 1).fill(0);

  // Get today's start time in UTC (midnight)
  const now = new Date();

  timestamps.forEach((ts) => {
    // Convert Unix timestamp (in seconds or ms) to milliseconds if needed
    const timestampMs = ts < 1e12 ? ts * 1000 : ts;

    // Calculate how many days ago this timestamp was
    const diffMs = now.getTime() - new Date(timestampMs).setHours(0, 0, 0);
    const daysAgo = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    // If the timestamp falls within the specified range, increment the count
    if (daysAgo >= 0 && daysAgo < range + 1) {
      counts[daysAgo]++;
    }
  });

  return counts.reverse();
}

function getPastXDays(range: number) {
  return [...Array(range + 1).keys()].reverse().map((val) => {
    const day = new Date(Date.now());
    day.setDate(day.getDate() - val);
    return day;
  });
}

function formatDateToGerman(date: Date, excludeHours: boolean | undefined) {
  const pad = (num: number) => String(num).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}.${month}.${year} ${excludeHours ? `` : `${hours}:${minutes}`}`;
}

const FrequencyGraphCard = (props: {
  values: number[];
  title: string;
  dateRange: number;
  graphId: string;
  color: "success" | "error" | "warning" | "primary";
}) => {
  const frequencyCount = useMemo(
    () => getCountsPerDay(props.values, props.dateRange),
    [props.values],
  );
  const pastDays = useMemo(
    () => getPastXDays(props.dateRange),
    [props.dateRange],
  ).map((d) => formatDateToGerman(d, true));

  return (
    <StatCard
      title={props.title}
      value={props.values.length}
      interval={"Last " + props.dateRange + " days"}
      id={props.graphId}
      graphColor={props.color}
      data={frequencyCount}
      xAxis={pastDays}
    />
  );
};

export { formatDateToGerman };
export default FrequencyGraphCard;
