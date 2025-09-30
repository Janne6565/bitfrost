import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import type { Project } from "@/@types/backendTypes.ts";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/joy";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { useCallback, useState } from "react";
import ProjectSubscribeModal from "@/components/SubscribeToProjectModal/SubscribeToProject.tsx";

const ProjectDetailModal = (props: {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  project: Project;
}) => {
  const topics = useTypedSelector((state) => state.topicSlice.topics);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const handleSubscribeButton = useCallback(
    (project: Project, origin: { x: number; y: number }) => {
      setSelectedProject(project);
      setOrigin(origin);
      setModalOpen(true);
    },
    [],
  );

  return (
    <>
      <GenericModal
        header={"Project Details"}
        open={props.open}
        setOpen={props.setOpen}
        modalDialogSX={{
          minWidth: "400px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Stack spacing={5} direction={"row"} alignItems={"center"}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography level={"h3"}>{props.project.projectTag}</Typography>
              <Typography level={"body-md"} sx={{ textAlign: "justify" }}>
                {props.project.description}
              </Typography>
            </Box>
            <Tooltip
              title={
                props.project.topics.length === 0
                  ? "No Topics to subscribe on "
                  : "Subscribe to project"
              }
              placement="top"
              enterDelay={800}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  handleSubscribeButton(props.project, {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
                }}
                size="lg"
                variant={props.project.topics.length === 0 ? "solid" : "soft"}
                className="rainbow-button"
                disabled={props.project.topics.length === 0}
                sx={{ minWidth: "160px" }}
              >
                Subscribe 🌈
              </Button>
            </Tooltip>
          </Stack>
          <Box>
            <Typography color={"neutral"} level={"body-sm"} sx={{ mb: "5px" }}>
              Topics:
            </Typography>
            <Box>
              {props.project.topics.length === 0 ? (
                <Typography>No topics found on this project</Typography>
              ) : (
                props.project.topics.map((topicUuid) => (
                  <Box sx={{ mb: "10px" }} key={topicUuid}>
                    <Typography key={topicUuid} level={"body-md"}>
                      {topics[topicUuid].label}
                    </Typography>
                    <Typography color={"neutral"} level={"body-sm"}>
                      {topics[topicUuid].description}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </GenericModal>
      <ProjectSubscribeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedProject}
        origin={origin}
      />
    </>
  );
};

export default ProjectDetailModal;
