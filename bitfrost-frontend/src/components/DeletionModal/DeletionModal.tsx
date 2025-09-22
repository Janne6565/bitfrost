import GenericModal from "@/components/GenericModal/GenericModal.tsx";
import { Button, Typography } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import type { Project } from "@/@types/backendTypes.ts";
import useApi from "@/hooks/useApi/useApi.ts";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";

const DeletionModal = (props: {
  isOpen: boolean;
  setOpen: (newVal: boolean) => void;
  project: Project;
}) => {
  const { deleteProject } = useApi();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadProjects, loadOwnedProjects } = useDataLoading();
  const handleDelete = () => {
    setLoading(true);
    deleteProject(props.project.projectTag).then(() => {
      Promise.all([loadProjects(), loadOwnedProjects()]).then(() => {
        enqueueSnackbar("Project deleted successfully", { variant: "success" });
        props.setOpen(false);
        navigate("/");
        setLoading(false);
      });
    });
  };
  return (
    <GenericModal
      header={"Confirm Deletion"}
      open={props.isOpen}
      setOpen={props.setOpen}
    >
      <>
        <Stack direction={"column"} gap={"10px"} alignItems={"center"}>
          <Typography color={"neutral"} level={"body-md"}>
            Are you sure you want to <strong>delete this project</strong>?
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"space-evenly"}
            sx={{ width: "100%", mt: "10px" }}
          >
            <Button
              color={"neutral"}
              variant={"outlined"}
              onClick={() => props.setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color={"danger"}
              variant={"outlined"}
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isLoading ? "Loading..." : "Delete Project"}
            </Button>
          </Stack>
        </Stack>
      </>
    </GenericModal>
  );
};

export default DeletionModal;
