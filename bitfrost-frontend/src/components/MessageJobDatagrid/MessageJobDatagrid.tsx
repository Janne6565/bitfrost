import {
  type HttpExchangeLog,
  type Job,
  JobState,
  type Message,
} from "@/@types/backendTypes.ts";
import CustomDatagrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo, useState } from "react";
import { Chip, Tooltip, Typography } from "@mui/joy";
import HttpExchangeLogModal from "@/components/HttpExchangeLogModal/HttpExchangeLogModal.tsx";
import { OpenInNew } from "@mui/icons-material";

const MessageJobDatagrid = (props: { message: Message }) => {
  const jobs = useTypedSelector((state) => state.jobSlice.jobs);
  const [httpExchangeLogModalOpen, setHttpExchangeLogModalOpen] =
    useState(false);
  const [httpExchangeLogSelected, setHttpExchangeLogSelected] =
    useState<HttpExchangeLog | null>(null);
  const allJobs = useMemo(
    () =>
      Object.values(jobs).filter((job) => job.messageId == props.message.uuid),
    [jobs],
  );
  const subscriptions = useTypedSelector(
    (state) => state.subscriptionSlice.subscriptions,
  );

  return (
    <>
      <CustomDatagrid
        rows={allJobs.map((job) => ({ ...job, id: job.uuid }))}
        columns={[
          {
            headerName: "Receiver",
            renderCell(row) {
              const job = row.row as Job;
              return subscriptions[job.subscriptionId].requestingProjectTag;
            },
            field: "receiver",
            flex: 3,
          },
          {
            headerName: "Status",
            renderCell(row) {
              const job = row.row as Job;
              return (
                <Chip
                  sx={{ userSelect: "all" }}
                  color={
                    job.status == JobState.DONE
                      ? "success"
                      : job.status == JobState.WAITING
                        ? "warning"
                        : "danger"
                  }
                >
                  {job.status}
                </Chip>
              );
            },
            flex: 2,
            field: "jobState",
          },
          {
            headerName: "Http",
            renderCell(row) {
              const job = row.row as Job;
              const isSuccess =
                job.httpExchangeLog.statusCode >= 200 &&
                job.httpExchangeLog.statusCode < 300;
              return (
                <Tooltip title={"Click to see full Request/Response content"}>
                  <Chip
                    color={isSuccess ? "success" : "warning"}
                    onClick={() => {
                      setHttpExchangeLogModalOpen(true);
                      setHttpExchangeLogSelected(job.httpExchangeLog);
                    }}
                  >
                    <Typography
                      level={"body-md"}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {job.httpExchangeLog.statusCode}{" "}
                      <OpenInNew sx={{ height: "20px", pl: "2px" }} />
                    </Typography>
                  </Chip>
                </Tooltip>
              );
            },
            field: "httpLog",
            flex: 2,
          },
          {
            headerName: "Callback URL",
            renderCell(row) {
              const job = row.row as Job;
              return job.httpExchangeLog.uri;
            },
            field: "callbackUrl",
            flex: 4,
          },
          {
            headerName: "Retry Count",
            renderCell(row) {
              const job = row.row as Job;
              return job.retryCount;
            },
            field: "retryCount",
            flex: 2,
          },
        ]}
      />
      <HttpExchangeLogModal
        open={httpExchangeLogModalOpen}
        setOpen={setHttpExchangeLogModalOpen}
        httpExchangeLog={httpExchangeLogSelected}
      />
    </>
  );
};

export default MessageJobDatagrid;
