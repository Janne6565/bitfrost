import type { HttpExchangeLog } from "@/@types/backendTypes.ts";
import HttpExchangeLogHeader from "@/components/HttpExchangeLogHeader/HttpExchangeLogHeader.tsx";
import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import { Box, Button, Tooltip } from "@mui/joy";
import JsonSnippetBox from "@/components/JsonSnippetBox/JsonSnippetBox.tsx";
import { type ReactNode, useState } from "react";
import { Tab, Tabs } from "@mui/material";

function parseJsonWithFallback(jsonString: string, fallback?: string) {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return fallback ?? "Invalid JSON";
  }
}

/**
 * Builds a curl command from an HttpExchangeLog
 * @param log The HttpExchangeLog object
 * @returns A string representing the curl command
 */
function buildCurl(httpExchangeLog: HttpExchangeLog) {
  const method = httpExchangeLog.method.toUpperCase();
  const uri = httpExchangeLog.uri;

  // Parse JSON headers
  let headers: Record<string, string> = {};
  try {
    headers = JSON.parse(httpExchangeLog.requestHeadersJson);
  } catch {
    console.warn("Invalid requestHeadersJson, skipping headers.");
  }

  // Construct header part
  const headerString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(" ");

  // Add request body (only for POST, PUT, PATCH)
  const hasBody = ["POST", "PUT", "PATCH"].includes(method);
  const dataString = hasBody ? `--data '${httpExchangeLog.requestBody}'` : "";

  // Final curl command
  return `curl -X ${method} ${headerString} ${dataString} "${uri}"`.trim();
}

const CustomTabPanel = (props: {
  index: number;
  children: ReactNode;
  value: number;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const HttpExchangeLogModal = (props: {
  httpExchangeLog: HttpExchangeLog | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <GenericModal
      header={"Http Exchange Log"}
      open={props.open}
      setOpen={props.setOpen}
      modalDialogSX={{
        width: "60vw",
        height: "70vh",
        overflowY: "auto",
      }}
    >
      <HttpExchangeLogHeader httpExchangeLog={props.httpExchangeLog} />

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs
          value={selectedPage}
          onChange={(_e, newVal) => setSelectedPage(newVal)}
        >
          <Tab label={"Request"} />
          <Tab label={"Response"} />
        </Tabs>
        <Tooltip title={"Copy a CURL command to reproduce the event"}>
          <Button
            variant={"solid"}
            sx={{
              ml: "auto",
              height: "fit-content",
            }}
            onClick={() => {
              props.httpExchangeLog
                ? navigator.clipboard.writeText(
                    buildCurl(props.httpExchangeLog),
                  )
                : "Internal error";
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
            disabled={copied}
            color={copied ? "success" : "primary"}
          >
            {copied ? "Copied!" : "Copy as CURL"}
          </Button>
        </Tooltip>
      </Box>

      <CustomTabPanel index={0} value={selectedPage}>
        <JsonSnippetBox
          content={
            "// Request Headers: \n" +
            parseJsonWithFallback(
              props.httpExchangeLog?.requestHeadersJson ?? "{}",
            ) +
            "\n\n" +
            "// Request Body: \n" +
            parseJsonWithFallback(
              props.httpExchangeLog?.requestBody ?? "No Body found",
              props.httpExchangeLog?.requestBody,
            )
          }
          copyMode={false}
        />
      </CustomTabPanel>

      <CustomTabPanel index={1} value={selectedPage}>
        <JsonSnippetBox
          content={
            "// Response Headers: \n" +
            parseJsonWithFallback(
              props.httpExchangeLog?.responseHeadersJson ?? "{}",
              props.httpExchangeLog?.responseHeadersJson,
            ) +
            "\n\n" +
            "// Response Body: \n" +
            parseJsonWithFallback(
              props.httpExchangeLog?.responseBody ?? "No Body found",
              props.httpExchangeLog?.responseBody,
            )
          }
          copyMode={false}
        />
      </CustomTabPanel>
    </GenericModal>
  );
};

export default HttpExchangeLogModal;
