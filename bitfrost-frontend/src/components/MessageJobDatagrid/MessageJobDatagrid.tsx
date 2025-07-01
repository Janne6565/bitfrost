import {
  type HttpExchangeLog,
  type Job,
  JobState,
  type Message,
} from "@/@types/backendTypes.ts";
import CustomizedDataGrid from "@/components/ProjectDashboard/CustomDatagrid/CustomDatagrid.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useMemo, useState } from "react";
import { Chip, Tooltip } from "@mui/joy";
import HttpExchangeLogModal from "@/components/HttpExchangeLogModal/HttpExchangeLogModal.tsx";

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
      <CustomizedDataGrid
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
          {
            headerName: "Http Exchange Log",
            renderCell(row) {
              const job = row.row as Job;
              const isSuccess =
                job.httpExchangeLog.statusCode >= 200 &&
                job.httpExchangeLog.statusCode < 300;
              return (
                <Tooltip title={"Click to see full content"}>
                  <Chip
                    color={isSuccess ? "success" : "warning"}
                    onClick={() => {
                      setHttpExchangeLogModalOpen(true);
                      setHttpExchangeLogSelected(job.httpExchangeLog);
                    }}
                  >
                    {job.httpExchangeLog.statusCode} {"<ResponseBody>"}
                  </Chip>
                </Tooltip>
              );
            },
            field: "httpLog",
            flex: 3.5,
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
