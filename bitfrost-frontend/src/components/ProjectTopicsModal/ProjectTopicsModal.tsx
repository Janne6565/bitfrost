import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import type { Project } from "@/@types/backendTypes.ts";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useMemo, useState } from "react";
import { SubdirectoryArrowRight } from "@mui/icons-material";
import useApi from "@/hooks/useApi/useApi.ts";
import { enqueueSnackbar } from "notistack";
import TopicsDatagrid from "@/components/ProjectTopicsModal/TopicsDatagrid.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";

const ProjectTopicsModal = (props: {
  project: Project;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const { createNewTopic } = useApi();
  const { loadTopics } = useDataLoading();
  const topics = useTypedSelector((state) => state.topicSlice.topics);
  const filteredTopics = useMemo(() => {
    return Object.values(topics).filter(
      (topic) => topic.project === props.project.projectTag,
    );
  }, [topics, props.project.projectTag]);

  return (
    <>
      <GenericModal
        header={"Project Topics"}
        open={props.isOpen}
        setOpen={props.setOpen}
      >
        <FormControl>
          <FormLabel>
            <Typography color={"neutral"}>Add new topic:</Typography>
          </FormLabel>
          <Input
            placeholder={"user:creation"}
            onChange={(e) => setNewTopicName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter" && newTopicName !== "") {
                setIsDescriptionModalOpen(true);
              }
            }}
            endDecorator={
              <Tooltip title={"add description and submit"}>
                <Button
                  onClick={() => setIsDescriptionModalOpen(true)}
                  disabled={newTopicName === ""}
                  sx={{
                    transition: "background ease .3s",
                  }}
                >
                  <SubdirectoryArrowRight fontSize={"small"} />
                </Button>
              </Tooltip>
            }
          />
          {newTopicName.includes(" ") && (
            <Typography color={"danger"}>
              Topic name may not contain spaces
            </Typography>
          )}
        </FormControl>
        <TopicsDatagrid topics={filteredTopics} />
      </GenericModal>
      <GenericModal
        header={"Add Topic Description"}
        open={isDescriptionModalOpen}
        setOpen={setIsDescriptionModalOpen}
      >
        <FormControl>
          <FormLabel>Topic Description</FormLabel>
          <Textarea
            sx={{ height: "100px" }}
            placeholder={
              "This topic will be used to receive updates for the creation of users"
            }
            defaultValue={newTopicDescription}
            onChange={(e) => setNewTopicDescription(e.target.value)}
            error={newTopicDescription === ""}
          />
          {newTopicDescription === "" && (
            <Typography color={"danger"} level={"body-sm"}>
              Topic description may not be empty
            </Typography>
          )}
        </FormControl>
        <Button
          disabled={
            newTopicDescription === "" ||
            newTopicName === "" ||
            newTopicName.includes(" ")
          }
          onClick={() => {
            createNewTopic(props.project.projectTag, {
              label: newTopicName,
              description: newTopicDescription,
            }).then(async () => {
              await loadTopics();
              setIsDescriptionModalOpen(false);
              setNewTopicDescription("");
              enqueueSnackbar("Topic created successfully", {
                variant: "success",
              });
            });
          }}
        >
          Create Topic
        </Button>
      </GenericModal>
    </>
  );
};

export default ProjectTopicsModal;
