import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import type { Project } from "@/@types/backendTypes.ts";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Typography,
} from "@mui/joy";
import { useCallback, useState } from "react";
import { enqueueSnackbar } from "notistack";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";

const ProjectCreationModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  submissionCallback: (project: Project) => Promise<void>;
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { loadProjects, loadOwnedProjects } = useDataLoading();
  const checkValidity = useCallback(() => {
    return (
      projectName.length > 0 &&
      projectDescription.length > 0 &&
      !projectName.includes(" ")
    );
  }, [projectName, projectDescription]);
  const [isLoading, setLoading] = useState(false);
  const PROJECT_NAME_REGEX = /^[a-zA-Z0-9\-]*$/;
  const isProjectNameValid =
    PROJECT_NAME_REGEX.test(projectName) && projectName.length > 0;

  return (
    <GenericModal
      header={"Create new Project"}
      open={props.isOpen}
      setOpen={() => props.setOpen(false)}
      modalDialogSX={{ width: "350px" }}
    >
      <FormControl>
        <FormLabel>Project Name</FormLabel>
        <Input
          placeholder={"User-Service"}
          onChange={(e) => setProjectName(e.target.value.trim())}
          disabled={isLoading}
          error={!isProjectNameValid}
          defaultValue={projectName}
        />
        {!isProjectNameValid ? (
          <Typography color={"danger"} level={"body-xs"} sx={{ mt: 0.5 }}>
            The project name must only contain letters, numbers, or hyphens.
          </Typography>
        ) : (
          <Typography color={"neutral"} level={"body-xs"} sx={{ mt: 0.5 }}>
            Allowed: letters, numbers, hyphens. No spaces or special characters.
          </Typography>
        )}
      </FormControl>
      <FormControl sx={{ mt: 2 }}>
        <FormLabel>Project Description</FormLabel>
        <Textarea
          placeholder={
            "A service for user management, here you will find all user events, including creation, deletion, and updates."
          }
          error={projectDescription === ""}
          sx={{ minHeight: "200px" }}
          onChange={(e) => setProjectDescription(e.target.value)}
          disabled={isLoading}
          defaultValue={projectDescription}
        />
        {projectDescription === "" && (
          <Typography color={"danger"} level={"body-xs"} sx={{ mt: 0.5 }}>
            The Project Description may not be empty
          </Typography>
        )}
      </FormControl>

      <Button
        sx={{mt: 2}}
        disabled={!checkValidity() || isLoading}
        onClick={() => {
          setLoading(true);
          props
            .submissionCallback({
              projectTag: projectName,
              description: projectDescription,
              topics: [],
            })
            .then(() => {
              loadProjects().then(() => {
                loadOwnedProjects().then(() => {
                  enqueueSnackbar("Project created successfully", {
                    variant: "success",
                  });
                  props.setOpen(false);
                  setLoading(false);
                  setProjectName("");
                  setProjectDescription("");
                });
              });
            })
            .catch(() => {
              setLoading(false);
            });
        }}
      >
        {isLoading ? "Loading..." : "Create Project"}
      </Button>
    </GenericModal>
  );
};

export default ProjectCreationModal;
