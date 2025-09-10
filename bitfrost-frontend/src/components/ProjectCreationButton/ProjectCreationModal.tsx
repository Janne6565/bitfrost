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

const ProjectCreationModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  submissionCallback: (project: Project) => Promise<void>;
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const checkValidity = useCallback(() => {
    return (
      projectName.length > 0 &&
      projectDescription.length > 0 &&
      !projectName.includes(" ")
    );
  }, [projectName, projectDescription]);
  const [isLoading, setLoading] = useState(false);

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
          placeholder={"User Service"}
          onChange={(e) => setProjectName(e.target.value.trim())}
          disabled={isLoading}
          error={projectName == "" || projectName.includes(" ")}
          defaultValue={projectName}
        />
        {projectName.includes(" ") && (
          <Typography color={"danger"} level={"body-sm"}>
            The project name may not contain spaces
          </Typography>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>Project Description</FormLabel>
        <Textarea
          placeholder={
            "A service for user management, here you will find all user events, including creation, deletion, and updates."
          }
          error={projectDescription == ""}
          sx={{ minHeight: "200px" }}
          onChange={(e) => setProjectDescription(e.target.value)}
          disabled={isLoading}
          defaultValue={projectDescription}
        />
        {projectDescription == "" && (
          <Typography color={"danger"} level={"body-sm"}>
            The Project Description may not be empty
          </Typography>
        )}
      </FormControl>
      <Button
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
              setLoading(false);
              setProjectName("");
              setProjectDescription("");
              props.setOpen(false);
            })
            .catch((e: Error) => {
              enqueueSnackbar(e.message, { variant: "error" });
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
