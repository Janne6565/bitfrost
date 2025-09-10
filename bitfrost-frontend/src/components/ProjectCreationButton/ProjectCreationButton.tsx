import { Button, type ButtonProps } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import ProjectCreationModal from "@/components/ProjectCreationButton/ProjectCreationModal.tsx";
import useApi from "@/hooks/useApi/useApi.ts";

const ProjectCreationButton = (props: { sx: ButtonProps["sx"] }) => {
  const [isCreationModalOpen, setCreationModalOpen] = useState<boolean>(false);
  const { createProject } = useApi();

  return (
    <>
      <Button sx={{ ...props.sx }} onClick={() => setCreationModalOpen(true)}>
        <Add />
        New Project
      </Button>
      <ProjectCreationModal
        submissionCallback={async (project) => {
          await createProject(project);
        }}
        isOpen={isCreationModalOpen}
        setOpen={setCreationModalOpen}
      />
    </>
  );
};

export default ProjectCreationButton;
