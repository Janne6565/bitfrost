import { Button, Tooltip, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import type { Project } from "@/@types/backendTypes";
import "./rainbowButton.css";
import { memo, useMemo, type JSX } from "react";
import ProjectCard from "./ProjectCard";
import CustomCircularProgress from "@/components/CustomCircularProgress/CustomCircularProgress.tsx";


interface ProjectGridProps {
  projects: Project[];
  onSubscribe: (project: Project, origin: { x: number; y: number }) => void;
  openDetailModal: (project: Project) => void;
  loading: boolean;
}



const ProjectGrid: React.FC<ProjectGridProps> = memo(({ projects, onSubscribe, openDetailModal, loading }: ProjectGridProps): JSX.Element => {

    const renderedProjectCards = useMemo(() => {
  return projects.map((project) => (
    <ProjectCard
      key={project.projectTag}
      project={project}
      onSubscribe={onSubscribe}
      openDetailModal={openDetailModal}
    />
  ));
}, [projects]);
  return (
    <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {loading ? (
    <CustomCircularProgress size="lg" />
  ) : projects.length === 0 ? (
    <Typography>No projects match your search.</Typography>
  ) : (
    renderedProjectCards
  )}
      </Box>
  );
});

export default ProjectGrid;