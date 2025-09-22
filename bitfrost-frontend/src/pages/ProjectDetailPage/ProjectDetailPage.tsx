import { Box, Typography, type TypographyProps } from "@mui/joy";
import { useNavigate, useParams } from "react-router";
import { ArrowBack, People, Settings, Style } from "@mui/icons-material";
import ProjectDashboard from "@/components/ProjectDashboard/ProjectDashboard.tsx";
import { useTypedSelector } from "@/stores/rootReducer.ts";
import { type ReactNode, useMemo, useState } from "react";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage.tsx";
import ProjectMembersModal from "@/components/ProjectMembersModal/ProjectMembersModal.tsx";
import Stack from "@mui/material/Stack";
import ProjectTopicsModal from "@/components/ProjectTopicsModal/ProjectTopicsModal.tsx";
import ProjectSetupModal from "@/components/ProjectSetupModal/ProjectSetupModal.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import DeletionModal from "@/components/DeletionModal/DeletionModal.tsx";

const ButtonDesign = (props: {
  children: ReactNode;
  onClick: () => void;
  sx?: TypographyProps["sx"];
  color?: TypographyProps["color"];
}) => (
  <Typography
    color={props.color}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderRadius: 10,
      padding: ".4rem .6rem",
      border: "1px solid rgba(0, 0, 0, 0.55)",
      cursor: "pointer",
      transition: "background ease .3s",
      userSelect: "none",
      ":active": {
        background: "rgba(0, 0, 0, 0.1)",
      },
      ...props.sx,
    }}
    onClick={() => props.onClick()}
  >
    {props.children}
  </Typography>
);

const ProjectDetailPage = () => {
  const { projectTag } = useParams() as { projectTag: string };
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [deletionModalOpen, setDeletionModalOpen] = useState(false);
  const allProjects = useTypedSelector(
    (state) => state.ownedProjectSlice.ownedProjects,
  );

  const project = useMemo(
    () => allProjects.filter((project) => project.projectTag == projectTag)[0],
    [allProjects, projectTag],
  );
  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexGrow: 1,
        px: "3rem",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          mt: 3.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ButtonDesign
          onClick={() => navigate("/")}
          color={"neutral"}
          sx={{
            border: "none",
            ":hover": { background: "rgba(0, 0, 0, 0.1)" },
            ":active": { background: "rgba(0, 0, 0, 0.15)" },
          }}
        >
          <ArrowBack /> Back to Projects
        </ButtonDesign>
        <Stack direction={"row"} gap={"15px"}>
          <ButtonDesign onClick={() => setTopicsOpen((prev) => !prev)}>
            <Style /> Project Topics
          </ButtonDesign>
          <ButtonDesign onClick={() => setSettingsOpen((prev) => !prev)}>
            <People /> Project Members
          </ButtonDesign>
          <ButtonDesign onClick={() => setSetupModalOpen((prev) => !prev)}>
            <Settings /> Setup Application
          </ButtonDesign>
          <ButtonDesign
            onClick={() => setDeletionModalOpen((prev) => !prev)}
            color={"danger"}
            sx={{ border: "red thin solid" }}
          >
            <DeleteIcon /> Delete Project
          </ButtonDesign>
        </Stack>
      </Box>
      <Typography level={"h1"} sx={{ mt: 2.5, mb: 1 }}>
        {project?.projectTag}
      </Typography>
      <Typography level={"h3"} color={"neutral"} sx={{ mb: 3 }}>
        {project?.description}
      </Typography>
      <ProjectDashboard project={project} />
      <ProjectMembersModal
        isOpen={settingsOpen}
        setOpen={setSettingsOpen}
        project={project}
      />
      <ProjectTopicsModal
        isOpen={topicsOpen}
        setOpen={setTopicsOpen}
        project={project}
      />
      <ProjectSetupModal
        isOpen={setupModalOpen}
        setOpen={setSetupModalOpen}
        project={project}
      />
      <DeletionModal
        isOpen={deletionModalOpen}
        setOpen={setDeletionModalOpen}
        project={project}
      />
    </Box>
  );
};

export default ProjectDetailPage;
