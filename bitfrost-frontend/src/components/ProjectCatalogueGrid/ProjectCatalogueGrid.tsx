import { Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import type { Project } from "@/@types/backendTypes";
import "../SubscribeToProjectModal/rainbowButton.css";
import { type JSX, memo, useMemo } from "react";
import ProjectCard from "./ProjectCard.tsx";
import CustomCircularProgress from "@/components/CustomCircularProgress/CustomCircularProgress.tsx";

interface ProjectGridProps {
  projects: Project[];
  openDetailModal: (project: Project) => void;
  loading: boolean;
}

const ProjectGrid: React.FC<ProjectGridProps> = memo(
  ({
    projects,
    openDetailModal,
    loading,
  }: ProjectGridProps): JSX.Element => {
    const renderedProjectCards = useMemo(() => {
      return projects.map((project) => (
        <ProjectCard
          key={project.projectTag}
          project={project}
          openDetailModal={openDetailModal}
        />
      ));
    }, [openDetailModal, projects]);

    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: projects.length == 0 ? "center" : "flex-start",
          alignItems: projects.length == 0 ? "center" : "flex-start",
          pb: "10rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {loading ? (
          <CustomCircularProgress size="lg" />
        ) : projects.length === 0 ? (
          <Typography color={"neutral"} level={"h3"}>
            No Projects Found
          </Typography>
        ) : (
          renderedProjectCards
        )}
      </Box>
    );
  },
);

export default ProjectGrid;
