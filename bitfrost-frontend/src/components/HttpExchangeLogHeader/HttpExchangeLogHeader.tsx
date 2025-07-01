import type { HttpExchangeLog } from "@/@types/backendTypes.ts";
import GenericHeaderComponent from "@/components/GenericHeaderComponent/GenericHeaderComponent.tsx";
import type { ReactNode } from "react";
import { Chip } from "@mui/joy";
import { formatDateToGerman } from "@/components/ProjectDashboard/FrequencyGraphCard/FrequencyGraphCard.tsx";

const HttpExchangeLogHeader = (props: {
  httpExchangeLog: HttpExchangeLog | null;
}) => {
  const mappings: {
    label: string;
    size: number;
    mapping: (message?: HttpExchangeLog) => ReactNode;
  }[] = [
    {
      label: "Status",
      size: 2,
      mapping(message?: HttpExchangeLog): ReactNode {
        return (
          <Chip
            color={
              !message
                ? "neutral"
                : message?.statusCode >= 200 && message?.statusCode < 300
                  ? "success"
                  : "danger"
            }
          >
            {message?.statusCode}
          </Chip>
        );
      },
    },
    {
      label: "Method",
      size: 2,
      mapping: (message) => (message ? message.method : "-"),
    },
    {
      label: "URL",
      size: 4,
      mapping: (message) => (message ? message.uri : "-"),
    },
    {
      label: "Timestamp",
      size: 4,
      mapping: (message) =>
        message
          ? formatDateToGerman(new Date(Date.parse(message.timestamp)), false)
          : "-",
    },
  ];
  return (
    <GenericHeaderComponent
      data={props.httpExchangeLog}
      columnMappings={mappings}
    />
  );
};

export default HttpExchangeLogHeader;
