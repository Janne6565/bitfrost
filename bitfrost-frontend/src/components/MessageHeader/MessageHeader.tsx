import type { Message } from "@/@types/backendTypes.ts";
import { Box, Chip, Tooltip, Typography } from "@mui/joy";
import { formatDateToGerman } from "@/components/ProjectDashboard/FrequencyGraphCard/FrequencyGraphCard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { type ReactNode, useState } from "react";
import GenericHeaderComponent from "@/components/GenericHeaderComponent/GenericHeaderComponent.tsx";
import JsonModal from "@/components/JsonModal/JsonModal.tsx";

const MessageHeader = (props: { message: Message }) => {
  const [selectedMessagePayload, setSelectedMessagePayload] =
    useState<string>("");
  const [MessagePayloadModalOpen, setMessagePayloadModalOpen] = useState(false);
  const topicLookup = useTypedSelector((state) => state.topicSlice.topics);
  const columnMappings: {
    label: string;
    size: number;
    mapping: (message?: Message) => ReactNode;
  }[] = [
    {
      label: "Message",
      size: 4,
      mapping: (message) => (
        <Tooltip title={"Click to see full content"}>
          <Box
            sx={{
              width: "100%",
              alignItems: "center",
            }}
            onClick={() => {
              setMessagePayloadModalOpen(true);
              setSelectedMessagePayload(message ? message.message : "-");
            }}
          >
            <Chip
              sx={{
                width: "100%",
              }}
              color={"primary"}
            >
              <Typography
                noWrap
                sx={{
                  display: "block",
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                {message ? message.message : "-"}
              </Typography>
            </Chip>
          </Box>
        </Tooltip>
      ),
    },
    {
      label: "Birthdate",
      size: 3,
      mapping: (message) =>
        message
          ? formatDateToGerman(new Date(Date.parse(message.date)), false)
          : "-",
    },
    {
      label: "Project",
      size: 2,
      mapping: (message) => (message ? message.projectTag : "-"),
    },
    {
      label: "Topic",
      size: 2,
      mapping: (message) =>
        message
          ? topicLookup[message.topicId]
            ? topicLookup[message.topicId].label
            : "-"
          : "-",
    },
  ];

  return (
    <>
      <GenericHeaderComponent
        data={props.message}
        columnMappings={columnMappings}
      />
      <JsonModal
        header={"Message Payload Preview"}
        open={MessagePayloadModalOpen}
        setOpen={setMessagePayloadModalOpen}
        content={selectedMessagePayload}
      />
    </>
  );
};

export default MessageHeader;
